"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DatePickerProps {
  value?: Date | string
  onSelect?: (date: Date | undefined) => void
  disabled?: boolean
  minDate?: string
  maxDate?: string
  className?: string
  placeholder?: string
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ value, onSelect, disabled, minDate, maxDate, className, placeholder, ...props }, ref) => {
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const dateValue = e.target.value
      if (dateValue) {
        const selectedDate = new Date(dateValue)
        onSelect?.(selectedDate)
      } else {
        onSelect?.(undefined)
      }
    }

    const formatDate = (date: Date | string | undefined): string => {
      if (!date) return ""
      
      const dateObj = typeof date === "string" ? new Date(date) : date
      if (isNaN(dateObj.getTime())) return ""
      
      // Format as YYYY-MM-DD for input[type="date"]
      return dateObj.toISOString().split('T')[0]
    }

    return (
      <Input
        ref={ref}
        type="date"
        value={formatDate(value)}
        onChange={handleDateChange}
        disabled={disabled}
        min={minDate}
        max={maxDate}
        className={cn("w-full", className)}
        placeholder={placeholder}
        {...props}
      />
    )
  }
)

DatePicker.displayName = "DatePicker"

export { DatePicker }
