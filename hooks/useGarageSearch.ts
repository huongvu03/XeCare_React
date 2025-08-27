import { useState, useEffect, useCallback } from 'react';
import { PublicGarageResponseDto, GarageSearchParams, PaginatedResponse } from '../services/api';
import { apiWrapper } from '../services/apiWrapper';

interface UseGarageSearchOptions {
  initialParams?: GarageSearchParams;
  usePagination?: boolean;
  pageSize?: number;
}

interface UseGarageSearchReturn {
  // Data
  garages: PublicGarageResponseDto[];
  paginatedData?: PaginatedResponse<PublicGarageResponseDto>;
  
  // Loading states
  isLoading: boolean;
  isInitialLoading: boolean;
  
  // Error state
  error: string | null;
  
  // Search functions
  search: (params: GarageSearchParams) => Promise<void>;
  searchAdvanced: (params: GarageSearchParams) => Promise<void>;
  searchByName: (name: string) => Promise<void>;
  searchByAddress: (address: string) => Promise<void>;
  searchNearby: (latitude: number, longitude: number, radius?: number) => Promise<void>;
  
  // Pagination functions
  loadMore: () => Promise<void>;
  goToPage: (page: number) => Promise<void>;
  
  // Reset
  reset: () => void;
  
  // Current state
  currentParams: GarageSearchParams;
  hasMore: boolean;
}

export function useGarageSearch(options: UseGarageSearchOptions = {}): UseGarageSearchReturn {
  const {
    initialParams = {},
    usePagination = false,
    pageSize = 10
  } = options;

  // State
  const [garages, setGarages] = useState<PublicGarageResponseDto[]>([]);
  const [paginatedData, setPaginatedData] = useState<PaginatedResponse<PublicGarageResponseDto> | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentParams, setCurrentParams] = useState<GarageSearchParams>(initialParams);

  // Search functions
  const search = useCallback(async (params: GarageSearchParams) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const searchParams = { ...currentParams, ...params };
      setCurrentParams(searchParams);

      if (usePagination) {
        const response = await apiWrapper.searchGaragesWithPagination({
          ...searchParams,
          size: pageSize
        });
        setPaginatedData(response);
        setGarages(response.content);
      } else {
        const response = await apiWrapper.searchGaragesAdvanced(searchParams);
        setGarages(response);
        setPaginatedData(undefined);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tìm kiếm');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentParams, usePagination, pageSize]);

  const searchAdvanced = useCallback(async (params: GarageSearchParams) => {
    await search(params);
  }, [search]);

  const searchByName = useCallback(async (name: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiWrapper.searchGaragesByName(name);
      setGarages(response);
      setCurrentParams({ name });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tìm kiếm theo tên');
      console.error('Search by name error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchByAddress = useCallback(async (address: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiWrapper.searchGaragesByAddress(address);
      setGarages(response);
      setCurrentParams({ address });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tìm kiếm theo địa chỉ');
      console.error('Search by address error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchNearby = useCallback(async (latitude: number, longitude: number, radius: number = 10) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (usePagination) {
        const response = await apiWrapper.findNearbyGaragesWithPagination(latitude, longitude, radius, 0, pageSize);
        setPaginatedData(response);
        setGarages(response.content);
      } else {
        const response = await apiWrapper.findNearbyGarages(latitude, longitude, radius);
        setGarages(response);
        setPaginatedData(undefined);
      }
      
      setCurrentParams({ latitude, longitude, radius });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tìm kiếm gần đây');
      console.error('Search nearby error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [usePagination, pageSize]);

  // Pagination functions
  const loadMore = useCallback(async () => {
    if (!paginatedData || paginatedData.last || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const nextPage = paginatedData.number + 1;
      const response = await apiWrapper.searchGaragesWithPagination({
        ...currentParams,
        page: nextPage,
        size: pageSize
      });
      
      setPaginatedData(response);
      setGarages(prev => [...prev, ...response.content]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải thêm dữ liệu');
      console.error('Load more error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [paginatedData, currentParams, pageSize, isLoading]);

  const goToPage = useCallback(async (page: number) => {
    if (!usePagination) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiWrapper.searchGaragesWithPagination({
        ...currentParams,
        page,
        size: pageSize
      });
      
      setPaginatedData(response);
      setGarages(response.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi chuyển trang');
      console.error('Go to page error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [usePagination, currentParams, pageSize]);

  // Reset function
  const reset = useCallback(() => {
    setGarages([]);
    setPaginatedData(undefined);
    setError(null);
    setCurrentParams(initialParams);
  }, [initialParams]);

  // Computed values
  const hasMore = paginatedData ? !paginatedData.last : false;

  // Initial load
  useEffect(() => {
    console.log('useGarageSearch: Initial load started');
    setIsInitialLoading(true);
    // Load all garages on mount
    search({}).finally(() => {
      setIsInitialLoading(false);
      console.log('useGarageSearch: Initial load completed');
    });
  }, []); // Only run once on mount

  return {
    // Data
    garages,
    paginatedData,
    
    // Loading states
    isLoading,
    isInitialLoading,
    
    // Error state
    error,
    
    // Search functions
    search,
    searchAdvanced,
    searchByName,
    searchByAddress,
    searchNearby,
    
    // Pagination functions
    loadMore,
    goToPage,
    
    // Reset
    reset,
    
    // Current state
    currentParams,
    hasMore,
  };
}
