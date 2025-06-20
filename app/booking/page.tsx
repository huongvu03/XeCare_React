"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CalendarIcon, Clock, MapPin, Star, Phone, Upload, CheckCircle, Car, Bike, Truck } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

// Mock garage data
const selectedGarage = {
  id: 1,
  name: "Garage Thành Công",
  address: "123 Lê Lợi, Q1, TP.HCM",
  rating: 4.8,
  reviewCount: 245,
  phone: "0909123456",
  services: [
    { name: "Thay nhớt xe máy", price: "80,000 - 150,000", duration: "30 phút" },
    { name: "Thay nhớt ô tô", price: "200,000 - 500,000", duration: "45 phút" },
    { name: "Sửa phanh xe máy", price: "150,000 - 300,000", duration: "1 giờ" },
    { name: "Sửa phanh ô tô", price: "500,000 - 1,500,000", duration: "2 giờ" },
    { name: "Bảo dưỡng tổng quát", price: "300,000 - 800,000", duration: "2-3 giờ" },
  ],
  availableSlots: [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ],
}

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedService, setSelectedService] = useState("")
  const [vehicleType, setVehicleType] = useState("")
  const [vehicleInfo, setVehicleInfo] = useState({
    brand: "",
    model: "",
    year: "",
    licensePlate: "",
  })
  const [problemDescription, setProblemDescription] = useState("")
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
  })
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      // In real app, would upload to server
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setUploadedImages((prev) => [...prev, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setBookingSuccess(true)
    } catch (error) {
      console.error("Booking failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (bookingSuccess) {
    return (
      <DashboardLayout
        allowedRoles={["user", "admin", "garage"]}
        title="Đặt lịch thành công"
        description="Lịch hẹn của bạn đã được xác nhận"
      >
        <Card className="border-green-100 bg-green-50">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-800 mb-2">Đặt lịch thành công!</h2>
            <p className="text-green-700 mb-6">
              Lịch hẹn của bạn đã được gửi đến {selectedGarage.name}. Garage sẽ liên hệ xác nhận trong vòng 15 phút.
            </p>

            <div className="bg-white rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold mb-2">Thông tin lịch hẹn:</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Garage:</strong> {selectedGarage.name}
                </p>
                <p>
                  <strong>Ngày:</strong> {selectedDate && format(selectedDate, "dd/MM/yyyy", { locale: vi })}
                </p>
                <p>
                  <strong>Giờ:</strong> {selectedTime}
                </p>
                <p>
                  <strong>Dịch vụ:</strong> {selectedService}
                </p>
                <p>
                  <strong>Loại xe:</strong> {vehicleType}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">Xem lịch hẹn của tôi</Button>
              <Button variant="outline" onClick={() => setBookingSuccess(false)}>
                Đặt lịch khác
              </Button>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      allowedRoles={["user", "admin", "garage"]}
      title="Đặt lịch sửa xe"
      description="Đặt lịch hẹn với garage một cách nhanh chóng và tiện lợi"
    >
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Garage Info */}
        <div className="lg:col-span-1">
          <Card className="border-blue-100 sticky top-4">
            <CardHeader>
              <CardTitle>Thông tin garage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedGarage.name}</h3>
                <div className="flex items-center space-x-1 mb-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm">
                    {selectedGarage.rating} ({selectedGarage.reviewCount} đánh giá)
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span>{selectedGarage.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>{selectedGarage.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span>7:00 - 19:00 (Thứ 2 - Chủ nhật)</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Dịch vụ phổ biến:</h4>
                <div className="space-y-2">
                  {selectedGarage.services.slice(0, 3).map((service, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium">{service.name}</div>
                      <div className="text-slate-600">
                        {service.price} • {service.duration}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Selection */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle>1. Chọn dịch vụ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Loại xe</Label>
                  <Select value={vehicleType} onValueChange={setVehicleType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại xe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="xe-may">
                        <div className="flex items-center space-x-2">
                          <Bike className="h-4 w-4" />
                          <span>Xe máy</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="o-to">
                        <div className="flex items-center space-x-2">
                          <Car className="h-4 w-4" />
                          <span>Ô tô</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="xe-tai">
                        <div className="flex items-center space-x-2">
                          <Truck className="h-4 w-4" />
                          <span>Xe tải</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Dịch vụ cần thực hiện</Label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn dịch vụ" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedGarage.services.map((service, index) => (
                        <SelectItem key={index} value={service.name}>
                          <div>
                            <div className="font-medium">{service.name}</div>
                            <div className="text-xs text-slate-500">
                              {service.price} • {service.duration}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Date & Time Selection */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle>2. Chọn ngày và giờ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ngày hẹn</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < new Date() || date.getDay() === 0}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Giờ hẹn</Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giờ" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedGarage.availableSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Information */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle>3. Thông tin xe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Hãng xe</Label>
                    <Input
                      placeholder="VD: Honda, Toyota..."
                      value={vehicleInfo.brand}
                      onChange={(e) => setVehicleInfo((prev) => ({ ...prev, brand: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Dòng xe</Label>
                    <Input
                      placeholder="VD: Wave, Vios..."
                      value={vehicleInfo.model}
                      onChange={(e) => setVehicleInfo((prev) => ({ ...prev, model: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Năm sản xuất</Label>
                    <Input
                      placeholder="VD: 2020"
                      value={vehicleInfo.year}
                      onChange={(e) => setVehicleInfo((prev) => ({ ...prev, year: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Biển số xe</Label>
                    <Input
                      placeholder="VD: 59A1-12345"
                      value={vehicleInfo.licensePlate}
                      onChange={(e) => setVehicleInfo((prev) => ({ ...prev, licensePlate: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Problem Description */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle>4. Mô tả vấn đề</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Mô tả chi tiết vấn đề xe gặp phải</Label>
                  <Textarea
                    placeholder="Mô tả triệu chứng, âm thanh bất thường, hoặc vấn đề bạn gặp phải..."
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Upload hình ảnh (tùy chọn)</Label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-4">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="text-center">
                        <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-600">Nhấn để chọn ảnh hoặc kéo thả vào đây</p>
                        <p className="text-xs text-slate-500">PNG, JPG tối đa 5MB mỗi ảnh</p>
                      </div>
                    </label>
                  </div>

                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-20 object-cover rounded"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() => removeImage(index)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle>5. Thông tin liên hệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Họ và tên *</Label>
                    <Input
                      required
                      placeholder="Nhập họ và tên"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Số điện thoại *</Label>
                    <Input
                      required
                      placeholder="Nhập số điện thoại"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="Nhập email (tùy chọn)"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Summary & Submit */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle>Xác nhận thông tin</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertDescription>
                    Garage sẽ liên hệ xác nhận lịch hẹn trong vòng 15 phút. Bạn có thể hủy hoặc thay đổi lịch hẹn miễn
                    phí trước 2 giờ.
                  </AlertDescription>
                </Alert>

                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium">Tóm tắt lịch hẹn:</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Garage:</strong> {selectedGarage.name}
                    </p>
                    <p>
                      <strong>Dịch vụ:</strong> {selectedService || "Chưa chọn"}
                    </p>
                    <p>
                      <strong>Ngày giờ:</strong>{" "}
                      {selectedDate && selectedTime
                        ? `${format(selectedDate, "dd/MM/yyyy", { locale: vi })} lúc ${selectedTime}`
                        : "Chưa chọn"}
                    </p>
                    <p>
                      <strong>Xe:</strong> {vehicleInfo.brand} {vehicleInfo.model} {vehicleInfo.year}
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  disabled={
                    isSubmitting ||
                    !selectedDate ||
                    !selectedTime ||
                    !selectedService ||
                    !customerInfo.name ||
                    !customerInfo.phone
                  }
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang gửi yêu cầu...</span>
                    </div>
                  ) : (
                    "Xác nhận đặt lịch"
                  )}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
