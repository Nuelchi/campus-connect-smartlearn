
import DashboardLayout from "@/components/DashboardLayout";
import TeacherSectionRenderer from "@/components/teacher/TeacherSectionRenderer";
import TeacherDashboardContent from "@/components/teacher/TeacherDashboardContent";
import { useSearchParams } from "react-router-dom";

export default function TeacherDashboard() {
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section");
  const tab = searchParams.get("tab");

  // Render content based on section parameter
  const renderContent = () => {
    if (section) {
      return <TeacherSectionRenderer section={section} />;
    }
    return <TeacherDashboardContent tab={tab} />;
  };

  return (
    <DashboardLayout 
      title="Teacher Dashboard" 
      subtitle="Manage your courses and students"
    >
      {renderContent()}
    </DashboardLayout>
  );
}
