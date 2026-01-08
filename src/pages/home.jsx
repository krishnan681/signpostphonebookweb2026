// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Row, Col, Form, Button } from "react-bootstrap";
// import { FaSearch } from "react-icons/fa";
// import "../css/home.css";
// import { useAuth } from "../context/AuthContext";

// // Components
// // import RecentlyListEnquiryModal from "../Components/RecentlyListEnquiryModal";
// // import CategoryForLandingPage from "../Components/CategoryForLandingPage";
// // import PopularSearches from "../Components/PopularSearches";
// // import LandingPageDataBase from "../Components/LandingPageDataBase";
// // import FeatureLists from "../Components/FeatureLists";

// // Supabase
// import { supabase } from "../services/supabaseClient";

// // Swiper + AOS
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import "aos/dist/aos.css";
// import AOS from "aos";

// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Navigation, Pagination } from "swiper/modules";

// // Animations
// // import RotatingText from "../Components/RotatingText";
// // import CircularText from "../Components/CircularText";

// // Images
// import MachineryImg from "../assets/images/Machinery.webp";
// import ElectricalImg from "../assets/images/Electrical.webp";
// import CNCImg from "../assets/images/CNC.webp";
// import MotorImg from "../assets/images/Motor.webp";
// import WaterPumpImg from "../assets/images/WaterPump.webp";
// import TextilesImg from "../assets/images/Textiles.webp";
// import MobileOne from "../assets/Images/Mobile-about_app.png";
// import googlePlay from "../assets/Images/Google-Play-Emblema.png";

// const Home = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const [query, setQuery] = useState("");
//   const [recentRecords, setRecentRecords] = useState([]);
//   const [premiumRecords, setPremiumRecords] = useState([]);

//   const [showModal, setShowModal] = useState(false);
//   const [selectedBusiness, setSelectedBusiness] = useState(null);

//   const handleEnquireClick = (business) => {
//     setSelectedBusiness(business);
//     setShowModal(true);
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (query.trim()) {
//       navigate(`/directory?query=${query}`);
//     }
//   };

//   // Init AOS
//   useEffect(() => {
//     AOS.init({ duration: 1000, once: true });
//   }, []);

//   // Fetch recently added profiles
//   useEffect(() => {
//     const fetchRecentData = async () => {
//       const { data, error } = await supabase
//         .from("profiles")
//         .select("*")
//         .order("created_at", { ascending: false })
//         .limit(6);

//       if (!error) setRecentRecords(data || []);
//     };

//     fetchRecentData();
//   }, []);

//   // Fetch premium profiles (is_prime)
//   useEffect(() => {
//     const fetchPremiumData = async () => {
//       const { data, error } = await supabase
//         .from("profiles")
//         .select("*")
//         .eq("is_prime", true)
//         .order("created_at", { ascending: false })
//         .limit(10);

//       if (!error) setPremiumRecords(data || []);
//     };

//     fetchPremiumData();
//   }, []);

//   const productCategories = [
//     { title: "Clothing", img: MachineryImg },
//     { title: "Xerox", img: ElectricalImg },
//     { title: "CNC", img: CNCImg },
//     { title: "Thread Rolling", img: MotorImg },
//     { title: "Pumps Sets", img: WaterPumpImg },
//     { title: "Industrial Packing", img: TextilesImg }
//   ];

//   const industrialCategories = [
//     {
//       title: "Machinery",
//       bg: "#e0f7fa",
//       items: [
//         { name: "Clothing", img: MachineryImg },
//         { name: "Lathe", img: MachineryImg },
//         { name: "Drilling", img: MachineryImg },
//         { name: "Cutting", img: MachineryImg }
//       ]
//     },
//     {
//       title: "Electrical",
//       bg: "#fce4ec",
//       items: [
//         { name: "Motors", img: ElectricalImg },
//         { name: "Wiring", img: ElectricalImg },
//         { name: "Batteries", img: ElectricalImg },
//         { name: "Panels", img: ElectricalImg }
//       ]
//     },
//     {
//       title: "Hardware",
//       bg: "#f9fbe7",
//       items: [
//         { name: "Bearings", img: CNCImg },
//         { name: "Pipes", img: CNCImg },
//         { name: "Fasteners", img: CNCImg },
//         { name: "Valves", img: CNCImg }
//       ]
//     }
//   ];

//   return (
//     <>
//       {/* HERO */}
//       <div className="hero-section d-flex flex-column align-items-center justify-content-center text-white position-relative">
//         <h2 className="hero-title fw-bold text-center">
//           Find Anyone, Anywhere and Promote Your Business
//         </h2>

//         <p className="text-center fs-5">
//           Discover your customers nearby, attract them with your offers & discounts.
//         </p>

//         <div className="d-flex align-items-center gap-2 fs-4 fw-bold mt-2">
//           <span className="hero-static-text">Search by category like</span>
//           <div className="rotating-box px-3 py-1 rounded">
//             {/* <RotatingText
//               texts={["Drilling", "MSME Services", "Pumps", "CNC Machines"]}
//               mainClassName="text-white fw-bold"
//               rotationInterval={2000}
//             /> */}
//           </div>
//         </div>

//         <Form onSubmit={handleSearch} className="search-box d-flex mt-3 w-50">
//           <Form.Control
//             type="text"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Search Business Name or products"
//             className="rounded-0 flex-grow-1"
//           />
//           <Button type="submit" variant="warning" className="rounded-0">
//             <FaSearch />
//           </Button>
//         </Form>
//       </div>

//       {/* INDUSTRIAL PRODUCTS */}
//       <div className="container my-5">
//         <h2 className="text-center fw-bold" data-aos="fade-up">
//           Search By Industrial Products
//         </h2>

//         <Swiper
//           modules={[Autoplay]}
//           spaceBetween={10}
//           slidesPerView={5}
//           loop
//           autoplay={{ delay: 2000 }}
//         >
//           {productCategories.map((item, i) => (
//             <SwiperSlide key={i}>
//               <div
//                 className="text-center"
//                 style={{ cursor: "pointer" }}
//                 onClick={() => navigate(`/directory?query=${item.title}`)}
//               >
//                 <img src={item.img} alt={item.title} width={80} />
//                 <div className="fw-semibold mt-2">{item.title}</div>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>

//       {/* RECENT LISTS */}
//       <div className="section-container mb-5">
//         <h3 className="fw-bold mb-3">Recently Added Lists</h3>
//         <Swiper modules={[Navigation]} spaceBetween={16} slidesPerView={4}>
//           {recentRecords.map((business, i) => (
//             <SwiperSlide key={i}>
//               <div className="business-card border rounded p-3">
//                 <h6 className="fw-bold">
//                   {business.business_name || business.person_name || "No Name"}
//                 </h6>
//                 <p className="text-muted">{business.city || "N/A"}</p>
//                 <button
//                   className="btn btn-warning btn-sm"
//                   onClick={() => handleEnquireClick(business)}
//                 >
//                   Enquire Now
//                 </button>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>

//       {/* PREMIUM LISTS */}
//       <div className="section-container mb-5">
//         <h3 className="fw-bold mb-3">Premium Listings</h3>
//         <Swiper modules={[Navigation]} spaceBetween={16} slidesPerView={3}>
//           {premiumRecords.map((business, i) => (
//             <SwiperSlide key={i}>
//               <div className="premium-card-with-bg text-white p-3">
//                 <h5>{business.business_name || business.person_name}</h5>
//                 <p>{business.city}</p>
//                 <button className="btn btn-warning btn-sm">Enquire</button>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>

//       {/* <RecentlyListEnquiryModal
//         show={showModal}
//         onClose={() => setShowModal(false)}
//         selectedBusiness={selectedBusiness}
//       />

//       <CategoryForLandingPage /> */}

//       {/* APP DOWNLOAD */}
//       <div className="container phonebook-wrapper">
//         <div className="promo-box">
//           <h2>Take PhoneBook with you. It's free!</h2>
//           <p>Download our app from Google Play</p>
//           <a
//             href="https://play.google.com"
//             target="_blank"
//             rel="noreferrer"
//           >
//             <img src={googlePlay} alt="Google Play" width={180} />
//           </a>
//         </div>
//         <img src={MobileOne} alt="App" className="mockup" />
//       </div>
//     </>
//   );
// };

// export default Home;