import { useState, useEffect, useCallback } from 'react'
import { geocodingService, GeocodeResult } from '@/lib/services/geocoding'

interface UseGeocodingReturn {
  geocodeAddress: (address: string) => Promise<void>
  geocodeAddressImmediate: (address: string) => Promise<void>
  cancelGeocoding: () => void
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

  const cancelGeocoding = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    setIsLoading(false)
    setError(null)
    console.log('🚫 Geocoding cancelled')
  }, [timeoutId])

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

  // Geocode immediately without debounce (for specific cases)
  const geocodeAddressImmediate = useCallback(async (address: string) => {
    // Clear previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }

    // Clear previous results
    setResult(null)
    setError(null)

    // Don't geocode if address is too short
    if (address.length < 10) {
      return
    }

    // Geocode immediately
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
  }, [timeoutId])

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
    geocodeAddressImmediate,
    cancelGeocoding,
    isLoading,
    error,
    result,
    clearError
  }
}
