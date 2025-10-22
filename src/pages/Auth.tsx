import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { z } from "zod";

const SHARED_PASSWORD = "676767";

export default function Auth() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if password matches
      if (password !== SHARED_PASSWORD) {
        toast.error("Incorrect password");
        setLoading(false);
        return;
      }

      // Use a single shared account
      const email = `itadsecure@gmail.com`;
      
      // Try to sign in first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: SHARED_PASSWORD,
      });

      if (signInError) {
        // If account doesn't exist, create it
        if (signInError.message.includes("Invalid login credentials")) {
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password: SHARED_PASSWORD,
            options: {
              emailRedirectTo: `${window.location.origin}/`,
            },
          });
          if (signUpError) throw signUpError;
          toast.success("Logged in successfully");
        } else {
          throw signInError;
        }
      } else {
        toast.success("Logged in successfully");
      }
      
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Enter Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter the shared password to access the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="text-center text-2xl tracking-widest"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : "Enter"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
