"use client"

import { useState } from "react"
import type { PayoutCalculation } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Edit, Check, X, DollarSign, User, FileText, Calculator } from "lucide-react"

interface PayoutTableProps {
  payouts: PayoutCalculation[]
  onUpdateRate: (author: string, rate: number) => void
}

export function PayoutTable({ payouts, onUpdateRate }: PayoutTableProps) {
  const [editingAuthor, setEditingAuthor] = useState<string | null>(null)
  const [editRate, setEditRate] = useState<number>(0)

  const startEdit = (author: string, currentRate: number) => {
    setEditingAuthor(author)
    setEditRate(currentRate)
  }

  const saveEdit = () => {
    if (editingAuthor) {
      onUpdateRate(editingAuthor, editRate)
      setEditingAuthor(null)
    }
  }

  const cancelEdit = () => {
    setEditingAuthor(null)
    setEditRate(0)
  }

  return (
    <Card className="mb-8 w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg md:text-xl">Payout Details</CardTitle>
      </CardHeader>
      <CardContent className="px-3 md:px-6">
        {/* Mobile Card Layout */}
        <div className="block md:hidden space-y-4">
          {payouts.map((payout) => (
            <Card key={payout.author} className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{payout.author}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Articles:</span>
                    <span className="font-medium">{payout.articleCount}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Rate:</span>
                    {editingAuthor === payout.author ? (
                      <Input
                        type="number"
                        value={editRate}
                        onChange={(e) => setEditRate(Number(e.target.value))}
                        className="w-20 h-8 text-sm"
                        step="0.01"
                        min="0"
                      />
                    ) : (
                      <span className="font-medium">${payout.rate.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-semibold text-lg">
                      $
                      {editingAuthor === payout.author
                        ? (payout.articleCount * editRate).toFixed(2)
                        : payout.totalPayout.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {editingAuthor === payout.author ? (
                      <>
                        <Button size="sm" onClick={saveEdit} className="h-8 w-8 p-0">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit} className="h-8 w-8 p-0">
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(payout.author, payout.rate)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px]">Author</TableHead>
                <TableHead className="text-center min-w-[120px]">Article Count</TableHead>
                <TableHead className="text-center min-w-[140px]">Rate per Article</TableHead>
                <TableHead className="text-center min-w-[120px]">Total Payout</TableHead>
                <TableHead className="text-center min-w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((payout) => (
                <TableRow key={payout.author}>
                  <TableCell className="font-medium">{payout.author}</TableCell>
                  <TableCell className="text-center">{payout.articleCount}</TableCell>
                  <TableCell className="text-center">
                    {editingAuthor === payout.author ? (
                      <Input
                        type="number"
                        value={editRate}
                        onChange={(e) => setEditRate(Number(e.target.value))}
                        className="w-24 mx-auto"
                        step="0.01"
                        min="0"
                      />
                    ) : (
                      `$${payout.rate.toFixed(2)}`
                    )}
                  </TableCell>
                  <TableCell className="font-semibold text-center">
                    $
                    {editingAuthor === payout.author
                      ? (payout.articleCount * editRate).toFixed(2)
                      : payout.totalPayout.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    {editingAuthor === payout.author ? (
                      <div className="flex gap-2 justify-center">
                        <Button size="sm" onClick={saveEdit} className="h-8 w-8 p-0">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit} className="h-8 w-8 p-0">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(payout.author, payout.rate)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
