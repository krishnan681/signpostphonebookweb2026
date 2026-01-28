import React from "react";
import "../Desktop_view/Desktop_css/CategoryForLandingPage.css";

const CategoryForLandingPage = () => {
  return (
    <div className="category-container">
      <h2 className="category-header">
        Phonebook - Find Anyone, Anywhere and Promote Your Business
      </h2>

      <p className="category-description">
        Signpost PHONE BOOK is Your ultimate solution for effective business
        promotion. We specialize in helping businesses reach their target
        audience through powerful marketing channels like SMS, WhatsApp, and
        Email. <br/><br/>
        ✅ Highlights Built-in Database of Lakhs of MSMEs <br/>
        ✅ Mobile-friendly (Works on Smart & Feature Phones) <br/>
        ✅ Firm-wise Alphabetical & Category-wise Search (10,000+ Categories)<br/>
        ✅ Daily Updates with New MSME Firms<br/>
        ✅ Highly Useful for B2C & B2B Segments<br/>
        ✅ Promote via SMS, WhatsApp, Email<br/>
        ✅ Special Reach: Category-wise or Location-based
      </p>

      <div className="category-sections">
        {[
          {
            title: "Popular Categories",
            items: [
              "Coaching & Tuitions",
              "Business Services",
              "Home Services",
              "B2B",
              "Home Construction & Renovation",
              "Home Decoration & Furniture",
              "Personal Finance Services",
              "Tours & Travels",
              "Parties, Special Occasions & Wedding",
            ],
          },
          {
            title: "B2B & Business Services",
            items: [
              "Domestic Help Services",
              "Patient Care Service",
              "Home Appliances Repair & Services",
              "Packers and Movers",
              "AC Services",
              "Cleaning Services",
              "Pest Control",
              "Building Consultants & Contractors",
              "Security Guards",
              "Interior Designers & Decorators",
              "Housekeeping Services",
              "Painting Contractors",
              "Modular Kitchen Dealers",
              "Waterproofing Contractors",
              "Architects",
            ],
          },
          {
            title: "Education and Training",
            items: [
              "Job Training",
              "School Tuitions",
              "Entrance Exam Coaching",
              "Competitive Exam Coaching",
              "Distance Education",
              "Language Training",
              "Overseas Education",
              "College & University Tuitions",
              "Placement Consultancies",
              "Aviation Colleges",
              "Cloud Computing Training",
              "Data Science & Business Analytics Training",
              "IT Programming Languages Training",
              "Web Design and Development",
              "Designing Tools Training",
              "Finance & Accounting Tuitions",
              "Hotel Management Colleges",
            ],
          },
          {
            title: "Personal Service",
            items: [
              "Loans",
              "Visa Consultants",
              "Beauty Parlour Services",
              "Event Organisers",
              "Catering Services",
              "Photographers & Videographers",
              "Astrologers",
              "Vehicle Rentals",
              "Massage Centres",
              "Advocates & Lawyers",
              "Tour Operators",
              "Chartered Accountant",
            ],
          },
          
        ].map((section, i) => (
          <div className="category-section" key={i}>
            <h3 className="category-section-title">{section.title}</h3>
            <div className="category-links">
              {section.items.map((item, idx) => (
                <a href="#" className="category-link" key={idx}>
                  {item}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryForLandingPage;
