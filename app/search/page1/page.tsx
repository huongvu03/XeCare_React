'use client';

import { useState } from 'react';
import { PublicGarageResponseDto, GarageSearchParams } from '@/services/api';
import { useGarageSearch } from '@/hooks/useGarageSearch';
import { useGarageOptions } from '@/hooks/useGarageOptions';
import { SearchFilters } from '@/components/garage/SearchFilters';
import { GarageCard } from '@/components/garage/GarageCard';
import { GarageMap } from '@/components/garage/GarageMap';
import { Button } from '@/components/ui/button';

export default function GarageSearchPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

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

  // Handle search
  const handleSearch = (params: GarageSearchParams) => {
    search(params);
  };

  // Handle view details
  const handleViewDetails = (garage: PublicGarageResponseDto) => {
    console.log('View details:', garage);
  };

  // Handle contact
  const handleContact = (garage: PublicGarageResponseDto) => {
    console.log('Contact:', garage);
  };

  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'map' : 'grid');
  };

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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Kết quả tìm kiếm
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Tìm thấy {garages.length} garage
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

        {/* Garage Grid/Map */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {garages.map((garage) => (
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
            garages={garages}
            onGarageSelect={handleViewDetails}
            selectedGarage={undefined}
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
        {!isLoading && garages.length === 0 && (
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
