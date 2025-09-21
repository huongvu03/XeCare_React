'use client';

import { useState, useEffect, useRef } from 'react';
import { GarageSearchParams } from '@/services/api';
import { Search, Star, MapPin, Settings, Car, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SearchFiltersProps {
  services: string[];
  vehicleTypes: string[];
  onSearch: (params: GarageSearchParams) => void;
  onReset: () => void | Promise<void>;
  isLoading?: boolean;
  initialParams?: GarageSearchParams;
}

interface MultiSelectProps {
  options: string[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder: string;
  label: string;
  icon: React.ReactNode;
  className?: string;
}

// MultiSelect Component
function MultiSelect({ options, selectedValues, onSelectionChange, placeholder, label, icon, className }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggleOption = (option: string) => {
    if (selectedValues.includes(option)) {
      onSelectionChange(selectedValues.filter(v => v !== option));
    } else {
      onSelectionChange([...selectedValues, option]);
    }
    // Close dropdown after selection
    setIsOpen(false);
  };

  const handleRemoveOption = (option: string) => {
    onSelectionChange(selectedValues.filter(v => v !== option));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const displayText = selectedValues.length === 0 
    ? placeholder 
    : selectedValues.length === 1 
      ? selectedValues[0]
      : `${selectedValues.length} đã chọn`;

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
        {icon}
        {label}
      </Label>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-10 px-3 py-2 text-left border border-gray-200 rounded-md bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
        >
          <span className={selectedValues.length === 0 ? 'text-gray-500' : 'text-gray-900'}>
            {displayText}
          </span>
          <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <div
                key={option}
                className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                onClick={() => handleToggleOption(option)}
              >
                <span className="text-sm text-gray-900">{option}</span>
                {selectedValues.includes(option) && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Selected values as badges */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedValues.map((value) => (
            <Badge key={value} variant="secondary" className="text-xs">
              {value}
              <button
                type="button"
                onClick={() => handleRemoveOption(value)}
                className="ml-1 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

export function SearchFilters({ services, vehicleTypes, onSearch, onReset, isLoading, initialParams }: SearchFiltersProps) {
  const [mounted, setMounted] = useState(false);
  const [resetKey, setResetKey] = useState(0); // Key to force re-render
  const [searchParams, setSearchParams] = useState<GarageSearchParams>({
    name: '',
    address: '',
    service: [],
    vehicleType: [],
    minRating: 0,
    maxRating: 5,
    isVerified: undefined,
    ...initialParams // Merge with initial params if provided
  });

  // Fix hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update search params when initial params change
  useEffect(() => {
    if (initialParams) {
      console.log('SearchFilters: Updating with initial params:', initialParams);
      setSearchParams(prev => ({
        ...prev,
        ...initialParams
      }));
    }
  }, [initialParams]);

  const handleInputChange = (field: keyof GarageSearchParams, value: any) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: 'service' | 'vehicleType', values: string[]) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: values
    }));
  };

  const handleSearch = () => {
    try {
      console.log('SearchFilters: handleSearch called with params:', searchParams);
      
      const cleanParams = Object.fromEntries(
        Object.entries(searchParams).filter(([key, value]) => {
          if (Array.isArray(value)) {
            return value.length > 0;
          }
          // Don't filter out minRating when it's 0 (means "all ratings")
          if (key === 'minRating') {
            return value !== undefined && value !== null;
          }
          return value !== '' && value !== undefined && value !== null && value !== 'all';
        })
      );
      
      console.log('SearchFilters: cleaned params:', cleanParams);
      onSearch(cleanParams);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleReset = async () => {
    try {
      console.log('SearchFilters: Reset button clicked');
      const resetParams: GarageSearchParams = {
        name: '',
        address: '',
        service: [],
        vehicleType: [],
        minRating: 0,
        maxRating: 5,
        isVerified: undefined
      };
      
      // Update form state
      console.log('SearchFilters: Updating form state');
      setSearchParams(resetParams);
      
      // Force re-render of all form controls
      setResetKey(prev => prev + 1);
      
      // Call the parent reset function - this will now automatically reload all garages
      console.log('SearchFilters: Calling parent reset function');
      await onReset();
      console.log('SearchFilters: Reset completed');
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
        {/* Filter Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
          {/* Tên garage */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Search className="w-4 h-4 text-blue-500" />
              Tên garage
            </Label>
            <Input
              key={`name-${resetKey}`}
              placeholder="Nhập tên garage..."
              value={searchParams.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              onKeyPress={handleKeyPress}
              className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Dịch vụ */}
          <MultiSelect
            key={`service-${resetKey}`}
            options={services || []}
            selectedValues={Array.isArray(searchParams.service) ? searchParams.service : []}
            onSelectionChange={(values) => handleArrayChange('service', values)}
            placeholder="Chọn dịch vụ..."
            label="Dịch vụ"
            icon={<Settings className="w-4 h-4 text-green-500" />}
            className="space-y-2"
          />

          {/* Loại xe */}
          <MultiSelect
            key={`vehicleType-${resetKey}`}
            options={vehicleTypes || []}
            selectedValues={Array.isArray(searchParams.vehicleType) ? searchParams.vehicleType : []}
            onSelectionChange={(values) => handleArrayChange('vehicleType', values)}
            placeholder="Chọn loại xe..."
            label="Loại xe"
            icon={<Car className="w-4 h-4 text-orange-500" />}
            className="space-y-2"
          />

          {/* Địa chỉ */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-purple-500" />
              Địa chỉ
            </Label>
            <Input
              key={`address-${resetKey}`}
              placeholder="Nhập địa chỉ..."
              value={searchParams.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              onKeyPress={handleKeyPress}
              className="h-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          {/* Đánh giá */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              Đánh giá tối thiểu
            </Label>
            <Select
              key={`rating-${resetKey}`}
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
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-3">
          <Button
            onClick={handleSearch}
            disabled={isLoading}
            className="h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium px-8"
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
            className="h-10 border-gray-200 hover:bg-gray-50 px-6"
          >
            Đặt lại
          </Button>
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
