"use client"

import { Clock, Calendar } from "lucide-react"
import { OperatingHours } from "@/lib/api/GarageApi"
import { formatOperatingHours, DAYS_OF_WEEK } from "@/lib/utils/operatingHours"

interface OperatingHoursDisplayProps {
  operatingHours: OperatingHours
  className?: string
  showDetails?: boolean
}

export function OperatingHoursDisplay({ 
  operatingHours, 
  className = "",
  showDetails = false 
}: OperatingHoursDisplayProps) {
  if (!operatingHours) return null

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Summary */}
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4 text-slate-500" />
        <span className="font-medium text-slate-900">Giờ làm việc:</span>
        <span className="text-slate-600">{formatOperatingHours(operatingHours)}</span>
      </div>

      {/* Detailed schedule */}
      {showDetails && operatingHours.useCustomSchedule && operatingHours.customSchedule && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-slate-500" />
            <span className="font-medium text-slate-900">Lịch làm việc:</span>
          </div>
          <div className="grid gap-1 text-sm">
            {DAYS_OF_WEEK.map((day) => {
              const schedule = operatingHours.customSchedule![day.key]
              if (!schedule) return null
              
              return (
                <div key={day.key} className="flex items-center justify-between py-1">
                  <span className="text-slate-700">{day.label}</span>
                  <div className="flex items-center space-x-2">
                    {schedule.isOpen ? (
                      <>
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-slate-600">
                          {schedule.openTime} - {schedule.closeTime}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        <span className="text-slate-500">Nghỉ</span>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
