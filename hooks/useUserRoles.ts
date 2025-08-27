import { useState, useEffect, useCallback } from 'react';
import { userRoleApi, UserRole } from '../services/userRoleApi';

interface UseUserRolesReturn {
  // State
  users: UserRole[];
  dualRoleUsers: UserRole[];
  usersWhoCanBook: UserRole[];
  usersWhoCanManageGarages: UserRole[];
  usersWhoCanManageSystem: UserRole[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addRoleToUser: (userId: number, role: string) => Promise<void>;
  removeRoleFromUser: (userId: number, role: string) => Promise<void>;
  setUserRoles: (userId: number, roles: string[]) => Promise<void>;
  convertToGarageOwner: (userId: number) => Promise<void>;
  convertToAdmin: (userId: number) => Promise<void>;
  removeGarageOwnerRole: (userId: number) => Promise<void>;
  removeAdminRole: (userId: number) => Promise<void>;
  getUsersByRole: (role: string) => Promise<void>;
  validateRoleCombination: (roles: string[]) => Promise<boolean>;
  
  // Utilities
  refreshData: () => Promise<void>;
  clearError: () => void;
}

export const useUserRoles = (): UseUserRolesReturn => {
  const [users, setUsers] = useState<UserRole[]>([]);
  const [dualRoleUsers, setDualRoleUsers] = useState<UserRole[]>([]);
  const [usersWhoCanBook, setUsersWhoCanBook] = useState<UserRole[]>([]);
  const [usersWhoCanManageGarages, setUsersWhoCanManageGarages] = useState<UserRole[]>([]);
  const [usersWhoCanManageSystem, setUsersWhoCanManageSystem] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all data on mount
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [
        dualRoleUsersData,
        usersWhoCanBookData,
        usersWhoCanManageGaragesData,
        usersWhoCanManageSystemData
      ] = await Promise.all([
        userRoleApi.getDualRoleUsers(),
        userRoleApi.getUsersWhoCanBook(),
        userRoleApi.getUsersWhoCanManageGarages(),
        userRoleApi.getUsersWhoCanManageSystem()
      ]);

      setDualRoleUsers(dualRoleUsersData);
      setUsersWhoCanBook(usersWhoCanBookData);
      setUsersWhoCanManageGarages(usersWhoCanManageGaragesData);
      setUsersWhoCanManageSystem(usersWhoCanManageSystemData);
      
      // Combine all users for general use
      const allUsers = new Map<number, UserRole>();
      [...dualRoleUsersData, ...usersWhoCanBookData, ...usersWhoCanManageGaragesData, ...usersWhoCanManageSystemData]
        .forEach(user => allUsers.set(user.id, user));
      
      setUsers(Array.from(allUsers.values()));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addRoleToUser = useCallback(async (userId: number, role: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedUser = await userRoleApi.addRoleToUser(userId, role);
      
      // Update the user in all relevant lists
      setUsers(prev => prev.map(user => user.id === userId ? updatedUser : user));
      setDualRoleUsers(prev => {
        if (updatedUser.isDualRole) {
          return prev.some(u => u.id === userId) 
            ? prev.map(user => user.id === userId ? updatedUser : user)
            : [...prev, updatedUser];
        } else {
          return prev.filter(user => user.id !== userId);
        }
      });
      
      // Update capability-based lists
      if (updatedUser.canBookAppointments) {
        setUsersWhoCanBook(prev => {
          const existing = prev.find(u => u.id === userId);
          return existing ? prev.map(user => user.id === userId ? updatedUser : user) : [...prev, updatedUser];
        });
      }
      
      if (updatedUser.canManageGarages) {
        setUsersWhoCanManageGarages(prev => {
          const existing = prev.find(u => u.id === userId);
          return existing ? prev.map(user => user.id === userId ? updatedUser : user) : [...prev, updatedUser];
        });
      }
      
      if (updatedUser.canManageSystem) {
        setUsersWhoCanManageSystem(prev => {
          const existing = prev.find(u => u.id === userId);
          return existing ? prev.map(user => user.id === userId ? updatedUser : user) : [...prev, updatedUser];
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add role to user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeRoleFromUser = useCallback(async (userId: number, role: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedUser = await userRoleApi.removeRoleFromUser(userId, role);
      
      // Update the user in all relevant lists
      setUsers(prev => prev.map(user => user.id === userId ? updatedUser : user));
      setDualRoleUsers(prev => {
        if (updatedUser.isDualRole) {
          return prev.map(user => user.id === userId ? updatedUser : user);
        } else {
          return prev.filter(user => user.id !== userId);
        }
      });
      
      // Update capability-based lists
      if (updatedUser.canBookAppointments) {
        setUsersWhoCanBook(prev => prev.map(user => user.id === userId ? updatedUser : user));
      } else {
        setUsersWhoCanBook(prev => prev.filter(user => user.id !== userId));
      }
      
      if (updatedUser.canManageGarages) {
        setUsersWhoCanManageGarages(prev => prev.map(user => user.id === userId ? updatedUser : user));
      } else {
        setUsersWhoCanManageGarages(prev => prev.filter(user => user.id !== userId));
      }
      
      if (updatedUser.canManageSystem) {
        setUsersWhoCanManageSystem(prev => prev.map(user => user.id === userId ? updatedUser : user));
      } else {
        setUsersWhoCanManageSystem(prev => prev.filter(user => user.id !== userId));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove role from user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setUserRoles = useCallback(async (userId: number, roles: string[]) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedUser = await userRoleApi.setUserRoles(userId, roles);
      
      // Update the user in all relevant lists
      setUsers(prev => prev.map(user => user.id === userId ? updatedUser : user));
      setDualRoleUsers(prev => {
        if (updatedUser.isDualRole) {
          return prev.some(u => u.id === userId) 
            ? prev.map(user => user.id === userId ? updatedUser : user)
            : [...prev, updatedUser];
        } else {
          return prev.filter(user => user.id !== userId);
        }
      });
      
      // Update capability-based lists
      if (updatedUser.canBookAppointments) {
        setUsersWhoCanBook(prev => {
          const existing = prev.find(u => u.id === userId);
          return existing ? prev.map(user => user.id === userId ? updatedUser : user) : [...prev, updatedUser];
        });
      } else {
        setUsersWhoCanBook(prev => prev.filter(user => user.id !== userId));
      }
      
      if (updatedUser.canManageGarages) {
        setUsersWhoCanManageGarages(prev => {
          const existing = prev.find(u => u.id === userId);
          return existing ? prev.map(user => user.id === userId ? updatedUser : user) : [...prev, updatedUser];
        });
      } else {
        setUsersWhoCanManageGarages(prev => prev.filter(user => user.id !== userId));
      }
      
      if (updatedUser.canManageSystem) {
        setUsersWhoCanManageSystem(prev => {
          const existing = prev.find(u => u.id === userId);
          return existing ? prev.map(user => user.id === userId ? updatedUser : user) : [...prev, updatedUser];
        });
      } else {
        setUsersWhoCanManageSystem(prev => prev.filter(user => user.id !== userId));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set user roles');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const convertToGarageOwner = useCallback(async (userId: number) => {
    await addRoleToUser(userId, 'GARAGE');
  }, [addRoleToUser]);

  const convertToAdmin = useCallback(async (userId: number) => {
    await addRoleToUser(userId, 'ADMIN');
  }, [addRoleToUser]);

  const removeGarageOwnerRole = useCallback(async (userId: number) => {
    await removeRoleFromUser(userId, 'GARAGE');
  }, [removeRoleFromUser]);

  const removeAdminRole = useCallback(async (userId: number) => {
    await removeRoleFromUser(userId, 'ADMIN');
  }, [removeRoleFromUser]);

  const getUsersByRole = useCallback(async (role: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const usersByRole = await userRoleApi.getUsersByRole(role);
      setUsers(usersByRole);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get users by role');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const validateRoleCombination = useCallback(async (roles: string[]): Promise<boolean> => {
    try {
      return await userRoleApi.validateRoleCombination(roles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate role combination');
      return false;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    users,
    dualRoleUsers,
    usersWhoCanBook,
    usersWhoCanManageGarages,
    usersWhoCanManageSystem,
    isLoading,
    error,
    
    // Actions
    addRoleToUser,
    removeRoleFromUser,
    setUserRoles,
    convertToGarageOwner,
    convertToAdmin,
    removeGarageOwnerRole,
    removeAdminRole,
    getUsersByRole,
    validateRoleCombination,
    
    // Utilities
    refreshData,
    clearError,
  };
};
