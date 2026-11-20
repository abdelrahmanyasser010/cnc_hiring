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
    adminReferrals: "Direct Referral Requests 🎯",
    candidateProfile: "My Technical Profile & Experience",
    logout: "Log Out",
    login: "Log In",
    register: "Create Account",
  },

  // 3. Talent Database & Phone Reveal
  talent: {
    pageTitle: "CNC Machining & Technical Talent Database in Egypt",
    pageSubtitle: "Explore verified credentials and competencies across Turning, Milling, Tooling, and Precision Machining sectors.",
    searchPlaceholder: "Search by industry, machine model (DMG, Haas), or controller (Fanuc, Siemens)...",
    revealPhoneBtn: "Reveal Candidate Contact Details 📞",
    phoneRevealed: "Contact Details Revealed Successfully",
    quotaExceededTitle: "Profile Reveal Quota Reached ⚠️",
    quotaExceededMsg: "You have utilized all allocated contact reveals in your active plan. Please upgrade to unlock additional direct candidate access.",
    upgradeNowBtn: "Upgrade Operational Plan",
    rateLimitWarning: "Security Alert: Exceeded maximum reveal frequency (20 reveals/min). Please wait a moment.",
    experienceYearsLabel: "Years of Practical Experience:",
    expectedSalaryLabel: "Expected Salary:",
    reliabilityScoreLabel: "Professional Reliability Index:",
  },

  // 4. Jobs & Hiring Management
  jobs: {
    pageTitle: "Job Postings & Industrial Facility Requisitions",
    createNewTitle: "Post New Position (Request Machinist / CAM Specialist)",
    jobTitleLabel: "Target Job Title (e.g. 5-Axis CAM Programmer):",
    machineTypeLabel: "Machine Configuration & Tooling:",
    controlTypeLabel: "CNC Controller System (FANUC, SIEMENS, HEIDENHAIN, HAAS...):",
    salaryRangeLabel: "Monthly Salary Range (EGP):",
    applicantsCount: "Registered Applicants",
    statusActive: "🟢 Active & Reviewing Submissions",
    statusClosed: "🔴 Closed / Position Filled",
    quotaFullNotice: "Active posting limit reached for your plan. Please upgrade to post additional requisitions.",
  },

  // 5. Billing, Subscriptions & Checkout
  billing: {
    pageTitle: "Enterprise Subscriptions & Facility Plans",
    pageSubtitle: "Select the operational plan tailored to your plant capacity to unlock direct candidate referrals and database access.",
    activePlanLabel: "Current Subscription:",
    statusActive: "Active & Verified ✅",
    statusExpired: "Expired / Renewal Due ⚠️",
    jobsQuotaLabel: "Active Job Postings Allocation:",
    viewsQuotaLabel: "Candidate Contact Reveals Allocation:",
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

  // 8. Referral & Direct Matching
  referral: {
    sectionTitle: "Request Tailored CNC Technical Nomination",
    sectionSubtitle: "Specify your required machinery and engineering skills, and our team will match and nominate suitable candidates directly.",
    requestBtn: "Request Nomination +",
    industryLabel: "Industry (Alphabetical):",
    jobTitleLabel: "Target Job Title:",
    machinesLabel: "Machines & Control Systems:",
    minExpLabel: "Minimum Experience (Years):",
    locationLabel: "Preferred Location:",
    salaryLabel: "Proposed Budget / Salary:",
    notesLabel: "Additional Requirements / Shift Info:",
    submitBtn: "Submit Nomination Request",
  },
} as const;
