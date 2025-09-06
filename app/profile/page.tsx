import { getServerSession } from "next-auth";
import { authOptions, type BackendFields } from "../../lib/auth";
import { getMyProfile } from "../../lib/api/profile";
import ProfileCreateForms from "../../components/ProfileCreateForms";
import Link from "next/link";
import Image from "next/image";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-semibold mb-4">Profil</h1>
        <p className="opacity-80">Vous devez être connecté pour voir votre profil.</p>
        <div className="mt-4">
          <Link href="/login" className="inline-flex h-10 px-4 items-center rounded-md border border-foreground/20 hover:bg-foreground/5">Se connecter</Link>
        </div>
      </main>
    );
  }

  let data: Awaited<ReturnType<typeof getMyProfile>> | null = null;
  let error: string | null = null;
  try {
    data = await getMyProfile((session as BackendFields).backendAccessToken!);
  } catch (e: unknown) {
    error = (e as { message?: string })?.message || "Erreur";
  }

  const userName = session?.user?.name as string | undefined;
  const userEmail = session?.user?.email as string | undefined;
  const userImage = session?.user?.image as string | undefined;

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Profil</h1>

      {/* Avatar + actions */}
      <section className="rounded-md border border-foreground/15 p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-12 w-12 rounded-full overflow-hidden bg-foreground/10 flex items-center justify-center">
            {userImage ? (
              <Image src={userImage} alt="avatar" width={48} height={48} className="h-full w-full object-cover" />
            ) : (
              <span className="opacity-70 text-sm">{((userName || userEmail || '?') as string).slice(0,1)}</span>
            )}
          </div>
          <div className="min-w-0">
            <div className="font-medium truncate">{userName || userEmail || 'Connecté'}</div>
            {userEmail ? <div className="text-sm opacity-70 truncate">{userEmail}</div> : null}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {(session as BackendFields)?.backendRole !== 'Admin' && (
            <>
              <Link href="/my/courses" className="btn-outline h-9 text-sm">Mes cours</Link>
              <Link href="/certificates" className="btn-outline h-9 text-sm">Mes certificats</Link>
            </>
          )}
          <Link href="/notifications" className="btn-outline h-9 text-sm">Notifications</Link>
          <Link href="/messages" className="btn-outline h-9 text-sm">Messages</Link>
          {(session as BackendFields)?.backendRole === 'Admin' && (
            <Link href="/admin" className="btn-accent h-9 text-sm">Dashboard Admin</Link>
          )}
          <form action="/api/auth/signout" method="post">
            <button className="btn-outline h-9 text-sm">Se déconnecter</button>
          </form>
        </div>
      </section>

      {error ? (
        <div className="rounded-md border border-red-500/40 p-3 text-sm">{error}</div>
      ) : data ? (
        <div className="space-y-6">
          <section className="rounded-md border border-foreground/15 p-4">
            <div className="text-sm opacity-70 mb-2">Utilisateur</div>
            <div className="text-sm">{data.user.firstName} {data.user.lastName}</div>
            <div className="text-sm opacity-80">{data.user.email}</div>
            <div className="text-sm opacity-80 mt-1">Rôle: {data.user.role}</div>
          </section>

          <section className="rounded-md border border-foreground/15 p-4 space-y-3">
            <div className="text-sm opacity-70">Profils</div>
            {data.apprenant ? (
              <div className="text-sm">Apprenant • {data.apprenant.profession} — {data.apprenant.bio}</div>
            ) : null}
            {data.mentor ? (
              <div className="text-sm">Mentor • {data.mentor.specialite} — {data.mentor.experience}</div>
            ) : null}
            {data.partenaire ? (
              <div className="text-sm">Partenaire • {data.partenaire.organisationName} — {data.partenaire.activitySector}</div>
            ) : null}

            {!data.apprenant && !data.mentor && !data.partenaire ? (
              <div className="text-sm opacity-70">Aucun profil encore. Créez-en un ci-dessous.</div>
            ) : null}
          </section>

          {!data.apprenant && !data.mentor && !data.partenaire ? (
            <section className="rounded-md border border-foreground/15 p-4">
              <div className="text-sm opacity-70 mb-3">Créer un profil</div>
              <ProfileCreateForms />
            </section>
          ) : null}
        </div>
      ) : null}
    </main>
  );
}

