export default function Loading() {
  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 32, display: 'flex', justifyContent: 'center' }}>
      <div style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        border: "4px solid var(--muted)",
        borderTopColor: "var(--foreground)",
        animation: "spin 1s linear infinite"
      }} />
    </div>
  );
}
