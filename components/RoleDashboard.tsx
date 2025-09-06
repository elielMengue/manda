import React from "react";

interface RoleDashboardProps {
  role: "Admin" | "Mentor" | "Apprenant";
  title: string;
  children: React.ReactNode;
}

export default function RoleDashboard({ role, title, children }: RoleDashboardProps) {
  const colors: Record<RoleDashboardProps["role"], { bg: string; accent: string }> = {
    Admin: { bg: "bg-red-50", accent: "text-red-700" },
    Mentor: { bg: "bg-blue-50", accent: "text-blue-700" },
    Apprenant: { bg: "bg-green-50", accent: "text-green-700" },
  };
  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className={`rounded-lg p-6 shadow-sm ${colors[role].bg}`}>
        <h1 className={`text-2xl font-semibold ${colors[role].accent}`}>{title}</h1>
        <p className="text-sm opacity-70">Bienvenue dans votre espace {role.toLowerCase()}.</p>
      </header>
      {children}
    </main>
  );
}
