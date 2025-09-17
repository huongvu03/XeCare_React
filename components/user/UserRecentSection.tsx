"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Star } from "lucide-react"

export default function UserRecentSection() {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Lịch hẹn gần đây */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span>Lịch hẹn gần đây</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Thay nhớt xe máy</p>
                <p className="text-sm text-slate-600">Garage Thành Công</p>
                <p className="text-sm text-blue-600">15/12/2024 - 14:00</p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Hoàn thành
              </Badge>
            </div>
            <div className="text-center py-4">
              <p className="text-slate-500 text-sm">Chưa có lịch hẹn nào khác</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Garage yêu thích */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-blue-600" />
            <span>Garage yêu thích</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Garage Thành Công</p>
                <p className="text-sm text-slate-600">123 Lê Lợi, Q1, TP.HCM</p>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-slate-600">4.8 (120 đánh giá)</span>
                </div>
              </div>
              <button className="px-3 py-1 text-sm border rounded border-slate-200 hover:bg-slate-50">
                Xem
              </button>
            </div>
            <div className="text-center py-4">
              <p className="text-slate-500 text-sm">Chưa có garage yêu thích nào khác</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
