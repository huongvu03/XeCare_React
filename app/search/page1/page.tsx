'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PublicGarageResponseDto, GarageSearchParams } from '@/services/api';
import { useGarageSearch } from '@/hooks/useGarageSearch';
import { useGarageOptions } from '@/hooks/useGarageOptions';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useNearbyGarages } from '@/hooks/useNearbyGarages';
import { SearchFilters } from '@/components/garage/SearchFilters';
import { GarageCard } from '@/components/garage/GarageCard';
import { GarageMap } from '@/components/garage/GarageMap';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Loader2 } from 'lucide-react';

export default function GarageSearchPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [sortByDistance, setSortByDistance] = useState(false);

  // Custom hooks
  const {
    garages,
    isLoading,
    error,
    hasMore,
    search,
    loadMore,
    reset
  } = useGarageSearch({
    usePagination: true,
    pageSize: 12
  });

  const {
    services,
    vehicleTypes,
    stats
  } = useGarageOptions();

  // Location hooks
  const {
    userLocation,
    isLocating,
    locationError,
    isSupported,
    requestLocation,
    clearLocation
  } = useUserLocation();

  // Nearby garages calculation
  const {
    sortedGarages,
    nearbyGarages,
    averageDistance
  } = useNearbyGarages(garages, userLocation, {
    sortByDistance: sortByDistance
  });

  // Handle search
  const handleSearch = (params: GarageSearchParams) => {
    search(params);
  };

  // Handle view details
  const handleViewDetails = (garage: PublicGarageResponseDto) => {
    router.push(`/garage-detail/${garage.id}`);
  };

  // Handle contact
  const handleContact = (garage: PublicGarageResponseDto) => {
    const phoneNumber = garage.phone;
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`);
    }
  };

  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'map' : 'grid');
  };

  // Handle location request
  const handleLocationRequest = async () => {
    await requestLocation();
    if (!sortByDistance) {
      setSortByDistance(true);
    }
  };

  // Handle clear location
  const handleClearLocation = () => {
    clearLocation();
    setSortByDistance(false);
  };

  // Use sorted garages when available
  const displayGarages = sortByDistance && userLocation ? sortedGarages : garages;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Tìm kiếm Garage
            </h1>
            <p className="text-gray-600 mt-1">
              Tìm garage uy tín, chất lượng gần bạn
            </p>
          </div>
        </div>
      </div>

      {/* Search Filters - Horizontal at top */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <SearchFilters
            services={services}
            vehicleTypes={vehicleTypes}
            onSearch={handleSearch}
            onReset={reset}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Results Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Kết quả tìm kiếm
            </h2>
            <div className="text-sm text-gray-600 mt-1">
              Tìm thấy {displayGarages.length} garage
              {userLocation && averageDistance > 0 && (
                <span className="ml-2">• Khoảng cách trung bình: {averageDistance}km</span>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Location Controls */}
            <div className="flex items-center gap-2">
              {!userLocation ? (
                <Button
                  onClick={handleLocationRequest}
                  disabled={isLocating || !isSupported}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {isLocating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <MapPin className="w-4 h-4" />
                  )}
                  {isLocating ? 'Đang tìm...' : 'Tìm vị trí của tôi'}
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleClearLocation}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4 text-green-600" />
                    Vị trí đã xác định
                  </Button>
                  
                  <Button
                    onClick={() => setSortByDistance(!sortByDistance)}
                    variant={sortByDistance ? "default" : "outline"}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                    {sortByDistance ? 'Đang sắp xếp gần nhất' : 'Sắp xếp theo khoảng cách'}
                  </Button>
                </div>
              )}
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleViewMode}
                suppressHydrationWarning
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Grid
              </button>
              <button
                onClick={toggleViewMode}
                suppressHydrationWarning
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'map'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Map
              </button>
            </div>
          </div>
        </div>

        {/* Location Error */}
        {locationError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">Lỗi định vị</span>
            </div>
            <p className="text-sm text-red-600 mt-1">{locationError.message}</p>
          </div>
        )}

        {/* Garage Grid/Map */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayGarages.map((garage) => (
              <GarageCard
                key={garage.id}
                garage={garage}
                onViewDetails={handleViewDetails}
                onContact={handleContact}
              />
            ))}
          </div>
        ) : (
          <GarageMap
            garages={displayGarages}
            onGarageSelect={handleViewDetails}
            selectedGarage={undefined}
            userLocation={userLocation}
          />
        )}

        {/* Load More Button - Only show in grid mode */}
        {viewMode === 'grid' && hasMore && (
          <div className="text-center pt-6">
            <Button
              onClick={loadMore}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Đang tải...' : 'Tải thêm'}
            </Button>
          </div>
        )}

        {/* No Results */}
        {!isLoading && displayGarages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy garage nào</h3>
            <p className="text-gray-600">Thử thay đổi bộ lọc tìm kiếm của bạn</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">Đang tải dữ liệu...</span>
          </div>
        </div>
      )}
    </div>
  );
}
