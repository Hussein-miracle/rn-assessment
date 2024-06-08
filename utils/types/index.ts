
export type NewsItem = {
  author: string | null;
  title: string;
  content: string;
  description: string;
  publishedAt: string;
  url: string;
  urlToImage: string | null;
  source:{
    id: string | null;
    name: string;
  }
};


export type NewsResponse = {
  status: string;
  totalResults: number;
  articles: NewsItem[];
  message?: string;
};


export type NewsCategory = "business" | "entertainment" | "general" | "health" | "science" | "sports" | "technology";

export type NewsCategoryItem = {
    label: string;
    value: NewsCategory;
}
