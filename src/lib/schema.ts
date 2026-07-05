import { z } from "zod";

// تعريف أنواع الكنترول المتوافقة مع الـ Enum في قاعدة البيانات
export const ControlTypeSchema = z.enum([
  "FANUC",
  "SIEMENS",
  "HEIDENHAIN",
  "HAAS",
  "MAZATROL",
  "OTHER"
]);

// عقد التحقق من بيانات إعلان الوظيفة (Zod Validation Schema)
export const JobSchema = z.object({
  title: z.string().min(5, "المسمى الوظيفي يجب أن يكون 5 أحرف على الأقل"),
  controlRequired: ControlTypeSchema,
  location: z.string().min(5, "العنوان أو الموقع الجغرافي يجب أن يكون 5 أحرف على الأقل"),
  experienceMin: z.coerce.number().int().min(0, "سنوات الخبرة لا يمكن أن تكون قيمة سالبة"),
  experienceMax: z.coerce.number().int().min(0, "سنوات الخبرة لا يمكن أن تكون قيمة سالبة"),
  salaryMin: z.coerce.number().min(0, "الراتب لا يمكن أن يكون قيمة سالبة"),
  salaryMax: z.coerce.number().min(0, "الراتب لا يمكن أن يكون قيمة سالبة"),
  hideSalary: z.boolean().default(false),
  description: z.string().min(10, "الوصف الوظيفي متطلب ويجب أن لا يقل عن 10 أحرف"),
}).refine((data) => data.salaryMax >= data.salaryMin, {
  message: "الحد الأقصى للراتب يجب أن يكون أكبر من أو يساوي الحد الأدنى للراتب",
  path: ["salaryMax"],
}).refine((data) => data.experienceMax >= data.experienceMin, {
  message: "الحد الأقصى للخبرة يجب أن يكون أكبر من أو يساوي الحد الأدنى",
  path: ["experienceMax"],
});

export type JobInput = z.infer<typeof JobSchema>;

// عقد التحقق للفنيين والمهندسين باستخدام discriminatedUnion بناءً على الحقل "role"
export const MachinistSchema = z.discriminatedUnion("role", [
  z.object({
    role: z.literal("TECHNICIAN"),
    name: z.string().min(3, "الاسم الكامل يجب أن يكون 3 أحرف على الأقل"),
    phoneNumber: z.string().regex(/^01[0125][0-9]{8}$/, "رقم الهاتف يجب أن يكون رقم هاتف مصري صحيح مكون من 11 رقماً (مثال: 01000000000)"),
    governorate: z.string().min(3, "يرجى تحديد المحافظة"),
    city: z.string().min(3, "يرجى تحديد المدينة أو المنطقة السكنية"),
    experienceYears: z.coerce.number().int().min(0, "سنوات الخبرة لا يمكن أن تكون قيمة سالبة"),
    expectedSalary: z.coerce.number().min(0, "الراتب المتوقع لا يمكن أن يكون سالباً"),
    machineTypes: z.array(z.string()).min(1, "يجب اختيار نوع ماكينة واحد على الأقل للمتابعة"),
  }),
  z.object({
    role: z.literal("ENGINEER"),
    name: z.string().min(3, "الاسم الكامل يجب أن يكون 3 أحرف على الأقل"),
    phoneNumber: z.string().regex(/^01[0125][0-9]{8}$/, "رقم الهاتف يجب أن يكون رقم هاتف مصري صحيح مكون من 11 رقماً (مثال: 01000000000)"),
    governorate: z.string().min(3, "يرجى تحديد المحافظة"),
    city: z.string().min(3, "يرجى تحديد المدينة أو المنطقة السكنية"),
    experienceYears: z.coerce.number().int().min(0, "سنوات الخبرة لا يمكن أن تكون قيمة سالبة"),
    expectedSalary: z.coerce.number().min(0, "الراتب المتوقع لا يمكن أن يكون سالباً"),
    specializations: z.array(z.string()).min(1, "يجب اختيار برنامج هندسي واحد على الأقل للمتابعة"),
  }),
]);

export type MachinistInput = z.infer<typeof MachinistSchema>;

// عقد التحقق الخاص بالتسجيل لأصحاب المصانع
export const EmployerRegisterSchema = z.object({
  name: z.string().min(3, "الاسم الشخصي يجب أن يكون 3 أحرف على الأقل"),
  companyName: z.string().min(3, "اسم المنشأة/المصنع يجب أن يكون 3 أحرف على الأقل"),
  industryZone: z.string().min(2, "يرجى تحديد المنطقة الصناعية"),
  address: z.string().min(5, "العنوان بالتفصيل يجب أن يكون 5 أحرف على الأقل"),
  phoneNumber: z.string().regex(/^01[0125][0-9]{8}$/, "رقم الهاتف غير صالح، يجب أن يكون رقم هاتف مصري صحيح مكون من 11 رقماً (مثال: 01000000000)"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  businessLicenseUrl: z.string().optional(),
});

export type EmployerRegisterInput = z.infer<typeof EmployerRegisterSchema>;


