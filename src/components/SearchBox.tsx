import React, { useRef, useState } from "react";
import SearchServiceClient from "../services/SearchServiceClient";
import { SearchResult } from "../types";
import CompletionsList from "./CompletionsList";
import classNames from "classnames";
import "./SearchBox.scss";

type SearchBoxProps = {
  onGetResults: (results: SearchResult[] | null) => void;
};

function SearchBox(props: SearchBoxProps) {
  const { onGetResults } = props;
  const searchService = useRef(SearchServiceClient());

  const [completions, setCompletions] = useState<Set<string>>(new Set());
  const [hideCompletions, setHideCompletions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchHistory, setSearchHistory] = useState<Record<string, boolean>>(
    {}
  );

  const onSearch = (term: string) => {
    if (term === "") return;
    onSearchBoxBlurred();
    inputRef.current?.blur();
    onGetResults(null);
    searchService.current.search(term).then((r) => {
      if (!searchHistory[term.toLowerCase()]) {
        setSearchHistory((prev) => ({
          ...prev,
          [term.toLowerCase()]: true,
        }));
        setCompletions((prev) => prev.add(term.toLowerCase()));
      }
      onGetResults(r);
    });
  };

  const onType = async (value: string) => {
    const matchingFromHistory = Object.keys(searchHistory).filter(
      (key) => searchHistory[key] === true && key.startsWith(value)
    );
    if (value === "") {
      setCompletions(new Set(matchingFromHistory));
      return;
    }
    const autoCompleteResults = (
      await searchService.current.complete(value)
    ).map((searchResult) => searchResult.title);

    setCompletions(new Set([...matchingFromHistory, ...autoCompleteResults]));
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const onSearchBoxBlurred = () => {
    setHideCompletions(true);
  };

  const onInputFocused = () => {
    setHideCompletions(false);
  };

  // Reverse is in order to display latest entry first
  const completionsAsArray = Array.from(completions).reverse();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      if (completions && selectedIndex === -1) {
        setSelectedIndex(completionsAsArray.length - 1);
      } else {
        setSelectedIndex(selectedIndex - 1);
      }
    } else if (e.key === "ArrowDown") {
      if (completions && selectedIndex === completionsAsArray.length - 1) {
        setSelectedIndex(-1);
      } else {
        setSelectedIndex(selectedIndex + 1);
      }
    }
  };

  const boxClassNames = classNames("searchbox-container", {
    "searchbox-container-results-displayed": Boolean(
      !hideCompletions && completionsAsArray.length > 0
    ),
  });

  return (
    <div className="searchbox-locator">
      <div onKeyDown={handleKeyDown} className={boxClassNames}>
        <>
          <input
            onBlur={() => onSearchBoxBlurred()}
            ref={inputRef}
            onFocus={onInputFocused}
            autoFocus={true}
            type="text"
            className="searchbox-input"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearch((e.target as HTMLInputElement).value);
              }
            }}
            onInput={(e) => {
              onType((e.target as HTMLInputElement).value);
            }}
          />
          {!hideCompletions && (
            <CompletionsList
              items={completionsAsArray}
              searchHistory={searchHistory}
              onItemClicked={(term) => {
                if (inputRef?.current) {
                  inputRef.current.value = term;
                }
                onSearch(term);
              }}
              onItemHovered={(i: number) => setSelectedIndex(i)}
              selectedIndex={selectedIndex}
            />
          )}
        </>
      </div>
    </div>
  );
}

export default SearchBox;
