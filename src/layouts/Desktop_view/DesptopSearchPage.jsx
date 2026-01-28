// // // ================= SearchPage.jsx =================
// // import { useEffect, useState, useCallback } from "react";
// // import { useNavigate, useLocation } from "react-router-dom";
// // import { supabase } from "../../services/supabaseClient";
// // import { useAuth } from "../../context/AuthContext";
// // import { useFavorites } from "../../context/FavoritesContext";
// // import Swal from "sweetalert2";
// // import FavoriteModal from "../Desktop_view/components/FavoriteModal";
// // import RecentlyListEnquiryModal from "../Desktop_view/components/RecentlyListEnquiryModal";

// // import {
// //   FaHeart,
// //   FaRegHeart,
// //   FaSearch,
// //   FaPhoneAlt,
// //   FaSlidersH,
// // } from "react-icons/fa";
// // import { MdVerified } from "react-icons/md";

// // // import RecentlyListEnquiryModal from "../Components/RecentlyListEnquiryModal";
// // // import FavoriteModal from "../Components/FavoriteModal";

// // import { Button, Form } from "react-bootstrap";
// // import "../Desktop_view/Desktop_css/DesptopSearchPage.css";

// // const ITEMS_PER_PAGE = 12;

// // const DesptopSearchPage = () => {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const { user, userData } = useAuth();
// //   const { favorites, addFavorite, removeFavorite } = useFavorites();

// //   const [profiles, setProfiles] = useState([]);
// //   const [totalCount, setTotalCount] = useState(0);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [loading, setLoading] = useState(false);
// //   const [keywordsFocused, setKeywordsFocused] = useState(false);

// //   const [filters, setFilters] = useState({
// //     businessName: "",
// //     keywords: "",
// //     userType: "",
// //     membership: "",
// //     sortBy: "newest",
// //     verifiedOnly: false,
// //   });

// //   const [showEnquiryModal, setShowEnquiryModal] = useState(false);
// //   const [selectedProfile, setSelectedProfile] = useState(null);
// //   const [showFavoriteModal, setShowFavoriteModal] = useState(false);
// //   const [selectedFavoriteItem, setSelectedFavoriteItem] = useState(null);

// //   /* ---------------- URL QUERY HANDLING ---------------- */
// //   useEffect(() => {
// //     const params = new URLSearchParams(location.search);
// //     const query = params.get("query");
// //     const keywordsParam = params.get("keywords");
// //     const userTypeParam = params.get("userType");

// //     setFilters((prev) => ({
// //       ...prev,
// //       businessName: query || prev.businessName,
// //       keywords: keywordsParam || prev.keywords,
// //       userType: userTypeParam || prev.userType,
// //     }));
// //   }, [location.search]);

// //   /* ---------------- FETCH PROFILES ---------------- */
// //   const fetchProfiles = useCallback(async () => {
// //     setLoading(true);

// //     const from = (currentPage - 1) * ITEMS_PER_PAGE;
// //     const to = from + ITEMS_PER_PAGE - 1;

// //     let query = supabase
// //       .from("profiles")
// //       .select("*", { count: "exact" })
// //       .range(from, to)
// //       .order("priority", { ascending: false, nullsLast: true })
// //       .order("subscription", { ascending: false })
// //       .order("created_at", { ascending: false });

// //     if (filters.membership === "gold") {
// //       query = query.eq("subscription", "gold");
// //     } else if (filters.membership === "business") {
// //       query = query
// //         .neq("subscription", "gold")
// //         .not("subscription", "in", "(free,null)");
// //     } else if (filters.membership === "free") {
// //       query = query.or("subscription.eq.free,subscription.is.null");
// //     }

// //     if (filters.businessName.trim()) {
// //       const term = filters.businessName.trim();
// //       query = query.or(
// //         `business_name.ilike.%${term}%,person_name.ilike.%${term}%`
// //       );
// //     }

// //     if (filters.keywords.trim()) {
// //       query = query.ilike("keywords", `%${filters.keywords.trim()}%`);
// //     }

// //     if (filters.userType) {
// //       query = query.eq("user_type", filters.userType);
// //     }

// //     if (filters.verifiedOnly) {
// //       query = query.not("mobile_number", "is", null);
// //     }

// //     // You can extend sorting here based on filters.sortBy if needed
// //     // Example: if (filters.sortBy === "oldest") query = query.order("created_at", { ascending: true });

// //     const { data, error, count } = await query;

// //     if (error) {
// //       console.error("Fetch error:", error);
// //       Swal.fire("Error", "Failed to load listings", "error");
// //     } else {
// //       setProfiles(data || []);
// //       setTotalCount(count || 0);
// //     }

// //     setLoading(false);
// //   }, [currentPage, filters]);

// //   useEffect(() => {
// //     fetchProfiles();
// //   }, [fetchProfiles]);

// //   const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

// //   /* ---------------- HELPERS ---------------- */
// //   const truncateName = (name, maxWords = 2) => {
// //     if (!name) return "";
// //     const words = name.trim().split(/\s+/);
// //     if (words.length <= maxWords) return name;
// //     return words.slice(0, maxWords).join(" ") + "...";
// //   };

// //   const maskMobile = (number) => {
// //     if (!number || number.length < 5) return "XXXXX";
// //     return number.slice(0, 5) + "xxxxx";
// //   };

// //   const parseKeywords = (keywords) => {
// //     if (!keywords) return [];
// //     if (Array.isArray(keywords)) return keywords;
// //     if (typeof keywords === "string") {
// //       return keywords.split(",").map((k) => k.trim()).filter(Boolean);
// //     }
// //     return [];
// //   };

// //   const resetFilters = () => {
// //     setFilters({
// //       businessName: "",
// //       keywords: "",
// //       userType: "",
// //       membership: "",
// //       sortBy: "newest",
// //       verifiedOnly: false,
// //     });
// //     setCurrentPage(1);
// //     setKeywordsFocused(false);
// //   };

// //   const handleEnquiry = (profile) => {
// //     if (!user) {
// //       Swal.fire("Login Required", "Please log in to send enquiry", "info").then(() =>
// //         navigate("/login")
// //       );
// //       return;
// //     }
// //     setSelectedProfile(profile);
// //     setShowEnquiryModal(true);
// //   };

// //   const toggleFavorite = (e, item) => {
// //     e.stopPropagation();
// //     const isFav = favorites.some((f) => f.id === item.id);
// //     if (isFav) {
// //       removeFavorite(item.id);
// //     } else {
// //       setSelectedFavoriteItem(item);
// //       setShowFavoriteModal(true);
// //     }
// //   };

// //   const handleCardClick = (item) => (e) => {
// //     if (e.target.closest("button")) return;
// //     if (userData) {
// //       navigate(`/more/${item.id}`);
// //     } else {
// //       Swal.fire("Login Required", "Please log in to view full profile", "info").then(() =>
// //         navigate("/login")
// //       );
// //     }
// //   };

// //   const getMembershipTier = (item) => {
// //     if (item.subscription === "gold") return "gold";
// //     if (item.subscription && item.subscription !== "free") return "business";
// //     return "free";
// //   };

// //   const getBorderClass = (item) => {
// //     const tier = getMembershipTier(item);
// //     if (tier === "gold") return "gold-border";
// //     if (tier === "business") return "pink-border";
// //     return "black-border";
// //   };

// //   /* ---------------- RENDER ---------------- */
// //   return (
// //     <div className="directory-page-container">
// //       <main className={keywordsFocused ? "keywords-focused" : ""}>
// //         {/* ---- SEARCH BAR + FILTERS ---- */}
// //         <div className="top-search-section">
// //           <div className="dual-search-bar">
// //             <Form.Group className="search-input-group">
// //               <Form.Label>Firms / Persons</Form.Label>
// //               <div className="search-wrapper">
// //                 <FaSearch className="search-icon" />
// //                 <Form.Control
// //                   value={filters.businessName}
// //                   placeholder="Search by Firms/Persons"
// //                   onChange={(e) => {
// //                     setFilters({ ...filters, businessName: e.target.value });
// //                     setCurrentPage(1);
// //                   }}
// //                 />
// //               </div>
// //             </Form.Group>

// //             <Form.Group className="search-input-group">
// //               <Form.Label>Products / Services</Form.Label>
// //               <div className="search-wrapper">
// //                 <FaSearch className="search-icon" />
// //                 <Form.Control
// //                   value={filters.keywords}
// //                   placeholder="Search by products, keywords..."
// //                   onChange={(e) => {
// //                     setFilters({ ...filters, keywords: e.target.value });
// //                     setCurrentPage(1);
// //                   }}
// //                   onFocus={() => setKeywordsFocused(true)}
// //                   onBlur={() => setTimeout(() => setKeywordsFocused(false), 200)}
// //                 />
// //               </div>
// //             </Form.Group>
// //           </div>

// //           {/* Filters Row */}
// //           <div className="filters-row">
// //             <div className="filter-icon-wrapper">
// //               <FaSlidersH className="filter-icon" />
// //             </div>

// //             <select
// //               value={filters.sortBy}
// //               onChange={(e) => {
// //                 setFilters({ ...filters, sortBy: e.target.value });
// //                 setCurrentPage(1);
// //               }}
// //             >
// //               <option value="newest">Newest First</option>
// //               <option value="oldest">Oldest First</option>
// //             </select>

// //             <select
// //               value={filters.userType}
// //               onChange={(e) => {
// //                 setFilters({ ...filters, userType: e.target.value });
// //                 setCurrentPage(1);
// //               }}
// //             >
// //               <option value="">All Types</option>
// //               <option value="business">Business Only</option>
// //               <option value="person">Person Only</option>
// //             </select>

// //             <select
// //               value={filters.membership}
// //               onChange={(e) => {
// //                 setFilters({ ...filters, membership: e.target.value });
// //                 setCurrentPage(1);
// //               }}
// //             >
// //               <option value="">All Members</option>
// //               <option value="gold">Gold Members (Prime)</option>
// //               <option value="business">Business Members</option>
// //               <option value="free">Free Members</option>
// //             </select>

// //             <button
// //               className={filters.verifiedOnly ? "active" : ""}
// //               onClick={() => {
// //                 setFilters({ ...filters, verifiedOnly: !filters.verifiedOnly });
// //                 setCurrentPage(1);
// //               }}
// //             >
// //               Verified Only
// //             </button>

// //             <button onClick={resetFilters} className="btn-reset">
// //               Reset Filters
// //             </button>
// //           </div>

// //           <div className="results-header">
// //             <h2>{totalCount} Results Found</h2>
// //             {(filters.businessName || filters.keywords || filters.membership) && (
// //               <p className="search-term">
// //                 Showing results for:{" "}
// //                 <strong>
// //                   {filters.businessName && `"${filters.businessName}"`}
// //                   {(filters.businessName && (filters.keywords || filters.membership)) && " + "}
// //                   {filters.keywords && `"${filters.keywords}"`}
// //                   {(filters.keywords && filters.membership) && " + "}
// //                   {filters.membership === "gold" && "Gold Members (Prime)"}
// //                   {filters.membership === "business" && "Business Members"}
// //                   {filters.membership === "free" && "Free Members"}
// //                 </strong>
// //               </p>
// //             )}
// //           </div>
// //         </div>

// //         {loading ? (
// //           <div className="skeleton-grid">
// //             {[...Array(12)].map((_, i) => (
// //               <div key={i} className="skeleton-card">
// //                 <div className="skeleton-img"></div>
// //                 <div className="skeleton-lines">
// //                   <div className="skeleton-line long"></div>
// //                   <div className="skeleton-line medium"></div>
// //                   <div className="skeleton-line short"></div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         ) : profiles.length === 0 ? (
// //           <div className="no-results">
// //             <p>No businesses found matching your criteria.</p>
// //             <Button variant="primary" onClick={() => navigate("/")}>
// //               Browse All Categories
// //             </Button>
// //           </div>
// //         ) : (
// //           <>
// //             {/* Desktop Grid View */}
// //             <div className="profiles-grid">
// //               {profiles.map((item) => {
// //                 const borderClass = getBorderClass(item);
// //                 const displayName = item.business_name || item.person_name || "Untitled";
// //                 const keywordsList = parseKeywords(item.keywords);
// //                 const isFavorite = favorites.some((f) => f.id === item.id);
// //                 const hasMobile = !!item.mobile_number;

// //                 return (
// //                   <div
// //                     key={item.id}
// //                     className={`profile-card ${borderClass}`}
// //                     onClick={handleCardClick(item)}
// //                   >
// //                     <div className="profile-info">
// //                       <div className="profile-name">
// //                         <span className="name-text">{displayName}</span>
// //                         {item.mobile_number && <MdVerified className="verified-icon" />}
// //                       </div>

// //                       <p className="profile-location">
// //                         {keywordsFocused
// //                           ? keywordsList.slice(0, 3).join(" • ") || "No products"
// //                           : `${item.city || ""} ${item.pincode ? "- " + item.pincode : ""}`}
// //                       </p>

// //                       {hasMobile && (
// //                         <div className="phone-display-desktop">
// //                           {maskMobile(item.mobile_number)}
// //                         </div>
// //                       )}
// //                     </div>

// //                     <div className="profile-actions">
// //                       <button
// //                         className="btn-enquire-call"
// //                         onClick={(e) => {
// //                           e.stopPropagation();
// //                           if (hasMobile) window.location.href = `tel:${item.mobile_number}`;
// //                           else Swal.fire("Unavailable", "Mobile number not provided", "info");
// //                         }}
// //                       >
// //                         Call
// //                       </button>
// //                       <button
// //                         className="btn-enquire"
// //                         onClick={(e) => {
// //                           e.stopPropagation();
// //                           handleEnquiry(item);
// //                         }}
// //                       >
// //                         Enquire Now
// //                       </button>
// //                       <button
// //                         className="btn-favorite"
// //                         onClick={(e) => toggleFavorite(e, item)}
// //                       >
// //                         {isFavorite ? <FaHeart color="#dc3545" size={20} /> : <FaRegHeart size={20} />}
// //                       </button>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>

// //             {/* Mobile List View */}
// //             <div className="mobile-profiles-list">
// //               {profiles.map((item) => {
// //                 const borderClass = getBorderClass(item);
// //                 const displayName = item.business_name || item.person_name || "Untitled";
// //                 const keywordsList = parseKeywords(item.keywords);
// //                 const isFavorite = favorites.some((f) => f.id === item.id);
// //                 const hasMobile = !!item.mobile_number;

// //                 return (
// //                   <div
// //                     key={item.id}
// //                     className={`mobile-profile-card ${borderClass}`}
// //                     onClick={handleCardClick(item)}
// //                   >
// //                     <button
// //                       className="favorite-btn"
// //                       onClick={(e) => toggleFavorite(e, item)}
// //                     >
// //                       {isFavorite ? <FaHeart color="#d61427ff" size={22} /> : <FaRegHeart size={22} />}
// //                     </button>

// //                     {hasMobile && (
// //                       <button
// //                         className="call-btn-mobile"
// //                         onClick={(e) => {
// //                           e.stopPropagation();
// //                           window.location.href = `tel:${item.mobile_number}`;
// //                         }}
// //                       >
// //                         <FaPhoneAlt size={20} />
// //                       </button>
// //                     )}

// //                     <h5 className="profile-name">
// //                       <span className="name-text">{truncateName(displayName, 2)}</span>
// //                     </h5>

// //                     <p className="profile-location">
// //                       {keywordsFocused
// //                         ? keywordsList.slice(0, 3).join(" • ") || "No products"
// //                         : `${item.city || ""} ${item.pincode ? "- " + item.pincode : ""}`}
// //                     </p>

// //                     <div className="mobile-actions-row">
// //                       <div className="phone-row-placeholder">
// //                         {maskMobile(item.mobile_number)}
// //                       </div>
// //                       <button
// //                         className="Mobile-enquire-btn"
// //                         onClick={(e) => {
// //                           e.stopPropagation();
// //                           handleEnquiry(item);
// //                         }}
// //                       >
// //                         Enquire
// //                       </button>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>

// //             {totalPages > 1 && (
// //               <div className="pagination">
// //                 <button
// //                   onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
// //                   disabled={currentPage === 1}
// //                 >
// //                   Previous
// //                 </button>
// //                 <span>Page {currentPage} of {totalPages}</span>
// //                 <button
// //                   onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
// //                   disabled={currentPage === totalPages}
// //                 >
// //                   Next
// //                 </button>
// //               </div>
// //             )}
// //           </>
// //         )}
// //       </main>

// //       <RecentlyListEnquiryModal
// //         show={showEnquiryModal}
// //         onClose={() => setShowEnquiryModal(false)}
// //         selectedBusiness={selectedProfile}
// //       />

// //       <FavoriteModal
// //         show={showFavoriteModal}
// //         onClose={() => setShowFavoriteModal(false)}
// //         onSave={(category) => {
// //           addFavorite({ ...selectedFavoriteItem, category });
// //           setShowFavoriteModal(false);
// //         }}
// //         selectedItem={selectedFavoriteItem}
// //       />
// //     </div>
// //   );
// // };

// // export default DesptopSearchPage;



// // ================= DesptopSearchPage.jsx =================
// import { useEffect, useState, useCallback } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { supabase } from "../../services/supabaseClient";
// import { useAuth } from "../../context/AuthContext";
// import { useFavorites } from "../../context/FavoritesContext";
// import Swal from "sweetalert2";
// import FavoriteModal from "../Desktop_view/components/FavoriteModal";
// import RecentlyListEnquiryModal from "../Desktop_view/components/RecentlyListEnquiryModal";

// import {
//   FaHeart,
//   FaRegHeart,
//   FaSearch,
//   FaPhoneAlt,
//   FaSlidersH,
// } from "react-icons/fa";
// import { MdVerified } from "react-icons/md";

// import { Button, Form } from "react-bootstrap";
// import "../Desktop_view/Desktop_css/DesptopSearchPage.css";

// const ITEMS_PER_PAGE = 12;

// const DesptopSearchPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, userData } = useAuth();
//   const { favorites, addFavorite, removeFavorite } = useFavorites();

//   const [profiles, setProfiles] = useState([]);
//   const [totalCount, setTotalCount] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [keywordsFocused, setKeywordsFocused] = useState(false);

//   const [filters, setFilters] = useState({
//     businessName: "",
//     keywords: "",
//     userType: "",
//     membership: "",
//     sortBy: "newest",
//     verifiedOnly: false,
//   });

//   const [showEnquiryModal, setShowEnquiryModal] = useState(false);
//   const [selectedProfile, setSelectedProfile] = useState(null);
//   const [showFavoriteModal, setShowFavoriteModal] = useState(false);
//   const [selectedFavoriteItem, setSelectedFavoriteItem] = useState(null);

//   /* ---------------- URL QUERY HANDLING (FIXED) ---------------- */
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);

//     const query = params.get("query");
//     const keywordsParam = params.get("keywords");
//     const userTypeParam = params.get("userType");

//     setFilters((prev) => {
//       const newFilters = {
//         ...prev,
//         businessName: query || prev.businessName,
//         keywords: keywordsParam || prev.keywords,
//         userType: userTypeParam || prev.userType,
//       };

//       // Optional: log for debugging (remove later if not needed)
//       console.log("URL filters applied:", {
//         fromUrl: { query, keywords: keywordsParam, userType: userTypeParam },
//         finalFilters: newFilters,
//       });

//       return newFilters;
//     });

//     // Reset to page 1 when URL parameters change
//     setCurrentPage(1);
//   }, [location.search]);

//   /* ---------------- FETCH PROFILES ---------------- */
//   const fetchProfiles = useCallback(async () => {
//     setLoading(true);

//     const from = (currentPage - 1) * ITEMS_PER_PAGE;
//     const to = from + ITEMS_PER_PAGE - 1;

//     let query = supabase
//       .from("profiles")
//       .select("*", { count: "exact" })
//       .range(from, to)
//       .order("priority", { ascending: false, nullsLast: true })
//       .order("subscription", { ascending: false })
//       .order("created_at", { ascending: false });

//     // Membership filters
//     if (filters.membership === "gold") {
//       query = query.eq("subscription", "gold");
//     } else if (filters.membership === "business") {
//       query = query
//         .neq("subscription", "gold")
//         .not("subscription", "in", "(free,null)");
//     } else if (filters.membership === "free") {
//       query = query.or("subscription.eq.free,subscription.is.null");
//     }

//     // Business/Person name search
//     if (filters.businessName.trim()) {
//       const term = filters.businessName.trim();
//       query = query.or(
//         `business_name.ilike.%${term}%,person_name.ilike.%${term}%`
//       );
//     }

//     // Keywords / products search
//     if (filters.keywords.trim()) {
//       query = query.ilike("keywords", `%${filters.keywords.trim()}%`);
//     }

//     // User type (B2C / B2B) - this is the key fix for category clicks
//     if (filters.userType) {
//       query = query.eq("user_type", filters.userType);
//     }

//     // Verified only (has mobile)
//     if (filters.verifiedOnly) {
//       query = query.not("mobile_number", "is", null);
//     }

//     const { data, error, count } = await query;

//     if (error) {
//       console.error("Fetch error:", error);
//       Swal.fire("Error", "Failed to load listings", "error");
//     } else {
//       setProfiles(data || []);
//       setTotalCount(count || 0);
//     }

//     setLoading(false);
//   }, [currentPage, filters]);

//   useEffect(() => {
//     fetchProfiles();
//   }, [fetchProfiles]);

//   const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

//   /* ---------------- HELPERS ---------------- */
//   const truncateName = (name, maxWords = 2) => {
//     if (!name) return "";
//     const words = name.trim().split(/\s+/);
//     return words.length > maxWords
//       ? words.slice(0, maxWords).join(" ") + "..."
//       : name;
//   };

//   const maskMobile = (number) =>
//     number && number.length >= 5 ? number.slice(0, 5) + "xxxxx" : "XXXXX";

//   const parseKeywords = (keywords) =>
//     typeof keywords === "string"
//       ? keywords.split(",").map((k) => k.trim()).filter(Boolean)
//       : Array.isArray(keywords)
//       ? keywords
//       : [];

//   const resetFilters = () => {
//     setFilters({
//       businessName: "",
//       keywords: "",
//       userType: "",
//       membership: "",
//       sortBy: "newest",
//       verifiedOnly: false,
//     });
//     setCurrentPage(1);
//     setKeywordsFocused(false);
//   };

//   const handleEnquiry = (profile) => {
//     if (!user) {
//       Swal.fire("Login Required", "Please log in to send enquiry", "info").then(() =>
//         navigate("/login")
//       );
//       return;
//     }
//     setSelectedProfile(profile);
//     setShowEnquiryModal(true);
//   };

//   const toggleFavorite = (e, item) => {
//     e.stopPropagation();
//     const isFav = favorites.some((f) => f.id === item.id);
//     if (isFav) {
//       removeFavorite(item.id);
//     } else {
//       setSelectedFavoriteItem(item);
//       setShowFavoriteModal(true);
//     }
//   };

//   const handleCardClick = (item) => (e) => {
//     if (e.target.closest("button")) return;
//     if (userData) {
//       navigate(`/more/${item.id}`);
//     } else {
//       Swal.fire("Login Required", "Please log in to view full profile", "info").then(() =>
//         navigate("/login")
//       );
//     }
//   };

//   const getMembershipTier = (item) => {
//     if (item.subscription === "gold") return "gold";
//     if (item.subscription && item.subscription !== "free") return "business";
//     return "free";
//   };

//   const getBorderClass = (item) => {
//     const tier = getMembershipTier(item);
//     if (tier === "gold") return "gold-border";
//     if (tier === "business") return "pink-border";
//     return "black-border";
//   };

//   /* ---------------- RENDER ---------------- */
//   return (
//     <div className="directory-page-container">
//       <main className={keywordsFocused ? "keywords-focused" : ""}>
//         {/* ---- SEARCH BAR + FILTERS ---- */}
//         <div className="top-search-section">
//           <div className="dual-search-bar">
//             <Form.Group className="search-input-group">
//               <Form.Label>Firms / Persons</Form.Label>
//               <div className="search-wrapper">
//                 <FaSearch className="search-icon" />
//                 <Form.Control
//                   value={filters.businessName}
//                   placeholder="Search by Firms/Persons"
//                   onChange={(e) => {
//                     setFilters({ ...filters, businessName: e.target.value });
//                     setCurrentPage(1);
//                   }}
//                 />
//               </div>
//             </Form.Group>

//             <Form.Group className="search-input-group">
//               <Form.Label>Products / Services</Form.Label>
//               <div className="search-wrapper">
//                 <FaSearch className="search-icon" />
//                 <Form.Control
//                   value={filters.keywords}
//                   placeholder="Search by products, keywords..."
//                   onChange={(e) => {
//                     setFilters({ ...filters, keywords: e.target.value });
//                     setCurrentPage(1);
//                   }}
//                   onFocus={() => setKeywordsFocused(true)}
//                   onBlur={() => setTimeout(() => setKeywordsFocused(false), 200)}
//                 />
//               </div>
//             </Form.Group>
//           </div>

//           <div className="filters-row">
//             <div className="filter-icon-wrapper">
//               <FaSlidersH className="filter-icon" />
//             </div>

//             <select
//               value={filters.sortBy}
//               onChange={(e) => {
//                 setFilters({ ...filters, sortBy: e.target.value });
//                 setCurrentPage(1);
//               }}
//             >
//               <option value="newest">Newest First</option>
//               <option value="oldest">Oldest First</option>
//             </select>

//             <select
//               value={filters.userType}
//               onChange={(e) => {
//                 setFilters({ ...filters, userType: e.target.value });
//                 setCurrentPage(1);
//               }}
//             >
//               <option value="">All Types</option>
//               <option value="B2C">B2C</option>
//               <option value="B2B">B2B</option>
//               <option value="business">Business</option>
//               <option value="person">Person</option>
//             </select>

//             <select
//               value={filters.membership}
//               onChange={(e) => {
//                 setFilters({ ...filters, membership: e.target.value });
//                 setCurrentPage(1);
//               }}
//             >
//               <option value="">All Members</option>
//               <option value="gold">Gold Members (Prime)</option>
//               <option value="business">Business Members</option>
//               <option value="free">Free Members</option>
//             </select>

//             <button
//               className={filters.verifiedOnly ? "active" : ""}
//               onClick={() => {
//                 setFilters({ ...filters, verifiedOnly: !filters.verifiedOnly });
//                 setCurrentPage(1);
//               }}
//             >
//               Verified Only
//             </button>

//             <button onClick={resetFilters} className="btn-reset">
//               Reset Filters
//             </button>
//           </div>

//           <div className="results-header">
//             <h2>{totalCount} Results Found</h2>
//             {(filters.businessName || filters.keywords || filters.userType || filters.membership) && (
//               <p className="search-term">
//                 Showing results for:{" "}
//                 <strong>
//                   {filters.businessName && `"${filters.businessName}"`}
//                   {filters.keywords && ` "${filters.keywords}"`}
//                   {filters.userType && ` Type: ${filters.userType}`}
//                   {filters.membership && ` ${filters.membership}`}
//                 </strong>
//               </p>
//             )}
//           </div>
//         </div>

//         {loading ? (
//           <div className="skeleton-grid">
//             {[...Array(12)].map((_, i) => (
//               <div key={i} className="skeleton-card">
//                 <div className="skeleton-img"></div>
//                 <div className="skeleton-lines">
//                   <div className="skeleton-line long"></div>
//                   <div className="skeleton-line medium"></div>
//                   <div className="skeleton-line short"></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : profiles.length === 0 ? (
//           <div className="no-results">
//             <p>No businesses found matching your criteria.</p>
//             <Button variant="primary" onClick={() => navigate("/")}>
//               Browse All Categories
//             </Button>
//           </div>
//         ) : (
//           <>
//             <div className="profiles-grid">
//               {profiles.map((item) => {
//                 const borderClass = getBorderClass(item);
//                 const displayName = item.business_name || item.person_name || "Untitled";
//                 const keywordsList = parseKeywords(item.keywords);
//                 const isFavorite = favorites.some((f) => f.id === item.id);
//                 const hasMobile = !!item.mobile_number;

//                 return (
//                   <div
//                     key={item.id}
//                     className={`profile-card ${borderClass}`}
//                     onClick={handleCardClick(item)}
//                   >
//                     <div className="profile-info">
//                       <div className="profile-name">
//                         <span className="name-text">{displayName}</span>
//                         {item.mobile_number && <MdVerified className="verified-icon" />}
//                       </div>

//                       <p className="profile-location">
//                         {keywordsFocused
//                           ? keywordsList.slice(0, 3).join(" • ") || "No products"
//                           : `${item.city || ""} ${item.pincode ? "- " + item.pincode : ""}`}
//                       </p>

//                       {hasMobile && (
//                         <div className="phone-display-desktop">
//                           {maskMobile(item.mobile_number)}
//                         </div>
//                       )}
//                     </div>

//                     <div className="profile-actions">
//                       <button
//                         className="btn-enquire-call"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           if (hasMobile) window.location.href = `tel:${item.mobile_number}`;
//                           else Swal.fire("Unavailable", "Mobile number not provided", "info");
//                         }}
//                       >
//                         Call
//                       </button>
//                       <button
//                         className="btn-enquire"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleEnquiry(item);
//                         }}
//                       >
//                         Enquire Now
//                       </button>
//                       <button
//                         className="btn-favorite"
//                         onClick={(e) => toggleFavorite(e, item)}
//                       >
//                         {isFavorite ? <FaHeart color="#dc3545" size={20} /> : <FaRegHeart size={20} />}
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             <div className="mobile-profiles-list">
//               {profiles.map((item) => {
//                 const borderClass = getBorderClass(item);
//                 const displayName = item.business_name || item.person_name || "Untitled";
//                 const keywordsList = parseKeywords(item.keywords);
//                 const isFavorite = favorites.some((f) => f.id === item.id);
//                 const hasMobile = !!item.mobile_number;

//                 return (
//                   <div
//                     key={item.id}
//                     className={`mobile-profile-card ${borderClass}`}
//                     onClick={handleCardClick(item)}
//                   >
//                     <button
//                       className="favorite-btn"
//                       onClick={(e) => toggleFavorite(e, item)}
//                     >
//                       {isFavorite ? <FaHeart color="#d61427ff" size={22} /> : <FaRegHeart size={22} />}
//                     </button>

//                     {hasMobile && (
//                       <button
//                         className="call-btn-mobile"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           window.location.href = `tel:${item.mobile_number}`;
//                         }}
//                       >
//                         <FaPhoneAlt size={20} />
//                       </button>
//                     )}

//                     <h5 className="profile-name">
//                       <span className="name-text">{truncateName(displayName, 2)}</span>
//                     </h5>

//                     <p className="profile-location">
//                       {keywordsFocused
//                         ? keywordsList.slice(0, 3).join(" • ") || "No products"
//                         : `${item.city || ""} ${item.pincode ? "- " + item.pincode : ""}`}
//                     </p>

//                     <div className="mobile-actions-row">
//                       <div className="phone-row-placeholder">
//                         {maskMobile(item.mobile_number)}
//                       </div>
//                       <button
//                         className="Mobile-enquire-btn"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleEnquiry(item);
//                         }}
//                       >
//                         Enquire
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {totalPages > 1 && (
//               <div className="pagination">
//                 <button
//                   onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                   disabled={currentPage === 1}
//                 >
//                   Previous
//                 </button>
//                 <span>Page {currentPage} of {totalPages}</span>
//                 <button
//                   onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//                   disabled={currentPage === totalPages}
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </main>

//       <RecentlyListEnquiryModal
//         show={showEnquiryModal}
//         onClose={() => setShowEnquiryModal(false)}
//         selectedBusiness={selectedProfile}
//       />

//       <FavoriteModal
//         show={showFavoriteModal}
//         onClose={() => setShowFavoriteModal(false)}
//         onSave={(category) => {
//           addFavorite({ ...selectedFavoriteItem, category });
//           setShowFavoriteModal(false);
//         }}
//         selectedItem={selectedFavoriteItem}
//       />
//     </div>
//   );
// };

// export default DesptopSearchPage;


// ================= DesptopSearchPage.jsx =================
// ================= DesptopSearchPage.jsx =================
// import { useEffect, useState, useCallback } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { supabase } from "../../services/supabaseClient";
// import { useAuth } from "../../context/AuthContext";
// import { useFavorites } from "../../context/FavoritesContext";
// import Swal from "sweetalert2";
// import FavoriteModal from "../Desktop_view/components/FavoriteModal";
// import RecentlyListEnquiryModal from "../Desktop_view/components/RecentlyListEnquiryModal";

// import { FaHeart, FaRegHeart, FaSearch, FaPhoneAlt, FaSlidersH } from "react-icons/fa";
// import { MdVerified } from "react-icons/md";

// import { Button, Form } from "react-bootstrap";
// import "../Desktop_view/Desktop_css/DesptopSearchPage.css";

// const ITEMS_PER_PAGE = 12;

// const DesptopSearchPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, userData } = useAuth();
//   const { favorites, addFavorite, removeFavorite } = useFavorites();

//   const [profiles, setProfiles] = useState([]);
//   const [totalCount, setTotalCount] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [keywordsFocused, setKeywordsFocused] = useState(false);

//   const [filters, setFilters] = useState({
//     businessName: "",
//     keywords: "",
//     userType: "",
//     membership: "",
//     sortBy: "newest",
//     verifiedOnly: false,
//   });

//   const [showEnquiryModal, setShowEnquiryModal] = useState(false);
//   const [selectedProfile, setSelectedProfile] = useState(null);
//   const [showFavoriteModal, setShowFavoriteModal] = useState(false);
//   const [selectedFavoriteItem, setSelectedFavoriteItem] = useState(null);

//   // 1. Read URL params and update filters
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);

//     const query = params.get("query") || "";
//     const keywords = params.get("keywords") || "";
//     const userType = params.get("userType") || "";

//     setFilters((prev) => ({
//       ...prev,
//       businessName: query,
//       keywords: keywords,
//       userType: userType,
//     }));

//     setCurrentPage(1);
//   }, [location.search]);


//   // 2. Fetch profiles – now depends on location.search too!
//   const fetchProfiles = useCallback(async () => {
//     setLoading(true);

//     const from = (currentPage - 1) * ITEMS_PER_PAGE;
//     const to = from + ITEMS_PER_PAGE - 1;

//     let query = supabase
//       .from("profiles")
//       .select("*", { count: "exact" })
//       .range(from, to)
//       .order("priority", { ascending: false, nullsLast: true })
//       .order("subscription", { ascending: false })
//       .order("created_at", { ascending: false });

//     // Apply filters
//     // ✅ STRONG keyword filtering
//     if (filters.keywords.trim()) {
//       const terms = filters.keywords
//         .split(",")
//         .map((k) => k.trim())
//         .filter(Boolean);

//       const orConditions = terms
//         .map((t) => `keywords.ilike.%${t}%`)
//         .join(",");

//       query = query.or(orConditions);
//     }


//     if (filters.businessName?.trim()) {
//       const term = filters.businessName.trim();
//       query = query.or(
//         `business_name.ilike.%${term}%,person_name.ilike.%${term}%`
//       );
//     }

//     if (filters.userType) {
//       query = query.eq("user_type", filters.userType);
//     }

//     if (filters.membership === "gold") {
//       query = query.eq("subscription", "gold");
//     } else if (filters.membership === "business") {
//       query = query
//         .neq("subscription", "gold")
//         .not("subscription", "in", "(free,null)");
//     } else if (filters.membership === "free") {
//       query = query.or("subscription.eq.free,subscription.is.null");
//     }

//     if (filters.verifiedOnly) {
//       query = query.not("mobile_number", "is", null);
//     }

//     const { data, error, count } = await query;

//     if (error) {
//       console.error("Supabase error:", error);
//       Swal.fire("Error", "Failed to load listings", "error");
//     } else {
//       setProfiles(data || []);
//       setTotalCount(count || 0);
//     }

//     setLoading(false);
//   }, [currentPage, filters, location.search]); // ← IMPORTANT: added location.search

//   // Re-fetch when filters or URL change
//   useEffect(() => {
//     fetchProfiles();
//   }, [fetchProfiles]);

//   const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

//   // ─── HELPERS ───────────────────────────────────────────────────────────
//   const truncateName = (name, maxWords = 2) => {
//     if (!name) return "";
//     const words = name.trim().split(/\s+/);
//     return words.length > maxWords ? words.slice(0, maxWords).join(" ") + "..." : name;
//   };

//   const maskMobile = (number) =>
//     number && number.length >= 5 ? number.slice(0, 5) + "xxxxx" : "XXXXX";

//   const parseKeywords = (keywords) =>
//     typeof keywords === "string"
//       ? keywords.split(",").map((k) => k.trim()).filter(Boolean)
//       : Array.isArray(keywords)
//         ? keywords
//         : [];

//   const resetFilters = () => {
//     setFilters({
//       businessName: "",
//       keywords: "",
//       userType: "",
//       membership: "",
//       sortBy: "newest",
//       verifiedOnly: false,
//     });
//     setCurrentPage(1);
//     navigate("/directory"); // Optional: clear URL too
//   };

//   const handleEnquiry = (profile) => {
//     if (!user) {
//       Swal.fire("Login Required", "Please log in to send enquiry", "info").then(() =>
//         navigate("/login")
//       );
//       return;
//     }
//     setSelectedProfile(profile);
//     setShowEnquiryModal(true);
//   };

//   const toggleFavorite = (e, item) => {
//     e.stopPropagation();
//     const isFav = favorites.some((f) => f.id === item.id);
//     if (isFav) {
//       removeFavorite(item.id);
//     } else {
//       setSelectedFavoriteItem(item);
//       setShowFavoriteModal(true);
//     }
//   };

//   const handleCardClick = (item) => (e) => {
//     if (e.target.closest("button")) return;
//     if (userData) {
//       navigate(`/more/${item.id}`);
//     } else {
//       Swal.fire("Login Required", "Please log in to view full profile", "info").then(() =>
//         navigate("/login")
//       );
//     }
//   };

//   const getMembershipTier = (item) => {
//     if (item.subscription === "gold") return "gold";
//     if (item.subscription && item.subscription !== "free") return "business";
//     return "free";
//   };

//   const getBorderClass = (item) => {
//     const tier = getMembershipTier(item);
//     if (tier === "gold") return "gold-border";
//     if (tier === "business") return "pink-border";
//     return "black-border";
//   };

//   // ─── RENDER ────────────────────────────────────────────────────────────
//   return (
//     <div className="directory-page-container">
//       <main className={keywordsFocused ? "keywords-focused" : ""}>
//         <div className="top-search-section">
//           <div className="dual-search-bar">
//             <Form.Group className="search-input-group">
//               <Form.Label>Firms / Persons</Form.Label>
//               <div className="search-wrapper">
//                 <FaSearch className="search-icon" />
//                 <Form.Control
//                   value={filters.businessName}
//                   placeholder="Search by Firms/Persons"
//                   onChange={(e) => {
//                     setFilters({ ...filters, businessName: e.target.value });
//                     setCurrentPage(1);
//                   }}
//                 />
//               </div>
//             </Form.Group>

//             <Form.Group className="search-input-group">
//               <Form.Label>Products / Services</Form.Label>
//               <div className="search-wrapper">
//                 <FaSearch className="search-icon" />
//                 <Form.Control
//                   value={filters.keywords}
//                   placeholder="Search by products, keywords..."
//                   onChange={(e) => {
//                     setFilters({ ...filters, keywords: e.target.value });
//                     setCurrentPage(1);
//                   }}
//                   onFocus={() => setKeywordsFocused(true)}
//                   onBlur={() => setTimeout(() => setKeywordsFocused(false), 200)}
//                 />
//               </div>
//             </Form.Group>
//           </div>

//           <div className="filters-row">
//             <div className="filter-icon-wrapper">
//               <FaSlidersH className="filter-icon" />
//             </div>

//             <select
//               value={filters.sortBy}
//               onChange={(e) => {
//                 setFilters({ ...filters, sortBy: e.target.value });
//                 setCurrentPage(1);
//               }}
//             >
//               <option value="newest">Newest First</option>
//               <option value="oldest">Oldest First</option>
//             </select>

//             <select
//               value={filters.userType}
//               onChange={(e) => {
//                 setFilters({ ...filters, userType: e.target.value });
//                 setCurrentPage(1);
//               }}
//             >
//               <option value="">All Types</option>
//               <option value="B2C">B2C</option>
//               <option value="B2B">B2B</option>
//             </select>

//             <select
//               value={filters.membership}
//               onChange={(e) => {
//                 setFilters({ ...filters, membership: e.target.value });
//                 setCurrentPage(1);
//               }}
//             >
//               <option value="">All Members</option>
//               <option value="gold">Gold Members (Prime)</option>
//               <option value="business">Business Members</option>
//               <option value="free">Free Members</option>
//             </select>

//             <button
//               className={filters.verifiedOnly ? "active" : ""}
//               onClick={() => {
//                 setFilters({ ...filters, verifiedOnly: !filters.verifiedOnly });
//                 setCurrentPage(1);
//               }}
//             >
//               Verified Only
//             </button>

//             <button onClick={resetFilters} className="btn-reset">
//               Reset Filters
//             </button>
//           </div>

//           <div className="results-header">
//             <h2>{totalCount} Results Found</h2>
//             {(filters.businessName || filters.keywords || filters.userType || filters.membership) && (
//               <p className="search-term">
//                 Showing results for:{" "}
//                 <strong>
//                   {filters.businessName && `"${filters.businessName}"`}
//                   {filters.keywords && ` "${filters.keywords}"`}
//                   {filters.userType && ` (${filters.userType})`}
//                   {filters.membership && ` ${filters.membership}`}
//                 </strong>
//               </p>
//             )}
//           </div>
//         </div>

//         {loading ? (
//           <div className="skeleton-grid">
//             {[...Array(12)].map((_, i) => (
//               <div key={i} className="skeleton-card">
//                 <div className="skeleton-img"></div>
//                 <div className="skeleton-lines">
//                   <div className="skeleton-line long"></div>
//                   <div className="skeleton-line medium"></div>
//                   <div className="skeleton-line short"></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : profiles.length === 0 ? (
//           <div className="no-results">
//             <p>No businesses found matching your criteria.</p>
//             <Button variant="primary" onClick={() => navigate("/")}>
//               Browse All Categories
//             </Button>
//           </div>
//         ) : (
//           <>
//             <div className="profiles-grid">
//               {profiles.map((item) => {
//                 const borderClass = getBorderClass(item);
//                 const displayName = item.business_name || item.person_name || "Untitled";
//                 const keywordsList = parseKeywords(item.keywords);
//                 const isFavorite = favorites.some((f) => f.id === item.id);
//                 const hasMobile = !!item.mobile_number;

//                 return (
//                   <div
//                     key={item.id}
//                     className={`profile-card ${borderClass}`}
//                     onClick={handleCardClick(item)}
//                   >
//                     <div className="profile-info">
//                       <div className="profile-name">
//                         <span className="name-text">{displayName}</span>
//                         {item.mobile_number && <MdVerified className="verified-icon" />}
//                       </div>

//                       <p className="profile-location">
//                         {keywordsFocused
//                           ? keywordsList.slice(0, 3).join(" • ") || "No products"
//                           : `${item.city || ""} ${item.pincode ? "- " + item.pincode : ""}`}
//                       </p>

//                       {hasMobile && (
//                         <div className="phone-display-desktop">
//                           {maskMobile(item.mobile_number)}
//                         </div>
//                       )}
//                     </div>

//                     <div className="profile-actions">
//                       <button
//                         className="btn-enquire-call"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           if (hasMobile) window.location.href = `tel:${item.mobile_number}`;
//                           else Swal.fire("Unavailable", "Mobile number not provided", "info");
//                         }}
//                       >
//                         Call
//                       </button>
//                       <button
//                         className="btn-enquire"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleEnquiry(item);
//                         }}
//                       >
//                         Enquire Now
//                       </button>
//                       <button
//                         className="btn-favorite"
//                         onClick={(e) => toggleFavorite(e, item)}
//                       >
//                         {isFavorite ? <FaHeart color="#dc3545" size={20} /> : <FaRegHeart size={20} />}
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Mobile view */}
//             <div className="mobile-profiles-list">
//               {profiles.map((item) => {
//                 const borderClass = getBorderClass(item);
//                 const displayName = item.business_name || item.person_name || "Untitled";
//                 const keywordsList = parseKeywords(item.keywords);
//                 const isFavorite = favorites.some((f) => f.id === item.id);
//                 const hasMobile = !!item.mobile_number;

//                 return (
//                   <div
//                     key={item.id}
//                     className={`mobile-profile-card ${borderClass}`}
//                     onClick={handleCardClick(item)}
//                   >
//                     <button
//                       className="favorite-btn"
//                       onClick={(e) => toggleFavorite(e, item)}
//                     >
//                       {isFavorite ? <FaHeart color="#d61427ff" size={22} /> : <FaRegHeart size={22} />}
//                     </button>

//                     {hasMobile && (
//                       <button
//                         className="call-btn-mobile"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           window.location.href = `tel:${item.mobile_number}`;
//                         }}
//                       >
//                         <FaPhoneAlt size={20} />
//                       </button>
//                     )}

//                     <h5 className="profile-name">
//                       <span className="name-text">{truncateName(displayName, 2)}</span>
//                     </h5>

//                     <p className="profile-location">
//                       {keywordsFocused
//                         ? keywordsList.slice(0, 3).join(" • ") || "No products"
//                         : `${item.city || ""} ${item.pincode ? "- " + item.pincode : ""}`}
//                     </p>

//                     <div className="mobile-actions-row">
//                       <div className="phone-row-placeholder">
//                         {maskMobile(item.mobile_number)}
//                       </div>
//                       <button
//                         className="Mobile-enquire-btn"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleEnquiry(item);
//                         }}
//                       >
//                         Enquire
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {totalPages > 1 && (
//               <div className="pagination">
//                 <button
//                   onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                   disabled={currentPage === 1}
//                 >
//                   Previous
//                 </button>
//                 <span>Page {currentPage} of {totalPages}</span>
//                 <button
//                   onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//                   disabled={currentPage === totalPages}
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </main>

//       <RecentlyListEnquiryModal
//         show={showEnquiryModal}
//         onClose={() => setShowEnquiryModal(false)}
//         selectedBusiness={selectedProfile}
//       />

//       <FavoriteModal
//         show={showFavoriteModal}
//         onClose={() => setShowFavoriteModal(false)}
//         onSave={(category) => {
//           addFavorite({ ...selectedFavoriteItem, category });
//           setShowFavoriteModal(false);
//         }}
//         selectedItem={selectedFavoriteItem}
//       />
//     </div>
//   );
// };

// export default DesptopSearchPage;
// DesptopSearchPage.jsx


// DesptopSearchPage.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import "../Desktop_view/Desktop_css/DesptopSearchPage.css";
import { FaHeart, FaRegHeart, FaPhoneAlt, FaSlidersH } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import Swal from "sweetalert2";
import RecentlyListEnquiryModal from "../Desktop_view/components/RecentlyListEnquiryModal";
import FavoriteModal from "../Desktop_view/FavoriteModal";

const DesptopSearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Search inputs
  const [businessSearch, setBusinessSearch] = useState("");
  const [personSearch, setPersonSearch] = useState("");

  // Active keyword from URL (for display only)
  const [activeKeyword, setActiveKeyword] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 12;

  const [filters, setFilters] = useState({
    sortBy: "newest",
    userType: "",
    membership: "",
    verifiedOnly: false,
  });

  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const [showFavoriteModal, setShowFavoriteModal] = useState(false);
  const [favoriteItem, setFavoriteItem] = useState(null);

  // Sync activeKeyword from URL (only for display chip)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlKeyword = params.get("keywords") || "";
    setActiveKeyword(urlKeyword.trim());
    setPage(1); // Reset pagination when URL keyword changes
  }, [location.search]);

  // Fetch results
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);

      const params = new URLSearchParams(location.search);
      const urlKeyword = params.get("keywords") || "";
      const urlLocation = params.get("location") || "";

      let query = supabase
        .from("profiles")
        .select("*", { count: "exact" });

      // Collect all search terms
      const searchTerms = [
        urlKeyword,          // directly from URL
        businessSearch,
        personSearch,
        urlLocation,
      ]
        .map((t) => t.trim())
        .filter(Boolean);

      // Apply OR search across multiple fields
      if (searchTerms.length > 0) {
        const orConditions = searchTerms
          .map(
            (term) =>
              `keywords.ilike.%${term}%,business_name.ilike.%${term}%,person_name.ilike.%${term}%`
          )
          .join(",");
        query = query.or(orConditions);
      }

      // Apply filters
      if (filters.userType === "business") {
        query = query.eq("user_type", "business");
      } else if (filters.userType === "person") {
        query = query.eq("user_type", "person");
      }

      if (filters.membership) {
        query = query.eq("subscription", filters.membership);
      }

      if (filters.verifiedOnly) {
        query = query.not("mobile_number", "is", null);
      }

      // Sorting
      query = query.order("created_at", {
        ascending: filters.sortBy === "oldest",
      });

      // Pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error("Supabase error:", error);
        Swal.fire("Error", "Failed to load results", "error");
        setResults([]);
        setTotalCount(0);
      } else {
        setResults(data || []);
        setTotalCount(count || 0);
      }

      setLoading(false);
    };

    fetchResults();
  }, [
    location.search,    // URL change triggers refetch
    businessSearch,
    personSearch,
    filters,
    page,
    // IMPORTANT: activeKeyword is NOT here anymore → fixes the flashing/reset
  ]);

  // Reset Filters
  const resetFilters = () => {
    setFilters({
      sortBy: "newest",
      userType: "",
      membership: "",
      verifiedOnly: false,
    });
    setPage(1);
  };

  // Remove active keyword from URL
  const removeActiveKeyword = () => {
    setActiveKeyword("");
    setPage(1);

    const params = new URLSearchParams(location.search);
    params.delete("keywords");

    navigate(
      { pathname: location.pathname, search: params.toString() },
      { replace: true }
    );
  };

  const totalPages = Math.ceil(totalCount / pageSize);
  const handlePrevPage = () => setPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setPage((p) => Math.min(p + 1, totalPages));

  const maskMobile = (number) => {
    if (!number || number.length < 5) return "XXXXX";
    return number.slice(0, 5) + "xxxxx";
  };

  const handleCardClick = (profile) => {
    navigate(`/profile/${profile.id}`, { state: { profile } });
  };

  const handleEnquire = (profile) => {
    setSelectedBusiness(profile);
    setShowEnquiryModal(true);
  };

  const handleFavorite = (profile) => {
    setFavoriteItem({
      businessName: profile.business_name || profile.person_name || "Unnamed",
      mobile: profile.mobile_number,
    });
    setShowFavoriteModal(true);
  };

  const getBorderClass = (item) => {
    if (item.subscription === "gold") return "gold-border";
    if (item.subscription && item.subscription !== "free") return "pink-border";
    return "black-border";
  };

  return (
    <div className="desktop-search-page">
      {/* SEARCH BARS */}
      <div className="search-row">
        <input
          placeholder="Search Person / Business"
          value={personSearch}
          onChange={(e) => setPersonSearch(e.target.value)}
        />

        <input
          placeholder="Search Keywords / Business"
          value={businessSearch}
          onChange={(e) => setBusinessSearch(e.target.value)}
        />
      </div>

      {/* FILTERS ROW */}
      <div className="filters-row">
        <div className="filter-icon-wrapper">
          <FaSlidersH className="filter-icon" />
        </div>

        <select
          value={filters.sortBy}
          onChange={(e) => {
            setFilters({ ...filters, sortBy: e.target.value });
            setPage(1);
          }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>

        <select
          value={filters.userType}
          onChange={(e) => {
            setFilters({ ...filters, userType: e.target.value });
            setPage(1);
          }}
        >
          <option value="">All Types</option>
          <option value="business">Business Only</option>
          <option value="person">Person Only</option>
        </select>

        <select
          value={filters.membership}
          onChange={(e) => {
            setFilters({ ...filters, membership: e.target.value });
            setPage(1);
          }}
        >
          <option value="">All Members</option>
          <option value="gold">Prime Members</option>
          <option value="business">Business Members</option>
          <option value="free">Free Members</option>
        </select>

        <button
          className={filters.verifiedOnly ? "active" : ""}
          onClick={() => {
            setFilters({ ...filters, verifiedOnly: !filters.verifiedOnly });
            setPage(1);
          }}
        >
          Verified Only
        </button>

        <button onClick={resetFilters} className="btn-reset">
          Reset Filters
        </button>
      </div>

      {/* SHOW ACTIVE KEYWORD FROM POPULAR CATEGORY */}
      {activeKeyword && (
        <div className="active-keyword">
          <span>
            Showing results for: <strong>{activeKeyword}</strong>
          </span>
          <button onClick={removeActiveKeyword}>×</button>
        </div>
      )}

      {/* RESULTS COUNT */}
      {!loading && (
        <h2 className="results-header">
          {totalCount.toLocaleString()} Results Found
        </h2>
      )}

      {/* RESULTS GRID */}
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : results.length === 0 ? (
        <p className="no-results">
          {businessSearch || personSearch || activeKeyword
            ? "No results found for your search"
            : "Showing all registered businesses and profiles"}
        </p>
      ) : (
        <>
          <div className="results-grid">
            {results.map((item) => {
              const hasMobile = Boolean(item.mobile_number);
              const isVerified = hasMobile;

              return (
                <div
                  key={item.id}
                  className={`profile-card ${getBorderClass(item)}`}
                  onClick={() => handleCardClick(item)}
                  style={{ cursor: "pointer" }}
                >
                  <h4 className="profile-title">
                    <span className="name-text">
                      {item.business_name || item.person_name || "Unnamed"}
                    </span>
                    {isVerified && <MdVerified className="verified-inline" />}
                  </h4>

                  <div className="location-info">
                    {item.city || "Unknown City"}
                    {item.pincode ? ` - ${item.pincode}` : ""}
                  </div>

                  {hasMobile && (
                    <div className="phone-number">
                      {maskMobile(item.mobile_number)}
                    </div>
                  )}

                  <div className="card-buttons">
                    <button
                      type="button"
                      className="call-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `tel:${item.mobile_number}`;
                      }}
                    >
                      <FaPhoneAlt />
                      Call
                    </button>

                    <button
                      type="button"
                      className="enquire-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEnquire(item);
                      }}
                    >
                      Enquire Now
                    </button>

                    <button
                      type="button"
                      className="fav-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavorite(item);
                      }}
                    >
                      <FaRegHeart size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={handlePrevPage} disabled={page === 1}>
                Previous
              </button>
              <span>
                Page {page} of {totalPages.toLocaleString()}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <RecentlyListEnquiryModal
        show={showEnquiryModal}
        onClose={() => setShowEnquiryModal(false)}
        selectedBusiness={selectedBusiness}
      />

      <FavoriteModal
        isOpen={showFavoriteModal}
        onClose={() => {
          setShowFavoriteModal(false);
          setFavoriteItem(null);
        }}
        businessName={favoriteItem?.businessName || ""}
        mobile={favoriteItem?.mobile || ""}
        onSuccess={(groupName) => {
          Swal.fire({
            title: "Saved!",
            text: `${favoriteItem?.businessName} added to ${groupName}`,
            icon: "success",
            timer: 2200,
            showConfirmButton: false,
          });
        }}
      />
    </div>
  );
};

export default DesptopSearchPage;





























// import { useEffect, useState, useCallback } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { supabase } from "../../services/supabaseClient";
// import { useAuth } from "../../context/AuthContext";
// import { useFavorites } from "../../context/FavoritesContext";
// import Swal from "sweetalert2";
// import FavoriteModal from "../Desktop_view/components/FavoriteModal";
// import RecentlyListEnquiryModal from "../Desktop_view/components/RecentlyListEnquiryModal";

// import { FaHeart, FaRegHeart, FaSearch, FaPhoneAlt, FaSlidersH } from "react-icons/fa";
// import { MdVerified } from "react-icons/md";
// import { Button, Form } from "react-bootstrap";

// import "../Desktop_view/Desktop_css/DesptopSearchPage.css";

// const ITEMS_PER_PAGE = 12;

// // 🔁 UI → DB mapping
// const mapUserTypeToDB = (value) => {
//   if (value === "B2C") return "person";
//   if (value === "B2B") return "business";
//   return "";
// };

// const DesptopSearchPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, userData } = useAuth();
//   const { favorites, addFavorite, removeFavorite } = useFavorites();

//   const [profiles, setProfiles] = useState([]);
//   const [totalCount, setTotalCount] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [keywordsFocused, setKeywordsFocused] = useState(false);

//   const [filters, setFilters] = useState({
//     businessName: "",
//     keywords: "",
//     userType: "",
//     membership: "",
//     verifiedOnly: false,
//   });

//   const [showEnquiryModal, setShowEnquiryModal] = useState(false);
//   const [selectedProfile, setSelectedProfile] = useState(null);
//   const [showFavoriteModal, setShowFavoriteModal] = useState(false);
//   const [selectedFavoriteItem, setSelectedFavoriteItem] = useState(null);

//   // ─── READ URL PARAMS ───────────────────────────────────────────
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);

//     setFilters((prev) => ({
//       ...prev,
//       businessName: params.get("query") || "",
//       keywords: params.get("keywords") || "",
//       userType: params.get("userType") || "",
//     }));

//     setCurrentPage(1);
//   }, [location.search]);

//   // ─── FETCH DATA ────────────────────────────────────────────────
//   const fetchProfiles = useCallback(async () => {
//     setLoading(true);

//     const from = (currentPage - 1) * ITEMS_PER_PAGE;
//     const to = from + ITEMS_PER_PAGE - 1;

//     let query = supabase
//       .from("profiles")
//       .select("*", { count: "exact" })
//       .range(from, to)
//       .order("priority", { ascending: false })
//       .order("created_at", { ascending: false });

//     // 🔍 KEYWORD SEARCH (broad + NULL safe)
//     if (filters.keywords.trim()) {
//       const term = filters.keywords.trim();
//       query = query.or(`
//         keywords.ilike.%${term}%,
//         business_name.ilike.%${term}%,
//         person_name.ilike.%${term}%,
//         description.ilike.%${term}%,
//         activity.ilike.%${term}%
//       `);
//     }

//     // 🔍 NAME SEARCH
//     if (filters.businessName.trim()) {
//       const term = filters.businessName.trim();
//       query = query.or(`
//         business_name.ilike.%${term}%,
//         person_name.ilike.%${term}%
//       `);
//     }

//     // 🔁 USER TYPE (mapped)
//     const dbUserType = mapUserTypeToDB(filters.userType);
//     if (dbUserType) {
//       query = query.eq("user_type", dbUserType);
//     }

//     // 🔐 VERIFIED
//     if (filters.verifiedOnly) {
//       query = query.not("mobile_number", "is", null);
//     }

//     const { data, error, count } = await query;

//     if (error) {
//       console.error(error);
//       Swal.fire("Error", "Failed to load results", "error");
//     } else {
//       setProfiles(data || []);
//       setTotalCount(count || 0);
//     }

//     setLoading(false);
//   }, [filters, currentPage]);

//   useEffect(() => {
//     fetchProfiles();
//   }, [fetchProfiles]);

//   const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

//   // ─── HELPERS ───────────────────────────────────────────────────
//   const parseKeywords = (keywords) =>
//     typeof keywords === "string"
//       ? keywords.split(",").map((k) => k.trim()).filter(Boolean)
//       : [];

//   const maskMobile = (number) =>
//     number ? number.slice(0, 5) + "xxxxx" : "XXXXX";

//   const handleCardClick = (item) => () => {
//     if (!userData) {
//       Swal.fire("Login Required", "Please log in", "info").then(() =>
//         navigate("/login")
//       );
//       return;
//     }
//     navigate(`/more/${item.id}`);
//   };

//   // ─── RENDER ────────────────────────────────────────────────────
//   return (
//     <div className="directory-page-container">
//       <main>
//         <div className="top-search-section">

//           {/* SEARCH BARS */}
//           <div className="dual-search-bar">
//             <Form.Group>
//               <Form.Label>Firms / Persons</Form.Label>
//               <Form.Control
//                 value={filters.businessName}
//                 onChange={(e) =>
//                   setFilters({ ...filters, businessName: e.target.value })
//                 }
//               />
//             </Form.Group>

//             <Form.Group>
//               <Form.Label>Products / Services</Form.Label>
//               <Form.Control
//                 value={filters.keywords}
//                 onChange={(e) =>
//                   setFilters({ ...filters, keywords: e.target.value })
//                 }
//                 onFocus={() => setKeywordsFocused(true)}
//                 onBlur={() => setKeywordsFocused(false)}
//               />
//             </Form.Group>
//           </div>

//           {/* FILTERS */}
//           <div className="filters-row">
//             <select
//               value={filters.userType}
//               onChange={(e) =>
//                 setFilters({ ...filters, userType: e.target.value })
//               }
//             >
//               <option value="">All</option>
//               <option value="B2C">B2C (Person)</option>
//               <option value="B2B">B2B (Business)</option>
//             </select>

//             <button
//               className={filters.verifiedOnly ? "active" : ""}
//               onClick={() =>
//                 setFilters({ ...filters, verifiedOnly: !filters.verifiedOnly })
//               }
//             >
//               Verified Only
//             </button>
//           </div>

//           <h4>{totalCount} Results Found</h4>
//         </div>

//         {loading ? (
//           <p>Loading...</p>
//         ) : profiles.length === 0 ? (
//           <div className="no-results">
//             <p>No results found</p>
//             <Button onClick={() => navigate("/")}>Browse Categories</Button>
//           </div>
//         ) : (
//           <div className="profiles-grid">
//             {profiles.map((item) => (
//               <div
//                 key={item.id}
//                 className="profile-card"
//                 onClick={handleCardClick(item)}
//               >
//                 <h5>{item.business_name || item.person_name}</h5>
//                 <p>
//                   {keywordsFocused
//                     ? parseKeywords(item.keywords).slice(0, 3).join(" • ")
//                     : `${item.city || ""} ${item.pincode || ""}`}
//                 </p>
//                 <div>{maskMobile(item.mobile_number)}</div>
//               </div>
//             ))}
//           </div>
//         )}

//         {totalPages > 1 && (
//           <div className="pagination">
//             <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
//               Prev
//             </button>
//             <span>{currentPage} / {totalPages}</span>
//             <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
//               Next
//             </button>
//           </div>
//         )}
//       </main>

//       <RecentlyListEnquiryModal
//         show={showEnquiryModal}
//         onClose={() => setShowEnquiryModal(false)}
//         selectedBusiness={selectedProfile}
//       />

//       <FavoriteModal
//         show={showFavoriteModal}
//         onClose={() => setShowFavoriteModal(false)}
//         onSave={(category) => {
//           addFavorite({ ...selectedFavoriteItem, category });
//           setShowFavoriteModal(false);
//         }}
//         selectedItem={selectedFavoriteItem}
//       />
//     </div>
//   );
// };

// export default DesptopSearchPage;





















