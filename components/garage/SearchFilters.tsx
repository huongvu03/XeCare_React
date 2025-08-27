'use client';

import { useState, useEffect } from 'react';
import { GarageSearchParams } from '@/services/api';
import { Search, Star, MapPin, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface SearchFiltersProps {
  services: string[];
  vehicleTypes: string[];
  onSearch: (params: GarageSearchParams) => void;
  onReset: () => void;
  isLoading?: boolean;
}

export function SearchFilters({ services, vehicleTypes, onSearch, onReset, isLoading }: SearchFiltersProps) {
  const [mounted, setMounted] = useState(false);
  const [searchParams, setSearchParams] = useState<GarageSearchParams>({
    name: '',
    address: '',
    service: 'all',
    vehicleType: 'all',
    minRating: 0,
    maxRating: 5,
    isVerified: undefined,
    sort: 'averageRating',
    direction: 'desc'
  });

  // Fix hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (field: keyof GarageSearchParams, value: any) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => 
          value !== '' && value !== undefined && value !== null && value !== 'all' && value !== 0
        )
      );
      onSearch(cleanParams);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleReset = () => {
    try {
      const resetParams: GarageSearchParams = {
        name: '',
        address: '',
        service: 'all',
        vehicleType: 'all',
        minRating: 0,
        maxRating: 5,
        isVerified: undefined,
        sort: 'averageRating',
        direction: 'desc'
      };
      setSearchParams(resetParams);
      
      // Immediately trigger search with empty params to show all garages
      onSearch({});
      
      // Call the parent reset function
      onReset();
    } catch (error) {
      console.error('Reset error:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <Card className="mb-6 border-0 shadow-md">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="flex gap-4">
              <div className="flex-1 h-10 bg-gray-200 rounded"></div>
              <div className="flex-1 h-10 bg-gray-200 rounded"></div>
              <div className="flex-1 h-10 bg-gray-200 rounded"></div>
              <div className="w-32 h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 border-0 shadow-md bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          {/* Tên garage */}
          <div className="flex-1 space-y-2">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Search className="w-4 h-4 text-blue-500" />
              Tên garage
            </Label>
            <Input
              placeholder="Nhập tên garage..."
              value={searchParams.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              onKeyPress={handleKeyPress}
              className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Dịch vụ */}
          <div className="flex-1 space-y-2">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Settings className="w-4 h-4 text-green-500" />
              Dịch vụ
            </Label>
            <Select
              value={searchParams.service || 'all'}
              onValueChange={(value) => handleInputChange('service', value)}
            >
              <SelectTrigger className="h-10 border-gray-200 focus:border-green-500 focus:ring-green-500">
                <SelectValue placeholder="Chọn dịch vụ..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả dịch vụ</SelectItem>
                {services && services.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Địa chỉ */}
          <div className="flex-1 space-y-2">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-purple-500" />
              Địa chỉ
            </Label>
            <Input
              placeholder="Nhập địa chỉ..."
              value={searchParams.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              onKeyPress={handleKeyPress}
              className="h-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          {/* Đánh giá */}
          <div className="flex-1 space-y-2">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              Đánh giá tối thiểu
            </Label>
            <Select
              value={searchParams.minRating?.toString() || '0'}
              onValueChange={(value) => handleInputChange('minRating', parseFloat(value))}
            >
              <SelectTrigger className="h-10 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500">
                <SelectValue placeholder="Chọn đánh giá..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Tất cả</SelectItem>
                <SelectItem value="1">1 sao trở lên</SelectItem>
                <SelectItem value="2">2 sao trở lên</SelectItem>
                <SelectItem value="3">3 sao trở lên</SelectItem>
                <SelectItem value="4">4 sao trở lên</SelectItem>
                <SelectItem value="5">5 sao</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Tìm...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Tìm kiếm
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isLoading}
              className="h-10 border-gray-200 hover:bg-gray-50 px-4"
            >
              Đặt lại
            </Button>
          </div>
        </div>

        {/* Search Info */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                Sắp xếp theo đánh giá cao nhất
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Nhấn Enter để tìm kiếm nhanh
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
