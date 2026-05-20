import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate("/dashboard", { replace: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Login failed";
      toast.error(message);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-neutral-50 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to NeuroHaven</h1>
      <p className="text-gray-600 mb-8">Sign in to continue your mental wellness journey</p>
      <Button onClick={handleLogin} className="px-6 py-3 rounded-xl text-lg">
        Continue with Google
      </Button>
    </div>
  );
}
