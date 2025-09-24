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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16" suppressHydrationWarning>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8" suppressHydrationWarning>
          {/* Company info */}
          <div className="lg:col-span-2 space-y-6" suppressHydrationWarning>
            <div className="flex items-center space-x-2" suppressHydrationWarning>
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-lg" suppressHydrationWarning>
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">XeCare</span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md">
              Vietnam's leading technology platform connecting users with a network of trusted auto repair garages, delivering
              the most modern and convenient car repair experience.
            </p>

            {/* Newsletter signup */}
            {/* <div className="space-y-3">
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
            </div> */}

            {/* Social links */}
            <div className="flex space-x-4" suppressHydrationWarning>
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
          <div className="space-y-4" suppressHydrationWarning>
            <h3 className="text-lg font-semibold">Services</h3>
            <ul className="space-y-2" suppressHydrationWarning>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Find Nearby Garage
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Book Car Repair
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  24/7 Emergency Rescue
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Regular Maintenance
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Vehicle Inspection
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4" suppressHydrationWarning>
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2" suppressHydrationWarning>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  User Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Warranty Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Complaint Process
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Download */}
          <div className="space-y-4" suppressHydrationWarning>
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-3" suppressHydrationWarning>
              <div className="flex items-center space-x-3" suppressHydrationWarning>
                <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-slate-400 text-sm">
                  10th Floor, ABC Building
                  <br />
                  123 Nguyen Hue, District 1, HCMC
                </span>
              </div>
              <div className="flex items-center space-x-3" suppressHydrationWarning>
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-slate-400 text-sm">Hotline: 1900 1234</span>
              </div>
              <div className="flex items-center space-x-3" suppressHydrationWarning>
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-slate-400 text-sm">support@xecare.vn</span>
              </div>
            </div>

            {/* App download */}
            <div className="space-y-3" suppressHydrationWarning>
              <h4 className="font-semibold text-white">Download App</h4>
              <div className="space-y-2" suppressHydrationWarning>
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
        <div className="border-t border-slate-800 mt-12 pt-8" suppressHydrationWarning>
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0" suppressHydrationWarning>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-slate-400" suppressHydrationWarning>
              <p>© 2024 XeCare. All rights reserved.</p>
              <div className="flex space-x-4" suppressHydrationWarning>
                <a href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="/privacy" className="hover:text-white transition-colors">
                  Cookie
                </a>
              </div>
            </div>

            {/* Certifications */}
            <div className="flex items-center space-x-4" suppressHydrationWarning>
              <div className="flex items-center space-x-2 text-xs text-slate-400" suppressHydrationWarning>
                <Shield className="h-4 w-4" />
                <span>ISO 27001</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-400" suppressHydrationWarning>
                <Award className="h-4 w-4" />
                <span>Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
