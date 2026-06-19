export default function SortableTh({
  label,
  field,
  sortBy,
  sortDir,
  setSortBy,
  setSortDir,
  className = "",
}) {
  const isActive = sortBy === field;

  const handleClick = () => {
    if (isActive) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  return (
    <th
      onClick={handleClick}
      style={{ cursor: "pointer", userSelect: "none" }}
      className={className}
    >
      {label}{" "}
      <i
        className={`fa ${
          isActive
            ? `fa-sort-${sortDir === "asc" ? "up" : "down"}`
            : "fa-sort"
        } text-muted`}
      ></i>
    </th>
  );
}
