import React from "react";
import "./App.css";
import Container from "./components/Container";
import SearchBox from "./components/SearchBox";

function App() {
  return (
    <div className="App">
      <Container>
        <div className="title">SearchX</div>
        <SearchBox />
      </Container>
    </div>
  );
}

export default App;
