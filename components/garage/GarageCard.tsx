'use client';

import { useState } from 'react';
import { PublicGarageResponseDto } from '@/services/api';
import { Star, MapPin, Phone, Mail, CheckCircle, Clock, Car, Wrench, Image as ImageIcon } from 'lucide-react';
import { getFullImageUrl, isPlaceholderImage } from '@/utils/imageUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { FavoriteButton } from '@/components/ui/FavoriteButton';

interface GarageCardProps {
  garage: PublicGarageResponseDto;
  onViewDetails?: (garage: PublicGarageResponseDto) => void;
  onContact?: (garage: PublicGarageResponseDto) => void;
}

export function GarageCard({ garage, onViewDetails, onContact }: GarageCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  // Kiểm tra xem có nên hiển thị placeholder không
  const shouldShowPlaceholder = !garage.imageUrl || isPlaceholderImage(garage.imageUrl);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:scale-[1.02] group">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden">
          {/* Image Container */}
          <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
            
            {!imageError && !shouldShowPlaceholder ? (
              <img
                src={getFullImageUrl(garage.imageUrl)}
                alt={garage.name}
                className={`w-full h-48 object-cover transition-opacity duration-300 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 left-4 w-8 h-8 bg-blue-200 rounded-full"></div>
                  <div className="absolute top-12 right-8 w-6 h-6 bg-indigo-200 rounded-full"></div>
                  <div className="absolute bottom-8 left-8 w-4 h-4 bg-blue-300 rounded-full"></div>
                  <div className="absolute bottom-16 right-4 w-10 h-10 bg-indigo-300 rounded-full"></div>
                </div>
                
                {/* Content */}
                <div className="text-center relative z-10">
                  <div className="bg-white/80 backdrop-blur-sm rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-sm text-blue-700 font-semibold">{garage.name}</p>
                  <p className="text-xs text-blue-500 mt-1">Garage</p>
                </div>
              </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Status badges */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              {garage.isVerified && (
                <Badge className="bg-green-500 text-white border-0 shadow-sm">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Đã xác thực
                </Badge>
              )}
              <Badge className={`${getStatusColor(garage.status)} border shadow-sm`}>
                {garage.status}
              </Badge>
            </div>

            {/* Favorite button */}
            <div className="absolute top-3 left-3">
              <FavoriteButton garageId={garage.id} size="sm" />
            </div>

            {/* Rating badge */}
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold text-gray-900">
                  {garage.averageRating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <div className="space-y-4">
          {/* Tên garage */}
          <div>
            <h3 className="font-bold text-xl text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {garage.name}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                {renderStars(garage.averageRating)}
              </div>
              <span className="text-sm text-gray-500">
                ({garage.totalReviews} đánh giá)
              </span>
            </div>
          </div>

          {/* Địa chỉ */}
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {garage.address}
            </p>
          </div>

          {/* Mô tả */}
          {garage.description && (
            <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
              {garage.description}
            </p>
          )}

          {/* Dịch vụ */}
          {garage.serviceNames && garage.serviceNames.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-semibold text-gray-700">Dịch vụ:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {garage.serviceNames.slice(0, 3).map((service, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
                    {service}
                  </Badge>
                ))}
                {garage.serviceNames.length > 3 && (
                  <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200 text-gray-600">
                    +{garage.serviceNames.length - 3} khác
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Loại xe */}
          {garage.vehicleTypeNames && garage.vehicleTypeNames.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-green-500" />
                <span className="text-sm font-semibold text-gray-700">Loại xe:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {garage.vehicleTypeNames.map((type, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Thông tin liên hệ */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 font-medium">{garage.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 truncate">{garage.email}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <div className="flex gap-3 w-full">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-10 font-medium hover:bg-gray-50"
            onClick={() => onViewDetails?.(garage)}
          >
            Xem chi tiết
          </Button>
          <Button
            size="sm"
            className="flex-1 h-10 font-medium bg-blue-600 hover:bg-blue-700"
            onClick={() => onContact?.(garage)}
          >
            Liên hệ
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
