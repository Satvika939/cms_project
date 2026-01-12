function StatusBadge({ status }) {
  const colors = {
    draft: "#6c757d",
    scheduled: "#fd7e14",
    published: "#28a745",
    archived: "#343a40",
  };

  return (
    <span
      style={{
        padding: "4px 8px",
        borderRadius: "6px",
        backgroundColor: colors[status] || "#999",
        color: "white",
        fontSize: "12px",
        textTransform: "capitalize",
      }}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
