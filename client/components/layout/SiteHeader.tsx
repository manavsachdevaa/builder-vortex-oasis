import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const location = useLocation();
  const isAuth = location.pathname.startsWith("/auth");

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
            💓
          </span>
          <span className="font-extrabold tracking-tight text-xl">
            Lifeline AI
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                "transition-colors hover:text-foreground/80",
                isActive ? "text-foreground" : "text-foreground/60",
              )
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/auth"
            className={({ isActive }) =>
              cn(
                "transition-colors hover:text-foreground/80",
                isActive ? "text-foreground" : "text-foreground/60",
              )
            }
          >
            Sign In
          </NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant={isAuth ? "secondary" : "default"}>
            <Link to="/auth">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
