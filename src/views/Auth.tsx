"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
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

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

function toEmail(username: string): string {
  return `${username.toLowerCase()}@lotsync.app`;
}

export default function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuthActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!USERNAME_REGEX.test(username)) {
      toast.error(
        "Username must be 3-20 characters (letters, numbers, underscores)",
      );
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const email = toEmail(username);

    try {
      await signIn("password", {
        email,
        password,
        flow: "signIn",
      });
      toast.success("Signed in successfully");
      router.push("/active/pallets");
    } catch {
      toast.error("Invalid username or password");
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
          <CardTitle className="text-2xl font-bold tracking-tight">
            LotSync
          </CardTitle>
          <CardDescription>Sign in to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              className="h-12"
              autoFocus
              autoCapitalize="off"
              autoCorrect="off"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="h-12"
              minLength={6}
            />
            <Button type="submit" className="w-full h-12" disabled={loading}>
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground" />
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
