import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import { MdVerified } from "react-icons/md";
import "./Desktop_css/panelwithprofile.css";

/* ─────────────────────────────
   Skeleton Card
───────────────────────────── */
const SkeletonCard = ({ priority }) => (
  <div className={`featured-card skeleton ${priority ? "priority" : ""}`}>
    <div className="skeleton-banner shimmer" />
    <div className="skeleton-content">
      <div className="skeleton-line title shimmer" />
      <div className="skeleton-line small shimmer" />
      <div className="skeleton-tags">
        <span className="shimmer" />
        <span className="shimmer" />
        <span className="shimmer" />
      </div>
    </div>
  </div>
);

/* ─────────────────────────────
   Card Component
───────────────────────────── */
const Card = ({
  id,
  businessName,
  location,
  bannerImg,
  keywords,
  subscription,
  profileData,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="featured-card fade-in"
      onClick={() =>
        navigate(`/profile/${id}`, { state: { profile: profileData } })
      }
    >
      <div className="featured-banner">
        <img
          src={bannerImg || "/images/default-banner.jpg"}
          alt={businessName}
          loading="lazy"
          onError={(e) => (e.target.src = "/images/default-banner.jpg")}
        />
      </div>

      <div className="featured-profile">
        <h4>
          {businessName}
          {subscription && (
            <MdVerified className="verifiedicon" title="Verified Business" />
          )}
        </h4>

        <p className="location-text">{location}</p>

        {keywords && (
          <div className="keyword-row"> <h5>Products :</h5>
            {keywords
              .split(",")
              .slice(0, 3)
              .map((k, i) => (
                <span key={i}>{k.trim()}</span>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────
   Panelwithprofile
───────────────────────────── */
const Panelwithprofile = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);

  const INITIAL_COUNT = 8;
  const LOAD_MORE_COUNT = 8;

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("users_table")
        .select(`
          id,
          cover_photo,
          user_name,
          profiles:profiles!users_table_user_id_fkey (
            id,
            city,
            business_name,
            person_name,
            keywords,
            subscription
          )
        `)
        .not("cover_photo", "is", null)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setCards(
          data.map((item) => ({
            id: item.profiles?.id,
            businessName:
              item.profiles?.business_name ||
              item.profiles?.person_name ||
              item.user_name,
            location: item.profiles?.city || "India",
            bannerImg: item.cover_photo,
            keywords: item.profiles?.keywords,
            subscription: item.profiles?.subscription,
            profileData: item.profiles,
          }))
        );
      }

      setTimeout(() => setLoading(false), 900); // smooth fade
    };

    fetchFeatured();
  }, []);

  const visibleCards = cards.slice(0, visibleCount);

  return (
    <section className=" panel-section">
      <h2 className="section-title">Featured Businesses</h2>

      <div className="cards-grid">
        {loading
          ? Array.from({ length: INITIAL_COUNT }).map((_, i) => (
              <SkeletonCard key={i} priority={i < 2} />
            ))
          : visibleCards.map((card, i) => (
              <Card key={i} {...card} />
            ))}
      </div>

      {!loading && cards.length > INITIAL_COUNT && (
        <div className="load-more-container">
          {visibleCount < cards.length ? (
            <button
              className="load-more-btn"
              onClick={() =>
                setVisibleCount((prev) => prev + LOAD_MORE_COUNT)
              }
            >
              Load More
            </button>
          ) : (
            <button
              className="load-less-btn"
              onClick={() => setVisibleCount(INITIAL_COUNT)}
            >
              Load Less
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default Panelwithprofile;
