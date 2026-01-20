import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { FcGoogle } from "react-icons/fc"
import { signInWithPopup } from "firebase/auth"
import { auth, provider } from "../firebase"

export default function LandingPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider)
      window.location.href = "/dashboard"
    } catch (error) {
      console.error(error)
    }
  }

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(isLogin ? "Logging in..." : "Signing up...")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB]">
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-bold text-[#0D47A1] mb-2 tracking-wide">
          NeuroHaven
        </h1>
        <p className="text-[#1E88E5] text-lg">Your calm corner for mental wellness ✨</p>
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row gap-8"
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
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="submit"
                className="bg-[#1E88E5] hover:bg-[#1565C0] text-white"
              >
                {isLogin ? "Login" : "Create Account"}
              </Button>
            </form>

            <div className="my-4">
              <Separator />
            </div>

            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGoogleLogin}
            >
              <FcGoogle className="text-xl" />
              Continue with Google
            </Button>

            <p className="mt-4 text-sm text-center text-[#1565C0] cursor-pointer hover:underline"
               onClick={() => setIsLogin(!isLogin)}>
              {isLogin
                ? "Don’t have an account? Sign up"
                : "Already have an account? Login"}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
