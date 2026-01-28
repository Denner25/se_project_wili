import { useState, useMemo } from "react";

function usePagination(items = [], itemsPerPage = 12) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  const nextPage = () => {
    setCurrentPage((p) => Math.min(p + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((p) => Math.max(p - 1, 1));
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    currentItems,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
  };
}

export default usePagination;
