import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, LogOut } from "lucide-react";

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
    <header className="border-b bg-card/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={viewMode === "active" ? "default" : "outline"}
              onClick={() => setViewMode("active")}
              size="lg"
              className="font-semibold shadow-md hover:shadow-lg transition-shadow duration-150"
            >
              Active
            </Button>
            <Button
              variant={viewMode === "history" ? "default" : "outline"}
              onClick={() => setViewMode("history")}
              size="lg"
              className="font-semibold shadow-md hover:shadow-lg transition-shadow duration-150"
            >
              History
            </Button>
          </div>

          <div className="flex gap-3 items-center w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base shadow-md focus:shadow-lg transition-shadow duration-150"
              />
            </div>
            <Button
              onClick={() => navigate("/manual")}
              variant="outline"
              size="lg"
              className="flex-shrink-0 shadow-md hover:shadow-lg transition-shadow duration-150"
            >
              <BookOpen className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Manual</span>
            </Button>
            <Button
              onClick={onLogout}
              variant="outline"
              size="lg"
              className="flex-shrink-0 shadow-md hover:shadow-lg transition-shadow duration-150"
            >
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
});
