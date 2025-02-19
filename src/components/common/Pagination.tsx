import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  itemsPerPageOptions: number[];
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

export function Pagination({ currentPage, totalPages, itemsPerPage, itemsPerPageOptions, onPageChange, onItemsPerPageChange }: PaginationProps) {
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 4;

    if (totalPages <= maxVisiblePages + 2) {
      // Show all pages if the total pages fit within the max visible range
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show the first page
      pages.push(1);

      // Show ellipsis if the current page is beyond the visible range
      if (currentPage > maxVisiblePages) {
        pages.push("...");
      }

      // Show middle range of pages around the current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Show ellipsis if the current page is far from the last page
      if (currentPage < totalPages - maxVisiblePages + 1) {
        pages.push("...");
      }

      // Always show the last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 w-full">
      {/* Items Per Page Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm">Show Rows Per Page:</span>
        <select value={itemsPerPage} onChange={(e) => onItemsPerPageChange(Number(e.target.value))} className="border rounded p-1 text-sm">
          {itemsPerPageOptions?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2 bg-gray100 px-6 py-3 rounded-md">
        <button
          className="flex items-center justify-center h-7 w-7 rounded-full hover:bg-emerald-500 hover:text-white cursor-pointer"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          {"<"}
        </button>
        <div className="flex gap-1">
          {pageNumbers.map((page, index) =>
            typeof page === "number" ? (
              <button
                key={index}
                className={`flex items-center justify-center rounded-full text-sm h-7 w-7 hover:bg-emerald-500 hover:text-white ${
                  currentPage === page ? "bg-emerald-500 text-white" : ""
                }`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            ) : (
              <span key={index} className="flex items-center justify-center text-sm h-7 w-7">
                {page}
              </span>
            )
          )}
        </div>
        <button
          className="flex items-center justify-center h-7 w-7 rounded-full hover:bg-emerald-500 hover:text-white cursor-pointer"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
