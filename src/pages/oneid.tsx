import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { ONEID_URL } from 'src/config/api.config'

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

  useEffect(() => {
    if (router.isReady) {
      const { code, state } = router.query;
  
      if (code) {
        fetch(`${ONEID_URL}OneId/OneIdApi?code=${code}&state=${state}`, {
          credentials: "include", // cookie olish uchun
        })
          .then(res => {
            if (res.redirected) {
              window.location.href = res.url; // agar backend redirect qilsa
            }
          })
          .catch(err => console.error(err));
      }
    }
  }, [router.isReady, router.query]);
  

  return (
    <div style={{ padding: 40 }}>
      <h1>OneID Callback Page</h1>
      <p>Agar code keldi: brauzer konsolini ochib tekshiring.</p>
    </div>
  )
}
