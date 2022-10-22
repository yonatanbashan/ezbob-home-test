export type SearchResult = {
  title: string;
  url: string;
  description?: string;
};

export type SearchHistory = Record<string, boolean>;
