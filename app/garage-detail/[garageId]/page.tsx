"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Star,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Car,
  Wrench,
  Navigation,
  MessageCircle,
  Image as ImageIcon,
  Filter,
  ChevronDown,
  ChevronUp,
  Edit3,
  Send,
  X,
  CalendarDays
} from "lucide-react"
import { getPublicGarageById, type PublicGarageInfo } from "@/lib/api/UserApi"
import { getFullImageUrl, isPlaceholderImage } from "@/utils/imageUtils"

export default function PublicGarageDetailPage() {
  const router = useRouter()
  const params = useParams()
  const garageId = Number(params.garageId)
  
  const [garage, setGarage] = useState<PublicGarageInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  
  // Review states
  const [reviews, setReviews] = useState<any[]>([])
  const [reviewStats, setReviewStats] = useState<any>(null)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [selectedRating, setSelectedRating] = useState<number>(0)
  const [showAllReviews, setShowAllReviews] = useState(false)
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  
  // Review form states
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewFormData, setReviewFormData] = useState({
    rating: 0,
    comment: ''
  })
  const [submitLoading, setSubmitLoading] = useState(false)

  // Load garage details and reviews
  useEffect(() => {
    const loadInitialData = async () => {
      if (!garageId) return
      
      setLoading(true)
      try {
        // Load garage details
        const response = await getPublicGarageById(garageId)
        setGarage(response.data)
        
        // Load reviews and stats
        await loadReviews()
      } catch (err: any) {
        console.error("Error loading garage:", err)
        setError("Cannot load garage information")
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [garageId])

  // Load garage reviews with pagination
  const loadReviews = async (page: number = 0, append: boolean = false) => {
    if (!garageId) return
    
    setReviewsLoading(true)
    try {
      // Check if user is authenticated for reviews API
      const token = localStorage.getItem('token')
      console.log('🔍 [loadReviews] Token exists:', !!token)
      
      // Load reviews with pagination
      const reviewsUrl = `http://localhost:8080/apis/reviews/garage/${garageId}?page=${page}&size=10`
      console.log('🔍 [loadReviews] Fetching URL:', reviewsUrl)
      
      const reviewsResponse = await fetch(reviewsUrl, {
        headers: token ? {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } : {}
      })
      console.log('🔍 [loadReviews] Response status:', reviewsResponse.status)
      console.log('🔍 [loadReviews] Response ok:', reviewsResponse.ok)
      if (reviewsResponse.ok) {
        try {
        const reviewsData = await reviewsResponse.json()
          console.log('🔍 [loadReviews] API Response:', reviewsData)
          
          const newReviews = reviewsData.content || []
          console.log('🔍 [loadReviews] New reviews:', newReviews)
          console.log('🔍 [loadReviews] Reviews count:', newReviews.length)
          
          if (append) {
            setReviews(prev => [...prev, ...newReviews])
          } else {
            setReviews(newReviews)
          }
          
          // Update pagination info
          setCurrentPage(page)
          setTotalPages(reviewsData.totalPages || 0)
          setTotalElements(reviewsData.totalElements || 0)
          setHasMore(page < (reviewsData.totalPages - 1))
        } catch (parseError) {
          console.error('Error parsing reviews response:', parseError)
          if (!append) setReviews([])
        }
      } else {
        console.error('🔍 [loadReviews] Response not OK:', reviewsResponse.status, reviewsResponse.statusText)
        const errorText = await reviewsResponse.text()
        console.error('🔍 [loadReviews] Error response:', errorText)
        if (!append) setReviews([])
      }
      
      // Load review stats (only on first load)
      if (page === 0) {
      const statsResponse = await fetch(`http://localhost:8080/apis/reviews/garage/${garageId}/stats`)
      if (statsResponse.ok) {
          try {
        const statsData = await statsResponse.json()
        setReviewStats(statsData)
          } catch (parseError) {
            console.error('Error parsing stats response:', parseError)
          }
        }
      }
    } catch (err) {
      console.error("Error loading reviews:", err)
    } finally {
      setReviewsLoading(false)
    }
  }

  // Load reviews by rating
  const loadReviewsByRating = async (rating: number) => {
    if (!garageId) return
    
    setReviewsLoading(true)
    setCurrentPage(0) // Reset pagination when filtering
    try {
      const token = localStorage.getItem('token')
      console.log('🔍 [loadReviewsByRating] Token exists:', !!token)
      
      const ratingUrl = `http://localhost:8080/apis/reviews/garage/${garageId}/rating/${rating}`
      console.log('🔍 [loadReviewsByRating] Fetching URL:', ratingUrl)
      
      const response = await fetch(ratingUrl, {
        headers: token ? {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } : {}
      })
      console.log('🔍 [loadReviewsByRating] Response status:', response.status)
      console.log('🔍 [loadReviewsByRating] Response ok:', response.ok)
      
      if (response.ok) {
        try {
          const data = await response.json()
          console.log('🔍 [loadReviewsByRating] API Response:', data)
          console.log('🔍 [loadReviewsByRating] Reviews count:', data?.length || 0)
          
          setReviews(data || [])
          setSelectedRating(rating)
          setHasMore(false) // Rating filter doesn't support pagination
        } catch (parseError) {
          console.error('Error parsing reviews by rating response:', parseError)
          setReviews([])
        }
      } else {
        console.error('🔍 [loadReviewsByRating] Response not OK:', response.status, response.statusText)
        const errorText = await response.text()
        console.error('🔍 [loadReviewsByRating] Error response:', errorText)
        setReviews([])
      }
    } catch (err) {
      console.error("Error loading reviews by rating:", err)
    } finally {
      setReviewsLoading(false)
    }
  }

  // Load more reviews (for pagination)
  const loadMoreReviews = async () => {
    if (hasMore && !reviewsLoading) {
      await loadReviews(currentPage + 1, true)
    }
  }

  // Handle review form submission
  const handleReviewSubmit = async () => {
    if (reviewFormData.rating === 0) {
      alert("Please select a rating!")
      return
    }

    if (!reviewFormData.comment.trim()) {
      alert("Please enter a comment!")
      return
    }

    setSubmitLoading(true)
    try {
      const response = await fetch(`http://localhost:8080/apis/reviews/garage/${garageId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          rating: reviewFormData.rating,
          comment: reviewFormData.comment,
          garageId: garageId
        })
      })

      if (response.ok) {
        // Success response - backend returns plain text
        const successMessage = await response.text()
        alert(successMessage || "Your review has been submitted successfully!")
        setShowReviewForm(false)
        setReviewFormData({ rating: 0, comment: '' })
        
        // Reload garage data and reviews
        const garageResponse = await getPublicGarageById(garageId)
        setGarage(garageResponse.data)
        await loadReviews()
        setSelectedRating(0)
      } else {
        // Handle error response safely
        let errorMessage = 'Cannot submit review'
        try {
          const contentType = response.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json()
            errorMessage = errorData.message || errorMessage
          } else {
            // If response is not JSON, try to get text
            const errorText = await response.text()
            errorMessage = errorText || errorMessage
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError)
          // Use default error message if parsing fails
        }
        alert(`Lỗi: ${errorMessage}`)
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert("An error occurred while submitting the review. Please try again!")
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleRatingClick = (rating: number) => {
    setReviewFormData(prev => ({ ...prev, rating }))
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReviewFormData(prev => ({ ...prev, comment: e.target.value }))
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-5 h-5 fill-yellow-400 text-yellow-400" />)
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />)
    }

    return stars
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return { label: "Active", className: "bg-green-100 text-green-700 border-green-200" }
      case "PENDING":
        return { label: "Pending Approval", className: "bg-yellow-100 text-yellow-700 border-yellow-200" }
      case "INACTIVE":
        return { label: "Temporarily Closed", className: "bg-red-100 text-red-700 border-red-200" }
      default:
        return { label: "Unknown", className: "bg-gray-100 text-gray-700 border-gray-200" }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <p className="text-lg text-slate-600">Loading garage information...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !garage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4" />
            <AlertDescription className="text-red-700">
              {error || "Garage not found"}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const statusConfig = getStatusConfig(garage.status)
  const shouldShowPlaceholder = !garage.imageUrl || isPlaceholderImage(garage.imageUrl)

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 hover:bg-white hover:shadow-md transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image & Info */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="relative">
                {/* Main Image */}
                <div className="relative h-64 md:h-80 bg-gradient-to-br from-blue-500 to-blue-600">
                  {shouldShowPlaceholder ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-white">
                        <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium opacity-75">Garage Image</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                      <img
                        src={getFullImageUrl(garage.imageUrl)}
                        alt={garage.name}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${
                          imageLoading ? 'opacity-0' : 'opacity-100'
                        }`}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                      />
                    </>
                  )}
                  
                  {/* Overlay Info */}
                  <div className="absolute top-4 right-4 flex flex-col space-y-2">
                    <Badge className={`px-3 py-1 text-sm font-medium border ${statusConfig.className}`}>
                      {statusConfig.label}
                    </Badge>
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-lg font-bold text-gray-900">
                          {garage.averageRating.toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-600">
                          ({garage.totalReviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Title Section */}
                <CardContent className="p-6 bg-white">
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{garage.name}</h1>
                      <div className="flex items-center gap-3">
                        {renderStars(garage.averageRating)}
                        <span className="text-gray-600">
                          {garage.averageRating.toFixed(1)} stars • {garage.totalReviews} reviews
                        </span>
                      </div>
                    </div>

                    {garage.description && (
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {garage.description}
                      </p>
                    )}
                  </div>
                </CardContent>
              </div>
            </Card>

            {/* Services */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <Wrench className="h-6 w-6 text-orange-600" />
                  <span>Services</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {garage.serviceNames.map((service, index) => (
                    <div key={index} className="group flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
                      <div className="bg-blue-500 p-2 rounded-full group-hover:scale-110 transition-transform duration-300">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900">{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Types */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <Car className="h-6 w-6 text-green-600" />
                  <span>Vehicle Types Served</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {garage.vehicleTypeNames.map((type, index) => (
                    <div key={index} className="group flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
                      <div className="bg-green-500 p-2 rounded-full group-hover:scale-110 transition-transform duration-300">
                        <Car className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900">{type}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Actions */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <CalendarDays className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="text-xl font-bold text-gray-900">Book Appointment</h3>
                  <p className="text-sm text-gray-600 mt-1">Professional car maintenance</p>
                </div>
                
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-4 mb-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => router.push(`/booking/${garage.id}`)}
                >
                  <CalendarDays className="h-5 w-5 mr-2" />
                  Book Now
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                  onClick={() => window.open(`https://maps.google.com?q=${encodeURIComponent(garage.address)}`)}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <Phone className="h-6 w-6 text-blue-600" />
                  <span>Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Address</p>
                    <p className="text-gray-600">{garage.address}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Phone className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Phone Number</p>
                    <p className="text-gray-600">{garage.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <Mail className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">{garage.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>


            {/* Statistics */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Statistics</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5" />
                      <span className="text-sm">Average Rating</span>
                    </div>
                    <span className="font-bold text-lg">
                      {garage.averageRating.toFixed(1)}/5
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-5 w-5" />
                      <span className="text-sm">Total Reviews</span>
                    </div>
                    <span className="font-bold text-lg">{garage.totalReviews}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-300" />
                      <span className="text-sm">Status</span>
                    </div>
                    <span className="font-bold text-lg">
                      {garage.status === 'ACTIVE' ? 'Active' : 'Closed'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-xl">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-6 w-6 text-purple-600" />
                    <span>Customer Reviews</span>
                  </div>
                  {reviewStats && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-900">
                        {reviewStats.averageRating.toFixed(1)}
                      </span>
                      <span>({reviewStats.totalReviews} reviews)</span>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Rating Statistics */}
                {reviewStats && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">Rating Statistics</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRating(0)
                          setCurrentPage(0)
                          loadReviews(0, false)
                        }}
                        className={selectedRating === 0 ? "bg-blue-50 border-blue-300" : ""}
                      >
                        <Filter className="h-4 w-4 mr-1" />
                        All
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-2">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count = reviewStats.ratingDistribution[rating] || 0
                        const percentage = reviewStats.totalReviews > 0 
                          ? (count / reviewStats.totalReviews) * 100 
                          : 0
                        
                        return (
                          <div key={rating} className="space-y-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => loadReviewsByRating(rating)}
                              className={`w-full h-8 ${
                                selectedRating === rating 
                                  ? "bg-blue-50 border-blue-300 text-blue-700" 
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                              {rating}
                            </Button>
                            <div className="space-y-1">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <p className="text-xs text-center text-gray-600">{count}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Reviews List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">
                      {selectedRating 
                        ? `${selectedRating} Star Reviews` 
                        : "Recent Reviews"
                      }
                    </h4>
                    <div className="flex items-center space-x-2">
                      {reviews.length > 3 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAllReviews(!showAllReviews)}
                        >
                          {showAllReviews ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-1" />
                              Collapse
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-1" />
                              View All ({reviews.length})
                            </>
                          )}
                        </Button>
                      )}
                      <Button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        size="sm"
                        onClick={() => setShowReviewForm(!showReviewForm)}
                      >
                        <Edit3 className="h-4 w-4 mr-1" />
                        {showReviewForm ? 'Cancel' : 'Write Review'}
                      </Button>
                    </div>
                  </div>

                  {/* Review Form */}
                  {showReviewForm && (
                    <Card className="border-indigo-200 bg-indigo-50">
                      <CardContent className="p-4">
                        <h5 className="font-semibold text-gray-900 mb-4">Share Your Experience</h5>
                        
                        {/* Rating Stars */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Rating *
                          </label>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => handleRatingClick(star)}
                                className={`w-8 h-8 rounded-full hover:scale-110 transition-transform duration-200 ${
                                  star <= reviewFormData.rating 
                                    ? 'text-yellow-400' 
                                    : 'text-gray-300 hover:text-yellow-300'
                                }`}
                              >
                                <Star className="w-6 h-6 fill-current" />
                              </button>
                            ))}
                            <span className="ml-2 text-sm text-gray-600">
                              {reviewFormData.rating > 0 && `${reviewFormData.rating} stars`}
                            </span>
                          </div>
                        </div>

                        {/* Comment */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Comment *
                          </label>
                          <Textarea
                            value={reviewFormData.comment}
                            onChange={handleCommentChange}
                            placeholder="Share your experience about this garage..."
                            rows={4}
                            className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {reviewFormData.comment.length}/500 characters
                          </p>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setShowReviewForm(false)
                              setReviewFormData({ rating: 0, comment: '' })
                            }}
                            disabled={submitLoading}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                          <Button
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            size="sm"
                            onClick={handleReviewSubmit}
                            disabled={submitLoading || reviewFormData.rating === 0 || !reviewFormData.comment.trim()}
                          >
                            <Send className="h-4 w-4 mr-1" />
                            {submitLoading ? 'Sending...' : 'Submit Review'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Reviews Loading */}
                  {reviewsLoading && reviews.length === 0 ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3" />
                      <span className="text-gray-600">Loading reviews...</span>
                    </div>
                  ) : (
                    /* Reviews Content */
                    <div className="space-y-4">
                      {reviews.length === 0 ? (
                        <div className="text-center py-8">
                          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600">
                            {selectedRating 
                              ? `No ${selectedRating} star reviews yet` 
                              : 'No reviews yet. Be the first to review!'}
                          </p>
                        </div>
                      ) : (
                        <>
                          {/* Scrollable Reviews Container */}
                          <div 
                            className="max-h-96 overflow-y-auto space-y-4 pr-2"
                            style={{ scrollbarWidth: 'thin' }}
                          >
                            {reviews.map((review, index) => (
                          <Card key={index} className="border-gray-200">
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                  {review.userName ? review.userName.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <div>
                                      <h6 className="font-semibold text-gray-900">
                                        {review.userName || 'Anonymous User'}
                                      </h6>
                                      <div className="flex items-center space-x-2">
                                        <div className="flex items-center">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                              key={star}
                                              className={`w-4 h-4 ${
                                                star <= review.rating
                                                  ? 'fill-yellow-400 text-yellow-400'
                                                  : 'text-gray-300'
                                              }`}
                                            />
                                          ))}
                                        </div>
                                        <span className="text-sm text-gray-500">
                                          {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <p className="text-gray-700 text-sm leading-relaxed">
                                    {review.comment}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                            ))}
                          </div>

                          {/* Pagination Controls */}
                          {selectedRating === 0 && totalPages > 1 && (
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                              <div className="text-sm text-gray-600">
                                Showing {reviews.length} / {totalElements} reviews
                              </div>
                              <div className="flex items-center space-x-2">
                                {/* Page Info */}
                                <span className="text-sm text-gray-600">
                                  Page {currentPage + 1} / {totalPages}
                                </span>
                                
                                {/* Load More Button */}
                                {hasMore && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={loadMoreReviews}
                                    disabled={reviewsLoading}
                                    className="ml-4"
                                  >
                                    {reviewsLoading ? (
                                      <>
                                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                                        Loading...
                                      </>
                                    ) : (
                                      'Load More'
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Loading indicator for load more */}
                          {reviewsLoading && reviews.length > 0 && (
                            <div className="flex items-center justify-center py-4">
                              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                              <span className="text-sm text-gray-600">Loading more...</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}