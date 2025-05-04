"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User as AuthUser } from "firebase/auth"
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from "firebase/auth"
import { auth } from "@/lib/firebase"
import type { User } from "@/lib/types"

interface AuthContextType {
  user: User | null
  firebaseUser: AuthUser | null
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setIsLoading(true)
      try {
        if (authUser) {
          setFirebaseUser(authUser)
          
          // En una implementación real, aquí buscaríamos datos adicionales del usuario desde Firestore
          // Por ahora creamos un objeto de usuario con los datos disponibles de Firebase Auth
          const userProfile: User = {
            id: authUser.uid,
            name: authUser.displayName || 'Usuario',
            email: authUser.email || '',
            avatar: authUser.photoURL || "/placeholder.svg?height=128&width=128",
            rating: 0,
            reviewCount: 0,
            memberSince: new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }),
            bio: '',
            isVerified: true,
            emailVerified: authUser.emailVerified,
            phoneVerified: false,
            isOnline: true,
            badges: [],
          }
          
          setUser(userProfile)
        } else {
          setFirebaseUser(null)
          setUser(null)
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
      } finally {
        setIsLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    setIsLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error("Google login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      // En una implementación completa, aquí también crearíamos un perfil de usuario en Firestore
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      console.error("Password reset error:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        firebaseUser, 
        login, 
        loginWithGoogle, 
        logout, 
        register, 
        resetPassword, 
        isLoading 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
