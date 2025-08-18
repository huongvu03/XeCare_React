"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Shield, Eye, Database, Lock, Users, Globe, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                {/* <Link href="/" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Home</span>
                </Link> */}
              </Button>
              <div className="h-6 w-px bg-slate-300"></div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <h1 className="text-xl font-bold text-slate-900">Privacy Policy</h1>
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
                <Eye className="h-5 w-5 text-green-600" />
                <span>Introduction</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p className="text-slate-600 leading-relaxed">
                At XeCare, we are committed to protecting your privacy and ensuring the security of your personal
                information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information
                when you use our automotive service platform.
              </p>
              <p className="text-slate-600 leading-relaxed">
                By using XeCare, you consent to the data practices described in this policy. We encourage you to read
                this policy carefully to understand our practices regarding your personal data.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-blue-600" />
                <span>1. Information We Collect</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 text-slate-600">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Personal Information</h4>
                  <p className="mb-3">We collect information you provide directly to us, including:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Name, email address, and phone number</li>
                    <li>Profile information and preferences</li>
                    <li>Vehicle information (make, model, year, license plate)</li>
                    <li>Payment information and billing address</li>
                    <li>Communication history and support requests</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Automatically Collected Information</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Device information (IP address, browser type, operating system)</li>
                    <li>Usage data (pages visited, time spent, click patterns)</li>
                    <li>Location data (with your permission)</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Information from Third Parties</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Social media profile information (when you connect accounts)</li>
                    <li>Payment processor information</li>
                    <li>Background check results for service providers</li>
                    <li>Public records and databases</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Location Data</p>
                      <p className="text-blue-700 text-sm">
                        We collect location data to help you find nearby garages and provide emergency services. You can
                        disable location sharing in your device settings at any time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span>2. How We Use Your Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-slate-600">
                <p>We use the information we collect for various purposes, including:</p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-900">Service Provision</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Facilitate bookings and appointments</li>
                      <li>Process payments and transactions</li>
                      <li>Provide customer support</li>
                      <li>Send service notifications</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-900">Platform Improvement</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Analyze usage patterns</li>
                      <li>Develop new features</li>
                      <li>Improve user experience</li>
                      <li>Conduct research and analytics</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-900">Communication</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Send promotional materials</li>
                      <li>Provide service updates</li>
                      <li>Respond to inquiries</li>
                      <li>Send security alerts</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-900">Legal Compliance</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Comply with legal obligations</li>
                      <li>Prevent fraud and abuse</li>
                      <li>Enforce our terms of service</li>
                      <li>Protect user safety</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-orange-600" />
                <span>3. Information Sharing and Disclosure</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-slate-600">
                <p>We may share your information in the following circumstances:</p>

                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">With Service Providers</h4>
                    <p className="text-sm">
                      We share necessary information with garages and service providers to facilitate your bookings and
                      service requests.
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">With Third-Party Services</h4>
                    <p className="text-sm">
                      We work with trusted partners for payment processing, analytics, and other essential services.
                      These partners are bound by confidentiality agreements.
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">For Legal Reasons</h4>
                    <p className="text-sm">
                      We may disclose information when required by law, to protect our rights, or to ensure user safety
                      and platform security.
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Business Transfers</h4>
                    <p className="text-sm">
                      In the event of a merger, acquisition, or sale of assets, user information may be transferred as
                      part of the business transaction.
                    </p>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900">We Never Sell Your Data</p>
                      <p className="text-red-700 text-sm">
                        XeCare does not sell, rent, or trade your personal information to third parties for their
                        marketing purposes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-green-600" />
                <span>4. Data Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-slate-600">
                <p>
                  We implement appropriate technical and organizational measures to protect your personal information
                  against unauthorized access, alteration, disclosure, or destruction.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">Technical Safeguards</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-green-700">
                      <li>SSL/TLS encryption for data transmission</li>
                      <li>Encrypted data storage</li>
                      <li>Regular security audits</li>
                      <li>Secure payment processing</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">Organizational Measures</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-green-700">
                      <li>Access controls and authentication</li>
                      <li>Employee training and agreements</li>
                      <li>Incident response procedures</li>
                      <li>Regular backup and recovery testing</li>
                    </ul>
                  </div>
                </div>

                <p className="text-sm">
                  While we strive to protect your personal information, no method of transmission over the internet or
                  electronic storage is 100% secure. We cannot guarantee absolute security.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>5. Your Privacy Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-slate-600">
                <p>You have certain rights regarding your personal information:</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Access</h4>
                        <p className="text-sm">Request access to your personal data</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Correction</h4>
                        <p className="text-sm">Update or correct inaccurate information</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Deletion</h4>
                        <p className="text-sm">Request deletion of your personal data</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Portability</h4>
                        <p className="text-sm">Export your data in a portable format</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Opt-out</h4>
                        <p className="text-sm">Unsubscribe from marketing communications</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Restriction</h4>
                        <p className="text-sm">Limit how we process your information</p>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm">
                  To exercise these rights, please contact us using the information provided below. We will respond to
                  your request within 30 days.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cookies and Tracking */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>6. Cookies and Tracking Technologies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-slate-600">
                <p>
                  We use cookies and similar technologies to enhance your experience, analyze usage, and provide
                  personalized content.
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Essential Cookies</h4>
                    <p className="text-sm">Required for basic platform functionality and security</p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Analytics Cookies</h4>
                    <p className="text-sm">Help us understand how users interact with our platform</p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Marketing Cookies</h4>
                    <p className="text-sm">Used to deliver relevant advertisements and content</p>
                  </div>
                </div>

                <p className="text-sm">
                  You can control cookie preferences through your browser settings. Note that disabling certain cookies
                  may affect platform functionality.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* International Transfers */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>7. International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-slate-600">
                <p>
                  Your information may be transferred to and processed in countries other than your country of
                  residence. We ensure appropriate safeguards are in place to protect your data during international
                  transfers.
                </p>
                <p>
                  We comply with applicable data protection laws and use standard contractual clauses or other approved
                  mechanisms for international data transfers.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Changes to Privacy Policy */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>8. Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-slate-600">
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices or for other
                  operational, legal, or regulatory reasons.
                </p>
                <p>
                  We will notify you of any material changes by posting the new Privacy Policy on this page and updating
                  the "Last updated" date. We encourage you to review this Privacy Policy periodically.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>9. Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-slate-600">
                <p>
                  If you have any questions about this Privacy Policy or our data practices, please contact our Data
                  Protection Officer:
                </p>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-slate-900">Email</p>
                      <p className="text-slate-600">privacy@xecare.vn</p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Phone</p>
                      <p className="text-slate-600">+84 1900 1234</p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Address</p>
                      <p className="text-slate-600">
                        Data Protection Officer
                        <br />
                        XeCare Vietnam
                        <br />
                        Floor 10, ABC Building
                        <br />
                        123 Nguyen Hue St, District 1<br />
                        Ho Chi Minh City, Vietnam
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Response Time</p>
                      <p className="text-slate-600">
                        We aim to respond to all privacy-related
                        <br />
                        inquiries within 30 days
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
