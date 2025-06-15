
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Download, Calendar, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

interface Certificate {
  id: string;
  course_title: string;
  completion_date: string;
  final_grade: number | null;
  certificate_number: string;
  issued_at: string;
  certificate_template: string | null;
  notes: string | null;
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
    
    try {
      const { data: certificatesData, error } = await supabase
        .from("certificates")
        .select(`
          id,
          certificate_number,
          final_grade,
          completion_date,
          issued_at,
          certificate_template,
          notes,
          course:courses(title)
        `)
        .eq("student_id", user.id)
        .eq("is_active", true)
        .order("issued_at", { ascending: false });
      
      if (error) throw error;
      
      const formattedCertificates: Certificate[] = (certificatesData || []).map((cert) => ({
        id: cert.id,
        course_title: cert.course?.title || "Unknown Course",
        completion_date: cert.completion_date,
        final_grade: cert.final_grade,
        certificate_number: cert.certificate_number,
        issued_at: cert.issued_at,
        certificate_template: cert.certificate_template,
        notes: cert.notes,
      }));
      
      setCertificates(formattedCertificates);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      toast({
        title: "Error",
        description: "Failed to load certificates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = async (certificate: Certificate) => {
    try {
      // For now, we'll generate a simple certificate URL
      // In a production app, you'd generate a PDF or redirect to a certificate service
      const certificateUrl = `${window.location.origin}/certificate/${certificate.certificate_number}`;
      
      // Open in new tab for now
      window.open(certificateUrl, '_blank');
      
      toast({
        title: "Certificate",
        description: "Certificate opened in new tab",
      });
    } catch (error) {
      console.error("Error downloading certificate:", error);
      toast({
        title: "Error",
        description: "Failed to download certificate. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg font-semibold animate-pulse">Loading certificates...</div>
      </div>
    );
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
                Complete courses and receive certificates from your instructors
              </p>
            </CardContent>
          </Card>
        ) : (
          certificates.map((certificate) => (
            <Card key={certificate.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{certificate.course_title}</CardTitle>
                    <div className="space-y-1 mt-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar size={14} />
                        <span>Completed: {new Date(certificate.completion_date).toLocaleDateString()}</span>
                      </div>
                      <div className="text-xs font-mono text-muted-foreground">
                        #{certificate.certificate_number}
                      </div>
                    </div>
                  </div>
                  <Award className="h-8 w-8 text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {certificate.final_grade && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Final Grade:</span>
                      <Badge 
                        variant={
                          certificate.final_grade >= 90 ? "default" : 
                          certificate.final_grade >= 80 ? "secondary" : 
                          certificate.final_grade >= 70 ? "outline" : "destructive"
                        }
                      >
                        {certificate.final_grade}%
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Issued:</span>
                    <span>{new Date(certificate.issued_at).toLocaleDateString()}</span>
                  </div>

                  {certificate.notes && (
                    <div className="text-sm">
                      <span className="font-medium">Notes:</span>
                      <p className="text-muted-foreground mt-1">{certificate.notes}</p>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => downloadCertificate(certificate)}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Certificate
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
