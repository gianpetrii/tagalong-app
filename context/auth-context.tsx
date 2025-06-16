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
import { auth, db, configureAuthPersistence } from "@/lib/firebase"
import type { User } from "@/lib/types"
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp
} from "firebase/firestore"

interface AuthContextType {
  user: User | null
  firebaseUser: AuthUser | null
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  loginWithGoogle: (rememberMe?: boolean) => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  isLoading: boolean
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  updateUserProfile: (userData: Partial<User>) => Promise<void>
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
          
          // Get user from Firestore or create a new one
          const userDocRef = doc(db, "users", authUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          let userProfile: User;
          
          if (userDoc.exists()) {
            // User exists in Firestore
            userProfile = {
              id: authUser.uid,
              ...userDoc.data()
            } as User;
            
            // Update last login time
            await updateDoc(userDocRef, {
              lastLogin: serverTimestamp(),
              isOnline: true
            });
          } else {
            // Create new user in Firestore
            userProfile = {
              id: authUser.uid,
              name: authUser.displayName || 'Usuario',
              email: authUser.email || '',
              avatar: authUser.photoURL || null,
              rating: 0,
              reviewCount: 0,
              memberSince: new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }),
              bio: '',
              isVerified: true,
              emailVerified: authUser.emailVerified,
              phoneVerified: false,
              isOnline: true,
              badges: [],
              carInfo: {
                brand: '',
                model: '',
                plate: '',
                isActive: false
              },
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp()
            };
            
            await setDoc(userDocRef, userProfile);
          }
          
          setUser(userProfile);
        } else {
          setFirebaseUser(null)
          setUser(null)
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        setFirebaseUser(null)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    setIsLoading(true)
    try {
      // Configure persistence based on "remember me" checkbox
      await configureAuthPersistence(rememberMe)
      
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async (rememberMe: boolean = false) => {
    setIsLoading(true)
    try {
      // Configure persistence based on "remember me" checkbox
      await configureAuthPersistence(rememberMe)
      
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
      // Set session persistence for registration (user can choose later)
      await configureAuthPersistence(false)
      
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const authUser = userCredential.user;
      
      // Create user profile in Firestore
      const userProfile: User = {
        id: authUser.uid,
        name: name,
        email: email,
        avatar: null,
        rating: 0,
        reviewCount: 0,
        memberSince: new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }),
        bio: '',
        isVerified: false,
        emailVerified: false,
        phoneVerified: false,
        isOnline: true,
        badges: [],
        carInfo: {
          brand: '',
          model: '',
          plate: '',
          isActive: false
        },
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      };
      
      await setDoc(doc(db, "users", authUser.uid), userProfile);
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
    setIsLoading(true)
    try {
      // Update user status to offline if user exists
      if (user && firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          await updateDoc(userDocRef, {
            isOnline: false,
            lastLogout: serverTimestamp()
          });
        } catch (error) {
          console.error("Error updating user status:", error);
          // Continue with logout even if status update fails
        }
      }
      
      await signOut(auth)
      
      // Clear local state
      setUser(null)
      setFirebaseUser(null)
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateUserProfile = async (userData: Partial<User>) => {
    if (!user?.id) return

    try {
      const userRef = doc(db, 'users', user.id)
      await updateDoc(userRef, userData)
      
      // Update local user state
      setUser(prev => {
        if (!prev) return null
        return {
          ...prev,
          ...userData,
          carInfo: userData.carInfo || prev.carInfo
        }
      })
    } catch (error) {
      console.error('Error updating user profile:', error)
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
        isLoading,
        setUser,
        updateUserProfile
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
