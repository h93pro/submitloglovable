import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, createRootRouteWithContext, useRouter, useRouterState, HeadContent, Scripts,
} from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/lib/theme";
import { AppSidebar, MobileSidebar } from "@/components/app-shell/sidebar";
import { Topbar } from "@/components/app-shell/topbar";
import { CommandPalette } from "@/components/app-shell/command-palette";
import { CreateDocumentSheet } from "@/components/app-shell/create-document-sheet";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="grid min-h-[60vh] place-items-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold tracking-tight text-foreground">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">This page hasn't been built yet.</p>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="grid min-h-[60vh] place-items-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SubmitLog — Construction Document Control" },
      { name: "description", content: "Enterprise document control and project management for construction." },
      { name: "theme-color", content: "#0c0d12" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isPublicAuthRoute = pathname === "/login" || pathname === "/change-password" || pathname === "/forgot-password" || pathname === "/reset-password";

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {isPublicAuthRoute ? <Outlet /> : <AppLayout />}
        <Toaster position="top-right" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <MobileSidebar open={mobileNavOpen} onOpenChange={setMobileNavOpen} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onOpenPalette={() => setPaletteOpen(true)}
          onCreate={() => setCreateOpen(true)}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />
        <main className="min-w-0 flex-1 pb-[env(safe-area-inset-bottom)]">
          <Outlet />
        </main>
      </div>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} onCreate={() => setCreateOpen(true)} />
      <CreateDocumentSheet open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
