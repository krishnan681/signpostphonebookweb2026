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
  displayName,
  location,
  bannerImg,
  keywords,
  subscription,
  is_prime,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="featured-card fade-in"
      onClick={() => navigate(`/profile/${id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") navigate(`/profile/${id}`);
      }}
    >
      <div className="featured-banner">
        <img
          src={bannerImg || "/images/default-banner.jpg"}
          alt={displayName}
          loading="lazy"
          onError={(e) => (e.target.src = "/images/default-banner.jpg")}
        />
      </div>

      <div className="featured-profile">
        <h4>
          {displayName}
          {(subscription !== "free" || is_prime) && (
            <MdVerified className="verifiedicon" title="Premium / Verified" />
          )}
        </h4>

        <p className="location-text">{location || "India"}</p>

        {keywords && (
          <div className="keyword-row">
            <h5>Products :</h5>
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
            business_name,
            person_name,
            city,
            keywords,
            subscription,
            is_prime
          )
        `)
        .not("cover_photo", "is", null)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch error:", error.message);
      }

      if (data) {
        setCards(
          data
            .filter((item) => item.profiles?.id)
            .map((item) => {
              const p = item.profiles;
              return {
                id: p.id,
                displayName:
                  p.business_name ||
                  p.person_name ||
                  item.user_name ||
                  "Business",
                location: p.city,
                bannerImg: item.cover_photo,
                keywords: p.keywords,
                subscription: p.subscription,
                is_prime: p.is_prime,
              };
            })
        );
      }

      setTimeout(() => setLoading(false), 800);
    };

    fetchFeatured();
  }, []);

  const visibleCards = cards.slice(0, visibleCount);

  return (
    <section className="panel-section">
      <h2 className="section-title">Featured Businesses</h2>

      <div className="cards-grid">
        {loading
          ? Array.from({ length: INITIAL_COUNT }).map((_, i) => (
              <SkeletonCard key={i} priority={i < 2} />
            ))
          : visibleCards.map((card) => <Card key={card.id} {...card} />)}
      </div>

      {!loading && cards.length > INITIAL_COUNT && (
        <div className="load-more-container">
          {visibleCount < cards.length ? (
            <button
              className="load-more-btn"
              onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_COUNT)}
            >
              Load More
            </button>
          ) : (
            <button
              className="load-less-btn"
              onClick={() => setVisibleCount(INITIAL_COUNT)}
            >
              Show Less
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default Panelwithprofile;