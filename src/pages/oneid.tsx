import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function OneIdPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) return;

    const { code, state } = router.query;

    if (!code) {
      setError("Code kelmadi");
      setLoading(false);
      return;
    }

    // Backendga yuborish (POST)
    fetch("https://api.uydatalim.uzedu.uz/api/oneid/login", {
      method: "POST",
      credentials: "include", // 🍪 cookie olish uchun
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, state }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Xatolik yuz berdi");
        }

        console.log("✅ Backend javobi:", data);

        // Login muvaffaqiyatli -> dashboardga redirect
        router.push("/dashboard");
      })
      .catch((err) => {
        console.error("❌ OneID xato:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [router.isReady, router.query]);

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
        <h1>❌ Xatolik!</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>✅ OneID orqali muvaffaqiyatli login qilindi!</h1>
      <p>Endi siz <a href="/dashboard">/dashboard</a> sahifasiga o‘tishingiz mumkin.</p>
    </div>
  );
}
