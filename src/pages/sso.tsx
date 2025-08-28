import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { API_URL } from "src/config/api.config";

export default function OneIdPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOneIdCallback = async (code: string) => {
      const response = await fetch('/api/auth/oneid/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      if (data.success) {
        // Token va user ma'lumotlari
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
      }
    };

    const { code, state } = router.query;

    if (!code) {
      setError("Code kelmadi");
      setLoading(false);
      return;
    }

    handleOneIdCallback(code as string)


    // fetch(`${API_URL}/oneid/callback?code=${code}&state=${state}`, {
    //   method: "GET",
    //   credentials: "include", // 🍪 cookie olish
    // })
    //   .then(async (res) => {
    //     if (res.redirected) {
    //       window.location.href = res.url; // agar backend redirect qilsa
    //     } else if (!res.ok) {
    //       throw new Error(await res.text());
    //     } else {
    //       await res.json();
    //       router.replace("/dashboard"); // cookie saqlangach → dashboard
    //     }
    //   })
    //   .catch((err) => {
    //     console.error("OneID xato:", err);
    //     setError(err.message);
    //   })
    //   .finally(() => setLoading(false));
  }, [router.query]);

  if (loading) {
    return (
      <div style={{ padding: 40 }}>
        <h1>🔄 OneID orqali tizimga kiritilmoqda...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 40, color: "red" }}>
        <h1>Xatolik!</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>✅ OneID orqali muvaffaqiyatli login qilindi!</h1>
      <p>Siz endi /dashboard sahifasiga o‘tishingiz mumkin.</p>
    </div>
  );
}
