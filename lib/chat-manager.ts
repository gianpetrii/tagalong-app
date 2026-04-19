import { 
  ref, 
  push, 
  onValue, 
  off,
  serverTimestamp,
  query,
  orderByChild,
  limitToLast,
  get,
  set,
  update
} from "firebase/database"
import { realtimeDb } from "./firebase"
import { User } from "./types"

export interface ChatMessage {
  id: string
  tripId: string
  userId: string
  userInfo: {
    name: string
    avatar: string | null
    isDriver: boolean
  }
  message: string
  timestamp: number
  type: "text" | "location" | "system" | "image"
  
  // Para mensajes de ubicación
  location?: {
    latitude: number
    longitude: number
    address?: string
  }
  
  // Para mensajes del sistema
  systemType?: "user_joined" | "user_left" | "trip_started" | "trip_completed" | "booking_confirmed"
  
  // Para imágenes
  imageUrl?: string
  
  // Estado del mensaje
  read?: boolean
  edited?: boolean
  editedAt?: number
}

export interface ChatParticipant {
  userId: string
  userInfo: {
    name: string
    avatar: string | null
    isDriver: boolean
    isOnline: boolean
  }
  joinedAt: number
  lastSeen: number
  isTyping: boolean
}

export interface TripChat {
  tripId: string
  participants: Record<string, ChatParticipant>
  lastMessage?: {
    message: string
    timestamp: number
    userId: string
    userName: string
  }
  messageCount: number
  createdAt: number
}

/**
 * Servicio para gestionar chats grupales de viajes
 */
export class ChatManager {
  
  /**
   * Inicializa un chat para un viaje
   */
  static async initializeTripChat(
    tripId: string,
    driverId: string,
    driverInfo: { name: string; avatar: string | null }
  ): Promise<void> {
    try {
      const chatRef = ref(realtimeDb, `chats/${tripId}`)
      const chatData: TripChat = {
        tripId,
        participants: {
          [driverId]: {
            userId: driverId,
            userInfo: {
              name: driverInfo.name,
              avatar: driverInfo.avatar,
              isDriver: true,
              isOnline: true
            },
            joinedAt: Date.now(),
            lastSeen: Date.now(),
            isTyping: false
          }
        },
        messageCount: 0,
        createdAt: Date.now()
      }

      await set(chatRef, chatData)

      // Mensaje de bienvenida del sistema
      await this.sendSystemMessage(
        tripId,
        "system",
        "Chat del viaje iniciado. Aquí podrás comunicarte con todos los pasajeros.",
        "trip_started"
      )
    } catch (error) {
      console.error("Error inicializando chat del viaje:", error)
      throw error
    }
  }

  /**
   * Agrega un participante al chat
   */
  static async addParticipant(
    tripId: string,
    userId: string,
    userInfo: { name: string; avatar: string | null }
  ): Promise<void> {
    try {
      const participantRef = ref(realtimeDb, `chats/${tripId}/participants/${userId}`)
      const participantData: ChatParticipant = {
        userId,
        userInfo: {
          name: userInfo.name,
          avatar: userInfo.avatar,
          isDriver: false,
          isOnline: true
        },
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        isTyping: false
      }

      await set(participantRef, participantData)

      // Mensaje del sistema
      await this.sendSystemMessage(
        tripId,
        userId,
        `${userInfo.name} se unió al chat del viaje`,
        "user_joined"
      )
    } catch (error) {
      console.error("Error agregando participante al chat:", error)
      throw error
    }
  }

  /**
   * Envía un mensaje de texto
   */
  static async sendMessage(
    tripId: string,
    userId: string,
    userInfo: { name: string; avatar: string | null; isDriver: boolean },
    message: string
  ): Promise<string> {
    try {
      const messagesRef = ref(realtimeDb, `messages/${tripId}`)
      const messageData: Omit<ChatMessage, "id"> = {
        tripId,
        userId,
        userInfo,
        message: message.trim(),
        timestamp: Date.now(),
        type: "text",
        read: false
      }

      const newMessageRef = await push(messagesRef, messageData)
      
      // Actualizar el último mensaje en el chat
      await this.updateLastMessage(tripId, message, userId, userInfo.name)
      
      return newMessageRef.key!
    } catch (error) {
      console.error("Error enviando mensaje:", error)
      throw error
    }
  }

  /**
   * Envía la ubicación actual
   */
  static async sendLocation(
    tripId: string,
    userId: string,
    userInfo: { name: string; avatar: string | null; isDriver: boolean },
    latitude: number,
    longitude: number,
    address?: string
  ): Promise<string> {
    try {
      const messagesRef = ref(realtimeDb, `messages/${tripId}`)
      const messageData: Omit<ChatMessage, "id"> = {
        tripId,
        userId,
        userInfo,
        message: address || "Ubicación compartida",
        timestamp: Date.now(),
        type: "location",
        location: {
          latitude,
          longitude,
          address
        },
        read: false
      }

      const newMessageRef = await push(messagesRef, messageData)
      
      // Actualizar el último mensaje en el chat
      await this.updateLastMessage(tripId, "📍 Ubicación compartida", userId, userInfo.name)
      
      return newMessageRef.key!
    } catch (error) {
      console.error("Error enviando ubicación:", error)
      throw error
    }
  }

  /**
   * Envía un mensaje del sistema
   */
  static async sendSystemMessage(
    tripId: string,
    userId: string,
    message: string,
    systemType: ChatMessage["systemType"]
  ): Promise<string> {
    try {
      const messagesRef = ref(realtimeDb, `messages/${tripId}`)
      const messageData: Omit<ChatMessage, "id"> = {
        tripId,
        userId,
        userInfo: {
          name: "Sistema",
          avatar: null,
          isDriver: false
        },
        message,
        timestamp: Date.now(),
        type: "system",
        systemType,
        read: false
      }

      const newMessageRef = await push(messagesRef, messageData)
      
      // No actualizar último mensaje para mensajes del sistema
      return newMessageRef.key!
    } catch (error) {
      console.error("Error enviando mensaje del sistema:", error)
      throw error
    }
  }

  /**
   * Actualiza el último mensaje del chat
   */
  private static async updateLastMessage(
    tripId: string,
    message: string,
    userId: string,
    userName: string
  ): Promise<void> {
    try {
      const chatRef = ref(realtimeDb, `chats/${tripId}`)
      await update(chatRef, {
        lastMessage: {
          message,
          timestamp: Date.now(),
          userId,
          userName
        },
        messageCount: serverTimestamp()
      })
    } catch (error) {
      console.error("Error actualizando último mensaje:", error)
    }
  }

  /**
   * Escucha mensajes en tiempo real
   */
  static listenToMessages(
    tripId: string,
    callback: (messages: ChatMessage[]) => void,
    limit: number = 50
  ): () => void {
    const messagesRef = query(
      ref(realtimeDb, `messages/${tripId}`),
      orderByChild("timestamp"),
      limitToLast(limit)
    )

    const listener = onValue(messagesRef, (snapshot) => {
      const messages: ChatMessage[] = []
      snapshot.forEach((childSnapshot) => {
        const message = {
          id: childSnapshot.key!,
          ...childSnapshot.val()
        } as ChatMessage
        messages.push(message)
      })
      
      // Ordenar por timestamp (más recientes al final)
      messages.sort((a, b) => a.timestamp - b.timestamp)
      callback(messages)
    })

    // Retornar función para cleanup
    return () => off(messagesRef, "value", listener)
  }

  /**
   * Escucha participantes en tiempo real
   */
  static listenToParticipants(
    tripId: string,
    callback: (participants: Record<string, ChatParticipant>) => void
  ): () => void {
    const participantsRef = ref(realtimeDb, `chats/${tripId}/participants`)

    const listener = onValue(participantsRef, (snapshot) => {
      const participants = snapshot.val() || {}
      callback(participants)
    })

    // Retornar función para cleanup
    return () => off(participantsRef, "value", listener)
  }

  /**
   * Actualiza el estado de "escribiendo"
   */
  static async setTypingStatus(
    tripId: string,
    userId: string,
    isTyping: boolean
  ): Promise<void> {
    try {
      const typingRef = ref(realtimeDb, `chats/${tripId}/participants/${userId}/isTyping`)
      await set(typingRef, isTyping)
    } catch (error) {
      console.error("Error actualizando estado de escritura:", error)
    }
  }

  /**
   * Actualiza el estado online del usuario
   */
  static async setOnlineStatus(
    tripId: string,
    userId: string,
    isOnline: boolean
  ): Promise<void> {
    try {
      const updates: Record<string, any> = {
        [`chats/${tripId}/participants/${userId}/isOnline`]: isOnline,
        [`chats/${tripId}/participants/${userId}/lastSeen`]: Date.now()
      }
      
      await update(ref(realtimeDb), updates)
    } catch (error) {
      console.error("Error actualizando estado online:", error)
    }
  }

  /**
   * Obtiene el chat de un viaje
   */
  static async getTripChat(tripId: string): Promise<TripChat | null> {
    try {
      const chatRef = ref(realtimeDb, `chats/${tripId}`)
      const snapshot = await get(chatRef)
      
      if (snapshot.exists()) {
        return snapshot.val() as TripChat
      }
      
      return null
    } catch (error) {
      console.error("Error obteniendo chat del viaje:", error)
      return null
    }
  }

  /**
   * Marca mensajes como leídos
   */
  static async markMessagesAsRead(
    tripId: string,
    userId: string,
    messageIds: string[]
  ): Promise<void> {
    try {
      const updates: Record<string, any> = {}
      
      messageIds.forEach(messageId => {
        updates[`messages/${tripId}/${messageId}/read`] = true
      })
      
      await update(ref(realtimeDb), updates)
    } catch (error) {
      console.error("Error marcando mensajes como leídos:", error)
    }
  }
}

/**
 * Hook para usar en componentes React
 */
export function useChatManager() {
  const sendMessage = async (
    tripId: string,
    userId: string,
    userInfo: { name: string; avatar: string | null; isDriver: boolean },
    message: string
  ) => {
    return await ChatManager.sendMessage(tripId, userId, userInfo, message)
  }

  const sendLocation = async (
    tripId: string,
    userId: string,
    userInfo: { name: string; avatar: string | null; isDriver: boolean },
    latitude: number,
    longitude: number,
    address?: string
  ) => {
    return await ChatManager.sendLocation(tripId, userId, userInfo, latitude, longitude, address)
  }

  const setTypingStatus = async (tripId: string, userId: string, isTyping: boolean) => {
    return await ChatManager.setTypingStatus(tripId, userId, isTyping)
  }

  const setOnlineStatus = async (tripId: string, userId: string, isOnline: boolean) => {
    return await ChatManager.setOnlineStatus(tripId, userId, isOnline)
  }

  return {
    sendMessage,
    sendLocation,
    setTypingStatus,
    setOnlineStatus,
    addParticipant: ChatManager.addParticipant,
    listenToMessages: ChatManager.listenToMessages,
    listenToParticipants: ChatManager.listenToParticipants,
    markMessagesAsRead: ChatManager.markMessagesAsRead,
    getTripChat: ChatManager.getTripChat
  }
} 