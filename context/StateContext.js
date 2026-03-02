import React, { createContext, useContext, useEffect, useState } from 'react'
import { onIdTokenChanged } from 'firebase/auth'
import { auth, isFirebaseConfigured } from '@/backend/Firebase'
import { getPersistedDemoUser } from '@/backend/Auth'

const Context = createContext()

export const StateContext = ({ children }) => {
  const [user, setUser] = useState(undefined)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    if (!auth) {
      setUser(getPersistedDemoUser())
      setAuthReady(true)

      const syncDemoSession = () => {
        setUser(getPersistedDemoUser())
      }

      window.addEventListener('storage', syncDemoSession)
      return () => window.removeEventListener('storage', syncDemoSession)
    }

    const unsubscribe = onIdTokenChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null)
      setAuthReady(true)
    })

    return () => unsubscribe()
  }, [])

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        authReady,
        authMode: isFirebaseConfigured ? 'firebase' : 'demo',
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useStateContext = () => useContext(Context)
