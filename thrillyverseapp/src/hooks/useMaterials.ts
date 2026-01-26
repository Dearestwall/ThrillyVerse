// src/hooks/useMaterials.ts
import { useState, useEffect } from 'react';

export interface Material {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  description: string;
  fileType: string;
  fileUrl: string;
  thumbnailUrl?: string;
  downloads: number;
  uploadedBy: string;
  uploadedDate: string;
  tags: string[];
}

interface UseMaterialsOptions {
  subject?: string;
  chapter?: string;
  search?: string;
  limit?: number;
}

export function useMaterials(options: UseMaterialsOptions = {}) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (options.subject) params.append('subject', options.subject);
        if (options.chapter) params.append('chapter', options.chapter);
        if (options.search) params.append('search', options.search);
        if (options.limit) params.append('limit', options.limit.toString());

        const response = await fetch(`/api/materials?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          setMaterials(data.data);
        } else {
          setError(data.error || 'Failed to fetch materials');
        }
      } catch (err) {
        setError('An error occurred while fetching materials');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [options.subject, options.chapter, options.search, options.limit]);

  const refetch = async () => {
    setLoading(true);
    // Trigger re-fetch
  };

  return { materials, loading, error, refetch };
}