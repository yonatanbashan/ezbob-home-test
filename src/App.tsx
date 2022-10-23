import React, { useState } from "react";
import "./App.css";
import Container from "./components/Container";
import ResultsList from "./components/ResultsList";
import SearchBox from "./components/SearchBox";
import { SearchResult } from "./types";

function App() {
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [searchTime, setSearchTime] = useState<number | null>(null);

  return (
    <div className="App">
      <Container>
        <div className="title">SearchX</div>
        <SearchBox
          onGetResults={(searchResults, time) => {
            setResults(searchResults);
            if (time) {
              setSearchTime(time);
            }
          }}
        />
        {results && searchTime && (
          <div className="search-details">
            {results.length} results ({searchTime} seconds)
          </div>
        )}
        {results && <ResultsList results={results} />}
      </Container>
    </div>
  );
}

export default App;
