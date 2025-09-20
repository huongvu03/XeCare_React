"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Calendar, MapPin, Wrench, Clock, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getUserAppointments, type Appointment } from "@/lib/api/AppointmentApi"
import { getSystemServices, type SystemService } from "@/lib/api/GarageServiceApi"

interface VehicleServiceHistoryProps {
  vehicleId?: number
  vehicle?: {
    id: number
    licensePlate: string
    vehicleName: string
    brand: string
    model: string
  }
  limit?: number
}

export function VehicleServiceHistory({ vehicleId, vehicle, limit = 5 }: VehicleServiceHistoryProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [services, setServices] = useState<SystemService[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Load appointments
        const appointmentsResponse = await getUserAppointments({
          page: 0,
          size: 20, // Load more to filter by vehicle if needed
          status: "COMPLETED" // Only show completed appointments
        })
        
        // Load system services for descriptions
        const servicesResponse = await getSystemServices()
        
        setServices(servicesResponse.data)
        
        // Filter appointments by vehicle if vehicle information is provided
        let filteredAppointments = appointmentsResponse.data.content
        
        if (vehicle) {
          // Filter by exact license plate match (most reliable)
          filteredAppointments = appointmentsResponse.data.content.filter(appointment => {
            if (appointment.licensePlate && vehicle.licensePlate) {
              // Exact license plate match
              return appointment.licensePlate.toLowerCase().trim() === vehicle.licensePlate.toLowerCase().trim()
            }
            
            // Fallback: match by brand, model and vehicle type if license plate not available
            if (appointment.vehicleBrand && appointment.vehicleModel && vehicle.brand && vehicle.model) {
              return appointment.vehicleBrand.toLowerCase().trim() === vehicle.brand.toLowerCase().trim() &&
                     appointment.vehicleModel.toLowerCase().trim() === vehicle.model.toLowerCase().trim() &&
                     appointment.vehicleTypeId === vehicle.id
            }
            
            return false
          })
        } else if (vehicleId) {
          // Fallback for backward compatibility - filter by vehicle type ID
          filteredAppointments = appointmentsResponse.data.content.filter(appointment => {
            return appointment.vehicleTypeId === vehicleId
          })
        }
        
        // Sort by date (most recent first) and limit
        filteredAppointments = filteredAppointments
          .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())
          .slice(0, limit)
        
        setAppointments(filteredAppointments)
      } catch (error) {
        console.error("Error loading vehicle service history:", error)
        toast({
          title: "Lỗi",
          description: "Không thể tải lịch sử sửa xe",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [vehicleId, vehicle, limit, toast])

  const getServiceDescription = (serviceName: string) => {
    // Try exact match first
    let service = services.find(s => s.name.toLowerCase() === serviceName.toLowerCase())
    
    // If no exact match, try partial match
    if (!service) {
      service = services.find(s => 
        s.name.toLowerCase().includes(serviceName.toLowerCase()) || 
        serviceName.toLowerCase().includes(s.name.toLowerCase())
      )
    }
    
    return service?.description || "Dịch vụ sửa chữa và bảo dưỡng xe"
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-green-100 text-green-700">Hoàn thành</Badge>
      case "IN_PROGRESS":
        return <Badge className="bg-orange-100 text-orange-700">Đang thực hiện</Badge>
      case "CONFIRMED":
        return <Badge className="bg-blue-100 text-blue-700">Đã xác nhận</Badge>
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-700">Chờ xác nhận</Badge>
      case "CANCELLED":
        return <Badge className="bg-gray-100 text-gray-700">Đã hủy</Badge>
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-700">Đã từ chối</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700">Không xác định</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString?: string) => {
    if (!timeString) return ""
    return timeString
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
        <span className="text-slate-600">Đang tải lịch sử sửa xe...</span>
      </div>
    )
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-8">
        <Wrench className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          {vehicle ? `Chưa có lịch sử sửa xe cho ${vehicle.vehicleName}` : "Chưa có lịch sử sửa xe"}
        </h3>
        <p className="text-slate-500 text-sm">
          {vehicle 
            ? `Xe ${vehicle.vehicleName} (${vehicle.licensePlate}) chưa có lịch sử sửa chữa nào được hoàn thành.`
            : "Bạn chưa có lịch sử sửa xe nào được hoàn thành."
          }
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          {vehicle ? `Lịch sử sửa xe - ${vehicle.vehicleName}` : "Lịch sử sửa xe gần nhất"}
        </h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.location.href = '/user/appointments'}
        >
          Xem tất cả
        </Button>
      </div>
      
      <div className="space-y-3">
        {appointments.map((appointment) => (
          <Card key={appointment.id} className="border-slate-200 hover:border-blue-300 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 mb-1">
                    {appointment.serviceName}
                  </h4>
                  <p className="text-sm text-slate-600 mb-2">
                    {getServiceDescription(appointment.serviceName)}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  {getStatusBadge(appointment.status)}
                  {appointment.finalPrice && (
                    <div className="flex items-center text-sm text-green-600">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {appointment.finalPrice.toLocaleString('vi-VN')} VNĐ
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center text-slate-600">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                  <span>{formatDate(appointment.appointmentDate)}</span>
                  {appointment.appointmentTime && (
                    <span className="ml-2">{formatTime(appointment.appointmentTime)}</span>
                  )}
                </div>
                
                <div className="flex items-center text-slate-600">
                  <MapPin className="h-4 w-4 mr-2 text-green-500" />
                  <span className="truncate">{appointment.garageName}</span>
                </div>
                
                {appointment.vehicleBrand && appointment.vehicleModel && (
                  <div className="flex items-center text-slate-600">
                    <Wrench className="h-4 w-4 mr-2 text-orange-500" />
                    <span>{appointment.vehicleBrand} {appointment.vehicleModel}</span>
                    {appointment.licensePlate && (
                      <span className="ml-2 font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                        {appointment.licensePlate}
                      </span>
                    )}
                  </div>
                )}
                
                {appointment.estimatedPrice && !appointment.finalPrice && (
                  <div className="flex items-center text-slate-600">
                    <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                    <span>Dự kiến: {appointment.estimatedPrice.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                )}
              </div>
              
              {appointment.description && (
                <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-700">
                    <strong>Mô tả:</strong> {appointment.description}
                  </p>
                </div>
              )}
              
              {appointment.notes && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Ghi chú:</strong> {appointment.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
