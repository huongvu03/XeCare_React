"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Star, X, Loader2 } from "lucide-react"
import { createReviewAppointment, type CreateReviewAppointmentRequest } from "@/lib/api/ReviewAppointmentApi"
import { toast } from "sonner"

interface ReviewAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  appointmentId: number
  garageName: string
  serviceName: string
  appointmentDate: string
  onReviewSubmitted?: () => void
}

export function ReviewAppointmentModal({
  isOpen,
  onClose,
  appointmentId,
  garageName,
  serviceName,
  appointmentDate,
  onReviewSubmitted
}: ReviewAppointmentModalProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating")
      return
    }

    if (comment.trim().length < 10) {
      toast.error("Comment must be at least 10 characters")
      return
    }

    if (comment.trim().length > 500) {
      toast.error("Comment cannot exceed 500 characters")
      return
    }

    try {
      setIsSubmitting(true)
      
      const request: CreateReviewAppointmentRequest = {
        appointmentId,
        rating,
        comment: comment.trim()
      }

      await createReviewAppointment(request)
      
      toast.success("Review submitted successfully!")
      onReviewSubmitted?.()
      handleClose()
    } catch (error: any) {
      console.error("Error submitting review:", error)
      toast.error(error.response?.data?.message || "An error occurred while submitting the review")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setRating(0)
    setHoverRating(0)
    setComment("")
    setIsSubmitting(false)
    onClose()
  }

  const renderStars = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none transition-colors"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
          >
            <Star
              className={`w-8 h-8 transition-colors ${
                star <= (hoverRating || rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300 hover:text-yellow-300"
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1:
        return "Very Poor"
      case 2:
        return "Poor"
      case 3:
        return "Average"
      case 4:
        return "Good"
      case 5:
        return "Excellent"
      default:
        return ""
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Service Review</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isSubmitting}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Appointment Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900">{garageName}</h3>
            <p className="text-sm text-blue-700">{serviceName}</p>
            <p className="text-sm text-blue-600">
              {new Date(appointmentDate).toLocaleDateString('en-US')}
            </p>
          </div>

          {/* Rating */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Service Quality Rating *
            </label>
            <div className="flex items-center space-x-3">
              {renderStars()}
              {rating > 0 && (
                <span className="text-sm text-gray-600 ml-2">
                  {getRatingText(rating)}
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Your Comment *
            </label>
            <Textarea
              placeholder="Please share your experience about this service... (minimum 10 characters, maximum 500 characters)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isSubmitting}
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            <div className="text-xs text-gray-500 text-right">
              {comment.length}/500 characters
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
