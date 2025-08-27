import { useState, useEffect } from 'react';
import { GarageStats } from '../services/api';
import { apiWrapper } from '../services/apiWrapper';

interface UseGarageOptionsReturn {
  // Data
  services: string[];
  vehicleTypes: string[];
  stats: GarageStats | null;
  
  // Loading states
  isLoadingServices: boolean;
  isLoadingVehicleTypes: boolean;
  isLoadingStats: boolean;
  
  // Error states
  servicesError: string | null;
  vehicleTypesError: string | null;
  statsError: string | null;
  
  // Refresh functions
  refreshServices: () => Promise<void>;
  refreshVehicleTypes: () => Promise<void>;
  refreshStats: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

export function useGarageOptions(): UseGarageOptionsReturn {
  // State
  const [services, setServices] = useState<string[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);
  const [stats, setStats] = useState<GarageStats | null>(null);
  
  // Loading states
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [isLoadingVehicleTypes, setIsLoadingVehicleTypes] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  
  // Error states
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [vehicleTypesError, setVehicleTypesError] = useState<string | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Load services
  const loadServices = async () => {
    try {
      setIsLoadingServices(true);
      setServicesError(null);
      
      const response = await apiWrapper.getAvailableServices();
      setServices(response);
    } catch (err) {
      setServicesError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải danh sách dịch vụ');
      console.error('Load services error:', err);
    } finally {
      setIsLoadingServices(false);
    }
  };

  // Load vehicle types
  const loadVehicleTypes = async () => {
    try {
      setIsLoadingVehicleTypes(true);
      setVehicleTypesError(null);
      
      const response = await apiWrapper.getAvailableVehicleTypes();
      setVehicleTypes(response);
    } catch (err) {
      setVehicleTypesError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải danh sách loại xe');
      console.error('Load vehicle types error:', err);
    } finally {
      setIsLoadingVehicleTypes(false);
    }
  };

  // Load stats
  const loadStats = async () => {
    try {
      setIsLoadingStats(true);
      setStatsError(null);
      
      const response = await apiWrapper.getGarageStats();
      setStats(response);
    } catch (err) {
      setStatsError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải thống kê');
      console.error('Load stats error:', err);
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Refresh functions
  const refreshServices = async () => {
    await loadServices();
  };

  const refreshVehicleTypes = async () => {
    await loadVehicleTypes();
  };

  const refreshStats = async () => {
    await loadStats();
  };

  const refreshAll = async () => {
    await Promise.all([
      loadServices(),
      loadVehicleTypes(),
      loadStats()
    ]);
  };

  // Load data on mount
  useEffect(() => {
    refreshAll();
  }, []);

  return {
    // Data
    services,
    vehicleTypes,
    stats,
    
    // Loading states
    isLoadingServices,
    isLoadingVehicleTypes,
    isLoadingStats,
    
    // Error states
    servicesError,
    vehicleTypesError,
    statsError,
    
    // Refresh functions
    refreshServices,
    refreshVehicleTypes,
    refreshStats,
    refreshAll,
  };
}
