import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import EmotionTwin from "./pages/EmotionTwin";
import PeerPods from "./pages/PeerPods";
import Journal from "./pages/Journal";
import Calmscapes from "./pages/Calmscapes";
import CounselorCare from "./pages/CounselorCare";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

// Protect certain routes (like dashboard)
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  if (!user) return <Login />;
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/emotion-twin"
              element={
                <ProtectedRoute>
                  <EmotionTwin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/peer-pods"
              element={
                <ProtectedRoute>
                  <PeerPods />
                </ProtectedRoute>
              }
            />
            <Route
              path="/journal"
              element={
                <ProtectedRoute>
                  <Journal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/counselor"
              element={
                <ProtectedRoute>
                  <CounselorCare />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calmscapes"
              element={
                <ProtectedRoute>
                  <Calmscapes />
                </ProtectedRoute>
              }
            />

            {/* Catch-All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
