
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User as UserIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Register = () => {
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Redirect authenticated users to homepage
  if (user && !loading) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Sign up via Supabase Auth (with required redirect)
      const redirectUrl = `${window.location.origin}/`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      // If user was created successfully, assign role
      if (data?.user?.id) {
        console.log("Assigning role to user:", data.user.id, "Role:", role);
        
        // Assign 'student' or 'teacher' role in user_roles table
        const { error: roleError } = await supabase.from("user_roles").insert({
          user_id: data.user.id,
          role: role,
        });

        if (roleError) {
          console.error("Error assigning role:", roleError);
          toast({
            title: "Role assignment failed",
            description: "Account created but role assignment failed. Please contact support.",
            variant: "destructive",
          });
        } else {
          console.log("Role assigned successfully");
        }
      }

      toast({
        title: "Registration successful!",
        description: "Your account has been created. You can now log in.",
      });

      setSubmitting(false);
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background">
      <div className="flex items-center mb-3 gap-2">
        <UserIcon className="text-primary" size={28} />
        <span className="font-bold text-lg">Register for SmartLearn</span>
      </div>
      <div className="w-full max-w-sm bg-white p-7 rounded-lg border border-gray-200 shadow animate-fade-in">
        <h2 className="text-xl font-bold mb-4 text-center text-primary">Create an account</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-3 mb-1 rounded-md bg-muted/60 p-2">
            <label className={`flex-1 cursor-pointer text-center font-semibold py-1 rounded ${role === "student" ? "bg-emerald-50 text-emerald-700" : "hover:bg-gray-100"}`}>
              <input
                type="radio"
                name="role"
                className="sr-only"
                checked={role === "student"}
                value="student"
                onChange={() => setRole("student")}
              />
              Student
            </label>
            <label className={`flex-1 cursor-pointer text-center font-semibold py-1 rounded ${role === "teacher" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"}`}>
              <input
                type="radio"
                name="role"
                className="sr-only"
                checked={role === "teacher"}
                value="teacher"
                onChange={() => setRole("teacher")}
              />
              Teacher
            </label>
          </div>
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
          <Button type="submit" className="bg-emerald-600 text-white hover:bg-emerald-700 mt-2" disabled={submitting}>
            {submitting ? "Registering..." : "Register"}
          </Button>
        </form>
        <div className="flex justify-between items-center mt-5 text-xs">
          <Link to="/login" className="text-blue-600 underline hover:text-blue-800">Login</Link>
          <Link to="/" className="text-muted-foreground underline hover:text-primary/70">Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
