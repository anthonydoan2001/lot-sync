"use client";

import { memo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { BookOpen, LogOut, Package, Box } from "lucide-react";

interface HeaderProps {
  onLogout: () => void;
  displayName?: string;
  loggingOut?: boolean;
}

export const Header = memo(function Header({
  onLogout,
  displayName,
  loggingOut = false,
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const status = segments[0] === "history" ? "history" : "active";
  const resource = segments[1] === "lots" ? "lots" : "pallets";

  const navigateTo = (newStatus: string, newResource: string) => {
    router.push(`/${newStatus}/${newResource}`);
  };

  return (
    <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
            <div className="flex rounded-lg border bg-muted p-0.5">
              <button
                onClick={() => navigateTo("active", resource)}
                className={`px-5 py-2 text-sm font-medium rounded-md transition-colors ${
                  status === "active"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => navigateTo("history", resource)}
                className={`px-5 py-2 text-sm font-medium rounded-md transition-colors ${
                  status === "history"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                History
              </button>
            </div>
            <div className="flex rounded-lg border bg-muted p-0.5">
              <button
                onClick={() => navigateTo(status, "pallets")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                  resource === "pallets"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Package className="h-3.5 w-3.5" />
                Pallets
              </button>
              <button
                onClick={() => navigateTo(status, "lots")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                  resource === "lots"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Box className="h-3.5 w-3.5" />
                Lots
              </button>
            </div>
          </div>

          <div className="flex gap-2 items-center w-full sm:w-auto">
            <Button
              onClick={() => router.push("/manual")}
              variant="ghost"
              size="icon"
              className="flex-shrink-0 h-10 w-10"
              title="Manual"
            >
              <BookOpen className="h-5 w-5" />
            </Button>
            {displayName && (
              <span className="text-base font-medium text-foreground">
                {displayName}
              </span>
            )}
            <Button
              onClick={onLogout}
              variant="ghost"
              size="icon"
              disabled={loggingOut}
              className="flex-shrink-0 h-10 w-10"
              title="Logout"
            >
              {loggingOut ? (
                <Spinner size="md" />
              ) : (
                <LogOut className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
});
