import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function OneIdPage() {
  const router = useRouter()

  useEffect(() => {
    if (router.isReady) {
      const { code, state } = router.query

      console.log("OneID qaytdi:", code, state)

      // agar backend orqali ishlashni xohlasangiz:
      // fetch("/api/your-backend-route?code=" + code)

    }
  }, [router.isReady, router.query])
  

  return (
    <div style={{ padding: 40 }}>
      <h1>OneID Callback Page</h1>
      <p>Agar code keldi: brauzer konsolini ochib tekshiring.</p>
    </div>
  )
}
