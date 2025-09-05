'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { 
  getMyRewardPointsSummary, 
  getMyRewardPoints, 
  getMyLevel,
  getLeaderboard
} from '@/lib/api/RewardPointApi';
import type { UserRewardPoint, RewardPoint, LeaderboardEntry } from '@/types/Users/rewardPoint';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Trophy, 
  Star, 
  Gift, 
  TrendingUp, 
  Clock, 
  Users,
  Award,
  Zap
} from 'lucide-react';

export default function RewardPointsPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<UserRewardPoint | null>(null);
  const [transactions, setTransactions] = useState<RewardPoint[]>([]);
  const [level, setLevel] = useState<number>(1);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'leaderboard'>('overview');

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [summaryData, transactionsData, levelData, leaderboardData] = await Promise.all([
        getMyRewardPointsSummary(),
        getMyRewardPoints(),
        getMyLevel(),
        getLeaderboard(10)
      ]);

      setSummary(summaryData.data);
      setTransactions(transactionsData.data);
      setLevel(levelData.data);
      setLeaderboard(leaderboardData.data);
    } catch (error) {
      console.error('Error loading reward points data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelInfo = (level: number) => {
    const levels = {
      1: { name: 'Bronze', color: '#CD7F32', icon: '🥉', nextPoints: 500 },
      2: { name: 'Silver', color: '#C0C0C0', icon: '🥈', nextPoints: 2000 },
      3: { name: 'Gold', color: '#FFD700', icon: '🥇', nextPoints: 5000 },
      4: { name: 'Platinum', color: '#E5E4E2', icon: '💎', nextPoints: 10000 },
      5: { name: 'Diamond', color: '#B9F2FF', icon: '💠', nextPoints: null }
    };
    return levels[level as keyof typeof levels] || levels[1];
  };

  const getLevelProgress = () => {
    if (!summary) return 0;
    const currentLevel = getLevelInfo(level);
    if (!currentLevel.nextPoints) return 100;
    
    const prevLevelPoints = level === 1 ? 0 : 
      level === 2 ? 500 : 
      level === 3 ? 2000 : 
      level === 4 ? 5000 : 0;
    
    const currentLevelRange = currentLevel.nextPoints - prevLevelPoints;
    const userProgress = summary.totalPoints - prevLevelPoints;
    return Math.min(100, Math.max(0, (userProgress / currentLevelRange) * 100));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'EARNED': return <Star className="w-4 h-4 text-green-500" />;
      case 'REDEEMED': return <Gift className="w-4 h-4 text-red-500" />;
      case 'BONUS': return <Zap className="w-4 h-4 text-yellow-500" />;
      case 'REFERRAL': return <Users className="w-4 h-4 text-blue-500" />;
      default: return <Star className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Điểm Thưởng</h1>
            <p className="text-gray-600">Quản lý và theo dõi điểm thưởng của bạn</p>
          </div>
          <Button
            onClick={() => window.location.href = '/reward-points/use'}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
          >
            <Gift className="w-4 h-4 mr-2" />
            Sử dụng điểm
          </Button>
        </div>
      </div>

      {/* Level Progress */}
      <Card className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">{getLevelInfo(level).icon}</div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Cấp độ {getLevelInfo(level).name}
                </h2>
                <p className="text-gray-600">
                  {summary?.totalPoints} điểm tổng cộng
                </p>
              </div>
            </div>
            <Badge 
              className="text-lg px-4 py-2"
              style={{ backgroundColor: getLevelInfo(level).color, color: '#000' }}
            >
              {getLevelInfo(level).name}
            </Badge>
          </div>
          
          <div className="mb-2 flex justify-between text-sm text-gray-600">
            <span>Tiến độ cấp độ</span>
            <span>{Math.round(getLevelProgress())}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${getLevelProgress()}%` }}
            ></div>
          </div>
          {getLevelInfo(level).nextPoints && (
            <p className="text-sm text-gray-500 mt-2">
              Cần thêm {getLevelInfo(level).nextPoints - (summary?.totalPoints || 0)} điểm để lên cấp tiếp theo
            </p>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Điểm khả dụng</p>
                <p className="text-2xl font-bold text-gray-900">{summary?.availablePoints || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng điểm</p>
                <p className="text-2xl font-bold text-gray-900">{summary?.totalPoints || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Gift className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đã sử dụng</p>
                <p className="text-2xl font-bold text-gray-900">{summary?.usedPoints || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đã hết hạn</p>
                <p className="text-2xl font-bold text-gray-900">{summary?.expiredPoints || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Tổng quan', icon: Award },
            { id: 'transactions', label: 'Giao dịch', icon: TrendingUp },
            { id: 'leaderboard', label: 'Bảng xếp hạng', icon: Trophy }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span>Thành tích gần đây</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-medium text-gray-900">{transaction.reason}</p>
                        <p className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.points > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.points > 0 ? '+' : ''}{transaction.points} điểm
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {transaction.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'transactions' && (
        <Card>
          <CardHeader>
            <CardTitle>Lịch sử giao dịch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <p className="font-medium text-gray-900">{transaction.reason}</p>
                      <p className="text-sm text-gray-500">{transaction.description}</p>
                      <p className="text-xs text-gray-400">{formatDate(transaction.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-lg ${
                      transaction.points > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.points > 0 ? '+' : ''}{transaction.points} điểm
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {transaction.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'leaderboard' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span>Bảng xếp hạng điểm thưởng</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboard.map((entry, index) => (
                <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                      {index === 0 && <span className="text-yellow-500">🥇</span>}
                      {index === 1 && <span className="text-gray-400">🥈</span>}
                      {index === 2 && <span className="text-orange-500">🥉</span>}
                      {index > 2 && <span className="text-gray-600 font-semibold">{index + 1}</span>}
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {entry.user.imageUrl ? (
                          <img src={entry.user.imageUrl} alt={entry.user.name} className="w-10 h-10 rounded-full" />
                        ) : (
                          <span className="text-gray-600 font-semibold">
                            {entry.user.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{entry.user.name}</p>
                        <p className="text-sm text-gray-500">{entry.user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg text-gray-900">{entry.totalPoints} điểm</p>
                    <Badge 
                      className="text-xs"
                      style={{ backgroundColor: getLevelInfo(entry.level).color, color: '#000' }}
                    >
                      {entry.levelName}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
