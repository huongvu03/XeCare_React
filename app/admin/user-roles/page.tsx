'use client';

import { useState } from 'react';
import { useUserRoles } from '@/hooks/useUserRoles';
import { UserRoleCard } from '@/components/user/UserRoleCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  User, 
  Wrench, 
  Crown, 
  Search, 
  Filter, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

export default function UserRolesManagementPage() {
  const {
    users,
    dualRoleUsers,
    usersWhoCanBook,
    usersWhoCanManageGarages,
    usersWhoCanManageSystem,
    isLoading,
    error,
    addRoleToUser,
    removeRoleFromUser,
    convertToGarageOwner,
    convertToAdmin,
    refreshData,
    clearError
  } = useUserRoles();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'all' | 'dual' | 'can-book' | 'can-manage-garages' | 'can-manage-system'>('all');

  // Filter users based on search and filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.roles.includes(filterRole);
    
    return matchesSearch && matchesRole;
  });

  // Get users for current view mode
  const getUsersForView = () => {
    switch (viewMode) {
      case 'dual':
        return dualRoleUsers;
      case 'can-book':
        return usersWhoCanBook;
      case 'can-manage-garages':
        return usersWhoCanManageGarages;
      case 'can-manage-system':
        return usersWhoCanManageSystem;
      default:
        return filteredUsers;
    }
  };

  const currentUsers = getUsersForView();

  const getStats = () => ({
    total: users.length,
    dualRole: dualRoleUsers.length,
    canBook: usersWhoCanBook.length,
    canManageGarages: usersWhoCanManageGarages.length,
    canManageSystem: usersWhoCanManageSystem.length,
  });

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Role Management</h1>
              <p className="text-gray-600 mt-1">
                Manage user roles and capabilities in the dual role system
              </p>
            </div>
            <Button
              onClick={refreshData}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Dual Role</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.dualRole}</p>
                </div>
                <User className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Can Book</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.canBook}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Can Manage Garages</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.canManageGarages}</p>
                </div>
                <Wrench className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Can Manage System</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.canManageSystem}</p>
                </div>
                <Crown className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div className="w-full sm:w-48">
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="GARAGE">Garage</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Mode */}
            <div className="w-full sm:w-48">
              <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="View mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="dual">Dual Role Users</SelectItem>
                  <SelectItem value="can-book">Can Book Appointments</SelectItem>
                  <SelectItem value="can-manage-garages">Can Manage Garages</SelectItem>
                  <SelectItem value="can-manage-system">Can Manage System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">Error</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={clearError}
              className="mt-2"
            >
              Dismiss
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading users...</span>
          </div>
        )}

        {/* Users Grid */}
        {!isLoading && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {viewMode === 'all' ? 'All Users' :
                 viewMode === 'dual' ? 'Dual Role Users' :
                 viewMode === 'can-book' ? 'Users Who Can Book Appointments' :
                 viewMode === 'can-manage-garages' ? 'Users Who Can Manage Garages' :
                 'Users Who Can Manage System'}
                <Badge variant="secondary" className="ml-2">
                  {currentUsers.length}
                </Badge>
              </h2>
            </div>

            {currentUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-600">
                  {searchTerm || filterRole !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'No users match the current view mode'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentUsers.map((user) => (
                  <UserRoleCard
                    key={user.id}
                    user={user}
                    onAddRole={addRoleToUser}
                    onRemoveRole={removeRoleFromUser}
                    onConvertToGarage={convertToGarageOwner}
                    onConvertToAdmin={convertToAdmin}
                    showActions={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
