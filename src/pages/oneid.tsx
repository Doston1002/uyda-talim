'use client'

import { useToast } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { API_URL } from "src/config/api.config";
import { saveTokensCookie } from "src/helpers/auth.helper";

export default function OneIdPage(query: any) {
  const router = useRouter();
	const toast = useToast();
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const search = searchParams?.get('code')  
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOneIdCallback = async (code: string) => {
      const response = await fetch(`${API_URL}/auth/oneid/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      if (data.success) {
        setLoading(false)
        // Token va user ma'lumotlari
        // localStorage.setItem('accessToken', data.accessToken);
        // localStorage.setItem('refreshToken', data.refreshToken);
        saveTokensCookie(data)
        router.push('/');
				toast({
					title: `${t('successfully_logged', { ns: 'global' })}`,
					status: 'info',
					isClosable: true,
					position: 'top-right',
				});
      }
    };

    if (!search) {
      setError("Code kelmadi");
      setLoading(false);
      return;
    }

    handleOneIdCallback(search)


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
  }, []);

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
