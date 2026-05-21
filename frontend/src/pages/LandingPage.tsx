import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function LandingPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, loading, loginWithPassword, register, loginWithGoogle } = useAuth();

  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  const handleGoogleLogin = async () => {
    setSubmitting(true);
    try {
      await loginWithGoogle();
      navigate("/dashboard", { replace: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Google sign-in failed";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isLogin) {
        await loginWithPassword(email, password);
      } else {
        await register(email, password, name.trim() || undefined);
      }
      navigate("/dashboard", { replace: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 p-6 bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB]">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" asChild className="text-[#1565C0]">
          <Link to="/">← Home</Link>
        </Button>
      </div>

      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-bold text-[#0D47A1] mb-2 tracking-wide">NeuroHaven</h1>
        <p className="text-[#1E88E5] text-lg">Your calm corner for mental wellness ✨</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Card className="w-80 backdrop-blur-md bg-white/70 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-[#0D47A1]">
              {isLogin ? "Login" : "Sign Up"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="flex flex-col gap-4">
              {!isLogin && (
                <Input
                  type="text"
                  placeholder="Display name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              )}
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <Input
                type="password"
                placeholder="Password (min 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#1E88E5] hover:bg-[#1565C0] text-white"
              >
                {submitting ? "Please wait…" : isLogin ? "Login" : "Create Account"}
              </Button>
            </form>

            <div className="my-4">
              <Separator />
            </div>

            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGoogleLogin}
            >
              <FcGoogle className="text-xl" />
              Continue with Google
            </Button>

            <p
              className="mt-4 text-sm text-center text-[#1565C0] cursor-pointer hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Don’t have an account? Sign up" : "Already have an account? Login"}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
