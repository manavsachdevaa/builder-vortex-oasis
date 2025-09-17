export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-10 text-sm text-muted-foreground grid gap-6 md:grid-cols-3">
        <div>
          <div className="font-semibold text-foreground">Lifeline AI</div>
          <p className="mt-2 max-w-sm">AI-powered blood donor matching and emergency SOS network with rewards for real heroes.</p>
        </div>
        <div>
          <div className="font-medium text-foreground">Badges & Rewards</div>
          <ul className="mt-2 space-y-1">
            <li>Bronze: 1 verified donation → 15% treatment discount</li>
            <li>Silver: 3 verified donations → 30% discount</li>
            <li>Gold: 5+ verified donations → 50% discount</li>
          </ul>
        </div>
        <div>
          <div className="font-medium text-foreground">Contact</div>
          <p className="mt-2">Partners & hospitals: hello@lifeline.ai</p>
        </div>
      </div>
      <div className="border-t">
        <div className="container py-6 text-xs text-muted-foreground/80 flex items-center justify-between">
          <p>© {new Date().getFullYear()} Lifeline AI</p>
          <p>Built with React + Tailwind</p>
        </div>
      </div>
    </footer>
  );
}
