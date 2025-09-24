"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle, 
  AlertTriangle,
  Car,
  MessageSquare,
  Timer
} from "lucide-react"
import { EmergencyRequest } from "@/lib/api/EmergencyApi"

interface EmergencyStatusTrackerProps {
  request: EmergencyRequest
  onRefresh?: () => void
}

export function EmergencyStatusTracker({ request, onRefresh }: EmergencyStatusTrackerProps) {
  const [timeElapsed, setTimeElapsed] = useState("")

  useEffect(() => {
    const updateTimeElapsed = () => {
      const now = new Date()
      const created = new Date(request.createdAt)
      const diff = now.getTime() - created.getTime()
      
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      
      if (hours > 0) {
        setTimeElapsed(`${hours}h ${minutes}m ago`)
      } else {
        setTimeElapsed(`${minutes}m ago`)
      }
    }

    updateTimeElapsed()
    const interval = setInterval(updateTimeElapsed, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [request.createdAt])

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING':
        return {
          color: 'yellow',
          progress: 25,
          icon: <Clock className="h-4 w-4" />,
          title: 'Waiting for Processing',
          description: 'Request is being sent to nearby garages'
        }
      case 'QUOTED':
        return {
          color: 'blue',
          progress: 50,
          icon: <MessageSquare className="h-4 w-4" />,
          title: 'Quote Received',
          description: 'Garage has sent a quote, please review'
        }
      case 'ACCEPTED':
        return {
          color: 'green',
          progress: 75,
          icon: <Car className="h-4 w-4" />,
          title: 'On Route',
          description: 'Garage is on the way to your location'
        }
      case 'COMPLETED':
        return {
          color: 'emerald',
          progress: 100,
          icon: <CheckCircle className="h-4 w-4" />,
          title: 'Completed',
          description: 'Emergency rescue service has been completed successfully'
        }
      case 'CANCELLED':
        return {
          color: 'red',
          progress: 0,
          icon: <AlertTriangle className="h-4 w-4" />,
          title: 'Cancelled',
          description: 'Emergency request has been cancelled'
        }
      default:
        return {
          color: 'gray',
          progress: 0,
          icon: <Clock className="h-4 w-4" />,
          title: 'Unknown',
          description: ''
        }
    }
  }

  const statusInfo = getStatusInfo(request.status)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    const hour = date.getHours().toString().padStart(2, '0')
    const minute = date.getMinutes().toString().padStart(2, '0')
    
    // Remove leading zero from hour if it's 00
    const formattedHour = hour === '00' ? '0' : hour
    
    return `${formattedHour}:${minute} ${day}/${month}/${year}`
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">
            Track Request #{request.id}
          </CardTitle>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Timer className="h-4 w-4" />
            <span>{timeElapsed}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-full bg-${statusInfo.color}-100`}>
                <div className={`text-${statusInfo.color}-600`}>
                  {statusInfo.icon}
                </div>
              </div>
              <div>
                <h3 className="font-semibold">{statusInfo.title}</h3>
                <p className="text-sm text-gray-600">{statusInfo.description}</p>
              </div>
            </div>
            <Badge 
              variant={statusInfo.color === 'green' || statusInfo.color === 'emerald' ? 'default' : 'secondary'}
              className={`bg-${statusInfo.color}-100 text-${statusInfo.color}-800 border-${statusInfo.color}-200`}
            >
              {request.status}
            </Badge>
          </div>
          
          <Progress 
            value={statusInfo.progress} 
            className="h-2"
          />
          <p className="text-xs text-gray-500 text-center">
            {statusInfo.progress}% completed
          </p>
        </div>

        {/* Request Details */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Location</p>
                <p className="text-sm text-gray-600">
                  {request.latitude.toFixed(6)}, {request.longitude.toFixed(6)}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Created Time</p>
                <p className="text-sm text-gray-600">{formatDate(request.createdAt)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {request.garage && (
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <Car className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Assigned Garage</p>
                  <p className="text-sm text-gray-900 font-medium">{request.garage.name}</p>
                  <p className="text-sm text-gray-600">{request.garage.phone}</p>
                </div>
              </div>
            )}

            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <MessageSquare className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Incident Description</p>
                <p className="text-sm text-gray-600">{request.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          {request.garage && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`tel:${request.garage?.phone}`)}
              className="flex-1"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Garage
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="flex-1"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Refresh
          </Button>

        </div>

        {/* Images if available */}
        {request.images && request.images.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Incident Images</h4>
            <div className="flex gap-2 overflow-x-auto">
              {request.images.map((image, index) => (
                <img
                  key={image.id}
                  src={`http://localhost:8080${image.imageUrl}`}
                  alt={`Emergency image ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.jpg'
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
