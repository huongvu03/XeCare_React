import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Calendar, CheckCircle, MessageCircle, CreditCard } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Search Garage",
    description: "Enter address or enable GPS to find the nearest garage. Use filters to find garages that match your needs.",
    details: ["Find by GPS location", "Filter by service", "Compare prices", "View reviews"],
  },
  {
    icon: MapPin,
    title: "Choose Preferred Garage",
    description: "View detailed garage information, customer reviews, service pricing and operating hours.",
    details: ["View garage photos", "Read reviews", "Compare prices", "Check distance"],
  },
  {
    icon: MessageCircle,
    title: "Consultation & Quote",
    description: "Chat directly with garage, describe the problem, send photos/videos for consultation and accurate quotes.",
    details: ["Real-time chat", "Send photos/videos", "Receive quotes", "Professional consultation"],
  },
  {
    icon: Calendar,
    title: "Book Appointment",
    description: "Choose suitable time, confirm service and receive confirmation notification from garage.",
    details: ["Choose time", "Confirm service", "Receive confirmation", "Appointment reminder"],
  },
  {
    icon: CheckCircle,
    title: "Repair & Track",
    description: "Track car repair progress in real-time, receive notifications when completed and inspect car before pickup.",
    details: ["Track progress", "Receive notifications", "Inspect car", "Confirm completion"],
  },
  {
    icon: CreditCard,
    title: "Payment & Review",
    description: "Pay through multiple methods, receive VAT invoice and rate service quality.",
    details: ["Multiple payment methods", "VAT invoice", "Service rating", "Receive warranty"],
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Car Repair Booking Process</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            With just 6 simple steps, you can find a trusted garage and book car repair services quickly and conveniently
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="group hover:shadow-xl transition-all duration-300 border-blue-100 hover:border-blue-200 h-full">
                <CardContent className="p-6 text-center space-y-4 h-full flex flex-col">
                  {/* Step number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>

                  <div className="pt-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>

                  <p className="text-slate-600 text-sm leading-relaxed flex-grow">{step.description}</p>

                  {/* Step details */}
                  <div className="space-y-2">
                    {step.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center justify-center space-x-2 text-xs text-slate-500">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Arrow connector for desktop */}
              {index < steps.length - 1 && index % 3 !== 2 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600"></div>
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-blue-600 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
            <p className="text-blue-100 mb-6">
              Find a garage near you now and experience the most modern car repair service
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <a href="/search">Find Garage Now</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-blue-600 hover:bg-white hover:text-blue-600"
              >
                Download App
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
