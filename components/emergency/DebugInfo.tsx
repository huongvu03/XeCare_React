"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Info, Database, RefreshCw } from "lucide-react"
import EmergencyApi from "@/lib/api/EmergencyApi"

interface DebugInfoProps {
  onDataLoaded?: (data: any) => void
}

export function DebugInfo({ onDataLoaded }: DebugInfoProps) {
  const [debugData, setDebugData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadDebugData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      console.log("🔍 Loading debug data...")
      
      // Test health endpoint first (no auth required)
      const healthResponse = await EmergencyApi.health()
      console.log("✅ Health API Response:", healthResponse)
      
      // Test garage requests API
      const response = await EmergencyApi.getGarageRequests()
      console.log("✅ Garage Requests API Response:", response)
      
      const data = {
        timestamp: new Date().toISOString(),
        healthStatus: "success",
        healthMessage: healthResponse.data,
        apiStatus: "success",
        requestCount: response.data?.length || 0,
        sampleRequest: response.data?.[0] || null,
        userAgent: navigator.userAgent,
        localStorage: {
          token: localStorage.getItem('token') ? 'exists' : 'missing',
          user: localStorage.getItem('user') ? 'exists' : 'missing'
        }
      }
      
      setDebugData(data)
      onDataLoaded?.(data)
      
    } catch (error: any) {
      console.error("❌ Debug data error:", error)
      setError(error.message || "Unknown error")
      
      const errorData = {
        timestamp: new Date().toISOString(),
        apiStatus: "error",
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        userAgent: navigator.userAgent,
        localStorage: {
          token: localStorage.getItem('token') ? 'exists' : 'missing',
          user: localStorage.getItem('user') ? 'exists' : 'missing'
        }
      }
      
      setDebugData(errorData)
      onDataLoaded?.(errorData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDebugData()
  }, [])

  if (!debugData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="h-5 w-5" />
            <span>Debug Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading debug data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Debug Information</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={loadDebugData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">API Status:</span>
          <Badge variant={debugData.apiStatus === "success" ? "default" : "destructive"}>
            {debugData.apiStatus === "success" ? "✅ Success" : "❌ Error"}
          </Badge>
        </div>

        {/* Timestamp */}
        <div>
          <span className="text-sm font-medium">Timestamp:</span>
          <p className="text-sm text-gray-600">{debugData.timestamp}</p>
        </div>

        {/* Request Count */}
        {debugData.requestCount !== undefined && (
          <div>
            <span className="text-sm font-medium">Emergency Requests:</span>
            <p className="text-sm text-gray-600">{debugData.requestCount} requests found</p>
          </div>
        )}

        {/* Error Information */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-red-800">Error Details</span>
            </div>
            <p className="text-sm text-red-700">{error}</p>
            {debugData.status && (
              <p className="text-sm text-red-600">Status: {debugData.status}</p>
            )}
          </div>
        )}

        {/* Sample Request */}
        {debugData.sampleRequest && (
          <div>
            <span className="text-sm font-medium">Sample Request:</span>
            <div className="bg-gray-50 rounded-lg p-3 mt-1">
              <pre className="text-xs text-gray-700 overflow-auto">
                {JSON.stringify(debugData.sampleRequest, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Local Storage */}
        <div>
          <span className="text-sm font-medium">Local Storage:</span>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs">Token:</span>
              <Badge variant={debugData.localStorage.token === 'exists' ? 'default' : 'secondary'} className="text-xs">
                {debugData.localStorage.token}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs">User:</span>
              <Badge variant={debugData.localStorage.user === 'exists' ? 'default' : 'secondary'} className="text-xs">
                {debugData.localStorage.user}
              </Badge>
            </div>
          </div>
        </div>

        {/* User Agent */}
        <div>
          <span className="text-sm font-medium">User Agent:</span>
          <p className="text-xs text-gray-600 break-all">{debugData.userAgent}</p>
        </div>
      </CardContent>
    </Card>
  )
}
