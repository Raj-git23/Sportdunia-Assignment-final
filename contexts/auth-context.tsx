"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User } from "@/types"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  loginWithGoogle: (googleUser: any) => void
  logout: () => void
  isAdmin: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demo
const mockUsers: User[] = [
  { id: "1", email: "admin@example.com", name: "Admin User", role: "admin" },
  { id: "2", email: "user@example.com", name: "Regular User", role: "user" },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize user from localStorage on client side only
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser = localStorage.getItem("user")
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser)
          setUser(parsedUser)
        }
      } catch (error) {
        console.error("Error loading user from localStorage:", error)
        localStorage.removeItem("user") // Clean up corrupted data
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Mock authentication - in real app, this would call your API
      const foundUser = mockUsers.find((u) => u.email === email)
      if (foundUser && password === "password") {
        setUser(foundUser)
        localStorage.setItem("user", JSON.stringify(foundUser))
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  // Creating logged in user object from Google authentication 
  const loginWithGoogle = (googleUser: any) => {
    try {
      const user: User = {
        id: googleUser.sub || googleUser.user_id,
        email: googleUser.email,
        name: googleUser.name,
        role: "user"
      }
      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
    } catch (error) {
      console.error("Google login error:", error)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const isAdmin = user?.role === "admin"

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      loginWithGoogle, 
      logout, 
      isAdmin, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}