'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { 
  getMyRewardPointsSummary, 
  useRewardPoints,
  checkBalance 
} from '@/lib/api/RewardPointApi';
import type { UserRewardPoint, UseRewardPointsRequest } from '@/types/Users/rewardPoint';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { 
  Gift, 
  Star, 
  AlertCircle, 
  CheckCircle, 
  ArrowLeft,
  Zap,
  Coins
} from 'lucide-react';

export default function UseRewardPointsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [summary, setSummary] = useState<UserRewardPoint | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<UseRewardPointsRequest>({
    points: 0,
    reason: '',
    description: '',
    referenceType: 'REDEMPTION',
    referenceId: ''
  });
  const [balanceCheck, setBalanceCheck] = useState<{
    hasEnough: boolean;
    availablePoints?: number;
    remainingPoints?: number;
  } | null>(null);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await getMyRewardPointsSummary();
      setSummary(response.data);
    } catch (error) {
      console.error('Error loading reward points data:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin điểm thưởng",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UseRewardPointsRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Check balance when points change
    if (field === 'points' && typeof value === 'number' && value > 0) {
      checkBalanceForPoints(value);
    }
  };

  const checkBalanceForPoints = async (points: number) => {
    try {
      const response = await checkBalance(points);
      setBalanceCheck(response.data);
    } catch (error) {
      console.error('Error checking balance:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.points || formData.points <= 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập số điểm hợp lệ",
        variant: "destructive",
      });
      return;
    }

    if (!formData.reason.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập lý do sử dụng điểm",
        variant: "destructive",
      });
      return;
    }

    if (!balanceCheck?.hasEnough) {
      toast({
        title: "Lỗi",
        description: "Bạn không đủ điểm để thực hiện giao dịch này",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await useRewardPoints(formData);
      
      if (response.data.success) {
        toast({
          title: "Thành công",
          description: response.data.message,
          variant: "default",
        });
        
        // Reset form and reload data
        setFormData({
          points: 0,
          reason: '',
          description: '',
          referenceType: 'REDEMPTION',
          referenceId: ''
        });
        setBalanceCheck(null);
        await loadData();
        
        // Redirect back to reward points page
        setTimeout(() => {
          router.push('/reward-points');
        }, 1500);
      } else {
        toast({
          title: "Lỗi",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error using reward points:', error);
      toast({
        title: "Lỗi",
        description: "Không thể thực hiện giao dịch. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getQuickAmounts = () => {
    if (!summary) return [];
    const available = summary.availablePoints;
    return [
      { amount: 100, label: '100 điểm' },
      { amount: 200, label: '200 điểm' },
      { amount: 500, label: '500 điểm' },
      { amount: Math.min(1000, available), label: '1000 điểm' }
    ].filter(item => item.amount <= available);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sử Dụng Điểm Thưởng</h1>
        <p className="text-gray-600">Đổi điểm thưởng để nhận các ưu đãi đặc biệt</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Balance */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-800">
              <Coins className="w-5 h-5" />
              <span>Thông Tin Điểm Thưởng</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {summary?.availablePoints || 0}
              </div>
              <p className="text-blue-700 font-medium">Điểm khả dụng</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-gray-800">
                  {summary?.totalPoints || 0}
                </div>
                <p className="text-sm text-gray-600">Tổng điểm</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-gray-800">
                  {summary?.usedPoints || 0}
                </div>
                <p className="text-sm text-gray-600">Đã sử dụng</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">Cách sử dụng điểm:</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>100 điểm = Giảm 10,000đ</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>200 điểm = Giảm 25,000đ</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>500 điểm = Giảm 75,000đ</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>1000 điểm = Giảm 200,000đ</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Use Points Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Gift className="w-5 h-5 text-green-600" />
              <span>Đổi Điểm Thưởng</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Quick Amount Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Chọn số điểm nhanh:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {getQuickAmounts().map((item) => (
                    <Button
                      key={item.amount}
                      type="button"
                      variant="outline"
                      onClick={() => handleInputChange('points', item.amount)}
                      className={`h-12 ${
                        formData.points === item.amount 
                          ? 'border-green-500 bg-green-50 text-green-700' 
                          : ''
                      }`}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-2">
                  Hoặc nhập số điểm tùy chỉnh:
                </label>
                <Input
                  id="points"
                  type="number"
                  min="1"
                  max={summary?.availablePoints || 0}
                  value={formData.points || ''}
                  onChange={(e) => handleInputChange('points', parseInt(e.target.value) || 0)}
                  placeholder="Nhập số điểm muốn sử dụng"
                  className="h-12"
                />
              </div>

              {/* Balance Check Result */}
              {balanceCheck && (
                <div className={`p-3 rounded-lg ${
                  balanceCheck.hasEnough 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    {balanceCheck.hasEnough ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`font-medium ${
                      balanceCheck.hasEnough ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {balanceCheck.hasEnough 
                        ? `Đủ điểm! Sẽ còn lại ${balanceCheck.remainingPoints} điểm`
                        : `Không đủ điểm! Bạn cần thêm ${formData.points - (balanceCheck.availablePoints || 0)} điểm`
                      }
                    </span>
                  </div>
                </div>
              )}

              {/* Reason */}
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do sử dụng điểm: <span className="text-red-500">*</span>
                </label>
                <Input
                  id="reason"
                  type="text"
                  value={formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  placeholder="Ví dụ: Giảm giá dịch vụ, Đổi quà tặng..."
                  className="h-12"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả chi tiết (tùy chọn):
                </label>
                <Input
                  id="description"
                  type="text"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Mô tả chi tiết về việc sử dụng điểm..."
                  className="h-12"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitting || !formData.points || !formData.reason.trim() || !balanceCheck?.hasEnough}
                className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold"
              >
                {submitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang xử lý...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5" />
                    <span>Sử Dụng {formData.points} Điểm</span>
                  </div>
                )}
              </Button>

              {/* Warning */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Điểm thưởng không thể hoàn lại sau khi sử dụng</li>
                      <li>• Mỗi giao dịch chỉ có thể sử dụng một lần</li>
                      <li>• Điểm sẽ được trừ ngay lập tức sau khi xác nhận</li>
                    </ul>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
