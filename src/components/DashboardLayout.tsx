
import DashboardNavbar from "./DashboardNavbar";

interface DashboardLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function DashboardLayout({ title, subtitle, children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar title={title} subtitle={subtitle} />
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
