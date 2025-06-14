
import { useState } from "react";
import { Link } from "react-router-dom";
import { Book } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // TODO: Replace with Supabase Auth connection & secure admin login logic.

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Demo: Secure admin authentication coming soon!");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background">
      <div className="flex items-center mb-4 gap-2">
        <Book className="text-primary" size={30} />
        <span className="font-bold text-xl">SmartLearn Admin</span>
      </div>
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-sm border border-gray-200 animate-fade-in">
        <h2 className="text-2xl font-bold mb-5 text-primary text-center">Admin Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="email"
            required
            autoFocus
            placeholder="Admin Email"
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
          <Button type="submit" className="mt-2 bg-primary text-white hover:bg-primary/90">
            Login
          </Button>
        </form>
        <p className="text-xs mt-6 text-gray-500 text-center">
          <Link to="/" className="underline hover:text-primary/80">Back to Home</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
