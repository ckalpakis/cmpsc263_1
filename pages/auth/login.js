/* Login page providing the Firebase-backed sign-in flow for the final app. */
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from '@/components/Dashboard/Navbar'
import AuthFormCard from '@/components/Auth/AuthFormCard'
import { login } from '@/backend/Auth'
import { useStateContext } from '@/context/StateContext'

const Login = () => {
  const router = useRouter()
  const { setUser, authConfigured } = useStateContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Email and password are required.')
      return
    }

    setIsSubmitting(true)

    try {
      await login(email, password, setUser)
      router.push('/dashboard')
    } catch (authError) {
      setError(authError.message || 'Unable to sign in right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <AuthFormCard
        mode='login'
        email={email}
        password={password}
        error={error}
        isSubmitting={isSubmitting}
        helperText={
          authConfigured
            ? 'Sign in with your Firebase account to access your assignments and dashboard.'
            : 'Firebase is not configured correctly yet. Add the required environment variables before signing in.'
        }
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
      />
    </>
  )
}

export default Login
