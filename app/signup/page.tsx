import Link from "next/link";
import RegisterForm from "../../components/RegisterForm";
import GoogleWithRole from "../../components/GoogleWithRole";

export default function SignupPage() {
  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6 animate-page-enter">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Créer un compte Apprenant</h1>
        <p className="text-sm opacity-80">Deux options: créez un compte avec vos informations ou continuez avec Google (Apprenants uniquement).</p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="text-sm opacity-70 mb-2">Inscription classique</div>
          <RegisterForm />
        </div>
        <div className="card p-5">
          <div className="text-sm opacity-70 mb-2">Continuer avec Google</div>
          <GoogleWithRole />
          <ul className="text-xs opacity-70 mt-3 list-disc ml-4 space-y-1">
            <li>Votre profil Apprenant sera créé lors de l’onboarding.</li>
            <li>Vous pourrez ensuite accéder à vos cours et certificats.</li>
          </ul>
        </div>
      </section>

      <div className="text-sm opacity-80">
        Déjà mentor, partenaire ou admin ? <Link href="/login" className="underline">Connectez-vous ici</Link>
      </div>
    </main>
  );
}

