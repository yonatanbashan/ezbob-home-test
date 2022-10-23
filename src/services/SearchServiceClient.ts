import { SearchResult } from "../types";

type SearchService = {
  complete: (term: string) => Promise<SearchResult[]>;
  search: (term: string) => Promise<SearchResult[]>;
};

export default function SearchServiceClient(): SearchService {
  const getAllResults = async () => {
    const response = await fetch("mock-data/mock-search-db.json");

    // This promise is only for mocking the network response time
    await new Promise<void>((resolve) => {
      const waitTime = Math.random() * 200;
      setTimeout(() => {
        resolve();
      }, waitTime);
    });

    return (await response.json()).items as SearchResult[];
  };

  return {
    complete: async (term: string) => {
      const allResults = await getAllResults();
      return allResults
        .filter((result) =>
          result.title.toLowerCase().startsWith(term.toLowerCase())
        )
        .map((item) => ({ ...item, title: item.title.toLowerCase() }));
    },
    search: async (term: string) => {
      const allResults = await getAllResults();
      return allResults
        .filter((result) =>
          result.title.toLowerCase().includes(term.toLowerCase())
        )
        .map((item) => ({ ...item, title: item.title }));
    },
  };
}
