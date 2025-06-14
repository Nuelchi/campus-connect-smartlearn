
import DashboardLayout from "@/components/DashboardLayout";
import TeacherDashboardRenderer from "@/components/teacher/TeacherDashboardRenderer";
import { useSearchParams } from "react-router-dom";

export default function TeacherDashboard() {
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section");
  const tab = searchParams.get("tab");

  return (
    <DashboardLayout 
      title="Teacher Dashboard" 
      subtitle="Manage your courses and students"
    >
      <TeacherDashboardRenderer section={section} tab={tab} />
    </DashboardLayout>
  );
}
