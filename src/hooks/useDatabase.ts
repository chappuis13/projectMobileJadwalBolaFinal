// src/hooks/useDatabase.ts
// Custom hook untuk initialize dan manage database
import { useState, useEffect } from 'react';
import { initDB } from '../services/sqlite';

export const useDatabase = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initDB();
        setIsReady(true);
        console.log('✅ Database initialized successfully');
      } catch (err) {
        const error = err as Error;
        setError(error);
        console.error('❌ Database initialization failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  return { isLoading, isReady, error };
};
