import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Clock,
  Phone,
  Star,
  Calendar,
  Shield,
  Award,
  Users,
  Car,
  Wrench,
  CheckCircle,
  MessageCircle,
  Share2,
  Heart,
  Navigation,
  Mail,
  Globe,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock data for all garages
const mockGarageData = {
  "thanh-cong": {
    id: 1,
    name: "Garage Thành Công",
    slug: "thanh-cong",
    logo: "TC",
    logoColor: "from-blue-600 to-cyan-600",
    rating: 4.9,
    reviewCount: 245,
    address: "123 Lê Lợi, Quận 1, TP.HCM",
    distance: "1.2km",
    phone: "0909 123 456",
    email: "contact@thanhcong.garage",
    website: "www.thanhcong.garage",
    hours: "7:00 - 19:00",
    isOpen: true,
    description:
      "Garage Thành Công là một trong những garage uy tín nhất tại TP.HCM với hơn 15 năm kinh nghiệm trong lĩnh vực sửa chữa và bảo dưỡng ô tô. Chúng tôi cam kết mang đến dịch vụ chất lượng cao với giá cả hợp lý, đội ngũ kỹ thuật viên chuyên nghiệp và trang thiết bị hiện đại.",
    services: [
      { name: "Thay nhớt động cơ", price: "150,000 - 300,000đ", duration: "30 phút" },
      { name: "Sửa phanh", price: "200,000 - 800,000đ", duration: "1-2 giờ" },
      { name: "Bảo dưỡng định kỳ", price: "300,000 - 1,500,000đ", duration: "2-4 giờ" },
      { name: "Thay lốp xe", price: "100,000 - 200,000đ", duration: "20 phút" },
      { name: "Sửa điện ô tô", price: "150,000 - 500,000đ", duration: "1-3 giờ" },
      { name: "Rửa xe chi tiết", price: "50,000 - 100,000đ", duration: "30 phút" },
    ],
    specialties: ["Thay nhớt", "Sửa phanh", "Bảo dưỡng", "Rửa xe"],
    certifications: ["Chứng nhận ISO 9001", "Đại lý chính hãng Shell", "Thành viên hiệp hội garage VN"],
    images: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    reviews: [
      {
        id: 1,
        user: "Nguyễn Văn A",
        rating: 5,
        comment: "Dịch vụ tuyệt vời, nhân viên nhiệt tình, giá cả hợp lý. Sẽ quay lại lần sau!",
        date: "2024-01-15",
        service: "Thay nhớt",
      },
      {
        id: 2,
        user: "Trần Thị B",
        rating: 5,
        comment: "Garage rất chuyên nghiệp, sửa xe nhanh và đúng hẹn. Highly recommended!",
        date: "2024-01-10",
        service: "Sửa phanh",
      },
      {
        id: 3,
        user: "Lê Văn C",
        rating: 4,
        comment: "Chất lượng tốt, không gian sạch sẽ. Chỉ có điều hơi đông khách vào cuối tuần.",
        date: "2024-01-08",
        service: "Bảo dưỡng",
      },
    ],
  },
  "garage-24-7": {
    id: 2,
    name: "Garage 24/7",
    slug: "garage-24-7",
    logo: "24",
    logoColor: "from-green-600 to-emerald-600",
    rating: 4.7,
    reviewCount: 189,
    address: "456 Nguyễn Huệ, Quận 1, TP.HCM",
    distance: "2.1km",
    phone: "0908 247 247",
    email: "support@garage247.com",
    website: "www.garage247.com",
    hours: "24/7",
    isOpen: true,
    description:
      "Garage 24/7 là trung tâm cứu hộ và sửa chữa ô tô hoạt động 24/7, chuyên về dịch vụ cứu hộ khẩn cấp và sửa chữa nhanh. Đội ngũ kỹ thuật viên giàu kinh nghiệm luôn sẵn sàng hỗ trợ bạn mọi lúc mọi nơi với thời gian phản hồi nhanh nhất.",
    services: [
      { name: "Cứu hộ tại chỗ", price: "200,000 - 500,000đ", duration: "30-60 phút" },
      { name: "Thay lốp khẩn cấp", price: "50,000đ", duration: "15 phút" },
      { name: "Sạc ắc quy", price: "100,000đ", duration: "20 phút" },
      { name: "Sửa chữa tại garage", price: "Theo báo giá", duration: "1-4 giờ" },
      { name: "Kéo xe về garage", price: "150,000 - 300,000đ", duration: "30 phút" },
      { name: "Kiểm tra tổng quát", price: "100,000đ", duration: "45 phút" },
    ],
    specialties: ["Cứu hộ 24/7", "Sửa chữa khẩn cấp", "Thay lốp", "Sạc ắc quy"],
    certifications: ["Giấy phép cứu hộ", "Chứng nhận an toàn lao động", "ISO 14001"],
    images: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    reviews: [
      {
        id: 1,
        user: "Anh Hùng",
        rating: 5,
        comment: "Cứu hộ nhanh chóng, nhân viên nhiệt tình. Đến trong 20 phút!",
        date: "2024-01-12",
        service: "Cứu hộ",
      },
      {
        id: 2,
        user: "Chị Mai",
        rating: 4,
        comment: "Dịch vụ 24/7 rất tiện lợi, giá cả hợp lý.",
        date: "2024-01-08",
        service: "Thay lốp",
      },
    ],
  },
  "auto-care": {
    id: 3,
    name: "Auto Care Center",
    slug: "auto-care",
    logo: "AC",
    logoColor: "from-purple-600 to-pink-600",
    rating: 4.8,
    reviewCount: 172,
    address: "789 Cách Mạng Tháng 8, Quận 3, TP.HCM",
    distance: "0.8km",
    phone: "0907 888 999",
    email: "info@autocare.vn",
    website: "www.autocare.vn",
    hours: "8:00 - 20:00",
    isOpen: true,
    description:
      "Auto Care Center là trung tâm chăm sóc ô tô cao cấp, chuyên về hệ thống điện, điều hòa và đồng sơn. Với trang thiết bị hiện đại và đội ngũ kỹ thuật viên được đào tạo chuyên sâu, chúng tôi mang đến dịch vụ chất lượng cao nhất.",
    services: [
      { name: "Sửa chữa hệ thống điện", price: "300,000 - 2,000,000đ", duration: "2-4 giờ" },
      { name: "Bảo dưỡng điều hòa", price: "200,000 - 800,000đ", duration: "1-2 giờ" },
      { name: "Đồng sơn xe", price: "500,000 - 5,000,000đ", duration: "1-3 ngày" },
      { name: "Chăm sóc nội thất", price: "300,000 - 1,000,000đ", duration: "2-3 giờ" },
      { name: "Phủ ceramic", price: "1,000,000 - 3,000,000đ", duration: "4-6 giờ" },
      { name: "Dán phim cách nhiệt", price: "800,000 - 2,500,000đ", duration: "2-3 giờ" },
    ],
    specialties: ["Hệ thống điện", "Điều hòa ô tô", "Đồng sơn", "Chăm sóc nội thất"],
    certifications: ["Chứng nhận Bosch", "Chứng nhận Denso", "Chứng nhận 3M"],
    images: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    reviews: [
      {
        id: 1,
        user: "Anh Phong",
        rating: 5,
        comment: "Đồng sơn rất đẹp, tỉ mỉ từng chi tiết. Xe như mới!",
        date: "2024-01-14",
        service: "Đồng sơn",
      },
      {
        id: 2,
        user: "Chị Hoa",
        rating: 5,
        comment: "Sửa điều hòa chuyên nghiệp, mát lạnh ngay.",
        date: "2024-01-09",
        service: "Điều hòa",
      },
    ],
  },
  "saigon-auto": {
    id: 4,
    name: "Sài Gòn Auto",
    slug: "saigon-auto",
    logo: "SG",
    logoColor: "from-red-600 to-orange-600",
    rating: 4.6,
    reviewCount: 156,
    address: "101 Nguyễn Văn Linh, Quận 7, TP.HCM",
    distance: "3.5km",
    phone: "0903 777 888",
    email: "contact@saigonauto.com",
    website: "www.saigonauto.com",
    hours: "7:30 - 18:30",
    isOpen: true,
    description:
      "Sài Gòn Auto chuyên về sửa chữa gầm xe và động cơ với hơn 20 năm kinh nghiệm. Chúng tôi có đội ngũ thợ lành nghề và trang thiết bị chuyên dụng để xử lý các vấn đề phức tạp nhất của xe ô tô.",
    services: [
      { name: "Sửa chữa gầm xe", price: "500,000 - 3,000,000đ", duration: "3-6 giờ" },
      { name: "Đại tu động cơ", price: "5,000,000 - 20,000,000đ", duration: "3-7 ngày" },
      { name: "Sửa hộp số", price: "2,000,000 - 8,000,000đ", duration: "1-3 ngày" },
      { name: "Thay dầu hộp số", price: "200,000 - 500,000đ", duration: "1 giờ" },
      { name: "Sửa hệ thống treo", price: "800,000 - 2,500,000đ", duration: "2-4 giờ" },
      { name: "Cân bằng động", price: "100,000 - 200,000đ", duration: "30 phút" },
    ],
    specialties: ["Sửa chữa gầm xe", "Động cơ", "Hộp số", "Hệ thống treo"],
    certifications: ["Chứng nhận Castrol", "Chứng nhận Shell", "Giấy phép kinh doanh"],
    images: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    reviews: [
      {
        id: 1,
        user: "Anh Tâm",
        rating: 5,
        comment: "Sửa gầm xe rất chuyên nghiệp, giá hợp lý.",
        date: "2024-01-11",
        service: "Gầm xe",
      },
      {
        id: 2,
        user: "Chị Linh",
        rating: 4,
        comment: "Đại tu động cơ chất lượng, xe chạy êm như mới.",
        date: "2024-01-07",
        service: "Động cơ",
      },
    ],
  },
  "viet-nhat": {
    id: 5,
    name: "Việt Nhật Auto",
    slug: "viet-nhat",
    logo: "VN",
    logoColor: "from-yellow-500 to-amber-600",
    rating: 4.5,
    reviewCount: 132,
    address: "202 Điện Biên Phủ, Bình Thạnh, TP.HCM",
    distance: "1.5km",
    phone: "0904 555 666",
    email: "info@vietnhatauto.vn",
    website: "www.vietnhatauto.vn",
    hours: "8:00 - 17:30",
    isOpen: false,
    description:
      "Việt Nhật Auto chuyên về xe Nhật Bản với đội ngũ kỹ thuật viên được đào tạo tại Nhật. Chúng tôi cung cấp phụ tùng chính hãng và dịch vụ bảo dưỡng theo tiêu chuẩn Nhật Bản, đảm bảo chất lượng cao nhất.",
    services: [
      { name: "Bảo dưỡng xe Nhật", price: "400,000 - 1,200,000đ", duration: "2-3 giờ" },
      { name: "Thay phụ tùng chính hãng", price: "Theo báo giá", duration: "1-4 giờ" },
      { name: "Chẩn đoán lỗi", price: "150,000đ", duration: "30 phút" },
      { name: "Sửa chữa chuyên sâu", price: "500,000 - 5,000,000đ", duration: "1-5 ngày" },
      { name: "Bảo dưỡng định kỳ", price: "300,000 - 800,000đ", duration: "2 giờ" },
      { name: "Kiểm tra an toàn", price: "200,000đ", duration: "1 giờ" },
    ],
    specialties: ["Xe Nhật Bản", "Phụ tùng chính hãng", "Bảo dưỡng định kỳ", "Chẩn đoán lỗi"],
    certifications: ["Chứng nhận Toyota", "Chứng nhận Honda", "Chứng nhận Nissan"],
    images: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    reviews: [
      {
        id: 1,
        user: "Anh Việt",
        rating: 5,
        comment: "Chuyên về xe Nhật, phụ tùng chính hãng. Rất uy tín!",
        date: "2024-01-13",
        service: "Bảo dưỡng",
      },
      {
        id: 2,
        user: "Chị Thu",
        rating: 4,
        comment: "Bảo dưỡng Honda rất tốt, giá hợp lý.",
        date: "2024-01-08",
        service: "Bảo dưỡng",
      },
    ],
  },
}

interface PageProps {
  params: {
    slug: string
  }
}

export default function GarageDetailPage({ params }: PageProps) {
  const garage = mockGarageData[params.slug as keyof typeof mockGarageData]

  if (!garage) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Không tìm thấy garage</h1>
          <p className="text-slate-600 mb-6">Garage bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay về trang chủ
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          {/* Back button */}
          <div className="mb-4">
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay về trang chủ
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div
                className={`w-16 h-16 bg-gradient-to-r ${garage.logoColor} rounded-xl flex items-center justify-center`}
              >
                <span className="text-white font-bold text-xl">{garage.logo}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{garage.name}</h1>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{garage.rating}</span>
                    <span className="text-slate-600">({garage.reviewCount} đánh giá)</span>
                  </div>
                  <Badge variant={garage.isOpen ? "default" : "secondary"} className="bg-green-100 text-green-700">
                    {garage.isOpen ? "Đang mở cửa" : "Đã đóng cửa"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Yêu thích
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Chia sẻ
              </Button>
            </div>
          </div>

          {/* Quick info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2 text-slate-600">
              <MapPin className="h-4 w-4" />
              <span>
                {garage.address} • {garage.distance}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <Clock className="h-4 w-4" />
              <span>Giờ mở cửa: {garage.hours}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <Phone className="h-4 w-4" />
              <span>{garage.phone}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <Mail className="h-4 w-4" />
              <span>{garage.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Images */}
            <Card>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="md:col-span-2">
                    <Image
                      src={garage.images[0] || "/placeholder.svg"}
                      alt={garage.name}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover rounded-l-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Image
                      src={garage.images[1] || "/placeholder.svg"}
                      alt={garage.name}
                      width={200}
                      height={150}
                      className="w-full h-32 object-cover rounded-tr-lg"
                    />
                    <Image
                      src={garage.images[2] || "/placeholder.svg"}
                      alt={garage.name}
                      width={200}
                      height={150}
                      className="w-full h-32 object-cover rounded-br-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Car className="h-5 w-5" />
                  <span>Giới thiệu</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">{garage.description}</p>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Chuyên môn</h4>
                  <div className="flex flex-wrap gap-2">
                    {garage.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Chứng nhận</h4>
                  <div className="space-y-2">
                    {garage.certifications.map((cert) => (
                      <div key={cert} className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wrench className="h-5 w-5" />
                  <span>Dịch vụ & Bảng giá</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {garage.services.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{service.name}</h4>
                        <p className="text-sm text-slate-600">Thời gian: {service.duration}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-blue-600">{service.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>Đánh giá khách hàng</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {garage.reviews.map((review) => (
                    <div key={review.id} className="border-b border-slate-200 pb-6 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{review.user}</h4>
                            <div className="flex items-center space-x-2 text-sm text-slate-600">
                              <span>{review.date}</span>
                              <span>•</span>
                              <span>{review.service}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "text-yellow-400 fill-current" : "text-slate-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking card */}
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Đặt lịch hẹn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg" asChild>
                  <Link href="/booking">
                    <Calendar className="h-5 w-5 mr-2" />
                    Đặt lịch ngay
                  </Link>
                </Button>

                <Button variant="outline" className="w-full" size="lg">
                  <Phone className="h-5 w-5 mr-2" />
                  Gọi điện tư vấn
                </Button>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Phản hồi trung bình</span>
                    <span className="font-medium">15 phút</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Tỷ lệ đặt lại</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Đã phục vụ</span>
                    <span className="font-medium">2,500+ khách hàng</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact info */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin liên hệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">{garage.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">{garage.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">{garage.website}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Giờ mở cửa: {garage.hours}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Navigation className="h-5 w-5" />
                  <span>Vị trí</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-slate-100 h-48 rounded-lg flex items-center justify-center">
                    <div className="text-center text-slate-500">
                      <MapPin className="h-8 w-8 mx-auto mb-2" />
                      <p>Bản đồ sẽ hiển thị tại đây</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-slate-400" />
                      <span>{garage.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span>Cách bạn {garage.distance}</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <Navigation className="h-4 w-4 mr-2" />
                    Chỉ đường
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Trust indicators */}
            <Card>
              <CardHeader>
                <CardTitle>Cam kết chất lượng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Bảo hành dịch vụ</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span className="text-sm">Garage được xác minh</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm">Đối tác uy tín</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
