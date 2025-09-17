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
} from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
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
    text: "Tìm garage gần nhất",
    icon: <MapPin className="h-4 w-4" />,
    category: "search",
    color: "bg-blue-500",
  },
  {
    id: "2",
    text: "Garage có rating cao nhất",
    icon: <Star className="h-4 w-4" />,
    category: "search",
    color: "bg-blue-500",
  },
  { id: "3", text: "Garage mở 24/7", icon: <Clock className="h-4 w-4" />, category: "search", color: "bg-blue-500" },
  {
    id: "4",
    text: "Garage sửa xe máy",
    icon: <Search className="h-4 w-4" />,
    category: "search",
    color: "bg-blue-500",
  },

  // Đặt lịch
  {
    id: "5",
    text: "Đặt lịch sửa xe",
    icon: <Calendar className="h-4 w-4" />,
    category: "booking",
    color: "bg-green-500",
  },
  {
    id: "6",
    text: "Kiểm tra lịch trống",
    icon: <Calendar className="h-4 w-4" />,
    category: "booking",
    color: "bg-green-500",
  },
  { id: "7", text: "Hủy lịch hẹn", icon: <X className="h-4 w-4" />, category: "booking", color: "bg-green-500" },
  { id: "8", text: "Đổi lịch hẹn", icon: <Settings className="h-4 w-4" />, category: "booking", color: "bg-green-500" },

  // Cứu hộ
  {
    id: "9",
    text: "Cứu hộ khẩn cấp",
    icon: <AlertTriangle className="h-4 w-4" />,
    category: "emergency",
    color: "bg-red-500",
  },
  {
    id: "10",
    text: "Xe bị hỏng trên đường",
    icon: <AlertTriangle className="h-4 w-4" />,
    category: "emergency",
    color: "bg-red-500",
  },
  {
    id: "11",
    text: "Gọi cứu hộ gần nhất",
    icon: <Phone className="h-4 w-4" />,
    category: "emergency",
    color: "bg-red-500",
  },
  {
    id: "12",
    text: "Báo giá cứu hộ",
    icon: <DollarSign className="h-4 w-4" />,
    category: "emergency",
    color: "bg-red-500",
  },

  // Dịch vụ
  {
    id: "13",
    text: "Bảng giá dịch vụ",
    icon: <DollarSign className="h-4 w-4" />,
    category: "service",
    color: "bg-purple-500",
  },
  {
    id: "14",
    text: "Thời gian sửa chữa",
    icon: <Clock className="h-4 w-4" />,
    category: "service",
    color: "bg-purple-500",
  },
  {
    id: "15",
    text: "Dịch vụ thay dầu",
    icon: <Wrench className="h-4 w-4" />,
    category: "service",
    color: "bg-purple-500",
  },
  { id: "16", text: "Sửa phanh xe", icon: <Wrench className="h-4 w-4" />, category: "service", color: "bg-purple-500" },
]

const categoryLabels = {
  search: "🔍 Tìm kiếm",
  booking: "📅 Đặt lịch",
  emergency: "🚨 Cứu hộ",
  service: "🔧 Dịch vụ",
}

export function Chatbox() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentSuggestions, setCurrentSuggestions] = useState<Suggestion[]>(initialSuggestions)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getContextualSuggestions = (lastMessage: string): Suggestion[] => {
    const lowerMessage = lastMessage.toLowerCase()

    if (lowerMessage.includes("garage") || lowerMessage.includes("tìm")) {
      return initialSuggestions.filter((s) => s.category === "search").slice(0, 3)
    }

    if (lowerMessage.includes("lịch") || lowerMessage.includes("đặt")) {
      return initialSuggestions.filter((s) => s.category === "booking").slice(0, 3)
    }

    if (lowerMessage.includes("cứu hộ") || lowerMessage.includes("khẩn cấp")) {
      return initialSuggestions.filter((s) => s.category === "emergency").slice(0, 3)
    }

    if (lowerMessage.includes("giá") || lowerMessage.includes("dịch vụ")) {
      return initialSuggestions.filter((s) => s.category === "service").slice(0, 3)
    }

    // Default: mix of popular suggestions
    return [
      initialSuggestions[0], // Tìm garage gần nhất
      initialSuggestions[4], // Đặt lịch sửa xe
      initialSuggestions[8], // Cứu hộ khẩn cấp
    ]
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
      const response = await fetch("http://localhost:8080/apis/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content.trim() }),
      })

      const data = await response.json()

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "Xin lỗi, tôi không thể trả lời lúc này. Vui lòng thử lại sau.",
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
        content: "Xin lỗi, có lỗi xảy ra khi kết nối với server. Vui lòng thử lại sau.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    handleSendMessage(suggestion.text)
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
                <p className="text-xs opacity-90">Hỗ trợ 24/7</p>
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
                <h4 className="font-semibold text-slate-900 mb-2">Chào mừng đến với XeCare!</h4>
                <p className="text-sm text-slate-600 mb-6">
                  Tôi có thể giúp bạn tìm garage, đặt lịch sửa xe, hoặc gọi cứu hộ khẩn cấp.
                </p>

                {/* Initial Suggestions by Category */}
                {showSuggestions && (
                  <div className="space-y-4">
                    {Object.entries(groupedSuggestions).map(([category, suggestions]) => (
                      <div key={category} className="text-left">
                        <h5 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                          {categoryLabels[category as keyof typeof categoryLabels]}
                        </h5>
                        <div className="grid grid-cols-1 gap-2">
                          {suggestions.slice(0, 2).map((suggestion) => (
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
                    ))}
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
                    <p className="text-xs text-slate-500 mb-2">Gợi ý cho bạn:</p>
                    <div className="space-y-2">
                      {currentSuggestions.map((suggestion) => (
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
                placeholder="Nhập tin nhắn..."
                disabled={isLoading}
                className="flex-1"
              />
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
