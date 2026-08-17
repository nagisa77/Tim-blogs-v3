export type Article = {
  title: string;
  date: string;
  excerpt: string;
  path: string;
  sha: string;
  sourceUrl: string;
};

export type ArticleSnapshot = {
  syncedAt: string;
  articles: Article[];
};

export type FocusId = "threadlight" | "openisle" | "blues" | "articles" | "github" | "wechat";
