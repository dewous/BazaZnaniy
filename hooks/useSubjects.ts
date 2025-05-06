import { useEffect, useState } from 'react';
import { mockSubjects } from '../data/mockData';

export function useSubjects() {
  const [subjects, setSubjects] = useState<typeof mockSubjects>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setSubjects(mockSubjects);
      setLoading(false);
    }, 500); // имитация запроса
  }, []);

  return { subjects, loading };
}
