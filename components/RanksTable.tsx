"use client";

import React, { useState, useMemo } from "react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Select, Input } from "./ui/Input";
import { Search, RotateCcw, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

interface RecordRow {
  id: number;
  marks: number;
  rank: number;
  category: string | null;
  gender: string | null;
}

interface RanksTableProps {
  initialRecords: RecordRow[];
  categories: string[];
  genders: string[];
  maxMarks: number;
}

export const RanksTable: React.FC<RanksTableProps> = ({
  initialRecords,
  categories,
  genders,
  maxMarks,
}) => {
  // Client state
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedGender, setSelectedGender] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("marks_desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 15;

  // Sync category options
  const categoryOptions = [
    { value: "ALL", label: "All Categories" },
    ...categories.map((c) => ({ value: c, label: c })),
  ];

  const genderOptions = [
    { value: "ALL", label: "All Genders" },
    ...genders.map((g) => ({ value: g, label: g })),
  ];

  const sortOptions = [
    { value: "marks_desc", label: "Marks: High → Low" },
    { value: "marks_asc", label: "Marks: Low → High" },
    { value: "rank_asc", label: "Rank: Best → Worst" },
    { value: "rank_desc", label: "Rank: Worst → Best" },
  ];

  // Reset filters
  const handleResetFilters = () => {
    setSelectedCategory("ALL");
    setSelectedGender("ALL");
    setSearchQuery("");
    setSortOrder("marks_desc");
    setCurrentPage(1);
  };

  // Perform in-memory filter and sort (for speed & interactivity)
  const processedRecords = useMemo(() => {
    let result = [...initialRecords];

    // 1. Filter by Category
    if (selectedCategory !== "ALL") {
      result = result.filter((r) => r.category === selectedCategory);
    }

    // 2. Filter by Gender
    if (selectedGender !== "ALL") {
      result = result.filter((r) => r.gender === selectedGender);
    }

    // 3. Search by Marks
    if (searchQuery.trim() !== "") {
      const q = Number(searchQuery);
      if (!isNaN(q)) {
        // Find marks matching or close to search query
        result = result.filter((r) => Math.abs(r.marks - q) <= 15);
      }
    }

    // 4. Sort Records
    result.sort((a, b) => {
      if (sortOrder === "marks_desc") return b.marks - a.marks;
      if (sortOrder === "marks_asc") return a.marks - b.marks;
      if (sortOrder === "rank_asc") return a.rank - b.rank;
      if (sortOrder === "rank_desc") return b.rank - a.rank;
      return b.marks - a.marks;
    });

    return result;
  }, [initialRecords, selectedCategory, selectedGender, searchQuery, sortOrder]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(processedRecords.length / itemsPerPage));
  
  // Safe page correction
  const safeCurrentPage = Math.min(currentPage, totalPages);
  
  const paginatedRecords = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * itemsPerPage;
    return processedRecords.slice(startIndex, startIndex + itemsPerPage);
  }, [processedRecords, safeCurrentPage]);

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filtering Controls */}
      <Card variant="flat" className="p-6 bg-white border border-slate-200/80 dark:bg-zinc-900/50 dark:border-zinc-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Category Dropdown */}
          <Select
            id="table-category"
            label="Category"
            options={categoryOptions}
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
          />

          {/* Gender Dropdown */}
          <Select
            id="table-gender"
            label="Gender"
            options={genderOptions}
            value={selectedGender}
            onChange={(e) => {
              setSelectedGender(e.target.value);
              setCurrentPage(1);
            }}
          />

          {/* Sort Order Dropdown */}
          <Select
            id="table-sort"
            label="Sort By"
            options={sortOptions}
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setCurrentPage(1);
            }}
          />

          {/* Search by Marks Input */}
          <div className="relative w-full">
            <Input
              id="table-search"
              label="Search Score"
              placeholder={`e.g. 150 (out of ${maxMarks})`}
              type="number"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Reset actions */}
        <div className="mt-4 flex justify-between items-center text-xs font-bold text-slate-400 dark:text-zinc-500">
          <span>Found {processedRecords.length} matching data points</span>
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-500 hover:underline cursor-pointer dark:text-indigo-400"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        </div>
      </Card>

      {/* Main Table Grid */}
      <Card variant="flat" className="p-0 overflow-hidden bg-white border border-slate-200/80 dark:bg-zinc-900/50 dark:border-zinc-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400">
                <th className="px-6 py-4 text-sm font-black uppercase tracking-wider">Marks</th>
                <th className="px-6 py-4 text-sm font-black uppercase tracking-wider">Expected Rank</th>
                <th className="px-6 py-4 text-sm font-black uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-sm font-black uppercase tracking-wider">Gender</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-900">
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/30 transition-colors font-bold text-slate-700 dark:text-zinc-300"
                  >
                    <td className="px-6 py-4.5 text-base font-extrabold text-slate-900 dark:text-zinc-100">
                      {row.marks}
                    </td>
                    <td className="px-6 py-4.5">
                      <span className="inline-flex bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-sm font-black dark:bg-indigo-950/50 dark:text-indigo-400">
                        #{row.rank.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-sm">
                      {row.category || "GENERAL"}
                    </td>
                    <td className="px-6 py-4.5 text-sm text-slate-400 dark:text-zinc-500">
                      {row.gender || "All Genders"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 dark:text-zinc-500 font-bold">
                    No data points found matching your selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 bg-slate-50 dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800">
            <span className="text-xs font-bold text-slate-400 dark:text-zinc-500">
              Page {safeCurrentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={safeCurrentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3.5 py-1.5 min-h-0 text-xs rounded-xl"
              >
                <ChevronLeft className="w-4 h-4 mr-0.5" />
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={safeCurrentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3.5 py-1.5 min-h-0 text-xs rounded-xl"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
