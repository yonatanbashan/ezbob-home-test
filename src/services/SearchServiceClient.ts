import { SearchResult } from "../types";

type SearchService = {
  search: (term: string) => Promise<SearchResult[]>;
};

export default function SearchServiceClient(): SearchService {
  return {
    search: async (term: string) => {
      const allResults = (await fetch("mock-data/mock-search-db.json").then(
        async (response) => {
          return (await response.json()).items;
        }
      )) as SearchResult[];
      return allResults.filter((result) =>
        result.title.toLowerCase().startsWith(term.toLowerCase())
      );
    },
  };
}
