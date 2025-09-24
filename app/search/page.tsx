'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { getServiceNameById, getVehicleTypeNameById, getServiceNamesById } from '@/lib/utils/serviceMapping';

export default function GarageSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [sortByDistance, setSortByDistance] = useState(false);
  const [initialSearchDone, setInitialSearchDone] = useState(false);
  const [currentSearchParams, setCurrentSearchParams] = useState<GarageSearchParams>({});
  const [currentRatingType, setCurrentRatingType] = useState<'general' | 'appointment'>('general');

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
    console.log('=== HANDLE SEARCH DEBUG ===');
    console.log('Received params:', params);
    setCurrentSearchParams(params);
    setCurrentRatingType(params.ratingType || 'general');
    search(params);
    console.log('========================');
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

  // Handle URL parameters for automatic search
  useEffect(() => {
    if (!initialSearchDone && searchParams) {
      const serviceParam = searchParams.get('service');
      const vehicleTypeParam = searchParams.get('vehicleType');
      const locationParam = searchParams.get('location');
      
      console.log('URL Search Params:', { serviceParam, vehicleTypeParam, locationParam });
      console.log('Services loaded:', services.length, services);
      console.log('Vehicle types loaded:', vehicleTypes.length, vehicleTypes);
      
      if (serviceParam || vehicleTypeParam || locationParam) {
        const searchParams: GarageSearchParams = {};
        
        if (serviceParam) {
          // Try to find service by ID
          const serviceId = parseInt(serviceParam);
          console.log('Parsed service ID:', serviceId);
          
          if (!isNaN(serviceId) && serviceId > 0) {
            const serviceNames = getServiceNamesById(serviceId);
            console.log('All possible service names for ID', serviceId, ':', serviceNames);
            console.log('Available services array:', services);
            
            // Try to find a service name that exists in the available services array
            let foundServiceName = null;
            for (const serviceName of serviceNames) {
              if (services.includes(serviceName)) {
                foundServiceName = serviceName;
                console.log('Found matching service name:', serviceName);
                break;
              }
            }
            
            if (foundServiceName) {
              searchParams.service = foundServiceName;
              console.log('Using found service name:', foundServiceName);
            } else if (serviceNames.length > 0) {
              // Use the first service name even if not in services array
              // The API might still handle it correctly
              searchParams.service = serviceNames[0];
              console.log('Using first service name (not in services array):', serviceNames[0]);
            } else {
              // Fallback: try to find by name in the services array
              searchParams.service = serviceParam;
              console.log('Using fallback service param:', serviceParam);
            }
          } else {
            // If not a valid ID, try to find by name
            searchParams.service = serviceParam;
            console.log('Using service param as name:', serviceParam);
          }
        }
        
        if (vehicleTypeParam) {
          // Try to find vehicle type by ID
          const vehicleTypeId = parseInt(vehicleTypeParam);
          if (!isNaN(vehicleTypeId) && vehicleTypeId > 0) {
            const vehicleTypeName = getVehicleTypeNameById(vehicleTypeId);
            if (vehicleTypeName) {
              searchParams.vehicleType = vehicleTypeName;
            } else {
              // Fallback: try to find by name
              searchParams.vehicleType = vehicleTypeParam;
            }
          } else {
            // If not a valid ID, try to find by name
            searchParams.vehicleType = vehicleTypeParam;
          }
        }
        
        if (locationParam) {
          searchParams.address = locationParam;
        }
        
        console.log('Final search params:', searchParams);
        
        // Save current search params for SearchFilters
        setCurrentSearchParams(searchParams);
        
        // Perform the search
        search(searchParams);
        setInitialSearchDone(true);
        
        // Clear URL parameters without refreshing the page
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      } else {
        // No specific search parameters, load all active garages
        console.log('No URL params, loading all garages');
        search({});
        setInitialSearchDone(true);
      }
    }
  }, [searchParams, services, vehicleTypes, initialSearchDone, search]);

  // Use sorted garages when available
  const displayGarages = sortByDistance && userLocation ? sortedGarages : garages;

  // Get current search context for display
  const getSearchContext = () => {
    const serviceParam = searchParams?.get('service');
    const vehicleTypeParam = searchParams?.get('vehicleType');
    const locationParam = searchParams?.get('location');
    
    if (serviceParam) {
      const serviceId = parseInt(serviceParam);
      if (!isNaN(serviceId) && serviceId > 0) {
        const serviceName = getServiceNameById(serviceId);
        if (serviceName) {
          return `Service: ${serviceName}`;
        }
      }
    }
    return null;
  };

  const searchContext = getSearchContext();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {searchContext ? searchContext : 'Search Garage'}
            </h1>
            <p className="text-gray-600 mt-1">
              {searchContext 
                ? `Find garages providing ${searchContext.toLowerCase()} near you`
                : 'Find reliable, quality garages near you'
              }
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
            initialParams={currentSearchParams}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Results Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Search Results
            </h2>
            <div className="text-sm text-gray-600 mt-1">
              Found {displayGarages.length} garages
              {userLocation && averageDistance > 0 && (
                <span className="ml-2">• Average distance: {averageDistance}km</span>
              )}
              <span className="ml-2">• Showing {currentRatingType === 'appointment' ? 'appointment' : 'general'} ratings</span>
              {currentSearchParams.ratingSort && currentSearchParams.ratingSort !== 'none' && (
                <span className="ml-2">• Sorted by {currentSearchParams.ratingSort === 'desc' ? 'highest' : 'lowest'} rating</span>
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
                  {isLocating ? 'Locating...' : 'Find My Location'}
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
                    Location Detected
                  </Button>
                  
                  <Button
                    onClick={() => setSortByDistance(!sortByDistance)}
                    variant={sortByDistance ? "default" : "outline"}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                    {sortByDistance ? 'Sorting by nearest' : 'Sort by distance'}
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
              <span className="text-sm font-medium">Location Error</span>
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
                ratingType={currentRatingType}
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

        {/* Load More Button - Temporarily disabled due to pagination API issues */}
        {false && viewMode === 'grid' && hasMore && (
          <div className="text-center pt-6">
            <Button
              onClick={loadMore}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}

        {/* No Results */}
        {!isLoading && displayGarages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No garages found</h3>
            <p className="text-gray-600">Try changing your search filters</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">An error occurred</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">Loading data...</span>
          </div>
        </div>
      )}
    </div>
  );
}
