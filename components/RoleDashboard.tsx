import React from "react";

interface RoleDashboardProps {
  role: "Admin" | "Mentor" | "Apprenant";
  title: string;
  children: React.ReactNode;
}

export default function RoleDashboard({ role, title, children }: RoleDashboardProps) {
  const bg: Record<RoleDashboardProps["role"], string> = {
    Admin: "bg-red-50",
    Mentor: "bg-blue-50",
    Apprenant: "bg-green-50",
  };
  const accent: Record<RoleDashboardProps["role"], string> = {
    Admin: "text-red-700",
    Mentor: "text-blue-700",
    Apprenant: "text-green-700",
  };
  return (
    <main className={`mx-auto max-w-5xl p-6 space-y-6 ${bg[role]}`}>
      <h1 className={`text-2xl font-semibold ${accent[role]}`}>{title}</h1>
      {children}
    </main>
  );
}
