
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Download, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Certificate {
  id: string;
  course_title: string;
  completion_date: string;
  grade: number | null;
  certificate_url?: string;
}

export default function CertificateCenter() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchCertificates();
  }, [user]);

  const fetchCertificates = async () => {
    if (!user) return;
    
    setLoading(true);
    
    // For now, we'll simulate certificates based on completed enrollments
    // In a real system, you'd have a certificates table
    const { data: enrollments, error } = await supabase
      .from("enrollments")
      .select(`
        id,
        enrolled_at,
        course:courses(title)
      `)
      .eq("student_id", user.id)
      .eq("status", "active");
    
    if (!error && enrollments) {
      // Mock certificates for demo purposes
      const mockCertificates: Certificate[] = enrollments.map((enrollment, index) => ({
        id: enrollment.id,
        course_title: enrollment.course.title,
        completion_date: enrollment.enrolled_at,
        grade: Math.floor(Math.random() * 30) + 70, // Random grade between 70-100
        certificate_url: undefined // Would be actual certificate URL
      }));
      
      setCertificates(mockCertificates);
    }
    
    setLoading(false);
  };

  const downloadCertificate = (certificateId: string) => {
    // In a real implementation, this would download the actual certificate
    console.log("Downloading certificate:", certificateId);
    // You could generate a PDF certificate here or redirect to a certificate URL
  };

  if (loading) {
    return <div className="p-4">Loading certificates...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Certificates</h2>
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          <span className="text-sm text-muted-foreground">{certificates.length} earned</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {certificates.length === 0 ? (
          <Card className="md:col-span-2">
            <CardContent className="p-6 text-center">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No certificates earned yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Complete courses to earn certificates
              </p>
            </CardContent>
          </Card>
        ) : (
          certificates.map((certificate) => (
            <Card key={certificate.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{certificate.course_title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar size={16} />
                      <span className="text-sm text-muted-foreground">
                        Completed: {new Date(certificate.completion_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Award className="h-8 w-8 text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {certificate.grade && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Final Grade:</span>
                      <Badge 
                        variant={certificate.grade >= 80 ? "default" : certificate.grade >= 70 ? "secondary" : "destructive"}
                      >
                        {certificate.grade}%
                      </Badge>
                    </div>
                  )}
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => downloadCertificate(certificate.id)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Certificate
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
