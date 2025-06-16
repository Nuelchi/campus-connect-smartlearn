
import AssignmentSubmissions from "./AssignmentSubmissions";
import Gradebook from "./Gradebook";
import MessagingCenter from "./MessagingCenter";
import CertificateManagement from "./CertificateManagement";
import AssignmentManagement from "@/components/dashboard/AssignmentManagement";

interface TeacherSectionRendererProps {
  section: string;
}

export default function TeacherSectionRenderer({ section }: TeacherSectionRendererProps) {
  console.log("TeacherSectionRenderer - section:", section);
  
  switch (section) {
    case "assignments":
      return <AssignmentManagement userRole="teacher" />;
    case "submissions":
      return <AssignmentSubmissions />;
    case "gradebook":
      return <Gradebook />;
    case "messaging":
      return <MessagingCenter />;
    case "certificates":
      return <CertificateManagement />;
    default:
      return (
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Section Not Found</h2>
          <p className="text-muted-foreground">
            The section "{section}" doesn't exist or hasn't been implemented yet.
          </p>
        </div>
      );
  }
}
