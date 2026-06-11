"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (pageNumber === 1) {
      params.delete("page");
    } else {
      params.set("page", pageNumber.toString());
    }
    return `${pathname}?${params.toString()}`;
  };

  // Calculate showing items range
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  // Generate page numbers to display with ellipses
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 px-2 animate-fadeIn">
      {/* Items count summary */}
      <div className="text-sm text-slate-400 font-medium">
        Showing{" "}
        <span className="font-bold text-white">{startItem}</span> to{" "}
        <span className="font-bold text-white">{endItem}</span> of{" "}
        <span className="font-bold text-white">{totalCount}</span> results
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* First Page */}
        <Link
          href={createPageUrl(1)}
          className={`flex items-center justify-center size-10 rounded-xl glass-panel border border-white/10 text-slate-400 hover:text-white hover:border-cyan-500/30 transition-all duration-200 active:scale-95 ${
            currentPage === 1 ? "opacity-40 pointer-events-none" : ""
          }`}
          title="First Page"
        >
          <ChevronsLeft className="size-4" />
        </Link>

        {/* Previous Page */}
        <Link
          href={createPageUrl(currentPage - 1)}
          className={`flex items-center justify-center size-10 rounded-xl glass-panel border border-white/10 text-slate-400 hover:text-white hover:border-cyan-500/30 transition-all duration-200 active:scale-95 ${
            currentPage === 1 ? "opacity-40 pointer-events-none" : ""
          }`}
          title="Previous Page"
        >
          <ChevronLeft className="size-4" />
        </Link>

        {/* Page Numbers - Desktop */}
        <div className="hidden sm:flex items-center gap-2">
          {pages.map((page, idx) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="flex items-center justify-center size-10 text-slate-600 font-bold"
                >
                  ...
                </span>
              );
            }

            const isCurrent = page === currentPage;
            return (
              <Link
                key={`page-${page}`}
                href={createPageUrl(page as number)}
                className={`flex items-center justify-center size-10 rounded-xl font-bold transition-all duration-200 active:scale-95 ${
                  isCurrent
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-[#101922] shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                    : "glass-panel border border-white/10 text-slate-400 hover:text-white hover:border-cyan-500/30"
                }`}
              >
                {page}
              </Link>
            );
          })}
        </div>

        {/* Mobile Page Indicator */}
        <span className="sm:hidden text-sm font-semibold text-slate-300 px-4">
          Page {currentPage} of {totalPages}
        </span>

        {/* Next Page */}
        <Link
          href={createPageUrl(currentPage + 1)}
          className={`flex items-center justify-center size-10 rounded-xl glass-panel border border-white/10 text-slate-400 hover:text-white hover:border-cyan-500/30 transition-all duration-200 active:scale-95 ${
            currentPage === totalPages ? "opacity-40 pointer-events-none" : ""
          }`}
          title="Next Page"
        >
          <ChevronRight className="size-4" />
        </Link>

        {/* Last Page */}
        <Link
          href={createPageUrl(totalPages)}
          className={`flex items-center justify-center size-10 rounded-xl glass-panel border border-white/10 text-slate-400 hover:text-white hover:border-cyan-500/30 transition-all duration-200 active:scale-95 ${
            currentPage === totalPages ? "opacity-40 pointer-events-none" : ""
          }`}
          title="Last Page"
        >
          <ChevronsRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
