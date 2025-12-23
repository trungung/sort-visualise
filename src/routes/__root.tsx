import { Outlet, createRootRoute, useLocation } from "@tanstack/react-router";

import { MainNav } from "@/components/navigation/MainNav";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const location = useLocation();
  const isVisualizerPage = location.pathname.startsWith("/algorithms");

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      {!isVisualizerPage && <MainNav />}
      <Outlet />
    </div>
  );
}
