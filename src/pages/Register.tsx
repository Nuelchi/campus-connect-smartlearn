
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User as UserIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Register = () => {
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
      // Sign up via Supabase Auth with user metadata
      const redirectUrl = `${window.location.origin}/`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
          },
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
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="flex items-center mb-6 gap-3">
        <div className="p-2 bg-primary rounded-xl">
          <UserIcon className="text-primary-foreground" size={32} />
        </div>
        <span className="font-bold text-2xl text-gray-800">Join SmartLearn</span>
      </div>
      
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-gray-100 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create your account</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">I am a:</Label>
            <div className="flex gap-2 rounded-lg bg-gray-50 p-1">
              <label className={`flex-1 cursor-pointer text-center font-medium py-3 rounded-md transition-all ${
                role === "student" 
                  ? "bg-emerald-500 text-white shadow-sm" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}>
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
              <label className={`flex-1 cursor-pointer text-center font-medium py-3 rounded-md transition-all ${
                role === "teacher" 
                  ? "bg-blue-500 text-white shadow-sm" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}>
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
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</Label>
              <Input
                id="firstName"
                type="text"
                required
                placeholder="John"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                disabled={submitting}
                className="border-gray-200 focus:border-primary focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                required
                placeholder="Doe"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                disabled={submitting}
                className="border-gray-200 focus:border-primary focus:ring-primary"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="john@example.com"
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
              placeholder="Create a strong password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={submitting}
              className="border-gray-200 focus:border-primary focus:ring-primary"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 mt-6 transition-colors" 
            disabled={submitting}
          >
            {submitting ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="flex justify-between items-center mt-6 text-sm">
          <span className="text-gray-600">Already have an account?</span>
          <Link to="/login" className="text-blue-600 font-medium hover:text-blue-700 hover:underline">
            Sign In
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

export default Register;
