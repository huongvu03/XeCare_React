import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Users, Award, Target, Briefcase, Globe, Zap, Shield } from "lucide-react"

export function Features() {
  return (
    <section id="about-us" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">About XeCare</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Technology platform connecting users with Vietnam's leading network of trusted garages
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900">Our Story</h3>
              <p className="text-slate-600">
                XeCare was founded in 2020 by a team of technology engineers and automotive experts with the mission to
                digitally transform Vietnam's car repair service industry. From a simple idea of connecting car owners with
                trusted garages, we have developed into a comprehensive platform with over 500 partner garages nationwide.
              </p>
              <p className="text-slate-600">
                With a team of 50+ talented and passionate employees, we continuously innovate to bring the most modern,
                transparent and convenient car repair experience to Vietnamese users.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900">Vision & Mission</h3>
              <p className="text-slate-600">
                <strong>Vision:</strong> To become Southeast Asia's #1 automotive service connection platform, where every car
                owner can access high-quality repair services with absolute transparency.
              </p>
              <p className="text-slate-600">
                <strong>Mission:</strong> To digitally transform the automotive service industry, eliminate information barriers
                between car owners and garages, creating a modern and reliable automotive service ecosystem.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card className="border-blue-100">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center">
                  <Calendar className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Founded</h3>
                <p className="text-slate-600 text-sm">2020, Ho Chi Minh City</p>
              </CardContent>
            </Card>

            <Card className="border-blue-100">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Team</h3>
                <p className="text-slate-600 text-sm">50+ talented employees</p>
              </CardContent>
            </Card>

            <Card className="border-blue-100">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center">
                  <Globe className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Coverage</h3>
                <p className="text-slate-600 text-sm">Present in 25+ provinces</p>
              </CardContent>
            </Card>

            <Card className="border-blue-100">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center">
                  <Briefcase className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Partners</h3>
                <p className="text-slate-600 text-sm">500+ garages nationwide</p>
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
              <h3 className="text-lg font-semibold text-slate-900">Core Values</h3>
              <p className="text-slate-600 text-sm">Transparency - Quality - Innovation - Dedication</p>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardContent className="p-6 text-center space-y-4">
              <div className="mx-auto w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center">
                <Award className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Awards</h3>
              <p className="text-slate-600 text-sm">Top 10 Vietnamese Startup 2022 - Community Innovation 2023</p>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardContent className="p-6 text-center space-y-4">
              <div className="mx-auto w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Technology</h3>
              <p className="text-slate-600 text-sm">AI, Machine Learning, GPS, Cloud Computing</p>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardContent className="p-6 text-center space-y-4">
              <div className="mx-auto w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Commitment</h3>
              <p className="text-slate-600 text-sm">Protect customer rights, ensure service quality</p>
            </CardContent>
          </Card>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 mb-8">Trusted by</p>
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
