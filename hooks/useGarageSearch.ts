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
      
      // Use the new params directly instead of merging with currentParams
      // This ensures fresh search every time
      console.log('useGarageSearch: Calling searchGaragesAdvanced with params:', params);
      setCurrentParams(params);

      const response = await apiWrapper.searchGaragesAdvanced(params);
      setGarages(response);
      setPaginatedData(undefined);
      console.log('useGarageSearch: Received', response.length, 'garages');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tìm kiếm');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    // Temporarily disable load more due to pagination API issues
    console.log('Load more is temporarily disabled due to pagination API issues');
    return;
  }, []);

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
  const reset = useCallback(async () => {
    console.log('useGarageSearch: Reset started');
    setGarages([]);
    setPaginatedData(undefined);
    setError(null);
    setCurrentParams({});
    
    try {
      console.log('useGarageSearch: Triggering reload with empty params');
      setIsLoading(true);
      setError(null);
      
      // Use basic search to get all garages with status=ACTIVE
      const response = await apiWrapper.searchGaragesAdvanced({ status: 'ACTIVE' });
      setGarages(response);
      setPaginatedData(undefined);
      setCurrentParams({ status: 'ACTIVE' });
      console.log('useGarageSearch: Reset completed successfully, received', response.length, 'garages');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi reset');
      console.error('useGarageSearch: Reset error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Computed values
  const hasMore = paginatedData ? !paginatedData.last : false;

  // Initial load
  useEffect(() => {
    console.log('useGarageSearch: Initial load started');
    setIsInitialLoading(true);
    // Load all active garages on mount
    search({ status: 'ACTIVE' }).finally(() => {
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
