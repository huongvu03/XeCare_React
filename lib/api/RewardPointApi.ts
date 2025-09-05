import axios from 'axios';
import { RewardPoint, UserRewardPoint, Promotion } from '@/types/Users/rewardPoint';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Helper function để lấy token từ localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper function để tạo headers với token
const createAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Lấy tổng hợp điểm thưởng của user
 */
export const getMyRewardPointsSummary = async (): Promise<{ data: UserRewardPoint }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/apis/reward-points/me/summary`, {
      headers: createAuthHeaders(),
    });
    return { data: response.data };
  } catch (error) {
    throw new Error('Không thể lấy thông tin điểm thưởng');
  }
};

/**
 * Lấy lịch sử giao dịch điểm thưởng (alias cho getMyRewardPoints)
 */
export const getMyRewardPointsTransactions = async (): Promise<RewardPoint[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/apis/reward-points/me/transactions`, {
      headers: createAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error('Không thể lấy lịch sử giao dịch');
  }
};

/**
 * Lấy lịch sử giao dịch điểm thưởng (function name khớp với frontend)
 */
export const getMyRewardPoints = async (): Promise<{ data: RewardPoint[] }> => {
  try {
    const transactions = await getMyRewardPointsTransactions();
    return { data: transactions };
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy cấp độ của user
 */
export const getMyLevel = async (): Promise<{ data: number }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/apis/reward-points/me/level`, {
      headers: createAuthHeaders(),
    });
    return { data: response.data };
  } catch (error) {
    throw new Error('Không thể lấy cấp độ');
  }
};

/**
 * Lấy danh sách promotion có thể dùng điểm thưởng
 */
export const getAvailableRewardPromotions = async (): Promise<Promotion[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/apis/reward-points/promotions`, {
      headers: createAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error('Không thể lấy danh sách promotion');
  }
};

/**
 * Sử dụng điểm thưởng để lấy promotion
 */
export const useRewardPointsForPromotion = async (promotionId: number): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/apis/reward-points/use-promotion`,
      { promotionId },
      { headers: createAuthHeaders() }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Không thể sử dụng promotion');
  }
};

/**
 * Sử dụng điểm thưởng tùy chỉnh
 */
export const useRewardPoints = async (request: {
  points: number;
  reason: string;
  description?: string;
  referenceType?: string;
  referenceId?: string;
}): Promise<{ data: { success: boolean; message: string } }> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/apis/reward-points/use`,
      request,
      { headers: createAuthHeaders() }
    );
    return { data: response.data };
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Không thể sử dụng điểm thưởng');
  }
};

/**
 * Admin: Cộng điểm thưởng cho user
 */
export const addRewardPoints = async (
  userId: number,
  points: number,
  reason: string,
  description: string
): Promise<RewardPoint> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/apis/reward-points/admin/add`,
      { userId, points, reason, description },
      { headers: createAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw new Error('Không thể cộng điểm thưởng');
  }
};

/**
 * Lấy bảng xếp hạng điểm thưởng
 */
export const getLeaderboard = async (limit: number = 10): Promise<{ data: UserRewardPoint[] }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/apis/reward-points/leaderboard?limit=${limit}`, {
      headers: createAuthHeaders(),
    });
    return { data: response.data };
  } catch (error) {
    throw new Error('Không thể lấy bảng xếp hạng');
  }
};

/**
 * Kiểm tra user có đủ điểm không
 */
export const checkBalance = async (requiredPoints: number): Promise<{ data: { hasEnough: boolean; availablePoints?: number; remainingPoints?: number } }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/apis/reward-points/check-balance?requiredPoints=${requiredPoints}`, {
      headers: createAuthHeaders(),
    });
    
    // Giả sử backend trả về { hasEnoughPoints: boolean }
    // Chúng ta cần thêm logic để tính remainingPoints
    const summary = await getMyRewardPointsSummary();
    const availablePoints = summary.data?.availablePoints || 0;
    const hasEnough = response.data.hasEnoughPoints;
    const remainingPoints = hasEnough ? availablePoints - requiredPoints : availablePoints;
    
    return {
      data: {
        hasEnough,
        availablePoints,
        remainingPoints
      }
    };
  } catch (error) {
    throw new Error('Không thể kiểm tra số dư');
  }
};

// Helper functions
export const getTotalPoints = (summary: UserRewardPoint): number => {
  return summary.totalPoints || 0;
};

export const getAvailablePoints = (summary: UserRewardPoint): number => {
  return summary.availablePoints || 0;
};

export const getUsedPoints = (summary: UserRewardPoint): number => {
  return summary.usedPoints || 0;
};

export const getRecentTransactions = (transactions: RewardPoint[], limit: number = 5): RewardPoint[] => {
  return transactions.slice(0, limit);
};

export const hasEnoughPoints = (summary: UserRewardPoint, requiredPoints: number): boolean => {
  return (summary.availablePoints || 0) >= requiredPoints;
};

export const getLevelName = (level: number): string => {
  switch (level) {
    case 5: return 'Diamond';
    case 4: return 'Platinum';
    case 3: return 'Gold';
    case 2: return 'Silver';
    default: return 'Bronze';
  }
};

export const getLevelColor = (level: number): string => {
  switch (level) {
    case 5: return 'text-purple-600 bg-purple-100';
    case 4: return 'text-blue-600 bg-blue-100';
    case 3: return 'text-yellow-600 bg-yellow-100';
    case 2: return 'text-gray-600 bg-gray-100';
    default: return 'text-orange-600 bg-orange-100';
  }
};