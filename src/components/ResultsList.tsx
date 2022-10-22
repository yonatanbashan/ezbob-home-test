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
        return (
          <div className="resultslist-item" key={`${item}_${i}`}>
            <a className="resultslist-title" href={item.url}>
              {item.title}
            </a>
            <div className="resultslist-description">{item.description}</div>
          </div>
        );
      })}
    </div>
  );
}

export default ResultsList;
