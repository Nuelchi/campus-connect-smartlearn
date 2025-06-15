
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type CourseMaterial = Tables<"course_materials">;

export function useCourseMaterials(courseId: string) {
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);

  useEffect(() => {
    fetchCourseMaterials();
  }, [courseId]);

  const fetchCourseMaterials = async () => {
    const { data, error } = await supabase
      .from("course_materials")
      .select("*")
      .eq("course_id", courseId)
      .eq("content_type", "PDF");

    if (!error && data) {
      setMaterials(data);
    }
  };

  const pdfMaterials = materials.filter(material => 
    material.file_url && (material.file_url.endsWith('.pdf') || material.content_type === 'PDF')
  );

  return {
    materials,
    pdfMaterials
  };
}
