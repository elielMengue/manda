export default async function HealthStatus({ apiBase }: { apiBase: string }) {
  let health: { timestamp: string } | null = null;
  try {
    const res = await fetch(`${apiBase}/health`, { cache: 'no-store' });
    if (res.ok) health = await res.json();
  } catch {}
  return (
    <div className="card p-6">
      <div className="text-sm opacity-80">Statut API</div>
      <div className="mt-2">
        {health ? (
          <span className="text-sm">OK • {new Date(health.timestamp).toLocaleString()}</span>
        ) : (
          <span className="text-sm opacity-70">Indisponible</span>
        )}
      </div>
    </div>
  );
}

