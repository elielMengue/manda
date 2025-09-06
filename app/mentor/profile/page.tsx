import { getServerSession } from "next-auth";
import { authOptions, type BackendFields } from "../../../lib/auth";
import { redirect } from "next/navigation";
import RoleDashboard from "../../../components/RoleDashboard";
import BackLink from "../../../components/BackLink";
import { getMyProfile } from "../../../lib/api/profile";
import ProfileEditForm from "../../../components/ProfileEditForm";

export default async function MentorProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  const role = (session as BackendFields).backendRole as string | undefined;
  if (role !== 'Mentor') redirect('/');

  const token = (session as BackendFields).backendAccessToken as string;
  const data = await getMyProfile(token).catch(() => null);
  if (!data) redirect('/mentor');

  return (
    <RoleDashboard role="Mentor" title="Profil mentor">
      <BackLink href="/mentor" />
      <section className="card p-4 space-y-3">
        <div className="text-sm opacity-70">Mes informations</div>
        <ProfileEditForm initial={{ firstName: data.user.firstName, lastName: data.user.lastName, address: data.user.address, phone: data.user.phone, photoUrl: data.user.photoUrl }} />
      </section>
    </RoleDashboard>
  );
}

