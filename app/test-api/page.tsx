"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function TestApiPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState("")

  const testApi = async (endpoint: string) => {
    setLoading(true)
    try {
      console.log(`Testing: ${endpoint}`)
      const response = await fetch(`http://localhost:8080${endpoint}`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
      console.log("API Response:", data)
    } catch (error) {
      console.error("API Error:", error)
      setResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Test API Endpoints</h1>
      
      <div className="space-y-4">
        <Button 
          onClick={() => testApi("/apis/garage/active")}
          disabled={loading}
        >
          Test /apis/garage/active
        </Button>
        
        <Button 
          onClick={() => testApi("/apis/garage/search/advanced")}
          disabled={loading}
        >
          Test /apis/garage/search/advanced
        </Button>
        
        <Button 
          onClick={() => testApi("/apis/garage/search/advanced?name=garage")}
          disabled={loading}
        >
          Test /apis/garage/search/advanced?name=garage
        </Button>

        <Button 
          onClick={() => testApi("/apis/garage/services/available")}
          disabled={loading}
        >
          Test /apis/garage/services/available
        </Button>

        <Button 
          onClick={() => testApi("/apis/garage/vehicle-types/available")}
          disabled={loading}
        >
          Test /apis/garage/vehicle-types/available
        </Button>
      </div>

      {loading && <div className="mt-4 text-blue-600">Loading...</div>}
      
      {result && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Result:</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">
            {result}
          </pre>
        </div>
      )}
    </div>
  )
}
