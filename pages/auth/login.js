/* Login page providing a working sign-in flow with Firebase auth or demo auth fallback. */
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from '@/components/Dashboard/Navbar'
import AuthFormCard from '@/components/Auth/AuthFormCard'
import { login } from '@/backend/Auth'
import { useStateContext } from '@/context/StateContext'

const Login = () => {
  const router = useRouter()
  const { setUser, authMode } = useStateContext()
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
        helperText={`Use your account to sync work. Current mode: ${authMode === 'firebase' ? 'Firebase authentication' : 'demo authentication fallback'}.`}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
      />
    </>
  )
}

export default Login
