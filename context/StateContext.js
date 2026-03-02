import React, { createContext, useContext, useEffect, useState } from 'react'
import { onIdTokenChanged } from 'firebase/auth'
import { auth, isFirebaseConfigured } from '@/backend/Firebase'

const Context = createContext()

export const StateContext = ({ children }) => {
  const [user, setUser] = useState(undefined)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    if (!auth) {
      setUser(null)
      setAuthReady(true)
      return
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
        authConfigured: isFirebaseConfigured,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useStateContext = () => useContext(Context)
