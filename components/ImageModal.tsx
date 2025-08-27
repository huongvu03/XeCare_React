"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
}

export function ImageModal({ isOpen, onClose, imageUrl }: ImageModalProps) {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="bg-white hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">
          <img 
            src={imageUrl} 
            alt="Hình ảnh garage - Full size" 
            className="max-w-full max-h-[80vh] object-contain rounded-lg"
            onError={(e) => {
              console.log('Modal image load error:', imageUrl);
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling.style.display = 'block';
            }}
            onLoad={(e) => {
              console.log('Modal image loaded successfully:', imageUrl);
            }}
          />
          <div 
            className="hidden w-full h-64 bg-gray-100 flex items-center justify-center text-gray-500 rounded-lg"
          >
            Không thể tải hình ảnh
          </div>
        </div>
      </div>
    </div>
  )
}
