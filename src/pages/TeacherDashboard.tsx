
import { Book, Users, Settings, LayoutDashboard } from "lucide-react";
import AIAssistant from "@/components/AIAssistant";

export default function TeacherDashboard() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-muted/40">
      {/* Sidebar */}
      <aside className="bg-background border-r w-full md:w-64 p-6 flex-shrink-0">
        <div className="flex items-center gap-2 mb-8">
          <Book className="text-primary" />
          <span className="font-bold text-xl">Teacher Panel</span>
        </div>
        <nav className="space-y-2">
          <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent font-medium">
            <LayoutDashboard size={19} /> My Dashboard
          </a>
          <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent font-medium">
            <Users size={19} /> My Students
          </a>
          <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent font-medium">
            <Book size={19} /> My Courses
          </a>
        </nav>
      </aside>
      {/* Main */}
      <main className="flex-1 p-8 flex flex-col gap-8 overflow-auto">
        <section>
          <h2 className="text-2xl font-bold mb-2">Welcome, Teacher!</h2>
          <p className="text-muted-foreground max-w-xl">
            Here you can manage your courses, check-in on your students' learning progress, and utilize EdTech tools to deliver engaging instruction.
          </p>
        </section>
        <section>
          {/* Placeholder for teacher dashboard stats */}
          <div className="rounded-lg border bg-background p-4 mb-8">[Your Classes Overview - Coming Soon]</div>
        </section>
        <section>
          <AIAssistant prompt="Ask for teaching tips or student info..." />
        </section>
      </main>
    </div>
  );
}
