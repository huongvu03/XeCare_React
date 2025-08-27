import { OperatingHours, DaySchedule } from "@/lib/api/GarageApi"

export const DAYS_OF_WEEK = [
  { key: "monday", label: "Thứ 2" },
  { key: "tuesday", label: "Thứ 3" },
  { key: "wednesday", label: "Thứ 4" },
  { key: "thursday", label: "Thứ 5" },
  { key: "friday", label: "Thứ 6" },
  { key: "saturday", label: "Thứ 7" },
  { key: "sunday", label: "Chủ nhật" }
] as const

export type DayKey = typeof DAYS_OF_WEEK[number]["key"]

/**
 * Tạo operating hours mặc định
 */
export const createDefaultOperatingHours = (): OperatingHours => {
  const customSchedule: { [key: string]: DaySchedule } = {}
  
  // Thứ 2-6: 08:00 - 18:00
  for (const day of ["monday", "tuesday", "wednesday", "thursday", "friday"] as const) {
    customSchedule[day] = {
      isOpen: true,
      openTime: "08:00",
      closeTime: "18:00"
    }
  }
  
  // Thứ 7: 08:00 - 16:00
  customSchedule.saturday = {
    isOpen: true,
    openTime: "08:00",
    closeTime: "16:00"
  }
  
  // Chủ nhật: Nghỉ
  customSchedule.sunday = {
    isOpen: false,
    openTime: "08:00",
    closeTime: "18:00"
  }
  
  return {
    defaultOpenTime: "08:00",
    defaultCloseTime: "18:00",
    useCustomSchedule: false,
    customSchedule
  }
}

/**
 * Tạo operating hours đồng nhất cho tất cả ngày
 */
export const createUniformOperatingHours = (openTime: string, closeTime: string): OperatingHours => {
  const customSchedule: { [key: string]: DaySchedule } = {}
  
  for (const day of DAYS_OF_WEEK) {
    customSchedule[day.key] = {
      isOpen: true,
      openTime,
      closeTime
    }
  }
  
  return {
    defaultOpenTime: openTime,
    defaultCloseTime: closeTime,
    useCustomSchedule: false,
    customSchedule
  }
}

/**
 * Tạo operating hours chỉ làm việc thứ 2-6
 */
export const createWeekdaysOnlyOperatingHours = (openTime: string, closeTime: string): OperatingHours => {
  const customSchedule: { [key: string]: DaySchedule } = {}
  
  // Thứ 2-6: Mở cửa
  for (const day of ["monday", "tuesday", "wednesday", "thursday", "friday"] as const) {
    customSchedule[day] = {
      isOpen: true,
      openTime,
      closeTime
    }
  }
  
  // Thứ 7, Chủ nhật: Nghỉ
  for (const day of ["saturday", "sunday"] as const) {
    customSchedule[day] = {
      isOpen: false,
      openTime,
      closeTime
    }
  }
  
  return {
    defaultOpenTime: openTime,
    defaultCloseTime: closeTime,
    useCustomSchedule: true,
    customSchedule
  }
}

/**
 * Áp dụng giờ mặc định cho tất cả ngày
 */
export const applyDefaultToAllDays = (operatingHours: OperatingHours): OperatingHours => {
  if (!operatingHours.customSchedule) return operatingHours
  
  const updatedSchedule = { ...operatingHours.customSchedule }
  
  for (const day of DAYS_OF_WEEK) {
    if (updatedSchedule[day.key]) {
      updatedSchedule[day.key] = {
        ...updatedSchedule[day.key],
        openTime: operatingHours.defaultOpenTime,
        closeTime: operatingHours.defaultCloseTime
      }
    }
  }
  
  return {
    ...operatingHours,
    customSchedule: updatedSchedule
  }
}

/**
 * Kiểm tra xem có ít nhất 1 ngày mở cửa không
 */
export const hasAtLeastOneOpenDay = (operatingHours: OperatingHours): boolean => {
  if (!operatingHours.customSchedule) return true
  
  return Object.values(operatingHours.customSchedule).some(day => day.isOpen)
}

/**
 * Lấy số ngày mở cửa
 */
export const getOpenDaysCount = (operatingHours: OperatingHours): number => {
  if (!operatingHours.customSchedule) return 7
  
  return Object.values(operatingHours.customSchedule).filter(day => day.isOpen).length
}

/**
 * Format operating hours để hiển thị
 */
export const formatOperatingHours = (operatingHours: OperatingHours): string => {
  if (!operatingHours.useCustomSchedule) {
    return `${operatingHours.defaultOpenTime} - ${operatingHours.defaultCloseTime} (Tất cả các ngày)`
  }
  
  const openDays = DAYS_OF_WEEK.filter(day => 
    operatingHours.customSchedule?.[day.key]?.isOpen
  )
  
  if (openDays.length === 7) {
    return `${operatingHours.defaultOpenTime} - ${operatingHours.defaultCloseTime} (Tất cả các ngày)`
  }
  
  if (openDays.length === 5 && 
      openDays.every(day => ["monday", "tuesday", "wednesday", "thursday", "friday"].includes(day.key))) {
    return `${operatingHours.defaultOpenTime} - ${operatingHours.defaultCloseTime} (Thứ 2 - Thứ 6)`
  }
  
  return `${operatingHours.defaultOpenTime} - ${operatingHours.defaultCloseTime} (${openDays.length} ngày/tuần)`
}
