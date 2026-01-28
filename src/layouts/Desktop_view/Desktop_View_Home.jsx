// // ================= DesktopViewHome.jsx =================
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Carousel } from "react-responsive-carousel";
// import "react-responsive-carousel/lib/styles/carousel.min.css";
// import { supabase } from "../../services/supabaseClient";
// import "./Desktop_css/Desktop_View_Home.css";

// // ─── Lucide Icons ─────────────────────────────────────────
// import {
//   Factory,
//   Plug,
//   Cpu,
//   Boxes,
//   Plane,
//   Zap,
//   ShoppingBag,
//   Hospital,
//   Hotel,
//   GraduationCap,
//   Stethoscope,
//   FlaskConical,
//   Search,
//   Building2,
//   Wrench,
//   Truck,
//   Briefcase,
//   Smartphone,
// } from "lucide-react";

// // ─── Swiper ───────────────────────────────────────────────
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/autoplay";


// // ─── Bootstrap Grid (Row / Col) ───────────────────────────
// import { Row, Col } from "react-bootstrap";

// // ─── Your Components ──────────────────────────────────────
// import FeatureList from "../Desktop_view/FeatureLists";
// import CategoryForLandingPage from "../Desktop_view/CategoryForLandingPage";

// // ─── B2C Categories ───────────────────────────────────────
// const DIRECTORY_CATEGORIES_B2C = [
//   { title: "Hospital", icon: <Hospital />, keywords: "hospital" },
//   { title: "Hotels", icon: <Hotel />, keywords: "hotel" },
//   { title: "Colleges", icon: <GraduationCap />, keywords: "college" },
//   { title: "Doctors", icon: <Stethoscope />, keywords: "doctor" },
//   { title: "Shops / Parlour", icon: <ShoppingBag />, keywords: "shop,parlour" },
//   { title: "Real Estate", icon: <Building2 />, keywords: "real estate" },
//   { title: "Consultants", icon: <Briefcase />, keywords: "consultant" },
//   { title: "Repair Services", icon: <Wrench />, keywords: "repair,service" },
// ];

// // ─── B2B Categories ───────────────────────────────────────
// const DIRECTORY_CATEGORIES_B2B = [
//   { title: "Chemical", icon: <FlaskConical />, keywords: "chemical" },
//   { title: "Electrical", icon: <Zap />, keywords: "electrical" },
//   { title: "Steel / Builder", icon: <Factory />, keywords: "steel,builder" },
//   { title: "CNC / Hydraulic", icon: <Cpu />, keywords: "cnc,hydraulic" },
//   { title: "Electronics", icon: <Plug />, keywords: "electronics" },
//   { title: "Exporters", icon: <Plane />, keywords: "export" },
//   { title: "Logistics", icon: <Truck />, keywords: "logistics,transport" },
//   { title: "Local Services", icon: <Boxes />, keywords: "local services" },
// ];

// // ─── Popular Searches ─────────────────────────────────────
// const POPULAR_SEARCHES = [
//   { title: "Estate Agents For Residential Rental", image: "/images/estate-agent.jpg", link: "/DirectoryPage?q=estate agent" },
//   { title: "Interior Designers", image: "/images/interior.jpg", link: "/DirectoryPage?q=interior designer" },
//   { title: "Real Estate Agents", image: "/images/real-estate.jpg", link: "/DirectoryPage?q=real estate" },
//   { title: "Banquet Halls", image: "/images/banquet.jpg", link: "/DirectoryPage?q=banquet hall" },
//   { title: "Caterers", image: "/images/caterers.jpg", link: "/DirectoryPage?q=caterers" },
// ];

// // ─── Placeholder – replace with your real data ────────────
// const productCategories = [
//   { title: "Pumps & Valves", img: "https://via.placeholder.com/100?text=Pumps" },
//   { title: "Motors", img: "https://via.placeholder.com/100?text=Motors" },
//   { title: "Bearings", img: "https://via.placeholder.com/100?text=Bearings" },
//   { title: "Gears", img: "https://via.placeholder.com/100?text=Gears" },
//   { title: "CNC Tools", img: "https://via.placeholder.com/100?text=CNC" },
//   { title: "Wires & Cables", img: "https://via.placeholder.com/100?text=Cables" },
//   { title: "Hydraulics", img: "https://via.placeholder.com/100?text=Hydraulics" },
// ];

// const industrialCategories = [
//   {
//     title: "Machinery & Equipment",
//     bg: "#e3f2fd",
//     items: [
//       { name: "CNC Machines", img: "https://via.placeholder.com/40?text=CNC" },
//       { name: "Lathe", img: "https://via.placeholder.com/40?text=Lathe" },
//       { name: "Milling", img: "https://via.placeholder.com/40?text=Mill" },
//       { name: "Press", img: "https://via.placeholder.com/40?text=Press" },
//     ],
//   },
//   {
//     title: "Electrical Items",
//     bg: "#e8f5e9",
//     items: [
//       { name: "Transformers", img: "https://via.placeholder.com/40?text=TRF" },
//       { name: "Control Panels", img: "https://via.placeholder.com/40?text=Panel" },
//       { name: "Switchgear", img: "https://via.placeholder.com/40?text=Switch" },
//       { name: "Cables", img: "https://via.placeholder.com/40?text=Cable" },
//     ],
//   },
//   {
//     title: "Chemicals & Raw Materials",
//     bg: "#fff3e0",
//     items: [
//       { name: "Acids", img: "https://via.placeholder.com/40?text=Acid" },
//       { name: "Polymers", img: "https://via.placeholder.com/40?text=Poly" },
//       { name: "Pigments", img: "https://via.placeholder.com/40?text=Pigment" },
//       { name: "Solvents", img: "https://via.placeholder.com/40?text=Solvent" },
//     ],
//   },
// ];

// const DesktopViewHome = () => {
//   const navigate = useNavigate();

//   const [mode, setMode] = useState("B2C");
//   const [search, setSearch] = useState("");
//   const [locationSearch, setLocationSearch] = useState("");
//   const [homeVideoUrl, setHomeVideoUrl] = useState(null);
//   const [banners, setBanners] = useState([]);

//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [autoPlay, setAutoPlay] = useState(true);

//   useEffect(() => {
//     loadHomeVideo();
//     loadBanners();
//   }, []);

//   useEffect(() => {
//     const updateSlides = () => {
//       const w = window.innerWidth;
//       if (w < 768) {
//         // You had slidesPercent but never used it – keeping for future
//       } else if (w < 1024) {
//         // ...
//       } else {
//         // ...
//       }
//     };
//     updateSlides();
//     window.addEventListener("resize", updateSlides);
//     return () => window.removeEventListener("resize", updateSlides);
//   }, []);

//   const loadHomeVideo = async () => {
//     const { data } = await supabase
//       .from("home_medias")
//       .select("video_url")
//       .eq("is_active", true)
//       .order("updated_at", { ascending: false })
//       .limit(1)
//       .maybeSingle();

//     setHomeVideoUrl(data?.video_url || null);
//   };

//   const loadBanners = async () => {
//     const { data } = await supabase.from("app_banner").select("*");
//     setBanners(data || []);
//   };

//   const categories = mode === "B2C" ? DIRECTORY_CATEGORIES_B2C : DIRECTORY_CATEGORIES_B2B;

//   return (
//     <>
//       {/* ================= GLOBAL SEARCH ================= */}
//       <div className="desktop-global-search">
//         <p className="search-label">
//           Find Your Next Business Partner & <span>"Promote Your Business"</span>
//         </p>

//         <div className="search-row-wrapper">
//           <div className="search-row">
//             <div className="search-box">
//               <Search size={18} />
//               <input
//                 placeholder="Keyword, business, category"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </div>

//             <div className="search-box">
//               <Search size={18} />
//               <input
//                 placeholder="Location / Area / City"
//                 value={locationSearch}
//                 onChange={(e) => setLocationSearch(e.target.value)}
//               />
//             </div>
//           </div>

//           <button
//             className="download-app-btn text"
//             onClick={() =>
//               window.open(
//                 "https://play.google.com/store/apps/details?id=com.celfonphonebookapp&pcampaignid=web_share",
//                 "_blank"
//               )
//             }
//           >
//             <Smartphone size={18} className="download-phone" />
//             <span>Download App</span>
//           </button>
//         </div>
//       </div>

//       {/* ================= HERO SECTION ================= */}
//       <section className="desktop-hero">
//         <div className="hero-left">
//           {homeVideoUrl ? (
//             <video src={homeVideoUrl} autoPlay muted loop playsInline />
//           ) : (
//             <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false}>
//               {banners.map((b, i) => (
//                 <div key={i}>
//                   <img src={b.image_url} alt={b.title || "Banner"} />
//                 </div>
//               ))}
//             </Carousel>
//           )}
//         </div>

//         <div className="hero-right">
//           <div className="category-header">
//             <h4>Browse Categories</h4>
//             <div className="toggle">
//               <button className={mode === "B2C" ? "active" : ""} onClick={() => setMode("B2C")}>
//                 B2C
//               </button>
//               <button className={mode === "B2B" ? "active" : ""} onClick={() => setMode("B2B")}>
//                 B2B
//               </button>
//             </div>
//           </div>

//           <div className={`category-box-grid ${mode.toLowerCase()}`}>
//             {categories.map((item, i) => (
//               <div
//                 key={i}
//                 className="category-box"
//                 onClick={() => navigate(`/DirectoryPage?type=${mode}&q=${item.keywords}`)}
//               >
//                 {item.icon}
//                 <span>{item.title}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ================= INDUSTRIAL PRODUCTS CAROUSEL ================= */}
//       <div className="industrial-products-section">
//         <h2 className="section-title">
//           Search By Industrial Products
//         </h2>

//         <p className="section-subtitle">
//           Explore manufacturers and businesses by your preferred category
//         </p>

//         <div className="industrial-products-swiper">
//           <Swiper
//             modules={[Autoplay, Navigation]}
//             loop
//             navigation
//             autoplay={{
//               delay: 2000,
//               disableOnInteraction: false,
//               pauseOnMouseEnter: true,
//             }}
//             spaceBetween={16}
//             breakpoints={{
//               320: { slidesPerView: 3 },
//               576: { slidesPerView: 4 },
//               768: { slidesPerView: 5 },
//               992: { slidesPerView: 6 },
//               1200: { slidesPerView: 7 },
//             }}
//             className="products-swiper"
//           >
//             {productCategories.map((item, index) => (
//               <SwiperSlide key={index}>
//                 <div
//                   className="industrial-product-card"
//                   onClick={() =>
//                     navigate(`/directory?query=${encodeURIComponent(item.title)}`)
//                   }
//                 >
//                   <div className="product-circle">
//                     <img src={item.img} alt={item.title} />
//                   </div>
//                   <span className="product-title">{item.title}</span>
//                 </div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </div>
//       </div>

//       {/* ================= INDUSTRIAL CATEGORIES GRID ================= */}
//       <div className="industrial-section">
//         <div className="container">
//           <Row className="industrial-row flex-nowrap">
//             {industrialCategories.map((category, i) => (
//               <Col
//                 key={i}
//                 xl={3}
//                 lg={4}
//                 md={6}
//                 sm={12}
//                 className="industrial-col"
//               >
//                 <div
//                   className="industrial-card"
//                   style={{ background: category.bg }}
//                 >
//                   <div className="industrial-header">
//                     <h5>{category.title}</h5>
//                     <span
//                       className="view-all"
//                       onClick={() =>
//                         navigate(`/directory?category=${encodeURIComponent(category.title)}`)
//                       }
//                     >
//                       View all
//                     </span>
//                   </div>

//                   {/* ITEMS ROW */}
//                   <div className="industrial-items-row">
//                     {category.items.map((item, j) => (
//                       <div
//                         key={j}
//                         className="industrial-item"
//                         onClick={() =>
//                           navigate(`/directory?query=${encodeURIComponent(item.name)}`)
//                         }
//                       >
//                         <img src={item.img} alt={item.name} />
//                         <span>{item.name}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </Col>
//             ))}
//           </Row>
//         </div>
//       </div>



//       {/* ================= POPULAR SEARCHES CAROUSEL ================= */}
//       <section className="popular-searches">
//         <div className="popular-layout">
//           <div className="popular-heading-card">
//             {/* <h2>Popular</h2> */}
//             <h2>Popular<br/>Categories</h2>
//             <p>Explore the most searched business categories</p>
//           </div>

//             <div className="popular-carousel-wrapper">
//               <Carousel
//                 selectedItem={currentSlide}
//                 onChange={setCurrentSlide}
//                 autoPlay={autoPlay}
//                 infiniteLoop
//                 interval={3500}
//                 stopOnHover
//                 centerMode
//                 centerSlidePercentage={30}
//                 swipeable
//                 emulateTouch
//                 showThumbs={false}
//                 showStatus={false}
//                 showIndicators={false}
//                 showArrows={false}
//                 onSwipeStart={() => setAutoPlay(false)}
//                 onSwipeEnd={() => setAutoPlay(true)}
//               >
//                 {POPULAR_SEARCHES.map((item, i) => (
//                   <div className="popular-card" key={i}>
//                     <img src={item.image} alt={item.title} />
//                     <div className="popular-overlay">
//                       <h4>{item.title}</h4>
//                       <button onClick={() => navigate(item.link)}>Enquire Now</button>
//                     </div>
//                   </div>
//                 ))}
//               </Carousel>

//               {/* Custom Arrows */}
//             <button
//               className="popular-arrow left"
//               onClick={() => setCurrentSlide((s) => (s === 0 ? POPULAR_SEARCHES.length - 1 : s - 1))}
//             >
//               ‹
//             </button>
//             <button
//               className="popular-arrow right"
//               onClick={() => setCurrentSlide((s) => (s === POPULAR_SEARCHES.length - 1 ? 0 : s + 1))}
//             >
//               ›
//             </button>
//           </div>
//         </div>
//       </section>

//       <FeatureList />
//       <CategoryForLandingPage />
//     </>
//   );
// };

// export default DesktopViewHome;


// //9629624999


// ================= DesktopViewHome.jsx =================


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Carousel } from "react-responsive-carousel";
// import "react-responsive-carousel/lib/styles/carousel.min.css";
// import { supabase } from "../../services/supabaseClient";
// import "./Desktop_css/Desktop_View_Home.css";

// // ─── Lucide Icons ─────────────────────────────────────────
// import {
//   Factory,
//   Plug,
//   Cpu,
//   Boxes,
//   Plane,
//   Zap,
//   ShoppingBag,
//   Hospital,
//   Hotel,
//   GraduationCap,
//   Stethoscope,
//   FlaskConical,
//   Search,
//   Building2,
//   Wrench,
//   Truck,
//   Briefcase,
//   Smartphone,
// } from "lucide-react";

// // ─── Swiper ───────────────────────────────────────────────
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/autoplay";

// // ─── Bootstrap Grid ───────────────────────────────────────
// import { Row, Col } from "react-bootstrap";

// // ─── Components ───────────────────────────────────────────
// import FeatureList from "../Desktop_view/FeatureLists";
// import CategoryForLandingPage from "../Desktop_view/CategoryForLandingPage";

// // ─── Keyword Utilities ────────────────────────────────────
// const CACHE_KEY = "desktop_home_keywords_v1";
// const CACHE_TTL = 1000 * 60 * 60 * 6; // 6 hours

// const normalizeKeyword = (word) => {
//   if (!word) return null;
//   return word
//     .toLowerCase()
//     .trim()
//     .replace(/\s+/g, " ")
//     .replace(/ies$/, "y")
//     .replace(/s$/, "")
//     .replace(/[^a-z0-9 ]/g, "");
// };

// const debounce = (fn, delay) => {
//   let timer;
//   return (...args) => {
//     clearTimeout(timer);
//     timer = setTimeout(() => fn(...args), delay);
//   };
// };

// // ─── Static Categories (UNCHANGED) ────────────────────────
// const DIRECTORY_CATEGORIES_B2C = [
//   { title: "Hospital", icon: <Hospital />, keywords: "hospital" },
//   { title: "Hotels", icon: <Hotel />, keywords: "hotel" },
//   { title: "Colleges", icon: <GraduationCap />, keywords: "college" },
//   { title: "Doctors", icon: <Stethoscope />, keywords: "doctor" },
//   { title: "Shops / Parlour", icon: <ShoppingBag />, keywords: "shop,parlour" },
//   { title: "Real Estate", icon: <Building2 />, keywords: "real estate" },
//   { title: "Consultants", icon: <Briefcase />, keywords: "consultant" },
//   { title: "Repair Services", icon: <Wrench />, keywords: "repair,service" },
// ];

// const DIRECTORY_CATEGORIES_B2B = [
//   { title: "Chemical", icon: <FlaskConical />, keywords: "chemical" },
//   { title: "Electrical", icon: <Zap />, keywords: "electrical" },
//   { title: "Steel / Builder", icon: <Factory />, keywords: "steel,builder" },
//   { title: "CNC / Hydraulic", icon: <Cpu />, keywords: "cnc,hydraulic" },
//   { title: "Electronics", icon: <Plug />, keywords: "electronics" },
//   { title: "Exporters", icon: <Plane />, keywords: "export" },
//   { title: "Logistics", icon: <Truck />, keywords: "logistics,transport" },
//   { title: "Local Services", icon: <Boxes />, keywords: "local services" },
// ];

// const DesktopViewHome = () => {
//   const navigate = useNavigate();

//   const [mode, setMode] = useState("B2C");
//   const [search, setSearch] = useState("");
//   const [locationSearch, setLocationSearch] = useState("");
//   const [homeVideoUrl, setHomeVideoUrl] = useState(null);
//   const [banners, setBanners] = useState([]);

//   const [popularSearches, setPopularSearches] = useState([]);
//   const [productCategories, setProductCategories] = useState([]);
//   const [industrialCategories, setIndustrialCategories] = useState([]);

//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [autoPlay, setAutoPlay] = useState(true);

//   useEffect(() => {
//     loadHomeVideo();
//     loadBanners();
//     debounce(fetchKeywords, 400)();
//   }, []);

//   const loadHomeVideo = async () => {
//     const { data } = await supabase
//       .from("home_medias")
//       .select("video_url")
//       .eq("is_active", true)
//       .order("updated_at", { ascending: false })
//       .limit(1)
//       .maybeSingle();

//     setHomeVideoUrl(data?.video_url || null);
//   };

//   const loadBanners = async () => {
//     const { data } = await supabase.from("app_banner").select("*");
//     setBanners(data || []);
//   };

//   const fetchKeywords = async () => {
//     const cached = localStorage.getItem(CACHE_KEY);
//     if (cached) {
//       const parsed = JSON.parse(cached);
//       if (Date.now() - parsed.timestamp < CACHE_TTL) {
//         applyKeywords(parsed.data);
//         return;
//       }
//     }

//     const { data, error } = await supabase
//       .from("profiles")
//       .select("keywords")
//       .not("keywords", "is", null);

//     if (error) return console.error(error);

//     const freq = {};
//     data.forEach((row) => {
//       row.keywords
//         ?.split(",")
//         .map(normalizeKeyword)
//         .filter(Boolean)
//         .forEach((word) => {
//           freq[word] = (freq[word] || 0) + 1;
//         });
//     });

//     const sorted = Object.entries(freq)
//       .sort((a, b) => b[1] - a[1])
//       .map(([k]) => k);

//     localStorage.setItem(
//       CACHE_KEY,
//       JSON.stringify({ timestamp: Date.now(), data: sorted })
//     );

//     applyKeywords(sorted);
//   };

//   const applyKeywords = (keywords) => {
//     setPopularSearches(
//       keywords.slice(0, 1).map((k) => ({
//         title: k,
//         image: "/images/default-category.jpg",
//         link: `/DirectoryPage?q=${encodeURIComponent(k)}`,
//       }))
//     );

//     setProductCategories(
//       keywords.slice(0, 10).map((k) => ({
//         title: k,
//         img: `https://via.placeholder.com/100?text=${encodeURIComponent(k)}`,
//       }))
//     );

//     const groups = [];
//     for (let i = 0; i < 12; i += 4) {
//       groups.push(keywords.slice(i, i + 4));
//     }

//     setIndustrialCategories(
//       groups.map((group, i) => ({
//         title: `Category ${i + 1}`,
//         bg: ["#e3f2fd", "#e8f5e9", "#fff3e0"][i % 3],
//         items: group.map((name) => ({
//           name,
//           img: `https://via.placeholder.com/40?text=${encodeURIComponent(name)}`,
//         })),
//       }))
//     );
//   };

//   const categories =
//     mode === "B2C" ? DIRECTORY_CATEGORIES_B2C : DIRECTORY_CATEGORIES_B2B;

//   return (
//     <>
//       {/* ================= GLOBAL SEARCH ================= */}
//       <div className="desktop-global-search">
//         <p className="search-label">
//           Find Your Next Business Partner & <span>"Promote Your Business"</span>
//         </p>

//         <div className="search-row-wrapper">
//           <div className="search-row">
//             <div className="search-box">
//               <Search size={18} />
//               <input
//                 placeholder="Keyword, business, category"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </div>

//             <div className="search-box">
//               <Search size={18} />
//               <input
//                 placeholder="Location / Area / City"
//                 value={locationSearch}
//                 onChange={(e) => setLocationSearch(e.target.value)}
//               />
//             </div>
//           </div>

//           <button
//             className="download-app-btn text"
//             onClick={() =>
//               window.open(
//                 "https://play.google.com/store/apps/details?id=com.celfonphonebookapp",
//                 "_blank"
//               )
//             }
//           >
//             <Smartphone size={18} className="download-phone" />
//             <span>Download App</span>
//           </button>
//         </div>
//       </div>

//       {/* ================= HERO ================= */}
//       <section className="desktop-hero">
//         <div className="hero-left">
//           {homeVideoUrl ? (
//             <video src={homeVideoUrl} autoPlay muted loop />
//           ) : (
//             <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false}>
//               {banners.map((b, i) => (
//                 <div key={i}>
//                   <img src={b.image_url} alt="" />
//                 </div>
//               ))}
//             </Carousel>
//           )}
//         </div>

//         <div className="hero-right">
//           <div className="category-header">
//             <h4>Browse Categories</h4>
//             <div className="toggle">
//               <button
//                 className={mode === "B2C" ? "active" : ""}
//                 onClick={() => setMode("B2C")}
//               >
//                 B2C
//               </button>
//               <button
//                 className={mode === "B2B" ? "active" : ""}
//                 onClick={() => setMode("B2B")}
//               >
//                 B2B
//               </button>
//             </div>
//           </div>

//           <div className={`category-box-grid ${mode.toLowerCase()}`}>
//             {categories.map((item, i) => (
//               <div
//                 key={i}
//                 className="category-box"
//                 onClick={() =>
//                   navigate(`/DirectoryPage?type=${mode}&q=${item.keywords}`)
//                 }
//               >
//                 {item.icon}
//                 <span>{item.title}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ================= INDUSTRIAL PRODUCTS ================= */}
//       <div className="industrial-products-section">
//         <h2 className="section-title">Search By Industrial Products</h2>
//         <p className="section-subtitle">
//           Explore manufacturers and businesses by your preferred category
//         </p>

//         <Swiper
//           modules={[Autoplay, Navigation]}
//           loop
//           navigation
//           autoplay={{ delay: 2000, pauseOnMouseEnter: true }}
//           spaceBetween={16}
//           breakpoints={{
//             320: { slidesPerView: 3 },
//             576: { slidesPerView: 4 },
//             768: { slidesPerView: 5 },
//             992: { slidesPerView: 6 },
//             1200: { slidesPerView: 7 },
//           }}
//         >
//           {productCategories.map((item, i) => (
//             <SwiperSlide key={i}>
//               <div
//                 className="industrial-product-card"
//                 onClick={() =>
//                   navigate(`/directory?query=${encodeURIComponent(item.title)}`)
//                 }
//               >
//                 <div className="product-circle">
//                   <img src={item.img} alt={item.title} />
//                 </div>
//                 <span className="product-title">{item.title}</span>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>

//       {/* ================= INDUSTRIAL CATEGORIES ================= */}
//       <div className="industrial-section">
//         <div className="container">
//           <Row className="industrial-row flex-nowrap">
//             {industrialCategories.map((category, i) => (
//               <Col key={i} xl={3} lg={4} md={6} sm={12}>
//                 <div className="industrial-card" style={{ background: category.bg }}>
//                   <div className="industrial-header">
//                     <h5>{category.title}</h5>
//                     <span
//                       className="view-all"
//                       onClick={() =>
//                         navigate(
//                           `/directory?category=${encodeURIComponent(category.title)}`
//                         )
//                       }
//                     >
//                       View all
//                     </span>
//                   </div>

//                   <div className="industrial-items-row">
//                     {category.items.map((item, j) => (
//                       <div
//                         key={j}
//                         className="industrial-item"
//                         onClick={() =>
//                           navigate(`/directory?query=${encodeURIComponent(item.name)}`)
//                         }
//                       >
//                         <img src={item.img} alt={item.name} />
//                         <span>{item.name}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </Col>
//             ))}
//           </Row>
//         </div>
//       </div>

//       {/* ================= POPULAR SEARCHES ================= */}
//       <section className="popular-searches">
//         <div className="popular-layout">
//           <div className="popular-heading-card">
//             <h2>Popular<br />Categories</h2>
//             <p>Explore the most searched business categories</p>
//           </div>

//           <Carousel
//             autoPlay
//             infiniteLoop
//             interval={3500}
//             showThumbs={false}
//             showStatus={false}
//             showIndicators={false}
//             showArrows={false}
//           >
//             {popularSearches.map((item, i) => (
//               <div className="popular-card" key={i}>
//                 <img src={item.image} alt={item.title} />
//                 <div className="popular-overlay">
//                   <h4>{item.title}</h4>
//                   <button onClick={() => navigate(item.link)}>
//                     Enquire Now
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </Carousel>
//         </div>
//       </section>

//       <FeatureList />
//       <CategoryForLandingPage />
//     </>
//   );
// };

// export default DesktopViewHome;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { supabase } from "../../services/supabaseClient";
import "./Desktop_css/Desktop_View_Home.css";
import "../Desktop_view/Panelwithprofile";

// ─── Icons ─────────────────────────────────────────
import {
  Factory,
  Plug,
  Cpu,
  Boxes,
  Plane,
  Zap,
  ShoppingBag,
  Hospital,
  Hotel,
  GraduationCap,
  Stethoscope,
  FlaskConical,
  Search,
  Building2,
  Wrench,
  Truck,
  Briefcase,
  Smartphone,
} from "lucide-react";

// ─── Swiper ───────────────────────────────────────
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "swiper/css/pagination";

// ─── Bootstrap ────────────────────────────────────
import { Row, Col } from "react-bootstrap";

// ─── Components ───────────────────────────────────
import FeatureList from "../Desktop_view/FeatureLists";
import CategoryForLandingPage from "../Desktop_view/CategoryForLandingPage";
import Panelwithprofile from "../Desktop_view/Panelwithprofile";

// ─── Keyword Utils ─────────────────────────────────
const CACHE_KEY = "desktop_home_keywords_v1";
const CACHE_TTL = 1000 * 60 * 60 * 6;

const normalizeKeyword = (word) =>
  word
    ?.toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/ies$/, "y")
    .replace(/s$/, "")
    .replace(/[^a-z0-9 ]/g, "");

const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const capitalize = (t) => t.charAt(0).toUpperCase() + t.slice(1);

// ─── Static Categories ─────────────────────────────
const DIRECTORY_CATEGORIES_B2C = [
  { title: "Hospital", icon: <Hospital />, keywords: "hospital" },
  { title: "Hotels", icon: <Hotel />, keywords: "hotel" },
  { title: "Colleges", icon: <GraduationCap />, keywords: "college" },
  { title: "Doctors", icon: <Stethoscope />, keywords: "doctor" },
  { title: "Shops / Parlour", icon: <ShoppingBag />, keywords: "shop,parlour" },
  { title: "Real Estate", icon: <Building2 />, keywords: "real estate" },
  { title: "Consultants", icon: <Briefcase />, keywords: "consultant" },
  { title: "Repair Services", icon: <Wrench />, keywords: "repair,service" },
];

const DIRECTORY_CATEGORIES_B2B = [
  { title: "Chemical", icon: <FlaskConical />, keywords: "chemical" },
  { title: "Electrical", icon: <Zap />, keywords: "electrical" },
  { title: "Steel / Builder", icon: <Factory />, keywords: "steel,builder" },
  { title: "CNC / Hydraulic", icon: <Cpu />, keywords: "cnc,hydraulic" },
  { title: "Electronics", icon: <Plug />, keywords: "electronics" },
  { title: "Exporters", icon: <Plane />, keywords: "export" },
  { title: "Logistics", icon: <Truck />, keywords: "logistics,transport" },
  { title: "Local Services", icon: <Boxes />, keywords: "local services" },
];

const DesktopViewHome = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState("B2C");
  const [search, setSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [homeVideoUrl, setHomeVideoUrl] = useState(null);
  const [banners, setBanners] = useState([]);

  const [popularSearchesBlue, setPopularSearchesBlue] = useState([]);
  const [popularSearchesRed, setPopularSearchesRed] = useState([]);
  const [popularSearchesGreen, setPopularSearchesGreen] = useState([]);

  const [productCategories, setProductCategories] = useState([]);
  const [industrialCategories, setIndustrialCategories] = useState([]);

  useEffect(() => {
    loadHomeVideo();
    loadBanners();
    loadIndustrialProducts();
    debounce(fetchKeywords, 400)();
  }, []);

  // ─── Media ───────────────────────────────────────
  const loadHomeVideo = async () => {
    const { data } = await supabase
      .from("home_medias")
      .select("video_url")
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    setHomeVideoUrl(data?.video_url || null);
  };

  const loadBanners = async () => {
    const { data } = await supabase.from("app_banner").select("*");
    setBanners(data || []);
  };

  // ─── Industrial Products (keyword_images) ─────────
  const loadIndustrialProducts = async () => {
    const { data, error } = await supabase
      .from("keyword_images")
      .select("keyword, image_url, image_title")
      .order("updated_at", { ascending: false })
      .limit(20);

    if (error) return console.error(error);

    setProductCategories(
      data.map((row) => ({
        title: row.image_title || capitalize(row.keyword),
        keyword: row.keyword,
        img: row.image_url,
      }))
    );
  };

  // ─── Popular Keywords (profiles) ──────────────────
  const fetchKeywords = async () => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_TTL) {
        applyKeywords(parsed.data);
        return;
      }
    }

    const { data } = await supabase
      .from("profiles")
      .select("keywords")
      .not("keywords", "is", null);

    const freq = {};
    data.forEach((r) =>
      r.keywords
        ?.split(",")
        .map(normalizeKeyword)
        .filter(Boolean)
        .forEach((k) => (freq[k] = (freq[k] || 0) + 1))
    );

    const sorted = Object.keys(freq).sort((a, b) => freq[b] - freq[a]);

    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ timestamp: Date.now(), data: sorted })
    );

    applyKeywords(sorted);
  };

  const applyKeywords = (keywords) => {
    const top = keywords.slice(0, 30);

    setPopularSearchesBlue(
      top.slice(0, 10).map((k) => ({
        title: capitalize(k),
        image: "/images/default-category.jpg",
        link: `/directory?keywords=${k}`,
      }))
    );

    setPopularSearchesRed(
      top.slice(10, 20).map((k) => ({
        title: capitalize(k),
        image: "/images/default-category.jpg",
        link: `/directory?keywords=${k}`,
      }))
    );

    setPopularSearchesGreen(
      top.slice(20, 30).map((k) => ({
        title: capitalize(k),
        image: "/images/default-category.jpg",
        link: `/directory?keywords=${k}`,
      }))
    );

    const groups = [];
    for (let i = 0; i < top.length && groups.length < 3; i += 2) {
      groups.push(top.slice(i, i + 2));
    }

    setIndustrialCategories(
      groups.map((g, i) => ({
        title: `Category ${i + 1}`,
        bg: ["#e3f2fd", "#e8f5e9", "#fff3e0"][i],
        items: g.map((k) => ({
          name: capitalize(k),
          img: `https://placehold.co/40x40?text=${capitalize(k)}`,
        })),
      }))
    );
  };

  const categories =
    mode === "B2C" ? DIRECTORY_CATEGORIES_B2C : DIRECTORY_CATEGORIES_B2B;

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set("keywords", search);
    if (locationSearch) params.set("location", locationSearch);
    navigate(`/directory?${params}`);
  };


  const goToSearchPage = () => {
    navigate("/directory");
  };


  return (
    <>
      {/* GLOBAL SEARCH */}
      <div className="desktop-global-search">
        <p className="search-label">
          Find Your Next Business Partner & <span>"Promote Your Business"</span>
        </p>

        <div className="search-row-wrapper">
          <div className="search-row">
            <div className="search-box">
              <Search size={18} />
              <input
                placeholder="Keyword, business, category"
                value={search}
                onFocus={goToSearchPage}
                onClick={goToSearchPage}
                readOnly
              />

            </div>

            <div className="search-box">
              <Search size={18} />
              <input
                placeholder="Location / Area / City"
                value={locationSearch}
                onFocus={goToSearchPage}
                onClick={goToSearchPage}
                readOnly
              />

            </div>

            <button className="search-btn" onClick={handleSearch}>
              Search
            </button>
          </div>

          <button
            className="download-app-btn"
            onClick={() =>
              window.open(
                "https://play.google.com/store/apps/details?id=com.celfonphonebookapp",
                "_blank"
              )
            }
          >
            <Smartphone size={18} className="download-phone" />
            <span>Download App</span>
          </button>
        </div>
      </div>

      {/* HERO */}
      <section className="desktop-hero">
        <div className="hero-left">
          {homeVideoUrl ? (
            <video src={homeVideoUrl} autoPlay muted loop playsInline />
          ) : (
            <Carousel
              autoPlay
              infiniteLoop
              showThumbs={false}
              showStatus={false}
              showArrows={true}
              interval={5000}
            >
              {banners.map((b, i) => (
                <div key={i}>
                  <img src={b.image_url} alt={b.title || `Banner ${i + 1}`} />
                </div>
              ))}
            </Carousel>
          )}
        </div>

        <div className="hero-right">
          <div className="category-header">
            <h4>Browse Categories</h4>
            <div className="toggle">
              <button
                className={mode === "B2C" ? "active" : ""}
                onClick={() => setMode("B2C")}
              >
                B2C
              </button>
              <button
                className={mode === "B2B" ? "active" : ""}
                onClick={() => setMode("B2B")}
              >
                B2B
              </button>
            </div>
          </div>

          <div className={`category-box-grid ${mode.toLowerCase()}`}>
            {categories.map((item, i) => (
              <div
                key={i}
                className="category-box"
                onClick={() =>
                  navigate(
                    `/directory?userType=${mode}&keywords=${encodeURIComponent(
                      item.keywords
                    )}`
                  )
                }
              >
                {item.icon}
                <span>{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIAL PRODUCTS */}
      <section className="industrial-products-section">
        <h2 className="section-title">Search By Industrial Products</h2>
        <p className="section-subtitle">
          Explore manufacturers and businesses by your preferred category
        </p>

        <Swiper
          modules={[Autoplay, Navigation]}
          loop

          autoplay={{ delay: 2000, pauseOnMouseEnter: true }}
          spaceBetween={20}
          breakpoints={{
            320: { slidesPerView: 2.5 },
            576: { slidesPerView: 4 },
            768: { slidesPerView: 5 },
            992: { slidesPerView: 6 },
            1200: { slidesPerView: 7 },
          }}
        >
          {productCategories.map((item, i) => (
            <SwiperSlide key={i}>
              <div
                className="industrial-product-card popup"
                onClick={() =>
                  navigate(`/directory?keywords=${encodeURIComponent(item.title)}`)
                }
              >
                <div className="product-circle">
                  <img src={item.img} alt={item.title} />
                </div>
                <span className="product-title">{item.title}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* INDUSTRIAL CATEGORIES */}
      <section className="industrial-section">
        <div className="container">
          <Row className="industrial-row flex-nowrap justify-content-center">
            {industrialCategories.slice(0, 3).map((category, i) => (
              <Col key={i} xl={4} lg={4} md={6} sm={12}>
                <div className="industrial-card" style={{ background: category.bg }}>
                  <div className="industrial-header">
                    <h5>{category.title}</h5>
                    <span
                      className="view-all"
                      onClick={() =>
                        navigate(`/directory?keywords=${encodeURIComponent(category.title)}`)
                      }
                    >
                      View all
                    </span>
                  </div>

                  <div className="industrial-items-row">
                    {category.items.map((item, j) => (
                      <div
                        key={j}
                        className="industrial-item"
                        onClick={() =>
                          navigate(`/directory?keywords=${encodeURIComponent(item.name)}`)
                        }
                      >
                        <img src={item.img} alt={item.name} />
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      <FeatureList />

      {/* POPULAR SEARCHES - Blue variant (Top 10) */}
      <section className="popular-searches">
        <div className="popular-layout">
          <div className="popular-heading-card blue">
            <h2>
              Most Searched
              <br />

            </h2>
            <p>Discover what businesses people are looking for today</p>
          </div>

          <div className="popular-swiper-wrapper">
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              pagination={{ clickable: true }}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 5 },
              }}
              className="popular-swiper"
            >
              {popularSearchesBlue.map((item, i) => (
                <SwiperSlide key={i}>
                  <div className="popular-card">
                    <img src={item.image} alt={item.title} />
                    <div className="popular-overlay">
                      <h4>{item.title}</h4>
                      <button onClick={() => navigate(item.link)}>
                        Enquire Now
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* POPULAR SEARCHES - Red variant (Next 10) */}
      <section className="popular-searches">
        <div className="popular-layout">
          <div className="popular-heading-card red">
            <h2>
              Top Picks
              <br />
              This Week
            </h2>
            <p>See what everyone is searching for right now</p>
          </div>

          <div className="popular-swiper-wrapper">
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              pagination={{ clickable: true }}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 5 },
              }}
              className="popular-swiper"
            >
              {popularSearchesRed.map((item, i) => (
                <SwiperSlide key={i}>
                  <div className="popular-card">
                    <img src={item.image} alt={item.title} />
                    <div className="popular-overlay">
                      <h4>{item.title}</h4>
                      <button onClick={() => navigate(item.link)}>
                        Enquire Now
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* POPULAR SEARCHES - Green variant (Next 10) */}
      <section className="popular-searches">
        <div className="popular-layout">
          <div className="popular-heading-card green">
            <h2>
              High Demand
              <br />
              Categories
            </h2>
            <p>Popular services people need the most</p>
          </div>

          <div className="popular-swiper-wrapper">
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              pagination={{ clickable: true }}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 5 },
              }}
              className="popular-swiper"
            >
              {popularSearchesGreen.map((item, i) => (
                <SwiperSlide key={i}>
                  <div className="popular-card">
                    <img src={item.image} alt={item.title} />
                    <div className="popular-overlay">
                      <h4>{item.title}</h4>
                      <button onClick={() => navigate(item.link)}>
                        Enquire Now
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      <Panelwithprofile />
      <CategoryForLandingPage />
    </>
  );
};

export default DesktopViewHome;