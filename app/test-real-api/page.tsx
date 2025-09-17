'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Navigation, Star, CheckCircle } from 'lucide-react';

interface Garage {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  averageRating: number;
  isVerified: boolean;
  status: string;
  phoneNumber?: string;
  email?: string;
  serviceNames: string[];
  vehicleTypeNames: string[];
}

export default function TestRealApiPage() {
  const [garages, setGarages] = useState<Garage[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  const testAPI = async (endpoint: string, description: string) => {
    try {
      console.log(`Testing ${description}...`);
      const response = await fetch(`http://localhost:8080${endpoint}`);
      const data = await response.json();
      console.log(`✅ ${description}:`, data);
      return data;
    } catch (err) {
      console.error(`❌ ${description}:`, err);
      throw err;
    }
  };

  const loadAllData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Test các API endpoints
      const [garagesData, servicesData, vehicleTypesData] = await Promise.all([
        testAPI('/apis/garage/active', 'Active Garages'),
        testAPI('/apis/garage/services/available', 'Available Services'),
        testAPI('/apis/garage/vehicle-types/available', 'Available Vehicle Types')
      ]);

      setGarages(garagesData);
      setServices(servicesData);
      setVehicleTypes(vehicleTypesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'API Error');
    } finally {
      setIsLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          console.log('User location:', position.coords);
        },
        (error) => {
          console.error('Location error:', error);
        }
      );
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c * 100) / 100;
  };

  const garagesWithDistance = garages.map(garage => ({
    ...garage,
    distance: userLocation ? calculateDistance(
      userLocation.lat, userLocation.lng,
      garage.latitude, garage.longitude
    ) : null
  })).sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test Real API & Location Features
          </h1>
          <p className="text-gray-600">
            Testing backend APIs and location-based garage search
          </p>
        </div>

        {/* Control Panel */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Controls</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button 
              onClick={loadAllData} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : '🔄'}
              Load Data from Backend
            </Button>
            
            <Button 
              onClick={getUserLocation} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Get My Location
            </Button>

            {userLocation && (
              <Badge variant="secondary" className="px-3 py-1">
                📍 Location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-red-700">
                ❌ Error: {error}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{garages.length}</div>
              <div className="text-sm text-gray-600">Active Garages</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{services.length}</div>
              <div className="text-sm text-gray-600">Available Services</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">{vehicleTypes.length}</div>
              <div className="text-sm text-gray-600">Vehicle Types</div>
            </CardContent>
          </Card>
        </div>

        {/* Garages List with Distance */}
        {garages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="w-5 h-5" />
                Garages {userLocation && '(Sorted by Distance)'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {garagesWithDistance.map((garage) => (
                  <Card key={garage.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{garage.name}</h3>
                        {garage.isVerified && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">{garage.address}</div>
                      
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{garage.averageRating.toFixed(1)}</span>
                        </div>
                        
                        {garage.distance && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            <Navigation className="w-3 h-3 mr-1" />
                            {garage.distance}km
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        {garage.serviceNames.slice(0, 3).map((service, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                        {garage.serviceNames.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{garage.serviceNames.length - 3}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Coordinates: {garage.latitude}, {garage.longitude}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
