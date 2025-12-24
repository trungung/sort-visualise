import { Outlet, createRootRoute, useLocation } from "@tanstack/react-router";

import { MainNav } from "@/components/navigation/MainNav";
import { ThemeProvider } from "@/components/theme-provider";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const location = useLocation();
  const isVisualizerPage = location.pathname.startsWith("/algorithms");

  return (
    <ThemeProvider defaultTheme="dark" storageKey="sort-visualise-theme">
      <div className="min-h-screen bg-background text-foreground">
        {!isVisualizerPage && <MainNav />}
        <Outlet />
      </div>
    </ThemeProvider>
  );
}
