export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  img?: string
}

export interface NewsArticle {
  id: string
  title: string
  author: string
  publishedAt: string
  description: string
  url: string
  urlToImage?: string
  source: {
    id: string
    name: string
  }
  type: "news" | "blog"
}

export interface PayoutRate {
  author: string
  ratePerArticle: number
}

export interface PayoutCalculation {
  author: string
  articleCount: number
  rate: number
  totalPayout: number
}

export interface FilterOptions {
  author?: string
  dateFrom?: string
  dateTo?: string
  type?: "news" | "blog" | "all"
  searchQuery?: string
}
