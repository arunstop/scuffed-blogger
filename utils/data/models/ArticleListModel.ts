import { ArticleModel } from "./ArticleModel";

export interface ArticleListModel {
    id:string;  
  title: string;
  dateAdded: number;
  dateUpdated: number;
  status: "DELETED" | "PRIVATE" | "PUBLIC";
  articles: ArticleModel[];
}
