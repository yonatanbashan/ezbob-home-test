import React, { useEffect, useRef, useState } from "react";
import SearchServiceClient from "../services/SearchServiceClient";
import { SearchResult } from "../types";
import CompletionsList from "./CompletionsList";
import "./SearchBox.css";

function SearchBox() {
  const searchService = useRef(SearchServiceClient());

  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [hideCompletions, setHideCompletions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const onSearchBoxBlurred = () => {
    setHideCompletions(true);
  };

  const onInputFocused = () => {
    setHideCompletions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      if (results && selectedIndex === -1) {
        setSelectedIndex(results.length - 1);
      } else {
        setSelectedIndex(selectedIndex - 1);
      }
    } else if (e.key === "ArrowDown") {
      if (results && selectedIndex === results.length - 1) {
        setSelectedIndex(-1);
      } else {
        setSelectedIndex(selectedIndex + 1);
      }
    }
  };

  useEffect(() => {
    searchService.current.search("a").then((r) => setResults(r));
  }, []);

  return (
    <div
      onBlur={onSearchBoxBlurred}
      onKeyDown={handleKeyDown}
      className={`searchbox-container${
        !hideCompletions && results?.length
          ? " searchbox-container-results-displayed"
          : ""
      }`}
    >
      <>
        <input
          onFocus={onInputFocused}
          autoFocus={true}
          type="text"
          className="searchbox-input"
        />
        {!hideCompletions && (
          <CompletionsList
            items={results}
            onItemClicked={() => {
              /* placeholder */
            }}
            onItemHovered={(i: number) => setSelectedIndex(i)}
            selectedIndex={selectedIndex}
          />
        )}
      </>
    </div>
  );
}

export default SearchBox;
