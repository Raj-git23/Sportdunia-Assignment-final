"use client"

import type { NewsArticle } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface NewsChartProps {
  articles: NewsArticle[]
}

export function NewsChart({ articles }: NewsChartProps) {
  // Data for author chart
  const authorData = articles.reduce(
    (acc, article) => {
      acc[article.author] = (acc[article.author] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const authorChartData = Object.entries(authorData).map(([author, count]) => ({
    author: author.split(" ")[0], // First name only for better display
    count,
  }))

  // Data for type chart
  const typeData = articles.reduce(
    (acc, article) => {
      acc[article.type] = (acc[article.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const typeChartData = Object.entries(typeData).map(([type, count]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    count,
  }))

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  return (
    <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg md:text-xl">Articles by Author</CardTitle>
          <CardDescription className="text-sm">Number of articles per author</CardDescription>
        </CardHeader>
        <CardContent className="px-3 md:px-6">
          <ChartContainer
            config={{
              count: {
                label: "Articles",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[250px] md:h-[300px] lg:h-[350px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={authorChartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="author"
                  fontSize={12}
                  tick={{ fontSize: 10 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis fontSize={12} tick={{ fontSize: 10 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg md:text-xl">Content Type Distribution</CardTitle>
          <CardDescription className="text-sm">Distribution of news vs blog posts</CardDescription>
        </CardHeader>
        <CardContent className="px-3 md:px-6">
          <ChartContainer
            config={{
              count: {
                label: "Count",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[250px] md:h-[300px] lg:h-[350px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, count }) => {
                    // Hide labels on very small screens
                    if (window.innerWidth < 640) return ""
                    return `${type}: ${count}`
                  }}
                  outerRadius="70%"
                  fill="#8884d8"
                  dataKey="count"
                >
                  {typeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
