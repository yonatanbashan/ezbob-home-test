import React, { useMemo, useRef, useState } from "react";
import SearchServiceClient from "../services/SearchServiceClient";
import { SearchResult } from "../types";
import CompletionsList from "./CompletionsList";
import classNames from "classnames";
import "./SearchBox.scss";
import SearchIcon from "./path/SearchIcon";

type SearchBoxProps = {
  // Callback to retrieve search result
  onGetResults: (results: SearchResult[] | null, searchTime?: number) => void;
};

function SearchBox(props: SearchBoxProps) {
  const { onGetResults } = props;

  const searchService = useMemo(() => SearchServiceClient(), []);

  const latestSearch = useRef<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  const [completions, setCompletions] = useState<Set<string>>(new Set());
  const [displayCompletions, setDisplayCompletions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchHistory, setSearchHistory] = useState<Record<string, boolean>>(
    {}
  );

  const onSearch = async (term: string) => {
    if (term === "") return;
    onSearchBoxBlurred();
    inputRef.current?.blur();
    onGetResults(null);
    const start = Date.now();
    const searchResults = await searchService.search(term);

    if (!searchHistory[term.toLowerCase()]) {
      setSearchHistory((prev) => ({
        ...prev,
        [term.toLowerCase()]: true,
      }));
      setCompletions((prev) => prev.add(term.toLowerCase()));
    }

    onGetResults(searchResults, (Date.now() - start) / 1000);
  };

  const onType = async (value: string) => {
    const matchesFromHistory = Object.keys(searchHistory)
      .filter((key) => searchHistory[key] === true && key.startsWith(value))
      // Reverse is in order to display latest entries first
      .reverse();

    latestSearch.current = value;
    if (value === "") {
      setCompletions(new Set(matchesFromHistory));
      return;
    }

    const autoCompleteResults = (await searchService.complete(value)).map(
      (searchResult) => searchResult.title
    );

    // To avoid updating on a stale request
    if (latestSearch.current === value) {
      setCompletions(new Set([...matchesFromHistory, ...autoCompleteResults]));
    }
  };

  const onSearchBoxBlurred = () => {
    setDisplayCompletions(false);
  };

  const onInputFocused = () => {
    setDisplayCompletions(true);
  };

  const completionsAsArray = Array.from(completions);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Determine a new index of selected completion item
    let newSelectedIndex = selectedIndex;
    switch (e.key) {
      case "ArrowUp":
        newSelectedIndex =
          selectedIndex === -1
            ? completionsAsArray.length - 1
            : selectedIndex - 1;
        break;
      case "ArrowDown":
        newSelectedIndex =
          selectedIndex === completionsAsArray.length - 1
            ? -1
            : selectedIndex + 1;
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
      inputRef.current.value = completionsAsArray[newSelectedIndex];
      inputRef.current.focus();
    }
  };

  const deleteTermFromHistory = (term: string) => {
    setSearchHistory((prev) => ({
      ...prev,
      [term.toLowerCase()]: false,
    }));
    setCompletions((prev) => {
      prev.delete(term.toLowerCase());
      return prev;
    });
  };

  const boxClassNames = classNames("searchbox-container", {
    "results-displayed": Boolean(
      displayCompletions && completionsAsArray.length > 0
    ),
  });

  return (
    <div className="searchbox-positioner">
      <div
        onMouseLeave={() => setSelectedIndex(-1)}
        onKeyDown={handleKeyDown}
        className={boxClassNames}
      >
        <>
          <div className="search-row">
            <SearchIcon />
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
          </div>
          {displayCompletions && (
            <CompletionsList
              items={completionsAsArray}
              searchHistory={searchHistory}
              onItemClicked={(term) => {
                if (inputRef?.current) {
                  inputRef.current.value = term;
                }
                onSearch(term);
              }}
              onItemDeleted={deleteTermFromHistory}
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
