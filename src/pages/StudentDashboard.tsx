
import { Book, Settings, LayoutDashboard } from "lucide-react";
import AIAssistant from "@/components/AIAssistant";

export default function StudentDashboard() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-muted/40">
      {/* Sidebar */}
      <aside className="bg-background border-r w-full md:w-64 p-6 flex-shrink-0">
        <div className="flex items-center gap-2 mb-8">
          <Book className="text-primary" />
          <span className="font-bold text-xl">Student Panel</span>
        </div>
        <nav className="space-y-2">
          <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent font-medium">
            <LayoutDashboard size={19} /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent font-medium">
            <Book size={19} /> My Courses
          </a>
          <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent font-medium">
            <Settings size={19} /> Settings
          </a>
        </nav>
      </aside>
      {/* Main */}
      <main className="flex-1 p-8 flex flex-col gap-8 overflow-auto">
        <section>
          <h2 className="text-2xl font-bold mb-2">Welcome, Student!</h2>
          <p className="text-muted-foreground max-w-xl">
            Explore your courses, track your learning journey, and unlock your full potential using our LMS. Don't forget to ask your AI Assistant if you get stuck!
          </p>
        </section>
        <section>
          {/* Placeholder for progress, schedule, etc */}
          <div className="rounded-lg border bg-background p-4 mb-8">[Your Progress - Coming Soon]</div>
        </section>
        <section>
          <AIAssistant prompt="Ask for study help or course info..." />
        </section>
      </main>
    </div>
  );
}
