"use client"

import { useState, useEffect, useRef } from "react"
import { Send, MapPin, Users, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/auth-context"
import { useChatManager, ChatMessage, ChatParticipant } from "@/lib/chat-manager"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface TripChatProps {
  tripId: string
  isDriver: boolean
  className?: string
}

export default function TripChat({ tripId, isDriver, className }: TripChatProps) {
  const { user } = useAuth()
  const { 
    sendMessage, 
    sendLocation, 
    setTypingStatus, 
    setOnlineStatus,
    listenToMessages,
    listenToParticipants,
    markMessagesAsRead
  } = useChatManager()

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [participants, setParticipants] = useState<Record<string, ChatParticipant>>({})
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Set user as online when component mounts
  useEffect(() => {
    if (user) {
      setOnlineStatus(tripId, user.id, true)
      
      // Set offline when component unmounts
      return () => {
        setOnlineStatus(tripId, user.id, false)
      }
    }
  }, [user, tripId, setOnlineStatus])

  // Listen to messages
  useEffect(() => {
    const unsubscribe = listenToMessages(tripId, (newMessages) => {
      setMessages(newMessages)
      
      // Mark messages as read (except own messages)
      if (user) {
        const unreadMessages = newMessages
          .filter(msg => msg.userId !== user.id && !msg.read)
          .map(msg => msg.id)
        
        if (unreadMessages.length > 0) {
          markMessagesAsRead(tripId, user.id, unreadMessages)
        }
      }
    })

    return unsubscribe
  }, [tripId, user, listenToMessages, markMessagesAsRead])

  // Listen to participants
  useEffect(() => {
    const unsubscribe = listenToParticipants(tripId, (newParticipants) => {
      setParticipants(newParticipants)
      
      // Update typing users
      const typing = Object.values(newParticipants)
        .filter(p => p.isTyping && p.userId !== user?.id)
        .map(p => p.userInfo.name)
      
      setTypingUsers(typing)
    })

    return unsubscribe
  }, [tripId, user, listenToParticipants])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return

    setIsLoading(true)
    try {
      await sendMessage(
        tripId,
        user.id,
        {
          name: user.name,
          avatar: user.avatar,
          isDriver
        },
        newMessage
      )
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendLocation = async () => {
    if (!user) return

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            await sendLocation(
              tripId,
              user.id,
              {
                name: user.name,
                avatar: user.avatar,
                isDriver
              },
              position.coords.latitude,
              position.coords.longitude
            )
          } catch (error) {
            console.error("Error sending location:", error)
          }
        },
        (error) => {
          console.error("Error getting location:", error)
        }
      )
    }
  }

  const handleTyping = () => {
    if (!user) return

    setTypingStatus(tripId, user.id, true)

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set typing to false after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setTypingStatus(tripId, user.id, false)
    }, 3000)
  }

  const renderMessage = (message: ChatMessage) => {
    const isOwnMessage = message.userId === user?.id
    const timestamp = formatDistanceToNow(new Date(message.timestamp), { 
      addSuffix: true, 
      locale: es 
    })

    if (message.type === "system") {
      return (
        <div key={message.id} className="flex justify-center my-2">
          <Badge variant="secondary" className="text-xs">
            {message.message}
          </Badge>
        </div>
      )
    }

    return (
      <div
        key={message.id}
        className={`flex mb-4 ${isOwnMessage ? "justify-end" : "justify-start"}`}
      >
        <div className={`flex max-w-[70%] ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}>
          <Avatar className="w-8 h-8">
            <AvatarImage src={message.userInfo.avatar || ""} />
            <AvatarFallback>
              {message.userInfo.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className={`mx-2 ${isOwnMessage ? "text-right" : "text-left"}`}>
            <div className="flex items-center mb-1">
              <span className="text-xs font-medium">
                {message.userInfo.name}
                {message.userInfo.isDriver && (
                  <Badge variant="outline" className="ml-1 text-xs">Conductor</Badge>
                )}
              </span>
            </div>
            
            <div
              className={`rounded-lg px-3 py-2 ${
                isOwnMessage
                  ? "bg-emerald-600 text-white"
                  : "bg-muted text-foreground"
              }`}
            >
              {message.type === "location" ? (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{message.message}</span>
                </div>
              ) : (
                <p className="text-sm">{message.message}</p>
              )}
            </div>
            
            <span className="text-xs text-muted-foreground mt-1 block">
              {timestamp}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Chat del viaje</CardTitle>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span className="text-sm text-muted-foreground">
              {Object.keys(participants).length} participantes
            </span>
          </div>
        </div>
        
        {/* Participants list */}
        <div className="flex flex-wrap gap-2 mt-2">
          {Object.values(participants).map((participant) => (
            <div key={participant.userId} className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${
                participant.userInfo.isOnline ? "bg-green-500" : "bg-gray-300"
              }`} />
              <span className="text-xs">
                {participant.userInfo.name}
                {participant.userInfo.isDriver && " (Conductor)"}
              </span>
            </div>
          ))}
        </div>
      </CardHeader>
      
      <Separator />
      
      <CardContent className="p-0">
        {/* Messages area */}
        <ScrollArea className="h-96 p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-muted-foreground mb-2">
                <Users className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">No hay mensajes aún</p>
                <p className="text-xs">Sé el primero en enviar un mensaje</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map(renderMessage)}
              
              {/* Typing indicator */}
              {typingUsers.length > 0 && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="flex space-x-1 mr-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span>
                    {typingUsers.length === 1 
                      ? `${typingUsers[0]} está escribiendo...`
                      : `${typingUsers.length} personas están escribiendo...`
                    }
                  </span>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>
        
        <Separator />
        
        {/* Input area */}
        <div className="p-4">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value)
                handleTyping()
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage()
                }
              }}
              placeholder="Escribe un mensaje..."
              disabled={!user}
              className="flex-1"
            />
            <Button
              size="icon"
              variant="outline"
              onClick={handleSendLocation}
              disabled={!user}
              title="Compartir ubicación"
            >
              <MapPin className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isLoading || !user}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 