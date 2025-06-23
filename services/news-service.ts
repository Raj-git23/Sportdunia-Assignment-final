import type { NewsArticle } from "@/types"

// Mock news data since we can't use real API keys in this demo
export const mockNewsData: NewsArticle[] = [
  {
    id: "1",
    title: "Breaking: Tech Innovation Reaches New Heights",
    author: "John Smith",
    publishedAt: "2024-01-15T10:00:00Z",
    description: "Latest developments in technology sector show promising growth.",
    url: "https://example.com/article1",
    urlToImage: "/placeholder.svg?height=200&width=300",
    source: { id: "tech-news", name: "Tech News" },
    type: "news",
  },
  {
    id: "2",
    title: "Market Analysis: Q4 Performance Review",
    author: "Sarah Johnson",
    publishedAt: "2024-01-14T15:30:00Z",
    description: "Comprehensive analysis of market performance in the last quarter.",
    url: "https://example.com/article2",
    urlToImage: "/placeholder.svg?height=200&width=300",
    source: { id: "market-watch", name: "Market Watch" },
    type: "blog",
  },
  {
    id: "3",
    title: "Climate Change Impact on Global Economy",
    author: "Michael Brown",
    publishedAt: "2024-01-13T09:15:00Z",
    description: "How climate change is affecting economic policies worldwide.",
    url: "https://example.com/article3",
    urlToImage: "/placeholder.svg?height=200&width=300",
    source: { id: "global-news", name: "Global News" },
    type: "news",
  },
  {
    id: "4",
    title: "AI Revolution in Healthcare",
    author: "Dr. Emily Davis",
    publishedAt: "2024-01-12T14:20:00Z",
    description: "Artificial Intelligence is transforming healthcare delivery.",
    url: "https://example.com/article4",
    urlToImage: "/placeholder.svg?height=200&width=300",
    source: { id: "health-tech", name: "Health Tech" },
    type: "blog",
  },
  {
    id: "5",
    title: "Cryptocurrency Market Trends",
    author: "John Smith",
    publishedAt: "2024-01-11T11:45:00Z",
    description: "Analysis of recent cryptocurrency market movements.",
    url: "https://example.com/article5",
    urlToImage: "/placeholder.svg?height=200&width=300",
    source: { id: "crypto-news", name: "Crypto News" },
    type: "news",
  },
]

export class NewsService {
  static async fetchNews(): Promise<NewsArticle[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real application, you would fetch from News API:
    // const response = await fetch(`https://newsapi.org/v2/everything?q=technology&apiKey=${API_KEY}`);
    // const data = await response.json();
    // return data.articles.map(article => ({ ...article, type: 'news' }));

    return mockNewsData
  }

  static async searchNews(query: string): Promise<NewsArticle[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockNewsData.filter(
      (article) =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.description.toLowerCase().includes(query.toLowerCase()) ||
        article.author.toLowerCase().includes(query.toLowerCase()),
    )
  }
}
