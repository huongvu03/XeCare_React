import { addRewardPoints } from "@/lib/api/RewardPointApi";

export class RewardPointService {
  // Điểm thưởng cho các hành động
  private static readonly POINTS = {
    BOOKING_COMPLETED: 50,      // Hoàn thành đặt lịch
    REVIEW_SUBMITTED: 20,       // Đánh giá garage
    FIRST_BOOKING: 100,         // Đặt lịch đầu tiên
    REFERRAL: 200,              // Giới thiệu bạn bè
    WEEKLY_LOGIN: 10,           // Đăng nhập hàng tuần
    PROFILE_COMPLETED: 30,      // Hoàn thành hồ sơ
    VEHICLE_ADDED: 15,          // Thêm xe mới
    EMERGENCY_REQUEST: 25,      // Yêu cầu cứu hộ
  };

  // Thêm điểm thưởng cho hoàn thành đặt lịch
  static async addBookingCompletedPoints() {
    try {
      await addRewardPoints({
        points: this.POINTS.BOOKING_COMPLETED,
        reason: "Hoàn thành đặt lịch dịch vụ"
      });
      return true;
    } catch (error) {
      console.error("Failed to add booking completed points:", error);
      return false;
    }
  }

  // Thêm điểm thưởng cho đánh giá
  static async addReviewSubmittedPoints() {
    try {
      await addRewardPoints({
        points: this.POINTS.REVIEW_SUBMITTED,
        reason: "Đánh giá và chia sẻ trải nghiệm garage"
      });
      return true;
    } catch (error) {
      console.error("Failed to add review points:", error);
      return false;
    }
  }

  // Thêm điểm thưởng cho đặt lịch đầu tiên
  static async addFirstBookingPoints() {
    try {
      await addRewardPoints({
        points: this.POINTS.FIRST_BOOKING,
        reason: "Đặt lịch dịch vụ đầu tiên - Chào mừng bạn!"
      });
      return true;
    } catch (error) {
      console.error("Failed to add first booking points:", error);
      return false;
    }
  }

  // Thêm điểm thưởng cho giới thiệu
  static async addReferralPoints() {
    try {
      await addRewardPoints({
        points: this.POINTS.REFERRAL,
        reason: "Giới thiệu bạn bè sử dụng dịch vụ"
      });
      return true;
    } catch (error) {
      console.error("Failed to add referral points:", error);
      return false;
    }
  }

  // Thêm điểm thưởng cho đăng nhập hàng tuần
  static async addWeeklyLoginPoints() {
    try {
      await addRewardPoints({
        points: this.POINTS.WEEKLY_LOGIN,
        reason: "Đăng nhập tuần này - Duy trì hoạt động"
      });
      return true;
    } catch (error) {
      console.error("Failed to add weekly login points:", error);
      return false;
    }
  }

  // Thêm điểm thưởng cho hoàn thành hồ sơ
  static async addProfileCompletedPoints() {
    try {
      await addRewardPoints({
        points: this.POINTS.PROFILE_COMPLETED,
        reason: "Hoàn thành hồ sơ cá nhân"
      });
      return true;
    } catch (error) {
      console.error("Failed to add profile completed points:", error);
      return false;
    }
  }

  // Thêm điểm thưởng cho thêm xe mới
  static async addVehicleAddedPoints() {
    try {
      await addRewardPoints({
        points: this.POINTS.VEHICLE_ADDED,
        reason: "Thêm xe mới vào quản lý"
      });
      return true;
    } catch (error) {
      console.error("Failed to add vehicle added points:", error);
      return false;
    }
  }

  // Thêm điểm thưởng cho yêu cầu cứu hộ
  static async addEmergencyRequestPoints() {
    try {
      await addRewardPoints({
        points: this.POINTS.EMERGENCY_REQUEST,
        reason: "Sử dụng dịch vụ cứu hộ khẩn cấp"
      });
      return true;
    } catch (error) {
      console.error("Failed to add emergency request points:", error);
      return false;
    }
  }

  // Kiểm tra xem có phải đặt lịch đầu tiên không
  static isFirstBooking(bookingCount: number): boolean {
    return bookingCount === 1;
  }

  // Kiểm tra xem có phải đăng nhập hàng tuần không
  static isWeeklyLogin(lastLoginDate: Date): boolean {
    const now = new Date();
    const lastLogin = new Date(lastLoginDate);
    const diffTime = Math.abs(now.getTime() - lastLogin.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 7;
  }

  // Lấy thông tin điểm thưởng
  static getPointsInfo() {
    return this.POINTS;
  }
}
