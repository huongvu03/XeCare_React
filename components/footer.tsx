import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Wrench,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Youtube,
  MessageCircle,
  Instagram,
  Download,
  Shield,
  Award,
} from "lucide-react"

export function Footer() {
  return (
    <footer id="contact" className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-lg">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">XeCare</span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md">
              Nền tảng công nghệ hàng đầu Việt Nam kết nối người dùng với mạng lưới garage sửa xe uy tín, mang đến trải
              nghiệm sửa chữa xe hơi hiện đại và tiện lợi nhất.
            </p>

            {/* Newsletter signup */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Đăng ký nhận tin khuyến mãi</h4>
              <div className="flex space-x-2">
                <Input
                  placeholder="Nhập email của bạn"
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-400"
                />
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                  Đăng ký
                </Button>
              </div>
            </div>

            {/* Social links */}
            <div className="flex space-x-4">
              <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white p-2">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white p-2">
                <Youtube className="h-5 w-5" />
              </Button>
              <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white p-2">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white p-2">
                <MessageCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dịch vụ</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Tìm garage gần tôi
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Đặt lịch sửa xe
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Cứu hộ 24/7
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Bảo dưỡng định kỳ
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Kiểm định xe
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Trung tâm trợ giúp
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Hướng dẫn sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Chính sách bảo hành
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Quy trình khiếu nại
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Câu hỏi thường gặp
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Download */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Liên hệ</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-slate-400 text-sm">
                  Tầng 10, Tòa nhà ABC
                  <br />
                  123 Nguyễn Huệ, Q1, TP.HCM
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-slate-400 text-sm">Hotline: 1900 1234</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-slate-400 text-sm">support@xecare.vn</span>
              </div>
            </div>

            {/* App download */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Tải ứng dụng</h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <Download className="h-4 w-4 mr-2" />
                  App Store
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Google Play
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-slate-400">
              <p>© 2024 XeCare. Tất cả quyền được bảo lưu.</p>
              <div className="flex space-x-4">
                <a href="/terms" className="hover:text-white transition-colors">
                  Điều khoản sử dụng
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Chính sách bảo mật
                </a>
                <a href="/privacy" className="hover:text-white transition-colors">
                  Cookie
                </a>
              </div>
            </div>

            {/* Certifications */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <Shield className="h-4 w-4" />
                <span>ISO 27001</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <Award className="h-4 w-4" />
                <span>Đã xác thực</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
