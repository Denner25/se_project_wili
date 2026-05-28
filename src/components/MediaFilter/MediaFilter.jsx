import "./MediaFilter.css";

const TYPES = [
  { value: ["movie", "tv", "anime"], label: "Movies & Anime 🎬" },
  { value: ["music"], label: "Music 🎵" },
  { value: ["book"], label: "Books 📚" },
];

function MediaFilter({ value, onChange }) {
  const allValues = TYPES.flatMap((t) => t.value);
  const isAll = value.length === 0 || value.length === allValues.length;

  const handleAll = () => onChange([]);

  const handleType = (types) => {
    const alreadyAllSelected = types.every((t) => value.includes(t));
    if (alreadyAllSelected) {
      const next = value.filter((v) => !types.includes(v));
      onChange(next);
    } else {
      const next = [...new Set([...value, ...types])];
      onChange(next.length === allValues.length ? [] : next);
    }
  };

  return (
    <div className="media-filter">
      <button
        className={`media-filter__pill${isAll ? " media-filter__pill--active" : ""}`}
        onClick={handleAll}
      >
        All 🌐
      </button>
      {TYPES.map(({ value: types, label }) => (
        <button
          key={label}
          className={`media-filter__pill${
            isAll || types.every((t) => value.includes(t))
              ? " media-filter__pill--active"
              : ""
          }`}
          onClick={() => handleType(types)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default MediaFilter;