import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Vehicle } from "@/types/users/userVehicle"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Trash2, History } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VehicleServiceHistory } from "./VehicleServiceHistory"

interface VehicleCardProps {
  vehicle: Vehicle
  onEdit: (vehicle: Vehicle) => void
  onDelete: (id: number) => void
  onLock: (id: number, reason: string) => void
  onUnlock: (id: number) => void
  onViewDetail: (vehicle: Vehicle) => void
  allowDelete?: boolean
  allowLock?: boolean
  hasAppointments?: boolean
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onEdit,
  onDelete,
  onLock,
  onViewDetail,
  onUnlock,
  hasAppointments = false,
}) => {
  const [lockDialogOpen, setLockDialogOpen] = useState(false)
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false)
  const [selectedReason, setSelectedReason] = useState<string>("")

  const lockReasons = [
    "Policy violation",
    "Registration expired",
    "Vehicle reported stolen",
    "Other"
  ]

  const handleConfirmLock = () => {
    if (selectedReason) {
      onLock(vehicle.id, selectedReason)
      setLockDialogOpen(false)
      setSelectedReason("")
    }
  }

  return (
    <>
      <Card
        className={`border-slate-200 hover:shadow-lg transition-all duration-200 hover:border-blue-300 ${
          vehicle.locked ? "opacity-60 bg-gray-50" : ""
        }`}
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <div className={`text-3xl p-2 bg-slate-50 rounded-lg ${vehicle.locked ? "grayscale" : ""}`}>🚗</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-3">
                  <h3 className="font-semibold text-slate-900 truncate">{vehicle.vehicleName}</h3>
                  {vehicle.locked && (
                    <Badge variant="destructive" className="text-xs shrink-0">
                      🔒 Locked
                    </Badge>
                  )}
                  {hasAppointments && (
                    <Badge variant="secondary" className="text-xs shrink-0 bg-blue-100 text-blue-700">
                      📅 Has History
                    </Badge>
                  )}
                </div>

                {vehicle.locked && vehicle.lockReason && (
                  <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    <strong>Lock reason:</strong> {vehicle.lockReason}
                  </div>
                )}

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-600 mb-3">
                  <div>
                    <p className="font-medium text-slate-800">Brand</p>
                    <p className="truncate">{vehicle.brand} {vehicle.model}</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">License Plate</p>
                    <p className="font-mono font-medium text-slate-900">{vehicle.licensePlate}</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Vehicle Type</p>
                    <p className="truncate">{vehicle.vehicleTypeName || "Not updated"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Year</p>
                    <p>{vehicle.year}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setHistoryDialogOpen(true)} 
                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                title="View service history"
              >
                <History className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onViewDetail(vehicle)} 
                className="h-8 w-8 p-0"
                title="View vehicle details"
              >
                <Eye className="h-4 w-4" />
              </Button>
              {!vehicle.locked && (
                <>
                  <Button size="sm" variant="outline" onClick={() => onEdit(vehicle)} className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDelete(vehicle.id)}
                    disabled={hasAppointments}
                    className={`h-8 w-8 p-0 ${
                      hasAppointments 
                        ? "text-gray-400 cursor-not-allowed" 
                        : "text-red-600 hover:text-red-700 hover:bg-red-50"
                    }`}
                    title={hasAppointments ? "Cannot delete: Vehicle has appointment history" : "Delete vehicle"}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setLockDialogOpen(true)}
                    className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                  >
                    🔒
                  </Button>
                </>
              )}
              {vehicle.locked && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUnlock(vehicle.id)}
                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  🔓
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lock reason selection dialog */}
      <Dialog open={lockDialogOpen} onOpenChange={setLockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select lock reason</DialogTitle>
          </DialogHeader>
          <Select value={selectedReason} onValueChange={setSelectedReason}>
            <SelectTrigger>
              <SelectValue placeholder="Select reason..." />
            </SelectTrigger>
            <SelectContent>
              {lockReasons.map((reason, idx) => (
                <SelectItem key={idx} value={reason}>
                  {reason}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex justify-end space-x-3 mt-4">
            <Button variant="outline" onClick={() => setLockDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleConfirmLock}
              disabled={!selectedReason}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Service history dialog */}
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <History className="h-5 w-5 text-blue-600" />
              <span>Service History - {vehicle.vehicleName}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <VehicleServiceHistory 
              vehicle={{
                id: vehicle.id,
                licensePlate: vehicle.licensePlate,
                vehicleName: vehicle.vehicleName,
                brand: vehicle.brand,
                model: vehicle.model
              }}
              limit={10} 
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default VehicleCard
