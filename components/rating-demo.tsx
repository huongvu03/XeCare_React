"use client"

import React, { useState } from "react"
import { Chatbox } from "./chatbox"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Search } from "lucide-react"

export function RatingDemo() {
  const [showDemo, setShowDemo] = useState(false)

  const testMessages = [
    "Find highest rated garage",
    "Find nearest garage", 
    "Show garage ratings",
    "Find motorcycle garage",
    "Book car service"
  ]

  const handleTestMessage = async (message: string) => {
    try {
      const response = await fetch("http://localhost:8080/apis/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      })
      
      const data = await response.json()
      console.log(`Test message: "${message}"`)
      console.log(`Response:`, data)
    } catch (error) {
      console.error("Test error:", error)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center mb-4">XeCare Rating System Demo</h1>
        <p className="text-center text-gray-600 mb-6">
          Test the integrated rating system in the chatbox
        </p>
      </div>

      {/* Test Messages */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Rating Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {testMessages.map((message, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => handleTestMessage(message)}
              className="text-left justify-start h-auto p-3"
            >
              <div className="flex items-center space-x-2">
                {message.includes("rating") ? (
                  <Star className="h-4 w-4 text-yellow-500" />
                ) : message.includes("nearest") ? (
                  <MapPin className="h-4 w-4 text-blue-500" />
                ) : (
                  <Search className="h-4 w-4 text-green-500" />
                )}
                <span>{message}</span>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Chatbox Toggle */}
      <div className="text-center mb-6">
        <Button
          onClick={() => setShowDemo(!showDemo)}
          className="bg-gradient-to-r from-blue-600 to-cyan-600"
        >
          {showDemo ? "Hide" : "Show"} Chatbox Demo
        </Button>
      </div>

      {/* Chatbox */}
      {showDemo && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Interactive Chatbox</h3>
          <div className="bg-white rounded-lg p-4 min-h-[400px]">
            <Chatbox />
          </div>
        </div>
      )}

      {/* Features List */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">✨ New Rating Features</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Find highest rated garage</li>
            <li>• Show garage ratings</li>
            <li>• Distance-based recommendations</li>
            <li>• Rating display in responses</li>
          </ul>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">🌍 English Interface</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• All suggestions in English</li>
            <li>• Contextual recommendations</li>
            <li>• Smart category filtering</li>
            <li>• Enhanced user experience</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
