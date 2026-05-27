import "./MediaFilter.css";

const TYPES = [
  { value: "movie", label: "Movies & Anime" },
  { value: "music", label: "Music" },
  { value: "book", label: "Books" },
];

function MediaFilter({ value, onChange }) {
  const isAll = value.length === 0 || value.length === TYPES.length;

  const handleAll = () => onChange([]);

  const handleType = (type) => {
    if (value.includes(type)) {
      const next = value.filter((v) => v !== type);
      onChange(next);
    } else {
      const next = [...value, type];
      onChange(next.length === TYPES.length ? [] : next);
    }
  };

  return (
    <div className="media-filter">
      <button
        className={`media-filter__pill${isAll ? " media-filter__pill--active" : ""}`}
        onClick={handleAll}
      >
        All
      </button>
      {TYPES.map(({ value: type, label }) => (
        <button
          key={type}
          className={`media-filter__pill${
            isAll || value.includes(type) ? " media-filter__pill--active" : ""
          }`}
          onClick={() => handleType(type)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default MediaFilter;