import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, LogOut, Package } from "lucide-react";

interface HeaderProps {
  viewMode: "active" | "history";
  setViewMode: (mode: "active" | "history") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onLogout: () => void;
}

export const Header = memo(function Header({
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  onLogout,
}: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Package className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">LotSync</span>
            </div>
            <div className="flex rounded-lg border bg-muted p-0.5">
              <button
                onClick={() => setViewMode("active")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewMode === "active"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setViewMode("history")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
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
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
            <Button
              onClick={() => navigate("/manual")}
              variant="ghost"
              size="sm"
              className="flex-shrink-0"
            >
              <BookOpen className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Manual</span>
            </Button>
            <Button
              onClick={onLogout}
              variant="ghost"
              size="sm"
              className="flex-shrink-0"
            >
              <LogOut className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
});
