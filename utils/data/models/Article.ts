export interface ArticleModel {
  title: string;
  desc: string;
  thumbnail: string;
  content: string;
  author: string;
  dateAdded: number;
  dateUpdated: number;
  duration: number;
  tags: string[];
  deleted: number;
  community?: string;
}
