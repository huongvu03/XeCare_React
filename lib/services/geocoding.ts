export interface GeocodeResult {
  lat: number
  lon: number
  display_name: string
}

export interface GeocodeError {
  message: string
  code?: string
}

class GeocodingService {
  private baseUrl = 'https://nominatim.openstreetmap.org/search'
  private userAgent = 'XeCare-Garage-App'

  async geocodeAddress(address: string): Promise<GeocodeResult> {
    try {
      // Debounce: chỉ geocode khi địa chỉ đủ dài
      if (address.length < 10) {
        throw new Error('Địa chỉ quá ngắn')
      }

      const params = new URLSearchParams({
        q: address,
        format: 'json',
        limit: '1',
        addressdetails: '1',
        countrycodes: 'vn', // Ưu tiên Việt Nam
        accept_language: 'vi' // Kết quả tiếng Việt
      })

      const response = await fetch(`${this.baseUrl}?${params}`, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data || data.length === 0) {
        throw new Error('Không tìm thấy địa chỉ')
      }

      const result = data[0]
      return {
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        display_name: result.display_name
      }

    } catch (error) {
      console.error('Geocoding error:', error)
      throw new Error('Không thể tìm tọa độ cho địa chỉ này. Vui lòng nhập thủ công.')
    }
  }

  // Reverse geocoding: từ tọa độ ra địa chỉ
  async reverseGeocode(lat: number, lon: number): Promise<string> {
    try {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
        format: 'json',
        addressdetails: '1',
        accept_language: 'vi'
      })

      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.display_name || 'Không thể xác định địa chỉ'

    } catch (error) {
      console.error('Reverse geocoding error:', error)
      return 'Không thể xác định địa chỉ'
    }
  }
}

export const geocodingService = new GeocodingService()
