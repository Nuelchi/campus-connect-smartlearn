
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function RoleSelector() {
  const [selectedRole, setSelectedRole] = useState<"student" | "teacher">("student");
  const [assigning, setAssigning] = useState(false);
  const { user } = useAuth();

  const assignRole = async () => {
    if (!user) return;

    setAssigning(true);
    console.log("Assigning role:", selectedRole, "to user:", user.id);

    // First check if user already has a role
    const { data: existingRole, error: checkError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing role:", checkError);
      toast({
        title: "Error",
        description: "Failed to check existing role. Please try again.",
        variant: "destructive",
      });
      setAssigning(false);
      return;
    }

    if (existingRole) {
      console.log("User already has role:", existingRole.role);
      toast({
        title: "Role Already Assigned",
        description: `You already have the ${existingRole.role} role assigned!`,
      });
      // Force a refresh of the auth state
      window.location.reload();
      setAssigning(false);
      return;
    }

    // If no existing role, insert new one
    const { error } = await supabase.from("user_roles").insert({
      user_id: user.id,
      role: selectedRole,
    });

    if (error) {
      console.error("Error assigning role:", error);
      toast({
        title: "Error",
        description: "Failed to assign role. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `You have been assigned the ${selectedRole} role!`,
      });
      // The useAuth hook will automatically detect the role change
    }

    setAssigning(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="p-8 rounded-xl bg-background border shadow text-center max-w-md">
        <div className="text-2xl font-bold mb-4">Choose Your Role</div>
        <div className="text-muted-foreground mb-6">
          Please select your role to access your dashboard.
        </div>
        
        <div className="flex gap-3 mb-6 rounded-md bg-muted/60 p-2">
          <label className={`flex-1 cursor-pointer text-center font-semibold py-2 rounded ${selectedRole === "student" ? "bg-emerald-50 text-emerald-700" : "hover:bg-gray-100"}`}>
            <input
              type="radio"
              name="role"
              className="sr-only"
              checked={selectedRole === "student"}
              value="student"
              onChange={() => setSelectedRole("student")}
            />
            Student
          </label>
          <label className={`flex-1 cursor-pointer text-center font-semibold py-2 rounded ${selectedRole === "teacher" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"}`}>
            <input
              type="radio"
              name="role"
              className="sr-only"
              checked={selectedRole === "teacher"}
              value="teacher"
              onChange={() => setSelectedRole("teacher")}
            />
            Teacher
          </label>
        </div>

        <Button 
          onClick={assignRole} 
          disabled={assigning}
          className="w-full"
        >
          {assigning ? "Checking Role..." : `Continue as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`}
        </Button>
      </div>
    </div>
  );
}
