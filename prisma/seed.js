/* eslint-disable @typescript-eslint/no-require-imports */
// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Generate password hash for test accounts (password: 123456)
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("123456", salt);

  // 2. Upsert Super Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@hirecnc.com" },
    update: { passwordHash, phoneNumber: "01000000000", emailVerified: true, status: "ACTIVE" },
    create: {
      email: "admin@hirecnc.com",
      phoneNumber: "01000000000",
      passwordHash,
      name: "أدمن النظام (المدير العام)",
      role: "SUPER_ADMIN",
      emailVerified: true,
      status: "ACTIVE",
    },
  });
  console.log(`✅ Super Admin created: ${adminUser.email} / ${adminUser.phoneNumber}`);

  // 3. Upsert Employer User
  const employerUser = await prisma.user.upsert({
    where: { email: "employer@hirecnc.com" },
    update: { passwordHash, phoneNumber: "01100000000", emailVerified: true, status: "ACTIVE" },
    create: {
      email: "employer@hirecnc.com",
      phoneNumber: "01100000000",
      passwordHash,
      name: "أحمد مرسي الشرقاوي",
      role: "EMPLOYER",
      emailVerified: true,
      status: "ACTIVE",
    },
  });
  console.log(`✅ Employer user created: ${employerUser.email} / ${employerUser.phoneNumber}`);

  // 4. Create Employer Profile for the employer user
  const employerProfile = await prisma.employerProfile.upsert({
    where: { userId: employerUser.id },
    update: {},
    create: {
      userId: employerUser.id,
      companyName: "مصنع النيل لتشغيل المعادن وخراطة الـ CNC",
      industryZone: "العاشر من رمضان",
      address: "المنطقة الصناعية الثالثة، خلف السلاب",
      commercialRegId: "CR-992211",
      isVerified: true,
    },
  });
  console.log(`✅ Employer profile created: ${employerProfile.companyName}`);

  // 4.5 Seed Subscription Plans
  const plans = [
    {
      name: "الباقة الأساسية (Basic)",
      description: "باقة البداية للمصانع والورش الصغيرة لنشر الوظائف والتواصل السريع.",
      priceEGP: 1000.00,
      durationDays: 30,
      maxActiveJobs: 2,
      maxPhoneViews: 15,
      canViewPhone: true,
      canExportData: false,
      isActive: true,
      sortOrder: 1,
    },
    {
      name: "الباقة الاحترافية (Pro)",
      description: "الباقة الأكثر طلباً للمصانع المتوسطة والكبيرة لتوظيف الكفاءات بمرونة وخيارات تصدير.",
      priceEGP: 2500.00,
      durationDays: 30,
      maxActiveJobs: 5,
      maxPhoneViews: 50,
      canViewPhone: true,
      canExportData: true,
      isActive: true,
      sortOrder: 2,
    },
    {
      name: "الباقة الذهبية (Gold VIP)",
      description: "باقة غير محدودة للمصانع والشركات الكبرى مع صلاحيات استثنائية وأولوية الدعم الفني.",
      priceEGP: 5000.00,
      durationDays: 30,
      maxActiveJobs: -1,
      maxPhoneViews: -1,
      canViewPhone: true,
      canExportData: true,
      isActive: true,
      sortOrder: 3,
    },
  ];

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { name: plan.name },
      update: {},
      create: plan,
    });
  }
  console.log("✅ Subscription plans seeded.");

  // 5. Seed Machine Types
  const machineTypes = [
    "مخرطة CNC",
    "فريزة CNC",
    "ثناية CNC",
    "مقص CNC",
    "راوتر ليزر/بلازما",
    "مركز تشغيل خماسي المحاور (5-Axis)"
  ];
  for (const name of machineTypes) {
    await prisma.machineType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("✅ Machine types seeded.");

  // 6. Seed Software Specializations
  const softwareSpecs = [
    "SolidWorks",
    "AutoCAD",
    "Fusion 360",
    "Mastercam",
    "PowerMILL",
    "Catia"
  ];
  for (const name of softwareSpecs) {
    await prisma.softwareSpecialization.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("✅ Software specializations seeded.");

  // 7. Seed Machinist Candidates (User + CandidateProfile)
  const mockCandidates = [
    {
      email: "tech1@hirecnc.com",
      phoneNumber: "01012345678",
      name: "أحمد مرسي الشرقاوي",
      role: "CANDIDATE",
      candidateType: "TECHNICIAN",
      governorate: "الشرقية",
      city: "العاشر من رمضان",
      experienceYears: 6,
      expectedSalary: 10500.00,
      reliabilityScore: 98.0,
      isAvailable: true,
    },
    {
      email: "eng1@hirecnc.com",
      phoneNumber: "01234567890",
      name: "م. حسام محمود الجيزاوي",
      role: "CANDIDATE",
      candidateType: "ENGINEER",
      governorate: "الجيزة",
      city: "6 أكتوبر",
      experienceYears: 8,
      expectedSalary: 14500.00,
      reliabilityScore: 95.0,
      isAvailable: true,
    },
    {
      email: "tech2@hirecnc.com",
      phoneNumber: "01122334455",
      name: "شريف جلال البساتيني",
      role: "CANDIDATE",
      candidateType: "TECHNICIAN",
      governorate: "القاهرة",
      city: "البساتين",
      experienceYears: 4,
      expectedSalary: 8500.00,
      reliabilityScore: 88.0,
      machineTypes: ["ثناية CNC", "مقص CNC"],
      isAvailable: true,
    }
  ];

  for (const c of mockCandidates) {
    const candidateUser = await prisma.user.upsert({
      where: { email: c.email },
      update: { passwordHash, phoneNumber: c.phoneNumber, emailVerified: true, status: "ACTIVE" },
      create: {
        email: c.email,
        phoneNumber: c.phoneNumber,
        passwordHash,
        name: c.name,
        role: "CANDIDATE",
        emailVerified: true,
        status: "ACTIVE",
      },
    });

    await prisma.candidateProfile.upsert({
      where: { userId: candidateUser.id },
      update: {},
      create: {
        userId: candidateUser.id,
        candidateType: c.candidateType,
        governorate: c.governorate,
        city: c.city,
        experienceYears: c.experienceYears,
        expectedSalary: c.expectedSalary,
        reliabilityScore: c.reliabilityScore,
        isAvailable: c.isAvailable,
      },
    });
  }
  console.log("✅ Candidate profiles seeded.");

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
