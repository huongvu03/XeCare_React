import { useState, useEffect, useCallback } from 'react'
import { geocodingService, GeocodeResult } from '@/lib/services/geocoding'

interface UseGeocodingReturn {
  geocodeAddress: (address: string) => Promise<void>
  isLoading: boolean
  error: string | null
  result: GeocodeResult | null
  clearError: () => void
}

export function useGeocoding(delay: number = 1000): UseGeocodingReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<GeocodeResult | null>(null)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const geocodeAddress = useCallback(async (address: string) => {
    // Clear previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // Clear previous results
    setResult(null)
    setError(null)

    // Don't geocode if address is too short
    if (address.length < 10) {
      return
    }

    // Set new timeout for debouncing
    const newTimeoutId = setTimeout(async () => {
      setIsLoading(true)
      setError(null)

      try {
        const geocodeResult = await geocodingService.geocodeAddress(address)
        setResult(geocodeResult)
        setError(null)
      } catch (err: any) {
        setError(err.message)
        setResult(null)
      } finally {
        setIsLoading(false)
      }
    }, delay)

    setTimeoutId(newTimeoutId)
  }, [delay, timeoutId])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])

  return {
    geocodeAddress,
    isLoading,
    error,
    result,
    clearError
  }
}
