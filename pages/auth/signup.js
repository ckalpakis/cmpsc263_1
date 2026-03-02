/* Signup page providing a working registration flow with Firebase auth or demo auth fallback. */
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from '@/components/Dashboard/Navbar'
import AuthFormCard from '@/components/Auth/AuthFormCard'
import { isEmailInUse, register } from '@/backend/Auth'
import { useStateContext } from '@/context/StateContext'

const Signup = () => {
  const router = useRouter()
  const { setUser, authMode } = useStateContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const normalizedEmail = email.trim().toLowerCase()
    const emailRegex = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

    if (!emailRegex.test(normalizedEmail)) {
      setError('Enter a valid email address.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setIsSubmitting(true)

    try {
      const emailTaken = await isEmailInUse(normalizedEmail)
      if (emailTaken) {
        setError('That email is already in use.')
        setIsSubmitting(false)
        return
      }

      await register(normalizedEmail, password, setUser)
      router.push('/dashboard')
    } catch (authError) {
      setError(authError.message || 'Unable to create the account right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <AuthFormCard
        mode='signup'
        email={email}
        password={password}
        error={error}
        isSubmitting={isSubmitting}
        helperText={`Create an account to separate your assignment history. Current mode: ${authMode === 'firebase' ? 'Firebase authentication' : 'demo authentication fallback'}.`}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
      />
    </>
  )
}

export default Signup
