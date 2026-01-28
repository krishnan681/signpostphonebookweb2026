import React from "react";
 
import {
  FaSms,
  FaWhatsapp,
  FaEnvelope,
  FaDatabase,
  FaBullseye,
  FaChartLine,
} from "react-icons/fa";
import "../Desktop_view/Desktop_css/FeatureList.css"

const featuresData = [
  {
    icon: <FaSms />,
    bgColor: "#E0E7FF",
    iconColor: "#4F46E5",
    title: "Bulk SMS Marketing",
    description:
      "Reach customers instantly with high-deliverability SMS campaigns. Personalize messages and track opens.",
  },
  {
    icon: <FaWhatsapp />,
    bgColor: "#D1FAE5",
    iconColor: "#059669",
    title: "WhatsApp Business ",
    description:
      "Leverage WhatsApp's massive user base with approved templates and rich media support.",
  },
  {
    icon: <FaEnvelope />,
    bgColor: "#DBEAFE",
    iconColor: "#2563EB",
    title: "Email Campaigns",
    description:
      "Design beautiful emails with our drag-and-drop builder and advanced segmentation tools.",
  },
  {
    icon: <FaDatabase />,
    bgColor: "#EDE9FE",
    iconColor: "#7C3AED",
    title: "5M+ MSME Database",
    description:
      "Access India's most comprehensive database of verified small and medium businesses.",
  },
  {
    icon: <FaBullseye />,
    bgColor: "#FEF3C7",
    iconColor: "#D97706",
    title: "Advanced Targeting",
    description:
      "Filter by location, industry, business size and more to reach your perfect audience.",
  },
  {
    icon: <FaChartLine />,
    bgColor: "#FEE2E2",
    iconColor: "#DC2626",
    title: "Real-time Analytics",
    description:
      "Track opens, clicks, conversions and ROI with our comprehensive dashboard.",
  },
];

export default function FeatureList() {
  return (
    <section className="flist-section">
      <div className="flist-container">
        <div className="flist-header flist-fade-in">
          <h1 className="flist-title">Powerful Features for Maximum Impact</h1>
          <p className="flist-subtitle">
            Everything you need to connect with your ideal customers and grow
            your business
          </p>
        </div>

        <div className="flist-grid">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className={`flist-card flist-fade-in flist-delay-${
                (index % 3) + 1
              }`}
            >
              <div
                className="flist-icon-wrapper"
                style={{ backgroundColor: feature.bgColor, color: feature.iconColor }}
              >
                {feature.icon}
              </div>
              <h2 className="flist-card-title">{feature.title}</h2>
              <p className="flist-card-text">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
