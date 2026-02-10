'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'
import toast from 'react-hot-toast'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.uid === ADMIN_KEY) {
        setIsAuthorized(true)
      } else {
        // If not admin, push to login or home
        toast.error("Unauthorized Access")
        router.push('/') 
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router, ADMIN_KEY])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500 mb-4"></div>
        <p className="text-gray-500 font-bold text-xs uppercase tracking-[0.3em]">Verifying Credentials</p>
      </div>
    )
  }

  return isAuthorized ? <>{children}</> : null
}