/**
 * ============================================================================
 * AegisMed – Core Application Engine
 * Unified State Machine, Clock Simulator, Audio Synthesizer & DOM Controller
 * ============================================================================
 */

function getLocalFormattedDate(date) {
  const d = date || new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseLocalDate(dateStr) {
  if (!dateStr) return new Date();
  const parts = dateStr.split('-');
  if (parts.length < 3) return new Date(dateStr);
  const [y, m, d] = parts.map(Number);
  return new Date(y, m - 1, d);
}

// ==========================================
// 0. TRANSLATION DICTIONARIES (English, Hindi, Telugu)
// ==========================================
const TRANSLATIONS = {
  en: {
    title: "MediCare Reminder",
    subtitle: "Guardian of Your Health",
    todayTrack: "Today's Track",
    cabinetStock: "Cabinet & Stock",
    adherenceStats: "Adherence Stats",
    takenRatio: "Today's Ratio",
    streak: "Streak",
    nextSched: "Next Scheduled Dose",
    allCaughtUp: "All caught up!",
    dueRightNow: "DOSE DUE RIGHT NOW",
    skipDose: "Skip Dose",
    snooze: "Snooze (10 mins)",
    markTaken: "Mark Taken",
    presetLabel: "Quick-Add Common Medication Preset",
    presetSub: "Pre-fills standard clinical details for typical elder care treatments",
    medName: "Medicine Name",
    formType: "Form / Type",
    dosageStrength: "Dosage Strength",
    colorAccent: "Card Color Accent",
    takeTimes: "Scheduled Reminders (Take Times)",
    addTimeRow: "+ Add Another Time Slot",
    frequency: "Frequency",
    everyDay: "Every Day",
    specificDays: "Specific Days of Week",
    stockRefillGuard: "Stock Refill Guard (Optional)",
    currStock: "Current Stock Qty",
    refillThreshold: "Refill Threshold Alert",
    instructions: "Additional Instructions",
    cancel: "Cancel",
    saveMed: "Save Medication",
    emptyCabinet: "Your medicine cabinet is empty! Add your first medicine to generate your daily schedule.",
    addMedNow: "Add Medicine Now",
    ttsAlert: "Attention. It is time to take your dose of {dosage} of {name}. {instructions}",
    tempPrompt: "Please enter your current body temperature in °F (e.g. 100.5):",
    invalidTemp: "Please enter a valid body temperature (e.g. 98.6 to 105.0 °F).",
    safetyGapBlocked: "🚨 SAFETY SHIELD BLOCKED:\n\nIt has only been {hours} hours since your last dose.\n\nRecommended gap is at least {gap} hours.\n\nPlease wait another {rem} hours.",
    safetyMaxBlocked: "🚨 SAFETY SHIELD BLOCKED:\n\nYou have already taken {doses} doses in the last 24 hours.\n\nThe safe daily limit is {max} doses.\n\nIndication: Contact a doctor if fever persists.",
    highTempWarning: "⚠️ CRITICAL WARNING:\n\nYour temperature is very high ({temp}).\n\nPlease call your doctor immediately or visit the nearest hospital!",
    highTempWarningSpeech: "Critical Warning. Your temperature is very high. Please contact your doctor or visit the hospital immediately.",
    callDoctor: "Call Doctor",
    callEmergency: "Emergency Helpline",
    
    // Auth translations
    loginTitle: "Patient Login",
    loginSub: "Log in to track your medicine schedules & appointments",
    loginUserLabel: "Email or Mobile Number",
    password: "Password",
    loginBtn: "Log In",
    noAccount: "Don't have an account?",
    registerLink: "Register Now",
    registerTitle: "Patient Registration",
    registerSub: "Create a medical profile to customize your health reminders",
    regName: "Patient Full Name",
    regAge: "Age",
    regGender: "Gender",
    regBlood: "Blood Group",
    regMobile: "Mobile Number",
    regEmail: "Email Address",
    regAddress: "Home Address",
    regPhoto: "Profile Photo (Add from Gallery)",
    addFromGallery: "Add from Gallery",
    regEmergency: "Emergency Contact Number",
    regPassword: "Create Password",
    regDocHeader: "Primary Doctor Contact Information",
    regDocName: "Doctor's Name",
    regDocPhone: "Doctor's Phone Number",
    registerBtn: "Register & Log In",
    hasAccount: "Already have an account?",
    logout: "Log Out",
    edit: "Edit",
    
    // DB Vitals & SOS
    dbConfigBtn: "Database",
    dbConfigTitle: "Cloud Database Settings",
    dbConfigDesc: "Connect your app to a Firebase Firestore cloud database for persistent logins and state syncing. If empty, the app will fallback to local SQLite storage.",
    dbConfigLabel: "Firebase Configuration JSON",
    dbConfigPlaceholder: "Paste your Firebase configuration object here...",
    dbConfigSave: "Connect & Save",
    dbConfigReset: "Reset to SQLite",
    dbConfigSuccess: "Connected to Firebase Firestore cloud database! Reloading...",
    dbConfigResetSuccess: "Reset to local SQLite database! Reloading...",
    dbConfigInvalid: "Invalid Firebase Config JSON! Please check the format.",
    healthTrackerNav: "Health Tracker",
    caregiverDashboardNav: "Caregiver Info",
    labelPatientLink: "Linked Patient Email / Mobile",
    healthTrackerTitle: "Health Tracker",
    healthTrackerDesc: "Log and monitor your daily vital signs (Blood Pressure, Blood Sugar, Pulse, and Weight)",
    logReadingHeader: "Log New Vital Signs",
    labelSystolic: "Systolic BP (mmHg)",
    labelDiastolic: "Diastolic BP (mmHg)",
    labelBloodSugar: "Blood Sugar (mg/dL)",
    labelSugarType: "Sugar Context",
    optFasting: "Fasting",
    optPostPrandial: "Post-Prandial (After Food)",
    labelPulse: "Pulse Rate (BPM)",
    labelWeight: "Weight (kg)",
    saveReading: "Save Vitals",
    titleBP: "Blood Pressure",
    titleSugar: "Blood Sugar",
    titlePulse: "Pulse Rate",
    titleWeight: "Body Weight",
    noData: "No Data",
    vitalsHistory: "Vitals Log History",
    thDate: "Date & Time",
    thBP: "Blood Pressure",
    thSugar: "Blood Sugar",
    thPulse: "Pulse Rate",
    thWeight: "Weight",
    noVitalsLogged: "No vitals registered yet. Submit the form above to record readings.",
    noLinkedPatientTitle: "No Linked Patient",
    noLinkedPatientDesc: "You haven't linked any patient profile. To start monitoring, please enter your patient's registered Email or Mobile Number during registration, or configure it in your account details.",
    cgTitleAdherence: "Patient Adherence",
    cgStreak: "Daily Streak",
    cgTitleSchedule: "Today's Intake Checklist",
    cgNoMedsToday: "No medications scheduled for today.",
    cgTitleVitals: "Latest Patient Vitals",
    emergencySosTitle: "EMERGENCY SOS ALERT",
    sosActivated: "SOS Alarm Activated!",
    sosEmergencyContact: "Emergency Contact:",
    sosDoctorContact: "Primary Doctor:",
    sosHelpline: "Emergency Helpline:",
    sosDeactivate: "STOP ALARM & DEACTIVATE",
    
    // Appointments translations
    checkups: "Appointments",
    appointmentSchedulerTitle: "Doctor Check-ups",
    appointmentSchedulerDesc: "Schedule and manage your doctor consultations and follow-up medical tests",
    addAppointment: "Book Appointment",
    upcomingAppointments: "Upcoming Check-ups",
    noAppointments: "No check-ups scheduled. Stay healthy by booking regular follow-ups!",
    appointmentHistory: "Consultation History",
    appointmentDate: "Date & Time",
    appointmentDoc: "Doctor Name",
    appointmentPurpose: "Purpose / Notes",
    appointmentStatus: "Status",
    noPastAppointments: "No past appointments recorded.",
    bookAppointmentTitle: "Schedule Doctor Check-up",
    appointmentDateInput: "Appointment Date",
    appointmentTimeInput: "Appointment Time",
    appointmentPurposeInput: "Purpose / Consultation Notes",
    saveAppointment: "Schedule Check-up",
    
    // Sound preview panel
    accHelperTitle: "Accessibility Helper",
    accHelperSub: "Tailor the app for absolute readability and vocal support",
    textScalingLabel: "Text Scaling (Optimal for Elderly Users)",
    normal: "Normal",
    large: "Large",
    xlarge: "Extra Large",
    highContrastMode: "High Contrast Mode",
    voiceReadOut: "Voice Read-Out Alerts",
    voiceReadOutSub: "Reads dosage instructions aloud when due",
    doctorPhoneLabel: "Doctor's Helpline Number",
    save: "Save",
    soundTestTitle: "Alert Sounds Guide (Hear and Learn)",
    soundTestSub: "Click to listen and understand each alarm type:",
    soundTestChimeBtn: "🔔 Test Medicine Time Chime (Take Medicine)",
    soundTestSirenBtn: "🚨 Test Emergency Siren (Go to Hospital)",
    profileTitle: "Patient Profile Details",
    profileAge: "Age",
    profileGender: "Gender",
    profileBlood: "Blood Group",
    profileMobile: "Mobile Number",
    profileEmail: "Email Address",
    profileAddress: "Home Address",
    profileEmergency: "Emergency Contact",
    profileDocName: "Primary Doctor",
    profileDocPhone: "Doctor Contact",
    close: "Close",
    preAlertMedTitle: "Medicine Reminder (In 5 mins)",
    preAlertMedBody: "It will be time to take {dosage} of {name} in 5 minutes.",
    preAlertApptTitle: "Check-up Reminder (In 5 mins)",
    preAlertApptBody: "Appointment with Dr. {doctorName} for {purpose} in 5 minutes."
  },
  hi: {
    title: "मेडिकेयर रिमाइंडर",
    subtitle: "आपके स्वास्थ्य का रक्षक",
    todayTrack: "आज का ट्रैक",
    cabinetStock: "दवा कैबिनेट",
    adherenceStats: "पालन रिकॉर्ड",
    takenRatio: "आज का अनुपात",
    streak: "लगातार दिन",
    nextSched: "अगली खुराक",
    allCaughtUp: "सब पूरा हो गया!",
    dueRightNow: "दवा का समय हो गया है!",
    skipDose: "छोड़ें",
    snooze: "सूझ (10 मिनट)",
    markTaken: "दवा ले ली",
    presetLabel: "सामान्य दवा प्रीसेट",
    presetSub: "बुजुर्गों के सामान्य इलाज के लिए जानकारी स्वतः भरें",
    medName: "दवा का नाम",
    formType: "प्रकार",
    dosageStrength: "खुराक की मात्रा",
    colorAccent: "कार्ड का रंग",
    takeTimes: "दवा लेने का समय",
    addTimeRow: "+ एक और समय जोड़ें",
    frequency: "दवा की आवृत्ति",
    everyDay: "हर दिन",
    specificDays: "सप्ताह के विशिष्ट दिन",
    stockRefillGuard: "स्टॉक चेतावनी",
    currStock: "वर्तमान स्टॉक संख्या",
    refillThreshold: "न्यूनतम स्टॉक चेतावनी सीमा",
    instructions: "विशेष निर्देश",
    cancel: "रद्द करें",
    saveMed: "दवा सहेजें",
    emptyCabinet: "दवा कैबिनेट खाली है! दैनिक कार्यक्रम के लिए दवा जोड़ें।",
    addMedNow: "दवा जोड़ें",
    ttsAlert: "ध्यान दें। {name} की {dosage} खुराक लेने का समय हो गया है। {instructions}",
    tempPrompt: "कृपया अपना वर्तमान शारीरिक तापमान °F (जैसे 100.5) दर्ज करें:",
    invalidTemp: "कृपया सही तापमान दर्ज करें (98.6 से 105.0 °F)।",
    safetyGapBlocked: "🚨 सुरक्षा कवच चेतावनी:\n\nआपकी पिछली खुराक को केवल {hours} घंटे हुए हैं।\n\nअनुशंसित अंतर कम से कम {gap} घंटे है।\n\nकृपया {rem} घंटे और प्रतीक्षा करें।",
    safetyMaxBlocked: "🚨 सुरक्षा कवच चेतावनी:\n\nआप पिछले 24 घंटों में पहले ही {doses} खुराक ले चुके हैं।\n\nसुरक्षित दैनिक सीमा {max} खुराक है।\n\nबुखार बने रहने पर डॉक्टर से संपर्क करें।",
    highTempWarning: "⚠️ गंभीर चेतावनी:\n\nआपका तापमान बहुत अधिक ({temp}) है।\n\nकृपया तुरंत डॉक्टर को कॉल करें या निकटतम अस्पताल जाएं!",
    highTempWarningSpeech: "गंभीर चेतावनी। आपका तापमान बहुत अधिक है। कृपया तुरंत अपने डॉक्टर से संपर्क करें या अस्पताल जाएं।",
    callDoctor: "डॉक्टर को कॉल करें",
    callEmergency: "हेल्पलाइन नंबर",
    
    // Auth translations (hi)
    loginTitle: "मरीज लॉगिन",
    loginSub: "अपनी दवा के कार्यक्रम और डॉक्टर की नियुक्तियों को ट्रैक करें",
    loginUserLabel: "ईमेल या मोबाइल नंबर",
    password: "पासवर्ड",
    loginBtn: "लॉगिन करें",
    noAccount: "खाता नहीं है?",
    registerLink: "अभी रजिस्टर करें",
    registerTitle: "मरीज पंजीकरण (रजिस्ट्रेशन)",
    registerSub: "दवा और स्वास्थ्य अनुस्मारक को अनुकूलित करने के लिए प्रोफाइल बनाएं",
    regName: "मरीज का पूरा नाम",
    regAge: "उम्र",
    regGender: "लिंग",
    regBlood: "रक्त समूह (ब्लड ग्रुप)",
    regMobile: "मोबाइल नंबर",
    regEmail: "ईमेल पता",
    regAddress: "घर का पता",
    regPhoto: "प्रोफ़ाइल फ़ोटो (गैलरी से जोड़ें)",
    addFromGallery: "गैलरी से जोड़ें",
    regEmergency: "आपातकालीन संपर्क नंबर",
    regPassword: "पासवर्ड बनाएं",
    regDocHeader: "प्राथमिक डॉक्टर संपर्क जानकारी",
    regDocName: "डॉक्टर का नाम",
    regDocPhone: "डॉक्टर का फोन नंबर",
    registerBtn: "पंजीकरण करें और लॉगिन करें",
    hasAccount: "पहले से ही एक खाता है?",
    loginLink: "यहाँ लॉगिन करें",
    logout: "लॉग आउट",
    edit: "संपादित करें",
    
    // DB Vitals & SOS (hi)
    dbConfigBtn: "डेटाबेस",
    dbConfigTitle: "क्लाउड डेटाबेस सेटिंग्स",
    dbConfigDesc: "लॉगिन और डेटा सिंक को सुरक्षित रखने के लिए ऐप को फायरबेस क्लाउड डेटाबेस से कनेक्ट करें। खाली छोड़ने पर लोकल SQLite का उपयोग होगा।",
    dbConfigLabel: "फायरबेस कॉन्फ़िगरेशन JSON",
    dbConfigPlaceholder: "यहाँ अपना फायरबेस कॉन्फ़िगरेशन ऑब्जेक्ट पेस्ट करें...",
    dbConfigSave: "कनेक्ट और सहेजें",
    dbConfigReset: "लोकल SQLite पर रीसेट करें",
    dbConfigSuccess: "फायरबेस क्लाउड डेटाबेस से कनेक्ट हो गया! रीलोड हो रहा है...",
    dbConfigResetSuccess: "लोकल SQLite डेटाबेस पर रीसेट हो गया! रीलोड हो रहा है...",
    dbConfigInvalid: "अवैध फायरबेस कॉन्फ़िगरेशन JSON! कृपया प्रारूप की जाँच करें।",
    healthTrackerNav: "हेल्थ ट्रैकर",
    caregiverDashboardNav: "केयरगिवर जानकारी",
    labelPatientLink: "लिंक्ड मरीज का ईमेल / मोबाइल",
    healthTrackerTitle: "स्वास्थ्य ट्रैकर (Health)",
    healthTrackerDesc: "अपने दैनिक महत्वपूर्ण लक्षणों (रक्तचाप, ब्लड शुगर, पल्स और वजन) को लॉग और मॉनिटर करें",
    logReadingHeader: "नए महत्वपूर्ण लक्षण दर्ज करें",
    labelSystolic: "सिस्टोलिक रक्तचाप (Systolic)",
    labelDiastolic: "डायस्टोलिक रक्तचाप (Diastolic)",
    labelBloodSugar: "ब्लड शुगर (mg/dL)",
    labelSugarType: "शुगर का संदर्भ",
    optFasting: "खाली पेट (Fasting)",
    optPostPrandial: "खाने के बाद (Post-Prandial)",
    labelPulse: "पल्स दर (BPM)",
    labelWeight: "वजन (kg)",
    saveReading: "लक्षण सहेजें",
    titleBP: "रक्तचाप (BP)",
    titleSugar: "ब्लड शुगर",
    titlePulse: "पल्स दर",
    titleWeight: "शारीरिक वजन",
    noData: "कोई डेटा नहीं",
    vitalsHistory: "लक्षण लॉग इतिहास",
    thDate: "दिनांक और समय",
    thBP: "रक्तचाप (BP)",
    thSugar: "ब्लड शुगर",
    thPulse: "पल्स दर",
    thWeight: "वजन",
    noVitalsLogged: "अभी तक कोई लक्षण दर्ज नहीं किया गया है। विवरण भरने के लिए ऊपर दिया गया फॉर्म जमा करें।",
    noLinkedPatientTitle: "कोई लिंक किया हुआ मरीज नहीं",
    noLinkedPatientDesc: "आपने कोई मरीज प्रोफ़ाइल लिंक नहीं की है। मॉनिटरिंग शुरू करने के लिए, कृपया पंजीकरण के दौरान अपने मरीज का पंजीकृत ईमेल या मोबाइल नंबर दर्ज करें।",
    cgTitleAdherence: "मरीज दवा अनुपालन",
    cgStreak: "दैनिक स्ट्रीक",
    cgTitleSchedule: "आज की दवा सूची",
    cgNoMedsToday: "आज के लिए कोई दवा निर्धारित नहीं है।",
    cgTitleVitals: "मरीज के नवीनतम लक्षण",
    emergencySosTitle: "आपातकालीन आपातकालीन चेतावनी (SOS)",
    sosActivated: "एसओएस अलार्म चालू हो गया!",
    sosEmergencyContact: "आपातकालीन संपर्क:",
    sosDoctorContact: "प्राथमिक डॉक्टर:",
    sosHelpline: "आपातकालीन हेल्पलाइन:",
    sosDeactivate: "अलार्म बंद करें और निष्क्रिय करें",
    
    // Appointments translations (hi)
    checkups: "नियुक्तियां",
    appointmentSchedulerTitle: "डॉक्टर नियुक्तियां",
    appointmentSchedulerDesc: "डॉक्टर से परामर्श और नियमित चिकित्सा परीक्षण निर्धारित और प्रबंधित करें",
    addAppointment: "अपॉइंटमेंट बुक करें",
    upcomingAppointments: "आगामी डॉक्टर जांच",
    noAppointments: "कोई अपॉइंटमेंट निर्धारित नहीं है। नियमित जांच करवाएं और स्वस्थ रहें!",
    appointmentHistory: "परामर्श इतिहास",
    appointmentDate: "दिनांक और समय",
    appointmentDoc: "डॉक्टर का नाम",
    appointmentPurpose: "उद्देश्य / विशेष निर्देश",
    appointmentStatus: "स्थिति",
    noPastAppointments: "कोई पुराना इतिहास दर्ज नहीं है।",
    bookAppointmentTitle: "डॉक्टर अपॉइंटमेंट शेड्यूल करें",
    appointmentDateInput: "अपॉइंटमेंट तिथि",
    appointmentTimeInput: "अपॉइंटमेंट समय",
    appointmentPurposeInput: "परामर्श उद्देश्य / नोट्स",
    saveAppointment: "शेड्यूल सहेजें",
    
    // Sound preview panel (hi)
    accHelperTitle: "पहुंच-योग्यता सहायता (Accessibility)",
    accHelperSub: "बेहतर पठनीयता और आवाज सहायता के लिए ऐप को अनुकूलित करें",
    textScalingLabel: "टेक्स्ट का आकार (बुजुर्गों के लिए सर्वोत्तम)",
    normal: "सामान्य",
    large: "बड़ा",
    xlarge: "बहुत बड़ा",
    highContrastMode: "उच्च विपरीतता मोड (High Contrast)",
    voiceReadOut: "वॉयस रीड-आउट अलर्ट",
    voiceReadOutSub: "समय होने पर दवा के निर्देश जोर से पढ़कर सुनाएं",
    doctorPhoneLabel: "डॉक्टर का हेल्पलाइन नंबर",
    save: "सहेजें",
    soundTestTitle: "अलर्ट ध्वनियां गाइड (सुनें और समझें)",
    soundTestSub: "प्रत्येक प्रकार के अलार्म को सुनने और समझने के लिए क्लिक करें:",
    soundTestChimeBtn: "🔔 दवा घंटी टेस्ट (दवा लेने का समय)",
    soundTestSirenBtn: "🚨 आपातकालीन सायरन टेस्ट (अस्पताल जाने का समय)",
    profileTitle: "मरीज का विवरण (प्रफ़ाइल)",
    profileAge: "उम्र",
    profileGender: "लिंग",
    profileBlood: "रक्त समूह (ब्लड ग्रुप)",
    profileMobile: "मोबाइल नंबर",
    profileEmail: "ईमेल पता",
    profileAddress: "घर का पता",
    profileEmergency: "आपातकालीन संपर्क",
    profileDocName: "प्राथमिक डॉक्टर",
    profileDocPhone: "डॉक्टर का फोन नंबर",
    close: "बंद करें",
    preAlertMedTitle: "दवा की याद (5 मिनट में)",
    preAlertMedBody: "5 मिनट में आपको {name} ({dosage}) की खुराक लेनी होगी।",
    preAlertApptTitle: "डॉक्टर अपॉइंटमेंट (5 मिनट में)",
    preAlertApptBody: "5 मिनट में डॉक्टर {doctorName} ({purpose}) के साथ आपकी नियुक्ति है।"
  },
  te: {
    title: "మెడికేర్ రిమైండర్",
    subtitle: "మీ ఆరోగ్య రక్షకుడు",
    todayTrack: "నేటి ట్రాక్",
    cabinetStock: "మందుల క్యాబినెట్",
    adherenceStats: "ఆరోగ్య నివేదిక",
    takenRatio: "నేటి నిష్పత్తి",
    streak: "వరుస రోజులు",
    nextSched: "తదుపరి మందు సమయం",
    allCaughtUp: "ఈ రోజుకి అన్నీ పూర్తయ్యాయి!",
    dueRightNow: "మందు వేసుకునే సమయం అయింది!",
    skipDose: "వద్దు",
    snooze: "స్నూజ్ (10 నిమిషాలు)",
    markTaken: "వేసుకున్నాను",
    presetLabel: "సాధారణ మందుల ఎంపిక",
    presetSub: "సాధారణ చికిత్సల వివరాలు నేరుగా ఎంచుకోండి",
    medName: "మందు పేరు",
    formType: "రకం",
    dosageStrength: "డోస్ పరిమాణం",
    colorAccent: "కార్డ్ రంగు",
    takeTimes: "మందు వేసుకునే సమయాలు",
    addTimeRow: "+ మరొక సమయం జోడించు",
    frequency: "మందు వేసుకునే విధానం",
    everyDay: "ప్రతి రోజు",
    specificDays: "వారంలో కొన్ని రోజులు",
    stockRefillGuard: "స్టాక్ హెచ్చరిక",
    currStock: "ప్రస్తుత స్టాక్ పరిమాణం",
    refillThreshold: "కనిష్ట స్టాక్ పరిమితి",
    instructions: "ప్రత్యేక సూచనలు",
    cancel: "రద్దు చేయి",
    saveMed: "మందు సేవ్ చేయి",
    emptyCabinet: "మందుల క్యాబినెట్ ఖాళీగా ఉంది! రోజువారీ వివరాల కోసం మందును జోడించండి.",
    addMedNow: "మందు జోడించు",
    ttsAlert: "గమనించండి. మీ {name} యొక్క {dosage} డోస్ తీసుకోవడానికి ఇది సమయం. {instructions}",
    tempPrompt: "దయచేసి మీ ప్రస్తుత శరీర ఉష్ణోగ్రతను °F (ఉదాహరణకు 100.5) లో నమోదు చేయండి:",
    invalidTemp: "దయచేసి సరైన ఉష్ణోగ్రతను నమోదు చేయండి (98.6 to 105.0 °F).",
    safetyGapBlocked: "🚨 సేఫ్టీ షీల్డ్ నిరోధించింది:\n\nమీ చివరి డోస్ వేసుకుని కేవలం {hours} గంటలు మాత్రమే అయింది.\n\nవైద్యులు సూచించిన కనీస సమయం {gap} గంటలు.\n\nదయచేసి మరొక {rem} గంటలు వేచి ఉండండి.",
    safetyMaxBlocked: "🚨 సేఫ్టీ షీల్డ్ నిరోధించింది:\n\nగడచిన 24 గంటలలో మీరు ఇప్పటికే {doses} డోసులు వేసుకున్నారు.\n\nసురక్షితమైన రోజువారీ గరిష్ట పరిమితి {max} డోసులు మాత్రమే.\n\nజ్వరం తగ్గకపోతే డాక్టర్‌ను సంప్రదించండి.",
    highTempWarning: "⚠️ అత్యవసర హెచ్చరిక:\n\nమీ శరీర ఉష్ణోగ్రత చాలా ఎక్కువగా ఉంది ({temp}).\n\nదయచేసి వెంటనే మీ వైద్యుడిని సంప్రదించండి లేదా సమీపంలోని ఆసుపత్రికి వెళ్ళండి!",
    highTempWarningSpeech: "తీవ్రమైన హెచ్చరిక. మీ ఉష్ణోగ్రత చాలా ఎక్కువగా ఉంది. దయచేసి వెంటనే మీ వైద్యుడిని సంప్రదించండి లేదా ఆసుపత్రికి వెళ్ళండి.",
    callDoctor: "వైద్యుడిని సంప్రదించండి",
    callEmergency: "అత్యవసర హెల్ప్‌లైన్",
    
    // Auth translations (te)
    loginTitle: "రోగి లాగిన్",
    loginSub: "మీ మందుల షెడ్యూల్‌లు & డాక్టర్ అపాయింట్‌మెంట్‌లను ట్రాక్ చేయండి",
    loginUserLabel: "ఇమెయిల్ లేదా మొబైల్ నంబర్",
    password: "పాస్‌వర్డ్",
    loginBtn: "లాగిన్ అవ్వండి",
    noAccount: "ఖాతా లేదా ప్రొఫైల్ లేదా?",
    registerLink: "ఇప్పుడే నమోదు చేసుకోండి",
    registerTitle: "రోగి రిజిస్ట్రేషన్ (నమోదు)",
    registerSub: "మీ ఆరోగ్య రిమైండర్‌లను అనుకూలీకరించడానికి ప్రొఫైల్ సృష్టించండి",
    regName: "రోగి పూర్తి పేరు",
    regAge: "వయస్సు",
    regGender: "లింగం",
    regBlood: "రక్త సమూహం (బ్లడ్ గ్రూప్)",
    regMobile: "మొబైల్ నంబర్",
    regEmail: "ఇమెయిల్ చిరునామా",
    regAddress: "ఇంటి చిరునామా",
    regPhoto: "ప్రొఫైల్ ఫోటో (గ్యాలరీ నుండి జోడించు)",
    addFromGallery: "గ్యాలరీ నుండి జోడించు",
    regEmergency: "అత్యవసర సంప్రదింపు సంఖ్య",
    regPassword: "పాస్‌వర్డ్ సృష్టించండి",
    regDocHeader: "ప్రాథమిక వైద్యుని సంప్రదింపు వివరాలు",
    regDocName: "వైద్యుని పేరు",
    regDocPhone: "వైద్యుని ఫోన్ నంబర్",
    registerBtn: "రిజిస్టర్ & లాగిన్ అవ్వండి",
    hasAccount: "ఇప్పటికే ఖాతా ఉందా?",
    loginLink: "ఇక్కడ లాగిన్ అవ్వండి",
    logout: "లాగ్ అవుట్",
    edit: "సవరించు",
    
    // DB Vitals & SOS (te)
    dbConfigBtn: "డేటాబేస్",
    dbConfigTitle: "క్లౌడ్ డేటాబేస్ సెట్టింగులు",
    dbConfigDesc: "శాశ్వత లాగిన్‌లు మరియు డేటా సమకాలీకరణ కోసం మీ అనువర్తనాన్ని ఫైర్‌బేస్ క్లౌడ్ డేటాబేస్‌కు అనుసంధానించండి. ఖాళీగా ఉంటే లోకల్ SQLite ఉపయోగించబడుతుంది.",
    dbConfigLabel: "ఫైర్‌బేస్ కాన్ఫిగరేషన్ JSON",
    dbConfigPlaceholder: "మీ ఫైర్‌బేస్ కాన్ఫిగరేషన్ ఆబ్జెక్ట్‌ను ఇక్కడ పేస్ట్ చేయండి...",
    dbConfigSave: "కనెక్ట్ & సేవ్ చేయి",
    dbConfigReset: "లోకల్ SQLite కి రీసెట్ చేయి",
    dbConfigSuccess: "ఫైర్‌బేస్ క్లౌడ్ డేటాబేస్‌కు అనుసంధానించబడింది! రీలోడ్ అవుతోంది...",
    dbConfigResetSuccess: "లోకల్ SQLite డేటాబేస్‌కు రీసెట్ చేయబడింది! రీలోడ్ అవుతోంది...",
    dbConfigInvalid: "చెల్లని ఫైర్‌బేస్ కాన్ఫిగరేషన్ JSON! దయచేసి ఆకృతిని తనిఖీ చేయండి.",
    healthTrackerNav: "హెల్త్ ట్రాకర్",
    caregiverDashboardNav: "కేర్‌గివర్ సమాచారం",
    labelPatientLink: "లింక్ చేయబడిన రోగి ఇమెయిల్ / మొబైల్",
    healthTrackerTitle: "ఆరోగ్య ట్రాకర్ (Health)",
    healthTrackerDesc: "మీ రోజువారీ కీలక సంకేతాలను (రక్తపోటు,రక్తంలో చక్కెర, పల్స్ మరియు బరువు) నమోదు చేయండి మరియు పర్యవేక్షించండి",
    logReadingHeader: "కొత్త కీలక సంకేతాలను నమోదు చేయండి",
    labelSystolic: "సిస్టోలిక్ బీపీ (mmHg)",
    labelDiastolic: "డయాస్టోలిక్ బీపీ (mmHg)",
    labelBloodSugar: "రక్తంలో చక్కెర (mg/dL)",
    labelSugarType: "షుగర్ సందర్భం",
    optFasting: "ఉదయాన్నే (Fasting)",
    optPostPrandial: "భోజనం తర్వాత (Post-Prandial)",
    labelPulse: "నాడి వేగం (BPM)",
    labelWeight: "బరువు (kg)",
    saveReading: "వివరాలు సేవ్ చేయి",
    titleBP: "రక్తపోటు (BP)",
    titleSugar: "బ్లడ్ షుగర్",
    titlePulse: "నాడి వేగం",
    titleWeight: "శరీర బరువు",
    noData: "వివరాలు లేవు",
    vitalsHistory: "ఆరోగ్య నివేదికల చరిత్ర",
    thDate: "తేదీ & సమయం",
    thBP: "రక్తపోటు (BP)",
    thSugar: "బ్లడ్ షుగర్",
    thPulse: "నాడి వేగం",
    thWeight: "బరువు",
    noVitalsLogged: "ఆరోగ్య వివరాలు ఇంకా నమోదు చేయలేదు. నమోదు చేయడానికి పై ఫారమ్‌ను సమర్పించండి.",
    noLinkedPatientTitle: "రోగి ప్రొఫైల్ లింక్ చేయబడలేదు",
    noLinkedPatientDesc: "మీరు ఏ రోగి ప్రొఫైల్‌ను లింక్ చేయలేదు. పర్యవేక్షణ ప్రారంభించడానికి, దయచేసి రోగి నమోదు చేసిన ఈమెయిల్ లేదా మొబైల్ నంబరును నమోదు చేయండి.",
    cgTitleAdherence: "రోగి మందుల నిష్పత్తి",
    cgStreak: "రోజువారీ స్ట్రీక్",
    cgTitleSchedule: "నేటి మందుల జాబితా",
    cgNoMedsToday: "ఈ రోజు మందులు ఏవీ షెడ్యూల్ చేయబడలేదు.",
    cgTitleVitals: "రోగి తాజా ఆరోగ్య వివరాలు",
    emergencySosTitle: "అత్యవసర ఎస్ఓఎస్ హెచ్చరిక (SOS)",
    sosActivated: "ఎస్ఓఎస్ అలారం మోగింది!",
    sosEmergencyContact: "అత్యవసర సంప్రదింపు:",
    sosDoctorContact: "ప్రాథమిక వైద్యుడు:",
    sosHelpline: "అత్యవసర హెల్ప్‌లైన్:",
    sosDeactivate: "అలారం నిలిపివేయి & ఆపివేయి",
    
    // Appointments translations (te)
    checkups: "అపాయింట్‌మెంట్‌లు",
    appointmentSchedulerTitle: "వైద్యుని అపాయింట్‌మెంట్‌లు",
    appointmentSchedulerDesc: "మీ డాక్టర్ సంప్రదింపులు మరియు తదుపరి ఆరోగ్య పరీక్షలను నిర్వహించుకోండి",
    addAppointment: "అపాయింట్‌మెంట్ బుక్ చేయి",
    upcomingAppointments: "రాబోయే డాక్టర్ పరీక్షలు",
    noAppointments: "అపాయింట్‌మెంట్‌లు ఏవీ లేవు. రెగ్యులర్ చెకప్‌లను బుక్ చేసుకొని ఆరోగ్యంగా ఉండండి!",
    appointmentHistory: "సంప్రదింపుల చరిత్ర",
    appointmentDate: "తేదీ & సమయం",
    appointmentDoc: "వైద్యుని పేరు",
    appointmentPurpose: "కారణం / గమనికలు",
    appointmentStatus: "స్థితి",
    noPastAppointments: "గత చరిత్ర ఏదీ నమోదు కాలేదు.",
    bookAppointmentTitle: "డాక్టర్ చెకప్ షెడ్యూల్ చేయి",
    appointmentDateInput: "అపాయింట్‌మెంట్ తేదీ",
    appointmentTimeInput: "అపాయింట్‌మెంట్ సమయం",
    appointmentPurposeInput: "సంప్రదింపు కారణం / గమనికలు",
    saveAppointment: "అపాయింట్‌మెంట్ ఖరారు చేయి",
    
    // Sound preview panel (te)
    accHelperTitle: "యాక్సెసిబిలిటీ సహాయకం",
    accHelperSub: "పూర్తి రీడబిలిటీ మరియు స్వర మద్దతు కోసం యాప్‌ను మార్చుకోండి",
    textScalingLabel: "టెక్స్ట్ సైజు (వృద్ధులకు అనుకూలమైనది)",
    normal: "సాధారణ",
    large: "పెద్దది",
    xlarge: "చాలా పెద్దది",
    highContrastMode: "హై కాంట్రాస్ట్ మోడ్",
    voiceReadOut: "వాయిస్ రీడ్-అవుట్ అలర్ట్‌లు",
    voiceReadOutSub: "సమయానికి డోసేజ్ సూచనలను గట్టిగా చదివి వినిపిస్తుంది",
    doctorPhoneLabel: "వైద్యుడి హెల్ప్‌లైన్ నంబర్",
    save: "సేవ్ చేయి",
    soundTestTitle: "అలారాల శబ్దాల గైడ్ (విని నేర్చుకోండి)",
    soundTestSub: "ప్రతి అలారం రకాన్ని విని అర్థం చేసుకోవడానికి క్లిక్ చేయండి:",
    soundTestChimeBtn: "🔔 మందుల సమయ గంట (మందులు వేసుకోండి)",
    soundTestSirenBtn: "🚨 అత్యవసర సైరన్ (ఆసుపత్రికి వెళ్ళండి)",
    profileTitle: "రోగి ప్రొఫైల్ వివరాలు",
    profileAge: "వయస్సు",
    profileGender: "లింగం",
    profileBlood: "రక్త సమూహం",
    profileMobile: "మొబైల్ నంబర్",
    profileEmail: "ఇమెయిల్ చిరునామా",
    profileAddress: "ఇంటి చిరునామా",
    profileEmergency: "అत्यవసర సంప్రదింపు",
    profileDocName: "ప్రాథమిక వైద్యుడు",
    profileDocPhone: "వైద్యుని ఫోన్ నంబర్",
    close: "మూసివేయి",
    preAlertMedTitle: "మందుల రిమైండర్ (5 నిమిషాల్లో)",
    preAlertMedBody: "5 నిమిషాల్లో మీరు {name} ({dosage}) మోతాదు తీసుకోవాలి.",
    preAlertApptTitle: "వైద్య పరీక్ష రిమైండర్ (5 నిమిషాల్లో)",
    preAlertApptBody: "5 నిమిషాల్లో డాక్టర్ {doctorName} ({purpose}) తో మీకు అపాయింట్‌మెంట్ ఉంది."
  }
};

function mapUserFromBackend(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
    mobile: user.mobile,
    age: user.age,
    gender: user.gender,
    blood: user.blood_group || user.blood,
    address: user.address,
    photo: user.photo,
    emergency: user.emergency_contact || user.emergency,
    doctorName: user.primary_doctor_id || user.doctorName,
    doctorPhone: user.doctor_phone || user.doctorPhone
  };
}

function mapSettingsFromBackend(settings) {
  if (!settings) {
    return {
      theme: 'dark',
      fontSize: 'normal',
      speechAlerts: true,
      highContrast: false,
      lang: 'en',
      doctorPhone: ''
    };
  }
  return {
    theme: settings.theme || 'dark',
    fontSize: settings.fontSize || settings.font_size || 'normal',
    speechAlerts: settings.speechAlerts !== undefined 
      ? settings.speechAlerts 
      : (settings.speech_alerts !== undefined 
         ? (settings.speech_alerts === 1 || settings.speech_alerts === true) 
         : true),
    highContrast: settings.highContrast !== undefined 
      ? settings.highContrast 
      : (settings.high_contrast !== undefined 
         ? (settings.high_contrast === 1 || settings.high_contrast === true) 
         : false),
    lang: settings.lang || 'en',
    doctorPhone: settings.doctorPhone || settings.doctor_phone || ''
  };
}

// ==========================================
// 1. STATE STORE (LocalStorage Model)
// ==========================================
class AegisState {
  constructor() {
    this.storageKey = 'aegismed_app_state';
    
    // Default system parameters
    this.data = {
      registeredPatients: [], // Registered patient profiles
      activePatient: null,    // Currently logged-in profile
      appointments: [],       // Doctor check-up appointments
      medicines: [],          // Saved medications inventory
      logs: [],               // Historical logs of taken/skipped doses
      streak: 0,              // Consecutive days adherence streak
      lastCheckedDate: '',    // Used to check if calendar rolled over to a new day
      settings: {
        theme: 'dark',
        fontSize: 'normal',
        speechAlerts: true,
        highContrast: false,
        lang: 'en',           // Default Language
        doctorPhone: ''       // User configured Doctor phone
      },
      // Time Machine Configurations
      simulatedTime: null,    // Custom base timestamp in ms (null means live real time)
      timeSpeed: 1            // Speed scale factor (1x, 5x, 30x, 60x, 600x)
    };

    this.loadState();
  }

  // Load from local storage or set up demo medicines on fresh install
  loadState() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        this.data = JSON.parse(saved);
        // Ensure new structures exist
        if (!this.data.registeredPatients) this.data.registeredPatients = [];
        if (this.data.activePatient === undefined) this.data.activePatient = null;
        if (!this.data.appointments) this.data.appointments = [];
        if (!this.data.medicines) this.data.medicines = [];
        if (!this.data.logs) this.data.logs = [];
        if (!this.data.healthLogs) this.data.healthLogs = [];
        
        // Ensure settings values exist if loaded from older structure
        this.data.settings = mapSettingsFromBackend(this.data.settings);
      } catch (e) {
        console.error("State parse error, fallback to default", e);
      }
    } else {
      // Create seed demo medicines for clean first-glance understanding
      this.data.registeredPatients = [];
      this.data.activePatient = null;
      this.data.appointments = [];
      this.data.medicines = [
        {
          id: 'med_demo_1',
          name: 'Atorvastatin (Cholesterol)',
          type: 'tablet',
          dosage: '1 tablet (20mg)',
          times: ['21:00'],
          frequency: 'daily',
          stock: 28,
          refillAlertAt: 7,
          instructions: 'Take in evening before bedtime',
          color: '#0d9488'
        },
        {
          id: 'med_demo_2',
          name: 'Amoxicillin (Antibiotic)',
          type: 'capsule',
          dosage: '1 capsule (500mg)',
          times: ['08:00', '14:00', '20:00'],
          frequency: 'daily',
          stock: 6,
          refillAlertAt: 5,
          instructions: 'Take after eating food. Complete full course.',
          color: '#0d9488'
        }
      ];
      this.data.lastCheckedDate = getLocalFormattedDate(new Date());
      this.saveState();
    }
  }

  saveState() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    
    // Sync with backend SQLite/Firestore if activePatient is a logged-in patient or caregiver
    const activeUser = this.data.activePatient;
    if (activeUser) {
      const isPatient = activeUser.role === 'patient';
      const isCaregiver = activeUser.role === 'caregiver';
      
      if (isPatient || isCaregiver) {
        // For patient, targetUserId is their own ID. For caregiver, it's the linked patient's ID.
        const targetUserId = isPatient ? activeUser.id : (this.data.linkedPatient ? this.data.linkedPatient.id : null);
        
        if (targetUserId) {
          const stateData = {
            userId: targetUserId,
            medicines: this.data.medicines || [],
            appointments: this.data.appointments || [],
            logs: this.data.logs || [],
            settings: this.data.settings || {},
            healthLogs: this.data.healthLogs || []
          };
          
          if (isPatient) {
            stateData.profile = {
              name: activeUser.name,
              age: activeUser.age,
              gender: activeUser.gender,
              blood: activeUser.blood,
              address: activeUser.address,
              photo: activeUser.photo,
              emergency: activeUser.emergency,
              primaryDoctorId: activeUser.doctorName,
              doctorPhone: activeUser.doctorPhone
            };
          }

          if (typeof db !== 'undefined' && db) {
            // Firestore sync
            let adherence = 0;
            let streak = 0;
            const logs = this.data.logs || [];
            if (logs.length > 0) {
              const taken = logs.filter(l => l.status === 'taken').length;
              adherence = Math.round((taken / logs.length) * 100);
              streak = logs.filter(l => l.status === 'taken').length; // simple count
            }

            db.collection('states').doc(targetUserId).set({
              medicines: stateData.medicines,
              appointments: stateData.appointments,
              logs: stateData.logs,
              settings: stateData.settings,
              healthLogs: stateData.healthLogs
            }, { merge: true })
            .then(() => {
              if (isPatient) {
                return db.collection('users').doc(targetUserId).update({
                  name: activeUser.name || '',
                  age: activeUser.age || null,
                  gender: activeUser.gender || null,
                  blood: activeUser.blood || null,
                  address: activeUser.address || '',
                  photo: activeUser.photo || null,
                  emergency: activeUser.emergency || null,
                  primaryDoctorId: activeUser.doctorName || null,
                  doctorPhone: activeUser.doctorPhone || null,
                  adherence: adherence,
                  streak: streak
                });
              } else {
                return db.collection('users').doc(targetUserId).update({
                  adherence: adherence,
                  streak: streak
                });
              }
            })
            .then(() => console.log("State synced to Firestore successfully"))
            .catch(err => console.error("Error saving state to Firestore:", err));
          } else {
            // Local SQLite / LocalStorage Database Sync
            const syncState = async () => {
              const isVercel = window.location.hostname.includes('vercel.app') || window.location.hostname.includes('github.io');
              if (isVercel) {
                // Direct sync to client-side localStorage DB
                await initLocalDB();
                const dbData = JSON.parse(localStorage.getItem('aegis_local_db') || '{"users":[],"states":{}}');
                const uId = stateData.userId;
                if (!dbData.states[uId]) dbData.states[uId] = {};
                dbData.states[uId].medicines = stateData.medicines;
                dbData.states[uId].appointments = stateData.appointments;
                dbData.states[uId].logs = stateData.logs;
                dbData.states[uId].settings = stateData.settings;
                dbData.states[uId].healthLogs = stateData.healthLogs;
                
                if (stateData.profile) {
                  const uIdx = dbData.users.findIndex(u => u.id === uId);
                  if (uIdx > -1) {
                    const u = dbData.users[uIdx];
                    dbData.users[uIdx] = {
                      ...u,
                      name: stateData.profile.name !== undefined ? stateData.profile.name : u.name,
                      age: stateData.profile.age !== undefined ? stateData.profile.age : u.age,
                      gender: stateData.profile.gender !== undefined ? stateData.profile.gender : u.gender,
                      blood: stateData.profile.blood !== undefined ? stateData.profile.blood : u.blood,
                      address: stateData.profile.address !== undefined ? stateData.profile.address : u.address,
                      photo: stateData.profile.photo !== undefined ? stateData.profile.photo : u.photo,
                      emergency: stateData.profile.emergency !== undefined ? stateData.profile.emergency : u.emergency,
                      primaryDoctorId: stateData.profile.primaryDoctorId !== undefined ? stateData.profile.primaryDoctorId : u.primaryDoctorId,
                      doctorPhone: stateData.profile.doctorPhone !== undefined ? stateData.profile.doctorPhone : u.doctorPhone
                    };
                  }
                }
                localStorage.setItem('aegis_local_db', JSON.stringify(dbData));
                console.log("State synced to client-side database successfully");
                return;
              }

              // Otherwise try fetching
              try {
                const response = await fetch('/api/state/save', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(stateData)
                });
                if (!response.ok) {
                  console.warn("Failed to sync state to server, trying client-side database fallback...");
                  throw new Error("Server error");
                }
              } catch (e) {
                // Fallback to client-side localStorage DB if server is down
                await initLocalDB();
                const dbData = JSON.parse(localStorage.getItem('aegis_local_db') || '{"users":[],"states":{}}');
                const uId = stateData.userId;
                if (!dbData.states[uId]) dbData.states[uId] = {};
                dbData.states[uId].medicines = stateData.medicines;
                dbData.states[uId].appointments = stateData.appointments;
                dbData.states[uId].logs = stateData.logs;
                dbData.states[uId].settings = stateData.settings;
                dbData.states[uId].healthLogs = stateData.healthLogs;
                
                if (stateData.profile) {
                  const uIdx = dbData.users.findIndex(u => u.id === uId);
                  if (uIdx > -1) {
                    const u = dbData.users[uIdx];
                    dbData.users[uIdx] = {
                      ...u,
                      name: stateData.profile.name !== undefined ? stateData.profile.name : u.name,
                      age: stateData.profile.age !== undefined ? stateData.profile.age : u.age,
                      gender: stateData.profile.gender !== undefined ? stateData.profile.gender : u.gender,
                      blood: stateData.profile.blood !== undefined ? stateData.profile.blood : u.blood,
                      address: stateData.profile.address !== undefined ? stateData.profile.address : u.address,
                      photo: stateData.profile.photo !== undefined ? stateData.profile.photo : u.photo,
                      emergency: stateData.profile.emergency !== undefined ? stateData.profile.emergency : u.emergency,
                      primaryDoctorId: stateData.profile.primaryDoctorId !== undefined ? stateData.profile.primaryDoctorId : u.primaryDoctorId,
                      doctorPhone: stateData.profile.doctorPhone !== undefined ? stateData.profile.doctorPhone : u.doctorPhone
                    };
                  }
                }
                localStorage.setItem('aegis_local_db', JSON.stringify(dbData));
                console.log("State synced to client-side database fallback successfully");
              }
            };
            syncState();
          }
        }
      }
    }
  }
}

// Global Firebase Firestore Database Reference
let db = null;

// Synchronous SHA-256 for browser environment using subtle crypto
async function hashPassword(password, salt) {
  if (!salt) {
    salt = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0')).join('');
  }
  const msgUint8 = new TextEncoder().encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return { hash: hashHex, salt: salt };
}

// Initialize Firebase if config exists in localStorage
function initFirebase() {
  const configStr = localStorage.getItem('firebase_config');
  if (configStr) {
    try {
      const config = JSON.parse(configStr);
      if (config && config.projectId) {
        if (!firebase.apps.length) {
          firebase.initializeApp(config);
        }
        db = firebase.firestore();
        console.log("Firebase Firestore initialized successfully!");
        
        // Seed default users in background if newly connected
        seedFirebaseDatabase();
      }
    } catch (e) {
      console.error("Failed to initialize Firebase:", e);
    }
  }
}

// Seed Firebase Firestore with initial mock admin/doctor/patient if they don't exist
async function seedFirebaseDatabase() {
  if (!db) return;
  try {
    // Check if admin_1 exists in users
    const adminDoc = await db.collection('users').doc('admin_1').get();
    if (!adminDoc.exists) {
      console.log("Seeding default admin user to Firestore...");
      const adminHash = await hashPassword('admin');
      await db.collection('users').doc('admin_1').set({
        id: 'admin_1',
        name: 'System Administrator',
        role: 'admin',
        email: 'admin@medicare.com',
        mobile: '0000000000',
        passwordHash: adminHash.hash,
        salt: adminHash.salt,
        adherence: 0,
        streak: 0
      });
      await db.collection('states').doc('admin_1').set({
        medicines: [],
        appointments: [],
        logs: [],
        settings: { theme: 'dark', fontSize: 'normal', speechAlerts: true, highContrast: false, lang: 'en', doctorPhone: '' },
        healthLogs: []
      });
    }

    // Check if doctor_1 exists
    const docDoc = await db.collection('users').doc('doctor_1').get();
    if (!docDoc.exists) {
      console.log("Seeding default doctor user to Firestore...");
      const docHash = await hashPassword('doctor');
      await db.collection('users').doc('doctor_1').set({
        id: 'doctor_1',
        name: 'Dr. Prasad',
        role: 'doctor',
        email: 'doctor@medicare.com',
        mobile: '9876543212',
        passwordHash: docHash.hash,
        salt: docHash.salt,
        adherence: 0,
        streak: 0
      });
      await db.collection('states').doc('doctor_1').set({
        medicines: [],
        appointments: [],
        logs: [],
        settings: { theme: 'dark', fontSize: 'normal', speechAlerts: true, highContrast: false, lang: 'en', doctorPhone: '9876543212' },
        healthLogs: []
      });
    }

    // Check if caregiver_1 exists
    const cgDoc = await db.collection('users').doc('caregiver_1').get();
    if (!cgDoc.exists) {
      console.log("Seeding default caregiver user to Firestore...");
      const cgHash = await hashPassword('caregiver');
      await db.collection('users').doc('caregiver_1').set({
        id: 'caregiver_1',
        name: 'Ramesh Rao (Caregiver)',
        role: 'caregiver',
        email: 'caregiver@medicare.com',
        mobile: '9876543219',
        passwordHash: cgHash.hash,
        salt: cgHash.salt,
        primaryDoctorId: 'patient@medicare.com', // Linked patient email
        adherence: 0,
        streak: 0
      });
      await db.collection('states').doc('caregiver_1').set({
        medicines: [],
        appointments: [],
        logs: [],
        settings: { theme: 'dark', fontSize: 'normal', speechAlerts: true, highContrast: false, lang: 'en', doctorPhone: '' },
        healthLogs: []
      });
    }

    // Check if patient_1 exists
    const patDoc = await db.collection('users').doc('patient_1').get();
    if (!patDoc.exists) {
      console.log("Seeding default patient user to Firestore...");
      const patHash = await hashPassword('patient');
      await db.collection('users').doc('patient_1').set({
        id: 'patient_1',
        name: 'Ram Rao',
        role: 'patient',
        email: 'patient@medicare.com',
        mobile: '9876543210',
        passwordHash: patHash.hash,
        salt: patHash.salt,
        age: 68,
        gender: 'male',
        blood: 'A+',
        address: 'Gandhi Nagar',
        emergency: '9876543211',
        primaryDoctorId: 'Dr. Prasad',
        doctorPhone: '9876543212',
        adherence: 0,
        streak: 0
      });
      
      const seedMedicines = [
        {
          id: 'med_seed_1',
          name: 'Atorvastatin (Cholesterol)',
          type: 'tablet',
          dosage: '1 tablet (20mg)',
          times: ['21:00'],
          frequency: 'daily',
          stock: 28,
          refillAlertAt: 7,
          instructions: 'Take in evening before bedtime',
          color: '#0d9488'
        },
        {
          id: 'med_seed_2',
          name: 'Amoxicillin (Antibiotic)',
          type: 'capsule',
          dosage: '1 capsule (500mg)',
          times: ['08:00', '14:00', '20:00'],
          frequency: 'daily',
          stock: 6,
          refillAlertAt: 5,
          instructions: 'Take after eating food. Complete full course.',
          color: '#0d9488'
        }
      ];

      await db.collection('states').doc('patient_1').set({
        medicines: seedMedicines,
        appointments: [],
        logs: [],
        settings: { theme: 'dark', fontSize: 'normal', speechAlerts: true, highContrast: false, lang: 'en', doctorPhone: '9876543212' },
        healthLogs: []
      });
    }
  } catch (err) {
    console.error("Error seeding Firebase database:", err);
  }
}

// Auto-run Firebase initialization
initFirebase();
initLocalDB().catch(err => console.error("Error initializing local DB:", err));

// Instantiate state globally
const stateStore = new AegisState();

// ==========================================
// 2. TIME MACHINE CLOCK & SIMULATOR
// ==========================================
class SimulatedClock {
  constructor(state) {
    this.state = state;
    this.lastTickRealTime = Date.now();
    
    // Core simulated time tracking
    if (this.state.data.simulatedTime) {
      this.currentSimMs = this.state.data.simulatedTime;
    } else {
      this.currentSimMs = Date.now();
    }

    // Active triggers control
    this.activeAlarmQueue = [];
    this.snoozedAlarms = []; // { medicineId, scheduledTime, alarmTimeMs }
    this.firedPreAlerts = new Set(); // Track unique keys: med_pre_{medId}_{date}_{time} or appt_pre_{apptId}
  }

  // Ticks simulated clock based on speed factor
  tick() {
    const nowReal = Date.now();
    const elapsedRealSec = (nowReal - this.lastTickRealTime) / 1000;
    this.lastTickRealTime = nowReal;

    const speed = parseFloat(this.state.data.timeSpeed) || 1;
    const elapsedSimMs = elapsedRealSec * 1000 * speed;

    // Previous clock time before this tick
    const prevSimMs = this.currentSimMs;
    this.currentSimMs += elapsedSimMs;

    // Persist simulated time in state if developer custom time is active
    if (this.state.data.simulatedTime) {
      this.state.data.simulatedTime = this.currentSimMs;
      this.state.saveState();
    }

    // Evaluate scheduled alarm intervals in-between this clock window
    this.evaluateScheduler(prevSimMs, this.currentSimMs);
    
    // Update live DOM clocks
    this.updateClockUI();
  }

  // Set clock to a specific time (preset or manual time string HH:MM)
  setSimulatedTime(timeString) {
    const currentDate = new Date(this.currentSimMs);
    const [hours, minutes] = timeString.split(':').map(Number);
    currentDate.setHours(hours, minutes, 0, 0);
    
    this.currentSimMs = currentDate.getTime();
    this.state.data.simulatedTime = this.currentSimMs;
    this.state.saveState();
    
    // Clear snooze queues on major time warp
    this.snoozedAlarms = [];
    this.firedPreAlerts = new Set();
    
    this.updateClockUI();
    // Re-render schedule grid to reflect new time slot
    appController.renderDailySchedule();
  }

  resetToRealTime() {
    this.state.data.simulatedTime = null;
    this.state.data.timeSpeed = 1;
    this.state.saveState();
    
    this.currentSimMs = Date.now();
    this.lastTickRealTime = Date.now();
    this.snoozedAlarms = [];
    this.firedPreAlerts = new Set();
    
    this.updateClockUI();
    appController.renderDailySchedule();
  }

  getSimulatedDate() {
    return new Date(this.currentSimMs);
  }

  getFormattedTime(date = null) {
    const d = date || this.getSimulatedDate();
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const seconds = d.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // convert 0 to 12
    return `${hours.toString().padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
  }

  getFormattedDateOnly(date = null) {
    const d = date || this.getSimulatedDate();
    return getLocalFormattedDate(d);
  }

  updateClockUI() {
    const timeText = this.getFormattedTime();
    document.getElementById('current-sim-time').textContent = timeText;

    const isSimulated = this.state.data.simulatedTime !== null || this.state.data.timeSpeed > 1;
    const badge = document.getElementById('sim-time-badge');
    if (isSimulated) {
      badge.classList.remove('hide');
      badge.textContent = `Simulated ${this.state.data.timeSpeed}x`;
    } else {
      badge.classList.add('hide');
    }
  }

  evaluateScheduler(startMs, endMs) {
    const startDate = new Date(startMs);
    const endDate = new Date(endMs);

    // If day changed, roll over and generate new streaks/checks
    const startDateStr = getLocalFormattedDate(startDate);
    const endDateStr = getLocalFormattedDate(endDate);
    if (startDateStr !== endDateStr) {
      this.state.data.lastCheckedDate = endDateStr;
      this.state.saveState();
      appController.renderDailySchedule();
      appController.calculateStreak();
    }

    // Evaluate Snoozed Alarms due
    const pendingSnoozes = [];
    this.snoozedAlarms.forEach(snooze => {
      if (endMs >= snooze.alarmTimeMs) {
        // Find medicine details
        const med = this.state.data.medicines.find(m => m.id === snooze.medicineId);
        if (med) {
          this.triggerAlarm(med, snooze.scheduledTime);
        }
      } else {
        pendingSnoozes.push(snooze);
      }
    });
    this.snoozedAlarms = pendingSnoozes;

    // Evaluate Doctor Appointments
    if (this.state.data.appointments) {
      this.state.data.appointments.forEach(appt => {
        if (appt.status !== 'pending') return;

        const [apptHour, apptMin] = appt.time.split(':').map(Number);
        const apptDate = parseLocalDate(appt.date);
        apptDate.setHours(apptHour, apptMin, 0, 0);
        const apptMs = apptDate.getTime();

        // 5-minute pre-alert (300,000 ms before appointment)
        const apptPreMs = apptMs - 300000;
        if (apptPreMs > startMs && apptPreMs <= endMs) {
          const preKey = `appt_pre_${appt.id}`;
          if (!this.firedPreAlerts.has(preKey)) {
            this.firedPreAlerts.add(preKey);
            appController.triggerAppointmentPreAlert(appt);
          }
        }

        // Did appointment time pass during this clock tick window?
        if (apptMs > startMs && apptMs <= endMs) {
          appt.status = 'completed';
          this.state.saveState();
          appController.triggerAppointmentAlert(appt);
        }
      });
    }

    // Evaluate Standard Schedule
    const activeDate = endDate;
    const weekday = activeDate.getDay(); // 0 (Sun) to 6 (Sat)
    const activeDateStr = getLocalFormattedDate(activeDate);

    this.state.data.medicines.forEach(med => {
      // 1. Is medicine active on this weekday?
      if (med.frequency === 'specific_days' && med.specificDays && !med.specificDays.includes(weekday)) {
        return; 
      }

      // 2. Loop schedules times
      med.times.forEach(time => {
        const [timeHour, timeMin] = time.split(':').map(Number);
        
        // Construct exact timestamp for this schedule slot on the active day
        const medSchedDate = new Date(activeDate);
        medSchedDate.setHours(timeHour, timeMin, 0, 0);
        const medSchedMs = medSchedDate.getTime();

        // 5-minute pre-alert (300,000 ms before scheduled dose)
        const medPreMs = medSchedMs - 300000;
        if (medPreMs > startMs && medPreMs <= endMs) {
          const alreadyLogged = this.state.data.logs.some(log => 
            log.medicineId === med.id && 
            log.time === time && 
            log.date === activeDateStr
          );

          if (!alreadyLogged) {
            const preKey = `med_pre_${med.id}_${activeDateStr}_${time}`;
            if (!this.firedPreAlerts.has(preKey)) {
              this.firedPreAlerts.add(preKey);
              appController.triggerMedicinePreAlert(med, time);
            }
          }
        }

        // 3. Did this schedule boundary pass during this clock tick window?
        if (medSchedMs > startMs && medSchedMs <= endMs) {
          // 4. Double check we didn't already take/skip this dose
          const alreadyLogged = this.state.data.logs.some(log => 
            log.medicineId === med.id && 
            log.time === time && 
            log.date === activeDateStr
          );

          if (!alreadyLogged) {
            this.triggerAlarm(med, time);
          }
        }
      });
    });
  }

  triggerAlarm(medicine, timeStr) {
    // Avoid double alerts of same exact medicine/time in queue
    const alreadyQueued = this.activeAlarmQueue.some(q => q.medicine.id === medicine.id && q.time === timeStr);
    if (alreadyQueued) return;

    this.activeAlarmQueue.push({ medicine, time: timeStr });
    
    // Display Alarm dialog screen
    appController.showAlarmScreen();
  }
}

const clockEngine = new SimulatedClock(stateStore);

// ==========================================
// 3. OFFLINE WEB AUDIO ALARM SYNTHESIZER
// ==========================================
class AlarmSoundSynth {
  constructor() {
    this.audioContext = null;
    this.soundInterval = null;
  }

  // Programmatically synthesizes dual audio alerts:
  // 1. regular soft chime chord
  // 2. oscillating high-emergency siren sound for critical medical warnings
  start(isUrgent = false) {
    this.stop(); // safety check
    
    // Lazy initialize AudioContext on user interaction to obey browser privacy laws
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const runAlarm = () => {
      const playTone = () => {
        const now = this.audioContext.currentTime;
        
        if (isUrgent) {
          // OSCILLATING EMERGENCY SIREN (Hospital Warning)
          const osc = this.audioContext.createOscillator();
          const gain = this.audioContext.createGain();
          osc.type = 'sawtooth';
          
          // Fast pitch sweep to sound like a warning siren
          osc.frequency.setValueAtTime(650, now);
          osc.frequency.linearRampToValueAtTime(950, now + 0.22);
          osc.frequency.linearRampToValueAtTime(650, now + 0.45);
          
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
          
          osc.connect(gain);
          gain.connect(this.audioContext.destination);
          
          osc.start(now);
          osc.stop(now + 0.48);
        } else {
          // STANDARD PLEASANT CHIME (Regular dose reminder)
          const osc1 = this.audioContext.createOscillator();
          const gain1 = this.audioContext.createGain();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(587.33, now); // D5
          osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.15); // G5
          gain1.gain.setValueAtTime(0.2, now);
          gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
          osc1.connect(gain1);
          gain1.connect(this.audioContext.destination);
          
          const osc2 = this.audioContext.createOscillator();
          const gain2 = this.audioContext.createGain();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(987.77, now + 0.12); // B5
          osc2.frequency.exponentialRampToValueAtTime(1046.50, now + 0.3); // C6
          gain2.gain.setValueAtTime(0, now);
          gain2.gain.setValueAtTime(0.2, now + 0.12);
          gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
          osc2.connect(gain2);
          gain2.connect(this.audioContext.destination);

          osc1.start(now);
          osc1.stop(now + 0.65);
          osc2.start(now + 0.12);
          osc2.stop(now + 0.75);
        }
      };

      // Trigger arpeggiator sound every 2 seconds for chime, or every 500ms for urgent siren
      playTone();
      this.soundInterval = setInterval(playTone, isUrgent ? 500 : 2000);
    };

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume().then(() => {
        runAlarm();
      });
    } else {
      runAlarm();
    }
  }

  stop() {
    if (this.soundInterval) {
      clearInterval(this.soundInterval);
      this.soundInterval = null;
    }
  }

  playWelcomeSound(isUserGesture = false) {
    try {
      if (isUserGesture) {
        // Force a fresh context under user gesture to guarantee browser bypass
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      } else if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }

      const startMelody = () => {
        // Add a 100ms look-ahead buffer to prevent scheduling events in the past
        const now = this.audioContext.currentTime + 0.1;
        
        // Helper function to play a synthesized warm musical note with customized attackTime
        const playNote = (frequency, startTime, duration, volume = 0.08, type = 'triangle', attackTime = 0.3) => {
          const osc = this.audioContext.createOscillator();
          const gainNode = this.audioContext.createGain();
          
          osc.type = type;
          osc.frequency.setValueAtTime(frequency, startTime);
          
          // Very slow attack, sustain, and linear release
          gainNode.gain.setValueAtTime(0, startTime);
          gainNode.gain.linearRampToValueAtTime(volume, startTime + attackTime); // slow attack
          gainNode.gain.setValueAtTime(volume, startTime + duration - 0.2); // sustain
          gainNode.gain.linearRampToValueAtTime(0, startTime + duration); // linear release (more robust than exponential)
          
          osc.connect(gainNode);
          gainNode.connect(this.audioContext.destination);
          
          osc.start(startTime);
          osc.stop(startTime + duration + 0.1);
        };

        // 1. Play a warm ambient background pad chord (C3 + G3 + C4) rising VERY slowly
        playNote(130.81, now, 6.0, 0.25, 'sine', 3.0); // C3 base fades in over 3s
        playNote(196.00, now + 0.5, 5.5, 0.18, 'sine', 3.0); // G3 5th fades in over 3s
        playNote(261.63, now + 1.0, 5.0, 0.15, 'sine', 3.0); // C4 octave fades in over 3s

        // 2. Play a beautiful rising chime melody on top, spaced slowly (G4 -> C5 -> D5 -> G5 -> E5)
        const melody = [
          { note: 392.00, time: 0.8, dur: 2.0, attack: 0.8 }, // G4
          { note: 523.25, time: 2.0, dur: 2.0, attack: 0.8 }, // C5
          { note: 587.33, time: 3.2, dur: 2.0, attack: 0.8 }, // D5
          { note: 783.99, time: 4.4, dur: 2.5, attack: 1.0 }, // G5
          { note: 659.25, time: 5.6, dur: 3.0, attack: 1.2 }  // E5 (resolving note)
        ];

        melody.forEach(item => {
          // Play warm triangle wave notes with slow attack
          playNote(item.note, now + item.time, item.dur, 0.25, 'triangle', item.attack);
          // Play higher octave sparkles with slow attack
          playNote(item.note * 2, now + item.time + 0.05, item.dur - 0.2, 0.08, 'sine', item.attack);
        });
      };

      if (this.audioContext.state === 'suspended') {
        if (isUserGesture) {
          this.audioContext.resume().then(() => {
            startMelody();
          });
          return true;
        } else {
          // Autoplay blocked by browser policy
          return false;
        }
      } else {
        startMelody();
        return true;
      }
    } catch (err) {
      console.warn("Audio Context welcome melody failed: ", err);
      return false; // Sound blocked or error occurred
    }
  }
}

const alarmSoundSynth = new AlarmSoundSynth();

// ==========================================
// 4. SCREEN VOICE READER (Web Speech API)
// ==========================================
class VoiceNarrator {
  speak(message) {
    if (!stateStore.data.settings.speechAlerts) return;
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Flush queue
      
      const lang = stateStore.data.settings.lang || 'en';
      const voices = window.speechSynthesis.getVoices();
      
      let textToSpeak = '';
      let targetLangCode = 'en-US';
      let preferredVoice = null;

      const langPrefix = lang === 'te' ? 'te' : lang === 'hi' ? 'hi' : 'en';
      const langName = lang === 'te' ? 'telugu' : lang === 'hi' ? 'hindi' : 'english';
      const targetLang = lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-US';

      // 1. Try to find a voice for the selected language
      preferredVoice = voices.find(v => {
        const vl = (v.lang || '').toLowerCase().replace('_', '-');
        return vl === targetLang.toLowerCase() || vl === langPrefix;
      });

      if (!preferredVoice) {
        preferredVoice = voices.find(v => {
          const vl = (v.lang || '').toLowerCase().replace('_', '-');
          return vl.startsWith(langPrefix + '-');
        });
      }

      if (!preferredVoice) {
        preferredVoice = voices.find(v => {
          const vn = (v.name || '').toLowerCase();
          return vn.includes(langName);
        });
      }

      if (!preferredVoice) {
        preferredVoice = voices.find(v => {
          const vl = (v.lang || '').toLowerCase().replace('_', '-');
          return vl.startsWith(langPrefix);
        });
      }

      // If we found a voice for the selected language, use it. Otherwise, target the correct language tag anyway.
      targetLangCode = preferredVoice ? preferredVoice.lang : targetLang;
      
      if (typeof message === 'object') {
        textToSpeak = message[lang] || message['en'] || '';
      } else {
        textToSpeak = message;
      }

      if (!textToSpeak) return;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.85; // Slightly slower speed so elderly users can clearly digest info
      utterance.pitch = 1.0;
      utterance.lang = targetLangCode;
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onerror = (e) => {
        console.error('SpeechSynthesisUtterance error:', e);
      };

      window.speechSynthesis.speak(utterance);
    }
  }
  
  stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

const voiceNarrator = new VoiceNarrator();

// Warm up browser speech synthesis voices to prevent empty list on first run
if ('speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

// Client-Side Local Storage database initializer
async function initLocalDB() {
  let dbStr = localStorage.getItem('aegis_local_db');
  if (!dbStr) {
    const localDB = {
      users: [],
      states: {}
    };
    
    // Seed default admin
    const adminHash = await hashPassword('admin');
    const adminId = 'admin_1';
    localDB.users.push({
      id: adminId,
      name: 'System Administrator',
      role: 'admin',
      email: 'admin@medicare.com',
      mobile: '0000000000',
      passwordHash: adminHash.hash,
      salt: adminHash.salt
    });
    localDB.states[adminId] = {
      medicines: [],
      appointments: [],
      logs: [],
      settings: { theme: 'dark', fontSize: 'normal', speechAlerts: true, highContrast: false, lang: 'en', doctorPhone: '' },
      healthLogs: []
    };

    // Seed default doctor
    const docHash = await hashPassword('doctor');
    const docId = 'doctor_1';
    localDB.users.push({
      id: docId,
      name: 'Dr. Prasad',
      role: 'doctor',
      email: 'doctor@medicare.com',
      mobile: '9876543212',
      passwordHash: docHash.hash,
      salt: docHash.salt
    });
    localDB.states[docId] = {
      medicines: [],
      appointments: [],
      logs: [],
      settings: { theme: 'dark', fontSize: 'normal', speechAlerts: true, highContrast: false, lang: 'en', doctorPhone: '9876543212' },
      healthLogs: []
    };

    // Seed default patient
    const patHash = await hashPassword('patient');
    const patId = 'patient_1';
    localDB.users.push({
      id: patId,
      name: 'Patient Test',
      role: 'patient',
      email: 'patient@medicare.com',
      mobile: '9876543210',
      passwordHash: patHash.hash,
      salt: patHash.salt,
      age: 65,
      gender: 'male',
      blood: 'O+',
      address: '123 Srinagar Colony',
      emergency: '9876543211',
      primaryDoctorId: 'doctor@medicare.com',
      doctorPhone: '9876543212'
    });
    localDB.states[patId] = {
      medicines: [
        {
          id: 'med_demo_1',
          name: 'Atorvastatin (Cholesterol)',
          type: 'tablet',
          dosage: '1 tablet (20mg)',
          frequency: 'daily',
          times: ['21:00'],
          stock: 30,
          stockAlert: 5,
          instructions: 'Take after dinner',
          startDate: getLocalFormattedDate(new Date()),
          adherence: 100
        }
      ],
      appointments: [],
      logs: [],
      settings: { theme: 'dark', fontSize: 'normal', speechAlerts: true, highContrast: false, lang: 'en', doctorPhone: '9876543212' },
      healthLogs: []
    };

    // Seed default caregiver
    const cgHash = await hashPassword('caregiver');
    const cgId = 'caregiver_1';
    localDB.users.push({
      id: cgId,
      name: 'Ramesh Rao (Caregiver)',
      role: 'caregiver',
      email: 'caregiver@medicare.com',
      mobile: '9876543219',
      passwordHash: cgHash.hash,
      salt: cgHash.salt,
      primaryDoctorId: 'patient@medicare.com'
    });
    localDB.states[cgId] = {
      medicines: [],
      appointments: [],
      logs: [],
      settings: { theme: 'dark', fontSize: 'normal', speechAlerts: true, highContrast: false, lang: 'en', doctorPhone: '' },
      healthLogs: []
    };

    localStorage.setItem('aegis_local_db', JSON.stringify(localDB));
  }
}

// ==========================================
// 5. APPLICATION UI CONTROLLER
// ==========================================
class AegisAppController {
  constructor() {
    this.activeTab = 'tab-appointments';
  }

  async apiCall(url, method = 'GET', data = null) {
    if (typeof db !== 'undefined' && db) {
      try {
        return await this.firebaseApiCall(url, method, data);
      } catch (err) {
        console.error("Firebase API call error:", err);
        throw err;
      }
    }
    
    // Auto-detect Vercel or other serverless environment
    const isVercel = window.location.hostname.includes('vercel.app') || window.location.hostname.includes('github.io');
    if (isVercel) {
      return await this.localDBApiCall(url, method, data);
    }
    
    try {
      const options = {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        }
      };
      if (data) {
        options.body = JSON.stringify(data);
      }
      const response = await fetch(url, options);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Server error');
      }
      return result;
    } catch (fetchErr) {
      console.warn("Backend REST API failed or unreachable, falling back to client-side database:", fetchErr);
      return await this.localDBApiCall(url, method, data);
    }
  }

  async localDBApiCall(url, method, data) {
    await initLocalDB();
    const dbData = JSON.parse(localStorage.getItem('aegis_local_db') || '{"users":[],"states":{}}');
    
    const urlObj = new URL(url, window.location.origin);
    const path = urlObj.pathname;
    const query = new URLSearchParams(urlObj.search);
    
    if (path === '/api/auth/register') {
      const { name, email, mobile, password, role } = data;
      const dup = dbData.users.find(u => u.email === email.trim().toLowerCase() || u.mobile === mobile.trim());
      if (dup) {
        throw new Error("Email or mobile number already registered!");
      }
      
      const hashResult = await hashPassword(password);
      const userId = `${role}_` + Math.floor(Math.random() * 10000000);
      
      const newUser = {
        id: userId,
        name: name,
        role: role,
        email: email.trim().toLowerCase(),
        mobile: mobile.trim(),
        passwordHash: hashResult.hash,
        salt: hashResult.salt,
        age: data.age || null,
        gender: data.gender || null,
        blood: data.blood || null,
        address: data.address || '',
        photo: data.photo || null,
        emergency: data.emergency || null,
        primaryDoctorId: data.primaryDoctorId || null,
        doctorPhone: data.doctorPhone || null,
        adherence: 0,
        streak: 0
      };
      
      dbData.users.push(newUser);
      
      const defaultSettings = {
        theme: 'dark',
        fontSize: 'normal',
        speechAlerts: true,
        highContrast: false,
        lang: data.lang || 'en',
        doctorPhone: data.doctorPhone || ''
      };
      
      dbData.states[userId] = {
        medicines: [],
        appointments: [],
        logs: [],
        settings: defaultSettings,
        healthLogs: []
      };
      
      localStorage.setItem('aegis_local_db', JSON.stringify(dbData));
      
      let medicines = [];
      let appointments = [];
      let logs = [];
      let healthLogs = [];
      let linkedPatient = null;
      let linkedPatientSettings = null;
      
      if (role === 'caregiver' && newUser.primaryDoctorId) {
        const linkedId = newUser.primaryDoctorId;
        const p = dbData.users.find(u => (u.email === linkedId || u.mobile === linkedId) && u.role === 'patient');
        if (p) {
          linkedPatient = { ...p };
          delete linkedPatient.passwordHash;
          delete linkedPatient.salt;
          const pState = dbData.states[p.id] || {};
          medicines = pState.medicines || [];
          appointments = pState.appointments || [];
          logs = pState.logs || [];
          linkedPatientSettings = pState.settings || {};
          healthLogs = pState.healthLogs || [];
        }
      }
      
      const userRes = { ...newUser };
      delete userRes.passwordHash;
      delete userRes.salt;
      
      return {
        success: true,
        user: userRes,
        settings: defaultSettings,
        medicines: medicines,
        appointments: appointments,
        logs: logs,
        healthLogs: healthLogs,
        linkedPatient: linkedPatient,
        linkedPatientSettings: linkedPatientSettings
      };
    }
    
    if (path === '/api/auth/login') {
      const { identifier, password, role } = data;
      const iden = identifier.trim().toLowerCase();
      
      const user = dbData.users.find(u => (u.email === iden || u.mobile === identifier.trim()) && u.role === role);
      if (!user) {
        throw new Error("Invalid email/mobile, password, or role!");
      }
      
      const hashResult = await hashPassword(password, user.salt);
      if (hashResult.hash !== user.passwordHash) {
        throw new Error("Invalid email/mobile, password, or role!");
      }
      
      const userState = dbData.states[user.id] || { medicines: [], appointments: [], logs: [], settings: { theme: 'dark', lang: 'en' }, healthLogs: [] };
      
      let medicines = userState.medicines || [];
      let appointments = userState.appointments || [];
      let logs = userState.logs || [];
      let settings = userState.settings || { theme: 'dark', lang: 'en' };
      let healthLogs = userState.healthLogs || [];
      let linkedPatient = null;
      let linkedPatientSettings = null;
      
      if (role === 'caregiver' && user.primaryDoctorId) {
        const linkedId = user.primaryDoctorId;
        const p = dbData.users.find(u => (u.email === linkedId || u.mobile === linkedId) && u.role === 'patient');
        if (p) {
          linkedPatient = { ...p };
          delete linkedPatient.passwordHash;
          delete linkedPatient.salt;
          const pState = dbData.states[p.id] || {};
          medicines = pState.medicines || [];
          appointments = pState.appointments || [];
          logs = pState.logs || [];
          linkedPatientSettings = pState.settings || {};
          healthLogs = pState.healthLogs || [];
        }
      }
      
      const userRes = { ...user };
      delete userRes.passwordHash;
      delete userRes.salt;
      
      return {
        success: true,
        user: userRes,
        settings: settings,
        medicines: medicines,
        appointments: appointments,
        logs: logs,
        healthLogs: healthLogs,
        linkedPatient: linkedPatient,
        linkedPatientSettings: linkedPatientSettings
      };
    }
    
    if (path === '/api/patient-details') {
      const patientId = query.get('id');
      const user = dbData.users.find(u => u.id === patientId);
      if (!user) throw new Error("Patient not found");
      const userState = dbData.states[patientId] || {};
      
      const userRes = { ...user };
      delete userRes.passwordHash;
      delete userRes.salt;
      
      return {
        patient: userRes,
        medicines: userState.medicines || [],
        appointments: userState.appointments || [],
        logs: userState.logs || [],
        healthLogs: userState.healthLogs || []
      };
    }
    
    if (path === '/api/patients') {
      return dbData.users
        .filter(u => u.role === 'patient')
        .map(u => {
          const userRes = { ...u };
          delete userRes.passwordHash;
          delete userRes.salt;
          return userRes;
        });
    }
    
    if (path === '/api/admin/users') {
      return dbData.users.map(u => ({
        id: u.id,
        name: u.name,
        role: u.role,
        email: u.email,
        mobile: u.mobile
      }));
    }
    
    if (path === '/api/state/save') {
      const { userId, medicines, appointments, logs, settings, healthLogs, profile } = data;
      if (!userId) throw new Error("Missing user ID");
      
      if (!dbData.states[userId]) {
        dbData.states[userId] = {};
      }
      if (medicines !== undefined) dbData.states[userId].medicines = medicines;
      if (appointments !== undefined) dbData.states[userId].appointments = appointments;
      if (logs !== undefined) dbData.states[userId].logs = logs;
      if (settings !== undefined) dbData.states[userId].settings = settings;
      if (healthLogs !== undefined) dbData.states[userId].healthLogs = healthLogs;
      
      if (profile) {
        const uIdx = dbData.users.findIndex(u => u.id === userId);
        if (uIdx > -1) {
          const u = dbData.users[uIdx];
          dbData.users[uIdx] = {
            ...u,
            name: profile.name !== undefined ? profile.name : u.name,
            age: profile.age !== undefined ? profile.age : u.age,
            gender: profile.gender !== undefined ? profile.gender : u.gender,
            blood: profile.blood !== undefined ? profile.blood : u.blood,
            address: profile.address !== undefined ? profile.address : u.address,
            photo: profile.photo !== undefined ? profile.photo : u.photo,
            emergency: profile.emergency !== undefined ? profile.emergency : u.emergency,
            primaryDoctorId: profile.primaryDoctorId !== undefined ? profile.primaryDoctorId : u.primaryDoctorId,
            doctorPhone: profile.doctorPhone !== undefined ? profile.doctorPhone : u.doctorPhone
          };
        }
      }
      
      localStorage.setItem('aegis_local_db', JSON.stringify(dbData));
      return { success: true };
    }
    
    throw new Error("Endpoint not supported in LocalDB fallback!");
  }

  async firebaseApiCall(url, method, data) {
    const urlObj = new URL(url, window.location.origin);
    const path = urlObj.pathname;
    const query = new URLSearchParams(urlObj.search);
    
    if (path === '/api/auth/login') {
      const { identifier, password, role } = data;
      let querySnapshot = await db.collection('users')
        .where('role', '==', role)
        .where('email', '==', identifier)
        .get();
      if (querySnapshot.empty) {
        querySnapshot = await db.collection('users')
          .where('role', '==', role)
          .where('mobile', '==', identifier)
          .get();
      }
      if (querySnapshot.empty) {
        throw new Error("Invalid email/mobile, password, or role!");
      }
      const doc = querySnapshot.docs[0];
      const userData = doc.data();
      
      const hashResult = await hashPassword(password, userData.salt);
      if (hashResult.hash !== userData.passwordHash) {
        throw new Error("Invalid email/mobile, password, or role!");
      }
      
      let settings = { theme: 'dark', lang: 'en' };
      let medicines = [];
      let appointments = [];
      let logs = [];
      let healthLogs = [];
      let linkedPatient = null;
      let linkedPatientSettings = null;
      
      if (role === 'caregiver' && userData.primaryDoctorId) {
        const linkedId = userData.primaryDoctorId;
        let pSnapshot = await db.collection('users')
          .where('role', '==', 'patient')
          .where('email', '==', linkedId)
          .get();
        if (pSnapshot.empty) {
          pSnapshot = await db.collection('users')
            .where('role', '==', 'patient')
            .where('mobile', '==', linkedId)
            .get();
        }
        if (!pSnapshot.empty) {
          const pDoc = pSnapshot.docs[0];
          linkedPatient = pDoc.data();
          const pId = linkedPatient.id;
          
          const pStateDoc = await db.collection('states').doc(pId).get();
          if (pStateDoc.exists) {
            const pState = pStateDoc.data();
            medicines = pState.medicines || [];
            appointments = pState.appointments || [];
            logs = pState.logs || [];
            linkedPatientSettings = pState.settings || {};
            healthLogs = pState.healthLogs || [];
          }
        }
      } else {
        const stateDoc = await db.collection('states').doc(userData.id).get();
        if (stateDoc.exists) {
          const stateData = stateDoc.data();
          medicines = stateData.medicines || [];
          appointments = stateData.appointments || [];
          logs = stateData.logs || [];
          settings = stateData.settings || settings;
          healthLogs = stateData.healthLogs || [];
        }
      }
      
      return {
        success: true,
        user: userData,
        settings: settings,
        medicines: medicines,
        appointments: appointments,
        logs: logs,
        healthLogs: healthLogs,
        linkedPatient: linkedPatient,
        linkedPatientSettings: linkedPatientSettings
      };
    }
    
    if (path === '/api/auth/register') {
      const { name, email, mobile, password, role } = data;
      
      let dupSnapshot = await db.collection('users').where('email', '==', email).get();
      if (!dupSnapshot.empty) throw new Error("Email or mobile number already registered!");
      dupSnapshot = await db.collection('users').where('mobile', '==', mobile).get();
      if (!dupSnapshot.empty) throw new Error("Email or mobile number already registered!");
      
      const hashResult = await hashPassword(password);
      const userId = `${role}_` + Math.floor(Math.random() * 10000000);
      
      const newUser = {
        id: userId,
        name: name,
        role: role,
        email: email,
        mobile: mobile,
        passwordHash: hashResult.hash,
        salt: hashResult.salt,
        age: data.age || null,
        gender: data.gender || null,
        blood: data.blood || null,
        address: data.address || '',
        photo: data.photo || null,
        emergency: data.emergency || null,
        primaryDoctorId: data.primaryDoctorId || null,
        doctorPhone: data.doctorPhone || null,
        adherence: 0,
        streak: 0
      };
      
      await db.collection('users').doc(userId).set(newUser);
      
      const defaultSettings = {
        theme: 'dark',
        fontSize: 'normal',
        speechAlerts: true,
        highContrast: false,
        lang: data.lang || 'en',
        doctorPhone: data.doctorPhone || ''
      };
      
      await db.collection('states').doc(userId).set({
        medicines: [],
        appointments: [],
        logs: [],
        settings: defaultSettings,
        healthLogs: []
      });
      
      let medicines = [];
      let appointments = [];
      let logs = [];
      let healthLogs = [];
      let linkedPatient = null;
      let linkedPatientSettings = null;
      
      if (role === 'caregiver' && newUser.primaryDoctorId) {
        const linkedId = newUser.primaryDoctorId;
        let pSnapshot = await db.collection('users')
          .where('role', '==', 'patient')
          .where('email', '==', linkedId)
          .get();
        if (pSnapshot.empty) {
          pSnapshot = await db.collection('users')
            .where('role', '==', 'patient')
            .where('mobile', '==', linkedId)
            .get();
        }
        if (!pSnapshot.empty) {
          const pDoc = pSnapshot.docs[0];
          linkedPatient = pDoc.data();
          const pId = linkedPatient.id;
          
          const pStateDoc = await db.collection('states').doc(pId).get();
          if (pStateDoc.exists) {
            const pState = pStateDoc.data();
            medicines = pState.medicines || [];
            appointments = pState.appointments || [];
            logs = pState.logs || [];
            linkedPatientSettings = pState.settings || {};
            healthLogs = pState.healthLogs || [];
          }
        }
      }
      
      return {
        success: true,
        user: newUser,
        settings: defaultSettings,
        medicines: medicines,
        appointments: appointments,
        logs: logs,
        healthLogs: healthLogs,
        linkedPatient: linkedPatient,
        linkedPatientSettings: linkedPatientSettings
      };
    }
    
    if (path === '/api/patient-details') {
      const patientId = query.get('id');
      if (!patientId) throw new Error("Missing patient ID");
      
      const userDoc = await db.collection('users').doc(patientId).get();
      if (!userDoc.exists) throw new Error("Patient not found");
      
      const stateDoc = await db.collection('states').doc(patientId).get();
      const stateData = stateDoc.exists ? stateDoc.data() : {};
      
      return {
        patient: userDoc.data(),
        medicines: stateData.medicines || [],
        appointments: stateData.appointments || [],
        logs: stateData.logs || [],
        healthLogs: stateData.healthLogs || []
      };
    }
    
    if (path === '/api/patients') {
      const querySnapshot = await db.collection('users').where('role', '==', 'patient').get();
      const patients = [];
      querySnapshot.forEach(doc => {
        patients.push(doc.data());
      });
      return patients;
    }
    
    if (path === '/api/admin/users') {
      const querySnapshot = await db.collection('users').get();
      const users = [];
      querySnapshot.forEach(doc => {
        const u = doc.data();
        users.push({
          id: u.id,
          name: u.name,
          role: u.role,
          email: u.email,
          mobile: u.mobile
        });
      });
      return users;
    }
    
    if (path === '/api/state/save') {
      const userId = data.userId;
      if (!userId) throw new Error("Missing user ID");
      
      const updateData = {};
      if (data.medicines !== undefined) updateData.medicines = data.medicines;
      if (data.appointments !== undefined) updateData.appointments = data.appointments;
      if (data.logs !== undefined) updateData.logs = data.logs;
      if (data.settings !== undefined) updateData.settings = data.settings;
      if (data.healthLogs !== undefined) updateData.healthLogs = data.healthLogs;
      
      await db.collection('states').doc(userId).update(updateData);
      
      if (data.profile) {
        await db.collection('users').doc(userId).update({
          name: data.profile.name || '',
          age: data.profile.age || null,
          gender: data.profile.gender || null,
          blood: data.profile.blood || null,
          address: data.profile.address || '',
          photo: data.profile.photo || null,
          emergency: data.profile.emergency || null,
          primaryDoctorId: data.profile.primaryDoctorId || null,
          doctorPhone: data.profile.doctorPhone || null
        });
      }
      return { success: true };
    }
    
    if (path === '/api/admin/users/create') {
      const { name, email, mobile, password, role } = data;
      
      let dupSnapshot = await db.collection('users').where('email', '==', email).get();
      if (!dupSnapshot.empty) throw new Error("Email or mobile already registered!");
      dupSnapshot = await db.collection('users').where('mobile', '==', mobile).get();
      if (!dupSnapshot.empty) throw new Error("Email or mobile already registered!");
      
      const hashResult = await hashPassword(password);
      const userId = `${role}_` + Math.floor(Math.random() * 10000000);
      
      await db.collection('users').doc(userId).set({
        id: userId,
        name: name,
        role: role,
        email: email,
        mobile: mobile,
        passwordHash: hashResult.hash,
        salt: hashResult.salt,
        adherence: 0,
        streak: 0
      });
      
      await db.collection('states').doc(userId).set({
        medicines: [],
        appointments: [],
        logs: [],
        settings: { theme: 'dark', fontSize: 'normal', speechAlerts: true, highContrast: false, lang: 'en', doctorPhone: '' },
        healthLogs: []
      });
      
      return { success: true, userId: userId };
    }
    
    if (path === '/api/admin/users/delete') {
      const { userId } = data;
      if (userId === 'admin_1') throw new Error("Cannot delete primary admin account!");
      
      await db.collection('users').doc(userId).delete();
      await db.collection('states').doc(userId).delete();
      return { success: true };
    }
    
    throw new Error("Endpoint not found or supported via Firebase!");
  }

  init() {
    // Run the splash screen intro before loading the session
    this.runSplashScreenTransition();
    
    this.bindEvents();
    this.loadSettings();
    
    // Core Clock Engine Tick (Runs once per real-time second)
    setInterval(() => {
      clockEngine.tick();
      this.updateCountdownBadge();
    }, 1000);
  }

  runSplashScreenTransition() {
    const splash = document.getElementById('splash-screen');
    let soundPlayed = false;
    let transitionTriggered = false;

    const triggerTransition = () => {
      if (transitionTriggered) return;
      transitionTriggered = true;

      if (splash) {
        splash.classList.add('slide-up');
      }

      this.checkAuthSession();

      const active = stateStore.data.activePatient;
      if (!active) {
        const portal = document.getElementById('auth-portal-container');
        if (portal) {
          portal.classList.remove('hide');
          portal.classList.add('login-slide-up-active');
        }
      }

      // Clean up all listeners
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleDocumentClick);
    };

    const tryPlayWelcome = (e) => {
      if (soundPlayed) return;
      const isUserGesture = e ? true : false;
      soundPlayed = true;
      if (isUserGesture) {
        triggerTransition();
      }
    };

    const handleDocumentClick = (e) => {
      triggerTransition();
    };

    // Auto-transition after a comfortable delay (600ms) to let the splash screen display briefly
    setTimeout(() => {
      tryPlayWelcome();
      triggerTransition();
    }, 600);

    // Document listeners
    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleDocumentClick);
  }

  // ==========================================
  // EVENT BINDINGS
  // ==========================================
  bindEvents() {
    // Tab switching
    document.querySelectorAll('.nav-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tabId = e.currentTarget.getAttribute('data-tab');
        this.switchTab(tabId);
      });
    });

    // Theme toggler
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => this.toggleTheme());
    }

    // Accessibility Panel triggers
    const accPanel = document.getElementById('accessibility-center');
    document.getElementById('accessibility-toggle-btn').addEventListener('click', () => {
      accPanel.classList.toggle('hide');
    });

    // Font Scaling triggers
    document.getElementById('font-scale-normal').addEventListener('click', (e) => this.setScale('normal', e.target));
    document.getElementById('font-scale-large').addEventListener('click', (e) => this.setScale('large', e.target));
    document.getElementById('font-scale-xlarge').addEventListener('click', (e) => this.setScale('xlarge', e.target));

    // High contrast switches
    document.getElementById('high-contrast-toggle').addEventListener('change', (e) => {
      this.toggleHighContrast(e.target.checked);
    });

    // Voice alerts switches
    document.getElementById('voice-alert-toggle').addEventListener('change', (e) => {
      stateStore.data.settings.speechAlerts = e.target.checked;
      stateStore.saveState();
    });

    // Cabinet Search & Filtering
    document.getElementById('cabinet-search').addEventListener('input', () => this.renderCabinet());
    document.getElementById('cabinet-form-filter').addEventListener('change', () => this.renderCabinet());
    document.getElementById('time-of-day-filter').addEventListener('change', () => this.renderDailySchedule());

    // Add Medicine Modal overlay toggles
    document.getElementById('add-medicine-btn').addEventListener('click', () => this.showMedicineModal());
    document.getElementById('modal-close-btn').addEventListener('click', () => this.hideMedicineModal());
    document.getElementById('modal-cancel-btn').addEventListener('click', () => this.hideMedicineModal());
    
    // Handle empty state button click
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('trigger-cabinet-modal-btn')) {
        this.showMedicineModal();
      }
    });

    // Scheduled Times Form Array Rows
    document.getElementById('add-schedule-time-row-btn').addEventListener('click', () => this.addTimePickerRow());
    document.getElementById('schedule-times-container').addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-time-btn')) {
        e.target.closest('.time-picker-row').remove();
        this.updateRemoveTimeButtonsState();
      }
    });

    // Medicine Frequency selector toggle check
    document.getElementById('med-frequency').addEventListener('change', (e) => {
      const freq = e.target.value;
      const weekdaysGrp = document.getElementById('weekdays-group');
      const prnGrp = document.getElementById('prn-group');
      const timesGrp = document.getElementById('schedule-times-form-group');

      if (freq === 'specific_days') {
        weekdaysGrp.classList.remove('hide');
        prnGrp.classList.add('hide');
        timesGrp.classList.remove('hide');
      } else if (freq === 'prn') {
        weekdaysGrp.classList.add('hide');
        prnGrp.classList.remove('hide');
        timesGrp.classList.add('hide');
      } else {
        weekdaysGrp.classList.add('hide');
        prnGrp.classList.add('hide');
        timesGrp.classList.remove('hide');
      }
    });

    // Form Submission
    document.getElementById('medicine-entry-form').addEventListener('submit', (e) => this.handleFormSubmit(e));

    // Alarm Action Dialog Modals
    document.getElementById('alarm-take-btn').addEventListener('click', () => this.handleAlarmResponse('taken'));
    document.getElementById('alarm-skip-btn').addEventListener('click', () => this.handleAlarmResponse('skipped'));
    document.getElementById('alarm-snooze-btn').addEventListener('click', () => this.handleAlarmResponse('snoozed'));

    // Developer Time Machine presets
    document.querySelectorAll('.time-preset-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const timeVal = e.target.getAttribute('data-time');
        clockEngine.setSimulatedTime(timeVal);
      });
    });

    document.getElementById('apply-manual-time').addEventListener('click', () => {
      const manualTime = document.getElementById('sim-manual-time').value;
      if (manualTime) {
        clockEngine.setSimulatedTime(manualTime);
      }
    });

    document.getElementById('reset-sim-clock').addEventListener('click', () => {
      clockEngine.resetToRealTime();
      document.getElementById('sim-manual-time').value = '';
    });

    document.getElementById('time-speed-select').addEventListener('change', (e) => {
      stateStore.data.timeSpeed = parseFloat(e.target.value);
      stateStore.saveState();
    });

    // Language selection switch handler
    document.getElementById('lang-switch-select').addEventListener('change', (e) => {
      const val = e.target.value;
      stateStore.data.settings.lang = val;
      stateStore.saveState();
      
      const authLangSelect = document.getElementById('auth-lang-switch-select');
      if (authLangSelect) authLangSelect.value = val;
      
      this.updateLanguage();
      this.renderDailySchedule();
      this.renderCabinet();
      this.renderAnalytics();
    });

    // Auth Language selection switch handler
    const authLangSelect = document.getElementById('auth-lang-switch-select');
    if (authLangSelect) {
      authLangSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        stateStore.data.settings.lang = val;
        stateStore.saveState();
        
        const dashboardLangSelect = document.getElementById('lang-switch-select');
        if (dashboardLangSelect) dashboardLangSelect.value = val;
        
        this.updateLanguage();
      });
    }

    // emergency & doctor call events
    document.getElementById('emergency-call-btn').addEventListener('click', () => {
      // Emergency ambulance line 108
      window.open('tel:108');
    });

    const callDoctorFn = () => {
      let phone = stateStore.data.settings.doctorPhone;
      if (!phone) {
        phone = prompt(stateStore.data.settings.lang === 'te' ? "దయచేసి మీ డాక్టర్ ఫోన్ నెంబర్ టైప్ చేయండి:" :
                       stateStore.data.settings.lang === 'hi' ? "कृपया अपने डॉक्टर का फ़ोन नंबर दर्ज करें:" :
                       "Please enter your Doctor's phone number / emergency helpline:");
        if (phone) {
          stateStore.data.settings.doctorPhone = phone;
          stateStore.saveState();
        }
      }
      if (phone) {
        window.open('tel:' + phone);
      }
    };

    document.getElementById('doctor-call-btn').addEventListener('click', callDoctorFn);
    document.getElementById('alarm-call-doctor-btn').addEventListener('click', callDoctorFn);

    // Analytics actions
    document.getElementById('clear-history-btn').addEventListener('click', () => {
      if (confirm("Are you absolutely sure you want to wipe all compliance logs? This resets your adherence streak to zero.")) {
        stateStore.data.logs = [];
        stateStore.data.streak = 0;
        stateStore.saveState();
        this.renderDailySchedule();
        this.renderAnalytics();
        this.calculateStreak();
      }
    });

    // Quick Preset Template auto prefill handler for elderly care support
    document.getElementById('med-template-preset').addEventListener('change', (e) => {
      const selected = e.target.value;
      if (!selected) return;

      const templates = {
        dolo: {
          name: 'Dolo 650 (Paracetamol)',
          type: 'tablet',
          dosage: '650mg – 1 Tablet',
          times: [], // Empty since PRN is symptom dependent, not hourly
          frequency: 'prn',
          instructions: 'Take only as needed for fever (temperature > 99°F) or severe body pain. Keep a gap of 4-6 hours. Max 4 daily.',
          color: '#f43f5e', // Rose red
          stock: 20,
          refill: 4,
          prnCondition: 'Body Temp > 99°F or Fever discomfort',
          prnGap: 4,
          prnMax: 4
        },
        pantoprazole: {
          name: 'Pantoprazole (Acidity & Gas)',
          type: 'tablet',
          dosage: '40mg – 1 Tablet',
          times: ['07:00'],
          frequency: 'daily',
          instructions: 'Take early morning on empty stomach, 30-60 minutes before breakfast. Treats acidity, bloating, and gas issues.',
          color: '#d97706', // Amber
          stock: 30,
          refill: 5
        },
        lisinopril: {
          name: 'Lisinopril (Blood Pressure)',
          type: 'tablet',
          dosage: '10mg – 1 Tablet',
          times: ['08:00'],
          frequency: 'daily',
          instructions: 'Take daily in morning on empty stomach with a full glass of water. Controls high blood pressure.',
          color: '#0d9488', // Teal
          stock: 30,
          refill: 5
        },
        atorvastatin: {
          name: 'Atorvastatin (Cholesterol)',
          type: 'tablet',
          dosage: '20mg – 1 Tablet',
          times: ['21:00'],
          frequency: 'daily',
          instructions: 'Take daily in evening before bedtime. For lipid and cholesterol management.',
          color: '#0d9488', // Teal
          stock: 30,
          refill: 5
        },
        metformin: {
          name: 'Metformin (Diabetes)',
          type: 'tablet',
          dosage: '500mg – 1 Tablet',
          times: ['08:00', '20:00'],
          frequency: 'daily',
          instructions: 'Take twice daily with meals (breakfast & dinner) to mitigate stomach upset. For blood sugar control.',
          color: '#f43f5e', // Rose
          stock: 60,
          refill: 10
        },
        naproxen: {
          name: 'Naproxen (Arthritis Pain)',
          type: 'tablet',
          dosage: '250mg – 1 Tablet',
          times: ['08:00', '20:00'],
          frequency: 'daily',
          instructions: 'Take with food or milk to shield stomach lining. Relieves joint inflammation and arthritis pain.',
          color: '#d97706', // Amber
          stock: 20,
          refill: 4
        },
        alendronate: {
          name: 'Alendronate (Bone Density)',
          type: 'tablet',
          dosage: '70mg – 1 Tablet',
          times: ['07:30'],
          frequency: 'specific_days',
          specificDays: [0], // Sunday weekly
          instructions: 'Weekly dose. Take immediately upon waking with plain water. Stay upright for 30 minutes. Bone protection.',
          color: '#8b5cf6', // Purple
          stock: 4,
          refill: 1
        },
        aspirin: {
          name: 'Low-Dose Aspirin (Heart Care)',
          type: 'tablet',
          dosage: '81mg – 1 Tablet',
          times: ['08:00'],
          frequency: 'daily',
          instructions: 'Take daily in morning. Blood thinner for cardiovascular safety and heart protection.',
          color: '#0d9488', // Teal
          stock: 100,
          refill: 15
        },
        multivitamin: {
          name: 'Senior Multivitamin & D3',
          type: 'tablet',
          dosage: '1 Tablet',
          times: ['09:00'],
          frequency: 'daily',
          instructions: 'Take daily with breakfast for bone strength, immunity, and overall energy.',
          color: '#0d9488', // Teal
          stock: 90,
          refill: 15
        }
      };

      const preset = templates[selected];
      if (preset) {
        // Pre-fill standard fields
        document.getElementById('med-name').value = preset.name;
        document.getElementById('med-type').value = preset.type;
        document.getElementById('med-dosage').value = preset.dosage;
        document.getElementById('med-frequency').value = preset.frequency;
        document.getElementById('med-instructions').value = preset.instructions;
        document.getElementById('med-stock').value = preset.stock;
        document.getElementById('med-stock-low').value = preset.refill;

        // Apply accent colors check
        const radioColor = document.querySelector(`.color-picker-strip input[value="${preset.color}"]`);
        if (radioColor) radioColor.checked = true;

        // Toggle form groups based on frequency type
        const weekdaysGrp = document.getElementById('weekdays-group');
        const prnGrp = document.getElementById('prn-group');
        const timesGrp = document.getElementById('schedule-times-form-group');

        if (preset.frequency === 'specific_days') {
          weekdaysGrp.classList.remove('hide');
          prnGrp.classList.add('hide');
          timesGrp.classList.remove('hide');
          document.querySelectorAll('.days-checkbox-grid input').forEach(box => {
            box.checked = preset.specificDays.includes(parseInt(box.value));
          });
        } else if (preset.frequency === 'prn') {
          weekdaysGrp.classList.add('hide');
          prnGrp.classList.remove('hide');
          timesGrp.classList.add('hide');
          document.getElementById('med-prn-condition').value = preset.prnCondition || '';
          document.getElementById('med-prn-gap').value = preset.prnGap || 4;
          document.getElementById('med-prn-max').value = preset.prnMax || 4;
        } else {
          weekdaysGrp.classList.add('hide');
          prnGrp.classList.add('hide');
          timesGrp.classList.remove('hide');
        }

        // Generate form time picker rows for non-PRN meds
        const timesContainer = document.getElementById('schedule-times-container');
        timesContainer.innerHTML = '';
        if (preset.times && preset.times.length > 0) {
          preset.times.forEach(t => {
            const row = document.createElement('div');
            row.className = 'time-picker-row';
            row.innerHTML = `
              <input type="time" class="form-control schedule-time-input" value="${t}" required>
              <button type="button" class="btn btn-icon btn-glass btn-sm remove-time-btn">&times;</button>
            `;
            timesContainer.appendChild(row);
          });
        } else {
          // Put one default row just in case
          const row = document.createElement('div');
          row.className = 'time-picker-row';
          row.innerHTML = `
            <input type="time" class="form-control schedule-time-input" value="08:00" required>
            <button type="button" class="btn btn-icon btn-glass btn-sm remove-time-btn" disabled>&times;</button>
          `;
          timesContainer.appendChild(row);
        }
        this.updateRemoveTimeButtonsState();
      }
    });

    // Auth screen toggling
    document.getElementById('go-to-register-btn').addEventListener('click', () => {
      document.getElementById('login-card').classList.add('hide');
      document.getElementById('register-card').classList.remove('hide');
    });

    document.getElementById('go-to-login-btn').addEventListener('click', () => {
      document.getElementById('register-card').classList.add('hide');
      document.getElementById('login-card').classList.remove('hide');
    });

    // Role tabs switching in login card
    document.querySelectorAll('.auth-role-tabs .role-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const role = e.currentTarget.getAttribute('data-role');
        document.querySelectorAll('.auth-role-tabs .role-tab').forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        document.getElementById('login-role').value = role;
        
        // Show/hide helper block or update texts if doctor/admin
        const testHelper = document.getElementById('login-test-helper');
        const loginTitleText = document.getElementById('login-title-text');
        const loginSubText = document.getElementById('login-sub-text');
        
        // Update Title text
        const lang = stateStore.data.settings.lang || 'en';
        if (role === 'patient') {
          loginTitleText.textContent = lang === 'te' ? "రోగి లాగిన్" : lang === 'hi' ? "मरीज लॉगिन" : "Patient Login";
          loginSubText.textContent = lang === 'te' ? "మీ మందుల షెడ్యూల్‌లు & డాక్టర్ అపాయింట్‌మెంట్‌లను ట్రాక్ చేయండి" : lang === 'hi' ? "अपनी दवा के कार्यक्रम और डॉक्टर की नियुक्तियों को ट्रैक करें" : "Log in to track your medicine schedules & appointments";
          
          document.getElementById('login-test-email').textContent = 'patient@medicare.com';
          document.getElementById('login-test-pass').textContent = 'patient';
          testHelper.classList.remove('hide');
        } else if (role === 'doctor') {
          loginTitleText.textContent = lang === 'te' ? "డాక్టర్ లాగిన్" : lang === 'hi' ? "डॉक्टर लॉगिन" : "Doctor Login";
          loginSubText.textContent = lang === 'te' ? "రోగుల రికార్డులను మరియు తనిఖీలను నిర్వహించండి" : lang === 'hi' ? "रोगियों के रिकॉर्ड और नियुक्तियों को प्रबंधित करें" : "Manage patient charts and schedule appointments";
          
          document.getElementById('login-test-email').textContent = 'doctor@medicare.com';
          document.getElementById('login-test-pass').textContent = 'doctor';
          testHelper.classList.remove('hide');
        } else if (role === 'caregiver') {
          loginTitleText.textContent = lang === 'te' ? "కేర్‌గివర్ లాగిన్" : lang === 'hi' ? "केयरगिवर लॉगिन" : "Caregiver Login";
          loginSubText.textContent = lang === 'te' ? "రోగి మందులు & ఆరోగ్య వివరాలను పర్యవేక్షించండి" : lang === 'hi' ? "मरीज की दवा और स्वास्थ्य विवरण की निगरानी करें" : "Monitor patient medications & health status";
          
          document.getElementById('login-test-email').textContent = 'caregiver@medicare.com';
          document.getElementById('login-test-pass').textContent = 'caregiver';
          testHelper.classList.remove('hide');
        } else if (role === 'admin') {
          loginTitleText.textContent = lang === 'te' ? "అడ్మిన్ లాగిన్" : lang === 'hi' ? "एडमिन लॉगिन" : "Admin Login";
          loginSubText.textContent = lang === 'te' ? "సిస్టమ్ వినియోగదారులు మరియు డేటాబేస్లను నిర్వహించండి" : lang === 'hi' ? "సిస్టమ్ వినియోగదారులు మరియు డేటాబేస్లను నిర్వహించండి" : "Manage system users and database settings";
          
          document.getElementById('login-test-email').textContent = 'admin@medicare.com';
          document.getElementById('login-test-pass').textContent = 'admin';
          testHelper.classList.remove('hide');
        }
      });
    });

    // Registration role selection switch handler
    const regRoleSelect = document.getElementById('reg-role');
    if (regRoleSelect) {
      regRoleSelect.addEventListener('change', (e) => {
        const role = e.target.value;
        const patientFields = document.querySelectorAll('.patient-only-field');
        const caregiverFields = document.querySelectorAll('.caregiver-only-field');
        
        if (role !== 'patient') {
          patientFields.forEach(el => {
            el.classList.add('hide');
            el.querySelectorAll('input, select').forEach(input => {
              if (input.hasAttribute('required')) {
                input.setAttribute('data-was-required', 'true');
                input.removeAttribute('required');
              }
            });
          });
        } else {
          patientFields.forEach(el => {
            el.classList.remove('hide');
            el.querySelectorAll('input, select').forEach(input => {
              if (input.getAttribute('data-was-required') === 'true') {
                input.setAttribute('required', '');
                input.removeAttribute('data-was-required');
              }
            });
          });
        }
        
        if (role === 'caregiver') {
          caregiverFields.forEach(el => {
            el.classList.remove('hide');
            el.querySelectorAll('input').forEach(input => {
              input.setAttribute('required', '');
            });
          });
        } else {
          caregiverFields.forEach(el => {
            el.classList.add('hide');
            el.querySelectorAll('input').forEach(input => {
              input.removeAttribute('required');
            });
          });
        }
        
        this.updateRegisterLabels();
      });
    }

    // Login Form handler
    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const identifier = document.getElementById('login-identifier').value.trim();
      const loginIdentifier = identifier.includes('@') ? identifier.toLowerCase() : identifier;
      const pass = document.getElementById('login-password').value;
      const role = document.getElementById('login-role').value;

      try {
        const result = await this.apiCall('/api/auth/login', 'POST', {
          identifier: loginIdentifier,
          password: pass,
          role: role
        });

        if (result.success) {
          stateStore.data.activePatient = mapUserFromBackend(result.user);
          stateStore.data.settings = mapSettingsFromBackend(result.settings || stateStore.data.settings);
          stateStore.data.medicines = result.medicines || [];
          stateStore.data.appointments = result.appointments || [];
          stateStore.data.logs = result.logs || [];
          stateStore.data.healthLogs = result.healthLogs || [];
          stateStore.data.linkedPatient = result.linkedPatient || null;
          stateStore.data.linkedPatientSettings = result.linkedPatientSettings || null;
          
          stateStore.saveState();
          
          // Trigger celebratory tone
          this.playSuccessConfetti();
          
          // Switch view based on role
          if (role === 'patient') {
            this.activeTab = 'tab-appointments'; // Force Appointments tab on login
            this.checkAuthSession();
            this.loadSettings();
            this.renderDailySchedule();
            this.renderCabinet();
            this.renderAnalytics();
            this.renderAppointments();
            this.calculateStreak();
          } else if (role === 'caregiver') {
            this.activeTab = 'tab-caregiver-dashboard';
            this.checkAuthSession();
            this.loadSettings();
            this.renderCaregiverDashboard();
          } else if (role === 'doctor') {
            this.activeTab = 'tab-doctor-dashboard';
            this.checkAuthSession();
          } else if (role === 'admin') {
            this.activeTab = 'tab-admin-dashboard';
            this.checkAuthSession();
          }
        }
      } catch (err) {
        let msg = err.message;
        if (msg.includes("Invalid email/mobile")) {
          msg = stateStore.data.settings.lang === 'te' ? "ఇమెయిల్/మొబైల్ లేదా పాస్‌వర్డ్ తప్పు!" :
                stateStore.data.settings.lang === 'hi' ? "ईमेल/मोबाइल या पासवर्ड गलत है!" :
                "Invalid email/mobile, password, or role!";
        }
        alert(msg);
      }
    });

    // Registration Form handler
    document.getElementById('register-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const role = document.getElementById('reg-role').value;
      const name = document.getElementById('reg-name').value.trim();
      const age = document.getElementById('reg-age').value;
      const gender = document.getElementById('reg-gender').value;
      const blood = document.getElementById('reg-blood').value;
      const mobile = document.getElementById('reg-mobile').value.trim();
      const email = document.getElementById('reg-email').value.trim().toLowerCase();
      const address = document.getElementById('reg-address').value.trim();
      const emergency = document.getElementById('reg-emergency').value.trim();
      const password = document.getElementById('reg-password').value;
      
      const doctorName = document.getElementById('reg-doc-name').value.trim();
      const doctorPhone = document.getElementById('reg-doc-phone').value.trim();

      const proceedRegistration = async (photoBase64 = null) => {
        try {
          const patientLinkRaw = document.getElementById('reg-patient-link') ? document.getElementById('reg-patient-link').value.trim() : '';
          const patientLink = patientLinkRaw.includes('@') ? patientLinkRaw.toLowerCase() : patientLinkRaw;
          const regData = {
            name,
            email,
            mobile,
            password,
            role,
            age: role === 'patient' ? parseInt(age) : null,
            gender: role === 'patient' ? gender : null,
            blood: role === 'patient' ? blood : null,
            address: address,
            photo: photoBase64,
            emergency: role === 'patient' ? emergency : null,
            primaryDoctorId: role === 'patient' ? doctorName : (role === 'caregiver' ? patientLink : null),
            doctorPhone: role === 'patient' ? doctorPhone : null
          };

          const result = await this.apiCall('/api/auth/register', 'POST', regData);

          if (result.success) {
            stateStore.data.activePatient = mapUserFromBackend(result.user);
            stateStore.data.settings = mapSettingsFromBackend(result.settings || stateStore.data.settings);
            stateStore.data.medicines = result.medicines || [];
            stateStore.data.appointments = result.appointments || [];
            stateStore.data.logs = result.logs || [];
            stateStore.data.healthLogs = result.healthLogs || [];
            stateStore.data.linkedPatient = result.linkedPatient || null;
            stateStore.data.linkedPatientSettings = result.linkedPatientSettings || null;

            stateStore.saveState();

            this.playSuccessConfetti();
            
            if (role === 'patient') {
              this.activeTab = 'tab-appointments'; // Force Appointments tab on registration login
              this.checkAuthSession();
              this.loadSettings();
              this.renderDailySchedule();
              this.renderCabinet();
              this.renderAnalytics();
              this.renderAppointments();
              this.calculateStreak();
            } else if (role === 'caregiver') {
              this.activeTab = 'tab-caregiver-dashboard';
              this.checkAuthSession();
              this.loadSettings();
              this.renderCaregiverDashboard();
            } else if (role === 'doctor') {
              this.activeTab = 'tab-doctor-dashboard';
              this.checkAuthSession();
            } else if (role === 'admin') {
              this.activeTab = 'tab-admin-dashboard';
              this.checkAuthSession();
            }
          }
        } catch (err) {
          let msg = err.message;
          if (msg.includes("already registered")) {
            msg = stateStore.data.settings.lang === 'te' ? "ఈ ఇమెయిల్ లేదా మొబైల్ నంబర్ ఇప్పటికే నమోదై ఉంది!" :
                  stateStore.data.settings.lang === 'hi' ? "यह ईमेल या मोबाइल नंबर पहले से पंजीकृत है!" :
                  "Email or mobile number already registered!";
          }
          alert(msg);
        }
      };

      // Read and compress profile photo if uploaded
      const photoInput = document.getElementById('reg-photo');
      const photoFile = photoInput ? photoInput.files[0] : null;

      if (photoFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const max_size = 200; // max width/height for avatar
            let width = img.width;
            let height = img.height;
            if (width > height) {
              if (width > max_size) {
                height *= max_size / width;
                width = max_size;
              }
            } else {
              if (height > max_size) {
                width *= max_size / height;
                height = max_size;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            try {
              const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7); // compress to 70% JPEG quality
              proceedRegistration(compressedBase64);
            } catch (err) {
              console.error("Canvas read error:", err);
              proceedRegistration(event.target.result); // Fallback to raw if canvas fails
            }
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(photoFile);
      } else {
        proceedRegistration(null);
      }
    });

    // Doctor Dashboard event listeners
    const closeBtn = document.getElementById('doc-patient-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        document.getElementById('doctor-patient-details-card').classList.add('hide');
        document.getElementById('doctor-patients-grid').classList.remove('hide');
      });
    }

    const apptForm = document.getElementById('doc-book-appointment-form');
    if (apptForm) {
      apptForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const patientId = document.getElementById('doc-appt-patient-id').value;
        const date = document.getElementById('doc-appt-date').value;
        const time = document.getElementById('doc-appt-time').value;
        const purpose = document.getElementById('doc-appt-purpose').value.trim();
        
        if (!patientId || !date || !time || !purpose) return;
        
        try {
          // Fetch current details of patient to append appointment
          const details = await this.apiCall(`/api/patient-details?id=${patientId}`);
          
          const newAppt = {
            id: 'appt_' + Date.now(),
            patientId: patientId,
            doctorId: stateStore.data.activePatient.id,
            doctorName: stateStore.data.activePatient.name,
            date: date,
            time: time,
            purpose: purpose,
            status: 'pending'
          };
          
          const appts = details.appointments || [];
          appts.push(newAppt);
          
          await this.apiCall('/api/state/save', 'POST', {
            userId: patientId,
            appointments: appts
          });
          
          alert("Appointment scheduled successfully!");
          apptForm.reset();
          
          // Refresh details
          this.loadDoctorPatientDetails(patientId);
        } catch (err) {
          alert("Failed to book appointment: " + err.message);
        }
      });
    }

    // Admin control listeners
    const adminTbody = document.getElementById('admin-users-tbody');
    if (adminTbody) {
      adminTbody.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-user-btn')) {
          const userId = e.target.getAttribute('data-user-id');
          const userName = e.target.getAttribute('data-user-name');
          
          if (confirm(`Are you sure you want to permanently delete user "${userName}"? This action cannot be undone.`)) {
            try {
              const res = await this.apiCall('/api/admin/users/delete', 'POST', { userId });
              if (res.success) {
                alert(`User "${userName}" successfully deleted.`);
                this.renderAdminDashboard();
              }
            } catch (err) {
              alert(`Failed to delete user: ${err.message}`);
            }
          }
        }
      });
    }

    // Logout click handler
    document.getElementById('logout-btn').addEventListener('click', () => {
      if (confirm(stateStore.data.settings.lang === 'te' ? "మీరు లాగ్ అవుట్ చేయాలనుకుంటున్నారా?" :
                  stateStore.data.settings.lang === 'hi' ? "क्या आप लॉग आउट करना चाहते हैं?" :
                  "Are you sure you want to log out?")) {
        stateStore.data.activePatient = null;
        stateStore.saveState();
        this.activeTab = 'tab-appointments'; // Reset default tab
        this.checkAuthSession();
      }
    });

    // Doctor Phone direct save setting in Accessibility center
    const savePhoneBtn = document.getElementById('save-doctor-phone-btn');
    if (savePhoneBtn) {
      savePhoneBtn.addEventListener('click', () => {
        const inputVal = document.getElementById('doctor-phone-input').value.trim();
        stateStore.data.settings.doctorPhone = inputVal;
        
        // Also update phone inside active patient profile if logged in
        if (stateStore.data.activePatient) {
          stateStore.data.activePatient.doctorPhone = inputVal;
          const idx = stateStore.data.registeredPatients.findIndex(p => p.id === stateStore.data.activePatient.id);
          if (idx > -1) {
            stateStore.data.registeredPatients[idx].doctorPhone = inputVal;
          }
        }
        
        stateStore.saveState();
        alert(stateStore.data.settings.lang === 'te' ? "వైద్యుడి ఫోన్ నంబర్ విజయవంతంగా సేవ్ చేయబడింది!" :
              stateStore.data.settings.lang === 'hi' ? "डॉक्टर का फोन नंबर सहेज लिया गया है!" :
              "Doctor's phone number saved successfully!");
      });
    }

    // Appointment Modal toggles
    const apptModal = document.getElementById('appointment-form-modal');
    document.getElementById('add-appointment-btn').addEventListener('click', () => {
      document.getElementById('appointment-entry-form').reset();
      
      // Auto-prefill doctor name/phone from patient profile if available
      if (stateStore.data.activePatient) {
        document.getElementById('appt-doc-name').value = stateStore.data.activePatient.doctorName || '';
      }
      
      apptModal.classList.remove('hide');
    });

    document.getElementById('appointment-modal-close-btn').addEventListener('click', () => {
      apptModal.classList.add('hide');
    });

    document.getElementById('appt-modal-cancel-btn').addEventListener('click', () => {
      apptModal.classList.add('hide');
    });

    // Save Appointment form submit handler
    document.getElementById('appointment-entry-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const docName = document.getElementById('appt-doc-name').value.trim();
      const date = document.getElementById('appt-date').value;
      const time = document.getElementById('appt-time').value;
      const purpose = document.getElementById('appt-purpose').value.trim();

      const newAppt = {
        id: 'appt_' + Date.now(),
        patientId: stateStore.data.activePatient ? stateStore.data.activePatient.id : 'default',
        doctorName: docName,
        date,
        time,
        purpose,
        status: 'pending' // pending, completed, missed
      };

      stateStore.data.appointments.push(newAppt);
      stateStore.saveState();
      apptModal.classList.add('hide');

      this.renderAppointments();
      this.playSuccessConfetti();
    });

    // Sound Alarm preview guide play buttons
    const testChimeBtn = document.getElementById('test-chime-btn');
    const testSirenBtn = document.getElementById('test-siren-btn');

    if (testChimeBtn) {
      testChimeBtn.addEventListener('click', () => {
        if (alarmSoundSynth.soundInterval) {
          alarmSoundSynth.stop();
          voiceNarrator.stop();
        } else {
          alarmSoundSynth.start(false); // Play standard chime
          voiceNarrator.speak({
            en: "It is time to take your medicines. Please take them now.",
            hi: "दवा लेने का समय हो गया है। कृपया अपनी दवा लें।",
            te: "మందులు వేసుకునే సమయం అయింది. దయచేసి మీ మందులు వేసుకోండి."
          });
          setTimeout(() => {
            alarmSoundSynth.stop();
            voiceNarrator.stop();
          }, 5000); // Stop preview automatically after 5s
        }
      });
    }

    if (testSirenBtn) {
      testSirenBtn.addEventListener('click', () => {
        if (alarmSoundSynth.soundInterval) {
          alarmSoundSynth.stop();
          voiceNarrator.stop();
        } else {
          alarmSoundSynth.start(true); // Play emergency warning siren
          voiceNarrator.speak({
            en: "Critical Warning. Your body temperature is dangerously high. Please go to the hospital immediately.",
            hi: "गंभीर चेतावनी। आपका शरीर का तापमान बहुत अधिक है। कृपया तुरंत अस्पताल जाएं।",
            te: "తీవ్రమైన హెచ్చరిక. మీ శరీర ఉష్ణోగ్రత చాలా ఎక్కువగా ఉంది. దయచేసి వెంటనే ఆసుపత్రికి వెళ్ళండి."
          });
          setTimeout(() => {
            alarmSoundSynth.stop();
            voiceNarrator.stop();
          }, 5000); // Stop preview automatically after 5s
        }
      });
    }

    // Patient profile badge click event triggers
    const profileBadge = document.getElementById('patient-profile-badge');
    if (profileBadge) {
      profileBadge.addEventListener('click', () => this.showPatientProfile());
    }
    const profileCloseBtn = document.getElementById('profile-modal-close-btn');
    if (profileCloseBtn) {
      profileCloseBtn.addEventListener('click', () => this.hidePatientProfile());
    }
    const profileCloseBtn2 = document.getElementById('profile-modal-close-btn-2');
    if (profileCloseBtn2) {
      profileCloseBtn2.addEventListener('click', () => this.hidePatientProfile());
    }

    // Change profile picture triggers inside modal
    const changePicBtn = document.getElementById('change-profile-pic-btn');
    const changePicLink = document.getElementById('change-profile-pic-link');
    const changePicInput = document.getElementById('change-profile-pic-input');
    if (changePicInput) {
      const triggerInput = () => {
        changePicInput.click();
      };
      if (changePicBtn) changePicBtn.addEventListener('click', triggerInput);
      if (changePicLink) changePicLink.addEventListener('click', triggerInput);

      changePicInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const max_size = 200; // max size for avatar
              let width = img.width;
              let height = img.height;
              if (width > height) {
                if (width > max_size) {
                  height *= max_size / width;
                  width = max_size;
                }
              } else {
                if (height > max_size) {
                  width *= max_size / height;
                  height = max_size;
                }
              }
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);
              try {
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                const active = stateStore.data.activePatient;
                if (active) {
                  active.photo = compressedBase64;
                  const idx = stateStore.data.registeredPatients.findIndex(p => p.id === active.id);
                  if (idx !== -1) {
                    stateStore.data.registeredPatients[idx].photo = compressedBase64;
                  }
                  stateStore.saveState();
                  
                  // Instantly update header UI and modal UI
                  this.checkAuthSession();
                  
                  const modalPicImg = document.getElementById('profile-modal-pic-img');
                  const modalPicFallback = document.getElementById('profile-modal-pic-fallback');
                  if (modalPicImg && modalPicFallback) {
                    modalPicImg.src = compressedBase64;
                    modalPicImg.classList.remove('hide');
                    modalPicFallback.classList.add('hide');
                  }
                  this.playSuccessConfetti();
                }
              } catch (err) {
                console.error("Canvas read error:", err);
              }
            };
            img.src = event.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Profile Modal Edit Toggles and Save triggers
    const editToggleBtn = document.getElementById('profile-edit-toggle-btn');
    const editCancelBtn = document.getElementById('profile-edit-cancel-btn');
    const editSaveBtn = document.getElementById('profile-edit-save-btn');
    
    if (editToggleBtn) {
      editToggleBtn.addEventListener('click', () => {
        const editLayout = document.getElementById('profile-edit-layout');
        if (editLayout && editLayout.classList.contains('hide')) {
          this.enterProfileEditMode();
        } else {
          this.exitProfileEditMode();
        }
      });
    }

    if (editCancelBtn) {
      editCancelBtn.addEventListener('click', () => this.exitProfileEditMode());
    }

    if (editSaveBtn) {
      editSaveBtn.addEventListener('click', () => this.saveProfileDetails());
    }

    // Cloud Database configuration modal event bindings
    const dbConfigBtn = document.getElementById('auth-db-config-btn');
    if (dbConfigBtn) {
      dbConfigBtn.addEventListener('click', () => {
        const modal = document.getElementById('db-settings-modal');
        if (modal) {
          const stored = localStorage.getItem('firebase_config');
          const txtArea = document.getElementById('db-config-json');
          if (txtArea) txtArea.value = stored || '';
          modal.classList.remove('hide');
        }
      });
    }

    const dbCloseBtn = document.getElementById('db-modal-close-x');
    if (dbCloseBtn) {
      dbCloseBtn.addEventListener('click', () => {
        const modal = document.getElementById('db-settings-modal');
        if (modal) modal.classList.add('hide');
      });
    }

    const dbResetBtn = document.getElementById('db-config-reset-btn');
    if (dbResetBtn) {
      dbResetBtn.addEventListener('click', () => {
        localStorage.removeItem('firebase_config');
        alert(TRANSLATIONS[stateStore.data.settings.lang || 'en'].dbConfigResetSuccess || "Reset to local SQLite database! Reloading...");
        window.location.reload();
      });
    }

    const dbSaveBtn = document.getElementById('db-config-save-btn');
    if (dbSaveBtn) {
      dbSaveBtn.addEventListener('click', () => {
        const txtArea = document.getElementById('db-config-json');
        if (txtArea) {
          const val = txtArea.value.trim();
          if (!val) {
            alert(TRANSLATIONS[stateStore.data.settings.lang || 'en'].dbConfigInvalid || "Invalid Firebase Config JSON!");
            return;
          }
          try {
            JSON.parse(val);
            localStorage.setItem('firebase_config', val);
            alert(TRANSLATIONS[stateStore.data.settings.lang || 'en'].dbConfigSuccess || "Connected to Firebase Firestore cloud database! Reloading...");
            window.location.reload();
          } catch (e) {
            alert(TRANSLATIONS[stateStore.data.settings.lang || 'en'].dbConfigInvalid || "Invalid Firebase Config JSON!");
          }
        }
      });
    }

    // Health Log form submission event binding
    const healthForm = document.getElementById('health-log-form');
    if (healthForm) {
      healthForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const sys = document.getElementById('health-sys').value.trim();
        const dia = document.getElementById('health-dia').value.trim();
        const sugar = document.getElementById('health-sugar').value.trim();
        const sugarType = document.getElementById('health-sugar-type').value;
        const pulse = document.getElementById('health-pulse').value.trim();
        const weight = document.getElementById('health-weight').value.trim();
        
        if (!sys && !dia && !sugar && !pulse && !weight) {
          alert(stateStore.data.settings.lang === 'te' ? "దయచేసి కనీసం ఒక రీడింగ్ నమోదు చేయండి" :
                stateStore.data.settings.lang === 'hi' ? "कृपया कम से कम एक रीडिंग दर्ज करें" :
                "Please enter at least one health reading.");
          return;
        }
        
        const logEntry = {
          timestamp: new Date().toISOString(),
          systolic: sys ? parseInt(sys) : null,
          diastolic: dia ? parseInt(dia) : null,
          bloodSugar: sugar ? parseInt(sugar) : null,
          sugarType: sugarType || 'fasting',
          pulse: pulse ? parseInt(pulse) : null,
          weight: weight ? parseFloat(weight) : null
        };
        
        if (!stateStore.data.healthLogs) {
          stateStore.data.healthLogs = [];
        }
        stateStore.data.healthLogs.push(logEntry);
        stateStore.saveState();
        
        healthForm.reset();
        this.renderHealthTracker();
        this.playSuccessConfetti();
      });
    }

    // Emergency SOS button click event bindings
    const sosBtn = document.getElementById('sos-btn');
    if (sosBtn) {
      sosBtn.addEventListener('click', () => {
        this.triggerEmergencySOS(true);
      });
    }

    const sosCloseBtn = document.getElementById('sos-close-btn');
    if (sosCloseBtn) {
      sosCloseBtn.addEventListener('click', () => {
        this.triggerEmergencySOS(false);
      });
    }
  }

  // ==========================================
  // VIEW RENDERERS & DATA BINDERS
  // ==========================================

  switchTab(tabId) {
    this.activeTab = tabId;
    
    // Tab Headers
    document.querySelectorAll('.nav-tab').forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
      if (panel.getAttribute('id') === tabId) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // Specific renders on Tab focus
    if (tabId === 'tab-dashboard') this.renderDailySchedule();
    if (tabId === 'tab-cabinet') this.renderCabinet();
    if (tabId === 'tab-analytics') this.renderAnalytics();
    if (tabId === 'tab-appointments') this.renderAppointments();
    if (tabId === 'tab-health') this.renderHealthTracker();
    if (tabId === 'tab-caregiver-dashboard') this.renderCaregiverDashboard();
  }

  checkAuthSession() {
    const active = stateStore.data.activePatient;
    const authPortal = document.getElementById('auth-portal-container');
    const appShell = document.getElementById('app-container');

    if (active) {
      authPortal.classList.add('hide');
      appShell.classList.remove('hide');
      
      // Update patient info details in header
      document.getElementById('header-patient-name').textContent = active.name;
      if (active.role === 'patient') {
        document.getElementById('header-patient-blood').textContent = `Blood: ${active.blood || ''}`;
        document.getElementById('header-patient-blood').style.color = 'var(--rose-color)';
      } else {
        document.getElementById('header-patient-blood').textContent = `Role: ${active.role.toUpperCase()}`;
        document.getElementById('header-patient-blood').style.color = 'var(--teal-color)';
      }
      
      // Update profile picture in header
      const headerPicImg = document.getElementById('header-profile-pic-img');
      const headerPicFallback = document.getElementById('header-profile-pic-fallback');
      if (headerPicImg && headerPicFallback) {
        if (active.photo) {
          headerPicImg.src = active.photo;
          headerPicImg.classList.remove('hide');
          headerPicFallback.classList.add('hide');
        } else {
          headerPicImg.src = '';
          headerPicImg.classList.add('hide');
          headerPicFallback.classList.remove('hide');
        }
      }
      
      // Show/hide navigation tabs based on role
      const patientTabs = document.querySelectorAll('.nav-tab[data-tab="tab-dashboard"], .nav-tab[data-tab="tab-cabinet"], .nav-tab[data-tab="tab-analytics"], .nav-tab[data-tab="tab-health"]');
      const appointmentsTab = document.querySelector('.nav-tab[data-tab="tab-appointments"]');
      const doctorTab = document.getElementById('nav-doctor-tab');
      const adminTab = document.getElementById('nav-admin-tab');
      const caregiverTab = document.getElementById('nav-caregiver-tab');
      
      // Show/hide SOS floating button based on patient role
      const sosBtn = document.getElementById('sos-btn');
      if (sosBtn) {
        if (active.role === 'patient') {
          sosBtn.classList.remove('hide');
        } else {
          sosBtn.classList.add('hide');
        }
      }
      
      if (active.role === 'patient') {
        patientTabs.forEach(t => t.classList.remove('hide'));
        if (appointmentsTab) appointmentsTab.classList.remove('hide');
        if (doctorTab) doctorTab.classList.add('hide');
        if (adminTab) adminTab.classList.add('hide');
        if (caregiverTab) caregiverTab.classList.add('hide');
        
        // Sync doctor number to settings if needed
        stateStore.data.settings.doctorPhone = active.doctorPhone || '';
        
        // Hide doctor call action if no phone
        const docCallBtn = document.getElementById('doctor-call-btn');
        if (docCallBtn) {
          if (active.doctorPhone) docCallBtn.classList.remove('hide');
          else docCallBtn.classList.add('hide');
        }
        
        // Go to default patient view (Appointments or Dashboard)
        const targetTab = this.activeTab || 'tab-appointments';
        // Make sure active tab is a valid patient tab
        if (targetTab === 'tab-doctor-dashboard' || targetTab === 'tab-admin-dashboard' || targetTab === 'tab-caregiver-dashboard') {
          this.activeTab = 'tab-appointments';
        }
        this.switchTab(this.activeTab || 'tab-appointments');
        
      } else if (active.role === 'caregiver') {
        patientTabs.forEach(t => t.classList.add('hide'));
        if (appointmentsTab) appointmentsTab.classList.add('hide');
        if (doctorTab) doctorTab.classList.add('hide');
        if (adminTab) adminTab.classList.add('hide');
        if (caregiverTab) caregiverTab.classList.remove('hide');
        
        // Hide doctor call action for non-patients
        const docCallBtn = document.getElementById('doctor-call-btn');
        if (docCallBtn) docCallBtn.classList.add('hide');
        
        // Go to caregiver view
        this.activeTab = 'tab-caregiver-dashboard';
        this.switchTab('tab-caregiver-dashboard');
        this.renderCaregiverDashboard();
        
      } else if (active.role === 'doctor') {
        patientTabs.forEach(t => t.classList.add('hide'));
        if (appointmentsTab) appointmentsTab.classList.add('hide');
        if (doctorTab) doctorTab.classList.remove('hide');
        if (adminTab) adminTab.classList.add('hide');
        if (caregiverTab) caregiverTab.classList.add('hide');
        
        // Hide doctor call action for non-patients
        const docCallBtn = document.getElementById('doctor-call-btn');
        if (docCallBtn) docCallBtn.classList.add('hide');
        
        // Go to doctor view
        this.activeTab = 'tab-doctor-dashboard';
        this.switchTab('tab-doctor-dashboard');
        this.renderDoctorDashboard();
        
      } else if (active.role === 'admin') {
        patientTabs.forEach(t => t.classList.add('hide'));
        if (appointmentsTab) appointmentsTab.classList.add('hide');
        if (doctorTab) doctorTab.classList.add('hide');
        if (adminTab) adminTab.classList.remove('hide');
        if (caregiverTab) caregiverTab.classList.add('hide');
        
        // Hide doctor call action for non-patients
        const docCallBtn = document.getElementById('doctor-call-btn');
        if (docCallBtn) docCallBtn.classList.add('hide');
        
        // Go to admin view
        this.activeTab = 'tab-admin-dashboard';
        this.switchTab('tab-admin-dashboard');
        this.renderAdminDashboard();
      }
      
      const badge = document.getElementById('patient-profile-badge');
      if (badge) badge.classList.remove('hide');
    } else {
      appShell.classList.add('hide');
      authPortal.classList.remove('hide');
      
      // Hide floating SOS button when logged out
      const sosBtn = document.getElementById('sos-btn');
      if (sosBtn) sosBtn.classList.add('hide');
      
      // Hide caregiver tab when logged out
      const caregiverTab = document.getElementById('nav-caregiver-tab');
      if (caregiverTab) caregiverTab.classList.add('hide');
      
      // Reset forms
      document.getElementById('login-form').reset();
      document.getElementById('register-form').reset();
      document.getElementById('register-card').classList.add('hide');
      document.getElementById('login-card').classList.remove('hide');
      
      const badge = document.getElementById('patient-profile-badge');
      if (badge) badge.classList.add('hide');
    }
  }

  showPatientProfile() {
    const active = stateStore.data.activePatient;
    if (!active) return;

    // Populate modal values
    const nameEl = document.getElementById('profile-modal-patient-name');
    if (nameEl) nameEl.textContent = active.name || '';

    // Populate profile picture in modal
    const modalPicImg = document.getElementById('profile-modal-pic-img');
    const modalPicFallback = document.getElementById('profile-modal-pic-fallback');
    if (modalPicImg && modalPicFallback) {
      if (active.photo) {
        modalPicImg.src = active.photo;
        modalPicImg.classList.remove('hide');
        modalPicFallback.classList.add('hide');
      } else {
        modalPicImg.src = '';
        modalPicImg.classList.add('hide');
        modalPicFallback.classList.remove('hide');
      }
    }

    const bloodEl = document.getElementById('profile-modal-patient-blood-badge');
    const lang = stateStore.data.settings.lang || 'en';
    const bloodLabel = TRANSLATIONS[lang].profileBlood || 'Blood Group';
    if (bloodEl) bloodEl.textContent = `${bloodLabel}: ${active.blood || ''}`;

    const ageEl = document.getElementById('profile-modal-patient-age');
    if (ageEl) ageEl.textContent = active.age || '';

    const genderEl = document.getElementById('profile-modal-patient-gender');
    const genderMap = {
      en: { male: 'Male', female: 'Female', other: 'Other' },
      hi: { male: 'पुरुष', female: 'महिला', other: 'अन्य' },
      te: { male: 'పురుషుడు', female: 'స్త్రీ', other: 'ఇతర' }
    };
    const genderStr = genderMap[lang] ? (genderMap[lang][active.gender] || active.gender) : active.gender;
    if (genderEl) genderEl.textContent = genderStr;

    const mobileEl = document.getElementById('profile-modal-patient-mobile');
    if (mobileEl) mobileEl.textContent = active.mobile || '';

    const emailEl = document.getElementById('profile-modal-patient-email');
    if (emailEl) emailEl.textContent = active.email || '';

    const addressEl = document.getElementById('profile-modal-patient-address');
    if (addressEl) addressEl.textContent = active.address || '';

    const emergencyEl = document.getElementById('profile-modal-patient-emergency');
    if (emergencyEl) emergencyEl.textContent = active.emergency || '';

    const doctorEl = document.getElementById('profile-modal-patient-doctor');
    if (doctorEl) doctorEl.textContent = active.doctorName || '';

    const doctorPhoneEl = document.getElementById('profile-modal-patient-doctor-phone');
    if (doctorPhoneEl) doctorPhoneEl.textContent = active.doctorPhone || '';

    // Show modal
    const modal = document.getElementById('patient-profile-modal');
    if (modal) modal.classList.remove('hide');
  }

  hidePatientProfile() {
    const modal = document.getElementById('patient-profile-modal');
    if (modal) modal.classList.add('hide');
    this.exitProfileEditMode();
  }

  enterProfileEditMode() {
    const active = stateStore.data.activePatient;
    if (!active) return;

    // Fill form controls with patient data
    const nameInput = document.getElementById('edit-profile-name');
    if (nameInput) nameInput.value = active.name || '';

    const ageInput = document.getElementById('edit-profile-age');
    if (ageInput) ageInput.value = active.age || '';

    const genderInput = document.getElementById('edit-profile-gender');
    if (genderInput) genderInput.value = active.gender || 'male';

    const bloodInput = document.getElementById('edit-profile-blood');
    if (bloodInput) bloodInput.value = active.blood || 'A+';

    const mobileInput = document.getElementById('edit-profile-mobile');
    if (mobileInput) mobileInput.value = active.mobile || '';

    const emailInput = document.getElementById('edit-profile-email');
    if (emailInput) emailInput.value = active.email || '';

    const addressInput = document.getElementById('edit-profile-address');
    if (addressInput) addressInput.value = active.address || '';

    const emergencyInput = document.getElementById('edit-profile-emergency');
    if (emergencyInput) emergencyInput.value = active.emergency || '';

    const docNameInput = document.getElementById('edit-profile-doc-name');
    if (docNameInput) docNameInput.value = active.doctorName || '';

    const docPhoneInput = document.getElementById('edit-profile-doc-phone');
    if (docPhoneInput) docPhoneInput.value = active.doctorPhone || '';

    // Toggle views
    const editLayout = document.getElementById('profile-edit-layout');
    const viewLayout = document.getElementById('profile-view-layout');
    if (editLayout) editLayout.classList.remove('hide');
    if (viewLayout) viewLayout.classList.add('hide');

    // Toggle footer buttons
    const closeBtn = document.getElementById('profile-modal-close-btn-2');
    const cancelBtn = document.getElementById('profile-edit-cancel-btn');
    const saveBtn = document.getElementById('profile-edit-save-btn');
    if (closeBtn) closeBtn.classList.add('hide');
    if (cancelBtn) cancelBtn.classList.remove('hide');
    if (saveBtn) saveBtn.classList.remove('hide');

    // Update edit button text to Cancel/Back
    const toggleBtn = document.getElementById('profile-edit-toggle-btn');
    if (toggleBtn) {
      const lang = stateStore.data.settings.lang || 'en';
      toggleBtn.textContent = lang === 'te' ? "రద్దు" : lang === 'hi' ? "रद्द करें" : "Cancel";
    }
  }

  exitProfileEditMode() {
    // Reset view visibility
    const editLayout = document.getElementById('profile-edit-layout');
    const viewLayout = document.getElementById('profile-view-layout');
    if (editLayout) editLayout.classList.add('hide');
    if (viewLayout) viewLayout.classList.remove('hide');

    // Toggle footer buttons
    const closeBtn = document.getElementById('profile-modal-close-btn-2');
    const cancelBtn = document.getElementById('profile-edit-cancel-btn');
    const saveBtn = document.getElementById('profile-edit-save-btn');
    if (closeBtn) closeBtn.classList.remove('hide');
    if (cancelBtn) cancelBtn.classList.add('hide');
    if (saveBtn) saveBtn.classList.add('hide');

    // Reset edit button text to Edit
    const toggleBtn = document.getElementById('profile-edit-toggle-btn');
    if (toggleBtn) {
      const lang = stateStore.data.settings.lang || 'en';
      toggleBtn.textContent = TRANSLATIONS[lang].edit || 'Edit';
    }
  }
  async saveProfileDetails() {
    const active = stateStore.data.activePatient;
    if (!active) return;

    const name = document.getElementById('edit-profile-name').value.trim();
    const age = document.getElementById('edit-profile-age').value;
    const gender = document.getElementById('edit-profile-gender').value;
    const blood = document.getElementById('edit-profile-blood').value;
    const mobile = document.getElementById('edit-profile-mobile').value.trim();
    const email = document.getElementById('edit-profile-email').value.trim();
    const address = document.getElementById('edit-profile-address').value.trim();
    const emergency = document.getElementById('edit-profile-emergency').value.trim();
    const doctorName = document.getElementById('edit-profile-doc-name').value.trim();
    const doctorPhone = document.getElementById('edit-profile-doc-phone').value.trim();

    if (!name || !age || !mobile || !email || !address || !emergency || !doctorName || !doctorPhone) {
      alert(stateStore.data.settings.lang === 'te' ? "దయచేసి అన్ని వివరాలను పూరించండి!" :
            stateStore.data.settings.lang === 'hi' ? "कृपया सभी विवरण भरें!" :
            "Please fill in all required fields!");
      return;
    }

    try {
      const oldActive = { ...active };
      
      active.name = name;
      active.age = age;
      active.gender = gender;
      active.blood = blood;
      active.mobile = mobile;
      active.email = email;
      active.address = address;
      active.emergency = emergency;
      active.doctorName = doctorName;
      active.doctorPhone = doctorPhone;
      
      // Update database
      await this.apiCall('/api/state/save', 'POST', {
        userId: active.id,
        profile: {
          name, age, gender, blood, address, photo: active.photo, emergency, primaryDoctorId: doctorName, doctorPhone
        }
      });
      
      stateStore.data.settings.doctorPhone = doctorPhone;
      stateStore.saveState();

      // Re-sync login session indicators
      this.checkAuthSession();
      this.showPatientProfile();
      this.exitProfileEditMode();
      this.playSuccessConfetti();
    } catch (err) {
      alert(err.message.includes("UNIQUE constraint failed") ? 
        (stateStore.data.settings.lang === 'te' ? "ఈ ఇమెయిల్ లేదా మొబైల్ నంబర్ ఇప్పటికే నమోదై ఉంది!" :
         stateStore.data.settings.lang === 'hi' ? "यह ईमेल या मोबाइल नंबर पहले से पंजीकृत है!" :
         "Email or mobile number already registered to another account!") : 
        err.message);
    }
  }

  renderPatientCard(p) {
    const avatarContent = p.photo 
      ? `<img src="${p.photo}">` 
      : `<span>👤</span>`;
      
    const bloodGroupText = p.blood ? `, Blood: ${p.blood}` : '';
    
    return `
      <div class="patient-card dashboard-card" data-patient-id="${p.id}">
        <div class="patient-card-header">
          <div class="patient-card-avatar">
            ${avatarContent}
          </div>
          <div class="patient-card-info">
            <h4>${p.name}</h4>
            <span>Age: ${p.age || '-'}, Gender: ${p.gender || '-'}${bloodGroupText}</span>
          </div>
        </div>
        <div class="patient-card-metrics">
          <div>
            <strong>${p.adherence || 0}%</strong>
            <span>Adherence</span>
          </div>
          <div>
            <strong>${p.streak || 0}d</strong>
            <span>Streak</span>
          </div>
        </div>
      </div>
    `;
  }

  async renderDoctorDashboard() {
    try {
      const grid = document.getElementById('doctor-patients-grid');
      if (!grid) return;
      grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem;">Loading patients...</div>';
      
      const patients = await this.apiCall('/api/patients');
      grid.innerHTML = '';
      
      if (!patients || patients.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-muted);">No registered patients found.</div>';
        return;
      }
      
      patients.forEach(p => {
        const cardHtml = this.renderPatientCard(p);
        const cardWrapper = document.createElement('div');
        cardWrapper.innerHTML = cardHtml.trim();
        const cardEl = cardWrapper.firstChild;
        
        cardEl.addEventListener('click', () => {
          this.loadDoctorPatientDetails(p.id);
        });
        
        grid.appendChild(cardEl);
      });
      
    } catch (err) {
      console.error(err);
      const grid = document.getElementById('doctor-patients-grid');
      if (grid) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--rose-color);">Error: ${err.message}</div>`;
      }
    }
  }

  async loadDoctorPatientDetails(patientId) {
    try {
      const detailsCard = document.getElementById('doctor-patient-details-card');
      const grid = document.getElementById('doctor-patients-grid');
      if (!detailsCard) return;
      
      detailsCard.classList.remove('hide');
      if (grid) grid.classList.add('hide');
      
      // Clear old details fields
      document.getElementById('doc-patient-detail-name').textContent = "Loading...";
      document.getElementById('doc-patient-age').textContent = "-";
      document.getElementById('doc-patient-gender').textContent = "-";
      document.getElementById('doc-patient-blood').textContent = "-";
      document.getElementById('doc-patient-mobile').textContent = "-";
      document.getElementById('doc-patient-email').textContent = "-";
      document.getElementById('doc-patient-address').textContent = "-";
      document.getElementById('doc-patient-emergency').textContent = "-";
      document.getElementById('doc-patient-streak').textContent = "-";
      document.getElementById('doc-patient-adherence').textContent = "-";
      
      const medListContainer = document.getElementById('doc-patient-medicines-list');
      if (medListContainer) medListContainer.innerHTML = 'Loading medicines...';
      
      const data = await this.apiCall(`/api/patient-details?id=${patientId}`);
      
      const p = data.patient;
      
      document.getElementById('doc-patient-detail-name').textContent = p.name;
      document.getElementById('doc-patient-age').textContent = p.age || "-";
      document.getElementById('doc-patient-gender').textContent = p.gender || "-";
      document.getElementById('doc-patient-blood').textContent = p.blood_group || p.blood || "-";
      document.getElementById('doc-patient-mobile').textContent = p.mobile || "-";
      document.getElementById('doc-patient-email').textContent = p.email || "-";
      document.getElementById('doc-patient-address').textContent = p.address || "-";
      document.getElementById('doc-patient-emergency').textContent = p.emergency_contact || p.emergency || "-";
      
      let adherence = 0;
      let streak = 0;
      if (data.logs && data.logs.length > 0) {
        const taken = data.logs.filter(log => log.status === 'taken').length;
        adherence = Math.round((taken / data.logs.length) * 100);
        streak = data.logs.filter(log => log.status === 'taken').length;
      }
      document.getElementById('doc-patient-adherence').textContent = `${adherence}%`;
      document.getElementById('doc-patient-streak').textContent = streak;
      
      const apptPatientInput = document.getElementById('doc-appt-patient-id');
      if (apptPatientInput) apptPatientInput.value = p.id;
      
      const fallback = document.getElementById('doc-patient-pic-fallback');
      const img = document.getElementById('doc-patient-pic-img');
      if (fallback && img) {
        if (p.photo) {
          img.src = p.photo;
          img.classList.remove('hide');
          fallback.classList.add('hide');
        } else {
          img.src = '';
          img.classList.add('hide');
          fallback.classList.remove('hide');
        }
      }
      
      if (medListContainer) {
        medListContainer.innerHTML = '';
        if (!data.medicines || data.medicines.length === 0) {
          medListContainer.innerHTML = '<div style="color: var(--text-muted); font-size: 0.85rem; padding: 0.5rem 0;">No medicines listed in cabinet.</div>';
        } else {
          data.medicines.forEach(m => {
            const timeLabels = m.times.map(t => `<span class="badge badge-normal" style="font-size:0.75rem;">${t}</span>`).join(' ');
            const card = document.createElement('div');
            card.className = 'checklist-card dashboard-card';
            card.style.borderLeft = `4px solid ${m.color || 'var(--teal-color)'}`;
            card.style.margin = '0.5rem 0';
            card.style.padding = '0.75rem 1rem';
            
            card.innerHTML = `
              <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <div>
                  <h4 style="font-weight: 700; color: var(--text-primary); margin:0;">${m.name}</h4>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">${m.dosage} (${m.type})</span>
                  <div style="margin-top: 0.4rem;">
                    ${timeLabels}
                  </div>
                </div>
                <div style="text-align: right;">
                  <span style="font-size: 0.75rem; font-weight:700; color: ${m.stock <= m.refillAlertAt ? 'var(--rose-color)' : 'var(--teal-color)'};">Stock: ${m.stock}</span>
                </div>
              </div>
            `;
            medListContainer.appendChild(card);
          });
        }
      }
      
    } catch (err) {
      alert("Failed to load patient details: " + err.message);
    }
  }

  async renderAdminDashboard() {
    try {
      const tbody = document.getElementById('admin-users-tbody');
      if (!tbody) return;
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">Loading users...</td></tr>';
      
      const users = await this.apiCall('/api/admin/users');
      tbody.innerHTML = '';
      
      if (!users || users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">No users found.</td></tr>';
        return;
      }
      
      users.forEach(u => {
        const tr = document.createElement('tr');
        
        let badgeColor = 'var(--text-muted)';
        if (u.role === 'patient') badgeColor = 'var(--teal-color)';
        else if (u.role === 'doctor') badgeColor = 'var(--blue-color)';
        else if (u.role === 'admin') badgeColor = 'var(--amber-color)';
        
        const roleBadge = `<span class="badge" style="background: rgba(255,255,255,0.03); border: 1px solid ${badgeColor}; color: ${badgeColor}; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; text-transform: uppercase;">${u.role}</span>`;
        
        const canDelete = (u.id !== 'admin_1') && (u.id !== stateStore.data.activePatient.id);
        const delBtn = canDelete 
          ? `<button class="btn btn-xs btn-glass font-danger delete-user-btn" data-user-id="${u.id}" data-user-name="${u.name}" style="padding: 0.3rem 0.6rem; font-weight: 700;">Delete</button>`
          : `<button class="btn btn-xs btn-glass" disabled style="opacity: 0.4; cursor: not-allowed; padding: 0.3rem 0.6rem;">Delete</button>`;
          
        tr.innerHTML = `
          <td><strong>${u.name}</strong></td>
          <td>${roleBadge}</td>
          <td>${u.email}</td>
          <td>${u.mobile}</td>
          <td style="text-align: center;">${delBtn}</td>
        `;
        tbody.appendChild(tr);
      });
      
    } catch (err) {
      console.error(err);
      const tbody = document.getElementById('admin-users-tbody');
      if (tbody) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--rose-color);">Error: ${err.message}</td></tr>`;
      }
    }
  }
  // Speak medicine details on demand (Helpful for uneducated users)
  speakMedicineIntake(medicineId) {
    const med = stateStore.data.medicines.find(m => m.id === medicineId);
    if (!med) return;

    const instructionsText = med.instructions ? med.instructions : '';

    voiceNarrator.speak({
      en: `Medicine name: ${med.name}. Dosage: ${med.dosage}. ${instructionsText ? `Instructions: ${instructionsText}` : ''}`,
      hi: `दवा का नाम: ${med.name}। खुराक: ${med.dosage}। ${instructionsText ? `विशेष निर्देश: ${instructionsText}` : ''}`,
      te: `మందు పేరు: ${med.name}. మోతాదు: ${med.dosage}. ${instructionsText ? `సూచనలు: ${instructionsText}` : ''}`
    });
  }

  // Trigger Medicine 5-minute pre-alert warning
  triggerMedicinePreAlert(med, time) {
    const lang = stateStore.data.settings.lang || 'en';
    const title = TRANSLATIONS[lang].preAlertMedTitle || "Medicine Reminder (In 5 mins)";
    const body = (TRANSLATIONS[lang].preAlertMedBody || "It will be time to take {dosage} of {name} in 5 minutes.")
      .replace('{name}', med.name)
      .replace('{dosage}', med.dosage);

    const speakObj = {
      en: `Attention. In 5 minutes, it will be time to take your dose of ${med.name}, ${med.dosage}.`,
      hi: `ध्यान दें। 5 मिनट में आपको ${med.name} की ${med.dosage} खुराक लेनी होगी।`,
      te: `గమనించండి. 5 నిమిషాల్లో మీరు ${med.name} యొక్క ${med.dosage} డోస్ తీసుకోవాలి.`
    };

    this.showPreAlertNotification('medicine', title, body, speakObj);
  }

  // Trigger Doctor Checkup 5-minute pre-alert warning
  triggerAppointmentPreAlert(appt) {
    const lang = stateStore.data.settings.lang || 'en';
    const title = TRANSLATIONS[lang].preAlertApptTitle || "Check-up Reminder (In 5 mins)";
    const purposeText = appt.purpose || (lang === 'te' ? 'వైద్య పరీక్ష' : lang === 'hi' ? 'चिकित्सा जांच' : 'Medical Check-up');
    const body = (TRANSLATIONS[lang].preAlertApptBody || "Appointment with Dr. {doctorName} for {purpose} in 5 minutes.")
      .replace('{doctorName}', appt.doctorName)
      .replace('{purpose}', purposeText);

    const speakObj = {
      en: `Attention. In 5 minutes, you have a check-up appointment with Dr. ${appt.doctorName}.`,
      hi: `ध्यान दें। 5 मिनट में डॉक्टर ${appt.doctorName} के साथ आपकी नियुक्ति है।`,
      te: `గమనించండి. 5 నిమిషాల్లో డాక్టర్ ${appt.doctorName} తో మీకు అపాయింట్‌మెంట్ ఉంది.`
    };

    this.showPreAlertNotification('appointment', title, body, speakObj);
  }

  // Dynamic visual/audio toast notification injector
  showPreAlertNotification(type, title, body, speakText) {
    // 1. Play soft alarm chime chord (pleasant tone)
    alarmSoundSynth.start(false);
    setTimeout(() => alarmSoundSynth.stop(), 2000);

    // 2. Speak message using voice synthesis
    voiceNarrator.speak(speakText);

    // 3. Create toast HTML element
    const container = document.getElementById('pre-alert-toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `pre-alert-toast ${type}-toast`;
    
    const icon = type === 'medicine' ? '💊' : '📅';
    
    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-body">${body}</div>
      </div>
      <button class="toast-close-btn" aria-label="Close">&times;</button>
      <div class="toast-progress-bar"></div>
    `;

    // Hook close button click event
    const closeBtn = toast.querySelector('.toast-close-btn');
    const dismissToast = () => {
      if (toast.classList.contains('dismissed')) return;
      toast.classList.add('dismissed');
      toast.style.animation = 'toastSlideOut 0.3s ease forwards';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    };

    closeBtn.addEventListener('click', dismissToast);

    // Add toast to the container
    container.appendChild(toast);

    // Set auto-dismiss after 10 seconds (10000 ms)
    setTimeout(dismissToast, 10000);
  }

  // Trigger Doctor Checkup due alarms
  triggerAppointmentAlert(appt) {
    alarmSoundSynth.start(false); // pleasant chime
    setTimeout(() => alarmSoundSynth.stop(), 5000);

    const lang = stateStore.data.settings.lang || 'en';
    const alertMsgTe = `గమనించండి. డాక్టర్ ${appt.doctorName} తో మీకు అపాయింట్‌మెంట్ సమయం అయింది. కారణం: ${appt.purpose || 'వైద్య పరీక్ష'}.`;
    const alertMsgHi = `ध्यान दें। डॉक्टर ${appt.doctorName} के साथ आपकी नियुक्ति का समय हो गया है। उद्देश्य: ${appt.purpose || 'चिकित्सा जांच'}।`;
    const alertMsgEn = `Attention. It is time for your appointment with Dr. ${appt.doctorName}. Purpose: ${appt.purpose || 'Medical Check-up'}.`;

    voiceNarrator.speak({
      en: alertMsgEn,
      hi: alertMsgHi,
      te: alertMsgTe
    });

    const alertMsg = lang === 'te' ? alertMsgTe : lang === 'hi' ? alertMsgHi : alertMsgEn;
    alert(alertMsg);

    this.renderAppointments();
  }

  // Render Doctor Checkup Lists
  renderAppointments() {
    const upcomingContainer = document.getElementById('upcoming-appointments-container');
    const historyTbody = document.getElementById('appointments-history-tbody');
    
    if (!upcomingContainer || !historyTbody) return;

    upcomingContainer.innerHTML = '';
    historyTbody.innerHTML = '';

    const appts = stateStore.data.appointments || [];
    const patientId = stateStore.data.activePatient ? stateStore.data.activePatient.id : null;

    // Filter appointments matching active logged in user
    const userAppts = appts.filter(a => a.patientId === patientId);

    // Sort chronologically
    userAppts.sort((a, b) => {
      const dateTimeA = new Date(`${a.date}T${a.time}`);
      const dateTimeB = new Date(`${b.date}T${b.time}`);
      return dateTimeA - dateTimeB;
    });

    const nowSim = clockEngine.getSimulatedDate();
    const simTimeMs = nowSim.getTime();

    const upcoming = [];
    const past = [];

    userAppts.forEach(appt => {
      const [hour, min] = appt.time.split(':').map(Number);
      const apptDate = parseLocalDate(appt.date);
      apptDate.setHours(hour, min, 0, 0);

      if (apptDate.getTime() >= simTimeMs && appt.status === 'pending') {
        upcoming.push(appt);
      } else {
        past.push(appt);
      }
    });

    // RENDER UPCOMING LIST
    if (upcoming.length === 0) {
      upcomingContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📅</div>
          <p data-i18n="noAppointments">No check-ups scheduled. Stay healthy by booking regular follow-ups!</p>
        </div>`;
    } else {
      upcoming.forEach(appt => {
        const card = document.createElement('div');
        card.className = 'checklist-card';
        card.style.borderLeft = '4px solid var(--teal-color)';

        // Format nice date/time
        const dateObj = parseLocalDate(appt.date);
        const dayStr = dateObj.toLocaleDateString();
        const time12 = this.format12Hour(appt.time);

        card.innerHTML = `
          <div class="checklist-card-info" style="flex: 1;">
            <div class="due-time-stamp" style="font-size:0.75rem; min-width:5rem;">${time12}</div>
            <div class="med-meta-detail">
              <span class="med-meta-title" style="font-size: 1.05rem;">🩺 Dr. ${appt.doctorName}</span>
              <span class="med-meta-desc">
                <span>📅 ${dayStr}</span>
                ${appt.purpose ? `• <span class="font-muted">${appt.purpose}</span>` : ''}
              </span>
            </div>
          </div>
          <div class="checklist-card-actions" style="margin-left: 1rem; display:flex; gap:0.5rem; align-items:center;">
            <button class="action-check-btn btn-speak" title="Speak Aloud" onclick="appController.speakAppointmentDetails('${appt.id}')" style="color: var(--blue-color); border-color: rgba(59, 130, 246, 0.2);">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
              </svg>
            </button>
            <button class="btn btn-glass btn-xs font-danger" onclick="appController.deleteAppointment('${appt.id}')">Cancel</button>
          </div>
        `;
        upcomingContainer.appendChild(card);
      });
    }

    // RENDER PAST / COMPLETED LIST
    if (past.length === 0) {
      historyTbody.innerHTML = `
        <tr>
          <td colspan="4" class="text-center font-muted" data-i18n="noPastAppointments">No past appointments recorded.</td>
        </tr>`;
    } else {
      // Sort reverse chronological
      past.sort((a, b) => {
        const dateTimeA = new Date(`${a.date}T${a.time}`);
        const dateTimeB = new Date(`${b.date}T${b.time}`);
        return dateTimeB - dateTimeA;
      });

      past.forEach(appt => {
        const tr = document.createElement('tr');
        const dateObj = parseLocalDate(appt.date);
        const dayStr = dateObj.toLocaleDateString();
        const time12 = this.format12Hour(appt.time);
        
        const statusClass = appt.status === 'completed' ? 'pill-badge badge-taken' : 'pill-badge badge-skipped';

        tr.innerHTML = `
          <td><strong>${dayStr}</strong>, <span class="font-muted">${time12}</span></td>
          <td><strong>Dr. ${appt.doctorName}</strong></td>
          <td>${appt.purpose || '--'}</td>
          <td><span class="${statusClass}">${appt.status}</span></td>
        `;
        historyTbody.appendChild(tr);
      });
    }
  }

  // Speak appointment details on demand
  speakAppointmentDetails(apptId) {
    const appt = stateStore.data.appointments.find(a => a.id === apptId);
    if (!appt) return;

    const dateObj = parseLocalDate(appt.date);
    const dayStr = dateObj.toLocaleDateString();
    const time12 = this.format12Hour(appt.time);
    const purposeText = appt.purpose ? appt.purpose : '';

    voiceNarrator.speak({
      en: `Doctor appointment with Dr. ${appt.doctorName} on ${dayStr} at ${time12}. ${purposeText ? `Purpose: ${purposeText}` : ''}`,
      hi: `डॉक्टर अपॉइंटमेंट। डॉक्टर ${appt.doctorName}। तिथि: ${dayStr} समय: ${time12}। ${purposeText ? `विवरण: ${purposeText}` : ''}`,
      te: `వైద్యుని అపాయింట్‌మెంట్. డాక్టర్ ${appt.doctorName}. తేదీ: ${dayStr} సమయం: ${time12}. ${purposeText ? `వివరాలు: ${purposeText}` : ''}`
    });
  }

  deleteAppointment(apptId) {
    if (confirm(stateStore.data.settings.lang === 'te' ? "ఈ అపాయింట్‌మెంట్‌ను రద్దు చేయాలనుకుంటున్నారా?" :
                stateStore.data.settings.lang === 'hi' ? "क्या आप इस अपॉइंटमेंट को रद्द करना चाहते हैं?" :
                "Are you sure you want to cancel this appointment?")) {
      stateStore.data.appointments = stateStore.data.appointments.filter(a => a.id !== apptId);
      stateStore.saveState();
      this.renderAppointments();
    }
  }

  // Render daily checklists cards for Today
  renderDailySchedule() {
    const container = document.getElementById('daily-checklist-container');
    const filterSelectVal = document.getElementById('time-of-day-filter').value;
    
    const activeSimDate = clockEngine.getSimulatedDate();
    const activeDateStr = clockEngine.getFormattedDateOnly(activeSimDate);
    const weekday = activeSimDate.getDay();

    // 1. Gather all schedules for today
    const todaysSchedules = [];

    stateStore.data.medicines.forEach(med => {
      // Filter out if specific day frequency does not match today
      if (med.frequency === 'specific_days' && med.specificDays && !med.specificDays.includes(weekday)) {
        return;
      }

      med.times.forEach(time => {
        // Resolve taken status from history logs for this specific date slot
        const matchingLog = stateStore.data.logs.find(log => 
          log.medicineId === med.id && 
          log.time === time && 
          log.date === activeDateStr
        );
        
        let status = 'pending';
        if (matchingLog) {
          status = matchingLog.status; // 'taken' or 'skipped'
        }

        // Slot period categorizer
        const hour = parseInt(time.split(':')[0]);
        let period = 'morning';
        if (hour >= 12 && hour < 17) period = 'afternoon';
        else if (hour >= 17 && hour < 21) period = 'evening';
        else if (hour >= 21 || hour < 6) period = 'night';

        todaysSchedules.push({
          med,
          time,
          period,
          status
        });
      });
    });

    // Sort schedules chronologically by hour and minutes
    todaysSchedules.sort((a, b) => a.time.localeCompare(b.time));

    // 2. Filter by Tab Selector Period dropdown
    const filteredSchedules = todaysSchedules.filter(item => {
      if (filterSelectVal === 'all') return true;
      return item.period === filterSelectVal;
    });

    // 3. Clear container
    container.innerHTML = '';

    if (stateStore.data.medicines.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">💊</div>
          <p>Your medicine cabinet is empty! Add your first medicine to generate your daily schedule.</p>
          <button class="btn btn-primary trigger-cabinet-modal-btn">Add Medicine Now</button>
        </div>`;
      this.updateAdherenceWidgets(0, 0);
      this.renderNextDoseWidget(null);
      return;
    }

    if (filteredSchedules.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📅</div>
          <p>No doses scheduled for the selected period today.</p>
        </div>`;
    } else {
      filteredSchedules.forEach(item => {
        const card = document.createElement('div');
        card.className = `checklist-card ${item.status}-state`;
        card.setAttribute('data-med-id', item.med.id);
        card.setAttribute('data-time', item.time);
        
        // Resolve icons representing shapes
        let shapeIcon = '💊';
        if (item.med.type === 'syrup') shapeIcon = '🧴';
        else if (item.med.type === 'injection') shapeIcon = '💉';
        else if (item.med.type === 'drops') shapeIcon = '💧';
        else if (item.med.type === 'inhaler') shapeIcon = '💨';

        // Check active states toggles
        const isTaken = item.status === 'taken';
        const isSkipped = item.status === 'skipped';

        card.innerHTML = `
          <div class="checklist-card-info">
            <div class="due-time-stamp">${this.format12Hour(item.time)}</div>
            <div class="med-meta-detail">
              <span class="med-meta-title" style="border-left: 3px solid ${item.med.color || '#0d9488'}; padding-left: 0.5rem;">
                ${item.med.name}
              </span>
              <span class="med-meta-desc">
                <span>${shapeIcon} ${item.med.dosage}</span>
                ${item.med.instructions ? `• <span class="font-muted">${item.med.instructions}</span>` : ''}
              </span>
            </div>
          </div>
          <div class="checklist-card-actions">
            <!-- Speak details out loud -->
            <button class="action-check-btn btn-speak" title="Speak Aloud" onclick="appController.speakMedicineIntake('${item.med.id}')" style="color: var(--blue-color); border-color: rgba(59, 130, 246, 0.25);">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" width="16" height="16">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
              </svg>
            </button>
            <!-- Take action -->
            <button class="action-check-btn btn-take ${isTaken ? 'active' : ''}" title="Mark Taken" onclick="appController.toggleDoseStatus('${item.med.id}', '${item.time}', 'taken')">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" width="16" height="16">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </button>
            <!-- Skip action -->
            <button class="action-check-btn btn-skip ${isSkipped ? 'active' : ''}" title="Mark Skipped" onclick="appController.toggleDoseStatus('${item.med.id}', '${item.time}', 'skipped')">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" width="16" height="16">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        `;
        container.appendChild(card);
      });
    }

    // 4. Update Header Metrics
    const totalDosesToday = todaysSchedules.length;
    const takenDosesToday = todaysSchedules.filter(s => s.status === 'taken').length;
    this.updateAdherenceWidgets(takenDosesToday, totalDosesToday);

    // 5. Update next upcoming dose
    const pendingDoses = todaysSchedules.filter(s => s.status === 'pending');
    
    // Find next dose chronologically after current simulated time
    const nowSimDate = clockEngine.getSimulatedDate();
    const currentSimHours = nowSimDate.getHours();
    const currentSimMins = nowSimDate.getMinutes();
    const currentTimeStr = `${currentSimHours.toString().padStart(2, '0')}:${currentSimMins.toString().padStart(2, '0')}`;

    const upcomingDose = pendingDoses.find(s => s.time.localeCompare(currentTimeStr) >= 0);
    this.renderNextDoseWidget(upcomingDose || null);

    // 6. RENDER AS NEEDED (PRN) MEDICATIONS
    const prnContainer = document.getElementById('prn-checklist-container');
    if (prnContainer) {
      prnContainer.innerHTML = '';
      
      const prnMeds = stateStore.data.medicines.filter(m => m.frequency === 'prn');
      
      if (prnMeds.length === 0) {
        prnContainer.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">🩹</div>
            <p>No as-needed (PRN) medications configured. Add ones like Paracetamol/Dolo 650 to log when needed.</p>
          </div>`;
      } else {
        prnMeds.forEach(med => {
          const card = document.createElement('div');
          card.className = 'checklist-card';
          card.style.borderLeft = `4px solid ${med.color || '#f43f5e'}`;

          // Find the last log for this PRN medicine
          const medLogs = stateStore.data.logs.filter(l => l.medicineId === med.id && l.status === 'taken');
          let lastTakenText = 'Never taken';
          let timeGapText = '';
          if (medLogs.length > 0) {
            // Sort by timestamp
            medLogs.sort((a, b) => b.timestamp - a.timestamp);
            const lastLog = medLogs[0];
            const lastLogDate = new Date(lastLog.timestamp);
            
            // Calculate time gap in hours
            const deltaMs = clockEngine.currentSimMs - lastLog.timestamp;
            const deltaHrs = (deltaMs / (1000 * 3600)).toFixed(1);
            
            // Format date/time
            const logDateStr = lastLogDate.toLocaleDateString();
            const logTimeStr = lastLogDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            lastTakenText = `Last dose: ${logDateStr} at ${logTimeStr} (${deltaHrs} hrs ago)`;
            
            // If deltaHrs is less than med.prnGap, show a yellow warning badge
            if (parseFloat(deltaHrs) < parseFloat(med.prnGap || 4)) {
              timeGapText = `<span class="badge badge-normal text-amber" style="margin-left:0.5rem">Gap Lock: ${deltaHrs}/${med.prnGap}h</span>`;
            }
          }

          // Count doses taken in the last 24 simulated hours
          const last24hMs = clockEngine.currentSimMs - (24 * 3600 * 1000);
          const dosesLast24h = medLogs.filter(l => l.timestamp >= last24hMs).length;
          let limitWarningText = `Today: ${dosesLast24h}/${med.prnMax || 4} doses`;
          if (dosesLast24h >= (med.prnMax || 4)) {
            limitWarningText = `<span class="text-orange" style="font-weight:700">Limit Reached: ${dosesLast24h}/${med.prnMax || 4} doses</span>`;
          }

          let shapeIcon = '💊';
          if (med.type === 'syrup') shapeIcon = '🧴';
          else if (med.type === 'injection') shapeIcon = '💉';
          else if (med.type === 'drops') shapeIcon = '💧';
          else if (med.type === 'inhaler') shapeIcon = '💨';

          card.innerHTML = `
            <div class="checklist-card-info" style="flex: 1;">
              <div class="due-time-stamp" style="font-size:0.75rem; min-width:4rem; color:var(--text-secondary); background:rgba(255,255,255,0.02);">PRN</div>
              <div class="med-meta-detail">
                <span class="med-meta-title" style="font-size:1.05rem">${med.name}</span>
                <span class="med-meta-desc">
                  <span>${shapeIcon} ${med.dosage}</span>
                  • <span>Trigger: <strong>${med.prnCondition || 'High Temp / Fever'}</strong></span>
                </span>
                <span class="font-muted" style="font-size:0.75rem; margin-top:0.25rem; display:flex; align-items:center; flex-wrap:wrap;">
                  <span>${lastTakenText}</span>
                  ${timeGapText}
                  <span style="margin-left: auto; font-weight:600">${limitWarningText}</span>
                </span>
              </div>
            </div>
            <div class="checklist-card-actions" style="margin-left: 1rem; display: flex; gap: 0.5rem; align-items: center;">
              <button class="action-check-btn btn-speak" title="Speak Aloud" onclick="appController.speakMedicineIntake('${med.id}')" style="color: var(--blue-color); border-color: rgba(59, 130, 246, 0.25);">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" width="16" height="16">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                </svg>
              </button>
              <button class="btn btn-teal btn-sm" onclick="appController.logPrnDose('${med.id}')">
                Log Intake
              </button>
            </div>
          `;
          prnContainer.appendChild(card);
        });
      }
    }
  }

  // Toggle dose taken/skipped directly from check off lists
  toggleDoseStatus(medicineId, scheduledTime, targetStatus) {
    const activeSimDate = clockEngine.getSimulatedDate();
    const activeDateStr = clockEngine.getFormattedDateOnly(activeSimDate);

    // Find if a log entry already exists for this exact day slot
    const existingLogIndex = stateStore.data.logs.findIndex(log => 
      log.medicineId === medicineId && 
      log.time === scheduledTime && 
      log.date === activeDateStr
    );

    const med = stateStore.data.medicines.find(m => m.id === medicineId);

    if (existingLogIndex > -1) {
      const existingStatus = stateStore.data.logs[existingLogIndex].status;
      
      if (existingStatus === targetStatus) {
        // Toggle OFF if clicked same status again (resets to pending)
        stateStore.data.logs.splice(existingLogIndex, 1);
        
        // Refund inventory stock if marking down from 'taken'
        if (targetStatus === 'taken' && med && med.stock !== undefined) {
          med.stock += 1;
        }
      } else {
        // Change status (e.g. from taken to skipped)
        stateStore.data.logs[existingLogIndex].status = targetStatus;
        stateStore.data.logs[existingLogIndex].timestamp = activeSimDate.getTime();

        // Adjust stock counts if switching status
        if (med && med.stock !== undefined) {
          if (targetStatus === 'taken') med.stock = Math.max(0, med.stock - 1);
          if (existingStatus === 'taken') med.stock += 1;
        }
      }
    } else {
      // Create new compliance log entry
      stateStore.data.logs.push({
        id: 'log_' + Date.now() + Math.random().toString(36).substr(2, 4),
        medicineId: medicineId,
        medicineName: med ? med.name : 'Unknown Medicine',
        time: scheduledTime,
        date: activeDateStr,
        status: targetStatus,
        dosage: med ? med.dosage : '',
        timestamp: activeSimDate.getTime()
      });

      // Reduce inventory if marking Taken
      if (targetStatus === 'taken' && med && med.stock !== undefined) {
        med.stock = Math.max(0, med.stock - 1);
      }
    }

    stateStore.saveState();
    
    // Play celebratory micro-alert sounds if marked taken successfully
    if (targetStatus === 'taken' && (existingLogIndex === -1 || stateStore.data.logs[existingLogIndex]?.status === 'taken')) {
      this.playSuccessConfetti();
    }

    this.renderDailySchedule();
    this.renderCabinet();
    this.renderAnalytics();
    this.calculateStreak();

    const active = stateStore.data.activePatient;
    if (active && active.role === 'caregiver') {
      this.renderCaregiverDashboard();
    }
  }

  // Updates adherence percentage dashboard
  updateAdherenceWidgets(takenCount, totalCount) {
    const pctSpan = document.getElementById('adherence-pct');
    const fractionText = document.getElementById('adherence-fraction');
    const circle = document.getElementById('adherence-circle');

    if (totalCount === 0) {
      pctSpan.textContent = '0%';
      fractionText.textContent = 'No doses scheduled';
      circle.style.strokeDashoffset = '314.16'; // zero circle circumference offset
      return;
    }

    const pctVal = Math.round((takenCount / totalCount) * 100);
    pctSpan.textContent = `${pctVal}%`;
    fractionText.textContent = `${takenCount} of ${totalCount} doses taken`;

    // Adjust stroke offset SVG circle
    const circ = 2 * Math.PI * 50; // 314.159
    const offset = circ - (pctVal / 100) * circ;
    circle.style.strokeDashoffset = offset;
  }

  renderNextDoseWidget(upcomingDoseItem) {
    const display = document.getElementById('next-dose-display');
    const countdownBadge = document.getElementById('countdown-container');

    if (!upcomingDoseItem) {
      display.innerHTML = `
        <div class="next-dose-time">--:--</div>
        <div class="next-dose-med">No doses remaining today</div>
        <div class="next-dose-desc">All caught up! Check back tomorrow.</div>
      `;
      countdownBadge.classList.add('hide');
      return;
    }

    const time12hr = this.format12Hour(upcomingDoseItem.time);
    
    // Resolve icons representing shapes
    let shapeIcon = '💊';
    if (upcomingDoseItem.med.type === 'syrup') shapeIcon = '🧴';
    else if (upcomingDoseItem.med.type === 'injection') shapeIcon = '💉';
    else if (upcomingDoseItem.med.type === 'drops') shapeIcon = '💧';
    
    display.innerHTML = `
      <div class="next-dose-time" id="next-dose-time" style="color: ${upcomingDoseItem.med.color}">${time12hr}</div>
      <div class="next-dose-med" id="next-dose-name">${upcomingDoseItem.med.name}</div>
      <div class="next-dose-desc" id="next-dose-desc">${shapeIcon} ${upcomingDoseItem.med.dosage} ${upcomingDoseItem.med.instructions ? `• ${upcomingDoseItem.med.instructions}` : ''}</div>
    `;

    // Keep active timer updating
    this.updateCountdownBadge();
  }

  updateCountdownBadge() {
    const badge = document.getElementById('countdown-container');
    const timerText = document.getElementById('countdown-timer');

    const nextTimeSpan = document.getElementById('next-dose-time');
    if (!nextTimeSpan || nextTimeSpan.textContent === '--:--') {
      badge.classList.add('hide');
      return;
    }

    const nextTimeStr = document.getElementById('next-dose-time').innerText; 
    const nextName = document.getElementById('next-dose-name').innerText;
    
    // Find active schedule item matches this name and time
    const nextMed = stateStore.data.medicines.find(m => m.name === nextName);
    if (!nextMed) {
      badge.classList.add('hide');
      return;
    }

    // Resolve time format 12 hour to 24 hour back
    let time24 = "";
    nextMed.times.forEach(t => {
      if (this.format12Hour(t) === nextTimeStr) {
        time24 = t;
      }
    });

    if (!time24) {
      badge.classList.add('hide');
      return;
    }

    const [hours, minutes] = time24.split(':').map(Number);
    const now = clockEngine.getSimulatedDate();
    
    // Target time
    const target = new Date(now);
    target.setHours(hours, minutes, 0, 0);

    const deltaMs = target.getTime() - now.getTime();
    if (deltaMs <= 0) {
      badge.classList.add('hide');
      return;
    }

    badge.classList.remove('hide');

    const totalSeconds = Math.floor(deltaMs / 1000);
    const hr = Math.floor(totalSeconds / 3600);
    const min = Math.floor((totalSeconds % 3600) / 60);
    const sec = totalSeconds % 60;

    let countdownStr = "";
    if (hr > 0) countdownStr += `${hr}h `;
    countdownStr += `${min.toString().padStart(2, '0')}m ${sec.toString().padStart(2, '0')}s`;

    timerText.textContent = countdownStr;
  }

  // Renders the Cabinet Inventory Grid
  renderCabinet() {
    const container = document.getElementById('cabinet-grid-container');
    const searchVal = document.getElementById('cabinet-search').value.toLowerCase();
    const typeVal = document.getElementById('cabinet-form-filter').value;

    container.innerHTML = '';

    const filteredMeds = stateStore.data.medicines.filter(med => {
      // 1. Keyword search check
      const matchesSearch = med.name.toLowerCase().includes(searchVal) || 
                            (med.instructions && med.instructions.toLowerCase().includes(searchVal));
      
      // 2. Type filter check
      const matchesType = typeVal === 'all' || med.type === typeVal;

      return matchesSearch && matchesType;
    });

    if (filteredMeds.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon">🗄️</div>
          <p>No medications match your filter criteria.</p>
        </div>`;
      return;
    }

    filteredMeds.forEach(med => {
      const card = document.createElement('div');
      card.className = 'med-card';
      card.style.borderTopColor = med.color || '#0d9488';

      // Shape icon
      let shapeIcon = '💊';
      if (med.type === 'syrup') shapeIcon = '🧴';
      else if (med.type === 'injection') shapeIcon = '💉';
      else if (med.type === 'drops') shapeIcon = '💧';
      else if (med.type === 'inhaler') shapeIcon = '💨';

      // 12-hour formatted scheduled hours list
      const timeSlots = med.times.map(t => this.format12Hour(t)).join(', ');

      // Frequency strings
      let freqString = "Every single day";
      if (med.frequency === 'specific_days') {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const days = med.specificDays.map(d => dayNames[d]).join(', ');
        freqString = `Only on: ${days}`;
      }

      // Stock logic
      let stockDisplay = '';
      if (med.stock !== undefined && med.stock !== null && med.stock !== '') {
        const currentStock = parseInt(med.stock);
        const threshold = parseInt(med.refillAlertAt || 5);
        
        let barClass = '';
        let warningBadge = '';

        if (currentStock <= 0) {
          barClass = 'stock-critical';
          warningBadge = '<span class="badge badge-normal font-danger" style="margin-left:auto">OUT OF STOCK</span>';
        } else if (currentStock <= threshold) {
          barClass = 'stock-low';
          warningBadge = '<span class="badge badge-normal text-amber" style="margin-left:auto">LOW STOCK</span>';
        }

        // Percentage calculations (assume 30 is initial base if larger than 30)
        const baseRefillRange = Math.max(30, currentStock, threshold * 2);
        const pct = Math.min(100, Math.max(0, (currentStock / baseRefillRange) * 100));

        stockDisplay = `
          <div class="med-card-stock">
            <div class="stock-meter-wrapper">
              <span>Qty Left: <strong>${currentStock}</strong></span>
              ${warningBadge}
            </div>
            <div class="stock-bar-bg">
              <div class="stock-bar-fill ${barClass}" style="width: ${pct}%"></div>
            </div>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="med-card-header">
          <div>
            <h3>${med.name}</h3>
            <span class="sub-label">${shapeIcon} ${med.dosage}</span>
          </div>
          <span class="med-form-badge">${med.type.toUpperCase()}</span>
        </div>

        <div class="med-card-schedules">
          <div>⏰ Hours: <strong>${timeSlots}</strong></div>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.1rem;">📅 Frequency: ${freqString}</div>
        </div>

        ${med.instructions ? `<p class="font-muted" style="font-size:0.8rem; font-style:italic">"${med.instructions}"</p>` : ''}
        
        ${stockDisplay}

        <div class="med-card-actions" style="display: flex; gap: 0.5rem; align-items: center;">
          <button class="btn btn-glass btn-xs font-danger" onclick="appController.deleteMedicine('${med.id}')">Delete</button>
          <button class="btn btn-glass btn-xs" onclick="appController.editMedicine('${med.id}')">Edit Cabinet</button>
          <button class="action-check-btn btn-speak" title="Speak Aloud" onclick="appController.speakMedicineIntake('${med.id}')" style="width: 1.8rem; height: 1.8rem; border-radius: var(--border-radius-sm); color: var(--blue-color); border-color: rgba(59, 130, 246, 0.25); display: flex; align-items: center; justify-content: center; padding: 0;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="14" height="14">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
            </svg>
          </button>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Render compliance graphs and lists
  renderAnalytics() {
    const overallPctSpan = document.getElementById('analytics-overall-pct');
    const totalDosesSpan = document.getElementById('analytics-total-doses');
    const takenDosesSpan = document.getElementById('analytics-taken-doses');
    const skippedDosesSpan = document.getElementById('analytics-skipped-doses');

    const totalLogs = stateStore.data.logs || [];
    const totalCount = totalLogs.length;
    const takenCount = totalLogs.filter(l => l.status === 'taken').length;
    const skippedCount = totalLogs.filter(l => l.status === 'skipped').length;

    if (totalDosesSpan) totalDosesSpan.textContent = totalCount;
    if (takenDosesSpan) takenDosesSpan.textContent = takenCount;
    if (skippedDosesSpan) skippedDosesSpan.textContent = skippedCount;

    if (totalCount === 0) {
      if (overallPctSpan) overallPctSpan.textContent = '0%';
    } else {
      if (overallPctSpan) overallPctSpan.textContent = `${Math.round((takenCount / totalCount) * 100)}%`;
    }

    // 1. RENDER ACTION LOG TABULAR
    const tbody = document.getElementById('history-log-tbody');
    if (tbody) {
      tbody.innerHTML = '';

      if (totalLogs.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="5" class="text-center font-muted">No historical compliance logs recorded yet.</td>
          </tr>`;
      } else {
        // Sort logs reverse chronologically
        const sortedLogs = [...totalLogs].sort((a, b) => b.timestamp - a.timestamp);
        
        sortedLogs.slice(0, 50).forEach(log => {
          const tr = document.createElement('tr');
          
          // Beautify timestamp
          const logDateObj = new Date(log.timestamp);
          const dateStr = logDateObj.toLocaleDateString();
          const timeStr = logDateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

          const badgeClass = log.status === 'taken' ? 'badge-taken' : 'badge-skipped';
          const tempText = log.temperature ? `<span class="badge badge-normal text-amber" style="margin-left:0.25rem; font-size:0.7rem">${log.temperature}</span>` : '';

          tr.innerHTML = `
            <td><strong>${dateStr}</strong>, <span class="font-muted">${timeStr}</span></td>
            <td><strong>${log.medicineName}</strong></td>
            <td>${this.format12Hour(log.time)}</td>
            <td>${log.dosage || '--'}${tempText}</td>
            <td><span class="pill-badge ${badgeClass}">${log.status}</span></td>
          `;
          tbody.appendChild(tr);
        });
      }
    }

    // 2. RENDER THE LAST 7 DAYS compliance TREND BAR CHART
    this.renderLast7DaysBarChart();
  }

  renderLast7DaysBarChart() {
    const chartWrapper = document.getElementById('analytics-bar-chart');
    chartWrapper.innerHTML = '';

    const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const activeSimDate = clockEngine.getSimulatedDate();
    
    // Construct last 7 dates chronologically backwards from simulated today
    const datesArr = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(activeSimDate);
      d.setDate(activeSimDate.getDate() - i);
      datesArr.push(d);
    }

    datesArr.forEach(date => {
      const dateStr = clockEngine.getFormattedDateOnly(date);
      const dayLabel = dayNamesShort[date.getDay()];

      // Filter compliance logs matching this exact date
      const daysLogs = stateStore.data.logs.filter(log => log.date === dateStr);
      const dayTotal = daysLogs.length;
      const dayTaken = daysLogs.filter(log => log.status === 'taken').length;

      let pctVal = 0;
      if (dayTotal > 0) {
        pctVal = Math.round((dayTaken / dayTotal) * 100);
      }

      const column = document.createElement('div');
      column.className = 'bar-column';
      
      // Make bar tooltip visible only if there are active doses logged
      const tooltipHTML = dayTotal > 0 ? `<span class="bar-tooltip">${dayTaken}/${dayTotal}</span>` : '';

      column.innerHTML = `
        <div class="bar-growth-container">
          <div class="bar-growth-fill" style="height: ${pctVal}%">
            ${tooltipHTML}
          </div>
        </div>
        <span class="bar-label">${dayLabel}</span>
      `;
      chartWrapper.appendChild(column);
    });
  }

  // Calculates taken/skipped streaks consecutive calendar days
  calculateStreak() {
    const logs = stateStore.data.logs;
    const activeDate = clockEngine.getSimulatedDate();
    
    if (logs.length === 0) {
      document.getElementById('streak-days').textContent = '0';
      return;
    }

    // Streaks mapping table by calendar dates
    const dateCompStatus = {}; // 'YYYY-MM-DD': { total: 0, taken: 0 }
    
    logs.forEach(log => {
      if (!dateCompStatus[log.date]) {
        dateCompStatus[log.date] = { total: 0, taken: 0 };
      }
      dateCompStatus[log.date].total += 1;
      if (log.status === 'taken') {
        dateCompStatus[log.date].taken += 1;
      }
    });

    let streakCount = 0;
    let currentCheck = new Date(activeDate);

    // Look backward day by day starting from today or yesterday
    for (let i = 0; i < 365; i++) {
      const checkStr = clockEngine.getFormattedDateOnly(currentCheck);
      const statusObj = dateCompStatus[checkStr];

      if (statusObj) {
        // Did user fulfill at least 1 dose successfully on this day?
        if (statusObj.taken > 0) {
          streakCount++;
        } else {
          // If they scheduled doses and took none, streak breaks
          break;
        }
      } else {
        // If there were NO entries at all on this day, we check if the user had ANY medicines saved back then.
        // For simplicity in Vanilla JS, if it's "Today" and we have no checks yet, we allow the streak to continue.
        // Otherwise, if it is a past day and we did not log anything, the streak breaks.
        if (i > 0) {
          break; 
        }
      }

      // Step backwards by 1 calendar day
      currentCheck.setDate(currentCheck.getDate() - 1);
    }

    stateStore.data.streak = streakCount;
    document.getElementById('streak-days').textContent = streakCount;
  }

  // ==========================================
  // MEDICINE cabinet & FORM MODAL CONTROL
  // ==========================================

  showMedicineModal(editMedId = null) {
    const modal = document.getElementById('medicine-form-modal');
    const formTitle = document.getElementById('modal-form-title');
    const form = document.getElementById('medicine-entry-form');
    
    form.reset();
    document.getElementById('edit-medicine-id').value = '';
    
    // Clear dynamic schedule array time slots
    const timesContainer = document.getElementById('schedule-times-container');
    timesContainer.innerHTML = '';

    // Reset default select templates
    document.getElementById('med-template-preset').value = '';
    
    if (editMedId) {
      // Edit Cabinets Mode
      formTitle.textContent = "Edit Cabinet Details";
      const med = stateStore.data.medicines.find(m => m.id === editMedId);
      if (med) {
        document.getElementById('edit-medicine-id').value = med.id;
        document.getElementById('med-name').value = med.name;
        document.getElementById('med-type').value = med.type;
        document.getElementById('med-dosage').value = med.dosage;
        document.getElementById('med-frequency').value = med.frequency;
        document.getElementById('med-instructions').value = med.instructions || '';
        document.getElementById('med-stock').value = med.stock !== undefined ? med.stock : '';
        document.getElementById('med-stock-low').value = med.refillAlertAt !== undefined ? med.refillAlertAt : '';

        // Preset active accent colors
        const radioColor = document.querySelector(`.color-picker-strip input[value="${med.color || '#0d9488'}"]`);
        if (radioColor) radioColor.checked = true;

        // Toggle form groups based on frequency
        const weekdaysGrp = document.getElementById('weekdays-group');
        const prnGrp = document.getElementById('prn-group');
        const timesGrp = document.getElementById('schedule-times-form-group');

        if (med.frequency === 'specific_days') {
          weekdaysGrp.classList.remove('hide');
          prnGrp.classList.add('hide');
          timesGrp.classList.remove('hide');
          document.querySelectorAll('.days-checkbox-grid input').forEach(box => {
            box.checked = med.specificDays.includes(parseInt(box.value));
          });
        } else if (med.frequency === 'prn') {
          weekdaysGrp.classList.add('hide');
          prnGrp.classList.remove('hide');
          timesGrp.classList.add('hide');
          document.getElementById('med-prn-condition').value = med.prnCondition || '';
          document.getElementById('med-prn-gap').value = med.prnGap || 4;
          document.getElementById('med-prn-max').value = med.prnMax || 4;
        } else {
          weekdaysGrp.classList.add('hide');
          prnGrp.classList.add('hide');
          timesGrp.classList.remove('hide');
        }

        // Generate form time rows (only if not PRN)
        if (med.frequency !== 'prn') {
          med.times.forEach(t => this.addTimePickerRow(t));
        } else {
          this.addTimePickerRow('08:00');
        }
      }
    } else {
      // Create new medicine mode
      formTitle.textContent = "Add New Medicine";
      document.getElementById('weekdays-group').classList.add('hide');
      document.getElementById('prn-group').classList.add('hide');
      document.getElementById('schedule-times-form-group').classList.remove('hide');
      this.addTimePickerRow('08:00'); // Add standard default row
    }

    modal.classList.remove('hide');
  }

  hideMedicineModal() {
    document.getElementById('medicine-form-modal').classList.add('hide');
  }

  addTimePickerRow(timeVal = '08:00') {
    const container = document.getElementById('schedule-times-container');
    const row = document.createElement('div');
    row.className = 'time-picker-row';
    row.innerHTML = `
      <input type="time" class="form-control schedule-time-input" value="${timeVal}" required>
      <button type="button" class="btn btn-icon btn-glass btn-sm remove-time-btn">&times;</button>
    `;
    container.appendChild(row);
    this.updateRemoveTimeButtonsState();
  }

  updateRemoveTimeButtonsState() {
    const btns = document.querySelectorAll('#schedule-times-container .remove-time-btn');
    // Disable remove buttons if there is only 1 schedule row remaining
    btns.forEach(btn => {
      btn.disabled = btns.length <= 1;
    });
  }

  handleFormSubmit(e) {
    e.preventDefault();

    const editId = document.getElementById('edit-medicine-id').value;
    const name = document.getElementById('med-name').value;
    const type = document.getElementById('med-type').value;
    const dosage = document.getElementById('med-dosage').value;
    const frequency = document.getElementById('med-frequency').value;
    const instructions = document.getElementById('med-instructions').value;
    const stockVal = document.getElementById('med-stock').value;
    const stockLowVal = document.getElementById('med-stock-low').value;
    const color = document.querySelector('.color-picker-strip input:checked').value;

    // Collect all schedule alarm times from dynamic input DOM nodes
    const times = [];
    document.querySelectorAll('.schedule-time-input').forEach(input => {
      if (input.value && !times.includes(input.value)) {
        times.push(input.value);
      }
    });

    // Handle weekdays if applicable
    const specificDays = [];
    if (frequency === 'specific_days') {
      document.querySelectorAll('.days-checkbox-grid input:checked').forEach(box => {
        specificDays.push(parseInt(box.value));
      });

      if (specificDays.length === 0) {
        alert("Please select at least one active day of the week.");
        return;
      }
    }

    // Bypass times requirement for PRN medicines
    if (frequency !== 'prn' && times.length === 0) {
      alert("Please configure at least one scheduled time slot.");
      return;
    }

    // Build model structure
    const medModel = {
      id: editId || 'med_' + Date.now(),
      name,
      type,
      dosage,
      times: frequency === 'prn' ? [] : times.sort(), // Sort times chronologically
      frequency,
      specificDays,
      instructions,
      stock: stockVal !== '' ? parseInt(stockVal) : undefined,
      refillAlertAt: stockLowVal !== '' ? parseInt(stockLowVal) : undefined,
      color,
      // PRN details
      prnCondition: frequency === 'prn' ? document.getElementById('med-prn-condition').value : undefined,
      prnGap: frequency === 'prn' ? parseInt(document.getElementById('med-prn-gap').value || 4) : undefined,
      prnMax: frequency === 'prn' ? parseInt(document.getElementById('med-prn-max').value || 4) : undefined
    };

    if (editId) {
      // Modify existing index
      const index = stateStore.data.medicines.findIndex(m => m.id === editId);
      if (index > -1) {
        stateStore.data.medicines[index] = medModel;
      }
    } else {
      // Add new record
      stateStore.data.medicines.push(medModel);
    }

    stateStore.saveState();
    this.hideMedicineModal();
    
    // Refresh panels
    this.renderDailySchedule();
    this.renderCabinet();
    this.renderAnalytics();
  }

  updateLanguage() {
    const lang = stateStore.data.settings.lang || 'en';
    const dict = TRANSLATIONS[lang];

    // Translate DOM nodes
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    // Update input placeholders
    const searchInput = document.getElementById('cabinet-search');
    if (searchInput) {
      if (lang === 'te') searchInput.placeholder = "మందుల పేరును టైప్ చేయండి...";
      else if (lang === 'hi') searchInput.placeholder = "दवा खोजने के लिए नाम दर्ज करें...";
      else searchInput.placeholder = "Search medicines by name or keyword...";
    }

    // Translate presets dropdown select placeholder
    const presetSelect = document.getElementById('med-template-preset');
    if (presetSelect) {
      const placeholderOpt = presetSelect.querySelector('option[value=""]');
      if (placeholderOpt) {
        placeholderOpt.textContent = lang === 'te' ? "-- మందుల నమూనాను ఎంచుకోండి --" : 
                                     lang === 'hi' ? "-- दवा प्रीसेट सूची --" : 
                                     "-- Select a preset template --";
      }
    }

    // Dynamic login role title text update
    const loginRoleEl = document.getElementById('login-role');
    const loginRole = loginRoleEl ? loginRoleEl.value : 'patient';
    const loginTitleText = document.getElementById('login-title-text');
    const loginSubText = document.getElementById('login-sub-text');
    if (loginTitleText && loginSubText) {
      if (loginRole === 'patient') {
        loginTitleText.textContent = lang === 'te' ? "రోగి లాగిన్" : lang === 'hi' ? "मरीज लॉगिन" : "Patient Login";
        loginSubText.textContent = lang === 'te' ? "మీ మందుల షెడ్యూల్‌లు & డాక్టర్ అపాయింట్‌మెంట్‌లను ట్రాక్ చేయండి" : lang === 'hi' ? "अपनी दवा के कार्यक्रम और डॉक्टर की नियुक्तियों को ट्रैक करें" : "Log in to track your medicine schedules & appointments";
      } else if (loginRole === 'doctor') {
        loginTitleText.textContent = lang === 'te' ? "డాక్టర్ లాగిన్" : lang === 'hi' ? "डॉक्टर लॉगिन" : "Doctor Login";
        loginSubText.textContent = lang === 'te' ? "రోగుల రికార్డులను మరియు తనిఖీలను నిర్వహించండి" : lang === 'hi' ? "रोगियों के रिकॉर्ड और नियुक्तियों को प्रबंधित करें" : "Manage patient charts and schedule appointments";
      } else if (loginRole === 'admin') {
        loginTitleText.textContent = lang === 'te' ? "అడ్మిన్ లాగిన్" : lang === 'hi' ? "एडमिन लॉगिन" : "Admin Login";
        loginSubText.textContent = lang === 'te' ? "సిస్టమ్ వినియోగదారులు మరియు డేటాబేస్లను నిర్వహించండి" : lang === 'hi' ? "సిస్టమ్ వినియోగదారులు మరియు డేటాబేస్లను నిర్వహించండి" : "Manage system users and database settings";
      }
    }

    // Dynamic register role labels update
    this.updateRegisterLabels();
  }

  updateRegisterLabels() {
    const regRoleEl = document.getElementById('reg-role');
    if (!regRoleEl) return;
    const role = regRoleEl.value;
    const lang = stateStore.data.settings.lang || 'en';
    
    const regCard = document.getElementById('register-card');
    if (regCard) {
      const regTitleText = regCard.querySelector('.auth-header h2');
      const regSubText = regCard.querySelector('.auth-header p');
      const nameLabel = regCard.querySelector('label[for="reg-name"]');
      const nameInput = document.getElementById('reg-name');
      const addressLabel = regCard.querySelector('label[for="reg-address"]');
      const addressInput = document.getElementById('reg-address');
      
      if (role === 'patient') {
        if (regTitleText) regTitleText.textContent = lang === 'te' ? "రోగి రిజిస్ట్రేషన్" : lang === 'hi' ? "मरीज पंजीकरण" : "Patient Registration";
        if (regSubText) regSubText.textContent = lang === 'te' ? "మీ ఆరోగ్య రిమైండర్‌లను అనుకూలీకరించడానికి ప్రొఫైల్ సృష్టించండి" : lang === 'hi' ? "दवा और स्वास्थ्य अनुस्मारक को अनुकूलित करने के लिए प्रोफाइल बनाएं" : "Create an account to start health tracking";
        if (nameLabel) nameLabel.textContent = lang === 'te' ? "రోగి పూర్తి పేరు" : lang === 'hi' ? "मरीज का पूरा नाम" : "Patient Full Name";
        if (nameInput) nameInput.placeholder = "e.g. John Doe";
        if (addressLabel) addressLabel.textContent = lang === 'te' ? "ఇంటి చిరునామా" : lang === 'hi' ? "घर का पता" : "Home Address";
        if (addressInput) addressInput.placeholder = "e.g. H.No 12-3, Srinagar Colony";
      } else if (role === 'caregiver') {
        if (regTitleText) regTitleText.textContent = lang === 'te' ? "కేర్గివర్ రిజిస్ట్రేషన్" : lang === 'hi' ? "केयरगिवर पंजीकरण" : "Caregiver Registration";
        if (regSubText) regSubText.textContent = lang === 'te' ? "రోగుల ఆరోగ్యాన్ని పర్యవేక్షించడానికి ఖాతాను సృష్టించండి" : lang === 'hi' ? "मरीजों के स्वास्थ्य की निगरानी के लिए खाता बनाएं" : "Create an account to monitor patients' health";
        if (nameLabel) nameLabel.textContent = lang === 'te' ? "కేర్గివర్ పూర్తి పేరు" : lang === 'hi' ? "केयरगिवर का पूरा नाम" : "Caregiver Full Name";
        if (nameInput) nameInput.placeholder = "e.g. Robert Smith";
        if (addressLabel) addressLabel.textContent = lang === 'te' ? "ఇంటి చిరునామా" : lang === 'hi' ? "घर का पता" : "Home Address";
        if (addressInput) addressInput.placeholder = "e.g. Apartment 4B, Sector 7";
      } else if (role === 'doctor') {
        if (regTitleText) regTitleText.textContent = lang === 'te' ? "వైద్యుల నమోదు" : lang === 'hi' ? "डॉक्टर पंजीकरण" : "Doctor Registration";
        if (regSubText) regSubText.textContent = lang === 'te' ? "ఆరోగ్య సంరక్షణ అందించడానికి ప్రొఫైల్ సృష్టించండి" : lang === 'hi' ? "स्वास्थ्य देखभाल प्रदान करने के लिए खाता बनाएं" : "Create a medical practitioner profile";
        if (nameLabel) nameLabel.textContent = lang === 'te' ? "వైద్యుని పూర్తి పేరు" : lang === 'hi' ? "डॉक्टर का पूरा नाम" : "Doctor Full Name";
        if (nameInput) nameInput.placeholder = "e.g. Dr. Prasad";
        if (addressLabel) addressLabel.textContent = lang === 'te' ? "క్లినిక్ / ఆసుపత్రి చిరునామా" : lang === 'hi' ? "क्लिनिक / अस्पताल का पता" : "Clinic / Hospital Address";
        if (addressInput) addressInput.placeholder = "e.g. Apollo Hospitals, Jubilee Hills";
      } else if (role === 'admin') {
        if (regTitleText) regTitleText.textContent = lang === 'te' ? "అడ్మిన్ నమోదు" : lang === 'hi' ? "प्रशासक पंजीकरण" : "Admin Registration";
        if (regSubText) regSubText.textContent = lang === 'te' ? "సిస్టమ్ నిర్వహణ కోసం అడ్మిన్ ఖాతాను సృష్టించండి" : lang === 'hi' ? "సిस्टम प्रबंधन के लिए व्यवस्थापक खाता बनाएं" : "Create a system administrator profile";
        if (nameLabel) nameLabel.textContent = lang === 'te' ? "అడ్మినిస్ట్రేటర్ పూర్తి పేరు" : lang === 'hi' ? "प्रशासक का पूरा नाम" : "Administrator Full Name";
        if (nameInput) nameInput.placeholder = "e.g. System Admin";
        if (addressLabel) addressLabel.textContent = lang === 'te' ? "కార్యాలయ చిరునామా" : lang === 'hi' ? "कार्यालय का पता" : "Office Address";
        if (addressInput) addressInput.placeholder = "e.g. MediCare HQ, Suite 101";
      }
    }
  }

  deleteMedicine(id) {
    if (confirm("Are you sure you want to delete this medicine? All today's active schedules will be removed.")) {
      stateStore.data.medicines = stateStore.data.medicines.filter(m => m.id !== id);
      
      // Clean corresponding historical logs? Typically we preserve history, so keep stateStore.data.logs
      stateStore.saveState();
      
      this.renderDailySchedule();
      this.renderCabinet();
      this.renderAnalytics();
      this.calculateStreak();
    }
  }

  editMedicine(id) {
    this.showMedicineModal(id);
  }

  // Log as-needed (PRN) medication with safety checks and body temperature recording
  logPrnDose(medicineId) {
    const med = stateStore.data.medicines.find(m => m.id === medicineId);
    if (!med) return;

    const activeSimDate = clockEngine.getSimulatedDate();
    const activeDateStr = clockEngine.getFormattedDateOnly(activeSimDate);
    
    // 1. Minimum Time Gap Check between consecutive taken doses
    const medLogs = stateStore.data.logs.filter(l => l.medicineId === med.id && l.status === 'taken');
    if (medLogs.length > 0) {
      medLogs.sort((a, b) => b.timestamp - a.timestamp);
      const lastLog = medLogs[0];
      const deltaHrs = (activeSimDate.getTime() - lastLog.timestamp) / (3600 * 1000);
      const requiredGap = parseFloat(med.prnGap || 4);

      if (deltaHrs < requiredGap) {
        const remainingTime = (requiredGap - deltaHrs).toFixed(1);
        const lang = stateStore.data.settings.lang || 'en';
        let msg = TRANSLATIONS[lang].safetyGapBlocked
          .replace('{hours}', deltaHrs.toFixed(1))
          .replace('{gap}', requiredGap.toFixed(1))
          .replace('{rem}', remainingTime);
        alert(msg);
        return;
      }
    }

    // 2. Maximum Daily Dose Limit Check in last 24 simulated hours
    const last24hMs = activeSimDate.getTime() - (24 * 3600 * 1000);
    const dosesLast24h = medLogs.filter(l => l.timestamp >= last24hMs).length;
    const maxLimit = parseInt(med.prnMax || 4);

    if (dosesLast24h >= maxLimit) {
      const lang = stateStore.data.settings.lang || 'en';
      let msg = TRANSLATIONS[lang].safetyMaxBlocked
        .replace('{doses}', dosesLast24h)
        .replace('{max}', maxLimit);
      alert(msg);
      return;
    }

    // 3. Prompt for current body temperature with translation support
    const lang = stateStore.data.settings.lang || 'en';
    let promptMsg = TRANSLATIONS[lang].tempPrompt;
    let tempInput = prompt(promptMsg);
    
    if (tempInput === null) return; // User cancelled prompt

    let tempStr = "";
    let isCriticallyHigh = false;
    if (tempInput.trim() !== "") {
      const tempNum = parseFloat(tempInput);
      if (isNaN(tempNum) || tempNum < 90 || tempNum > 115) {
        alert(TRANSLATIONS[lang].invalidTemp);
        return;
      }
      tempStr = `${tempNum.toFixed(1)}°F`;
      if (tempNum >= 102.0) {
        isCriticallyHigh = true;
      }
    } else {
      tempStr = lang === 'te' ? "ఉష్ణోగ్రత: సాధారణం" : lang === 'hi' ? "तापमान: सामान्य" : "Temp: Normal/Unspecified";
    }

    // Deduct stock inventory if configured
    if (med.stock !== undefined) {
      med.stock = Math.max(0, med.stock - 1);
    }

    // Add log
    stateStore.data.logs.push({
      id: 'log_' + Date.now() + Math.random().toString(36).substr(2, 4),
      medicineId: med.id,
      medicineName: med.name,
      time: 'PRN',
      date: activeDateStr,
      status: 'taken',
      dosage: med.dosage,
      timestamp: activeSimDate.getTime(),
      temperature: tempStr
    });

    stateStore.saveState();
    this.playSuccessConfetti();

    // Critical Emergency High Temperature Warning Check
    if (isCriticallyHigh) {
      // Play urgent medical alert siren chord immediately
      alarmSoundSynth.start(true); // Urgent Siren sound
      setTimeout(() => alarmSoundSynth.stop(), 4000); // Stop siren after 4 seconds

      // Speak voice warning in selected language
      voiceNarrator.speak({
        en: TRANSLATIONS.en.highTempWarningSpeech,
        hi: TRANSLATIONS.hi.highTempWarningSpeech,
        te: TRANSLATIONS.te.highTempWarningSpeech
      });

      // Warning alert box prompt
      let msg = TRANSLATIONS[lang].highTempWarning.replace('{temp}', tempStr);
      alert(msg);
    }

    // Re-render views
    this.renderDailySchedule();
    this.renderCabinet();
    this.renderAnalytics();
    this.calculateStreak();
  }

  // ==========================================
  // ALARM SCREENS AND NOTIFICATION LOGICS
  // ==========================================

  showAlarmScreen() {
    const alarmModal = document.getElementById('alarm-alert-modal');
    
    // If modal is already open, ignore (it will handle subsequent queue entries after this one)
    if (!alarmModal.classList.contains('hide')) return;

    const currentDue = clockEngine.activeAlarmQueue[0];
    if (!currentDue) return;

    // Trigger synthetic pleasant chime tone
    alarmSoundSynth.start(false); // Normal pleasant chime

    // Trigger language-appropriate voice read-out synthesis alerts
    const instructionsText = currentDue.medicine.instructions ? currentDue.medicine.instructions : '';
    
    const speakObj = {
      en: TRANSLATIONS.en.ttsAlert
        .replace('{name}', currentDue.medicine.name)
        .replace('{dosage}', currentDue.medicine.dosage)
        .replace('{instructions}', instructionsText),
      hi: TRANSLATIONS.hi.ttsAlert
        .replace('{name}', currentDue.medicine.name)
        .replace('{dosage}', currentDue.medicine.dosage)
        .replace('{instructions}', instructionsText),
      te: TRANSLATIONS.te.ttsAlert
        .replace('{name}', currentDue.medicine.name)
        .replace('{dosage}', currentDue.medicine.dosage)
        .replace('{instructions}', instructionsText)
    };
    
    voiceNarrator.speak(speakObj);

    // Populate modal values
    document.getElementById('alarm-med-name').textContent = currentDue.medicine.name;
    document.getElementById('alarm-med-dosage').textContent = `${this.formatMedicineType(currentDue.medicine.type)} – ${currentDue.medicine.dosage}`;
    
    const instructionsBox = document.getElementById('alarm-med-instructions');
    if (currentDue.medicine.instructions) {
      instructionsBox.textContent = currentDue.medicine.instructions;
      instructionsBox.classList.remove('hide');
    } else {
      instructionsBox.classList.add('hide');
    }

    // Stock inventory counts alert check inside Alarm Modal
    const stockAlertDiv = document.getElementById('alarm-stock-alert');
    if (currentDue.medicine.stock !== undefined) {
      const remaining = currentDue.medicine.stock;
      const threshold = currentDue.medicine.refillAlertAt || 5;

      if (remaining <= threshold) {
        document.getElementById('alarm-stock-remaining').textContent = remaining;
        stockAlertDiv.classList.remove('hide');
      } else {
        stockAlertDiv.classList.add('hide');
      }
    } else {
      stockAlertDiv.classList.add('hide');
    }

    // Open Alarm view modal
    alarmModal.classList.remove('hide');
  }

  // Handle take, skip or snooze alarm responses
  handleAlarmResponse(action) {
    const currentDue = clockEngine.activeAlarmQueue.shift(); // Remove from alarm line
    if (!currentDue) return;

    // Shut down alarms sound & synthesizers
    alarmSoundSynth.stop();
    voiceNarrator.stop();

    // Close Alarm modal view sheet
    document.getElementById('alarm-alert-modal').classList.add('hide');

    const activeSimDate = clockEngine.getSimulatedDate();
    const activeDateStr = clockEngine.getFormattedDateOnly(activeSimDate);

    if (action === 'taken' || action === 'skipped') {
      // Record to history logs
      stateStore.data.logs.push({
        id: 'log_' + Date.now() + Math.random().toString(36).substr(2, 4),
        medicineId: currentDue.medicine.id,
        medicineName: currentDue.medicine.name,
        time: currentDue.time,
        date: activeDateStr,
        status: action,
        dosage: currentDue.medicine.dosage,
        timestamp: activeSimDate.getTime()
      });

      // Reduce stock count if marked taken
      if (action === 'taken' && currentDue.medicine.stock !== undefined) {
        const medIndex = stateStore.data.medicines.findIndex(m => m.id === currentDue.medicine.id);
        if (medIndex > -1) {
          stateStore.data.medicines[medIndex].stock = Math.max(0, stateStore.data.medicines[medIndex].stock - 1);
        }
      }

      stateStore.saveState();

      if (action === 'taken') {
        this.playSuccessConfetti();
      }

      // Update compliance dashboards
      this.renderDailySchedule();
      this.renderCabinet();
      this.renderAnalytics();
      this.calculateStreak();

    } else if (action === 'snoozed') {
      // Queue alarm to trigger again 10 simulated minutes later
      const snoozeDurationMs = 10 * 60 * 1000;
      clockEngine.snoozedAlarms.push({
        medicineId: currentDue.medicine.id,
        scheduledTime: currentDue.time,
        alarmTimeMs: clockEngine.currentSimMs + snoozeDurationMs
      });
      
      alert(`Alarm snoozed. Will alert again in 10 minutes (${clockEngine.state.data.timeSpeed}x speed active).`);
    }

    // Process next item in line if multiple alarms stacked up (due to speed warp)
    if (clockEngine.activeAlarmQueue.length > 0) {
      setTimeout(() => this.showAlarmScreen(), 800);
    }
  }

  // ==========================================
  // SYSTEM SETTINGS & ACCESSIBILITY HANDLERS
  // ==========================================
  loadSettings() {
    const s = stateStore.data.settings;
    
    // Theme
    document.body.className = `theme-${s.theme}`;
    this.updateThemeTogglerIcons(s.theme);

    // Font Scaling preset active button state
    document.body.classList.add(`font-size-${s.fontSize || 'normal'}`);
    document.querySelectorAll('.font-scaler button').forEach(btn => {
      btn.classList.remove('active');
    });
    const scaleBtn = document.getElementById(`font-scale-${s.fontSize || 'normal'}`);
    if (scaleBtn) scaleBtn.classList.add('active');

    // High Contrast checkbox state
    document.getElementById('high-contrast-toggle').checked = s.highContrast || false;
    if (s.highContrast) document.body.classList.add('high-contrast');

    // Voice assistance checkbox state
    document.getElementById('voice-alert-toggle').checked = s.speechAlerts !== undefined ? s.speechAlerts : true;

    // Time speed sync
    document.getElementById('time-speed-select').value = stateStore.data.timeSpeed || 1;

    // Language dropdown sync & run translations
    const langSelect = document.getElementById('lang-switch-select');
    if (langSelect) langSelect.value = s.lang || 'en';
    
    const authLangSelect = document.getElementById('auth-lang-switch-select');
    if (authLangSelect) authLangSelect.value = s.lang || 'en';
    
    this.updateLanguage();
  }

  // Translates all headers, labels, and text nodes containing data-i18n attributes

  toggleTheme() {
    const currentTheme = document.body.classList.contains('theme-dark') ? 'dark' : 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.body.classList.replace(`theme-${currentTheme}`, `theme-${nextTheme}`);
    this.updateThemeTogglerIcons(nextTheme);

    stateStore.data.settings.theme = nextTheme;
    stateStore.saveState();
  }

  updateThemeTogglerIcons(activeTheme) {
    const sun = document.getElementById('theme-sun-icon');
    const moon = document.getElementById('theme-moon-icon');
    if (!sun || !moon) return;

    if (activeTheme === 'dark') {
      sun.classList.add('hide');
      moon.classList.remove('hide');
    } else {
      sun.classList.remove('hide');
      moon.classList.add('hide');
    }
  }

  setScale(scaleName, clickedButton) {
    document.body.classList.remove('font-size-normal', 'font-size-large', 'font-size-xlarge');
    document.body.classList.add(`font-size-${scaleName}`);

    document.querySelectorAll('.font-scaler button').forEach(btn => btn.classList.remove('active'));
    clickedButton.classList.add('active');

    stateStore.data.settings.fontSize = scaleName;
    stateStore.saveState();
  }

  toggleHighContrast(enable) {
    if (enable) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    stateStore.data.settings.highContrast = enable;
    stateStore.saveState();
  }

  // ==========================================
  // HEALTH MONITORING & CAREGIVER DASHBOARD & SOS METHODS
  // ==========================================

  getBPStatus(sys, dia) {
    const lang = stateStore.data.settings.lang || 'en';
    if (!sys || !dia) return { text: TRANSLATIONS[lang].noData || 'No Data', cls: 'status-loading' };
    
    let text = 'Normal';
    let cls = 'status-normal';
    
    if (sys >= 140 || dia >= 90) {
      text = lang === 'te' ? 'ఎక్కువ (High)' : lang === 'hi' ? 'उच्च' : 'High';
      cls = 'status-critical';
    } else if (sys < 90 || dia < 60) {
      text = lang === 'te' ? 'తక్కువ (Low)' : lang === 'hi' ? 'निम्न' : 'Low';
      cls = 'status-critical';
    } else if (sys >= 120 || dia >= 80) {
      text = lang === 'te' ? 'మధ్యస్థం' : lang === 'hi' ? 'थोड़ा उच्च' : 'Pre-High';
      cls = 'status-warning';
    } else {
      text = lang === 'te' ? 'సాధారణం (Normal)' : lang === 'hi' ? 'सामान्य' : 'Normal';
      cls = 'status-normal';
    }
    return { text, cls };
  }

  getSugarStatus(val, type) {
    const lang = stateStore.data.settings.lang || 'en';
    if (!val) return { text: TRANSLATIONS[lang].noData || 'No Data', cls: 'status-loading' };
    
    let text = 'Normal';
    let cls = 'status-normal';
    const isFasting = type === 'fasting';
    
    if (val < 70) {
      text = lang === 'te' ? 'తక్కువ (Low)' : lang === 'hi' ? 'निम्न' : 'Low';
      cls = 'status-critical';
    } else if (isFasting) {
      if (val >= 126) {
        text = lang === 'te' ? 'ఎక్కువ (High)' : lang === 'hi' ? 'उच्च' : 'High';
        cls = 'status-critical';
      } else if (val >= 100) {
        text = lang === 'te' ? 'ప్రీ-డయాబెటిస్' : lang === 'hi' ? 'प्री-डायबिटीज' : 'Pre-Diabetes';
        cls = 'status-warning';
      } else {
        text = lang === 'te' ? 'సాధారణం (Normal)' : lang === 'hi' ? 'सामान्य' : 'Normal';
        cls = 'status-normal';
      }
    } else {
      if (val >= 200) {
        text = lang === 'te' ? 'ఎక్కువ (High)' : lang === 'hi' ? 'उच्च' : 'High';
        cls = 'status-critical';
      } else if (val >= 140) {
        text = lang === 'te' ? 'ప్రీ-డయాబెటిస్' : lang === 'hi' ? 'प्री-डायबिटीज' : 'Pre-Diabetes';
        cls = 'status-warning';
      } else {
        text = lang === 'te' ? 'సాధారణం (Normal)' : lang === 'hi' ? 'सामान्य' : 'Normal';
        cls = 'status-normal';
      }
    }
    return { text, cls };
  }

  getPulseStatus(val) {
    const lang = stateStore.data.settings.lang || 'en';
    if (!val) return { text: TRANSLATIONS[lang].noData || 'No Data', cls: 'status-loading' };
    
    let text = 'Normal';
    let cls = 'status-normal';
    
    if (val > 100) {
      text = lang === 'te' ? 'ఎక్కువ (High)' : lang === 'hi' ? 'उच्च' : 'High';
      cls = 'status-critical';
    } else if (val < 60) {
      text = lang === 'te' ? 'తక్కువ (Low)' : lang === 'hi' ? 'निम्न' : 'Low';
      cls = 'status-critical';
    } else {
      text = lang === 'te' ? 'సాధారణం (Normal)' : lang === 'hi' ? 'सामान्य' : 'Normal';
      cls = 'status-normal';
    }
    return { text, cls };
  }

  getWeightStatus(val) {
    const lang = stateStore.data.settings.lang || 'en';
    if (!val) return { text: TRANSLATIONS[lang].noData || 'No Data', cls: 'status-loading' };
    
    const text = lang === 'te' ? 'నమోదైంది' : lang === 'hi' ? 'दर्ज' : 'Logged';
    const cls = 'status-normal';
    return { text, cls };
  }

  formatVitalsTime(timestamp) {
    const lang = stateStore.data.settings.lang || 'en';
    const d = new Date(timestamp);
    return d.toLocaleString(lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
    });
  }

  renderHealthTracker() {
    const lang = stateStore.data.settings.lang || 'en';
    const logs = stateStore.data.healthLogs || [];

    // Find latest readings
    const bpLog = [...logs].reverse().find(l => l.systolic !== null && l.diastolic !== null);
    const sugarLog = [...logs].reverse().find(l => l.bloodSugar !== null);
    const pulseLog = [...logs].reverse().find(l => l.pulse !== null);
    const weightLog = [...logs].reverse().find(l => l.weight !== null);

    // Render cards
    const bpValEl = document.getElementById('latest-bp-val');
    const bpStatusEl = document.getElementById('latest-bp-status');
    const bpTimeEl = document.getElementById('latest-bp-time');
    if (bpValEl && bpStatusEl && bpTimeEl) {
      if (bpLog) {
        bpValEl.innerHTML = `${bpLog.systolic}/${bpLog.diastolic} <span style="font-size:1.1rem; font-weight:500;">mmHg</span>`;
        const res = this.getBPStatus(bpLog.systolic, bpLog.diastolic);
        bpStatusEl.textContent = res.text;
        bpStatusEl.className = `health-card-status ${res.cls}`;
        bpTimeEl.textContent = this.formatVitalsTime(bpLog.timestamp);
      } else {
        bpValEl.innerHTML = `-- <span style="font-size:1.1rem; font-weight:500;">mmHg</span>`;
        bpStatusEl.textContent = TRANSLATIONS[lang].noData || 'No Data';
        bpStatusEl.className = 'health-card-status status-loading';
        bpTimeEl.textContent = '--';
      }
    }

    const sugarValEl = document.getElementById('latest-sugar-val');
    const sugarStatusEl = document.getElementById('latest-sugar-status');
    const sugarTimeEl = document.getElementById('latest-sugar-time');
    if (sugarValEl && sugarStatusEl && sugarTimeEl) {
      if (sugarLog) {
        const contextText = sugarLog.sugarType === 'fasting' ? 
          (lang === 'te' ? 'పరగడుపున' : lang === 'hi' ? 'खाली पेट' : 'Fasting') : 
          (lang === 'te' ? 'ఆహారం తర్వాత' : lang === 'hi' ? 'खाने के बाद' : 'Post-Food');
        sugarValEl.innerHTML = `${sugarLog.bloodSugar} <small style="font-size:0.9rem;">mg/dL (${contextText})</small>`;
        const res = this.getSugarStatus(sugarLog.bloodSugar, sugarLog.sugarType);
        sugarStatusEl.textContent = res.text;
        sugarStatusEl.className = `health-card-status ${res.cls}`;
        sugarTimeEl.textContent = this.formatVitalsTime(sugarLog.timestamp);
      } else {
        sugarValEl.innerHTML = `-- <small>mg/dL</small>`;
        sugarStatusEl.textContent = TRANSLATIONS[lang].noData || 'No Data';
        sugarStatusEl.className = 'health-card-status status-loading';
        sugarTimeEl.textContent = '--';
      }
    }

    const pulseValEl = document.getElementById('latest-pulse-val');
    const pulseStatusEl = document.getElementById('latest-pulse-status');
    const pulseTimeEl = document.getElementById('latest-pulse-time');
    if (pulseValEl && pulseStatusEl && pulseTimeEl) {
      if (pulseLog) {
        pulseValEl.innerHTML = `${pulseLog.pulse} <small>BPM</small>`;
        const res = this.getPulseStatus(pulseLog.pulse);
        pulseStatusEl.textContent = res.text;
        pulseStatusEl.className = `health-card-status ${res.cls}`;
        pulseTimeEl.textContent = this.formatVitalsTime(pulseLog.timestamp);
      } else {
        pulseValEl.innerHTML = `-- <small>BPM</small>`;
        pulseStatusEl.textContent = TRANSLATIONS[lang].noData || 'No Data';
        pulseStatusEl.className = 'health-card-status status-loading';
        pulseTimeEl.textContent = '--';
      }
    }

    const weightValEl = document.getElementById('latest-weight-val');
    const weightStatusEl = document.getElementById('latest-weight-status');
    const weightTimeEl = document.getElementById('latest-weight-time');
    if (weightValEl && weightStatusEl && weightTimeEl) {
      if (weightLog) {
        weightValEl.innerHTML = `${weightLog.weight} <small>kg</small>`;
        const res = this.getWeightStatus(weightLog.weight);
        weightStatusEl.textContent = res.text;
        weightStatusEl.className = `health-card-status ${res.cls}`;
        weightTimeEl.textContent = this.formatVitalsTime(weightLog.timestamp);
      } else {
        weightValEl.innerHTML = `-- <small>kg</small>`;
        weightStatusEl.textContent = TRANSLATIONS[lang].noData || 'No Data';
        weightStatusEl.className = 'health-card-status status-loading';
        weightTimeEl.textContent = '--';
      }
    }

    // Render history table
    const tbody = document.getElementById('vitals-history-tbody');
    if (tbody) {
      tbody.innerHTML = '';
      if (logs.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="5" class="text-center font-muted" style="padding: 1.5rem;" data-i18n="noVitalsLogged">
              ${TRANSLATIONS[lang].noVitalsLogged}
            </td>
          </tr>`;
      } else {
        const sortedLogs = [...logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        sortedLogs.forEach(log => {
          const tr = document.createElement('tr');
          const bpText = (log.systolic !== null && log.diastolic !== null) ? `${log.systolic}/${log.diastolic}` : '--';
          
          let sugarText = '--';
          if (log.bloodSugar !== null) {
            const contextText = log.sugarType === 'fasting' ? 
              (lang === 'te' ? 'పరగడుపున' : lang === 'hi' ? 'खाली पेट' : 'Fasting') : 
              (lang === 'te' ? 'ఆహారం తర్వాత' : lang === 'hi' ? 'खाने के बाद' : 'Post-Food');
            sugarText = `${log.bloodSugar} mg/dL (${contextText})`;
          }
          
          const pulseText = log.pulse !== null ? `${log.pulse} BPM` : '--';
          const weightText = log.weight !== null ? `${log.weight} kg` : '--';

          tr.innerHTML = `
            <td style="font-weight: 600; font-size: 0.85rem;">${this.formatVitalsTime(log.timestamp)}</td>
            <td>${bpText}</td>
            <td>${sugarText}</td>
            <td>${pulseText}</td>
            <td>${weightText}</td>
          `;
          tbody.appendChild(tr);
        });
      }
    }
  }

  renderCaregiverDashboard() {
    const lang = stateStore.data.settings.lang || 'en';
    const hasLinked = !!stateStore.data.linkedPatient;
    
    const headerCard = document.getElementById('cg-patient-card-header');
    const noPatientView = document.getElementById('cg-no-patient-view');
    const dataGrid = document.getElementById('cg-patient-data-grid');
    
    if (!hasLinked) {
      if (headerCard) headerCard.classList.add('hide');
      if (noPatientView) noPatientView.classList.remove('hide');
      if (dataGrid) dataGrid.classList.add('hide');
      return;
    }
    
    if (headerCard) headerCard.classList.remove('hide');
    if (noPatientView) noPatientView.classList.add('hide');
    if (dataGrid) dataGrid.classList.remove('hide');
    
    const lp = stateStore.data.linkedPatient;
    
    // Fill Patient Header Info
    const cgPatName = document.getElementById('cg-patient-name');
    const cgPatAge = document.getElementById('cg-patient-age');
    const cgPatBlood = document.getElementById('cg-patient-blood');
    const cgPatEmergency = document.getElementById('cg-patient-emergency');
    const cgPatDoctor = document.getElementById('cg-patient-doctor');
    
    if (cgPatName) cgPatName.textContent = lp.name || '';
    if (cgPatAge) cgPatAge.textContent = lp.age || '--';
    if (cgPatBlood) cgPatBlood.textContent = lp.blood || '--';
    if (cgPatEmergency) cgPatEmergency.textContent = lp.emergency || '--';
    if (cgPatDoctor) cgPatDoctor.textContent = lp.primaryDoctorId || '--';
    
    // Profile photo
    const picImg = document.getElementById('cg-patient-pic');
    const picPlaceholder = document.getElementById('cg-patient-pic-placeholder');
    if (picImg && picPlaceholder) {
      if (lp.photo) {
        picImg.src = lp.photo;
        picImg.classList.remove('hide');
        picPlaceholder.classList.add('hide');
      } else {
        picImg.src = '';
        picImg.classList.add('hide');
        picPlaceholder.classList.remove('hide');
      }
    }
    
    // Adherence Ring & Streak
    const patientLogs = stateStore.data.logs || [];
    let pctVal = 0;
    if (patientLogs.length > 0) {
      const taken = patientLogs.filter(l => l.status === 'taken').length;
      pctVal = Math.round((taken / patientLogs.length) * 100);
    }
    
    const complianceRing = document.getElementById('cg-compliance-ring');
    const complianceText = document.getElementById('cg-compliance-text');
    if (complianceText) complianceText.textContent = `${pctVal}%`;
    if (complianceRing) {
      const circ = 251.2;
      const offset = circ - (pctVal / 100) * circ;
      complianceRing.style.strokeDashoffset = offset;
    }
    
    const streakCount = document.getElementById('cg-streak-count');
    if (streakCount) {
      streakCount.textContent = lp.streak || 0;
    }
    
    // Today's checklist
    const todoList = document.getElementById('cg-patient-todo-list');
    if (todoList) {
      todoList.innerHTML = '';
      
      const activeSimDate = clockEngine.getSimulatedDate();
      const activeDateStr = clockEngine.getFormattedDateOnly(activeSimDate);
      const weekday = activeSimDate.getDay();
      
      const todaysSchedules = [];
      const medicines = stateStore.data.medicines || [];
      
      medicines.forEach(med => {
        if (med.frequency === 'specific_days' && med.specificDays && !med.specificDays.includes(weekday)) {
          return;
        }
        med.times.forEach(time => {
          const matchingLog = patientLogs.find(log => 
            log.medicineId === med.id && 
            log.time === time && 
            log.date === activeDateStr
          );
          
          let status = 'pending';
          if (matchingLog) status = matchingLog.status;
          
          todaysSchedules.push({ med, time, status });
        });
      });
      
      todaysSchedules.sort((a, b) => a.time.localeCompare(b.time));
      
      if (todaysSchedules.length === 0) {
        todoList.innerHTML = `
          <div class="font-muted text-center" style="padding: 1.5rem;" data-i18n="cgNoMedsToday">
            ${TRANSLATIONS[lang].cgNoMedsToday}
          </div>`;
      } else {
        todaysSchedules.forEach(item => {
          const row = document.createElement('div');
          row.className = `checklist-card ${item.status}-state`;
          row.style.display = 'flex';
          row.style.justifyContent = 'space-between';
          row.style.alignItems = 'center';
          row.style.padding = '0.75rem';
          row.style.margin = '0 0 0.5rem 0';
          row.style.borderRadius = 'var(--border-radius-md)';
          row.style.border = '1px solid var(--glass-border)';
          
          const isTaken = item.status === 'taken';
          const isSkipped = item.status === 'skipped';
          
          let shapeIcon = '💊';
          if (item.med.type === 'syrup') shapeIcon = '🧴';
          else if (item.med.type === 'injection') shapeIcon = '💉';
          else if (item.med.type === 'drops') shapeIcon = '💧';
          else if (item.med.type === 'inhaler') shapeIcon = '💨';
          
          row.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:0.2rem;">
              <span style="font-size:0.75rem; font-weight:700; color:var(--text-muted);">${this.format12Hour(item.time)}</span>
              <strong style="border-left: 3px solid ${item.med.color || '#0d9488'}; padding-left: 0.5rem;">${item.med.name}</strong>
              <span style="font-size:0.75rem; color:var(--text-muted);">${shapeIcon} ${item.med.dosage}</span>
            </div>
            <div class="checklist-card-actions" style="display:flex; gap:0.4rem;">
              <button class="action-check-btn btn-take ${isTaken ? 'active' : ''}" title="Mark Taken" onclick="appController.toggleDoseStatus('${item.med.id}', '${item.time}', 'taken')">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" width="14" height="14">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </button>
              <button class="action-check-btn btn-skip ${isSkipped ? 'active' : ''}" title="Mark Skipped" onclick="appController.toggleDoseStatus('${item.med.id}', '${item.time}', 'skipped')">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" width="14" height="14">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          `;
          todoList.appendChild(row);
        });
      }
    }
    
    // Latest Vitals
    const healthLogs = stateStore.data.healthLogs || [];
    const bpLog = [...healthLogs].reverse().find(l => l.systolic !== null && l.diastolic !== null);
    const sugarLog = [...healthLogs].reverse().find(l => l.bloodSugar !== null);
    const pulseLog = [...healthLogs].reverse().find(l => l.pulse !== null);
    const weightLog = [...healthLogs].reverse().find(l => l.weight !== null);
    
    const bpVal = document.getElementById('cg-bp-val');
    const bpStatus = document.getElementById('cg-bp-status');
    if (bpVal && bpStatus) {
      if (bpLog) {
        bpVal.innerHTML = `${bpLog.systolic}/${bpLog.diastolic} <small>mmHg</small>`;
        const res = this.getBPStatus(bpLog.systolic, bpLog.diastolic);
        bpStatus.textContent = res.text;
        bpStatus.className = `health-card-status ${res.cls}`;
      } else {
        bpVal.innerHTML = `--/-- <small>mmHg</small>`;
        bpStatus.textContent = TRANSLATIONS[lang].noData || 'No Data';
        bpStatus.className = 'health-card-status status-loading';
      }
    }
    
    const sugarVal = document.getElementById('cg-sugar-val');
    const sugarStatus = document.getElementById('cg-sugar-status');
    if (sugarVal && sugarStatus) {
      if (sugarLog) {
        const contextText = sugarLog.sugarType === 'fasting' ? 
          (lang === 'te' ? 'పరగడుపున' : lang === 'hi' ? 'खाली पेट' : 'Fasting') : 
          (lang === 'te' ? 'ఆహారం తర్వాత' : lang === 'hi' ? 'खाने के बाद' : 'Post-Food');
        sugarVal.innerHTML = `${sugarLog.bloodSugar} <small>mg/dL (${contextText})</small>`;
        const res = this.getSugarStatus(sugarLog.bloodSugar, sugarLog.sugarType);
        sugarStatus.textContent = res.text;
        sugarStatus.className = `health-card-status ${res.cls}`;
      } else {
        sugarVal.innerHTML = `-- <small>mg/dL</small>`;
        sugarStatus.textContent = TRANSLATIONS[lang].noData || 'No Data';
        sugarStatus.className = 'health-card-status status-loading';
      }
    }
    
    const pulseVal = document.getElementById('cg-pulse-val');
    const pulseStatus = document.getElementById('cg-pulse-status');
    if (pulseVal && pulseStatus) {
      if (pulseLog) {
        pulseVal.innerHTML = `${pulseLog.pulse} <small>BPM</small>`;
        const res = this.getPulseStatus(pulseLog.pulse);
        pulseStatus.textContent = res.text;
        pulseStatus.className = `health-card-status ${res.cls}`;
      } else {
        pulseVal.innerHTML = `-- <small>BPM</small>`;
        pulseStatus.textContent = TRANSLATIONS[lang].noData || 'No Data';
        pulseStatus.className = 'health-card-status status-loading';
      }
    }
    
    const weightVal = document.getElementById('cg-weight-val');
    const weightStatus = document.getElementById('cg-weight-status');
    if (weightVal && weightStatus) {
      if (weightLog) {
        weightVal.innerHTML = `${weightLog.weight} <small>kg</small>`;
        const res = this.getWeightStatus(weightLog.weight);
        weightStatus.textContent = res.text;
        weightStatus.className = `health-card-status ${res.cls}`;
      } else {
        weightVal.innerHTML = `-- <small>kg</small>`;
        weightStatus.textContent = TRANSLATIONS[lang].noData || 'No Data';
        weightStatus.className = 'health-card-status status-loading';
      }
    }
  }

  triggerEmergencySOS(activate) {
    const modal = document.getElementById('sos-alert-modal');
    if (!modal) return;
    
    if (activate) {
      modal.classList.remove('hide');
      alarmSoundSynth.start(true);
      
      const active = stateStore.data.activePatient;
      if (active) {
        const emergencyVal = document.getElementById('sos-emergency-val');
        const docNameVal = document.getElementById('sos-doctor-name-val');
        const docPhoneVal = document.getElementById('sos-doctor-phone-val');
        
        if (emergencyVal) emergencyVal.textContent = active.emergency || '--';
        if (docNameVal) docNameVal.textContent = active.doctorName || '--';
        if (docPhoneVal) docPhoneVal.textContent = active.doctorPhone || '--';
      }
      
      const sosMessage = {
        en: "Emergency Alert! SOS alarm activated. Please check on the patient immediately.",
        hi: "आपातकालीन चेतावनी! एसओएस अलार्म चालू हो गया है। कृपया मरीज की तुरंत सहायता करें।",
        te: "అత్యవసర హెచ్చరిక! ఎస్ఓఎస్ అలారం మోగింది. దయచేసి రోగిని వెంటనే గమనించండి."
      };
      voiceNarrator.speak(sosMessage);
    } else {
      modal.classList.add('hide');
      alarmSoundSynth.stop();
      voiceNarrator.stop();
    }
  }

  // ==========================================
  // HELPER AND UI UTILITIES
  // ==========================================

  // Converts 24h string e.g. "13:45" to "01:45 PM"
  format12Hour(time24) {
    if (!time24) return "--:--";
    if (time24 === 'PRN') return 'As Needed (PRN)';
    const parts = time24.split(':');
    if (parts.length < 2) return time24;
    const hrs = parseInt(parts[0]);
    const mins = parseInt(parts[1]);
    if (isNaN(hrs) || isNaN(mins)) return time24;
    const ampm = hrs >= 12 ? 'PM' : 'AM';
    const displayHrs = hrs % 12 || 12;
    return `${displayHrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${ampm}`;
  }

  formatMedicineType(type) {
    const dict = {
      tablet: '💊 Tablet',
      capsule: '💊 Capsule',
      syrup: '🧴 Syrup',
      injection: '💉 Injection',
      drops: '💧 Drops',
      inhaler: '💨 Inhaler',
      topical: '🧴 Topical Cream'
    };
    return dict[type] || '💊 Medicine';
  }

  // Flash satisfying green success visual animation
  playSuccessConfetti() {
    const container = document.body;
    for (let i = 0; i < 20; i++) {
      const element = document.createElement('div');
      element.style.position = 'fixed';
      element.style.width = '10px';
      element.style.height = '10px';
      element.style.backgroundColor = `hsl(${Math.random() * 360}, 90%, 60%)`;
      element.style.left = `${Math.random() * 100}vw`;
      element.style.top = '100vh';
      element.style.zIndex = '9999';
      element.style.borderRadius = '50%';
      element.style.pointerEvents = 'none';
      element.style.transition = 'transform 1s cubic-bezier(0.25, 1, 0.5, 1), opacity 1s';
      
      container.appendChild(element);

      // Force repaint
      element.offsetHeight;

      const angle = (Math.random() * Math.PI) / 2 + Math.PI / 4; // 45 to 135 deg
      const dist = Math.random() * 200 + 400; // 400px to 600px
      const destX = Math.cos(angle) * dist * (Math.random() > 0.5 ? 1 : -1);
      const destY = -Math.sin(angle) * dist;

      element.style.transform = `translate(${destX}px, ${destY}px) scale(0.5)`;
      element.style.opacity = '0';

      setTimeout(() => element.remove(), 1000);
    }
  }
}

// Global instantiation of AppController
const appController = new AegisAppController();

// Boot application upon window document loads
window.addEventListener('DOMContentLoaded', () => {
  appController.init();
});
