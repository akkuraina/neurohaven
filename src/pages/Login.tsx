import { signInWithPopup, provider, auth } from "../firebase";
import { Button } from "@/components/ui/button";

export default function Login() {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
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
