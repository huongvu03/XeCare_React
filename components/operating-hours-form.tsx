"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Clock, Calendar, Settings } from "lucide-react"
import { OperatingHours, DaySchedule } from "@/lib/api/GarageApi"
import { 
  DAYS_OF_WEEK, 
  createDefaultOperatingHours, 
  createUniformOperatingHours,
  createWeekdaysOnlyOperatingHours,
  applyDefaultToAllDays,
  hasAtLeastOneOpenDay
} from "@/lib/utils/operatingHours"

interface OperatingHoursFormProps {
  value: OperatingHours
  onChange: (hours: OperatingHours) => void
  className?: string
}

export function OperatingHoursForm({ value, onChange, className }: OperatingHoursFormProps) {
  const [scheduleType, setScheduleType] = useState<'uniform' | 'custom'>(
    value.useCustomSchedule ? 'custom' : 'uniform'
  )

  // Cập nhật scheduleType khi value thay đổi
  useEffect(() => {
    setScheduleType(value.useCustomSchedule ? 'custom' : 'uniform')
  }, [value.useCustomSchedule])

  const handleScheduleTypeChange = (type: 'uniform' | 'custom') => {
    setScheduleType(type)
    
    if (type === 'uniform') {
      // Chuyển sang uniform schedule
      onChange({
        ...value,
        useCustomSchedule: false
      })
    } else {
      // Chuyển sang custom schedule
      onChange({
        ...value,
        useCustomSchedule: true
      })
    }
  }

  const handleDefaultTimeChange = (field: 'defaultOpenTime' | 'defaultCloseTime', time: string) => {
    onChange({
      ...value,
      [field]: time
    })
  }

  const handleDayScheduleChange = (dayKey: string, field: keyof DaySchedule, newValue: any) => {
    if (!value.customSchedule) return

    const updatedSchedule = {
      ...value.customSchedule,
      [dayKey]: {
        ...value.customSchedule[dayKey],
        [field]: newValue
      }
    }

    onChange({
      ...value,
      customSchedule: updatedSchedule
    })
  }

  const applyDefaultToAll = () => {
    onChange(applyDefaultToAllDays(value))
  }

  const applyWeekdaysOnly = () => {
    onChange(createWeekdaysOnlyOperatingHours(value.defaultOpenTime, value.defaultCloseTime))
  }

  const applyWeekendOff = () => {
    if (!value.customSchedule) return

    const updatedSchedule = { ...value.customSchedule }
    
    // Tắt thứ 7 và chủ nhật
    updatedSchedule.saturday = { ...updatedSchedule.saturday, isOpen: false }
    updatedSchedule.sunday = { ...updatedSchedule.sunday, isOpen: false }

    onChange({
      ...value,
      customSchedule: updatedSchedule
    })
  }

  const applyAllDays = () => {
    if (!value.customSchedule) return

    const updatedSchedule = { ...value.customSchedule }
    
    // Bật tất cả các ngày
    for (const day of DAYS_OF_WEEK) {
      updatedSchedule[day.key] = { 
        ...updatedSchedule[day.key], 
        isOpen: true 
      }
    }

    onChange({
      ...value,
      customSchedule: updatedSchedule
    })
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Step 1: Choose schedule type */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Chọn loại lịch làm việc</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
              <input
                type="radio"
                name="scheduleType"
                value="uniform"
                checked={scheduleType === 'uniform'}
                onChange={() => handleScheduleTypeChange('uniform')}
                className="w-4 h-4 text-blue-600"
              />
              <div>
                <div className="font-medium">Giờ làm việc đồng nhất</div>
                <div className="text-sm text-gray-600">Tất cả các ngày có cùng giờ mở cửa</div>
              </div>
            </label>
            
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
              <input
                type="radio"
                name="scheduleType"
                value="custom"
                checked={scheduleType === 'custom'}
                onChange={() => handleScheduleTypeChange('custom')}
                className="w-4 h-4 text-blue-600"
              />
              <div>
                <div className="font-medium">Giờ làm việc theo từng ngày</div>
                <div className="text-sm text-gray-600">Có thể set giờ khác nhau cho từng ngày</div>
              </div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Step 2a: Uniform schedule */}
      {scheduleType === 'uniform' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Giờ làm việc</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="defaultOpenTime">Giờ mở cửa</Label>
                <Input
                  id="defaultOpenTime"
                  type="time"
                  value={value.defaultOpenTime}
                  onChange={(e) => handleDefaultTimeChange('defaultOpenTime', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="defaultCloseTime">Giờ đóng cửa</Label>
                <Input
                  id="defaultCloseTime"
                  type="time"
                  value={value.defaultCloseTime}
                  onChange={(e) => handleDefaultTimeChange('defaultCloseTime', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2b: Custom schedule */}
      {scheduleType === 'custom' && (
        <div className="space-y-6">
          {/* Default hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Giờ mặc định</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="defaultOpenTime">Giờ mở cửa</Label>
                  <Input
                    id="defaultOpenTime"
                    type="time"
                    value={value.defaultOpenTime}
                    onChange={(e) => handleDefaultTimeChange('defaultOpenTime', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="defaultCloseTime">Giờ đóng cửa</Label>
                  <Input
                    id="defaultCloseTime"
                    type="time"
                    value={value.defaultCloseTime}
                    onChange={(e) => handleDefaultTimeChange('defaultCloseTime', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={applyDefaultToAll}
                className="mt-3"
              >
                Áp dụng cho tất cả ngày
              </Button>
            </CardContent>
          </Card>

          {/* Daily schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Lịch làm việc theo ngày</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {DAYS_OF_WEEK.map((day) => {
                  const schedule = value.customSchedule?.[day.key]
                  if (!schedule) return null

                  return (
                    <div key={day.key} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <div className="w-24 font-medium">{day.label}</div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${day.key}-open`}
                          checked={schedule.isOpen}
                          onCheckedChange={(checked) => 
                            handleDayScheduleChange(day.key, 'isOpen', checked)
                          }
                        />
                        <Label htmlFor={`${day.key}-open`} className="text-sm">
                          Mở cửa
                        </Label>
                      </div>
                      
                      {schedule.isOpen && (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="time"
                            value={schedule.openTime}
                            onChange={(e) => 
                              handleDayScheduleChange(day.key, 'openTime', e.target.value)
                            }
                            className="w-24 h-8 text-sm"
                          />
                          <span className="text-sm">-</span>
                          <Input
                            type="time"
                            value={schedule.closeTime}
                            onChange={(e) => 
                              handleDayScheduleChange(day.key, 'closeTime', e.target.value)
                            }
                            className="w-24 h-8 text-sm"
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Thao tác nhanh</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={applyWeekdaysOnly}
                >
                  Chỉ làm việc thứ 2-6
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={applyWeekendOff}
                >
                  Nghỉ cuối tuần
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={applyAllDays}
                >
                  Làm việc tất cả ngày
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Validation message */}
      {scheduleType === 'custom' && !hasAtLeastOneOpenDay(value) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">
            ⚠️ Cần có ít nhất 1 ngày mở cửa trong tuần
          </p>
        </div>
      )}
    </div>
  )
}
