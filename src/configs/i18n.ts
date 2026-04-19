import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "../locales/en.json";
import vn from "../locales/vn.json";

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources: {
    en: {
      translation: en
    },
    vi: {
      translation: vn
    },
  },
  lng: "en",
  fallbackLng: "en",
});

export default i18n;

// import i18n from "i18next"
// import { initReactI18next } from "react-i18next"
// import LanguageDetector from "i18next-browser-languagedetector"

// import enCommon from "../locales/en/common.json"
// import enDashboard from "../locales/en/dashboard.json"
// import viCommon from "../locales/vn/common.json"
// import viDashboard from "../locales/vn/dashboard.json"

// i18n
//   .use(LanguageDetector)
//   .use(initReactI18next)
//   .init({
//     resources: {
//       en: {
//         common: enCommon,
//         dashboard: enDashboard,
//       },
//       vi: {
//         common: viCommon,
//         dashboard: viDashboard,
//       },
//     },

//     ns: ["common", "dashboard"],       // 👈 khai báo namespace
//     defaultNS: "common",

//     lng: "vi",
//     fallbackLng: "en",

//     interpolation: {
//       escapeValue: false,
//     },
//   })

// export default i18n