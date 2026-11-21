// src/lib/constants.ts
// مستودع الثوابت الموحد لمنصة CNC CAREERS EGYPT (hireCNC).
// مرتبة أبجدياً بنسبة 100% باللغتين العربية والإنجليزية طبقاً لدليل متطلبات المشروع ومعايير الفرز الأبجدي الدقيق (Unicode Arabic Collation).

// -----------------------------------------------------------------------------
// 1. الصناعات المعتمدة (Industries - Alphabetical Order)
// -----------------------------------------------------------------------------
export interface IndustryItem {
  id: string;
  ar: string;
  en: string;
}

export const CNC_INDUSTRIES: IndustryItem[] = [
  { id: "molds_dies", ar: "الإسطمبات والفرم", en: "Molds & Dies" },
  { id: "oil_gas", ar: "البترول والغاز", en: "Oil & Gas" },
  { id: "electronics", ar: "الصناعات الإلكترونية", en: "Electronics" },
  { id: "defense", ar: "الصناعات الدفاعية والعسكرية", en: "Defense" },
  { id: "medical", ar: "الصناعات والمستلزمات الطبية", en: "Medical Manufacturing" },
  { id: "woodworking", ar: "تشغيل الأخشاب والراوتر", en: "Woodworking" },
  { id: "sheet_metal", ar: "تشكيل وتشغيل الصاج", en: "Sheet Metal" },
  { id: "other", ar: "صناعات أخرى", en: "Other Industries" },
  { id: "automotive", ar: "صناعة السيارات ومكوناتها", en: "Automotive" },
  { id: "aerospace", ar: "صناعة الطيران", en: "Aerospace" },
  { id: "spare_parts", ar: "قطع الغيار والتشغيل العام", en: "Spare Parts & Machining" },
];

// مصفوفة الصناعات بالعربية مرتبة أبجدياً بدقة
export const CNC_INDUSTRIES_AR = [
  "الإسطمبات والفرم",
  "البترول والغاز",
  "الصناعات الإلكترونية",
  "الصناعات الدفاعية والعسكرية",
  "الصناعات والمستلزمات الطبية",
  "تشغيل الأخشاب والراوتر",
  "تشكيل وتشغيل الصاج",
  "صناعات أخرى",
  "صناعة السيارات ومكوناتها",
  "صناعة الطيران",
  "قطع الغيار والتشغيل العام"
] as const;

// مصفوفة الصناعات بالإنجليزية مرتبة أبجدياً (A-Z)
export const CNC_INDUSTRIES_EN = [
  "Aerospace",
  "Automotive",
  "Defense",
  "Electronics",
  "Medical Manufacturing",
  "Molds & Dies",
  "Oil & Gas",
  "Other Industries",
  "Sheet Metal",
  "Spare Parts & Machining",
  "Woodworking"
] as const;

// -----------------------------------------------------------------------------
// 2. المحافظات المصرية مرتبة أبجدياً بدقة (Egyptian Governorates - Alphabetical Order)
// -----------------------------------------------------------------------------
export const EGYPTIAN_GOVERNORATES = [
  "أسوان",
  "أسيوط",
  "الإسكندرية",
  "الإسماعيلية",
  "الأقصر",
  "البحر الأحمر",
  "البحيرة",
  "الجيزة",
  "الدقهلية",
  "السويس",
  "الشرقية (العاشر من رمضان)",
  "الغربية",
  "الفيوم",
  "القاهرة",
  "القليوبية (العبور)",
  "المنوفية (السادات)",
  "المنيا",
  "الوادي الجديد",
  "بني سويف",
  "بورسعيد",
  "جنوب سيناء",
  "دمياط",
  "سوهاج",
  "شمال سيناء",
  "قنا",
  "كفر الشيخ",
  "مطروح",
  "أخرى"
];

export const EGYPTIAN_GOVERNORATES_EN = [
  "Alexandria",
  "Aswan",
  "Asyut",
  "Beheira",
  "Beni Suef",
  "Cairo",
  "Dakahlia",
  "Damietta",
  "Fayoum",
  "Gharbia",
  "Giza",
  "Ismailia",
  "Kafr El Sheikh",
  "Luxor",
  "Matrouh",
  "Minya",
  "Monufia (Sadat City)",
  "New Valley",
  "North Sinai",
  "Port Said",
  "Qalyubia (Obour)",
  "Qena",
  "Red Sea",
  "Sharqia (10th of Ramadan)",
  "Sohag",
  "South Sinai",
  "Suez",
  "Other"
];

// -----------------------------------------------------------------------------
// 3. أنظمة الكنترول والماكينات (Control & Machine Reference)
// -----------------------------------------------------------------------------
export const CONTROL_TYPES = [
  "FANUC",
  "HAAS",
  "HEIDENHAIN",
  "MAZATROL",
  "SIEMENS",
  "OTHER"
] as const;

export const CONTROL_LABELS: Record<string, string> = {
  FANUC: "فانوك (Fanuc)",
  HAAS: "هاس (Haas)",
  HEIDENHAIN: "هايدن هاين (Heidenhain)",
  MAZATROL: "مازاترول (Mazatrol)",
  SIEMENS: "سيمنز (Siemens)",
  OTHER: "آخر / غير ذلك"
};

export const MACHINE_TYPES = [
  "ثناية CNC",
  "راوتر ليزر/بلازما",
  "سلك وشرارة CNC (EDM Wire Cut)",
  "فريزة CNC",
  "مخرطة CNC",
  "مقص CNC",
  "أخرى"
];

export const SOFTWARE_SPECIALIZATIONS = [
  "AutoCAD",
  "Catia",
  "Fusion 360",
  "Mastercam",
  "PowerMill",
  "SolidWorks",
  "أخرى"
];

// -----------------------------------------------------------------------------
// 4. أنظمة الورديات وساعات العمل (Work Shifts)
// -----------------------------------------------------------------------------
export interface ShiftItem {
  id: string;
  ar: string;
  en: string;
  descAr: string;
  descEn: string;
}

export const WORK_SHIFTS: ShiftItem[] = [
  { 
    id: "MORNING", 
    ar: "وردية صباحية", 
    en: "Morning Shift", 
    descAr: "دوام نهاري ثابت (مثال: 8 ص - 4 م)", 
    descEn: "Standard daytime shift (e.g. 8 AM - 4 PM)" 
  },
  { 
    id: "EVENING", 
    ar: "وردية مسائية / ليلية", 
    en: "Evening / Night Shift", 
    descAr: "ورديات مسائية لمصانع الورديتين أو الليلية", 
    descEn: "Evening or overnight shift for 24/7 facilities" 
  },
  { 
    id: "ROTATING", 
    ar: "ورديات متغيرة (نظام تناوب)", 
    en: "Rotating Shifts", 
    descAr: "جاهز للتبديل بين الورديات وفق جدول المصنع", 
    descEn: "Open to rotating shift schedules" 
  },
  { 
    id: "FLEXIBLE", 
    ar: "تفرغ كامل / مرن (أي وردية)", 
    en: "Flexible / Any Shift", 
    descAr: "تفرغ تام وجاهزية لأي نظام ورديات تختاره الإدارة", 
    descEn: "Full availability for any shift schedule" 
  },
  { 
    id: "PART_TIME", 
    ar: "دوام جزئي / إضافي (بالساعة أو القطعة)", 
    en: "Part-time / Extra Hours", 
    descAr: "عمل إضافي مسائي بجانب عمل آخر أو بالقطعة", 
    descEn: "Part-time or piecework alongside other commitments" 
  },
];
