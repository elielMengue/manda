import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import CertificateIssueForm from "../../../components/CertificateIssueForm";

export default async function IssueCertificatePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-semibold mb-4">Émettre un certificat</h1>
        <p className="opacity-80">Vous devez être connecté (Admin/Mentor).</p>
        <div className="mt-4">
          <a href="/login" className="inline-flex h-10 px-4 items-center rounded-md border border-foreground/20 hover:bg-foreground/5">Se connecter</a>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Émettre un certificat</h1>
      <p className="text-sm opacity-80">Rôles: Admin ou Mentor propriétaire du cours.</p>
      <div className="rounded-md border border-foreground/15 p-4">
        <CertificateIssueForm />
      </div>
    </main>
  );
}
