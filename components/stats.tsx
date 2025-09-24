import { Card, CardContent } from "@/components/ui/card"
import { Users, MapPin, Clock, Star, TrendingUp, Shield, Award, Heart } from "lucide-react"

const stats = [
  {
    icon: Users,
    number: "125,000+",
    label: "Trusted Customers",
    description: "Nationwide",
    growth: "+25% this year",
  },
  {
    icon: MapPin,
    number: "1,200+",
    label: "Partner Garages",
    description: "63 provinces",
    growth: "+180 new garages",
  },
  {
    icon: Clock,
    number: "24/7",
    label: "Emergency Support",
    description: "Non-stop",
    growth: "15 min response",
  },
  {
    icon: Star,
    number: "4.8/5",
    label: "Average Rating",
    description: "From 50K+ reviews",
    growth: "98% satisfied",
  },
  {
    icon: TrendingUp,
    number: "350K+",
    label: "Bookings",
    description: "Successful",
    growth: "+40% this month",
  },
  {
    icon: Shield,
    number: "99.2%",
    label: "Completion Rate",
    description: "On time",
    growth: "Quality commitment",
  },
  {
    icon: Award,
    number: "12 tháng",
    label: "Maximum Warranty",
    description: "For services",
    growth: "Peace of mind",
  },
  {
    icon: Heart,
    number: "2.5M+",
    label: "App Downloads",
    description: "iOS & Android",
    growth: "Top 10 Lifestyle",
  },
]

export function Stats() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white">Impressive Numbers</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Customer trust and satisfaction is the driving force for us to continuously develop and improve our
            services
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 group"
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>

                <div className="space-y-2">
                  <div className="text-3xl font-bold text-white">{stat.number}</div>
                  <div className="text-lg font-semibold text-blue-100">{stat.label}</div>
                  <div className="text-sm text-blue-200">{stat.description}</div>
                  <div className="text-xs text-cyan-200 font-medium bg-white/10 rounded-full px-3 py-1 inline-block">
                    {stat.growth}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional achievements */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-2xl font-bold text-white">Top 3</div>
            <div className="text-blue-100">Vietnam's leading car repair app</div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-white">ISO 27001</div>
            <div className="text-blue-100">International information security certification</div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-white">5 năm</div>
            <div className="text-blue-100">Market service experience</div>
          </div>
        </div>

        {/* Customer testimonial preview */}
        <div className="mt-16 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <div className="text-center space-y-4">
            <div className="flex justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-xl text-white italic">
              "XeCare has changed how I take care of my car. Finding trusted garages is easy, booking is quick, and I
              always receive dedicated support."
            </blockquote>
            <div className="text-blue-200">
              <div className="font-semibold">Mr. Minh Tuan</div>
              <div className="text-sm">Loyal customer since 2022</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
