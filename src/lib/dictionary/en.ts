// src/lib/dictionary/en.ts
// Authentic English CNC Industrial & B2B SaaS Vocabulary Dictionary
// Translated with high professional precision for Egypt & global CNC machining market

export const EN_DICTIONARY = {
  // 1. Roles & Titles
  roles: {
    superAdmin: "Platform General Manager",
    employer: "Factory / Workshop Owner",
    candidate: "CNC Specialist / Programmer",
    technician: "CNC Setter & Operator",
    engineer: "CAM Programmer Engineer",
  },

  // 2. Navigation & Sidebar
  nav: {
    home: "Home",
    dashboard: "Factory Dashboard",
    talentDatabase: "CNC Specialists & Programmers DB",
    myJobs: "Active Job Postings",
    postJob: "Request New Specialist / Programmer +",
    billingAndPlans: "Hiring Plans & Subscriptions",
    adminVerify: "Factory Verification & Badging 🛡️",
    adminPlans: "Pricing & Plans Management 💎",
    candidateProfile: "My Technical Profile & Experience",
    logout: "Log Out",
    login: "Log In",
    register: "Create Account",
  },

  // 3. Talent Database & Phone Reveal
  talent: {
    pageTitle: "CNC Specialists & Programmers Database in Egypt",
    pageSubtitle: "Browse verified resumes for Turning, Milling, and Machining talent across 10th of Ramadan, Obour, 6th of October, and Alexandria.",
    searchPlaceholder: "Search by machine (Lathe, Milling), or software (Mastercam, SolidWorks)...",
    revealPhoneBtn: "Reveal Specialist Phone Number 📞",
    phoneRevealed: "Phone Number Revealed Successfully",
    quotaExceededTitle: "Phone Reveal Quota Exceeded ⚠️",
    quotaExceededMsg: "You have consumed all allowed phone view credits in your current plan. Please upgrade your plan to reveal more candidate phone numbers.",
    upgradeNowBtn: "Upgrade Plan Now",
    rateLimitWarning: "Security Alert: You have exceeded the maximum phone reveal rate (20 reveals/min). Please wait a moment.",
    experienceYearsLabel: "Years of Experience:",
    expectedSalaryLabel: "Expected Salary:",
    reliabilityScoreLabel: "Reliability & Commitment Score:",
  },

  // 4. Jobs & Hiring Management
  jobs: {
    pageTitle: "Job Postings & Factory Requirements",
    createNewTitle: "Create New Job Posting (Request Specialist / Programmer)",
    jobTitleLabel: "Job Title (e.g. Siemens CNC Lathe Technician):",
    machineTypeLabel: "Machine Type:",
    controlTypeLabel: "Control System (FANUC, SIEMENS, HAAS...):",
    salaryRangeLabel: "Monthly Salary Range (EGP):",
    applicantsCount: "Applicants Count",
    statusActive: "🟢 Active & Receiving Applications",
    statusClosed: "🔴 Closed / Position Filled",
    quotaFullNotice: "You have reached the maximum active jobs quota for your plan. Please upgrade to post new advertisements.",
  },

  // 5. Billing, Subscriptions & Checkout
  billing: {
    pageTitle: "Hiring Plans & Monthly Subscriptions",
    pageSubtitle: "Select the ideal hiring plan for your workshop scale and technical recruitment needs.",
    activePlanLabel: "Your Current Plan:",
    statusActive: "Active & Valid ✅",
    statusExpired: "Expired / Renewal Required ⚠️",
    jobsQuotaLabel: "Active Job Postings Quota:",
    viewsQuotaLabel: "Candidate Phone Views Quota:",
    unlimitedVIP: "∞ Unlimited (Gold VIP)",
    upgradeBtnPrefix: "Upgrade to",
    processingPayment: "Initializing payment gateway...",
    mockCheckoutTitle: "Interactive Payment Gateway (Paymob Sandbox Mock)",
    paymentMethodsTabs: {
      card: "💳 Debit / Credit Card / Meeza",
      wallet: "📱 Mobile Wallet",
      fawry: "🏪 Fawry Pay Code",
    },
    simSuccessBtn: "✅ Simulate & Confirm Successful Payment (Instant Activation)",
    simFailBtn: "❌ Simulate Bank Decline / Failure",
    paymentSuccessAlert: "Payment processed successfully! Your subscription has been activated and quotas refreshed.",
    paymentFailAlert: "Payment failed or cancelled! No amount was charged to your account.",
  },

  // 6. Super Admin Management
  admin: {
    verifyPageTitle: "Verify Registered Factories & Workshops",
    verifyPageSubtitle: "Review commercial registries and industrial licenses to grant the official Verified Badge 🛡️",
    plansPageTitle: "Dynamic Pricing & Hiring Plans Management 💎",
    plansPageSubtitle: "Exclusive full control over monthly subscription pricing and quotas across Egypt.",
    addNewPlanBtn: "Add New Subscription Plan +",
    savePlanBtn: "Save & Publish Changes Immediately",
    toggleActiveTooltip: "Activate or deactivate plan visibility",
  },

  // 7. General System Messages & Feedback
  messages: {
    saveSuccess: "Data saved successfully!",
    errorOccurred: "An unexpected error occurred, please try again later.",
    unauthorized: "Sorry, this action requires additional permissions.",
    loading: "Loading...",
  },
} as const;
