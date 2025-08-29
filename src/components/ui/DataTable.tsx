import React from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from 'lucide-react';
import { clsx } from 'clsx';

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  searchable?: boolean;
  sortable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  emptyMessage?: string;
  className?: string;
  rowClassName?: (row: T) => string;
  onRowClick?: (row: T) => void;
}

interface SortState {
  column: string | null;
  direction: 'asc' | 'desc';
}

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  searchable = false,
  sortable = true,
  pagination = true,
  pageSize = 20,
  emptyMessage = 'No data available',
  className,
  rowClassName,
  onRowClick,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortState, setSortState] = React.useState<SortState>({    column: null,
    direction: 'asc',
  });
  const [currentPage, setCurrentPage] = React.useState(1);

  // Filter and sort data
  const processedData = React.useMemo(() => {
    let filtered = [...data];

    // Search filtering
    if (searchTerm && searchable) {
      filtered = filtered.filter(row =>
        columns.some(column => {
          const value = row[column.key];
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Sorting
    if (sortState.column && sortable) {
      filtered.sort((a, b) => {
        const aVal = a[sortState.column!];
        const bVal = b[sortState.column!];
        
        if (aVal < bVal) return sortState.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortState.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, sortState, searchable, sortable, columns]);

  // Pagination
  const paginatedData = React.useMemo(() => {
    if (!pagination) return processedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return processedData.slice(startIndex, endIndex);
  }, [processedData, pagination, currentPage, pageSize]);
  const totalPages = pagination ? Math.ceil(processedData.length / pageSize) : 1;

  const handleSort = (column: Column<T>) => {
    if (!column.sortable || !sortable) return;
    
    setSortState(prev => ({
      column: column.key as string,
      direction: prev.column === column.key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getSortIcon = (column: Column<T>) => {
    if (!column.sortable || !sortable) return null;
    
    if (sortState.column !== column.key) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-500" />;
    }
    
    return sortState.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-primary" />
      : <ChevronDown className="w-4 h-4 text-primary" />;
  };

  return (
    <div className={clsx('bg-neutral rounded-xl border border-gray-700 overflow-hidden', className)}>
      {/* Search Bar */}
      {searchable && (
        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      )}
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-800">
              {columns.map((column) => (
                <th
                  key={column.key as string}
                  style={{ width: column.width }}
                  className={clsx(
                    'p-4 text-sm font-medium text-gray-300 uppercase tracking-wider',
                    {
                      'text-left': column.align === 'left' || !column.align,
                      'text-center': column.align === 'center',
                      'text-right': column.align === 'right',
                      'cursor-pointer hover:text-white select-none': column.sortable && sortable,
                    }
                  )}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {getSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-b border-gray-700">
                  {columns.map((column) => (
                    <td key={column.key as string} className="p-4">
                      <div className="h-4 bg-gray-700 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (              // Empty state
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              // Data rows
              paginatedData.map((row, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  className={clsx(
                    'border-b border-gray-700 hover:bg-gray-800 transition-colors',
                    {
                      'cursor-pointer': onRowClick,
                    },
                    rowClassName?.(row)
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key as string}
                      className={clsx('p-4', {
                        'text-left': column.align === 'left' || !column.align,
                        'text-center': column.align === 'center',
                        'text-right': column.align === 'right',
                      })}
                    >
                      {column.render ? column.render(row[column.key], row) : String(row[column.key] || '')}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, processedData.length)} of {processedData.length} results
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={clsx(
                        'w-8 h-8 rounded text-sm font-medium transition-colors',
                        {
                          'bg-primary text-white': currentPage === page,
                          'text-gray-400 hover:text-white hover:bg-gray-700': currentPage !== page,
                        }
                      )}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;