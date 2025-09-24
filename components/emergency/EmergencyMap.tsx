'use client';

import { useState, useEffect } from 'react';
import { MapPin, Navigation, Phone, Mail, User, CheckCircle, Clock, Star, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllActiveGarages, type PublicGarageInfo } from '@/lib/api/UserApi';
import { useToast } from '@/hooks/use-toast';

interface EmergencyMapProps {
  userLocation: { lat: number; lng: number; address?: string } | null;
  onGarageSelect?: (garage: PublicGarageInfo) => void;
  selectedGarage?: PublicGarageInfo | null;
}

export function EmergencyMap({ userLocation, onGarageSelect, selectedGarage }: EmergencyMapProps) {
  const [garages, setGarages] = useState<PublicGarageInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { toast } = useToast();

  // Load garages
  useEffect(() => {
    const loadGarages = async () => {
      try {
        setLoading(true);
        const response = await getAllActiveGarages();
        console.log("🏪 Loaded garages for emergency:", response.data);
        setGarages(response.data);
      } catch (error: any) {
        console.error("❌ Error loading garages:", error);
        toast({
          title: "Error",
          description: "Cannot load garage list. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadGarages();
  }, [toast]);

  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => setMapLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleGarageClick = (garage: PublicGarageInfo) => {
    onGarageSelect?.(garage);
  };

  const getDistance = (garage: PublicGarageInfo) => {
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

  // Sort garages by distance
  const sortedGarages = [...garages].sort((a, b) => {
    const distanceA = getDistance(a);
    const distanceB = getDistance(b);
    if (!distanceA || !distanceB) return 0;
    
    const numA = parseFloat(distanceA.replace(/[^\d.]/g, ''));
    const numB = parseFloat(distanceB.replace(/[^\d.]/g, ''));
    return numA - numB;
  });

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <CardTitle className="flex items-center gap-3 text-xl text-blue-800">
          <div className="p-2 bg-blue-600 rounded-lg">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold">Garage Map & Select Rescue</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Map Area */}
        <div className="relative h-96 bg-gradient-to-br from-blue-50 to-indigo-100 border-b">
          {!mapLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading map...</p>
              </div>
            </div>
          ) : (
            <div className="relative h-full">
              {/* User Location Marker */}
              {userLocation && (
                <>
                  {/* User position badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
                      <Navigation className="w-3 h-3 mr-1" />
                      Your Location
                    </Badge>
                  </div>
                  
                  {/* User marker on map */}
                  <div 
                    className="absolute z-30"
                    style={{
                      left: '10%',
                      top: '20%'
                    }}
                  >
                    <div className="relative">
                      {/* Pulse animation */}
                      <div className="absolute inset-0 w-6 h-6 bg-blue-400 rounded-full animate-ping opacity-75"></div>
                      
                      {/* User marker */}
                      <div className="relative w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                        <User className="w-3 h-3 text-white" />
                      </div>
                      
                      {/* Location label */}
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md border text-xs whitespace-nowrap">
                        Your Vehicle
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {/* Garage Markers */}
              {sortedGarages.slice(0, 8).map((garage, index) => {
                const distance = getDistance(garage);
                const isSelected = selectedGarage?.id === garage.id;
                
                return (
                  <div
                    key={garage.id}
                    className={`absolute cursor-pointer transition-all duration-200 ${
                      isSelected ? 'z-20' : 'z-10'
                    }`}
                    style={{
                      left: `${20 + (index * 12) % 70}%`,
                      top: `${30 + (index * 15) % 60}%`
                    }}
                    onClick={() => handleGarageClick(garage)}
                  >
                    <div className={`relative ${isSelected ? 'scale-110' : 'hover:scale-105'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ${
                        isSelected 
                          ? 'bg-gradient-to-r from-red-500 to-pink-600' 
                          : garage.isVerified 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                            : 'bg-gradient-to-r from-gray-500 to-gray-600'
                      }`}>
                        {garage.isVerified ? '✓' : 'G'}
                      </div>
                      
                      {/* Distance badge */}
                      {distance && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                          <Badge variant="outline" className="text-xs bg-white shadow-sm">
                            {distance}
                          </Badge>
                        </div>
                      )}
                      
                      {/* Garage info popup */}
                      {isSelected && (
                        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-72 bg-white rounded-xl shadow-2xl border p-4 z-30">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-bold text-sm mb-1 line-clamp-1 text-gray-900">
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
                                        i < Math.floor(garage.averageRating || 0) 
                                          ? 'bg-yellow-400' 
                                          : 'bg-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-gray-600">
                                  {(garage.averageRating || 0).toFixed(1)} ({garage.totalReviews || 0} reviews)
                                </span>
                              </div>
                            </div>
                            {garage.isVerified && (
                              <Badge className="bg-green-100 text-green-700 text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1 text-xs bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                              <Phone className="w-3 h-3 mr-1" />
                              Call Now
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 text-xs border-blue-200 text-blue-700 hover:bg-blue-50">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Select Rescue
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
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-800 flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">🏪</span>
              </div>
              Garages Near You ({sortedGarages.length})
            </h4>
            {selectedGarage && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <CheckCircle className="w-3 h-3 mr-1" />
                Selected: {selectedGarage.name}
              </Badge>
            )}
          </div>
          
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {sortedGarages.slice(0, 10).map((garage) => {
                const distance = getDistance(garage);
                const isSelected = selectedGarage?.id === garage.id;
                
                return (
                  <div
                    key={garage.id}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                      isSelected 
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-lg' 
                        : 'hover:bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                    onClick={() => handleGarageClick(garage)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-bold text-sm line-clamp-1 text-gray-900">
                            {garage.name}
                          </h5>
                          {garage.isVerified && (
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-1 mb-2">
                          {garage.address}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span>{(garage.averageRating || 0).toFixed(1)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{garage.phone}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span className="text-green-600 font-medium">24/7</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 ml-3">
                        {distance && (
                          <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
                            {distance}
                          </Badge>
                        )}
                        {isSelected && (
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Selected
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {!loading && sortedGarages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 text-sm">No garages found in the area</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
