# Jeldi — Next.js Project

## التشغيل محلياً

```bash
npm install
cp .env.local.example .env.local   # عبّي بيانات Supabase ديالك
npm run dev
```

الموقع غايبان على `http://localhost:3000`.

## الهيكل

```
app/
  layout.tsx          — الخطوط (Fraunces / Inter / IBM Plex Mono) + Header/Footer
  page.tsx             — الصفحة الرئيسية (Hero + Story teaser + Product)
  globals.css          — الأساسيات + prefers-reduced-motion
  our-story/page.tsx    — stub، خاصها تتبنى بالمحتوى الكامل
components/
  Header.tsx
  Footer.tsx
  StitchRail.tsx       — العنصر المميز (خط تقدم الـ scroll)
lib/
  supabase.ts           — Supabase client (يحتاج .env.local)
tailwind.config.ts       — ألوان وخطوط الهوية البصرية (jeldi design tokens)
```

## الخطوة الجاية

1. `npm install` وتشغيل المشروع محلياً باش تتأكد الصفحة طالعة مزيان
2. بناء صفحة `/our-story` بالمحتوى الكامل
3. إنشاء جداول Supabase (`products`, `orders`, `story_content`) — راجع `06-website-structure-tech.md`
4. دمج PayPal Advanced Checkout
5. صفحات `/privacy-policy`, `/terms`, `/shipping-faq`, `/contact`
