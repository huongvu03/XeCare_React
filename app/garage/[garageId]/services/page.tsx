"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Plus, 
  Edit, 
  Settings, 
  Wrench, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle,
  Loader2,
  ArrowLeft
} from "lucide-react"
import { 
  getGarageServices, 
  createGarageService, 
  updateGarageService, 
  toggleGarageServiceStatus,
  getGarageServiceStats,
  getSystemServices,
  createCustomService,
  searchServices,
  debugUser,
  debugGarage,
  testAuth,
  simpleTest,
  testJson,
  type GarageService,
  type GarageServiceRequest,
  type GarageServiceStats,
  type SystemService,
  type CreateCustomServiceRequest
} from "@/lib/api/GarageServiceApi"
import { toast } from "sonner"

export default function GarageServicesPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const garageId = Number(params.garageId)
  
  const [services, setServices] = useState<GarageService[]>([])
  const [systemServices, setSystemServices] = useState<SystemService[]>([])
  const [stats, setStats] = useState<GarageServiceStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  // Form states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<GarageService | null>(null)
  const [formData, setFormData] = useState<GarageServiceRequest>({
    serviceId: 0,
    price: 0,
    estimatedTimeMinutes: undefined,
    isActive: true
  })
  const [submitting, setSubmitting] = useState(false)
  
  // Custom service form states
  const [isCustomServiceMode, setIsCustomServiceMode] = useState(false)
  const [customServiceData, setCustomServiceData] = useState<CreateCustomServiceRequest>({
    name: "",
    description: "",
    basePrice: 0,
    estimatedTimeMinutes: 0,
    isActive: true
  })
  const [customServiceErrors, setCustomServiceErrors] = useState<{[key: string]: string}>({})
  
  // Loading states for individual actions
  const [togglingServices, setTogglingServices] = useState<Set<number>>(new Set())

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true)
      setError("")
      
      console.log("Fetching data for garage:", garageId)
      
      // Kiểm tra token trước khi gọi API
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.")
        return
      }
      
      const [servicesResponse, statsResponse, systemServicesResponse] = await Promise.all([
        getGarageServices(garageId),
        getGarageServiceStats(garageId),
        getSystemServices()
      ])
      
      console.log("Services response:", servicesResponse)
      console.log("Stats response:", statsResponse)
      console.log("System services response:", systemServicesResponse)
      
      setServices(servicesResponse.data)
      setStats(statsResponse.data)
      setSystemServices(systemServicesResponse.data)
    } catch (err: any) {
      console.error("Error fetching data:", err)
      console.error("Error response:", err.response)
      console.error("Error message:", err.message)
      
             // Kiểm tra nếu lỗi 401 hoặc 403, có thể do token hết hạn
       if (err.response?.status === 401 || err.response?.status === 403) {
         setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.")
         // Có thể redirect về trang login
         // router.push("/login")
       } else {
         setError(`Không thể tải thông tin dịch vụ: ${err.response?.data?.message || err.message || "Lỗi không xác định"}`)
       }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log("useEffect triggered - garageId:", garageId, "user:", user)
    console.log("localStorage token:", localStorage.getItem("token"))
    
    if (garageId && user) {
      // Kiểm tra xem user có phải là owner của garage này không
      const isOwner = user.garages && user.garages.some(g => g.id === garageId)
      console.log("isOwner:", isOwner, "user.role:", user.role)
      console.log("user.garages:", user.garages)
      
      // Tạm thời bỏ qua check owner để test
      // if (!isOwner && user.role !== "ADMIN") {
      //   setError("Bạn không có quyền quản lý garage này")
      //   setLoading(false)
      //   return
      // }
      fetchData()
    }
  }, [garageId, user])

  // Validate system service data
  const validateSystemService = (data: GarageServiceRequest) => {
    const errors: {[key: string]: string} = {}
    
    if (!data.serviceId) {
      errors.serviceId = "Vui lòng chọn dịch vụ"
    }
    
    if (data.price !== undefined && data.price <= 0) {
      errors.price = "Giá phải lớn hơn 0"
    } else if (data.price !== undefined && data.price > 1000000000) {
      errors.price = "Giá không được quá 1 tỷ VNĐ"
    }
    
    if (data.estimatedTimeMinutes !== undefined && data.estimatedTimeMinutes <= 0) {
      errors.estimatedTimeMinutes = "Thời gian ước tính phải lớn hơn 0"
    } else if (data.estimatedTimeMinutes !== undefined && data.estimatedTimeMinutes > 1440) {
      errors.estimatedTimeMinutes = "Thời gian không được quá 24 giờ (1440 phút)"
    }
    
    return errors
  }

  // Handle form submission
  const handleSubmit = async (isEdit: boolean = false) => {
    let originalService: GarageService | undefined = undefined
    
    try {
      setSubmitting(true)
      
      // Validate system service data
      if (!isCustomServiceMode) {
        const errors = validateSystemService(formData)
        if (Object.keys(errors).length > 0) {
          setCustomServiceErrors(errors)
          toast.error("Vui lòng kiểm tra lại thông tin")
          return
        }
      }
      
      if (isEdit && editingService) {
        // Store original service for rollback
        originalService = services.find(s => s.id === editingService.id)
        
        // Optimistic update for edit
        if (originalService) {
          setServices(prevServices => 
            prevServices.map(service => 
              service.id === editingService.id 
                ? { 
                    ...service, 
                    price: formData.price || 0,
                    estimatedTimeMinutes: formData.estimatedTimeMinutes || null,
                    isActive: formData.isActive ?? true
                  }
                : service
            )
          )
        }
        
        await updateGarageService(editingService.id, formData)
        toast.success("Cập nhật dịch vụ thành công!")
        
        // Reset form and close dialog
        setFormData({
          serviceId: 0,
          price: 0,
          estimatedTimeMinutes: undefined,
          isActive: true
        })
        setEditingService(null)
        setIsEditDialogOpen(false)
        setCustomServiceErrors({})
      } else {
        await createGarageService(formData)
        toast.success("Thêm dịch vụ thành công! Dịch vụ đã được kích hoạt và sẵn sàng sử dụng.")
        
        // Reset form and close dialog
        setFormData({
          serviceId: 0,
          price: 0,
          estimatedTimeMinutes: undefined,
          isActive: true
        })
        setIsAddDialogOpen(false)
        setCustomServiceErrors({})
        
        // Refresh data for new service
        fetchData()
      }
    } catch (err: any) {
      console.error("Error submitting form:", err)
      
      // Rollback optimistic update for edit
      if (isEdit && editingService && originalService) {
        setServices(prevServices => 
          prevServices.map(service => 
            service.id === editingService.id 
              ? originalService!
              : service
          )
        )
      }
      
      toast.error(err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.")
    } finally {
      setSubmitting(false)
    }
  }

  // Validate custom service data
  const validateCustomService = (data: CreateCustomServiceRequest) => {
    const errors: {[key: string]: string} = {}
    
    if (!data.name || data.name.trim().length < 3) {
      errors.name = "Tên dịch vụ phải có ít nhất 3 ký tự"
    }
    
    if (data.name && data.name.length > 100) {
      errors.name = "Tên dịch vụ không được quá 100 ký tự"
    }
    
    if (data.description && data.description.length > 500) {
      errors.description = "Mô tả không được quá 500 ký tự"
    }
    
    if (!data.basePrice || data.basePrice <= 0) {
      errors.basePrice = "Giá phải lớn hơn 0"
    } else if (data.basePrice > 1000000000) {
      errors.basePrice = "Giá không được quá 1 tỷ VNĐ"
    }
    
    if (!data.estimatedTimeMinutes || data.estimatedTimeMinutes <= 0) {
      errors.estimatedTimeMinutes = "Thời gian ước tính phải lớn hơn 0"
    } else if (data.estimatedTimeMinutes > 1440) {
      errors.estimatedTimeMinutes = "Thời gian không được quá 24 giờ (1440 phút)"
    }
    
    // Kiểm tra từ cấm trong tên
    const forbiddenNameErrors = checkForbiddenWords(data.name, 'name')
    if (forbiddenNameErrors.name) {
      errors.name = forbiddenNameErrors.name
    }
    
    // Kiểm tra từ cấm trong mô tả
    if (data.description) {
      const forbiddenDescErrors = checkForbiddenWords(data.description, 'description')
      if (forbiddenDescErrors.description) {
        errors.description = forbiddenDescErrors.description
      }
    }
    
    // Kiểm tra trùng tên
    const duplicateErrors = checkDuplicateServiceName(data.name)
    if (duplicateErrors.name) {
      errors.name = duplicateErrors.name
    }
    
    return errors
  }

  // Handle custom service submission
  const handleCustomServiceSubmit = async () => {
    try {
      setSubmitting(true)
      
      // Validate
      const errors = validateCustomService(customServiceData)
      if (Object.keys(errors).length > 0) {
        setCustomServiceErrors(errors)
        toast.error("Vui lòng kiểm tra lại thông tin")
        return
      }
      
      await createCustomService(garageId, customServiceData)
              toast.success("Tạo dịch vụ tùy chỉnh thành công! Dịch vụ đã được kích hoạt và sẵn sàng sử dụng.")
      
      // Reset form
      setCustomServiceData({
        name: "",
        description: "",
        basePrice: 0,
        estimatedTimeMinutes: 0,
        isActive: true
      })
      setCustomServiceErrors({})
      setIsCustomServiceMode(false)
      setIsAddDialogOpen(false)
      
      // Refresh data
      fetchData()
    } catch (err: any) {
      console.error("Error creating custom service:", err)
      
      // Xử lý các loại lỗi khác nhau
      if (err.response?.status === 400) {
        // Lỗi validation từ backend
        if (err.response?.data?.message) {
          toast.error(err.response.data.message)
        } else {
          toast.error("Thông tin dịch vụ không hợp lệ. Vui lòng kiểm tra lại.")
        }
      } else if (err.response?.status === 403) {
        toast.error("Bạn không có quyền tạo dịch vụ cho garage này")
      } else if (err.response?.status === 404) {
        toast.error("Garage không tồn tại")
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  // Handle toggle service status with optimistic update
  const handleToggleStatus = async (serviceId: number) => {
    // Find the service to toggle
    const serviceToToggle = services.find(s => s.id === serviceId)
    if (!serviceToToggle) return
    
    // Set loading state for this specific service
    setTogglingServices(prev => new Set(prev).add(serviceId))
    
    // Store original state for rollback
    const originalIsActive = serviceToToggle.isActive
    
    // Optimistic update - update UI immediately
    setServices(prevServices => 
      prevServices.map(service => 
        service.id === serviceId 
          ? { ...service, isActive: !service.isActive }
          : service
      )
    )
    
    // Update stats optimistically
    if (stats) {
      setStats(prevStats => {
        if (!prevStats) return prevStats
        return {
          ...prevStats,
          activeServices: originalIsActive 
            ? prevStats.activeServices - 1 
            : prevStats.activeServices + 1,
          inactiveServices: originalIsActive 
            ? prevStats.inactiveServices + 1 
            : prevStats.inactiveServices - 1
        }
      })
    }
    
    try {
      // Call API in background
      await toggleGarageServiceStatus(serviceId)
      toast.success("Cập nhật trạng thái thành công!")
    } catch (err: any) {
      console.error("Error toggling status:", err)
      
      // Rollback optimistic update on error
      setServices(prevServices => 
        prevServices.map(service => 
          service.id === serviceId 
            ? { ...service, isActive: originalIsActive }
            : service
        )
      )
      
      // Rollback stats
      if (stats) {
        setStats(prevStats => {
          if (!prevStats) return prevStats
          return {
            ...prevStats,
            activeServices: originalIsActive 
              ? prevStats.activeServices + 1 
              : prevStats.activeServices - 1,
            inactiveServices: originalIsActive 
              ? prevStats.inactiveServices - 1 
              : prevStats.inactiveServices + 1
          }
        })
      }
      
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái.")
    } finally {
      // Clear loading state
      setTogglingServices(prev => {
        const newSet = new Set(prev)
        newSet.delete(serviceId)
        return newSet
      })
    }
  }

  // Handle edit service
  const handleEdit = (service: GarageService) => {
    setEditingService(service)
    setFormData({
      serviceId: service.serviceId,
      price: service.price,
      estimatedTimeMinutes: service.estimatedTimeMinutes || undefined,
      isActive: service.isActive
    })
    setIsEditDialogOpen(true)
  }

  // Get available services (not already added)
  const getAvailableServices = () => {
    if (!services || !Array.isArray(services)) {
      return systemServices || []
    }
    const addedServiceIds = services.map(s => s.serviceId)
    return systemServices.filter(s => !addedServiceIds.includes(s.id))
  }

  // Helper function to check for duplicate service names
  const checkDuplicateServiceName = (name: string) => {
    const errors: {[key: string]: string} = {}
    
    if (!name || name.trim().length < 3) {
      return errors
    }
    
    const lowerName = name.toLowerCase().trim()
    
    // Kiểm tra trùng tên với các dịch vụ đã có trong garage
    if (services) {
      const existingService = services.find(service => 
        service.serviceName.toLowerCase() === lowerName
      )
      if (existingService) {
        errors.name = `Tên dịch vụ "${name}" đã tồn tại trong garage này`
        return errors
      }
    }
    
    // Kiểm tra trùng tên với system services
    if (systemServices) {
      const existingSystemService = systemServices.find(service => 
        service.name.toLowerCase() === lowerName
      )
      if (existingSystemService) {
        errors.name = `Tên dịch vụ "${name}" đã tồn tại trong hệ thống`
        return errors
      }
    }
    
    return errors
  }

  // Helper function to check for forbidden words
  const checkForbiddenWords = (text: string, field: 'name' | 'description' = 'name') => {
    const errors: {[key: string]: string} = {}
    
    if (!text || text.trim().length === 0) {
      return errors
    }
    
    // Kiểm tra từ cấm
    const forbiddenWords = [
      'fuck', 'shit', 'bitch', 'ass', 'dick', 'pussy', 'cock', 'cunt', 'whore', 'slut',
      'sex', 'porn', 'xxx', 'adult', '18+', 'nude', 'naked', 'penis', 'vagina',
      'đụ', 'địt', 'lồn', 'cặc', 'đcm', 'đm', 'đéo', 'đít', 'địt', 'đụ', 'đcm'
    ]
    
    const lowerText = text.toLowerCase()
    const foundForbiddenWords = forbiddenWords.filter(word => 
      lowerText.includes(word.toLowerCase())
    )
    
    console.log(`Checking forbidden words for ${field}:`, text, 'Found:', foundForbiddenWords)
    
    if (foundForbiddenWords.length > 0) {
      const fieldName = field === 'name' ? 'Tên dịch vụ' : 'Mô tả dịch vụ'
      errors[field] = `${fieldName} không được chứa từ cấm: ${foundForbiddenWords.join(', ')}`
    }
    
    return errors
  }

  // Debug function
  const handleDebug = async () => {
    try {
      const response = await debugUser()
      console.log("Debug response:", response.data)
      alert("Debug info: " + JSON.stringify(response.data, null, 2))
    } catch (err: any) {
      console.error("Debug error:", err)
      alert("Debug error: " + err.message)
    }
  }

  // Debug garage function
  const handleDebugGarage = async () => {
    try {
      const response = await debugGarage(garageId)
      console.log("Debug garage response:", response.data)
      alert("Debug garage info: " + JSON.stringify(response.data, null, 2))
    } catch (err: any) {
      console.error("Debug garage error:", err)
      alert("Debug garage error: " + err.message)
    }
  }

  // Test auth function
  const handleTestAuth = async () => {
    try {
      const response = await testAuth()
      console.log("Test auth response:", response.data)
      alert("Test auth info: " + JSON.stringify(response.data, null, 2))
    } catch (err: any) {
      console.error("Test auth error:", err)
      alert("Test auth error: " + err.message)
    }
  }

  // Simple test function
  const handleSimpleTest = async () => {
    try {
      const response = await simpleTest()
      console.log("Simple test response:", response.data)
      alert("Simple test: " + response.data)
    } catch (err: any) {
      console.error("Simple test error:", err)
      alert("Simple test error: " + err.message)
    }
  }

  // Test JSON function
  const handleTestJson = async () => {
    try {
      const response = await testJson()
      console.log("Test JSON response:", response.data)
      alert("Test JSON: " + JSON.stringify(response.data, null, 2))
    } catch (err: any) {
      console.error("Test JSON error:", err)
      alert("Test JSON error: " + err.message)
    }
  }

  // Loading state for user authentication
  if (!user) {
    return (
      <DashboardLayout 
        allowedRoles={["GARAGE"]}
        title="Quản lý dịch vụ"
        description="Đang xác thực..."
      >
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Đang xác thực người dùng...</span>
        </div>
      </DashboardLayout>
    )
  }

  if (loading) {
    return (
      <DashboardLayout 
        allowedRoles={["GARAGE"]}
        title="Quản lý dịch vụ"
        description="Đang tải..."
      >
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Đang tải...</span>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout 
        allowedRoles={["GARAGE"]}
        title="Quản lý dịch vụ"
        description="Có lỗi xảy ra"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">{error}</p>
                         <Button onClick={fetchData} className="mt-4">Thử lại</Button>
             <Button onClick={handleDebug} className="mt-2 ml-2" variant="outline">Debug User</Button>
             <Button onClick={handleDebugGarage} className="mt-2 ml-2" variant="outline">Debug Garage</Button>
             <Button onClick={handleTestAuth} className="mt-2 ml-2" variant="outline">Test Auth</Button>
             <Button onClick={handleSimpleTest} className="mt-2 ml-2" variant="outline">Simple Test</Button>
             <Button onClick={handleTestJson} className="mt-2 ml-2" variant="outline">Test JSON</Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout 
      allowedRoles={["GARAGE"]}
      title="Quản lý dịch vụ"
      description="Quản lý các dịch vụ của garage"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Quay lại</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Quản lý dịch vụ</h1>
              <p className="text-gray-600">Quản lý các dịch vụ của garage</p>
            </div>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            if (open) {
              // Reset form when opening dialog
              setFormData({
                //garageId: garageId,
                serviceId: 0,
                price: 0,
                //basePrice: undefined,
                estimatedTimeMinutes: undefined,
                isActive: true
              })
              setCustomServiceData({
                name: "",
                description: "",
                basePrice: 0,
                estimatedTimeMinutes: 0,
                isActive: true
              })
              setCustomServiceErrors({})
              setIsCustomServiceMode(false)
            }
            setIsAddDialogOpen(open)
          }}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Thêm dịch vụ</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Thêm dịch vụ mới</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Service Type Selection */}
                <div>
                  <Label>Loại dịch vụ</Label>
                  <div className="flex space-x-4 mt-2">
                    <Button
                      type="button"
                      variant={!isCustomServiceMode ? "default" : "outline"}
                      onClick={() => {
                        setIsCustomServiceMode(false)
                        setCustomServiceErrors({})
                      }}
                    >
                      Chọn từ danh sách
                    </Button>
                    <Button
                      type="button"
                      variant={isCustomServiceMode ? "default" : "outline"}
                      onClick={() => {
                        setIsCustomServiceMode(true)
                        setCustomServiceErrors({})
                      }}
                    >
                      Tạo tùy chỉnh
                    </Button>
                  </div>
                </div>

                {!isCustomServiceMode ? (
                  // System service selection
                  <div>
                    <Label htmlFor="service">Dịch vụ</Label>
                    <Select 
                      value={formData.serviceId.toString()} 
                      onValueChange={(value) => setFormData({...formData, serviceId: Number(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn dịch vụ" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableServices().map((service) => (
                          <SelectItem key={service.id} value={service.id.toString()}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  // Custom service form
                  <>
                    <div>
                      <Label htmlFor="customName">Tên dịch vụ *</Label>
                      <Input
                        id="customName"
                        placeholder="Nhập tên dịch vụ"
                        value={customServiceData.name}
                        onChange={(e) => {
                          const newName = e.target.value
                          setCustomServiceData({...customServiceData, name: newName})
                          
                          // Clear error if exists and re-validate
                          if (customServiceErrors.name) {
                            setCustomServiceErrors({...customServiceErrors, name: ""})
                          }
                          
                          // Real-time validation for duplicate names and forbidden words
                          if (newName && newName.trim().length >= 3) {
                            // Kiểm tra từ cấm trước
                            const forbiddenErrors = checkForbiddenWords(newName, 'name')
                            if (forbiddenErrors.name) {
                              setCustomServiceErrors({...customServiceErrors, ...forbiddenErrors})
                              return
                            }
                            
                            // Kiểm tra trùng tên
                            const duplicateErrors = checkDuplicateServiceName(newName)
                            if (duplicateErrors.name) {
                              setCustomServiceErrors({...customServiceErrors, ...duplicateErrors})
                            }
                          }
                        }}
                      />
                      {customServiceErrors.name && (
                        <p className="text-sm text-red-600 mt-1">{customServiceErrors.name}</p>
                      )}
                      {!customServiceErrors.name && customServiceData.name && customServiceData.name.trim().length >= 3 && (
                        <p className="text-sm text-green-600 mt-1">✓ Tên dịch vụ hợp lệ</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="customDescription">Mô tả (tùy chọn)</Label>
                      <Textarea
                        id="customDescription"
                        placeholder="Nhập mô tả dịch vụ"
                        value={customServiceData.description}
                        onChange={(e) => {
                          const newDescription = e.target.value
                          setCustomServiceData({...customServiceData, description: newDescription})
                          
                          // Clear error if exists and re-validate
                          if (customServiceErrors.description) {
                            setCustomServiceErrors({...customServiceErrors, description: ""})
                          }
                          
                          // Real-time validation for description
                          if (newDescription && newDescription.trim().length > 0) {
                            const errors: {[key: string]: string} = {}
                            
                            // Kiểm tra độ dài mô tả
                            if (newDescription.length > 500) {
                              errors.description = "Mô tả không được quá 500 ký tự"
                            }
                            
                            // Kiểm tra từ cấm
                            const forbiddenErrors = checkForbiddenWords(newDescription, 'description')
                            if (forbiddenErrors.description) {
                              errors.description = forbiddenErrors.description
                            }
                            
                            if (Object.keys(errors).length > 0) {
                              setCustomServiceErrors({...customServiceErrors, ...errors})
                            }
                          }
                        }}
                                              />
                        {customServiceErrors.description && (
                          <p className="text-sm text-red-600 mt-1">{customServiceErrors.description}</p>
                        )}
                        {!customServiceErrors.description && customServiceData.description && customServiceData.description.trim().length > 0 && customServiceData.description.length <= 500 && (
                          <p className="text-sm text-green-600 mt-1">✓ Mô tả hợp lệ</p>
                        )}
                    </div>
                  </>
                )}
                
                <div>
                  <Label htmlFor="price">Giá cơ bản (VNĐ)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Nhập giá"
                    value={!isCustomServiceMode ? (formData.price || "") : (customServiceData.basePrice || "")}
                    onChange={(e) => {
                      if (!isCustomServiceMode) {
                        const value = e.target.value ? Number(e.target.value) : 0
                        setFormData({...formData, price: value})
                        
                        // Real-time validation for price in system service mode
                        if (e.target.value !== "") {
                          const numValue = Number(e.target.value)
                          const errors: {[key: string]: string} = {}
                          
                          if (isNaN(numValue)) {
                            errors.price = "Giá phải là số hợp lệ"
                          } else if (numValue <= 0) {
                            errors.price = "Giá phải lớn hơn 0"
                          } else if (numValue > 1000000000) {
                            errors.price = "Giá không được quá 1 tỷ VNĐ"
                          }
                          
                          if (Object.keys(errors).length > 0) {
                            setCustomServiceErrors({...customServiceErrors, ...errors})
                          } else {
                            // Clear error if validation passes
                            if (customServiceErrors.price) {
                              setCustomServiceErrors({...customServiceErrors, price: ""})
                            }
                          }
                        } else {
                          // Clear error if field is empty
                          if (customServiceErrors.price) {
                            setCustomServiceErrors({...customServiceErrors, price: ""})
                          }
                        }
                      } else {
                        // Cho phép xóa số 0 trong phần tùy chỉnh
                        const value = e.target.value === "" ? 0 : Number(e.target.value)
                        setCustomServiceData({...customServiceData, basePrice: value})
                        
                        // Clear error if exists and re-validate
                        if (customServiceErrors.basePrice) {
                          setCustomServiceErrors({...customServiceErrors, basePrice: ""})
                        }
                        
                        // Real-time validation for price
                        if (e.target.value !== "") {
                          const numValue = Number(e.target.value)
                          const errors: {[key: string]: string} = {}
                          
                          if (isNaN(numValue)) {
                            errors.basePrice = "Giá phải là số hợp lệ"
                          } else if (numValue <= 0) {
                            errors.basePrice = "Giá phải lớn hơn 0"
                          } else if (numValue > 1000000000) {
                            errors.basePrice = "Giá không được quá 1 tỷ VNĐ"
                          }
                          
                          if (Object.keys(errors).length > 0) {
                            setCustomServiceErrors({...customServiceErrors, ...errors})
                          }
                        }
                      }
                    }}
                  />
                  {customServiceErrors.price && (
                    <p className="text-sm text-red-600 mt-1">{customServiceErrors.price}</p>
                  )}
                  {!customServiceErrors.price && isCustomServiceMode && customServiceData.basePrice > 0 && customServiceData.basePrice <= 1000000000 && (
                    <p className="text-sm text-green-600 mt-1">✓ Giá hợp lệ</p>
                  )}
                  {!customServiceErrors.price && !isCustomServiceMode && formData.price && formData.price > 0 && formData.price <= 1000000000 && (
                    <p className="text-sm text-green-600 mt-1">✓ Giá hợp lệ</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="estimatedTime">Thời gian ước tính (phút)</Label>
                  <Input
                    id="estimatedTime"
                    type="number"
                    placeholder="Nhập thời gian"
                    value={!isCustomServiceMode ? (formData.estimatedTimeMinutes || "") : (customServiceData.estimatedTimeMinutes || "")}
                    onChange={(e) => {
                      if (!isCustomServiceMode) {
                        const value = e.target.value ? Number(e.target.value) : undefined
                        setFormData({...formData, estimatedTimeMinutes: value})
                        
                        // Real-time validation for estimated time in system service mode
                        if (e.target.value !== "") {
                          const numValue = Number(e.target.value)
                          const errors: {[key: string]: string} = {}
                          
                          if (isNaN(numValue)) {
                            errors.estimatedTimeMinutes = "Thời gian phải là số hợp lệ"
                          } else if (numValue <= 0) {
                            errors.estimatedTimeMinutes = "Thời gian ước tính phải lớn hơn 0"
                          } else if (numValue > 1440) {
                            errors.estimatedTimeMinutes = "Thời gian không được quá 24 giờ (1440 phút)"
                          }
                          
                          if (Object.keys(errors).length > 0) {
                            setCustomServiceErrors({...customServiceErrors, ...errors})
                          } else {
                            // Clear error if validation passes
                            if (customServiceErrors.estimatedTimeMinutes) {
                              setCustomServiceErrors({...customServiceErrors, estimatedTimeMinutes: ""})
                            }
                          }
                        } else {
                          // Clear error if field is empty
                          if (customServiceErrors.estimatedTimeMinutes) {
                            setCustomServiceErrors({...customServiceErrors, estimatedTimeMinutes: ""})
                          }
                        }
                      } else {
                        // Cho phép xóa số 0 trong phần tùy chỉnh
                        const value = e.target.value === "" ? 0 : Number(e.target.value)
                        setCustomServiceData({...customServiceData, estimatedTimeMinutes: value})
                        
                        // Clear error if exists and re-validate
                        if (customServiceErrors.estimatedTimeMinutes) {
                          setCustomServiceErrors({...customServiceErrors, estimatedTimeMinutes: ""})
                        }
                        
                        // Real-time validation for estimated time
                        if (e.target.value !== "") {
                          const numValue = Number(e.target.value)
                          const errors: {[key: string]: string} = {}
                          
                          if (isNaN(numValue)) {
                            errors.estimatedTimeMinutes = "Thời gian phải là số hợp lệ"
                          } else if (numValue <= 0) {
                            errors.estimatedTimeMinutes = "Thời gian ước tính phải lớn hơn 0"
                          } else if (numValue > 1440) {
                            errors.estimatedTimeMinutes = "Thời gian không được quá 24 giờ (1440 phút)"
                          }
                          
                          if (Object.keys(errors).length > 0) {
                            setCustomServiceErrors({...customServiceErrors, ...errors})
                          }
                        }
                      }
                    }}
                  />
                  {customServiceErrors.estimatedTimeMinutes && (
                    <p className="text-sm text-red-600 mt-1">{customServiceErrors.estimatedTimeMinutes}</p>
                  )}
                  {!customServiceErrors.estimatedTimeMinutes && isCustomServiceMode && customServiceData.estimatedTimeMinutes > 0 && customServiceData.estimatedTimeMinutes <= 1440 && (
                    <p className="text-sm text-green-600 mt-1">✓ Thời gian hợp lệ</p>
                  )}
                  {!customServiceErrors.estimatedTimeMinutes && !isCustomServiceMode && formData.estimatedTimeMinutes && formData.estimatedTimeMinutes > 0 && formData.estimatedTimeMinutes <= 1440 && (
                    <p className="text-sm text-green-600 mt-1">✓ Thời gian hợp lệ</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={!isCustomServiceMode ? formData.isActive : customServiceData.isActive}
                    onCheckedChange={(checked) => {
                      if (!isCustomServiceMode) {
                        setFormData({...formData, isActive: checked})
                      } else {
                        setCustomServiceData({...customServiceData, isActive: checked})
                      }
                    }}
                  />
                  <Label htmlFor="isActive">Kích hoạt dịch vụ</Label>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => {
                    // Reset form data
                    setFormData({
                      //garageId: garageId,
                      serviceId: 0,
                      price: 0,
                      //estimatedTimeMinutes: undefined,
                      isActive: true
                    })
                    setCustomServiceData({
                      name: "",
                      description: "",
                      basePrice: 0,
                      estimatedTimeMinutes: 0,
                      isActive: true
                    })
                    setCustomServiceErrors({})
                    setIsCustomServiceMode(false)
                    setIsAddDialogOpen(false)
                  }}>
                    Hủy
                  </Button>
                  <Button 
                    onClick={() => isCustomServiceMode ? handleCustomServiceSubmit() : handleSubmit(false)} 
                    disabled={submitting || (!isCustomServiceMode && !formData.serviceId) || (isCustomServiceMode && !customServiceData.name.trim())}
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Thêm"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng dịch vụ</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalServices}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.activeServices}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Không hoạt động</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.inactiveServices}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Services List */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách dịch vụ</CardTitle>
          </CardHeader>
          <CardContent>
            {services.length === 0 ? (
              <div className="text-center py-8">
                <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Chưa có dịch vụ nào. Hãy thêm dịch vụ đầu tiên!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{service.serviceName}</h3>
                          <Badge variant={service.isActive ? "default" : "secondary"}>
                            {service.isActive ? "✅ Đang hoạt động" : "⏸️ Tạm dừng"}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{service.serviceDescription}</p>
                        
                        <div className="flex items-center space-x-4 text-sm">
                          {service.price && (
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span>{service.price.toLocaleString()} VNĐ</span>
                            </div>
                          )}
                          
                          {service.estimatedTimeMinutes && (
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4 text-blue-600" />
                              <span>{service.estimatedTimeMinutes} phút</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(service)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(service.id)}
                          disabled={togglingServices.has(service.id)}
                          title={service.isActive ? "Tạm dừng dịch vụ" : "Kích hoạt dịch vụ"}
                        >
                          {togglingServices.has(service.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Settings className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Cập nhật dịch vụ</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Dịch vụ</Label>
                <Input
                  value={editingService?.serviceName || ""}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              
              <div>
                <Label htmlFor="editPrice">Giá cơ bản (VNĐ)</Label>
                <Input
                  id="editPrice"
                  type="number"
                  placeholder="Nhập giá"
                  value={formData.price || ""}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : 0
                    setFormData({...formData, price: value})
                    
                    // Clear error if exists
                    if (customServiceErrors.price) {
                      setCustomServiceErrors({...customServiceErrors, price: ""})
                    }
                    
                    // Real-time validation for price in edit mode
                    if (e.target.value !== "") {
                      const numValue = Number(e.target.value)
                      const errors: {[key: string]: string} = {}
                      
                      if (isNaN(numValue)) {
                        errors.price = "Giá phải là số hợp lệ"
                      } else if (numValue <= 0) {
                        errors.price = "Giá phải lớn hơn 0"
                      } else if (numValue > 1000000000) {
                        errors.price = "Giá không được quá 1 tỷ VNĐ"
                      }
                      
                      if (Object.keys(errors).length > 0) {
                        setCustomServiceErrors({...customServiceErrors, ...errors})
                      }
                    }
                  }}
                />
                {customServiceErrors.price && (
                  <p className="text-sm text-red-600 mt-1">{customServiceErrors.price}</p>
                )}
                {!customServiceErrors.price && formData.price && formData.price > 0 && formData.price <= 1000000000 && (
                  <p className="text-sm text-green-600 mt-1">✓ Giá hợp lệ</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="editEstimatedTime">Thời gian ước tính (phút)</Label>
                <Input
                  id="editEstimatedTime"
                  type="number"
                  placeholder="Nhập thời gian"
                  value={formData.estimatedTimeMinutes || ""}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : undefined
                    setFormData({...formData, estimatedTimeMinutes: value})
                    
                    // Clear error if exists
                    if (customServiceErrors.estimatedTimeMinutes) {
                      setCustomServiceErrors({...customServiceErrors, estimatedTimeMinutes: ""})
                    }
                    
                    // Real-time validation for estimated time in edit mode
                    if (e.target.value !== "") {
                      const numValue = Number(e.target.value)
                      const errors: {[key: string]: string} = {}
                      
                      if (isNaN(numValue)) {
                        errors.estimatedTimeMinutes = "Thời gian phải là số hợp lệ"
                      } else if (numValue <= 0) {
                        errors.estimatedTimeMinutes = "Thời gian ước tính phải lớn hơn 0"
                      } else if (numValue > 1440) {
                        errors.estimatedTimeMinutes = "Thời gian không được quá 24 giờ (1440 phút)"
                      }
                      
                      if (Object.keys(errors).length > 0) {
                        setCustomServiceErrors({...customServiceErrors, ...errors})
                      }
                    }
                  }}
                />
                {customServiceErrors.estimatedTimeMinutes && (
                  <p className="text-sm text-red-600 mt-1">{customServiceErrors.estimatedTimeMinutes}</p>
                )}
                {!customServiceErrors.estimatedTimeMinutes && formData.estimatedTimeMinutes && formData.estimatedTimeMinutes > 0 && formData.estimatedTimeMinutes <= 1440 && (
                  <p className="text-sm text-green-600 mt-1">✓ Thời gian hợp lệ</p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="editIsActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                />
                <Label htmlFor="editIsActive">Kích hoạt dịch vụ</Label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => {
                  setIsEditDialogOpen(false)
                  setCustomServiceErrors({})
                }}>
                  Hủy
                </Button>
                <Button 
                  onClick={() => handleSubmit(true)} 
                  disabled={submitting}
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Cập nhật"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
