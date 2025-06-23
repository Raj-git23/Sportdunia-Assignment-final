"use client"

import { useAuth, AuthProvider } from "@/contexts/auth-context"
import { LoginForm } from "@/components/login-form"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

function AppContent() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  // If user is logged in, don't render the login form
  if (user) {
    return null // or a loading spinner while redirecting
  }

  return <LoginForm />
}

export default function Authentication() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}