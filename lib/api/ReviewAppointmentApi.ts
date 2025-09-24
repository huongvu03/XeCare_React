// lib/api/ReviewAppointmentApi.ts
import axiosClient from "../axiosClient"

export interface ReviewAppointment {
  id: number
  appointmentId: number
  garageId: number
  garageName: string
  rating: number
  comment: string
  createdAt: string
  updatedAt?: string
  userName: string
  userAvatar?: string
  serviceName: string
  appointmentDate: string
  appointmentTime: string
}

export interface CreateReviewAppointmentRequest {
  appointmentId: number
  rating: number
  comment: string
}

export interface ReviewAppointmentResponse {
  content: ReviewAppointment[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export interface GarageRatingStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    [key: number]: number
  }
}

export interface CanReviewResponse {
  canReview: boolean
  hasReviewed: boolean
}

export interface CanReviewApiResponse {
  success: boolean
  canReview: boolean
  hasReviewed: boolean
  message?: string
}

// Tạo đánh giá cho appointment
export const createReviewAppointment = (data: CreateReviewAppointmentRequest) =>
  axiosClient.post(`/apis/review-appointment/${data.appointmentId}`, {
    rating: data.rating,
    comment: data.comment
  })

// Lấy danh sách đánh giá của garage
export const getGarageReviews = (garageId: number, params?: {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: string
}) =>
  axiosClient.get<ReviewAppointmentResponse>(`/apis/review-appointment/garage/${garageId}`, { params })

// Lấy danh sách đánh giá của user
export const getUserReviews = (userId: number, params?: {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: string
}) =>
  axiosClient.get<ReviewAppointmentResponse>(`/apis/review-appointment/user/${userId}`, { params })

// Lấy thống kê đánh giá của garage
export const getGarageRatingStats = (garageId: number) =>
  axiosClient.get<GarageRatingStats>(`/apis/review-appointment/garage/${garageId}/stats`)

// Lấy đánh giá theo rating cụ thể
export const getReviewsByRating = (garageId: number, rating: number) =>
  axiosClient.get<ReviewAppointment[]>(`/apis/review-appointment/garage/${garageId}/rating/${rating}`)

// Kiểm tra user có thể đánh giá appointment không
export const canUserReviewAppointment = (appointmentId: number) =>
  axiosClient.get<CanReviewApiResponse>(`/apis/review-appointment/can-review/${appointmentId}`)

// Lấy lịch sử đánh giá của user hiện tại
export const getMyReviews = (params?: {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: string
}) =>
  axiosClient.get<ReviewAppointmentResponse>("/apis/review-appointment/my-reviews", { params })
