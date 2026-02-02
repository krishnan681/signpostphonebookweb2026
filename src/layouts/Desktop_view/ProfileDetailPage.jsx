// import { useEffect, useState, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { supabase } from "../../services/supabaseClient";
// import "./Desktop_css/ProfileDetailPage.css";
// import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
// import { MdVerified } from "react-icons/md";
// import FavoriteModal from "../Desktop_view/FavoriteModal";

// const ProfileDetailPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const profile = location.state?.profile;

//   const [images, setImages] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const [priorityProducts, setPriorityProducts] = useState([]);
//   const [secondaryProducts, setSecondaryProducts] = useState([]);
//   const [loadingProducts, setLoadingProducts] = useState(false);

//   const [activeTab, setActiveTab] = useState("about");
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [showFavoriteModal, setShowFavoriteModal] = useState(false);

//   // Rating state
//   const [userRating, setUserRating] = useState(0);
//   const [hoverRating, setHoverRating] = useState(0);

//   // Enquiry form state + validation
//   const [formData, setFormData] = useState({ name: "", mobile: "" });
//   const [formErrors, setFormErrors] = useState({ name: "", mobile: "" });

//   const autoScrollRef = useRef(null);

//   if (!profile) {
//     navigate(-1);
//     return null;
//   }

//   const profileId = profile.id;
//   const subscription = (profile.subscription || "").toLowerCase();
//   const isPrime = profile.is_prime === true;

//   const tier =
//     isPrime || subscription === "gold"
//       ? "gold"
//       : subscription === "business"
//         ? "business"
//         : subscription === "normal_business"
//           ? "normal_business"
//           : "free";

//   const displayName =
//     profile.business_name ||
//     `${profile.person_prefix || ""} ${profile.person_name || ""}`.trim() ||
//     "User";

//   // Dynamic enquiry card content
//   const getEnquiryContent = () => {
//     const category = (profile.category || "").toLowerCase();

//     if (category.includes("salon") || category.includes("hair") || category.includes("beauty") || category.includes("barber")) {
//       return {
//         title: "Get the List of Top <span>Hair Cut Services</span>",
//         sub: "We'll send you contact details in seconds for free",
//         question: "How much do you want to keep your Hair?",
//         options: ["Long", "Short", "Medium", "Any Style"],
//       };
//     }

//     if (category.includes("engineering") || category.includes("fabrication") || category.includes("steel") || category.includes("construction") || category.includes("civil") || category.includes("mechanical")) {
//       return {
//         title: "Get the List of Top <span>Steel Fabrication / Engineering Services</span>",
//         sub: "We'll send you quotes and contact details in seconds for free",
//         question: "What type of engineering service do you need?",
//         options: ["Steel Fabrication", "Structural Design", "Machinery Installation", "Industrial Sheds"],
//       };
//     }

//     if (category.includes("laundry") || category.includes("washing") || category.includes("dry cleaning")) {
//       return {
//         title: "Get the List of Top <span>Laundry Equipment Suppliers</span>",
//         sub: "We'll send you contact details in seconds for free",
//         question: "What type of laundry equipment are you looking for?",
//         options: ["Washing Machine", "Dry Cleaning", "Tumble Dryer", "Ironing Equipment"],
//       };
//     }

//     return {
//       title: `Connect with <span>${displayName}</span>`,
//       sub: "Get in touch directly or send an enquiry instantly",
//       question: "How can we assist you today?",
//       options: ["General Enquiry", "Get Quote", "Schedule Meeting"],
//     };
//   };

//   const enquiry = getEnquiryContent();

//   /* ------------------ INITIAL LOAD ------------------ */
//   useEffect(() => {
//     if (!profileId) return;

//     if (tier === "free") {
//       loadFreeTierImages();
//     } else {
//       loadCoverPhoto();
//     }

//     loadProducts();

//     return () => clearInterval(autoScrollRef.current);
//   }, [profileId]);

//   /* ------------------ FREE TIER AUTO SCROLL ------------------ */
//   useEffect(() => {
//     if (tier !== "free" || images.length === 0) return;

//     autoScrollRef.current = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % images.length);
//     }, 4000);

//     return () => clearInterval(autoScrollRef.current);
//   }, [images, tier]);

//   /* ------------------ DATA LOADERS ------------------ */
// const loadFreeTierImages = async () => {
//   const { data } = await supabase
//     .from("free_tier_shared_header_images")
//     .select("image_url")
//     .order("sort_order", { ascending: true });

//   if (data?.length) {
//     setImages(data.map((i) => i.image_url));
//   }
// };

// const loadCoverPhoto = async () => {
//   const { data } = await supabase
//     .from("users_table")
//     .select("cover_photo")
//     .eq("user_id", profileId)
//     .maybeSingle();

//   if (data?.cover_photo) {
//     setImages([data.cover_photo]);
//   }
// };

// const loadProducts = async () => {
//   setLoadingProducts(true);

//   const { data: descRows } = await supabase
//     .from("product_des_table")
//     .select("prod_des_id, product_desc")
//     .eq("userId", profileId);

//   if (!descRows?.length) {
//     setLoadingProducts(false);
//     return;
//   }

//   const ids = descRows.map((r) => r.prod_des_id);
//   const descMap = {};
//   descRows.forEach((r) => {
//     descMap[r.prod_des_id] = r.product_desc;
//   });

//   const { data: prodRows } = await supabase
//     .from("product_table")
//     .select("product_id, prod_des_id, product_name, product_image, product_description, price")
//     .in("prod_des_id", ids);

//   const priority = [];
//   const secondary = [];

//   prodRows?.forEach((p) => {
//     const product = {
//       id: p.product_id,
//       name: p.product_name,
//       image: p.product_image,
//       description: p.product_description,
//       price: p.price,
//     };

//     if (descMap[p.prod_des_id] === "priority") {
//       priority.push(product);
//     } else {
//       secondary.push(product);
//     }
//   });

//   setPriorityProducts(priority);
//   setSecondaryProducts(secondary);
//   setLoadingProducts(false);
// };

//   /* ------------------ HELPERS ------------------ */
//   const formatMobile = (n) =>
//     n?.length >= 5 ? `${n.slice(0, 5)} XXXXX` : n || "Not available";

//   /* ------------------ FORM HANDLERS ------------------ */
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setFormErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const validateForm = () => {
//     let errors = { name: "", mobile: "" };
//     let isValid = true;

//     if (!formData.name.trim()) {
//       errors.name = "Name is required";
//       isValid = false;
//     }

//     if (!formData.mobile.trim()) {
//       errors.mobile = "Mobile number is required";
//       isValid = false;
//     } else if (!/^\d{10}$/.test(formData.mobile.trim())) {
//       errors.mobile = "Enter a valid 10-digit mobile number";
//       isValid = false;
//     }

//     setFormErrors(errors);
//     return isValid;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       // Here you can send data to Supabase or backend
//       alert("Enquiry submitted successfully!");
//       setFormData({ name: "", mobile: "" });
//     }
//   };

//   /* ------------------ FAVORITE HANDLERS ------------------ */
//   const handleFavoriteClick = () => {
//     setShowFavoriteModal(true);
//   };

//   const handleConfirmFavorite = () => {
//     setIsFavorite(true);
//     setShowFavoriteModal(false);
//     // Optional: Save to Supabase favorites table here
//   };

//   /* ------------------ UI ------------------ */
//   return (
//     <div className="profile-detail-page">
//       {/* HEADER */}
//       <div className="header">
//         {images.length > 0 ? (
//           <img src={images[currentIndex]} alt="Cover" className="cover-img" />
//         ) : (
//           <div className="no-image" />
//         )}
//       </div>

//       {/* CONTENT */}
//       <div className="content-layout">
//         {/* LEFT PANEL */}
//         <div className="left-panel">
//           {/* Favorite Button */}
//           <button className="favorite-btn" onClick={() => setShowFavoriteModal(true)}>
//             {isFavorite ? <FaHeart /> : <FaRegHeart />}
//           </button>

//           <div className="profile-info">
//             <h2 className="profile-name">
//               {displayName}
//               {profile.is_verified && <MdVerified className="verified-icon" />}
//             </h2>

//             {profile.keywords && <p className="keywords">{profile.keywords}</p>}

//             <div className="contact-row">
//               <div className="contact-actions">
//                 {profile.mobile_number && (
//                   <a href={`tel:${profile.mobile_number}`} className="contact-btn call" data-tooltip="Call">
//                     <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1408 1408"><path fill="currentColor" d="M1408 1112q0 27-10 70.5t-21 68.5q-21 50-122 106q-94 51-186 51q-27 0-53-3.5t-57.5-12.5t-47-14.5T856 1357t-49-18q-98-35-175-83q-127-79-264-216T152 776q-48-77-83-175q-3-9-18-49t-20.5-55.5t-14.5-47T3.5 392T0 339q0-92 51-186Q107 52 157 31q25-11 68.5-21T296 0q14 0 21 3q18 6 53 76q11 19 30 54t35 63.5t31 53.5q3 4 17.5 25t21.5 35.5t7 28.5q0 20-28.5 50t-62 55t-62 53t-28.5 46q0 9 5 22.5t8.5 20.5t14 24t11.5 19q76 137 174 235t235 174q2 1 19 11.5t24 14t20.5 8.5t22.5 5q18 0 46-28.5t53-62t55-62t50-28.5q14 0 28.5 7t35.5 21.5t25 17.5q25 15 53.5 31t63.5 35t54 30q70 35 76 53q3 7 3 21"></path></svg>
//                   </a>
//                 )}
//                 {profile.whats_app && (
//                   <a href={`https://wa.me/${profile.whats_app}`} className="contact-btn whatsapp" data-tooltip="WhatsApp">
//                     <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28" /></svg>
//                   </a>
//                 )}
//                 {profile.email && (
//                   <a href={`mailto:${profile.email}`} className="contact-btn email" data-tooltip="Email">
//                     <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2zm-2 0l-8 5l-8-5zm0 12H4V8l8 5l8-5z" /></svg>
//                   </a>
//                 )}
//                 {profile.landline && (
//                   <a href={`tel:${profile.landline}`} className="contact-btn landline" data-tooltip="Landline">
//                     <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="m15.88 3.86l-.61-1.31a1.21 1.21 0 0 0-.792-.658c-1.938-.528-4.161-.851-6.453-.891a27.5 27.5 0 0 0-6.687.934c-.165.048-.453.29-.605.609L.12 3.861a1.2 1.2 0 0 0-.12.52v.87l-.001.041c0 .392.318.71.71.71l.033-.001H3.26a.76.76 0 0 0 .742-.76L4 5.188v-.85a.65.65 0 0 1 .298-.546a6.9 6.9 0 0 1 3.724-.791a6.97 6.97 0 0 1 3.717.788c.143.099.262.3.262.529v.872a.76.76 0 0 0 .739.81h2.521l.031.001a.71.71 0 0 0 .71-.71l-.001-.043V4.38a1.2 1.2 0 0 0-.123-.527z" /><path fill="currentColor" d="M12 8.3a4.73 4.73 0 0 1-1.001-2.92L11 5.296V5h-1v1H6V5H5v.33l.001.08a4.74 4.74 0 0 1-1.009 2.93L1 12v3h14v-3zM8 13a3 3 0 1 1 0-6a3 3 0 0 1 0 6" /><path fill="currentColor" d="M10 10a2 2 0 1 1-3.999.001A2 2 0 0 1 10 10" /></svg>
//                   </a>
//                 )}
//                 {profile.web_site && (
//                   <a
//                     href={profile.web_site.startsWith("http") ? profile.web_site : `https://${profile.web_site}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="contact-btn website"
//                     data-tooltip="Website"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" /><path fill="currentColor" fill-rule="nonzero" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m1.683 13.95a29 29 0 0 1-3.366 0c.136.786.309 1.494.51 2.098c.252.756.53 1.296.79 1.626c.088.11.223.326.385.326c.145-.013.302-.227.38-.326c.26-.33.539-.87.79-1.626a14.4 14.4 0 0 0 .51-2.098Zm5.83-1.195q-.398.171-.833.315c-.852.284-1.848.512-2.94.67a17 17 0 0 1-.67 2.94q-.144.435-.315.833a8.02 8.02 0 0 0 4.758-4.758m-15.026 0a8.02 8.02 0 0 0 4.758 4.758a11 11 0 0 1-.315-.833a17 17 0 0 1-.67-2.94a17 17 0 0 1-2.94-.67q-.435-.144-.833-.315m5.585-4.683a25.5 25.5 0 0 0 0 3.856c1.282.097 2.574.097 3.856 0a25.5 25.5 0 0 0 0-3.856a25.5 25.5 0 0 0-3.856 0m5.878.245a29 29 0 0 1 0 3.366a14.4 14.4 0 0 0 2.098-.51c.756-.252 1.296-.53 1.626-.79c.11-.087.326-.224.326-.385c-.013-.145-.227-.302-.326-.38c-.33-.26-.87-.539-1.626-.79a14.4 14.4 0 0 0-2.098-.51Zm-7.9 0c-.786.136-1.493.309-2.098.51c-.756.252-1.295.53-1.626.79c-.24.19-.312.333-.323.368c-.045.15.23.323.323.397c.33.26.87.539 1.626.79c.605.202 1.312.375 2.098.51a28 28 0 0 1 0-3.364Zm1.195-5.83a8.02 8.02 0 0 0-4.758 4.758q.398-.171.833-.315a17 17 0 0 1 2.94-.67c.158-1.092.386-2.088.67-2.94q.144-.435.315-.833m5.51 0q.171.399.315.833c.284.852.512 1.848.67 2.94c1.092.158 2.088.386 2.94.67q.435.144.833.315a8.02 8.02 0 0 0-4.758-4.758M12 4c-.139 0-.312.237-.382.326c-.26.33-.539.87-.79 1.626a14.4 14.4 0 0 0-.51 2.098a28 28 0 0 1 3.364 0a14.4 14.4 0 0 0-.51-2.098c-.251-.756-.53-1.295-.79-1.626C12.312 4.236 12.14 4 12 4" /></g></svg>
//                   </a>
//                 )}
//               </div>

//               {/* Interactive Rating */}
//               <div className="rating">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <FaStar
//                     key={star}
//                     className={`star ${star <= (hoverRating || userRating) ? "filled" : ""}`}
//                     onClick={() => setUserRating(star)}
//                     onMouseEnter={() => setHoverRating(star)}
//                     onMouseLeave={() => setHoverRating(0)}
//                   />
//                 ))}
//                 <span className="rating-text">
//                   {userRating > 0 ? `${userRating}.0` : "Rate this business"}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* TABS */}
//           <div className="tabs">
//             <button
//               className={activeTab === "about" ? "active" : ""}
//               onClick={() => setActiveTab("about")}
//             >
//               About
//             </button>

//             {(tier === "gold" || tier === "business") && (
//               <button
//                 className={activeTab === "products" ? "active" : ""}
//                 onClick={() => setActiveTab("products")}
//               >
//                 Products
//               </button>
//             )}
//           </div>

//           {/* TAB CONTENT */}
//           {activeTab === "about" && (
//             <div className="about">
//               {profile.person_name && (
//                 <p>
//                   <strong>Name:</strong> {profile.person_prefix || ""} {profile.person_name}
//                 </p>
//               )}

//               {profile.address && (
//                 <p>
//                   <strong>Address:</strong> {profile.address}, {profile.city}, {profile.pincode}
//                 </p>
//               )}

//               {profile.mobile_number && (
//                 <p>
//                   <strong>Mobile:</strong> {formatMobile(profile.mobile_number)}
//                 </p>
//               )}

//               {profile.landline && (
//                 <p>
//                   <strong>Landline:</strong> {profile.landline}
//                 </p>
//               )}

//               {profile.description && (
//                 <>
//                   <h4>Description</h4>
//                   <p>{profile.description}</p>
//                 </>
//               )}
//             </div>
//           )}

//           {activeTab === "products" && (tier === "gold" || tier === "business") && (
//             <div className="products">
//               {loadingProducts ? (
//                 <p>Loading products...</p>
//               ) : priorityProducts.length === 0 && secondaryProducts.length === 0 ? (
//                 <p>No products listed yet.</p>
//               ) : (
//                 <>
//                   {priorityProducts.length > 0 && (
//                     <>
//                       <h4>Featured Products</h4>
//                       {priorityProducts.map((p) => (
//                         <div key={p.id} className="product-card priority">
//                           <h4>{p.name}</h4>
//                           {p.image && <img src={p.image} alt={p.name} />}
//                           {p.price && <p><strong>Price:</strong> ₹{p.price}</p>}
//                           {p.description && <p>{p.description}</p>}
//                         </div>
//                       ))}
//                     </>
//                   )}

//                   {secondaryProducts.length > 0 && (
//                     <>
//                       <h4>Other Products</h4>
//                       {secondaryProducts.map((p) => (
//                         <div key={p.id} className="product-card">
//                           <h4>{p.name}</h4>
//                           {p.image && <img src={p.image} alt={p.name} />}
//                           {p.description && <p>{p.description}</p>}
//                         </div>
//                       ))}
//                     </>
//                   )}
//                 </>
//               )}
//             </div>
//           )}
//         </div>

// {/* RIGHT PANEL - Enquiry Form with Validation */}
// <div className="right-panel">
//   <div className="enquiry-card">
//     <h3 dangerouslySetInnerHTML={{ __html: enquiry.title }} />

//     <p className="sub">{enquiry.sub}</p>

//     <p className="question">{enquiry.question}</p>

//     <div className="radio-group">
//       {enquiry.options.map((opt, i) => (
//         <label key={i}>
//           <input type="radio" name="service" defaultChecked={i === 0} />
//           {opt}
//         </label>
//       ))}
//     </div>

//     <form onSubmit={handleSubmit}>
//       <input
//         type="text"
//         name="name"
//         placeholder="Name *"
//         value={formData.name}
//         onChange={handleInputChange}
//         className={formErrors.name ? "input-error" : ""}
//       />
//       {formErrors.name && <span className="error-text">{formErrors.name}</span>}

//       <input
//         type="tel"
//         name="mobile"
//         placeholder="Mobile Number *"
//         value={formData.mobile}
//         onChange={handleInputChange}
//         className={formErrors.mobile ? "input-error" : ""}
//       />
//       {formErrors.mobile && <span className="error-text">{formErrors.mobile}</span>}

//       <label className="terms">
//         <input type="checkbox" defaultChecked />
//         I Agree to <a href="#">T&C’s</a> <a href="#">Privacy Policy</a>
//       </label>

//       <button type="submit" className="send-btn">
//         Send Enquiry &raquo;&raquo;&raquo;
//       </button>
//     </form>
//   </div>
// </div>
//       </div>

//       {/* Favorite Confirmation Modal */}
//       <FavoriteModal
//         isOpen={showFavoriteModal}
//         onClose={() => setShowFavoriteModal(false)}
//         businessName={displayName}
//         mobile={profile.mobile_number} // Pass mobile number
//       />
//     </div>
//   );
// };

// export default ProfileDetailPage;


// import { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { supabase } from "../../services/supabaseClient";
// import "./Desktop_css/ProfileDetailPage.css";
// import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
// import { MdVerified } from "react-icons/md";
// import FavoriteModal from "../Desktop_view/FavoriteModal";

// const ProfileDetailPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [images, setImages] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const [priorityProducts, setPriorityProducts] = useState([]);
//   const [secondaryProducts, setSecondaryProducts] = useState([]);
//   const [loadingProducts, setLoadingProducts] = useState(false);

//   const [activeTab, setActiveTab] = useState("overview");
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [showFavoriteModal, setShowFavoriteModal] = useState(false);

//   const [userRating, setUserRating] = useState(0);
//   const [hoverRating, setHoverRating] = useState(0);

//   const [formData, setFormData] = useState({
//     name: "",
//     mobile: "",
//     preferredDate: "",
//     preferredTime: "Morning",
//     serviceNeeded: "",
//   });
//   const [formErrors, setFormErrors] = useState({});

//   const autoScrollRef = useRef(null);

//   // Fetch profile
//   useEffect(() => {
//     if (!id) {
//       navigate(-1);
//       return;
//     }

//     const fetchProfile = async () => {
//       setLoading(true);
//       try {
//         const { data, error } = await supabase
//           .from("profiles")
//           .select(`
//             id,
//             business_name,
//             person_name,
//             person_prefix,
//             business_prefix,
//             city,
//             pincode,
//             address,
//             mobile_number,
//             landline,
//             landline_code,
//             email,
//             description,
//             keywords,
//             subscription,
//             is_prime,
//             profile_image,
//             web_site,
//             whats_app,
//             discount,
//             priority
//           `)
//           .eq("id", id)
//           .single();

//         if (error) throw error;
//         if (!data) {
//           setError("Profile not found");
//           return;
//         }

//         setProfile(data);
//       } catch (err) {
//         console.error(err);
//         setError(err.message || "Failed to load profile");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [id, navigate]);

//   // Load banner + products
//   useEffect(() => {
//     if (!profile?.id) return;

//     loadBannerImage();
//     loadProducts();

//     return () => clearInterval(autoScrollRef.current);
//   }, [profile]);

//   useEffect(() => {
//     if (images.length <= 1) return;

//     autoScrollRef.current = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % images.length);
//     }, 5000);

//     return () => clearInterval(autoScrollRef.current);
//   }, [images]);

// const loadBannerImage = async () => {
//   const { data } = await supabase
//     .from("users_table")
//     .select("cover_photo")
//     .eq("user_id", profile.id) // assuming user_id = profiles.id
//     .maybeSingle();

//   if (data?.cover_photo) {
//     setImages([data.cover_photo]);
//   } else if (profile.profile_image) {
//     setImages([profile.profile_image]);
//   }
// };

//   const loadProducts = async () => {
//     setLoadingProducts(true);
//     try {
//       const { data: descRows } = await supabase
//         .from("product_des_table")
//         .select("prod_des_id, product_desc")
//         .eq("userId", profile.id);

//       if (!descRows?.length) return;

//       const ids = descRows.map((r) => r.prod_des_id);
//       const descMap = Object.fromEntries(descRows.map((r) => [r.prod_des_id, r.product_desc]));

//       const { data: prodRows } = await supabase
//         .from("product_table")
//         .select("product_id, prod_des_id, product_name, product_image, product_description, price")
//         .in("prod_des_id", ids);

//       const priority = [];
//       const secondary = [];

//       prodRows?.forEach((p) => {
//         const prod = {
//           id: p.product_id,
//           name: p.product_name,
//           image: p.product_image,
//           description: p.product_description,
//           price: p.price,
//         };
//         if (descMap[p.prod_des_id]?.toLowerCase().includes("priority")) {
//           priority.push(prod);
//         } else {
//           secondary.push(prod);
//         }
//       });

//       setPriorityProducts(priority);
//       setSecondaryProducts(secondary);
//     } catch (err) {
//       console.error("Products error:", err);
//     } finally {
//       setLoadingProducts(false);
//     }
//   };

//   const formatMobile = (n) =>
//     n?.length >= 5 ? `${n.slice(0, 5)} XXXXX` : n || "Not available";

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setFormErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const validateForm = () => {
//     const errors = {};
//     let valid = true;

//     if (!formData.name.trim()) {
//       errors.name = "Name is required";
//       valid = false;
//     }
//     if (!formData.mobile.trim()) {
//       errors.mobile = "Mobile number is required";
//       valid = false;
//     } else if (!/^\d{10}$/.test(formData.mobile.trim())) {
//       errors.mobile = "Enter valid 10-digit number";
//       valid = false;
//     }

//     setFormErrors(errors);
//     return valid;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       alert("Enquiry submitted!");
//       setFormData({
//         name: "",
//         mobile: "",
//         preferredDate: "",
//         preferredTime: "Morning",
//         serviceNeeded: "",
//       });
//     }
//   };

//   if (loading) return <div className="profile-loading">Loading profile...</div>;
//   if (error || !profile) return <div className="profile-error">{error || "Profile not found"}</div>;

//   const displayName =
//     profile.business_name ||
//     profile.person_name ||
//     "Business";

//   const isPremium = profile.is_prime || profile.subscription?.toLowerCase() !== "free";

//   const enquiry = {
//     title: `Connect with <span>${displayName}</span>`,
//     sub: "Get in touch directly or send an enquiry instantly",
//     question: "How can we assist you today?",
//     options: ["General Enquiry", "Get Quote"],
//   };

//   return (
//     <div className="profile-detail-page gbp-layout">
//       <div className="hero">
//         {images.length > 0 ? (
//           <img src={images[currentIndex]} alt="Banner" className="hero-image" />
//         ) : (
//           <div className="hero-placeholder" />
//         )}

//         <div className="hero-overlay-card">
//           <div className="business-info">
//             <h1 className="business-name">
//               {displayName}
//               {isPremium && <MdVerified className="verified-icon" />}
//             </h1>

//             <div className="rating-row">
//               <div className="interactive-stars">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <FaStar
//                     key={star}
//                     className={`star ${star <= (hoverRating || userRating) ? "filled" : ""}`}
//                     onClick={() => setUserRating(star)}
//                     onMouseEnter={() => setHoverRating(star)}
//                     onMouseLeave={() => setHoverRating(0)}
//                   />
//                 ))}
//               </div>
//             </div>

//             <div className="hero-actions">
//               <button className="share">Share</button>
//               <button
//                 className={`save ${isFavorite ? "active" : ""}`}
//                 onClick={() => setShowFavoriteModal(true)}
//               >
//                 {isFavorite ? <FaHeart /> : <FaRegHeart />} Save
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <nav className="tabs-bar">
//         {["Overview", "Photos", "About", "Location"].map((tab) => (
//           <button
//             key={tab}
//             className={activeTab === tab.toLowerCase() ? "active" : ""}
//             onClick={() => setActiveTab(tab.toLowerCase())}
//           >
//             {tab}
//           </button>
//         ))}
//       </nav>

//       <div className="main-content">
//         <main className="main-column">
//           {activeTab === "overview" && (
//             <section className="about-section">
//               <h3>About {displayName}</h3>
//               {profile.description && <p>{profile.description}</p>}

//               <div className="core-services">
//                 <h4>Our Core Services</h4>
//                 <div className="chips">
//                   {profile.keywords ? (
//                     profile.keywords
//                       .split(/[,;]\s*/)
//                       .map((k) => k.trim())
//                       .filter(Boolean)
//                       .map((keyword, i) => (
//                         <span key={i} className="chip">
//                           {keyword}
//                         </span>
//                       ))
//                   ) : (
//                     <span className="no-keywords">No services listed yet</span>
//                   )}
//                 </div>
//               </div>
//             </section>
//           )}

//           {activeTab === "about" && (
//             <section className="about-full">
//               {profile.person_name && (
//                 <p><strong>Name:</strong> {profile.person_name}</p>
//               )}
//               {profile.business_name && (
//                 <p><strong>Business:</strong> {profile.business_name}</p>
//               )}
//               {profile.address && (
//                 <p>
//                   <strong>Address:</strong> {profile.address}, {profile.city}{" "}
//                   {profile.pincode}
//                 </p>
//               )}
//               {profile.mobile_number && (
//                 <p><strong>Mobile:</strong> {formatMobile(profile.mobile_number)}</p>
//               )}
//               {profile.landline && (
//                 <p><strong>Landline:</strong> {profile.landline}</p>
//               )}
//               {profile.email && <p><strong>Email:</strong> {profile.email}</p>}
//               {profile.web_site && (
//                 <p><strong>Website:</strong> <a href={profile.web_site}>{profile.web_site}</a></p>
//               )}
//               {profile.whats_app && (
//                 <p><strong>WhatsApp:</strong> {profile.whats_app}</p>
//               )}
//               {profile.description && (
//                 <>
//                   <h4>Description</h4>
//                   <p>{profile.description}</p>
//                 </>
//               )}
//             </section>
//           )}

//           {activeTab === "products" && isPremium && (
//             <section className="products-section">
//               {loadingProducts ? (
//                 <p>Loading products...</p>
//               ) : priorityProducts.length === 0 && secondaryProducts.length === 0 ? (
//                 <p>No products listed yet.</p>
//               ) : (
//                 <>
//                   {priorityProducts.length > 0 && (
//                     <>
//                       <h3>Featured Products</h3>
//                       {priorityProducts.map((p) => (
//                         <div key={p.id} className="product priority">
//                           <h4>{p.name}</h4>
//                           {p.image && <img src={p.image} alt={p.name} />}
//                           {p.price && <div className="price">₹{p.price}</div>}
//                           {p.description && <p>{p.description}</p>}
//                         </div>
//                       ))}
//                     </>
//                   )}
//                   {secondaryProducts.length > 0 && (
//                     <>
//                       <h4>Other Products</h4>
//                       {secondaryProducts.map((p) => (
//                         <div key={p.id} className="product-card">
//                           <h4>{p.name}</h4>
//                           {p.image && <img src={p.image} alt={p.name} />}
//                           {p.description && <p>{p.description}</p>}
//                         </div>
//                       ))}
//                     </>
//                   )}
//                 </>
//               )}
//             </section>
//           )}

//           {activeTab === "location" && (
//             <div className="location-placeholder">
//               <h3>Service Area</h3>
//               <div className="map-box">
//                 Map placeholder – {profile.city || "Location"} {profile.pincode || ""}
//               </div>
//             </div>
//           )}
//         </main>

//         <aside className="sidebar">
//           <div className="right-panel">
//             <div className="enquiry-card">
//               <h3 dangerouslySetInnerHTML={{ __html: enquiry.title }} />
//               <p className="sub">{enquiry.sub}</p>
//               <p className="question">{enquiry.question}</p>

//               <div className="radio-group">
//                 {enquiry.options.map((opt, i) => (
//                   <label key={i}>
//                     <input type="radio" name="service" defaultChecked={i === 0} />
//                     {opt}
//                   </label>
//                 ))}
//               </div>

//               <form onSubmit={handleSubmit}>
//                 <input
//                   type="text"
//                   name="name"
//                   placeholder="Name *"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className={formErrors.name ? "input-error" : ""}
//                 />
//                 {formErrors.name && <span className="error-text">{formErrors.name}</span>}

//                 <input
//                   type="tel"
//                   name="mobile"
//                   placeholder="Mobile Number *"
//                   value={formData.mobile}
//                   onChange={handleInputChange}
//                   className={formErrors.mobile ? "input-error" : ""}
//                 />
//                 {formErrors.mobile && <span className="error-text">{formErrors.mobile}</span>}

//                 <label className="terms">
//                   <input type="checkbox" defaultChecked />
//                   I Agree to <a href="#">T&C’s</a> <a href="#">Privacy Policy</a>
//                 </label>

//                 <button type="submit" className="send-btn">
//                   Send Enquiry »
//                 </button>
//               </form>
//             </div>
//           </div>
//         </aside>
//       </div>

//       <FavoriteModal
//         isOpen={showFavoriteModal}
//         onClose={() => setShowFavoriteModal(false)}
//         businessName={displayName}
//         mobile={profile.mobile_number}
//       />
//     </div>
//   );
// };

// export default ProfileDetailPage;

// ================= ProfileDetail.jsx =================

// import "./Desktop_css/ProfileDetailPage.css";


// export default function ProfileDetail() {
//   return (
//     <main className="container">
//       <div className="main-grid">
//         {/* Left Column */}
//         <div className="left-col">
//           {/* Profile Header */}
//           <section className="profile-header">
//             <div
//               className="cover-photo"
//               style={{
//                 backgroundImage:
//                   'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBgCysHY95IBKh2NmTkfi1SP6PA3B1YcGzvxSJ_dyHddiEzOVGhlg_H0sXXxj0aPmt2Qshj5QHaggBekB9s57Fy3A0EA8NCZd03jAZtQ7TsJx21W-wmWWoQ7ULzWzTnJnGOA4IehePKK7i40HjRErkT8qb7iDqz6AbzAZjOLbayFZbcmRhgcPM1_cDvkHci6iYJYN2VuqqTgrTqnQWvM59tb2RTrV0h3NawrxWeyvMCsBVj5_03pFgm7mZIdr7rGVxDqtEYWrZ1V5Ob")',
//               }}
//             />

//             <div className="profile-content">
//               <div className="profile-top">
//                 <div className="profile-left">
//                   <div className="name-verified">
//                     <h1 className="business-name">Acme Plumbing & Rooter</h1>
//                     <span className="material-symbols-outlined verified-icon">
//                       check_circle
//                     </span>
//                   </div>
//                 </div>

//                 <div className="action-buttons">
//                   <button className="action-btn">
//                     <span className="material-symbols-outlined">share</span>
//                     Share
//                   </button>
//                   <button className="action-btn">
//                     <span className="material-symbols-outlined">favorite</span>
//                     Save
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Navigation */}
//           <nav className="sticky-nav">
//             <a href="#overview" className="nav-link active">Overview</a>
//             <a href="#photos" className="nav-link">Photos</a>
//             <a href="#about" className="nav-link">About</a>
//             <a href="#reviews" className="nav-link">Reviews</a>
//             <a href="#location" className="nav-link">Location</a>
//           </nav>

//           {/* About */}
//           <section id="about">
//             <h2>About Acme Plumbing & Rooter</h2>
//             <div className="about-text">
//               <p>
//                 With over 20 years of dedicated service in the local community,
//                 Acme Plumbing & Rooter has built a reputation for excellence,
//                 reliability, and unparalleled technical expertise.
//               </p>
//               <p className="mt">
//                 We offer 24/7 emergency response with transparent pricing and
//                 state-licensed professionals.
//               </p>
//             </div>

//             <div className="services">
//               <h3>Our Core Services</h3>
//               <div className="core-services-list">
//                 <span className="service-tag">Emergency Repairs</span>
//                 <span className="service-tag">Drain Cleaning</span>
//                 <span className="service-tag">Water Heater Service</span>
//                 <span className="service-tag">Sewer Line Repair</span>
//                 <span className="service-tag">Hydro Jetting</span>
//                 <span className="service-tag">Gas Line Service</span>
//               </div>
//             </div>
//           </section>
//         </div>

//         {/* Sidebar */}
//         <aside className="sidebar">
//           <div className="booking-card">
//             <h3 className="booking-title">Book a Consultation</h3>
//             <p className="response-time">Average response time: 15 minutes</p>

//             <form className="booking-form">
//               <input className="form-input" placeholder="Full Name" />
//               <input className="form-input" placeholder="Phone Number" />

//               <div className="form-date-row">
//                 <input className="form-input" type="date" />
//                 <select className="form-select">
//                   <option>Morning</option>
//                   <option>Afternoon</option>
//                   <option>Evening</option>
//                 </select>
//               </div>

//               <select className="form-select">
//                 <option>Select a service...</option>
//                 <option>Emergency Repair</option>
//                 <option>Drain Cleaning</option>
//                 <option>Water Heater</option>
//                 <option>Inspection</option>
//               </select>

//               <button className="submit-btn">Enquire Now</button>
//             </form>
//           </div>

//           <div className="location-card" id="location">
//             <h3 className="location-title">Service Area</h3>
//             <div className="map-container">
//               <div
//                 className="map-overlay"
//                 style={{
//                   backgroundImage:
//                     'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDxSoSItCdLA_E77pBIY9qKLJqgFVIS0o_cXHgqqDdaN0-sDmndPVnGb6HkxsPj8cpItz8G4TyWa2s1--eH922UGC7WCIHVbKVRkYs5vARmkLgHhNFjQFNYU3QJJBpNzFbHqz-mNamGz_dRUdaxIhPkwYoNCzVvccKDh0idPWydjZFGr_sYQSdRBZhmHu33l9G9uOzdwdPtZ0MVKdgz4HegHvJVOc7AEKaviGo_Us1NQ_mefeAFSiG54-FZptoT4zxMx3PBtMqgq9jX")',
//                 }}
//               />
//               <div className="map-label">
//                 <div className="map-label-inner">
//                   Serving San Francisco & Bay Area
//                 </div>
//               </div>
//             </div>
//           </div>
//         </aside>
//       </div>
//     </main>
//   );
// }



// ================= ProfileDetailPage.jsx =================
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import "./Desktop_css/ProfileDetailPage.css";

import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import FavoriteModal from "../Desktop_view/FavoriteModal";

export default function ProfileDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [activeTab, setActiveTab] = useState("overview");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);

  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const autoScrollRef = useRef(null);

  // Load banner / cover image
  const loadBannerImage = async (profileId) => {
    const { data, error } = await supabase
      .from("users_table")
      .select("cover_photo")
      .eq("user_id", profileId)
      .maybeSingle();

    if (data?.cover_photo) {
      setImages([data.cover_photo]);
    } else if (profile?.profile_image) {
      setImages([profile.profile_image]);
    } else {
      setImages(["/default-cover.jpg"]); // fallback
    }
  };

  useEffect(() => {
    if (!id) return navigate(-1);

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select(`
            id,
            business_name,
            person_name,
            city,
            pincode,
            address,
            mobile_number,
            email,
            description,
            keywords,
            is_prime,
            profile_image
          `)
          .eq("id", id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, navigate]);

  useEffect(() => {
    if (profile?.id) {
      loadBannerImage(profile.id);
    }
  }, [profile]);

  // Auto-slide images
  useEffect(() => {
    if (images.length <= 1) return;
    autoScrollRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(autoScrollRef.current);
  }, [images]);

  if (loading) return <div className="profile-loading">Loading profile...</div>;
  if (error || !profile) return <div className="profile-error">Profile not found</div>;

  const displayName = profile.business_name || profile.person_name || "Business";

  return (
    <main className="container">
      <div className="main-grid">
        <div>
         
          <section className="profile-header">
            <div
              className="cover-photo"
              style={{ backgroundImage: `url(${images[currentIndex] || "/default-cover.jpg"})` }}
            />

            <div className="profile-info">
              <div className="name-verified">
                <h1 className="business-name">{displayName}</h1>
                {profile.is_prime && <MdVerified className="verified-icon" />}
              </div>

              <div className="rating-row">
                {[1, 2, 3, 4, 5].map((s) => (
                  <FaStar
                    key={s}
                    className={`star ${s <= (hoverRating || userRating) ? "filled" : ""}`}
                    onClick={() => setUserRating(s)}
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                  />
                ))}
              </div>

              <div className="action-buttons">
                <button className="action-btn">Share</button>
                <button
                  className="action-btn"
                  onClick={() => setShowFavoriteModal(true)}
                >
                  {isFavorite ? <FaHeart /> : <FaRegHeart />} Save
                </button>
              </div>
            </div>


          </section>

          {/* Sticky Nav */}
          <nav className="sticky-nav">
            {["overview", "about", "location"].map((tab) => (
              <button
                key={tab}
                className={`nav-link ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </nav>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <section className="content-section">
              <h2>About {displayName}</h2>
              <p className="about-text">{profile.description || "No description available."}</p>

              <h3 className="sub-title">Core Services</h3>
              <div className="core-services-list">
                {profile.keywords
                  ?.split(/[,;]/)
                  .map((k, i) => (
                    <span key={i} className="service-tag">
                      {k.trim()}
                    </span>
                  )) || <p>No services listed</p>}
              </div>
            </section>
          )}

          {activeTab === "about" && (
            <section className="content-section">
              <p><strong>Address:</strong> {profile.address || "—"}</p>
              <p><strong>City:</strong> {profile.city || "—"}</p>
              <p><strong>Pincode:</strong> {profile.pincode || "—"}</p>
              <p><strong>Mobile:</strong> {profile.mobile_number || "—"}</p>
              <p><strong>Email:</strong> {profile.email || "—"}</p>
            </section>
          )}

          {activeTab === "location" && (
            <section className="content-section">
              <h2>Service Area</h2>
              <div className="map-container">Map Placeholder</div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="booking-card">
            <h3>Book a Consultation</h3>
            <form className="booking-form">
              <input className="form-input" placeholder="Name" />
              <input className="form-input" placeholder="Mobile" />
              <button className="submit-btn">Send Enquiry</button>
            </form>
          </div>
        </aside>
      </div>

      <FavoriteModal
        isOpen={showFavoriteModal}
        onClose={() => setShowFavoriteModal(false)}
        businessName={displayName}
        mobile={profile.mobile_number}
      />
    </main>
  );
}