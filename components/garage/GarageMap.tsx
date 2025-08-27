'use client';

import { useState, useEffect } from 'react';
import { PublicGarageResponseDto } from '@/services/api';
import { MapPin, Navigation, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface GarageMapProps {
  garages: PublicGarageResponseDto[];
  onGarageSelect?: (garage: PublicGarageResponseDto) => void;
  selectedGarage?: PublicGarageResponseDto;
}

export function GarageMap({ garages, onGarageSelect, selectedGarage }: GarageMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Mock map component - in real implementation, you would use Google Maps or Leaflet
  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => setMapLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Error getting location:', error);
        }
      );
    }
  }, []);

  const handleGarageClick = (garage: PublicGarageResponseDto) => {
    onGarageSelect?.(garage);
  };

  const getDistance = (garage: PublicGarageResponseDto) => {
    if (!userLocation) return null;
    
    const R = 6371; // Earth's radius in km
    const dLat = (garage.latitude - userLocation.lat) * Math.PI / 180;
    const dLon = (garage.longitude - userLocation.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(garage.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Bản đồ Garage
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Mock Map Area */}
        <div className="relative h-96 bg-gradient-to-br from-blue-50 to-blue-100 border-b">
          {!mapLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Đang tải bản đồ...</p>
              </div>
            </div>
          ) : (
            <div className="relative h-full">
              {/* User Location */}
              {userLocation && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge variant="secondary" className="bg-blue-500 text-white">
                    <Navigation className="w-3 h-3 mr-1" />
                    Vị trí của bạn
                  </Badge>
                </div>
              )}
              
              {/* Garage Markers */}
              {garages.map((garage, index) => {
                const distance = getDistance(garage);
                const isSelected = selectedGarage?.id === garage.id;
                
                return (
                  <div
                    key={garage.id}
                    className={`absolute cursor-pointer transition-all duration-200 ${
                      isSelected ? 'z-20' : 'z-10'
                    }`}
                    style={{
                      left: `${20 + (index * 15) % 70}%`,
                      top: `${30 + (index * 20) % 60}%`
                    }}
                    onClick={() => handleGarageClick(garage)}
                  >
                    <div className={`relative ${isSelected ? 'scale-110' : 'hover:scale-105'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        isSelected 
                          ? 'bg-red-500 shadow-lg' 
                          : garage.isVerified 
                            ? 'bg-green-500' 
                            : 'bg-gray-500'
                      }`}>
                        {garage.isVerified ? '✓' : 'G'}
                      </div>
                      
                      {/* Distance badge */}
                      {distance && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                          <Badge variant="outline" className="text-xs bg-white">
                            {distance}
                          </Badge>
                        </div>
                      )}
                      
                      {/* Garage info popup */}
                      {isSelected && (
                        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-64 bg-white rounded-lg shadow-lg border p-3 z-30">
                          <h4 className="font-semibold text-sm mb-2 line-clamp-1">
                            {garage.name}
                          </h4>
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                            {garage.address}
                          </p>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${
                                    i < Math.floor(garage.averageRating) 
                                      ? 'bg-yellow-400' 
                                      : 'bg-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-600">
                              {garage.averageRating.toFixed(1)}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" className="flex-1 text-xs">
                              <Phone className="w-3 h-3 mr-1" />
                              Gọi
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 text-xs">
                              <Mail className="w-3 h-3 mr-1" />
                              Email
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Garage List */}
        <div className="p-4">
          <h4 className="font-medium mb-3">Garage gần đây</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {garages.slice(0, 5).map((garage) => {
              const distance = getDistance(garage);
              const isSelected = selectedGarage?.id === garage.id;
              
              return (
                <div
                  key={garage.id}
                  className={`p-2 rounded-lg cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleGarageClick(garage)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-sm line-clamp-1">
                        {garage.name}
                      </h5>
                      <p className="text-xs text-gray-600 line-clamp-1">
                        {garage.address}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      {distance && (
                        <Badge variant="outline" className="text-xs">
                          {distance}
                        </Badge>
                      )}
                      {garage.isVerified && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                          ✓
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
