import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LogOut, Search, Download, Filter, RefreshCcw, Calendar, User, FileText, Edit2, Save, X, TrendingUp, DollarSign, Clock } from "lucide-react"

// Types
interface GuardianArticle {
  id: string
  webTitle: string
  webUrl: string
  fields?: {
    headline?: string
    byline?: string
    trailText?: string
    thumbnail?: string
  }
  webPublicationDate: string
  sectionName: string
  pillarName?: string
  type: string
}

interface NewsArticle {
  id: string
  title: string
  description: string
  author: string
  publishedAt: string
  type: string
  section: string
  pillar?: string
  url: string
  thumbnail?: string
}

interface FilterOptions {
  type: string
  searchQuery: string
  author?: string
  section?: string
  dateFrom?: string
  dateTo?: string
}

interface PayoutCalculation {
  author: string
  articleCount: number
  totalPayout: number
  rate: number
}

export default function Dashboard() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([])
  const [displayedArticles, setDisplayedArticles] = useState<NewsArticle[]>([])
  const [payouts, setPayouts] = useState<PayoutCalculation[]>([])
  const [editingPayout, setEditingPayout] = useState<string | null>(null)
  const [editingRate, setEditingRate] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [articlesPerPage] = useState(10)
  const [filters, setFilters] = useState<FilterOptions>({
    type: "all",
    searchQuery: "",
  })
  const [isAdmin, setIsAdmin] = useState(true)

  // Guardian API configuration
  const GUARDIAN_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY || ""
  const GUARDIAN_BASE_URL = process.env.NEXT_PUBLIC_ENDPOINT || ""

  useEffect(() => {
    loadNews()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [articles, filters])

  useEffect(() => {
    updateDisplayedArticles()
  }, [filteredArticles, currentPage])

  useEffect(() => {
    if (isAdmin) {
      calculatePayouts()
    }
  }, [filteredArticles, isAdmin])

  const loadNews = async () => {
    try {
      setLoading(true)
      setError("")
      
      const params = new URLSearchParams({
        'api-key': GUARDIAN_API_KEY,
        'show-fields': 'headline,byline,trailText,thumbnail',
        'page-size': '50',
        'order-by': 'newest'
      })

      const response = await fetch(`${GUARDIAN_BASE_URL}/search?${params}`)
      
      if (!response.ok) {
        throw new Error(`Guardian API error: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.response && data.response.results) {
        const transformedArticles: NewsArticle[] = data.response.results.map((article: GuardianArticle) => ({
          id: article.id,
          title: article.fields?.headline || article.webTitle,
          description: article.fields?.trailText || `Article from ${article.sectionName} section`,
          author: article.fields?.byline || `${article.sectionName} Team`,
          publishedAt: article.webPublicationDate,
          type: article.type === 'article' ? 'news' : 'blog',
          section: article.sectionName,
          pillar: article.pillarName,
          url: article.webUrl,
          thumbnail: article.fields?.thumbnail
        }))
        
        setArticles(transformedArticles)
        setCurrentPage(1)
      } else {
        throw new Error('No articles found in response')
      }
    } catch (err) {
      console.error('Error loading news:', err)
      setError(`Failed to load news data: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...articles]

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.author.toLowerCase().includes(query) ||
          article.description.toLowerCase().includes(query) ||
          article.section.toLowerCase().includes(query)
      )
    }

    if (filters.author && filters.author !== "all") {
      filtered = filtered.filter(
        (article) => article.author === filters.author
      )
    }

    if (filters.section && filters.section !== "all") {
      filtered = filtered.filter(
        (article) => article.section === filters.section
      )
    }

    if (filters.type && filters.type !== "all") {
      filtered = filtered.filter((article) => article.type === filters.type)
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(
        (article) =>
          new Date(article.publishedAt) >= new Date(filters.dateFrom!)
      )
    }

    if (filters.dateTo) {
      filtered = filtered.filter(
        (article) => new Date(article.publishedAt) <= new Date(filters.dateTo!)
      )
    }

    setFilteredArticles(filtered)
    setCurrentPage(1)
  }

  const updateDisplayedArticles = () => {
    const endIndex = currentPage * articlesPerPage
    setDisplayedArticles(filteredArticles.slice(0, endIndex))
  }

  const loadMore = () => {
    setLoadingMore(true)
    setTimeout(() => {
      setCurrentPage(prev => prev + 1)
      setLoadingMore(false)
    }, 500)
  }

  const calculatePayouts = () => {
    const authorCounts: { [key: string]: number } = {}
    
    filteredArticles.forEach(article => {
      authorCounts[article.author] = (authorCounts[article.author] || 0) + 1
    })

    const payoutData: PayoutCalculation[] = Object.entries(authorCounts).map(([author, count]) => {
      // Check if we have a custom rate for this author
      const existingPayout = payouts.find(p => p.author === author)
      const rate = existingPayout ? existingPayout.rate : 50
      
      return {
        author,
        articleCount: count,
        rate,
        totalPayout: count * rate
      }
    })

    setPayouts(payoutData)
  }

  const startEditingPayout = (author: string, currentRate: number) => {
    setEditingPayout(author)
    setEditingRate(currentRate)
  }

  const savePayoutEdit = () => {
    setPayouts(prev => prev.map(payout => 
      payout.author === editingPayout 
        ? { ...payout, rate: editingRate, totalPayout: payout.articleCount * editingRate }
        : payout
    ))
    setEditingPayout(null)
    setEditingRate(0)
  }

  const cancelPayoutEdit = () => {
    setEditingPayout(null)
    setEditingRate(0)
  }

  const uniqueAuthors = [...new Set(articles.map((a) => a.author))]
  const uniqueSections = [...new Set(articles.map((a) => a.section))]
  const totalPayout = payouts.reduce((sum, p) => sum + p.totalPayout, 0)
  const avgPayoutPerArticle = filteredArticles.length > 0 ? totalPayout / filteredArticles.length : 0
  const hasMoreArticles = displayedArticles.length < filteredArticles.length

  // Calculate time-based metrics
  const todayArticles = filteredArticles.filter(article => {
    const articleDate = new Date(article.publishedAt)
    const today = new Date()
    return articleDate.toDateString() === today.toDateString()
  }).length

  const weekArticles = filteredArticles.filter(article => {
    const articleDate = new Date(article.publishedAt)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return articleDate >= weekAgo
  }).length

  const exportData = () => {
    const exportObj = {
      articles: filteredArticles,
      payouts: payouts,
      metrics: {
        totalArticles: filteredArticles.length,
        totalPayout,
        avgPayoutPerArticle,
        uniqueAuthors: uniqueAuthors.length,
        uniqueSections: uniqueSections.length,
        todayArticles,
        weekArticles
      }
    }
    const dataStr = JSON.stringify(exportObj, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'guardian-news-export.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Admin Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      <div className="w-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <CardContent className="pt-6">
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
              <Button onClick={loadNews} className="mt-2" variant="outline" size="sm">
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredArticles.length}</div>
              <p className="text-xs text-muted-foreground">
                {articles.length - filteredArticles.length > 0 &&
                  `${articles.length - filteredArticles.length} filtered out`}
              </p>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{todayArticles}</div>
              <p className="text-xs text-muted-foreground">Articles today</p>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{weekArticles}</div>
              <p className="text-xs text-muted-foreground">Articles this week</p>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Authors</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueAuthors.length}</div>
              <p className="text-xs text-muted-foreground">Unique writers</p>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sections</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueSections.length}</div>
              <p className="text-xs text-muted-foreground">Categories</p>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Payout</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${avgPayoutPerArticle.toFixed(0)}
              </div>
              <p className="text-xs text-muted-foreground">Per article</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 lg:mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <div className="relative sm:col-span-2 lg:col-span-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search articles..."
                  value={filters.searchQuery || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      searchQuery: e.target.value,
                    }))
                  }
                  className="pl-10"
                />
              </div>

              <Select
                value={filters.author || "all"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    author: value === "all" ? undefined : value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Authors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Authors</SelectItem>
                  {uniqueAuthors.slice(0, 20).map((author) => (
                    <SelectItem key={author} value={author}>
                      {author.length > 30 ? `${author.substring(0, 30)}...` : author}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.section || "all"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    section: value === "all" ? undefined : value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Sections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  {uniqueSections.map((section) => (
                    <SelectItem key={section} value={section}>
                      {section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="date"
                placeholder="From Date"
                value={filters.dateFrom || ""}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))
                }
              />

              <Input
                type="date"
                placeholder="To Date"
                value={filters.dateTo || ""}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, dateTo: e.target.value }))
                }
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ type: "all", searchQuery: "" })}
              >
                Clear Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportData}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Admin Payout Section */}
        {isAdmin && payouts.length > 0 && (
          <Card className="mb-6 lg:mb-8">
            <CardHeader>
              <CardTitle>Editable Payout Management</CardTitle>
              <CardDescription>
                Total calculated payout:{" "}
                <span className="font-bold text-lg text-green-600">
                  ${totalPayout.toFixed(2)}
                </span>
                {" "}across {payouts.length} authors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Author</th>
                      <th className="text-left p-3 font-semibold">Articles</th>
                      <th className="text-left p-3 font-semibold">Rate ($/article)</th>
                      <th className="text-left p-3 font-semibold">Total Payout</th>
                      <th className="text-left p-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.slice(0, 15).map((payout) => (
                      <tr key={payout.author} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="p-3 font-medium max-w-xs">
                          <div className="truncate" title={payout.author}>
                            {payout.author}
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline">{payout.articleCount}</Badge>
                        </td>
                        <td className="p-3">
                          {editingPayout === payout.author ? (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={editingRate}
                                onChange={(e) => setEditingRate(Number(e.target.value))}
                                className="w-20 h-8"
                                min="0"
                                step="0.01"
                              />
                            </div>
                          ) : (
                            <span className="font-mono">${payout.rate}</span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-green-600">
                            ${editingPayout === payout.author ? 
                              (payout.articleCount * editingRate).toFixed(2) : 
                              payout.totalPayout.toFixed(2)
                            }
                          </span>
                        </td>
                        <td className="p-3">
                          {editingPayout === payout.author ? (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={savePayoutEdit}
                                className="h-8 px-2"
                              >
                                <Save className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={cancelPayoutEdit}
                                className="h-8 px-2"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => startEditingPayout(payout.author, payout.rate)}
                              className="h-8 px-2"
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {payouts.length > 15 && (
                <p className="text-sm text-gray-500 mt-3">
                  Showing top 15 authors. {payouts.length - 15} more in export.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Articles List with Load More */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Articles ({displayedArticles.length} of {filteredArticles.length})</span>
              <div className="flex gap-2">
                <Badge variant="outline">{articles.length} total</Badge>
                {hasMoreArticles && (
                  <Badge variant="secondary">More available</Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {displayedArticles.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No articles match your current filters.
                </div>
              ) : (
                <>
                  {displayedArticles.map((article) => (
                    <div
                      key={article.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                        {article.thumbnail && (
                          <img 
                            src={article.thumbnail} 
                            alt={article.title}
                            className="w-full lg:w-24 h-32 lg:h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                            <h3 className="font-semibold text-lg leading-tight">
                              <a 
                                href={article.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:text-blue-600 dark:hover:text-blue-400"
                              >
                                {article.title}
                              </a>
                            </h3>
                            <div className="flex gap-2 flex-shrink-0">
                              <Badge variant="outline" className="text-xs">
                                {article.section}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm leading-relaxed">
                            {article.description}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs text-gray-500 dark:text-gray-400 gap-1">
                            <span className="font-medium">By {article.author}</span>
                            <span>
                              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {hasMoreArticles && (
                    <div className="text-center pt-6">
                      <Button 
                        onClick={loadMore} 
                        disabled={loadingMore}
                        variant="outline"
                        size="lg"
                      >
                        {loadingMore ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                            Loading...
                          </>
                        ) : (
                          <>
                            Load More ({filteredArticles.length - displayedArticles.length} remaining)
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}