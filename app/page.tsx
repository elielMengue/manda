export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8 sm:p-16">
      <div className="max-w-3xl w-full space-y-6 text-center sm:text-left">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">EduImpact</h1>
        <p className="text-base sm:text-lg text-foreground/80">
          Plateforme éducative tout-en-un pour apprendre des compétences numériques,
          obtenir des certificats et accéder à des opportunités professionnelles.
        </p>
        <div className="flex gap-3 flex-col sm:flex-row sm:items-center">
          <a
            href="#"
            className="inline-flex items-center justify-center h-11 px-5 rounded-md bg-foreground text-background font-medium hover:opacity-90"
          >
            Commencer
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center h-11 px-5 rounded-md border border-foreground/20 hover:bg-foreground/5"
          >
            En savoir plus
          </a>
        </div>
      </div>
    </main>
  );
}

