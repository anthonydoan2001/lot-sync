import { memo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, LogOut, Package } from "lucide-react";

interface HeaderProps {
  viewMode: "active" | "history";
  setViewMode: (mode: "active" | "history") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onLogout: () => void;
  displayName?: string;
}

export const Header = memo(function Header({
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  onLogout,
  displayName,
}: HeaderProps) {
  const router = useRouter();

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
                onClick={() => setViewMode("active")}
                className={`px-5 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === "active"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setViewMode("history")}
                className={`px-5 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === "history"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                History
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
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10"
              />
            </div>
            {displayName && (
              <span className="text-base font-medium text-foreground">
                {displayName}
              </span>
            )}
            <Button
              onClick={onLogout}
              variant="ghost"
              size="icon"
              className="flex-shrink-0 h-10 w-10"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
});
