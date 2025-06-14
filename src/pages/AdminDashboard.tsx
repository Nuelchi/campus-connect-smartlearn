
import { Book, Users, Settings, LayoutDashboard } from "lucide-react";
import AIAssistant from "@/components/AIAssistant";

export default function AdminDashboard() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-muted/40">
      {/* Sidebar */}
      <aside className="bg-background border-r w-full md:w-64 p-6 flex-shrink-0">
        <div className="flex items-center gap-2 mb-8">
          <Book className="text-primary" />
          <span className="font-bold text-xl">Admin Panel</span>
        </div>
        <nav className="space-y-2">
          <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent font-medium">
            <LayoutDashboard size={19} /> Dashboard Home
          </a>
          <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent font-medium">
            <Users size={19} /> Manage Users
          </a>
          <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent font-medium">
            <Settings size={19} /> Settings
          </a>
        </nav>
      </aside>
      {/* Main */}
      <main className="flex-1 p-8 flex flex-col gap-8 overflow-auto">
        <section>
          <h2 className="text-2xl font-bold mb-2">Welcome, Admin!</h2>
          <p className="text-muted-foreground max-w-xl">
            This is your central hub to manage SmartLearn. Here you can monitor user activity, edit platform settings, and oversee all aspects of the LMS. 
          </p>
        </section>
        <section>
          {/* Placeholder for admin analytics, etc */}
          <div className="rounded-lg border bg-background p-4 mb-8">[Analytics Panel - Coming Soon]</div>
        </section>
        <section>
          <AIAssistant prompt="Ask anything about your admin tools..." />
        </section>
      </main>
    </div>
  );
}
