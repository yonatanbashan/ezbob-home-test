import { SearchResult } from "../types";

type ResultsListProps = {
  results: SearchResult[];
};

function ResultsList(props: ResultsListProps) {
  const { results } = props;

  return (
    <div>
      {results.map((item, i) => {
        return (
          <div key={`${item}_${i}`}>
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
