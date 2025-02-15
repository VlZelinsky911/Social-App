export interface NewsArticle {
  title: string;
  description: string;
  author?: string;
  likes?: number;
  comments?: number;
  url: string;
  urlToImage: string;
}
