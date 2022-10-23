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
    const matchesFromHistory = Object.keys(searchHistory).filter(
      (key) => searchHistory[key] === true && key.startsWith(value)
    );
    if (value === "") {
      setCompletions(new Set(matchesFromHistory));
      return;
    }
    const autoCompleteResults = (
      await searchService.current.complete(value)
    ).map((searchResult) => searchResult.title);

    setCompletions(new Set([...matchesFromHistory, ...autoCompleteResults]));
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
    // Determine a new index of selected completion item
    let newSelectedIndex = selectedIndex;
    switch (e.key) {
      case "ArrowUp":
        if (selectedIndex === -1) {
          newSelectedIndex = completionsAsArray.length - 1;
        } else {
          newSelectedIndex = selectedIndex - 1;
        }
        break;
      case "ArrowDown":
        if (selectedIndex === completionsAsArray.length - 1) {
          newSelectedIndex = -1;
        } else {
          newSelectedIndex = selectedIndex + 1;
        }
        break;
      default:
        break;
    }
    setSelectedIndex(newSelectedIndex);

    // Update input content when using keyboard to navigate completions
    if (
      newSelectedIndex !== -1 &&
      newSelectedIndex !== selectedIndex &&
      inputRef?.current !== null &&
      completionsAsArray[newSelectedIndex] !== inputRef?.current?.value
    ) {
      console.log(newSelectedIndex);
      inputRef.current.value = completionsAsArray[newSelectedIndex];
      inputRef.current.focus();
    }
  };

  const boxClassNames = classNames("searchbox-container", {
    "searchbox-container-results-displayed": Boolean(
      !hideCompletions && completionsAsArray.length > 0
    ),
  });

  return (
    <div className="searchbox-locator">
      <div
        onMouseLeave={() => setSelectedIndex(-1)}
        onKeyDown={handleKeyDown}
        className={boxClassNames}
      >
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
