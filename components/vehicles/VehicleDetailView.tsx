import React from "react"
import { Vehicle } from "@/types/users/userVehicle"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Car, Edit, Trash2, Plus, Eye, Search, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
interface VehicleDetailViewProps {
  vehicle: Vehicle | null
  open: boolean
  onClose: () => void
}

// const VehicleDetailView: React.FC<VehicleDetailViewProps> = ({ vehicle, open, onClose }) => {
//   if (!vehicle) return null

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="max-w-lg">
//         <DialogHeader>
//           <DialogTitle>Chi tiết xe</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-2">
//           <p><strong>Tên xe:</strong> {vehicle.vehicleName}</p>
//           <p><strong>Biển số:</strong> {vehicle.licensePlate}</p>
//           <p><strong>Loại xe ID:</strong> {vehicle.vehicleTypeId}</p>
//           <p><strong>Trạng thái:</strong> {vehicle.locked ? "Đã khóa" : "Đang hoạt động"}</p>
//           <p><strong>Ngày tạo:</strong> {vehicle.createdAt}</p>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
const VehicleDetailView: React.FC<VehicleDetailViewProps> = ({ vehicle, open, onClose }) => {
if (!vehicle) return null
    return (
      <Dialog open={open} onOpenChange={onClose}>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="text-4xl p-3 bg-slate-50 rounded-xl">🚗</div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{vehicle.vehicleName}</h2>
            <div className="flex items-center space-x-2 mt-1">
              {/* {category && (
                <Badge className={category.color}>
                  <span className="mr-1">{category.icon}</span>
                  {category.name}
                </Badge>
              )} */}
              {vehicle.locked && <Badge variant="destructive">🔒 Đã khóa</Badge>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 border-b pb-2">Thông tin cơ bản</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Hãng xe:</span>
                <span className="font-medium">{vehicle.brand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Dòng xe:</span>
                <span className="font-medium">{vehicle.model || "Chưa cập nhật"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Năm sản xuất:</span>
                <span className="font-medium">{vehicle.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Biển số:</span>
                <span className="font-mono font-medium">{vehicle.licensePlate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Màu sắc:</span>
                <span className="font-medium">{vehicle.color || "Chưa cập nhật"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Loại xe:</span>
                <span className="font-medium">{vehicle.vehicleTypeName || "Chưa cập nhật"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Danh mục:</span>
                <span className="font-medium">{vehicle.categoryName || "Chưa cập nhật"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 border-b pb-2">Thông tin khác</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Ngày tạo:</span>
                <span className="font-medium">
                  {vehicle.createdAt ? new Date(vehicle.createdAt).toLocaleDateString("vi-VN") : "Chưa có"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Cập nhật cuối:</span>
                <span className="font-medium">
                  {vehicle.updatedAt ? new Date(vehicle.updatedAt).toLocaleDateString("vi-VN") : "Chưa có"}
                </span>
              </div>
              {vehicle.locked && vehicle.lockReason && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Lý do khóa:</span>
                  <span className="font-medium text-red-600">{vehicle.lockReason}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
   </Dialog>
    )
}

export default VehicleDetailView
