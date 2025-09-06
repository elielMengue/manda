import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions, type BackendFields } from '../lib/auth';
import { FiAward, FiUsers, FiTrendingUp } from 'react-icons/fi';
import HealthStatus from '../components/HealthStatus';

export default async function Home() {
  // If logged in, redirect to role-specific dashboard
  const session = await getServerSession(authOptions);
  const role = (session as BackendFields | null)?.backendRole as string | undefined;
  if (role === 'Apprenant') redirect('/apprenant');
  if (role === 'Mentor') redirect('/mentor');
  if (role === 'Partenaire') redirect('/partenaire');
  if (role === 'Admin') redirect('/admin');

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  return (
    <main className="relative mx-auto max-w-6xl p-8 sm:p-16 space-y-14">
      <div className="hero-gradient" />
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative">
        <div className="space-y-6 animate-page-enter">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Apprenez. Progressez. Certifiez.
          </h1>
          <p className="text-base sm:text-lg opacity-85">
            EduImpact est la plateforme éducative tout‑en‑un pour apprendre des compétences numériques,
            obtenir des certificats reconnus et accéder à des opportunités.
          </p>
          <div className="flex gap-3 flex-col sm:flex-row sm:items-center">
            <a href="/signup" className="btn-accent">Get started</a>
            <a href="/login" className="btn-outline">Login</a>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FeatureCard icon={<FiAward />} title="Certificats" desc="Vérifiables et valorisants" />
            <FeatureCard icon={<FiUsers />} title="Mentors" desc="Experts du secteur" />
            <FeatureCard icon={<FiTrendingUp />} title="Opportunités" desc="Partenaires engagés" />
          </div>
          <Suspense fallback={<div className="skeleton h-24 rounded-xl" />}>
            {/* Statut back avec skeleton lors du streaming */}
            <HealthStatus apiBase={apiBase} />
          </Suspense>
        </div>
      </section>

      <section className="space-y-4 animate-page-enter">
        <h2 className="text-2xl font-semibold">Comment ça marche</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <StepCard step="1" title="Choisissez votre rôle" desc="Apprenant, Mentor ou Partenaire selon votre objectif." />
          <StepCard step="2" title="Apprenez et progressez" desc="Leçons, quizzes, suivi et feedback mentor." />
          <StepCard step="3" title="Certifiez et postulez" desc="Obtenez des certificats et accédez aux offres." />
        </div>
      </section>

      <section className="space-y-4 animate-page-enter">
        <h2 className="text-2xl font-semibold">Ils nous font confiance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard value="5k+" label="Apprenants actifs" />
          <StatCard value="120+" label="Mentors & partenaires" />
          <StatCard value="1k+" label="Certificats délivrés" />
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="card p-4 flex flex-col gap-2 items-start">
      <div className="text-xl opacity-90">{icon}</div>
      <div className="font-medium">{title}</div>
      <div className="text-sm opacity-80">{desc}</div>
    </div>
  );
}

function StepCard({ step, title, desc }: { step: string; title: string; desc: string }) {
  return (
    <div className="card p-5">
      <div className="text-xs opacity-70">Étape {step}</div>
      <div className="font-medium mt-1">{title}</div>
      <div className="text-sm opacity-80 mt-1">{desc}</div>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="card p-6">
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm opacity-80">{label}</div>
    </div>
  );
}
