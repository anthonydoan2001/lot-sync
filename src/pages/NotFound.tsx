import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-foreground">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Page not found</p>
        <Button variant="link" onClick={() => navigate("/")} className="text-primary">
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
