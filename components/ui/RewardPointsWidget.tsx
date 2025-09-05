'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { getMyRewardPointsSummary } from '@/lib/api/RewardPointApi';
import type { UserRewardPoint } from '@/types/Users/rewardPoint';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Star, 
  Gift, 
  TrendingUp,
  Zap,
  Coins
} from 'lucide-react';

interface RewardPointsWidgetProps {
  className?: string;
  showDetails?: boolean;
}

export default function RewardPointsWidget({ className = '', showDetails = false }: RewardPointsWidgetProps) {
  const { user } = useAuth();
  const [summary, setSummary] = useState<UserRewardPoint | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadRewardPoints();
    }
  }, [user]);

  const loadRewardPoints = async () => {
    try {
      setLoading(true);
      const response = await getMyRewardPointsSummary();
      setSummary(response.data);
    } catch (error) {
      console.error('Error loading reward points:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelInfo = (level: number) => {
    const levels = {
      1: { name: 'Bronze', color: '#CD7F32', icon: '🥉' },
      2: { name: 'Silver', color: '#C0C0C0', icon: '🥈' },
      3: { name: 'Gold', color: '#FFD700', icon: '🥇' },
      4: { name: 'Platinum', color: '#E5E4E2', icon: '💎' },
      5: { name: 'Diamond', color: '#B9F2FF', icon: '💠' }
    };
    return levels[level as keyof typeof levels] || levels[1];
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
    );
  }

  if (!summary) return null;

  const levelInfo = getLevelInfo(summary.level);

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Compact View */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
          <Star className="w-3 h-3" />
          <span>{summary.availablePoints}</span>
        </div>
        
        <Badge 
          variant="outline" 
          className="text-xs px-2 py-1"
          style={{ 
            backgroundColor: levelInfo.color, 
            color: '#000',
            borderColor: levelInfo.color 
          }}
        >
          {levelInfo.icon} {levelInfo.name}
        </Badge>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        <Link href="/reward-points">
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
            <TrendingUp className="w-3 h-3 mr-1" />
            Xem
          </Button>
        </Link>
        
        {summary.availablePoints > 0 && (
          <Link href="/reward-points/use">
            <Button size="sm" className="h-8 px-2 text-xs bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
              <Gift className="w-3 h-3 mr-1" />
              Dùng
            </Button>
          </Link>
        )}
      </div>

      {/* Detailed View (if enabled) */}
      {showDetails && (
        <div className="hidden lg:block ml-4 pl-4 border-l border-gray-200">
          <div className="text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <span>Tổng: {summary.totalPoints}</span>
              <span>•</span>
              <span>Đã dùng: {summary.usedPoints}</span>
              <span>•</span>
              <span>Giao dịch: {summary.totalTransactions}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact version for mobile
export function RewardPointsCompact({ className = '' }: { className?: string }) {
  const { user } = useAuth();
  const [summary, setSummary] = useState<UserRewardPoint | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadRewardPoints();
    }
  }, [user]);

  const loadRewardPoints = async () => {
    try {
      setLoading(true);
      const response = await getMyRewardPointsSummary();
      setSummary(response.data);
    } catch (error) {
      console.error('Error loading reward points:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading || !summary) return null;

  return (
    <Link href="/reward-points" className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
        <Star className="w-3 h-3" />
        <span>{summary.availablePoints}</span>
      </div>
    </Link>
  );
}

// Floating action button for quick access
export function RewardPointsFAB() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<UserRewardPoint | null>(null);

  useEffect(() => {
    if (user) {
      loadRewardPoints();
    }
  }, [user]);

  const loadRewardPoints = async () => {
    try {
      const response = await getMyRewardPointsSummary();
      setSummary(response.data);
    } catch (error) {
      console.error('Error loading reward points:', error);
    }
  };

  if (!user || !summary) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link href="/reward-points">
        <Button 
          size="lg" 
          className="h-14 w-14 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="text-center">
            <Star className="w-6 h-6 mx-auto mb-1" />
            <div className="text-xs font-bold">{summary.availablePoints}</div>
          </div>
        </Button>
      </Link>
    </div>
  );
}
