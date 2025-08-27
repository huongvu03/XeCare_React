'use client';

import { PublicGarageResponseDto } from '@/services/api';
import { GarageCard } from './GarageCard';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, Grid3X3, List, Search, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface GarageListProps {
  garages: PublicGarageResponseDto[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  onLoadMore: () => void;
  onViewDetails?: (garage: PublicGarageResponseDto) => void;
  onContact?: (garage: PublicGarageResponseDto) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

export function GarageList({ 
  garages, 
  isLoading, 
  error, 
  hasMore, 
  onLoadMore, 
  onViewDetails, 
  onContact,
  viewMode = 'grid',
  onViewModeChange
}: GarageListProps) {
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
          <div className="text-red-500 mb-4">
            <Search className="w-12 h-12 mx-auto mb-3 text-red-400" />
            <p className="text-lg font-semibold">Có lỗi xảy ra</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  if (!isLoading && garages.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 max-w-lg mx-auto">
          <MapPin className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Không tìm thấy garage nào
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Hãy thử thay đổi tiêu chí tìm kiếm hoặc mở rộng phạm vi tìm kiếm để tìm thấy garage phù hợp
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Tải lại trang
            </Button>
            <Button>
              <Search className="w-4 h-4 mr-2" />
              Tìm kiếm khác
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with results count and view mode toggle */}
      <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Search className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Kết quả tìm kiếm
              </h2>
              <p className="text-sm text-gray-600">
                Tìm thấy <span className="font-semibold text-blue-600">{garages.length}</span> garage
              </p>
            </div>
          </div>
          
          {isLoading && (
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-sm text-blue-700 font-medium">Đang tải...</span>
            </div>
          )}
        </div>
        
        {onViewModeChange && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 font-medium">Hiển thị:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('grid')}
                className={`rounded-md transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('list')}
                className={`rounded-md transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Garage Grid/List */}
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
        : 'space-y-4'
      }>
        {garages.map((garage) => (
          <GarageCard
            key={garage.id}
            garage={garage}
            onViewDetails={onViewDetails}
            onContact={onContact}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-6">
          <Button
            onClick={onLoadMore}
            disabled={isLoading}
            variant="outline"
            size="lg"
            className="px-8 py-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Đang tải...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5 mr-2" />
                Tải thêm garage
              </>
            )}
          </Button>
        </div>
      )}

      {/* End of results */}
      {!hasMore && garages.length > 0 && (
        <div className="text-center py-8">
          <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-gray-600 font-medium">
              Đã hiển thị tất cả kết quả
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Tìm thấy {garages.length} garage phù hợp
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
