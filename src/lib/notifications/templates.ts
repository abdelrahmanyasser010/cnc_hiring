// src/lib/notifications/templates.ts
// محرك قوالب الرسائل العربية لمنصة hireCNC Egypt.
// يحتوي على القوالب النصية المعتمدة للواتساب والتواصل المباشر.

export const Templates = {
  NEW_APPLICANT: (company: string, job: string) =>
    `مرحباً، تم استلام طلب تقديم جديد لوظيفتكم المعلنة [${job}] في مصنع [${company}]. يمكنك الاطلاع على النتيجة والتقييم الذكي فوراً من لوحة تحكم أصحاب العمل.`,

  INTERVIEW_INVITE: (candidate: string, time: string, location: string) =>
    `أهلاً يا أستاذ ${candidate}، يسعدنا إعلامك بأنه تم قبول طلبك للمقابلة الفنية لوظيفة تشغيل الـ CNC. موعد المقابلة: [${time}] في عنوان المصنع: [${location}]. يرجى تأكيد حضورك بالرد على هذه الرسالة. بالتوفيق!`
};
