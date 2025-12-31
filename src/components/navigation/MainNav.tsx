import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Home } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { algorithms } from "@/config/algorithms";

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false);
  const closeNav = () => setIsOpen(false);

  const implementedAlgorithms = algorithms.filter((algo) => algo.isImplemented);
  const comingSoonAlgorithms = algorithms.filter((algo) => !algo.isImplemented);

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(true)}
            aria-label="Open navigation menu"
            className="lg:hidden"
          >
            <Menu className="size-5" />
          </Button>

          <Link to="/" className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight">
              Sort Visualizer
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-6 lg:flex">
          {implementedAlgorithms.map((algo) => (
            <Link
              key={algo.id}
              to="/algorithms/$slug"
              params={{ slug: algo.slug }}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {algo.name}
            </Link>
          ))}
          <ModeToggle />
        </nav>

        <div className="flex lg:hidden">
          <ModeToggle />
        </div>
      </header>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={closeNav}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-background transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b px-4">
          <span className="text-lg font-semibold">Navigation</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeNav}
            aria-label="Close navigation menu"
          >
            <X className="size-5" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <Link
              to="/"
              onClick={closeNav}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              <Home className="size-4" />
              Home
            </Link>
          </div>

          <div className="mt-2">
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Implemented
            </div>

            <ul className="mt-1 space-y-1">
              {implementedAlgorithms.map((algo) => (
                <li key={algo.id}>
                  <Link
                    to="/algorithms/$slug"
                    params={{ slug: algo.slug }}
                    onClick={closeNav}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent"
                  >
                    <algo.icon className="size-4" />
                    {algo.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Coming Soon
            </div>

            <ul className="mt-1 space-y-1">
              {comingSoonAlgorithms.map((algo) => (
                <li key={algo.id}>
                  <span className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground">
                    <algo.icon className="size-4" />
                    {algo.name}
                    <span className="ml-auto text-xs">Soon</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="border-t p-4">
          <p className="text-xs text-muted-foreground">
            A visual guide to sorting algorithms
          </p>
        </div>
      </aside>
    </>
  );
}
