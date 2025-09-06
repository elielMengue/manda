import React from "react";

interface RoleDashboardProps {
  role: "Admin" | "Mentor" | "Apprenant" | "Partenaire";
  title: string;
  children: React.ReactNode;
}

export default function RoleDashboard({ role, title, children }: RoleDashboardProps) {
  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="rounded-lg p-6 shadow-sm bg-foreground/[0.06]">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <p className="text-sm opacity-70">Bienvenue dans votre espace {role.toLowerCase()}.</p>
      </header>
      {children}
    </main>
  );
}
