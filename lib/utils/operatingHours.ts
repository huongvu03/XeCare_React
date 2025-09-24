import { OperatingHours, DaySchedule } from "@/lib/api/GarageApi"

export const DAYS_OF_WEEK = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" }
] as const

export type DayKey = typeof DAYS_OF_WEEK[number]["key"]

/**
 * Create default operating hours
 */
export const createDefaultOperatingHours = (): OperatingHours => {
  const customSchedule: { [key: string]: DaySchedule } = {}
  
  // Monday-Friday: 08:00 - 18:00
  for (const day of ["monday", "tuesday", "wednesday", "thursday", "friday"] as const) {
    customSchedule[day] = {
      isOpen: true,
      openTime: "08:00",
      closeTime: "18:00"
    }
  }
  
  // Saturday: 08:00 - 16:00
  customSchedule.saturday = {
    isOpen: true,
    openTime: "08:00",
    closeTime: "16:00"
  }
  
  // Sunday: Closed
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
 * Create uniform operating hours for all days
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
 * Create operating hours for weekdays only (Mon-Fri)
 */
export const createWeekdaysOnlyOperatingHours = (openTime: string, closeTime: string): OperatingHours => {
  const customSchedule: { [key: string]: DaySchedule } = {}
  
  // Monday-Friday: Open
  for (const day of ["monday", "tuesday", "wednesday", "thursday", "friday"] as const) {
    customSchedule[day] = {
      isOpen: true,
      openTime,
      closeTime
    }
  }
  
  // Saturday, Sunday: Closed
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
 * Apply default hours to all days
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
 * Check if there is at least 1 open day
 */
export const hasAtLeastOneOpenDay = (operatingHours: OperatingHours): boolean => {
  if (!operatingHours.customSchedule) return true
  
  return Object.values(operatingHours.customSchedule).some(day => day.isOpen)
}

/**
 * Get number of open days
 */
export const getOpenDaysCount = (operatingHours: OperatingHours): number => {
  if (!operatingHours.customSchedule) return 7
  
  return Object.values(operatingHours.customSchedule).filter(day => day.isOpen).length
}

/**
 * Format operating hours for display
 */
export const formatOperatingHours = (operatingHours: OperatingHours): string => {
  if (!operatingHours.useCustomSchedule) {
    return `${operatingHours.defaultOpenTime} - ${operatingHours.defaultCloseTime} (All days)`
  }
  
  const openDays = DAYS_OF_WEEK.filter(day => 
    operatingHours.customSchedule?.[day.key]?.isOpen
  )
  
  if (openDays.length === 7) {
    return `${operatingHours.defaultOpenTime} - ${operatingHours.defaultCloseTime} (All days)`
  }
  
  if (openDays.length === 5 && 
      openDays.every(day => ["monday", "tuesday", "wednesday", "thursday", "friday"].includes(day.key))) {
    return `${operatingHours.defaultOpenTime} - ${operatingHours.defaultCloseTime} (Mon - Fri)`
  }
  
  return `${operatingHours.defaultOpenTime} - ${operatingHours.defaultCloseTime} (${openDays.length} days/week)`
}
