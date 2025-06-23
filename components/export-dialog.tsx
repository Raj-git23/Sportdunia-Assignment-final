"use client"

import type { NewsArticle, PayoutCalculation } from "@/types"
import { PayoutService } from "@/services/payout-service"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, Table } from "lucide-react"

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  articles: NewsArticle[]
  payouts: PayoutCalculation[]
}

export function ExportDialog({ open, onOpenChange, articles, payouts }: ExportDialogProps) {
  const exportToCSV = () => {
    const csvContent = PayoutService.exportToCSV(payouts)
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "payout-report.csv"
    a.click()
    window.URL.revokeObjectURL(url)
    onOpenChange(false)
  }

  const exportToPDF = () => {
    // In a real application, you would use a library like jsPDF
    const content = `
Payout Report
Generated: ${new Date().toLocaleDateString()}

${payouts
  .map(
    (p) =>
      `Author: ${p.author}
  Articles: ${p.articleCount}
  Rate: $${p.rate.toFixed(2)}
  Total: $${p.totalPayout.toFixed(2)}
  `,
  )
  .join("\n")}

Total Payout: $${payouts.reduce((sum, p) => sum + p.totalPayout, 0).toFixed(2)}
    `

    const blob = new Blob([content], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "payout-report.txt"
    a.click()
    window.URL.revokeObjectURL(url)
    onOpenChange(false)
  }

  const exportArticlesToCSV = () => {
    const headers = ["Title", "Author", "Type", "Published Date", "Source"]
    const rows = articles.map((a) => [
      a.title,
      a.author,
      a.type,
      new Date(a.publishedAt).toLocaleDateString(),
      a.source.name,
    ])

    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "articles-report.csv"
    a.click()
    window.URL.revokeObjectURL(url)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
          <DialogDescription>Choose the format and data type you want to export</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <Button onClick={exportArticlesToCSV} className="justify-start">
              <Table className="h-4 w-4 mr-2" />
              Export Articles to CSV
            </Button>

            <Button onClick={exportToCSV} className="justify-start">
              <Table className="h-4 w-4 mr-2" />
              Export Payouts to CSV
            </Button>

            <Button onClick={exportToPDF} className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Export Payout Report (Text)
            </Button>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Note: In a production environment, you would integrate with:</p>
            <ul className="list-disc list-inside mt-1">
              <li>jsPDF for proper PDF generation</li>
              <li>Google Sheets API for direct sheet export</li>
              <li>Advanced CSV formatting libraries</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
