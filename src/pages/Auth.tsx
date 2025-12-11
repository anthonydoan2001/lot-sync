import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, LogIn } from "lucide-react";

export default function Auth() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call the secure edge function to validate password
      const { data, error } = await supabase.functions.invoke('validate-access', {
        body: { password }
      });

      if (error) {
        console.error('Function error:', error);
        toast.error("Authentication failed");
        setLoading(false);
        return;
      }

      if (data.error) {
        toast.error(data.error);
        setLoading(false);
        return;
      }

      // Set the session from the response
      if (data.session) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });

        if (sessionError) {
          console.error('Session error:', sessionError);
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
      console.error('Auth error:', error);
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <Card className="w-full max-w-md shadow-2xl border-2 relative overflow-hidden backdrop-blur-sm bg-card/95">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />

        <CardHeader className="space-y-3 relative">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg">
              <Lock className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Inventory Manager
          </CardTitle>
          <CardDescription className="text-center text-base">
            Enter the shared password to access the system
          </CardDescription>
        </CardHeader>

        <CardContent className="relative">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="text-center text-2xl tracking-widest h-14 shadow-md focus:shadow-lg transition-all duration-300"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-secondary"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  <span>Enter</span>
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
