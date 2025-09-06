import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import ProfileCreateForms from "../../components/ProfileCreateForms";
import { redirect } from "next/navigation";
import { getMyProfile } from "../../lib/api/profile";

export default async function OnboardingPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  const sp = await searchParams;
  const role = sp.role as 'Apprenant' | 'Mentor' | 'Partenaire' | undefined;
  const token = (session as any).backendAccessToken as string;
  const profile = await getMyProfile(token).catch(() => null);

  if (role === 'Apprenant' && profile?.apprenant) redirect('/apprenant');
  if (role === 'Mentor' && profile?.mentor) redirect('/mentor');
  if (role === 'Partenaire' && profile?.partenaire) redirect('/partenaire');

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Bienvenue !</h1>
      <p className="text-sm opacity-80">Choisissez votre rôle et complétez quelques informations pour personnaliser votre espace.</p>
      <ProfileCreateForms onSuccess={(r) => {
        if (r === 'Apprenant') { window.location.href = '/apprenant'; }
        else if (r === 'Mentor') { window.location.href = '/mentor'; }
        else { window.location.href = '/partenaire'; }
      }} />
      <p className="text-xs opacity-70">Après création du profil, vous serez redirigé vers votre tableau de bord.</p>
    </main>
  );
}
