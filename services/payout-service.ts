import type { PayoutRate, PayoutCalculation, NewsArticle } from "@/types"

export class PayoutService {
  private static STORAGE_KEY = "payout-rates"

  static getPayoutRates(): PayoutRate[] {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(this.STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  }

  static savePayoutRates(rates: PayoutRate[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(rates))
  }

  static updatePayoutRate(author: string, rate: number): void {
    const rates = this.getPayoutRates()
    const existingIndex = rates.findIndex((r) => r.author === author)

    if (existingIndex >= 0) {
      rates[existingIndex].ratePerArticle = rate
    } else {
      rates.push({ author, ratePerArticle: rate })
    }

    this.savePayoutRates(rates)
  }

  static calculatePayouts(articles: NewsArticle[]): PayoutCalculation[] {
    const rates = this.getPayoutRates()
    const authorCounts = articles.reduce(
      (acc, article) => {
        acc[article.author] = (acc[article.author] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(authorCounts).map(([author, count]) => {
      const rate = rates.find((r) => r.author === author)?.ratePerArticle || 0
      return {
        author,
        articleCount: count,
        rate,
        totalPayout: count * rate,
      }
    })
  }

  static exportToCSV(payouts: PayoutCalculation[]): string {
    const headers = ["Author", "Article Count", "Rate per Article", "Total Payout"]
    const rows = payouts.map((p) => [p.author, p.articleCount, p.rate, p.totalPayout])

    return [headers, ...rows].map((row) => row.join(",")).join("\n")
  }
}
