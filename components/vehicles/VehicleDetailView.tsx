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
//           <DialogTitle>Vehicle Details</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-2">
//           <p><strong>Vehicle Name:</strong> {vehicle.vehicleName}</p>
//           <p><strong>License Plate:</strong> {vehicle.licensePlate}</p>
//           <p><strong>Vehicle Type ID:</strong> {vehicle.vehicleTypeId}</p>
//           <p><strong>Status:</strong> {vehicle.locked ? "Locked" : "Active"}</p>
//           <p><strong>Created Date:</strong> {vehicle.createdAt}</p>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
const VehicleDetailView: React.FC<VehicleDetailViewProps> = ({ vehicle, open, onClose }) => {
if (!vehicle) return null
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle>Vehicle Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="text-4xl p-3 bg-slate-50 rounded-xl">🚗</div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-slate-900">{vehicle.vehicleName}</h2>
            <div className="flex items-center space-x-2 mt-1">
              {/* {category && (
                <Badge className={category.color}>
                  <span className="mr-1">{category.icon}</span>
                  {category.name}
                </Badge>
              )} */}
              {vehicle.locked && <Badge variant="destructive">🔒 Locked</Badge>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 border-b pb-2">Basic Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Brand:</span>
                <span className="font-medium">{vehicle.brand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Model:</span>
                <span className="font-medium">{vehicle.model || "Not updated"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Year of Manufacture:</span>
                <span className="font-medium">{vehicle.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">License Plate:</span>
                <span className="font-mono font-medium">{vehicle.licensePlate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Color:</span>
                <span className="font-medium">{vehicle.color || "Not updated"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Vehicle Type:</span>
                <span className="font-medium">{vehicle.vehicleTypeName || "Not updated"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Category:</span>
                <span className="font-medium">{vehicle.categoryName || "Not updated"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 border-b pb-2">Additional Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Created Date:</span>
                <span className="font-medium">
                  {vehicle.createdAt ? new Date(vehicle.createdAt).toLocaleDateString("en-US") : "Not available"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Last Updated:</span>
                <span className="font-medium">
                  {vehicle.updatedAt ? new Date(vehicle.updatedAt).toLocaleDateString("en-US") : "Not available"}
                </span>
              </div>
              {vehicle.locked && vehicle.lockReason && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Lock Reason:</span>
                  <span className="font-medium text-red-600">{vehicle.lockReason}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
        </DialogContent>
      </Dialog>
    )
}

export default VehicleDetailView
