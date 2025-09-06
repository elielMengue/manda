import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import Sidebar from "./Sidebar";
import PublicHeader from "./PublicHeader";
import PublicFooter from "./PublicFooter";

export default async function AuthLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (session) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <div className="flex-1 min-w-0">
        {children}
      </div>
      <PublicFooter />
    </div>
  );
}