import { SearchResult } from "../types";
import "./ResultsList.scss";

type ResultsListProps = {
  results: SearchResult[];
};

function ResultsList(props: ResultsListProps) {
  const { results } = props;

  return (
    <div className="resultslist-container">
      {results.map((item, i) => {
        const origin = new URL(item.url).origin;
        return (
          <div className="item" key={`${item}_${i}`}>
            <a className="header" href={item.url}>
              <div className="origin">{origin}</div>
              <h3 className="title">{item.title}</h3>
            </a>
            <div className="description">{item.description}</div>
          </div>
        );
      })}
    </div>
  );
}

export default ResultsList;
