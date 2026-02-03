import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { LogIn, Package } from "lucide-react";

export default function Auth() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('validate-access', {
        body: { password }
      });

      if (error) {
        toast.error("Authentication failed");
        setLoading(false);
        return;
      }

      if (data.error) {
        toast.error(data.error);
        setLoading(false);
        return;
      }

      if (data.session) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });

        if (sessionError) {
          toast.error("Failed to establish session");
          setLoading(false);
          return;
        }

        toast.success("Logged in successfully");
        navigate("/");
      } else {
        toast.error("No session returned");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <Card className="max-w-sm w-full">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <Package className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">LotSync</CardTitle>
          <CardDescription>Enter access code to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="text-center text-lg tracking-widest h-12 flex-1"
              autoFocus
            />
            <Button
              type="submit"
              className="h-12 px-6"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground" />
              ) : (
                <LogIn className="h-5 w-5" />
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
