// Multi-language translations for Project Kisan
export const translations = {
  en: {
    // Splash Screen
    appTitle: "Project Kisan",
    appSubtitle: "AI-Powered Agricultural Assistant",
    
    // Language Selection
    selectLanguage: "Namaste! Select your Plantix language",
    accept: "Accept",
    termsOfUse: "terms of use",
    privacyPolicy: "privacy policy",
    termsText: "By continuing, you agree to our",
    and: "and",
    
    // Feature Walkthrough
    instantDiseaseDetection: "Instant Disease Detection",
    diseaseDetectionDesc: "Take a photo of your crop and get instant AI-powered disease diagnosis with treatment recommendations.",
    greatProductDeals: "Great Product Deals",
    productDealsDesc: "Discover the best deals on agricultural products, seeds, fertilizers, and farming equipment.",
    supportiveCommunity: "Supportive Farming Community",
    communityDesc: "Connect with fellow farmers, share experiences, and get support from our agricultural community.",
    skip: "Skip",
    next: "Next",
    
    // Permissions
    allowNotifications: "Allow notifications",
    notificationDesc: "To receive important disease trends, weather alerts and helpful farming tips.",
    allowLocation: "Access to device location",
    locationDesc: "To provide you with localized content, Plantix needs access to your device's location.",
    allow: "Allow",
    
    // Farming Type
    chooseFarmingType: "Choose what describes you best",
    farmingTypeDesc: "This helps us provide personalized farming advice",
    growInPots: "I grow crops in pots",
    potsDesc: "Container gardening and small-scale cultivation",
    growInGarden: "I grow crops in my home garden",
    gardenDesc: "Backyard farming and kitchen gardens",
    growInFields: "I grow crops in fields",
    fieldsDesc: "Large-scale agricultural farming",
    
    // Crop Selection
    selectCrops: "Select crops",
    selectCropsDesc: "Select up to 8 crops you are interested in. You can always change it later.",
    
    // Home Screen
    plantix: "Plantix",
    yourCrops: "Your Crops",
    quickActions: "Quick Actions",
    diagnosePlant: "Diagnose Plant Problem",
    askQuestion: "Ask Question",
    govSchemes: "Gov Schemes",
    cropCalendar: "Crop Calendar",
    cropHealthStatus: "Crop Health Status",
    overallHealthy: "Overall Healthy",
    lastCheckDesc: "Last checked 2 days ago",
    checkNow: "Check Now",
    manageFields: "Manage your fields",
    startPrecisionFarming: "Start precision farming",
    precisionFarmingDesc: "Add your field to get tailored insights and nutrient plans.",
    sprayingUnfavorable: "⚠️ Spraying Unfavorable",
    
    // Voice Input Screen
    aiAssistant: "AI Assistant",
    listening: "Listening...",
    typeMessage: "Type your message...",
    aiTyping: "AI is typing...",
    onlineStatus: "Online",
    welcomeMessage: "Hello! I'm your AI farming assistant. How can I help you today?",
    quickQuestions: "Quick Questions:",
    tomatoDiseases: "Tomato diseases",
    wheatPrices: "Wheat prices",
    governmentSchemes: "Government schemes",
    
    // Crop Health Screen
    identifyCropProblem: "Identify Crop Problem",
    noImageSelected: "No image selected",
    takePhoto: "Take Photo",
    chooseFromGallery: "Choose from Gallery",
    analyzingCrop: "Analyzing your crop...",
    diagnosisAndTreatment: "Diagnosis & Treatment",
    analyzeAnother: "Analyze Another Image",
    bestResults: "How to get the best results:",
    instruction1: "• Take clear, well-lit photos",
    instruction2: "• Focus on affected plant parts",
    instruction3: "• Include leaves, stems, or fruits showing symptoms",
    instruction4: "• Avoid blurry or dark images",
    instruction5: "• Add specific questions for better diagnosis",
    
    // Market Prices Screen
    marketPrices: "Market Prices",
    selectCrop: "Select Crop",
    marketData: "Market Data",
    todaysPrice: "Today's Price",
    aiMarketInsights: "AI Market Insights",
    quickStats: "Quick Stats",
    yesterday: "Yesterday",
    weekHigh: "Week High",
    weekLow: "Week Low",
    lastUpdated: "Last updated",
    
    // Bottom Navigation
    community: "Community",
    market: "Market",
    you: "You",
    
    // Common
    userId: "User ID",
    language: "Language",
    loading: "Loading...",
    error: "Error",
    retry: "Retry",
    cancel: "Cancel",
    ok: "OK",
    
    // Crops
    tomato: "Tomato",
    wheat: "Wheat",
    rice: "Rice",
    onion: "Onion",
    potato: "Potato",
    corn: "Corn",
  }
}

export const getTranslation = (language, key) => {
  return translations.en[key] || key
}