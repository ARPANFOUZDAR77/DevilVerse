import React, { createContext, useContext, useState } from "react";

export type Language = "en" | "ja";

interface Translations {
  [key: string]: {
    en: string;
    ja: string;
  };
}

export const translations: Translations = {
  // Navigation Links
  "nav.timeline": { en: "Story", ja: "ストーリー" },
  "nav.skills": { en: "Skills", ja: "スキル" },
  "nav.console": { en: "Console", ja: "コンソール" },
  "nav.playground": { en: "Sandbox", ja: "サンドボックス" },
  "nav.security": { en: "Security", ja: "セキュリティ" },
  "nav.threed": { en: "3D Studio", ja: "3Dスタジオ" },
  "nav.gallery": { en: "Gallery", ja: "ギャラリー" },
  "nav.contact": { en: "Contact", ja: "コンタクト" },

  // System status
  "sys.stable": { en: "SYS_STABLE: 120FPS", ja: "システム安定: 120FPS" },
  "sys.resolved": { en: "STATION CORE CONNECTION: RESOLVED", ja: "ステーション コア 接続: 確立" },
  "sys.designedBy": { en: "DESIGNED BY ARPAN // AKA DEVIL // © 2026 COGNITIVE", ja: "ARPAN // 別名 DEVIL によるデザイン // © 2026 COGNITIVE" },

  // Interactive buttons
  "btn.mute": { en: "Mute procedural soundscape", ja: "環境音をミュート" },
  "btn.unmute": { en: "Unmute UI synthesis soundscape", ja: "環境音をミュート解除" },

  // Section headings
  "section.timeline.title": { en: "Story Timeline", ja: "ストーリータイムライン" },
  "section.skills.title": { en: "Skills Constellation", ja: "スキルコズミック星座" },
  "section.console.title": { en: "Developer Console", ja: "デベロッパーコンソール" },
  "section.playground.title": { en: "Interactive Sandbox", ja: "インタラクティブサンドボックス" },
  "section.security.title": { en: "Security Mainframe", ja: "セキュリティメインフレーム" },
  "section.threed.title": { en: "3D Specular Renderer", ja: "3Dスペキュラレンダラー" },
  "section.gallery.title": { en: "Design Exhibition Gallery", ja: "デザインエキシビションギャラリー" },
  "section.contact.title": { en: "Contact Channels Gateway", ja: "コンタクトチャンネルゲートウェイ" },

  // Hero section strings
  "hero.badge": { en: "IMMERSIVE INTERACTIVE ENVIRONMENT", ja: "没入型インタラクティブ環境" },
  "hero.desc": { en: "Designing immersive digital experiences beyond ordinary websites. Engineering clean visual geometry, physics-inspired interfaces, and custom WebGL systems.", ja: "一般的なウェブサイトを超えた没入型のデジタル体験を設計。クリーンな視覚的幾何学、物理学にインスパイアされたインターフェース、およびカスタムWebGLシステムをエンジニアリング。" },
  "hero.boot": { en: "BOOT SYSTEM CONSOLE", ja: "システムコンソールを起動" },
  "hero.playground": { en: "INTERACTIVE PLAYGROUND", ja: "インタラクティブプレイグラウンド" },
  "hero.scroll": { en: "SCROLL DOWN TO STORY", ja: "ストーリーへスクロール" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("app_language");
    return (saved === "en" || saved === "ja") ? saved : "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app_language", lang);
  };

  const t = (key: string): string => {
    if (!translations[key]) {
      return key;
    }
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
