import React from "react";
import "./Footer.css";
import { useLanguage } from "../contexts/LanguageContext";

const Footer = () => {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <p className="footer-text">
            {language === "tr" 
              ? `© ${currentYear} Gitar Eğitim Platformu. Tüm hakları saklıdır.` 
              : `© ${currentYear} Guitar Education Platform. All rights reserved.`}
          </p>
        </div>
        <div className="footer-center">
          <p className="footer-brand">
            {language === "tr" ? "Müziğinizi Keşfedin" : "Discover Your Music"}
          </p>
        </div>
        <div className="footer-right">
          <p className="footer-contact">
            {language === "tr" ? "İletişim: info@gitareğitim.com" : "Contact: info@guitaredu.com"}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
