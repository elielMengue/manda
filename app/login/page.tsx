import CredentialsLoginForm from "../../components/CredentialsLoginForm";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md p-6 space-y-6 animate-page-enter">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Connexion</h1>
        <p className="text-sm opacity-80">Mentors, Partenaires et Admins.</p>
      </div>
      <section className="card p-5">
        <CredentialsLoginForm />
      </section>
      <div className="text-sm opacity-80">
        Vous êtes Apprenant ?{" "}
        <a href="/signup" className="underline">
          Créez un compte ou continuez avec Google
        </a>
      </div>
    </main>
  );
}
