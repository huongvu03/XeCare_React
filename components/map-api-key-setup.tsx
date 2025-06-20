"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Copy, ExternalLink } from "lucide-react"

export function MapApiKeySetup() {
  const [apiKey, setApiKey] = useState("")
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError("API key không được để trống")
      return
    }

    // In a real app, you would save this to localStorage or a server
    // For demo purposes, we'll just show a success message
    localStorage.setItem("google_maps_api_key", apiKey)
    setSaved(true)
    setError(null)

    // Reset the saved state after 3 seconds
    setTimeout(() => {
      setSaved(false)
    }, 3000)
  }

  const copyInstructions = () => {
    const instructions = `
1. Truy cập Google Cloud Console: https://console.cloud.google.com/
2. Tạo project mới hoặc chọn project hiện có
3. Bật Google Maps JavaScript API
4. Tạo API key với các hạn chế phù hợp
5. Thêm API key vào ứng dụng
`
    navigator.clipboard.writeText(instructions)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lg">Cài đặt Google Maps API Key</CardTitle>
        <CardDescription>Để sử dụng Google Maps, bạn cần cung cấp API key hợp lệ.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">Google Maps API Key</Label>
            <Input
              id="api-key"
              placeholder="Nhập API key của bạn"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className={error ? "border-red-300" : ""}
            />
            {error && (
              <div className="text-sm text-red-500 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {error}
              </div>
            )}
            {saved && (
              <div className="text-sm text-green-500 flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                API key đã được lưu thành công!
              </div>
            )}
          </div>

          <div className="bg-slate-50 p-3 rounded-md border text-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Hướng dẫn lấy API key</span>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={copyInstructions}>
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy instructions</span>
              </Button>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-700">
              <li>Truy cập Google Cloud Console</li>
              <li>Tạo project mới hoặc chọn project hiện có</li>
              <li>Bật Google Maps JavaScript API</li>
              <li>Tạo API key với các hạn chế phù hợp</li>
              <li>Thêm API key vào ứng dụng</li>
            </ol>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.open("https://console.cloud.google.com/", "_blank")}>
          <ExternalLink className="h-4 w-4 mr-2" />
          Google Cloud Console
        </Button>
        <Button onClick={handleSave}>Lưu API Key</Button>
      </CardFooter>
    </Card>
  )
}
