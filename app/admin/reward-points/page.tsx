'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { 
  getLeaderboard, 
  addRewardPoints,
  getAvailableRewardPromotions
} from '@/lib/api/RewardPointApi';
import { UserRewardPoint, Promotion } from '@/types/Users/rewardPoint';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Gift, 
  Trophy, 
  TrendingUp, 
  Users, 
  Plus,
  Search,
  Filter,
  BarChart3,
  Crown,
  Star,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminRewardPointsPage() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<UserRewardPoint[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [formData, setFormData] = useState({
    userId: '',
    points: '',
    reason: '',
    description: ''
  });

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [leaderboardData, promotionsData] = await Promise.all([
        getLeaderboard(100), // Get more users for admin view
        getAvailableRewardPromotions()
      ]);

      setLeaderboard(leaderboardData);
      setPromotions(promotionsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.userId || !formData.points || !formData.reason.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const points = parseInt(formData.points);
    if (isNaN(points) || points <= 0) {
      toast.error('Số điểm phải là số dương');
      return;
    }

    try {
      setSubmitting(true);
      await addRewardPoints(
        parseInt(formData.userId),
        points,
        formData.reason,
        formData.description
      );
      
      toast.success('Đã cộng điểm thưởng thành công!');
      
      // Reset form
      setFormData({
        userId: '',
        points: '',
        reason: '',
        description: ''
      });
      
      // Reload data
      await loadData();
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi cộng điểm thưởng');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getLevelName = (level: number): string => {
    switch (level) {
      case 5: return 'Diamond';
      case 4: return 'Platinum';
      case 3: return 'Gold';
      case 2: return 'Silver';
      default: return 'Bronze';
    }
  };

  const getLevelColor = (level: number): string => {
    switch (level) {
      case 5: return 'text-purple-600 bg-purple-100';
      case 4: return 'text-blue-600 bg-blue-100';
      case 3: return 'text-yellow-600 bg-yellow-100';
      case 2: return 'text-gray-600 bg-gray-100';
      default: return 'text-orange-600 bg-orange-100';
    }
  };

  const getPromotionTypeColor = (type: string) => {
    switch (type) {
      case 'DISCOUNT': return 'bg-blue-100 text-blue-800';
      case 'FREE_SERVICE': return 'bg-green-100 text-green-800';
      case 'CASHBACK': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPromotionTypeIcon = (type: string) => {
    switch (type) {
      case 'DISCOUNT': return <Gift className="h-4 w-4" />;
      case 'FREE_SERVICE': return <Star className="h-4 w-4" />;
      case 'CASHBACK': return <Zap className="h-4 w-4" />;
      default: return <Gift className="h-4 w-4" />;
    }
  };

  // Filter and search
  const filteredLeaderboard = leaderboard.filter(entry => {
    const matchesSearch = entry.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || entry.level.toString() === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  // Statistics
  const totalUsers = leaderboard.length;
  const totalPoints = leaderboard.reduce((sum, entry) => sum + entry.totalPoints, 0);
  const averagePoints = totalUsers > 0 ? Math.round(totalPoints / totalUsers) : 0;
  
  const levelDistribution = leaderboard.reduce((acc, entry) => {
    acc[entry.level] = (acc[entry.level] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý điểm thưởng</h1>
        <p className="text-gray-600">Theo dõi và quản lý hệ thống điểm thưởng</p>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">📝 Hướng dẫn sử dụng:</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>Cộng điểm thưởng:</strong> Nhập User ID và số điểm muốn cộng</p>
            <p><strong>User ID:</strong> Xem trong bảng xếp hạng dưới đây hoặc từ database Users</p>
            <p><strong>Lý do:</strong> Ví dụ: "Thưởng đặc biệt", "Bù điểm", "Event khuyến mãi"</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-600">Tổng số user</p>
                <p className="text-2xl font-bold text-blue-900">{totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-600">Tổng điểm</p>
                <p className="text-2xl font-bold text-green-900">{totalPoints.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-purple-600">Điểm trung bình</p>
                <p className="text-2xl font-bold text-purple-900">{averagePoints.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Crown className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-yellow-600">Cấp cao nhất</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {Math.max(...leaderboard.map(e => e.level))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add Reward Points Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Cộng điểm thưởng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="userId">User ID <span className="text-red-500">*</span></Label>
                <Input
                  id="userId"
                  type="number"
                  value={formData.userId}
                  onChange={(e) => handleInputChange('userId', e.target.value)}
                  placeholder="Nhập ID của user (xem bảng dưới)"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Lấy User ID từ bảng xếp hạng bên dưới</p>
              </div>

              <div>
                <Label htmlFor="points">Số điểm <span className="text-red-500">*</span></Label>
                <Input
                  id="points"
                  type="number"
                  value={formData.points}
                  onChange={(e) => handleInputChange('points', e.target.value)}
                  placeholder="Nhập số điểm muốn cộng"
                  min="1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="reason">Lý do <span className="text-red-500">*</span></Label>
                <Input
                  id="reason"
                  type="text"
                  value={formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  placeholder="Ví dụ: Thưởng đặc biệt, Bù điểm..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Mô tả (tùy chọn)</Label>
                <Input
                  id="description"
                  type="text"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Mô tả chi tiết..."
                />
              </div>

              <Button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Cộng điểm thưởng
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Level Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Phân bố cấp độ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((level) => {
                const count = levelDistribution[level] || 0;
                const percentage = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0;
                
                return (
                  <div key={level} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className={`text-xs ${getLevelColor(level)}`}>
                          {getLevelName(level)}
                        </Badge>
                        <span className="text-sm text-gray-600">Cấp {level}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {count} user ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Promotions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Gift className="h-5 w-5 mr-2" />
            Promotions có sẵn ({promotions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {promotions.length === 0 ? (
            <div className="text-center py-8">
              <Gift className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Không có promotion nào</p>
              <p className="text-xs text-gray-400 mt-1">Chạy migration script để thêm promotion mẫu</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {promotions.map((promotion) => (
                <div key={promotion.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getPromotionTypeIcon(promotion.promotionType || 'DISCOUNT')}
                      <Badge className={getPromotionTypeColor(promotion.promotionType || 'DISCOUNT')}>
                        {promotion.promotionType || 'DISCOUNT'}
                      </Badge>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {promotion.requiredPoints} điểm
                    </Badge>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">{promotion.description}</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Mã: <code className="bg-gray-200 px-1 rounded">{promotion.code}</code></p>
                    {promotion.discountPercent && (
                      <p>Giảm: {promotion.discountPercent}%</p>
                    )}
                    {promotion.maxDiscountAmount && (
                      <p>Tối đa: {promotion.maxDiscountAmount.toLocaleString()}đ</p>
                    )}
                    <p>Hạn: {promotion.validTo ? new Date(promotion.validTo).toLocaleDateString('vi-VN') : 'Không giới hạn'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            Bảng xếp hạng điểm thưởng
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tên hoặc email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm"
              >
                <option value="all">Tất cả cấp độ</option>
                <option value="1">Bronze</option>
                <option value="2">Silver</option>
                <option value="3">Gold</option>
                <option value="4">Platinum</option>
                <option value="5">Diamond</option>
              </select>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">#</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">User ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Cấp độ</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Tổng điểm</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Điểm khả dụng</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Giao dịch</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaderboard.map((entry, index) => (
                  <tr key={entry.user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-500 text-white' :
                        'bg-blue-500 text-white'
                      }`}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{entry.user.name}</p>
                        <p className="text-sm text-gray-500">{entry.user.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-xs">
                        ID: {entry.user.id}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={`text-xs ${getLevelColor(entry.level)}`}>
                        {getLevelName(entry.level)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-gray-900">
                        {entry.totalPoints.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-green-600 font-medium">
                        {entry.availablePoints.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-600">
                        {entry.totalTransactions}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLeaderboard.length === 0 && (
            <div className="text-center py-8">
              <Trophy className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Không tìm thấy kết quả nào</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card className="mt-8 bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">💡 Hướng dẫn sử dụng điểm thưởng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-green-800 mb-2">Cách user tích lũy điểm:</h4>
              <ul className="space-y-1 text-green-700">
                <li>• Đặt lịch hẹn: +10 điểm</li>
                <li>• Hoàn thành dịch vụ: +20 điểm</li>
                <li>• Đánh giá garage: +5 điểm</li>
                <li>• Sử dụng khẩn cấp: +15 điểm</li>
                <li>• Giới thiệu bạn bè: +50 điểm</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-800 mb-2">Cách user sử dụng điểm:</h4>
              <ul className="space-y-1 text-green-700">
                <li>• Vào trang /reward-points</li>
                <li>• Chọn "Sử dụng điểm"</li>
                <li>• Chọn promotion muốn đổi</li>
                <li>• Xác nhận sử dụng điểm</li>
                <li>• Nhận mã giảm giá</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}