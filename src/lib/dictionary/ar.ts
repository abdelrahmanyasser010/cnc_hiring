// src/lib/dictionary/ar.ts
// القاموس المركزي الموحد لمنصة hireCNC مصر - الإصدار المُمصر مهنياً وصناعياً
// Authentic Egyptian CNC Industrial & B2B SaaS Vocabulary Dictionary

export const AR_DICTIONARY = {
  // 1. مصطلحات عامة وألقاب الصنعة (Common & Roles)
  roles: {
    superAdmin: "مدير المنصة العام",
    employer: "صاحب مصنع / ورشة",
    candidate: "فني أو مبرمج CNC",
    technician: "فني تشغيل / سِتَابَر (Setter & Operator)",
    engineer: "مهندس مبرمج (CAM Programmer)",
  },

  // 2. القائمة الرئيسية والشريط الجانبي (Navigation & Sidebar)
  nav: {
    home: "الرئيسية",
    dashboard: "لوحة تحكم المصنع",
    talentDatabase: "قاعدة بيانات فنيين ومبرمجين الـ CNC",
    myJobs: "إعلانات التوظيف النشطة",
    postJob: "طلب فني أو مبرمج جديد +",
    billingAndPlans: "باقات التوظيف والاشتراكات",
    adminVerify: "توثيق واعتماد المصانع والورش 🛡️",
    adminPlans: "إدارة التسعير والباقات 💎",
    candidateProfile: "ملفي الفني وسجل خبراتي",
    logout: "تسجيل الخروج",
    login: "تسجيل الدخول",
    register: "حساب جديد",
  },

  // 3. مصطلحات شاشة فنيين الـ CNC وكشف الأرقام (Talent & Reveal)
  talent: {
    pageTitle: "قاعدة بيانات فنيين ومبرمجين الـ CNC في مصر",
    pageSubtitle: "تصفح أحدث السير الذاتية لكوادر الخراطة والفريزاج والتشغيل في العاشر، العبور، أكتوبر، والإسكندرية.",
    searchPlaceholder: "ابحث بالماكينة (مخرطة، فريزة)، أو البرنامج (Mastercam، SolidWorks)...",
    revealPhoneBtn: "إظهار رقم تليفون الفني 📞",
    phoneRevealed: "تم إظهار الرقم بنجاح",
    quotaExceededTitle: "تنبيه استنفاد حصة كشف الأرقام ⚠️",
    quotaExceededMsg: "لقد استهلكت جميع أرقام التليفونات المسموحة في باقتك الحالية. يرجى ترقية باقتك لإظهار أرقام المزيد من الفنيين والمبرمجين.",
    upgradeNowBtn: "ترقية الباقة الآن",
    rateLimitWarning: "تنبيه أمني: تجاوزت الحد الأقصى لمحاولات إظهار الأرقام (20 رقم في الدقيقة). يرجى الانتظار قليلاً.",
    experienceYearsLabel: "سنوات الخبرة في الصنعة:",
    expectedSalaryLabel: "الراتب المتوقع:",
    reliabilityScoreLabel: "معدل الالتزام والجدية:",
  },

  // 4. مصطلحات نشر وإدارة الوظائف (Jobs & Hiring)
  jobs: {
    pageTitle: "إعلانات التوظيف وطلبات الورش والمصانع",
    createNewTitle: "إضافة إعلان توظيف جديد (طلب فني أو مبرمج)",
    jobTitleLabel: "المسمى الوظيفي المطلوب (مثال: فني مخرطة CNC سيمنز):",
    machineTypeLabel: "نوع الماكينة:",
    controlTypeLabel: "نظام الكنترول (FANUC, SIEMENS, HAAS...):",
    salaryRangeLabel: "نطاق الراتب الشهري (ج.م):",
    applicantsCount: "المتقدمين للوظيفة",
    statusActive: "🟢 إعلان نشط ويستقبل متقدمين",
    statusClosed: "🔴 إعلان مغلق / تم التوظيف",
    quotaFullNotice: "وصلت للحد الأقصى لعدد الوظائف المنشورة في باقتك. يرجى الترقية لنشر إعلانات جديدة.",
  },

  // 5. مصطلحات الاشتراكات والفواتير ومحاكاة الدفع (Billing & Paymob Checkout)
  billing: {
    pageTitle: "باقات التوظيف والاشتراكات الشهرية",
    pageSubtitle: "اختر الباقة المناسبة لحجم مصنعك واحتياجاتك التوظيفية من الفنيين والمبرمجين.",
    activePlanLabel: "باقتك الحالية:",
    statusActive: "نشط وساري ✅",
    statusExpired: "منتهي / يحتاج لتجديد ⚠️",
    jobsQuotaLabel: "حصة إعلانات التوظيف النشطة:",
    viewsQuotaLabel: "حصة إظهار أرقام الفنيين والمبرمجين:",
    unlimitedVIP: "∞ غير محدود (Gold VIP)",
    upgradeBtnPrefix: "ترقية إلى",
    processingPayment: "جاري تجهيز بوابة الدفع...",
    mockCheckoutTitle: "بوابة الدفع التفاعلية (وضع المحاكاة الذكي Paymob Sandbox)",
    paymentMethodsTabs: {
      card: "💳 بطاقة بنكية / ميزة",
      wallet: "📱 محفظة إلكترونية",
      fawry: "🏪 كود دفع فوري",
    },
    simSuccessBtn: "✅ تأكيد ومحاكاة الدفع الناجح (تفعيل فوري)",
    simFailBtn: "❌ محاكاة فشل أو رفض العملية من البنك",
    paymentSuccessAlert: "تمت عملية الدفع بنجاح! تم تفعيل اشتراكك وتحديث رصيد إعلانات الوظائف وإظهار أرقام الفنيين.",
    paymentFailAlert: "فشلت أو ألغيت عملية الدفع! لم يتم خصم أي مبالغ من حسابك.",
  },

  // 6. مصطلحات لوحة الإدارة (Super Admin)
  admin: {
    verifyPageTitle: "توثيق واعتماد المصانع والورش المسجلة",
    verifyPageSubtitle: "مراجعة السجلات التجارية والرخص الصناعية لمنح شارة التوثيق الرسمية (Verified Badge) 🛡️",
    plansPageTitle: "إدارة باقات التوظيف والتسعير الديناميكي 💎",
    plansPageSubtitle: "التحكم الحصري والكامل في أسعار الاشتراكات الشهرية وحصص المصانع في مصر.",
    addNewPlanBtn: "إضافة باقة اشتراك جديدة +",
    savePlanBtn: "حفظ التعديلات ونشرها فوراً",
    toggleActiveTooltip: "تنشيط أو تعطيل ظهور الباقة",
  },

  // 7. رسائل وتنبيهات النظام العامة (System Alerts & Feedback)
  messages: {
    saveSuccess: "تم حفظ البيانات بنجاح!",
    errorOccurred: "حدث خطأ غير متوقع، يرجى المحاولة لاحقاً.",
    unauthorized: "عذراً، هذا الإجراء يتطلب صلاحيات إضافية.",
    loading: "جاري التحميل...",
  },
} as const;

export type ArDictionary = typeof AR_DICTIONARY;
