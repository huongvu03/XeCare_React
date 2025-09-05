export interface RewardPoint {
  id: number;
  userId: number;
  points: number;
  reason: string;
  description?: string;
  type: 'EARNED' | 'REDEEMED' | 'EXPIRED' | 'BONUS' | 'REFERRAL' | 'LOYALTY' | 'PROMOTION';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'CANCELLED' | 'EXPIRED';
  referenceId?: string;
  referenceType?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UserRewardPoint {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    imageUrl?: string;
  };
  totalPoints: number;
  availablePoints: number;
  usedPoints: number;
  totalTransactions: number;
  level: number;
  lastEarnedAt?: string;
  lastUsedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Promotion {
  id?: number;
  code: string;
  description: string;
  discountPercent?: number;
  maxDiscountAmount?: number;
  validFrom: string;
  validTo: string;
  active: boolean;
  requiredPoints?: number;
  promotionType?: string;
  isRewardPromotion?: boolean;
  maxUsagePerUser?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RewardPointSummary {
  totalPoints: number;
  availablePoints: number;
  usedPoints: number;
  expiredPoints: number;
  totalTransactions: number;
  level: number;
  levelName: string;
  levelColor: string;
}

export interface AddRewardPointRequest {
  points: number;
  reason: string;
  description?: string;
  type?: 'EARNED' | 'REDEEMED' | 'EXPIRED' | 'BONUS' | 'REFERRAL' | 'LOYALTY' | 'PROMOTION';
  referenceType?: string;
  referenceId?: string;
}

export interface UseRewardPointsRequest {
  points: number;
  reason: string;
  description?: string;
  referenceType?: string;
  referenceId?: string;
}

export interface UseRewardPointsResponse {
  success: boolean;
  message: string;
}

export interface CheckBalanceResponse {
  hasEnoughPoints: boolean;
  requiredPoints: number;
  availablePoints?: number;
  remainingPoints?: number;
}

export interface LeaderboardEntry {
  id: number;
  userId: number;
  totalPoints: number;
  level: number;
  levelName: string;
  levelColor: string;
  user: {
    id: number;
    name: string;
    email: string;
    imageUrl?: string;
  };
}
