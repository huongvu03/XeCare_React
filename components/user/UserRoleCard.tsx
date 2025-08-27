'use client';

import { useState } from 'react';
import { UserRole } from '@/services/userRoleApi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  User, 
  Wrench, 
  Shield, 
  Plus, 
  Minus, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Settings,
  Crown
} from 'lucide-react';

interface UserRoleCardProps {
  user: UserRole;
  onAddRole?: (userId: number, role: string) => Promise<void>;
  onRemoveRole?: (userId: number, role: string) => Promise<void>;
  onConvertToGarage?: (userId: number) => Promise<void>;
  onConvertToAdmin?: (userId: number) => Promise<void>;
  showActions?: boolean;
}

export const UserRoleCard = ({
  user,
  onAddRole,
  onRemoveRole,
  onConvertToGarage,
  onConvertToAdmin,
  showActions = true
}: UserRoleCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await action();
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'USER':
        return <User className="w-4 h-4" />;
      case 'GARAGE':
        return <Wrench className="w-4 h-4" />;
      case 'ADMIN':
        return <Crown className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'USER':
        return 'bg-blue-100 text-blue-800';
      case 'GARAGE':
        return 'bg-green-100 text-green-800';
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCapabilityIcon = (capability: boolean) => {
    return capability ? (
      <div className="w-2 h-2 bg-green-500 rounded-full" />
    ) : (
      <div className="w-2 h-2 bg-gray-300 rounded-full" />
    );
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {user.name}
            {user.isDualRole && (
              <Badge variant="secondary" className="text-xs">
                Dual Role
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-1">
            {user.roles.map((role) => (
              <Badge
                key={role}
                className={`${getRoleColor(role)} flex items-center gap-1`}
              >
                {getRoleIcon(role)}
                {role}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* User Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            {user.email}
          </div>
          {user.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              {user.phone}
            </div>
          )}
          {user.address && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              {user.address}
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Capabilities */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Capabilities</h4>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {getCapabilityIcon(user.canBookAppointments)}
                <span>Book Appointments</span>
              </div>
              <Badge variant={user.canBookAppointments ? "default" : "secondary"}>
                {user.canBookAppointments ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {getCapabilityIcon(user.canManageGarages)}
                <span>Manage Garages</span>
              </div>
              <Badge variant={user.canManageGarages ? "default" : "secondary"}>
                {user.canManageGarages ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {getCapabilityIcon(user.canManageSystem)}
                <span>Manage System</span>
              </div>
              <Badge variant={user.canManageSystem ? "default" : "secondary"}>
                {user.canManageSystem ? "Yes" : "No"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Actions</h4>
            <div className="flex flex-wrap gap-2">
              {/* Add Roles */}
              {!user.roles.includes('GARAGE') && onAddRole && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction(() => onAddRole!(user.id, 'GARAGE'))}
                  disabled={isLoading}
                  className="flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add Garage
                </Button>
              )}
              
              {!user.roles.includes('ADMIN') && onAddRole && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction(() => onAddRole!(user.id, 'ADMIN'))}
                  disabled={isLoading}
                  className="flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add Admin
                </Button>
              )}

              {/* Remove Roles */}
              {user.roles.includes('GARAGE') && onRemoveRole && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction(() => onRemoveRole!(user.id, 'GARAGE'))}
                  disabled={isLoading}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700"
                >
                  <Minus className="w-3 h-3" />
                  Remove Garage
                </Button>
              )}
              
              {user.roles.includes('ADMIN') && onRemoveRole && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction(() => onRemoveRole!(user.id, 'ADMIN'))}
                  disabled={isLoading}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700"
                >
                  <Minus className="w-3 h-3" />
                  Remove Admin
                </Button>
              )}

              {/* Quick Actions */}
              {!user.roles.includes('GARAGE') && onConvertToGarage && (
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => handleAction(() => onConvertToGarage!(user.id))}
                  disabled={isLoading}
                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                >
                  <Wrench className="w-3 h-3" />
                  Make Garage Owner
                </Button>
              )}
              
              {!user.roles.includes('ADMIN') && onConvertToAdmin && (
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => handleAction(() => onConvertToAdmin!(user.id))}
                  disabled={isLoading}
                  className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700"
                >
                  <Crown className="w-3 h-3" />
                  Make Admin
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">Updating...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
