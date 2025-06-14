
import { useState } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // TODO: Replace with Supabase Auth connection and role detection for Teacher/Student.

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Demo: Authentication coming soon (student/teacher)!");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background">
      <div className="flex items-center mb-3 gap-2">
        <User className="text-primary" size={28} />
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
          />
          <Input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button type="submit" className="bg-primary text-white hover:bg-primary/90 mt-2">
            Login
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
