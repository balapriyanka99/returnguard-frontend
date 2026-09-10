import { useState, useEffect, useCallback } from 'react';
import { ReturnsListResponse, ReturnsFilterParams } from '../api/types';
import { getReturns } from '../api/returns';

export function useReturns(initialParams?: ReturnsFilterParams) {
  const [params, setParams] = useState<ReturnsFilterParams | undefined>(initialParams);
  const [data, setData] = useState<ReturnsListResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReturns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getReturns(params);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch returns');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

  return {
    data,
    loading,
    error,
    params,
    setParams,
    refresh: fetchReturns
  };
}
