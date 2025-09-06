import CertLookup from "../../components/CertLookup";

export default function MyCertificatesPage() {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Mes certificats</h1>
      <p className="text-sm opacity-80">Actuellement, l'API ne propose pas d'endpoint pour lister vos certificats. Vous pouvez télécharger un certificat si vous connaissez son identifiant.</p>
      <CertLookup base={base} />
    </main>
  );
}

