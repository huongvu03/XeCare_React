import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Users, Award, Target, Briefcase, Globe, Zap, Shield } from "lucide-react"

export function Features() {
  return (
    <section id="about-us" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Về XeCare</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Nền tảng công nghệ kết nối người dùng với mạng lưới garage uy tín hàng đầu Việt Nam
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900">Câu chuyện của chúng tôi</h3>
              <p className="text-slate-600">
                XeCare được thành lập vào năm 2020 bởi nhóm kỹ sư công nghệ và chuyên gia ô tô với sứ mệnh chuyển
                đổi số ngành dịch vụ sửa chữa ô tô tại Việt Nam. Từ một ý tưởng đơn giản về việc kết nối chủ xe với các
                garage uy tín, chúng tôi đã phát triển thành nền tảng toàn diện với hơn 500 garage đối tác trên toàn
                quốc.
              </p>
              <p className="text-slate-600">
                Với đội ngũ 50+ nhân viên tài năng và đam mê, chúng tôi không ngừng đổi mới để mang đến trải nghiệm sửa
                chữa ô tô hiện đại, minh bạch và thuận tiện nhất cho người dùng Việt Nam.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900">Tầm nhìn & Sứ mệnh</h3>
              <p className="text-slate-600">
                <strong>Tầm nhìn:</strong> Trở thành nền tảng kết nối dịch vụ ô tô số 1 Đông Nam Á, nơi mọi chủ xe đều
                có thể tiếp cận dịch vụ sửa chữa chất lượng cao với sự minh bạch tuyệt đối.
              </p>
              <p className="text-slate-600">
                <strong>Sứ mệnh:</strong> Chuyển đổi số ngành dịch vụ ô tô, xóa bỏ rào cản thông tin giữa chủ xe và
                garage, tạo ra hệ sinh thái dịch vụ ô tô hiện đại và đáng tin cậy.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card className="border-blue-100">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center">
                  <Calendar className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Thành lập</h3>
                <p className="text-slate-600 text-sm">2020, Thành phố Hồ Chí Minh</p>
              </CardContent>
            </Card>

            <Card className="border-blue-100">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Đội ngũ</h3>
                <p className="text-slate-600 text-sm">50+ nhân viên tài năng</p>
              </CardContent>
            </Card>

            <Card className="border-blue-100">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center">
                  <Globe className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Phạm vi</h3>
                <p className="text-slate-600 text-sm">Hiện diện tại 25+ tỉnh thành</p>
              </CardContent>
            </Card>

            <Card className="border-blue-100">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center">
                  <Briefcase className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Đối tác</h3>
                <p className="text-slate-600 text-sm">500+ garage trên toàn quốc</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <Card className="border-blue-100">
            <CardContent className="p-6 text-center space-y-4">
              <div className="mx-auto w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center">
                <Target className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Giá trị cốt lõi</h3>
              <p className="text-slate-600 text-sm">Minh bạch - Chất lượng - Đổi mới - Tận tâm</p>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardContent className="p-6 text-center space-y-4">
              <div className="mx-auto w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center">
                <Award className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Giải thưởng</h3>
              <p className="text-slate-600 text-sm">Top 10 Startup Việt 2022 - Sáng tạo vì cộng đồng 2023</p>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardContent className="p-6 text-center space-y-4">
              <div className="mx-auto w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Công nghệ</h3>
              <p className="text-slate-600 text-sm">AI, Machine Learning, GPS, Cloud Computing</p>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardContent className="p-6 text-center space-y-4">
              <div className="mx-auto w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Cam kết</h3>
              <p className="text-slate-600 text-sm">Bảo vệ quyền lợi khách hàng, đảm bảo chất lượng dịch vụ</p>
            </CardContent>
          </Card>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 mb-8">Được tin tưởng bởi</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-2xl font-bold text-slate-400">Honda</div>
            <div className="text-2xl font-bold text-slate-400">Yamaha</div>
            <div className="text-2xl font-bold text-slate-400">Toyota</div>
            <div className="text-2xl font-bold text-slate-400">Hyundai</div>
            <div className="text-2xl font-bold text-slate-400">Suzuki</div>
          </div>
        </div>
      </div>
    </section>
  )
}
