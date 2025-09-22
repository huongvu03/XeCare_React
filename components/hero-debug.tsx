"use client"

import { Button } from "@/components/ui/button"
import { Search, MapPin, Phone } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function HeroDebug() {
  const router = useRouter()
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`])
  }

  const handleLinkClick = (path: string) => {
    addDebugInfo(`Link clicked: ${path}`)
    console.log(`🔗 Link clicked: ${path}`)
  }

  const handleRouterPush = (path: string) => {
    addDebugInfo(`Router.push: ${path}`)
    console.log(`🚀 Router.push: ${path}`)
    router.push(path)
  }

  const handleWindowLocation = (path: string) => {
    addDebugInfo(`Window.location: ${path}`)
    console.log(`🌐 Window.location: ${path}`)
    window.location.href = path
  }

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 py-8 md:py-16 lg:py-20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-8">
            Hero Component Debug
          </h1>

          {/* Debug Info */}
          <div className="bg-white rounded-lg p-4 mb-8 border">
            <h3 className="font-semibold mb-2">Debug Info:</h3>
            <div className="text-sm space-y-1 max-h-32 overflow-y-auto">
              {debugInfo.map((info, index) => (
                <div key={index} className="text-gray-600">{info}</div>
              ))}
            </div>
            <button 
              onClick={() => setDebugInfo([])}
              className="mt-2 text-xs text-blue-600 hover:text-blue-800"
            >
              Clear Debug Info
            </button>
          </div>

          {/* Test Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Test 1: Next.js Link */}
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="font-semibold mb-4">Test 1: Next.js Link</h3>
              <div className="space-y-3">
                <Button asChild>
                  <Link 
                    href="/search" 
                    onClick={() => handleLinkClick('/search')}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Search (Link)
                  </Link>
                </Button>
                
                <Button asChild>
                  <Link 
                    href="/emergency" 
                    onClick={() => handleLinkClick('/emergency')}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Emergency (Link)
                  </Link>
                </Button>
              </div>
            </div>

            {/* Test 2: useRouter */}
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="font-semibold mb-4">Test 2: useRouter</h3>
              <div className="space-y-3">
                <Button onClick={() => handleRouterPush('/search')}>
                  <MapPin className="mr-2 h-4 w-4" />
                  Search (Router)
                </Button>
                
                <Button onClick={() => handleRouterPush('/emergency')}>
                  <Phone className="mr-2 h-4 w-4" />
                  Emergency (Router)
                </Button>
              </div>
            </div>

            {/* Test 3: Window.location */}
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="font-semibold mb-4">Test 3: Window.location</h3>
              <div className="space-y-3">
                <Button onClick={() => handleWindowLocation('/search')}>
                  <MapPin className="mr-2 h-4 w-4" />
                  Search (Window)
                </Button>
                
                <Button onClick={() => handleWindowLocation('/emergency')}>
                  <Phone className="mr-2 h-4 w-4" />
                  Emergency (Window)
                </Button>
              </div>
            </div>

            {/* Test 4: Direct Navigation */}
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="font-semibold mb-4">Test 4: Direct Navigation</h3>
              <div className="space-y-3">
                <a 
                  href="/search" 
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  onClick={() => handleLinkClick('/search (direct)')}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Search (Direct)
                </a>
                
                <a 
                  href="/emergency" 
                  className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 ml-2"
                  onClick={() => handleLinkClick('/emergency (direct)')}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Emergency (Direct)
                </a>
              </div>
            </div>
          </div>

          {/* Current Path Info */}
          <div className="mt-8 bg-gray-100 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Current Path Info:</h3>
            <div className="text-sm space-y-1">
              <div><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</div>
              <div><strong>Current Pathname:</strong> {typeof window !== 'undefined' ? window.location.pathname : 'N/A'}</div>
              <div><strong>User Agent:</strong> {typeof window !== 'undefined' ? window.navigator.userAgent.substring(0, 50) + '...' : 'N/A'}</div>
            </div>
          </div>

          {/* Console Instructions */}
          <div className="mt-8 bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Debug Instructions:</h3>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>Open Browser Developer Tools (F12)</li>
              <li>Go to Console tab</li>
              <li>Click on the buttons above</li>
              <li>Check console logs for debug information</li>
              <li>Check Network tab for any failed requests</li>
              <li>Check if navigation actually happens</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
