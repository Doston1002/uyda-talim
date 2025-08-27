import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { API_URL } from 'src/config/api.config';

export default function OneIdPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!router.isReady) return

    const { code, state } = router.query

    if (!code) {
      setError("Code kelmadi")
      setLoading(false)
      return
    }

    // Backendga yuborish
    fetch(`https://api.uydatalim.uzedu.uz/api/OneId/OneIdApi?code=${code}&state=${state}`, {
      method: "GET",
      credentials: "include", // cookie olish uchun
    })
      .then(async (res) => {
        if (res.redirected) {
          // Backend redirect qilsa (masalan /dashboard)
          window.location.href = res.url
        } else if (!res.ok) {
          const text = await res.text()
          throw new Error(text)
        } else {
          // Agar backend JSON qaytarsa
          const data = await res.json()
          console.log("Backend javobi:", data)
          // Masalan: user ma'lumotlarini olish
        }
      })
      .catch(err => {
        console.error("OneID xato:", err)
        setError(err.message)
      })
      .finally(() => setLoading(false))

  }, [router.isReady, router.query])

  if (loading) {
    return <div style={{ padding: 40 }}><h1>🔄 OneID orqali tizimga kiritilmoqda...</h1></div>
  }

  if (error) {
    return <div style={{ padding: 40, color: "red" }}>
      <h1>Xatolik!</h1>
      <p>{error}</p>
    </div>
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>✅ OneID orqali muvaffaqiyatli login qilindi!</h1>
      <p>Backenddan cookie saqlandi, endi siz /dashboard sahifasiga o‘tishingiz mumkin.</p>
    </div>
  )
}
