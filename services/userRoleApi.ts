import { config } from '../config/env';

// Types for user role management
export interface UserRole {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  accountType: 'ADMIN' | 'GARAGE' | 'USER';
  roles: string[];
  canBookAppointments: boolean;
  canManageGarages: boolean;
  canManageSystem: boolean;
  isDualRole: boolean;
}

export interface RoleManagementRequest {
  role: string;
}

export interface SetRolesRequest {
  roles: string[];
}

export interface RoleValidationRequest {
  roles: string[];
}

// User Role API Client
class UserRoleApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${config.API_BASE_URL}/apis/user/roles`;
  }

  // Add role to user
  async addRoleToUser(userId: number, role: string): Promise<UserRole> {
    const response = await fetch(`${this.baseUrl}/${userId}/add?role=${role}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to add role: ${response.statusText}`);
    }

    return response.json();
  }

  // Remove role from user
  async removeRoleFromUser(userId: number, role: string): Promise<UserRole> {
    const response = await fetch(`${this.baseUrl}/${userId}/remove?role=${role}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to remove role: ${response.statusText}`);
    }

    return response.json();
  }

  // Set roles for user (replace all existing roles)
  async setUserRoles(userId: number, roles: string[]): Promise<UserRole> {
    const response = await fetch(`${this.baseUrl}/${userId}/set`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roles }),
    });

    if (!response.ok) {
      throw new Error(`Failed to set roles: ${response.statusText}`);
    }

    return response.json();
  }

  // Get users by role
  async getUsersByRole(role: string): Promise<UserRole[]> {
    const response = await fetch(`${this.baseUrl}/by-role/${role}`);

    if (!response.ok) {
      throw new Error(`Failed to get users by role: ${response.statusText}`);
    }

    return response.json();
  }

  // Convert user to garage owner
  async convertToGarageOwner(userId: number): Promise<UserRole> {
    const response = await fetch(`${this.baseUrl}/${userId}/convert-to-garage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to convert to garage owner: ${response.statusText}`);
    }

    return response.json();
  }

  // Convert user to admin
  async convertToAdmin(userId: number): Promise<UserRole> {
    const response = await fetch(`${this.baseUrl}/${userId}/convert-to-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to convert to admin: ${response.statusText}`);
    }

    return response.json();
  }

  // Remove garage owner role
  async removeGarageOwnerRole(userId: number): Promise<UserRole> {
    const response = await fetch(`${this.baseUrl}/${userId}/remove-garage-role`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to remove garage role: ${response.statusText}`);
    }

    return response.json();
  }

  // Remove admin role
  async removeAdminRole(userId: number): Promise<UserRole> {
    const response = await fetch(`${this.baseUrl}/${userId}/remove-admin-role`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to remove admin role: ${response.statusText}`);
    }

    return response.json();
  }

  // Get all dual role users
  async getDualRoleUsers(): Promise<UserRole[]> {
    const response = await fetch(`${this.baseUrl}/dual-role`);

    if (!response.ok) {
      throw new Error(`Failed to get dual role users: ${response.statusText}`);
    }

    return response.json();
  }

  // Get users who can book appointments
  async getUsersWhoCanBook(): Promise<UserRole[]> {
    const response = await fetch(`${this.baseUrl}/can-book`);

    if (!response.ok) {
      throw new Error(`Failed to get users who can book: ${response.statusText}`);
    }

    return response.json();
  }

  // Get users who can manage garages
  async getUsersWhoCanManageGarages(): Promise<UserRole[]> {
    const response = await fetch(`${this.baseUrl}/can-manage-garages`);

    if (!response.ok) {
      throw new Error(`Failed to get users who can manage garages: ${response.statusText}`);
    }

    return response.json();
  }

  // Get users who can manage system
  async getUsersWhoCanManageSystem(): Promise<UserRole[]> {
    const response = await fetch(`${this.baseUrl}/can-manage-system`);

    if (!response.ok) {
      throw new Error(`Failed to get users who can manage system: ${response.statusText}`);
    }

    return response.json();
  }

  // Validate role combination
  async validateRoleCombination(roles: string[]): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roles }),
    });

    if (!response.ok) {
      throw new Error(`Failed to validate roles: ${response.statusText}`);
    }

    return response.json();
  }

  // Get role hierarchy level
  async getRoleHierarchyLevel(role: string): Promise<number> {
    const response = await fetch(`${this.baseUrl}/hierarchy/${role}`);

    if (!response.ok) {
      throw new Error(`Failed to get role hierarchy level: ${response.statusText}`);
    }

    return response.json();
  }
}

// Export singleton instance
export const userRoleApiClient = new UserRoleApiClient();

// Mock data for development
export const mockUserRoleData: UserRole[] = [
  {
    id: 1,
    name: "Nguyen Văn A",
    email: "user@gmail.com",
    phone: "1234567892",
    address: "hồ chí minh",
    imageUrl: "uploads/user1.png",
    createdAt: "2025-06-27T11:30:23",
    accountType: "GARAGE",
    roles: ["USER", "GARAGE"],
    canBookAppointments: true,
    canManageGarages: true,
    canManageSystem: false,
    isDualRole: true,
  },
  {
    id: 2,
    name: "admin",
    email: "admin@gmail.com",
    phone: "123456",
    address: "Hà Nội",
    createdAt: "2025-07-28T22:47:06",
    accountType: "ADMIN",
    roles: ["USER", "ADMIN"],
    canBookAppointments: true,
    canManageGarages: true,
    canManageSystem: true,
    isDualRole: true,
  },
  {
    id: 3,
    name: "garage",
    email: "garage@gmail.com",
    phone: "123456222333",
    address: "Đà Nẵng",
    createdAt: "2025-07-28T22:47:06",
    accountType: "GARAGE",
    roles: ["USER", "GARAGE"],
    canBookAppointments: true,
    canManageGarages: true,
    canManageSystem: false,
    isDualRole: true,
  },
];

// Mock API client for development
export const mockUserRoleApiClient = {
  addRoleToUser: async (userId: number, role: string): Promise<UserRole> => {
    const user = mockUserRoleData.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    
    if (!user.roles.includes(role)) {
      user.roles.push(role);
      user.isDualRole = user.roles.length > 1;
      user.canBookAppointments = user.roles.includes('USER');
      user.canManageGarages = user.roles.includes('GARAGE') || user.roles.includes('ADMIN');
      user.canManageSystem = user.roles.includes('ADMIN');
    }
    
    return user;
  },

  removeRoleFromUser: async (userId: number, role: string): Promise<UserRole> => {
    const user = mockUserRoleData.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    
    user.roles = user.roles.filter(r => r !== role);
    if (!user.roles.includes('USER')) user.roles.push('USER'); // Ensure USER role always present
    
    user.isDualRole = user.roles.length > 1;
    user.canBookAppointments = user.roles.includes('USER');
    user.canManageGarages = user.roles.includes('GARAGE') || user.roles.includes('ADMIN');
    user.canManageSystem = user.roles.includes('ADMIN');
    
    return user;
  },

  getUsersByRole: async (role: string): Promise<UserRole[]> => {
    return mockUserRoleData.filter(user => user.roles.includes(role));
  },

  getDualRoleUsers: async (): Promise<UserRole[]> => {
    return mockUserRoleData.filter(user => user.isDualRole);
  },

  convertToGarageOwner: async (userId: number): Promise<UserRole> => {
    return mockUserRoleApiClient.addRoleToUser(userId, 'GARAGE');
  },

  convertToAdmin: async (userId: number): Promise<UserRole> => {
    return mockUserRoleApiClient.addRoleToUser(userId, 'ADMIN');
  },

  validateRoleCombination: async (roles: string[]): Promise<boolean> => {
    const validRoles = ['USER', 'GARAGE', 'ADMIN'];
    return roles.every(role => validRoles.includes(role)) && roles.includes('USER');
  },
};

// Export the appropriate client based on environment
export const userRoleApi = config.USE_MOCK_DATA ? mockUserRoleApiClient : userRoleApiClient;
