import TeacherSectionRenderer from "./TeacherSectionRenderer";
import TeacherDashboardContent from "./TeacherDashboardContent";

interface TeacherDashboardRendererProps {
  section: string | null;
  tab: string | null;
}

export default function TeacherDashboardRenderer({ section, tab }: TeacherDashboardRendererProps) {
  console.log("TeacherDashboardRenderer - section:", section, "tab:", tab);
  
  // If we have a section parameter, render the section-specific content
  if (section && section !== "dashboard") {
    return <TeacherSectionRenderer section={section} />;
  }
  
  // Otherwise, render the main dashboard content with tabs
  return <TeacherDashboardContent tab={tab} />;
}
