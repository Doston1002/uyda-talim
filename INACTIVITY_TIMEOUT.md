# Inactivity Timeout Feature

Bu xususiyat foydalanuvchilarni 10 daqiqa davomida harakat qilmasa avtomatik ravishda tizimdan chiqaradi va bosh sahifaga yo'naltiradi.

## Qanday ishlaydi

1. **Foydalanuvchi kirgan bo'lsa** - timeout faqat kirgan foydalanuvchilar uchun ishlaydi
2. **Harakat kuzatish** - quyidagi hodisalar kuzatiladi:
   - Mouse harakatlari (mousedown, mousemove, click)
   - Klaviatura harakatlari (keypress)
   - Scroll harakatlari
   - Touch harakatlari (mobil qurilmalar uchun)

3. **Timeout jarayoni**:
   - 1 daqiqa oldin ogohlantirish (console.log orqali)
   - 10 daqiqa davomida harakat bo'lmasa avtomatik logout
   - Bosh sahifaga yo'naltirish (`/`)

## Texnik tafsilotlar

- **Hook**: `useInactivityTimeout`
- **Fayl**: `front/src/hooks/useInactivityTimeout.ts`
- **Provider**: `front/src/provider/auth.provider.tsx`

## Sozlamalar

```typescript
useInactivityTimeout({
  timeoutMinutes: 10,       // 10 daqiqa timeout
  showWarning: true,        // Ogohlantirish ko'rsatish
  warningMinutes: 1,       // 1 daqiqa oldin ogohlantirish
  onWarning: () => {},      // Ogohlantirish callback
  onTimeout: () => {},      // Timeout callback
});
```

## Xavfsizlik

- Faqat kirgan foydalanuvchilar uchun ishlaydi
- Harakat bo'lganda timeout qayta boshlanadi
- Component unmount bo'lganda timeout to'xtatiladi
- Memory leak larni oldini olish uchun cleanup qilingan
