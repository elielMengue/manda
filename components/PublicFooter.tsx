export default function PublicFooter() {
  return (
    <footer className="border-t border-foreground/10 mt-16 bg-background/60">
      <div className="mx-auto max-w-6xl px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
        <div className="space-y-2">
          <div className="font-semibold">EduImpact</div>
          <p className="opacity-80">Plateforme éducative pour apprendre, se certifier et accéder aux opportunités.</p>
        </div>
        <div className="space-y-2">
          <div className="font-medium opacity-90">Ressources</div>
          <ul className="space-y-1 opacity-80">
            <li><a className="hover:opacity-100" href="/signup">Get started</a></li>
            <li><a className="hover:opacity-100" href="/login">Login</a></li>
          </ul>
        </div>
        <div className="space-y-2">
          <div className="font-medium opacity-90">Légal</div>
          <ul className="space-y-1 opacity-80">
            <li>© {new Date().getFullYear()} EduImpact</li>
            <li>Tous droits réservés</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

