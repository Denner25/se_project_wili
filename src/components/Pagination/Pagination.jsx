import "./Pagination.css";

function Pagination({ currentPage, totalPages, onPageSelect }) {
  if (totalPages <= 1) return null;

  const maxNumbers = 4;

  const getPageNumbers = () => {
    let start = Math.max(currentPage - 1, 1);
    let end = start + maxNumbers - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(end - maxNumbers + 1, 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="pagination">
      <button onClick={() => onPageSelect(1)} disabled={currentPage === 1}>
        «
      </button>
      <button
        onClick={() => onPageSelect(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ‹
      </button>

      {pages.map((page) => (
        <button
          key={page}
          className={page === currentPage ? "active" : ""}
          onClick={() => onPageSelect(page)}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageSelect(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        ›
      </button>
      <button
        onClick={() => onPageSelect(totalPages)}
        disabled={currentPage === totalPages}
      >
        »
      </button>
    </div>
  );
}

export default Pagination;
