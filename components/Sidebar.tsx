import { getServerSession } from "next-auth";
import { authOptions, type BackendFields } from "../lib/auth";
import { type NavItem } from "./SidebarNav";
import { listMyNotifications } from "../lib/api/notifications";
import { listConversations } from "../lib/api/messages";
import MobileSidebar from "./MobileSidebar";
import SidebarClient from "./SidebarClient";
import UserMenu from "./UserMenu";

export default async function Sidebar() {
  const session = await getServerSession(authOptions);
  const role = (session as BackendFields)?.backendRole as string | undefined;
  const token = (session as BackendFields)?.backendAccessToken as string | undefined;

  let unread = 0;
  let convCount = 0;
  if (token) {
    try {
      const notifs = await listMyNotifications(token);
      unread = notifs.filter((n) => !n.isRead).length;
    } catch {}
    try {
      const convs = await listConversations(token);
      convCount = convs.length;
    } catch {}
  }

  // Barre latérale pour utilisateurs connectés: pas de lien "Accueil"
  const common: NavItem[] = [
    { href: "/courses", label: "Cours", icon: 'book' },
    // "Mes cours" est réservé aux apprenants (inscriptions)
    ...(role === "Apprenant" ? ([{ href: "/my/courses", label: "Mes cours", icon: 'grid' }] as NavItem[]) : []),
    { href: "/notifications", label: "Notifications", icon: 'bell', badge: unread },
    { href: "/messages", label: "Messages", icon: 'message', badge: convCount },
    { href: "/profile", label: "Profil", icon: 'user' },
  ];

  const apprenant: NavItem[] = [
    { href: "/apprenant", label: "Tableau de bord", icon: 'grid' },
    { href: "/certificates", label: "Mes certificats", icon: 'award' },
  ];
  const mentor: NavItem[] = [
    { href: "/mentor", label: "Espace Mentor", icon: 'grid' },
    { href: "/certificates/issue", label: "Émettre certificats", icon: 'award' },
  ];
  const partenaire: NavItem[] = [
    { href: "/partenaire", label: "Espace Partenaire", icon: 'briefcase' },
  ];

  const sections: Array<{ title: string; items: NavItem[] }> = [];
  if (role === "Apprenant") sections.push({ title: "Apprenant", items: apprenant });
  if (role === "Mentor") sections.push({ title: "Mentor", items: mentor });
  if (role === "Partenaire") sections.push({ title: "Partenaire", items: partenaire });
  if (role === "Admin")
    sections.push({
      title: "Admin",
      items: [
        { href: "/admin", label: "Tableau de bord", icon: 'grid' },
        { href: "/certificates/issue", label: "Émettre certificats", icon: 'award' },
        { href: "/admin/users", label: "Utilisateurs", icon: 'user' },
      ],
    });
  sections.push({ title: "Général", items: common });

  const userName = session?.user?.name as string | undefined;
  const userEmail = session?.user?.email as string | undefined;
  const userImage = session?.user?.image as string | undefined;

  return (
    <>
      <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r border-foreground/10 min-h-screen sticky top-0">
        <div className="px-3 py-4 text-lg font-semibold">EduImpact</div>
        <SidebarClient initialSections={sections} />
        <UserMenu name={userName} email={userEmail} image={userImage || undefined} />
      </aside>
      <MobileSidebar sections={sections} />
    </>
  );
}
