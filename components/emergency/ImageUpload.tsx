"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Upload, 
  X, 
  Image as ImageIcon,
  Camera,
  Trash2
} from "lucide-react"
import EmergencyApi from "@/lib/api/EmergencyApi"
import { useToast } from "@/hooks/use-toast"

interface ImageUploadProps {
  onImagesUploaded: (imageUrls: string[]) => void
  maxImages?: number
}

export function ImageUpload({ onImagesUploaded, maxImages = 5 }: ImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [imageLoading, setImageLoading] = useState<{[key: number]: boolean}>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    if (uploadedImages.length + files.length > maxImages) {
      toast({
        title: "Lỗi",
        description: `Chỉ có thể upload tối đa ${maxImages} ảnh`,
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    const newImageUrls: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Lỗi",
            description: "Chỉ chấp nhận file hình ảnh",
            variant: "destructive",
          })
          continue
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "Lỗi",
            description: "File ảnh không được lớn hơn 5MB",
            variant: "destructive",
          })
          continue
        }

        const response = await EmergencyApi.uploadEmergencyImage(file)
        console.log("📸 Upload response:", response.data)
        
        // Thêm base URL của backend để hiển thị ảnh
        const imageUrl = `http://localhost:8080${response.data}`
        console.log("🖼️ Full image URL:", imageUrl)
        newImageUrls.push(imageUrl)
        
        // Set loading state for this image
        setImageLoading(prev => ({ ...prev, [uploadedImages.length + newImageUrls.length - 1]: true }))
      }

      const updatedImages = [...uploadedImages, ...newImageUrls]
      setUploadedImages(updatedImages)
      onImagesUploaded(updatedImages)

      if (newImageUrls.length > 0) {
        toast({
          title: "Thành công",
          description: `Đã upload ${newImageUrls.length} ảnh`,
        })
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể upload ảnh",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = (index: number) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index)
    setUploadedImages(updatedImages)
    onImagesUploaded(updatedImages)
  }

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = "image/*"
      fileInputRef.current.capture = "environment"
      fileInputRef.current.click()
    }
  }

  const handleGallerySelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = "image/*"
      fileInputRef.current.capture = undefined
      fileInputRef.current.click()
    }
  }

  return (
    <Card className="border-blue-100">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-blue-800">
          <Camera className="h-5 w-5 text-blue-600" />
          <span>Ảnh sự cố</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Buttons */}
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCameraCapture}
            disabled={uploading || uploadedImages.length >= maxImages}
            className="flex-1"
          >
            <Camera className="h-4 w-4 mr-2" />
            Chụp ảnh
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleGallerySelect}
            disabled={uploading || uploadedImages.length >= maxImages}
            className="flex-1"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Chọn ảnh
          </Button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Upload Progress */}
        {uploading && (
          <div className="flex items-center space-x-2 text-blue-600">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Đang upload ảnh...</span>
          </div>
        )}

        {/* Image Preview */}
        {uploadedImages.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-700">Ảnh đã upload:</h4>
              <span className="text-sm text-gray-500">
                {uploadedImages.length}/{maxImages}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {uploadedImages.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  {imageLoading[index] && (
                    <div className="w-full h-32 bg-gray-100 rounded-lg border flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  <img
                    src={imageUrl}
                    alt={`Ảnh sự cố ${index + 1}`}
                    className={`w-full h-32 object-cover rounded-lg border ${imageLoading[index] ? 'hidden' : ''}`}
                    onLoad={() => {
                      setImageLoading(prev => ({ ...prev, [index]: false }))
                    }}
                    onError={(e) => {
                      console.error(`Failed to load image: ${imageUrl}`)
                      e.currentTarget.src = '/placeholder-user.jpg' // Fallback image
                      setImageLoading(prev => ({ ...prev, [index]: false }))
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Alert */}
        <Alert className="border-blue-200 bg-blue-50">
          <ImageIcon className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700 text-sm">
            Upload ảnh sự cố để garage có thể đánh giá chính xác tình trạng xe. 
            Tối đa {maxImages} ảnh, mỗi ảnh không quá 5MB.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
