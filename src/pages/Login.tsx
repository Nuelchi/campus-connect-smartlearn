
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User as UserIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate("/");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background">
      <div className="flex items-center mb-3 gap-2">
        <UserIcon className="text-primary" size={28} />
        <span className="font-bold text-lg">SmartLearn Login</span>
      </div>
      <div className="w-full max-w-sm bg-white p-7 rounded-lg border border-gray-200 shadow animate-fade-in">
        <h2 className="text-xl font-bold mb-4 text-center text-primary">Sign in</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="email"
            required
            placeholder="Email"
            autoFocus
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={submitting}
          />
          <Input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={submitting}
          />
          <Button type="submit" className="bg-primary text-white hover:bg-primary/90 mt-2" disabled={submitting}>
            {submitting ? "Logging in..." : "Login"}
          </Button>
        </form>
        <div className="flex justify-between items-center mt-5 text-xs">
          <Link to="/register" className="text-blue-600 underline hover:text-blue-800">Register</Link>
          <Link to="/" className="text-muted-foreground underline hover:text-primary/70">Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
