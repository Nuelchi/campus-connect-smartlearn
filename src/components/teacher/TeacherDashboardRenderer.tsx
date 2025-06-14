
import TeacherSectionRenderer from "./TeacherSectionRenderer";
import TeacherDashboardContent from "./TeacherDashboardContent";

interface TeacherDashboardRendererProps {
  section: string | null;
  tab: string | null;
}

export default function TeacherDashboardRenderer({ section, tab }: TeacherDashboardRendererProps) {
  // Render content based on section parameter
  if (section) {
    return <TeacherSectionRenderer section={section} />;
  }
  
  return <TeacherDashboardContent tab={tab} />;
}
