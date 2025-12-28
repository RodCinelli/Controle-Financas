"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Receipt, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Transaction } from "../types"
import { EditTransactionModal } from "./edit-transaction-modal"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  columnFilters?: ColumnFiltersState
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void
  pageSize?: number
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
  columnFilters = [],
  onColumnFiltersChange,
  pageSize = 8,
}: DataTableProps<TData, TValue>) {
  "use no memo"
  
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [internalFilters, setInternalFilters] = useState<ColumnFiltersState>(columnFilters)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  })

  // Use external or internal filter state
  const filters = onColumnFiltersChange ? columnFilters : internalFilters
  const setFilters = onColumnFiltersChange || setInternalFilters

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table is intentionally used here
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: (updater) => {
      const newFilters = typeof updater === 'function' ? updater(filters) : updater
      setFilters(newFilters)
      // Reset to first page when filtering
      setPagination(prev => ({ ...prev, pageIndex: 0 }))
    },
    onPaginationChange: setPagination,
    state: {
      columnFilters: filters,
      pagination,
    },
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

  const currentPage = table.getState().pagination.pageIndex + 1
  const totalPages = table.getPageCount()
  const totalRows = table.getFilteredRowModel().rows.length

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
        
        {/* Pagination Controls */}
        {totalRows > pageSize && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/30">
            <div className="text-sm text-muted-foreground">
              Mostrando{" "}
              <span className="font-medium text-foreground">
                {pagination.pageIndex * pageSize + 1}
              </span>
              {" "}a{" "}
              <span className="font-medium text-foreground">
                {Math.min((pagination.pageIndex + 1) * pageSize, totalRows)}
              </span>
              {" "}de{" "}
              <span className="font-medium text-foreground">{totalRows}</span>
              {" "}transações
            </div>
            
            <div className="flex items-center gap-1">
              {/* First Page */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 disabled:opacity-50"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsLeft className="h-4 w-4" />
                <span className="sr-only">Primeira página</span>
              </Button>
              
              {/* Previous Page */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 disabled:opacity-50"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Página anterior</span>
              </Button>
              
              {/* Page Numbers */}
              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first, last, current, and adjacent pages
                  const showPage = 
                    page === 1 || 
                    page === totalPages || 
                    Math.abs(page - currentPage) <= 1
                  
                  const showEllipsis = 
                    (page === 2 && currentPage > 3) ||
                    (page === totalPages - 1 && currentPage < totalPages - 2)
                  
                  if (showEllipsis && !showPage) {
                    return (
                      <span 
                        key={page} 
                        className="px-1 text-muted-foreground"
                      >
                        ...
                      </span>
                    )
                  }
                  
                  if (!showPage) return null
                  
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "ghost"}
                      size="sm"
                      className={
                        currentPage === page
                          ? "h-8 w-8 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md"
                          : "h-8 w-8 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                      }
                      onClick={() => table.setPageIndex(page - 1)}
                    >
                      {page}
                    </Button>
                  )
                })}
              </div>
              
              {/* Next Page */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 disabled:opacity-50"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Próxima página</span>
              </Button>
              
              {/* Last Page */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 disabled:opacity-50"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <ChevronsRight className="h-4 w-4" />
                <span className="sr-only">Última página</span>
              </Button>
            </div>
          </div>
        )}
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
