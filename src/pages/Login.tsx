
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User as UserIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Redirect authenticated users
  if (user && !loading) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate("/");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="flex items-center mb-6 gap-3">
        <div className="p-2 bg-primary rounded-xl">
          <UserIcon className="text-primary-foreground" size={32} />
        </div>
        <span className="font-bold text-2xl text-gray-800">Welcome Back</span>
      </div>
      
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-gray-100 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign in to your account</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="Enter your email"
              autoFocus
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={submitting}
              className="border-gray-200 focus:border-primary focus:ring-primary"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
            <Input
              id="password"
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={submitting}
              className="border-gray-200 focus:border-primary focus:ring-primary"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 mt-6 transition-colors" 
            disabled={submitting}
          >
            {submitting ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <div className="flex justify-between items-center mt-6 text-sm">
          <span className="text-gray-600">Don't have an account?</span>
          <Link to="/register" className="text-blue-600 font-medium hover:text-blue-700 hover:underline">
            Sign Up
          </Link>
        </div>
        
        <div className="text-center mt-4">
          <Link to="/" className="text-gray-500 text-xs hover:text-gray-700 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
