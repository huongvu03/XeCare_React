"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  MapPin,
  Calendar,
  AlertTriangle,
  Wrench,
  Search,
  Star,
  Clock,
  Phone,
  DollarSign,
  Settings,
  Navigation,
  HelpCircle,
  Zap,
  RefreshCw,
} from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

interface UserLocation {
  latitude: number
  longitude: number
}

interface ChatRequest {
  message: string
  userLocation?: UserLocation
}

interface Suggestion {
  id: string
  text: string
  icon: React.ReactNode
  category: "search" | "booking" | "emergency" | "service"
  color: string
}

const initialSuggestions: Suggestion[] = [
  // Tìm kiếm
  {
    id: "1",
    text: "Find nearest garage",
    icon: <MapPin className="h-4 w-4" />,
    category: "search",
    color: "bg-blue-500",
  },
  {
    id: "2",
    text: "Find highest rated garage",
    icon: <Star className="h-4 w-4" />,
    category: "search",
    color: "bg-blue-500",
  },
  { id: "3", text: "Find 24/7 garage", icon: <Clock className="h-4 w-4" />, category: "search", color: "bg-blue-500" },
  {
    id: "4",
    text: "Find motorcycle garage",
    icon: <Search className="h-4 w-4" />,
    category: "search",
    color: "bg-blue-500",
  },
  {
    id: "6",
    text: "Enable location",
    icon: <Navigation className="h-4 w-4" />,
    category: "search",
    color: "bg-blue-500",
  },

  // Đặt lịch
  {
    id: "7",
    text: "Book car service",
    icon: <Calendar className="h-4 w-4" />,
    category: "booking",
    color: "bg-green-500",
  },
  {
    id: "8",
    text: "Check available slots",
    icon: <Calendar className="h-4 w-4" />,
    category: "booking",
    color: "bg-green-500",
  },
  { id: "9", text: "Cancel appointment", icon: <X className="h-4 w-4" />, category: "booking", color: "bg-green-500" },

  // Cứu hộ
  {
    id: "11",
    text: "Emergency rescue",
    icon: <AlertTriangle className="h-4 w-4" />,
    category: "emergency",
    color: "bg-red-500",
  },
  {
    id: "12",
    text: "Car broke down",
    icon: <AlertTriangle className="h-4 w-4" />,
    category: "emergency",
    color: "bg-red-500",
  },

  // Dịch vụ
  {
    id: "15",
    text: "Service price list",
    icon: <DollarSign className="h-4 w-4" />,
    category: "service",
    color: "bg-purple-500",
  },
  {
    id: "17",
    text: "Oil change",
    icon: <Wrench className="h-4 w-4" />,
    category: "service",
    color: "bg-purple-500",
  },
  { id: "18", text: "Brake repair", icon: <Wrench className="h-4 w-4" />, category: "service", color: "bg-purple-500" },
]

const categoryLabels = {
  search: "🔍 Search",
  booking: "📅 Booking",
  emergency: "🚨 Emergency",
  service: "🔧 Services",
}

export function Chatbox() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentSuggestions, setCurrentSuggestions] = useState<Suggestion[]>(initialSuggestions)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [suggestionOffset, setSuggestionOffset] = useState(0)
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null)
  const [locationPermission, setLocationPermission] = useState<"granted" | "denied" | "prompt">("prompt")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Function to shuffle array
  const shuffleArray = (array: Suggestion[]): Suggestion[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Function to get random suggestions
  const getRandomSuggestions = (count: number = 4): Suggestion[] => {
    const shuffled = shuffleArray(initialSuggestions)
    return shuffled.slice(0, count)
  }

  // Function to refresh suggestions
  const refreshSuggestions = () => {
    setCurrentSuggestions(getRandomSuggestions(4))
  }

  // Function to check location permission status
  const checkLocationPermission = async () => {
    if (!navigator.permissions) {
      return "unknown"
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName })
      return permission.state
    } catch (error) {
      // Handle permission check error gracefully
      return "unknown"
    }
  }

  // Function to show permission denied message
  const showPermissionDeniedMessage = () => {
    const deniedMessage: Message = {
      id: Date.now().toString(),
      content: `❌ Location access denied. 

🔧 To enable location access:
1. Click the lock icon (🔒) in your browser's address bar
2. Find "Vị trí" (Location) setting  
3. Change from "Chặn" to "Cho phép" (Block to Allow)
4. Refresh the page and try again

Or you can search by address instead.`,
      sender: "bot",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, deniedMessage])
  }

  // Function to show proactive location request message
  const showLocationRequestMessage = () => {
    const requestMessage: Message = {
      id: Date.now().toString(),
      content: `📍 To find the nearest garage, I need your location permission.

🔧 Please enable location access:
1. Click "Allow" when the browser asks for location permission
2. If no popup appears, click the lock icon (🔒) in your browser's address bar
3. Find "Vị trí" (Location) and set it to "Cho phép" (Allow)
4. Refresh the page and try again

This will help me find the closest garage to you!`,
      sender: "bot",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, requestMessage])
  }

  // Function to request user location
  const requestLocation = async (): Promise<{latitude: number, longitude: number} | null> => {
    if (!navigator.geolocation) {
      const errorMessage = "❌ Geolocation is not supported by this browser. Please use a modern browser or search by address instead."
      const errorChatMessage: Message = {
        id: Date.now().toString(),
        content: errorMessage,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorChatMessage])
      return null
    }

    // Don't check permission status first - let the browser handle it
    // This ensures the permission popup shows up properly
    
    return new Promise((resolve) => {
      try {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            try {
              const location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }
              setUserLocation(location)
              setLocationPermission("granted")
              resolve(location)
            } catch (err) {
              // Handle processing error gracefully
              const errorMessage: Message = {
                id: Date.now().toString(),
                content: "❌ Error processing location data. Please try again.",
                sender: "bot",
                timestamp: new Date(),
              }
              setMessages((prev) => [...prev, errorMessage])
              resolve(null)
            }
          },
        (error) => {
          // Don't use console.error to avoid console errors
          setLocationPermission("denied")
          
          // Handle error safely - error might be null or undefined
          const errorCode = error?.code || -1
          const errorMessage_text = error?.message || "Unknown error"
          
          // Show specific error message based on error type
          let errorMessage = ""
          let helpMessage = ""
          
          switch(errorCode) {
            case 1: // PERMISSION_DENIED
              errorMessage = "❌ Location access denied. "
              helpMessage = `🔧 To enable location access:
1. Look for the location permission popup from your browser (should appear automatically)
2. If no popup appeared, click the location icon (🔒) in your browser's address bar
3. Select "Allow" for location access
4. Refresh the page and try again

Alternatively, you can search by address instead.`
              break
            case 2: // POSITION_UNAVAILABLE
              errorMessage = "❌ Location information is unavailable. "
              helpMessage = `🔧 This might be because:
1. Your device's location services are disabled
2. You're in an area with poor GPS signal
3. Try moving to a different location or search by address instead.`
              break
            case 3: // TIMEOUT
              errorMessage = "❌ Location request timed out. "
              helpMessage = `🔧 Try these solutions:
1. Make sure you're in an area with good GPS signal
2. Check if your device's location services are enabled
3. Try again or search by address instead.`
              break
            default:
              errorMessage = "❌ Unable to get your location. "
              helpMessage = `🔧 Please try:
1. Check your browser's location settings
2. Make sure location services are enabled on your device
3. Try refreshing the page or search by address instead.

Error details: ${errorMessage_text}`
              break
          }
          
          // Add error message to chat
          const errorChatMessage: Message = {
            id: Date.now().toString(),
            content: errorMessage + helpMessage,
            sender: "bot",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, errorChatMessage])
          
          resolve(null)
        },
        {
          enableHighAccuracy: true,
          timeout: 15000, // Increased timeout
          maximumAge: 300000 // 5 minutes
        }
        )
      } catch (err) {
        // Handle API call error gracefully
        const errorMessage: Message = {
          id: Date.now().toString(),
          content: "❌ Unable to request location. Please check if your browser supports geolocation or try refreshing the page.",
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
        resolve(null)
      }
    })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize with random suggestions
  useEffect(() => {
    setCurrentSuggestions(getRandomSuggestions(4))
  }, [])

  const getContextualSuggestions = (lastMessage: string): Suggestion[] => {
    const lowerMessage = lastMessage.toLowerCase()

    if (lowerMessage.includes("garage") || lowerMessage.includes("find") || lowerMessage.includes("search") || lowerMessage.includes("nearest") || lowerMessage.includes("highest") || lowerMessage.includes("rating")) {
      return initialSuggestions.filter((s) => s.category === "search").slice(0, 3)
    }

    if (lowerMessage.includes("book") || lowerMessage.includes("appointment") || lowerMessage.includes("schedule")) {
      return initialSuggestions.filter((s) => s.category === "booking").slice(0, 3)
    }

    if (lowerMessage.includes("emergency") || lowerMessage.includes("rescue") || lowerMessage.includes("breakdown")) {
      return initialSuggestions.filter((s) => s.category === "emergency").slice(0, 3)
    }

    if (lowerMessage.includes("price") || lowerMessage.includes("service") || lowerMessage.includes("repair") || lowerMessage.includes("oil")) {
      return initialSuggestions.filter((s) => s.category === "service").slice(0, 3)
    }

    // Default: random 4 suggestions
    return getRandomSuggestions(4)
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)
    setShowSuggestions(false)

    try {
      // Check if user is asking for nearest garage and location is needed
      const isNearestGarageRequest = content.toLowerCase().includes("nearest") || 
                                    content.toLowerCase().includes("closest") ||
                                    content.toLowerCase().includes("gần nhất") ||
                                    content.toLowerCase().includes("tìm garage gần") ||
                                    content.toLowerCase().includes("find nearest") ||
                                    content.toLowerCase().includes("garage gần nhất")
      
      let requestBody: ChatRequest = { message: content.trim() }
      
      // If requesting nearest garage, automatically request location
      if (isNearestGarageRequest) {
        // Show location request message first
        const locationRequestMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "📍 I need your location to find the nearest garage. A permission popup should appear in your browser - please click 'Allow' to enable location access.",
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, locationRequestMessage])

        // Request location permission
        const location = await requestLocation()
        
        if (location) {
          // Add success message
          const successMessage: Message = {
            id: (Date.now() + 2).toString(),
            content: "✅ Location received! Finding the nearest garage...",
            sender: "bot",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, successMessage])
          
          requestBody = { 
            message: content.trim(),
            userLocation: location
          }
        } else {
          // Add fallback message
          const fallbackMessage: Message = {
            id: (Date.now() + 2).toString(),
            content: "❌ Location access denied. You can search by address instead, or try enabling location permission in your browser settings.",
            sender: "bot",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, fallbackMessage])
          setIsLoading(false)
          setShowSuggestions(true)
          return
        }
      } else if (userLocation && locationPermission === "granted") {
        // Use existing location for other requests
        requestBody = { 
          message: content.trim(),
          userLocation: userLocation
        }
      }

      const response = await fetch("http://localhost:8080/apis/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "Sorry, I cannot respond at the moment. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])

      // Update suggestions based on context
      const newSuggestions = getContextualSuggestions(content)
      setCurrentSuggestions(newSuggestions)
      setShowSuggestions(true)
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, there was an error connecting to the server. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    // Handle special location request suggestion
    if (suggestion.text === "Enable location for better search") {
      handleLocationRequest()
    } else if (suggestion.text === "How to enable location permission") {
      showLocationGuide()
    } else if (suggestion.text === "Force location permission popup") {
      forceLocationRequest()
    } else if (suggestion.text === "Location access denied - how to fix") {
      showPermissionDeniedMessage()
    } else if (suggestion.text === "I need location permission to help you") {
      showLocationRequestMessage()
    } else {
      handleSendMessage(suggestion.text)
    }
  }

  // Function to manually request location
  const handleLocationRequest = async () => {
    setIsLoading(true)
    
    const locationRequestMessage: Message = {
      id: Date.now().toString(),
      content: "📍 Requesting your location... A permission popup should appear in your browser - please click 'Allow' or 'Cho phép' to enable location access.",
      sender: "bot",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, locationRequestMessage])

    const location = await requestLocation()
    
    if (location) {
      const successMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `✅ Location received! You are at coordinates: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}. Now you can find the nearest garage!`,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, successMessage])
    }
    
    setIsLoading(false)
  }

  // Function to force trigger browser permission popup
  const forceLocationRequest = async () => {
    setIsLoading(true)
    
    const forceMessage: Message = {
      id: Date.now().toString(),
      content: "📍 Forcing location permission request... Please look for the browser popup and click 'Allow'!",
      sender: "bot",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, forceMessage])

    // Force a fresh location request
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
          setUserLocation(location)
          setLocationPermission("granted")
          
          const successMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: `✅ Location permission granted! Coordinates: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
            sender: "bot",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, successMessage])
          setIsLoading(false)
        },
        (error) => {
          const errorCode = error?.code || -1
          const errorMessage_text = error?.message || "Unknown error"
          
          let errorContent = ""
          switch(errorCode) {
            case 1: // PERMISSION_DENIED
              errorContent = "❌ Location access denied. Please click 'Allow' in the browser permission popup or check your browser's location settings."
              break
            case 2: // POSITION_UNAVAILABLE
              errorContent = "❌ Location information unavailable. Please check if location services are enabled on your device."
              break
            case 3: // TIMEOUT
              errorContent = "❌ Location request timed out. Please try again in an area with better GPS signal."
              break
            default:
              errorContent = `❌ Location request failed: ${errorMessage_text}. Please check your browser's location settings.`
              break
          }
          
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: errorContent,
            sender: "bot",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, errorMessage])
          setIsLoading(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0 // Force fresh location
        }
      )
    } else {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "❌ Geolocation is not supported by this browser.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      setIsLoading(false)
    }
  }

  // Function to show location permission guide
  const showLocationGuide = () => {
    const guideMessage: Message = {
      id: Date.now().toString(),
      content: `🔧 How to enable location access:

**When you click the location button or ask for "Find nearest garage":**
1. A permission popup should appear automatically in your browser
2. Click "Allow" or "Cho phép" in the popup
3. If successful, you'll see your coordinates

**If no popup appears:**
1. Click the lock icon (🔒) in your browser's address bar
2. Find "Vị trí" (Location) setting
3. Change from "Chặn" to "Cho phép" (Block to Allow)
4. Refresh the page and try again

**For Chrome/Edge:**
- Look for location icon in address bar
- Click and select "Allow"

**For Firefox:**
- Click shield icon in address bar
- Allow location access

After enabling, try the location button (🧭) again!`,
      sender: "bot",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, guideMessage])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputValue)
    }
  }

  const groupedSuggestions = initialSuggestions.reduce(
    (acc, suggestion) => {
      if (!acc[suggestion.category]) {
        acc[suggestion.category] = []
      }
      acc[suggestion.category].push(suggestion)
      return acc
    },
    {} as Record<string, Suggestion[]>,
  )

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300 z-40"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-slate-200 flex flex-col z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">XeCare Assistant</h3>
                <p className="text-xs opacity-90">24/7 Support</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <Bot className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h4 className="font-semibold text-slate-900 mb-2">Welcome to XeCare!</h4>
                <p className="text-sm text-slate-600 mb-6">
                  I can help you find garages, book car services, or call emergency rescue.
                </p>

                       {/* Initial Suggestions */}
                       {showSuggestions && (
                         <div className="space-y-3">
                           <div className="flex items-center justify-between">
                             <h5 className="text-sm font-medium text-slate-700">Suggestions for you:</h5>
                             <button
                               onClick={refreshSuggestions}
                               className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1 transition-colors"
                               title="Get new suggestions"
                             >
                               <RefreshCw className="h-3 w-3" />
                               <span>Refresh</span>
                             </button>
                           </div>
                           <div className="grid grid-cols-1 gap-2">
                             {currentSuggestions.slice(0, 4).map((suggestion) => (
                               <button
                                 key={suggestion.id}
                                 onClick={() => handleSuggestionClick(suggestion)}
                                 className="flex items-center space-x-2 p-2 text-left text-sm bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                               >
                                 <div className={`p-1 rounded ${suggestion.color} text-white`}>{suggestion.icon}</div>
                                 <span className="text-slate-700">{suggestion.text}</span>
                               </button>
                             ))}
                           </div>
                         </div>
                       )}
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                          : "bg-slate-100 text-slate-900"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.sender === "bot" && <Bot className="h-4 w-4 mt-0.5 text-blue-600" />}
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-slate-500"}`}
                          >
                            {message.timestamp.toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        {message.sender === "user" && <User className="h-4 w-4 mt-0.5 text-blue-100" />}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4 text-blue-600" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                       {/* Contextual Suggestions */}
                       {showSuggestions && messages.length > 0 && !isLoading && (
                         <div className="border-t pt-4">
                           <div className="flex items-center justify-between mb-2">
                             <p className="text-xs text-slate-500">Suggestions for you:</p>
                             <button
                               onClick={refreshSuggestions}
                               className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1 transition-colors"
                               title="Get new suggestions"
                             >
                               <RefreshCw className="h-3 w-3" />
                               <span>Refresh</span>
                             </button>
                           </div>
                           <div className="space-y-2">
                             {currentSuggestions.slice(0, 4).map((suggestion) => (
                               <button
                                 key={suggestion.id}
                                 onClick={() => handleSuggestionClick(suggestion)}
                                 className="flex items-center space-x-2 p-2 text-left text-sm bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors w-full"
                               >
                                 <div className={`p-1 rounded ${suggestion.color} text-white`}>{suggestion.icon}</div>
                                 <span className="text-slate-700">{suggestion.text}</span>
                               </button>
                             ))}
                           </div>
                         </div>
                       )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1"
              />
              {/* <Button
                onClick={showLocationGuide}
                disabled={isLoading}
                size="icon"
                variant="outline"
                className="border-orange-300 text-orange-600 hover:bg-orange-50"
                title="Location permission help"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
              <Button
                onClick={forceLocationRequest}
                disabled={isLoading}
                size="icon"
                variant="outline"
                className="border-yellow-300 text-yellow-600 hover:bg-yellow-50"
                title="Force location permission popup"
              >
                <Zap className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleLocationRequest}
                disabled={isLoading}
                size="icon"
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
                title="Request location"
              >
                <Navigation className="h-4 w-4" />
              </Button> */}
              <Button
                onClick={() => handleSendMessage(inputValue)}
                disabled={isLoading || !inputValue.trim()}
                size="icon"
                className="bg-gradient-to-r from-blue-600 to-cyan-600"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
