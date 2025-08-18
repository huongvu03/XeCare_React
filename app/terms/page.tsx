"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileText, Shield, AlertTriangle, Users, CreditCard, Gavel } from "lucide-react"
import Link from "next/link"

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* <Button variant="ghost" size="sm" asChild>
                <Link href="/" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Home</span>
                </Link>
              </Button> */}
              <div className="h-6 w-px bg-slate-300"></div>
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h1 className="text-xl font-bold text-slate-900">Terms of Service</h1>
              </div>
            </div>
            <div className="text-sm text-slate-500">Last updated: January 15, 2024</div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span>Introduction</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p className="text-slate-600 leading-relaxed">
                Welcome to XeCare, a comprehensive automotive service platform that connects vehicle owners with trusted
                garages and service providers. These Terms of Service ("Terms") govern your use of our website, mobile
                application, and related services (collectively, the "Service").
              </p>
              <p className="text-slate-600 leading-relaxed">
                By accessing or using XeCare, you agree to be bound by these Terms. If you disagree with any part of
                these terms, then you may not access the Service.
              </p>
            </CardContent>
          </Card>

          {/* Acceptance of Terms */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gavel className="h-5 w-5 text-green-600" />
                <span>1. Acceptance of Terms</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-slate-600">
                <p>
                  By creating an account, accessing, or using XeCare services, you acknowledge that you have read,
                  understood, and agree to be bound by these Terms of Service and our Privacy Policy.
                </p>
                <p>
                  These Terms constitute a legally binding agreement between you and XeCare. If you are using the
                  Service on behalf of an organization, you represent and warrant that you have the authority to bind
                  that organization to these Terms.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Important Notice</p>
                      <p className="text-blue-700 text-sm">
                        You must be at least 18 years old to use XeCare services. By using our platform, you confirm
                        that you meet this age requirement.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span>2. User Accounts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-slate-600">
                <h4 className="font-semibold text-slate-900">Account Registration</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You must provide accurate, current, and complete information during registration</li>
                  <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                  <li>You must notify us immediately of any unauthorized use of your account</li>
                  <li>One person or entity may not maintain more than one account</li>
                </ul>

                <h4 className="font-semibold text-slate-900 mt-6">Account Types</h4>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h5 className="font-medium text-slate-900">Customer Account</h5>
                    <p className="text-sm text-slate-600 mt-1">For vehicle owners seeking automotive services</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h5 className="font-medium text-slate-900">Garage Account</h5>
                    <p className="text-sm text-slate-600 mt-1">For service providers offering automotive services</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h5 className="font-medium text-slate-900">Admin Account</h5>
                    <p className="text-sm text-slate-600 mt-1">For platform administrators and moderators</p>
                  </div>
                </div>

                <h4 className="font-semibold text-slate-900 mt-6">Account Termination</h4>
                <p>
                  We reserve the right to suspend or terminate your account if you violate these Terms or engage in
                  activities that harm the platform or other users.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Service Usage */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span>3. Service Usage</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-slate-600">
                <h4 className="font-semibold text-slate-900">Permitted Use</h4>
                <p>
                  XeCare is designed to facilitate connections between vehicle owners and automotive service providers.
                  You may use our platform to:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Search for and book automotive services</li>
                  <li>Communicate with service providers</li>
                  <li>Leave reviews and ratings</li>
                  <li>Access emergency roadside assistance</li>
                  <li>Manage your service history and preferences</li>
                </ul>

                <h4 className="font-semibold text-slate-900 mt-6">Prohibited Activities</h4>
                <p>You agree not to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Use the Service for any illegal or unauthorized purpose</li>
                  <li>Violate any laws in your jurisdiction</li>
                  <li>Transmit any harmful, threatening, or offensive content</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt the Service</li>
                  <li>Create fake accounts or impersonate others</li>
                  <li>Spam or harass other users</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Payments and Fees */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                <span>4. Payments and Fees</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-slate-600">
                <h4 className="font-semibold text-slate-900">Service Fees</h4>
                <p>
                  XeCare may charge fees for certain services. All fees will be clearly displayed before you complete
                  any transaction. Fees are non-refundable unless otherwise stated.
                </p>

                <h4 className="font-semibold text-slate-900">Payment Processing</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Payments are processed through secure third-party payment processors</li>
                  <li>You authorize us to charge your selected payment method</li>
                  <li>You are responsible for any taxes applicable to your transactions</li>
                  <li>Currency conversion fees may apply for international transactions</li>
                </ul>

                <h4 className="font-semibold text-slate-900">Refunds and Disputes</h4>
                <p>
                  Refund policies vary by service provider. Disputes should first be resolved directly with the service
                  provider. XeCare may mediate disputes at our discretion.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>5. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-slate-600">
                <p>
                  The XeCare platform, including its design, functionality, and content, is protected by intellectual
                  property laws. You may not copy, modify, distribute, or create derivative works without our express
                  written permission.
                </p>
                <p>
                  User-generated content remains the property of the user, but you grant XeCare a license to use,
                  display, and distribute such content in connection with the Service.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>6. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-slate-600">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-900">Important Disclaimer</p>
                      <p className="text-yellow-700 text-sm">
                        XeCare acts as a platform connecting users with service providers. We do not directly provide
                        automotive services and are not responsible for the quality or outcome of services provided by
                        third parties.
                      </p>
                    </div>
                  </div>
                </div>
                <p>
                  To the maximum extent permitted by law, XeCare shall not be liable for any indirect, incidental,
                  special, consequential, or punitive damages arising from your use of the Service.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>7. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-slate-600">
                <p>
                  We reserve the right to modify these Terms at any time. We will notify users of significant changes
                  via email or through the platform. Continued use of the Service after changes constitutes acceptance
                  of the new Terms.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>8. Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-slate-600">
                <p>If you have any questions about these Terms of Service, please contact us:</p>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-slate-900">Email</p>
                      <p className="text-slate-600">legal@xecare.vn</p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Phone</p>
                      <p className="text-slate-600">+84 1900 1234</p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Address</p>
                      <p className="text-slate-600">
                        Floor 10, ABC Building
                        <br />
                        123 Nguyen Hue St, District 1<br />
                        Ho Chi Minh City, Vietnam
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Business Hours</p>
                      <p className="text-slate-600">
                        Monday - Friday: 9:00 AM - 6:00 PM
                        <br />
                        Saturday: 9:00 AM - 12:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
