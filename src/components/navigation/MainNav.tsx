import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Home, ChevronDown, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { algorithms } from "@/config/algorithms";

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAlgorithmsExpanded, setIsAlgorithmsExpanded] = useState(true);

  const closeNav = () => setIsOpen(false);

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
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

        {/* Desktop Navigation */}
        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link
              to="/"
              activeProps={{ className: "bg-accent" }}
              activeOptions={{ exact: true }}
            >
              Home
            </Link>
          </Button>
          {algorithms
            .filter((algo) => algo.isImplemented)
            .map((algo) => (
              <Button key={algo.id} variant="ghost" size="sm" asChild>
                <Link
                  to="/algorithms/$slug"
                  params={{ slug: algo.slug }}
                  activeProps={{ className: "bg-accent" }}
                >
                  <algo.icon className="size-4" />
                  {algo.name}
                </Link>
              </Button>
            ))}
        </nav>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={closeNav}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-background transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
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

        {/* Sidebar Content */}
        <nav className="flex-1 overflow-y-auto p-4">
          {/* Home Link */}
          <Link
            to="/"
            onClick={closeNav}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
            activeProps={{ className: "bg-accent" }}
            activeOptions={{ exact: true }}
          >
            <Home className="size-4" />
            Home
          </Link>

          {/* Algorithms Section */}
          <div className="mt-6">
            <button
              onClick={() => setIsAlgorithmsExpanded(!isAlgorithmsExpanded)}
              className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              <span>Algorithms</span>
              {isAlgorithmsExpanded ? (
                <ChevronDown className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              )}
            </button>

            {isAlgorithmsExpanded && (
              <ul className="mt-1 space-y-1">
                {algorithms.map((algo) => (
                  <li key={algo.id}>
                    {algo.isImplemented ? (
                      <Link
                        to="/algorithms/$slug"
                        params={{ slug: algo.slug }}
                        onClick={closeNav}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                        activeProps={{ className: "bg-accent font-medium" }}
                      >
                        <algo.icon className="size-4" />
                        {algo.name}
                      </Link>
                    ) : (
                      <span className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground opacity-50">
                        <algo.icon className="size-4" />
                        {algo.name}
                        <span className="ml-auto text-xs">Soon</span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t p-4">
          <p className="text-xs text-muted-foreground">
            A visual guide to sorting algorithms
          </p>
        </div>
      </aside>
    </>
  );
}
