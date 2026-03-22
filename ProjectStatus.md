🚀(EAP)
=====================================================

1️⃣ [جدول Pipelines]

- المستخدم يرسل الطلب عبر الرابط الخاص بالـ Pipeline.
- النظام يتأكد أن "خط الإنتاج" مسجل لدينا.

2️⃣ [جدول Jobs]

- يتم إنشاء "مهمة" جديدة.
- الحالة: Pending (قيد الانتظار).
- المحتوى: الرسالة الأصلية (مثلاً: فستان باسم مريم).

3️⃣ [جدول Actions]

- الـ Worker يقرأ هذا الجدول ليعرف المهام المطلوبة.
- يقرر تشغيل (مستخرج الأسماء) و (محسب الأسعار).

4️⃣ [تحديث جدول Jobs]

- الـ Worker يحول الحالة إلى: Completed (تم بنجاح).
- يخزن النتيجة (الاسم: مريم | السعر: 350 شيكل).

5️⃣ [جدول Subscribers]

- النظام يبحث عن "المشتركين" (مثل شركة الشبلي).
- يأخذ روابطهم (URLs) لإرسال النتيجة النهائية لهم.

6️⃣ [جدول Deliveries]

- تسجيل عملية الإرسال.
-  إذا فشل الإنترنت، النظام يعيد المحاولة (Retry Logic) حتى 3 مرات.




1. POST http://localhost:3000/pipelines
{
  "name": "Embroidery Orders"
}

2. POST http://localhost:3000/subscribers
{
  "pipelineId": 1,
  "targetUrl": "https://webhook.site/....."
}

3. POST http://localhost:3000/webhook/1
{
  "message": "بدي تطريز اسم مريم على شنطة بسرعة"
}

4. GET http://localhost:3000/jobs --> pending

5. npm run worker -> completed

6. GET http://localhost:3000/jobs/1

7. Subscriber --> webhook.site

8. Dashboard