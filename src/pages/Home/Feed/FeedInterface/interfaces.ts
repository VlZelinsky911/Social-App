export interface NewsArticle {
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
	publishedAt: string;
  likes: number;
  comments: number;
}
