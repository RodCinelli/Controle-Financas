"use client"

import { useState } from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Receipt } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import type { Transaction } from "../types"
import { EditTransactionModal } from "./edit-transaction-modal"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

// Helper to get row type for transactions
function getRowType(row: unknown): 'income' | 'expense' | null {
  if (row && typeof row === 'object' && 'type' in row) {
    return (row as { type: 'income' | 'expense' }).type
  }
  return null
}

// Check if row is a Transaction
function isTransaction(row: unknown): row is Transaction {
  return row !== null && 
    typeof row === 'object' && 
    'id' in row && 
    'type' in row && 
    'amount' in row
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  "use no memo"
  
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table is intentionally used here
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const handleRowClick = (row: TData, e: React.MouseEvent) => {
    // Don't open modal if clicking on the delete button
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('[role="dialog"]')) {
      return
    }
    
    if (isTransaction(row)) {
      setSelectedTransaction(row)
      setEditModalOpen(true)
    }
  }

  return (
    <>
      <Card className="border-2 shadow-lg overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50 hover:bg-muted/50">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="font-semibold text-foreground">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const rowType = getRowType(row.original)
                const hoverClass = rowType === 'income' 
                  ? 'hover:bg-emerald-50 dark:hover:bg-emerald-950/30' 
                  : rowType === 'expense'
                  ? 'hover:bg-red-50 dark:hover:bg-red-950/30'
                  : 'hover:bg-muted/50'
                
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`transition-colors cursor-pointer ${hoverClass}`}
                    onClick={(e) => handleRowClick(row.original, e)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                    <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center">
                      <Receipt className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Nenhuma transação encontrada</p>
                      <p className="text-sm">Adicione sua primeira transação para começar</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Edit Modal */}
      {selectedTransaction && (
        <EditTransactionModal
          transaction={selectedTransaction}
          open={editModalOpen}
          onOpenChange={(open) => {
            setEditModalOpen(open)
            if (!open) setSelectedTransaction(null)
          }}
        />
      )}
    </>
  )
}


