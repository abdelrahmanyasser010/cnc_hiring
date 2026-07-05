// src/lib/constants.ts
// مستودع الثوابت الموحد لمنصة hireCNC Egypt.
// يتم استخدامه لتغذية القوائم المنسدلة، وعمليات التحقق، والفلاتر.

export const EGYPTIAN_GOVERNORATES = [
  "القاهرة",
  "الجيزة",
  "الشرقية", // تضم العاشر من رمضان
  "القليوبية", // تضم العبور
  "المنوفية", // تضم السادات وقويسنا
  "الإسكندرية", // تضم برج العرب الجديدة
  "السويس",
  "بورسعيد",
  "الدقهلية",
  "الغربية",
  "البحيرة",
  "أخرى"
];

export const CONTROL_TYPES = [
  "FANUC",
  "SIEMENS",
  "HEIDENHAIN",
  "HAAS",
  "MAZATROL",
  "OTHER"
] as const;

export const CONTROL_LABELS: Record<string, string> = {
  FANUC: "فانوك (Fanuc)",
  SIEMENS: "سيمنز (Siemens)",
  HEIDENHAIN: "هايدن هاين (Heidenhain)",
  HAAS: "هاس (Haas)",
  MAZATROL: "مازاترول (Mazatrol)",
  OTHER: "آخر / غير ذلك"
};

export const MACHINE_TYPES = [
  "مخرطة CNC",
  "فريزة CNC",
  "مقص CNC",
  "ثناية CNC",
  "سلك وشرارة CNC (EDM Wire Cut)",
  "راوتر ليزر/بلازما",
  "أخرى"
];

export const SOFTWARE_SPECIALIZATIONS = [
  "SolidWorks",
  "AutoCAD",
  "Mastercam",
  "PowerMill",
  "Catia",
  "Fusion 360",
  "أخرى"
];
