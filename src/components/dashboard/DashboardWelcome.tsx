
import { useAuth } from "@/hooks/useAuth";

interface DashboardWelcomeProps {
  roleSpecificMessage?: string;
}

export default function DashboardWelcome({ roleSpecificMessage }: DashboardWelcomeProps) {
  const { user, profile, role } = useAuth();

  const getDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return user?.email?.split('@')[0] || "User";
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {getGreeting()}, {getDisplayName()}!
      </h1>
      <p className="text-lg text-muted-foreground">
        {roleSpecificMessage || `Welcome to your ${role} dashboard.`}
      </p>
    </div>
  );
}
