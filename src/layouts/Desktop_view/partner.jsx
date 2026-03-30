// import { useNavigate } from "react-router-dom";
// import "./Desktop_css/partner.css";

// const Partner = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="partner-page">
//       <h1 className="partner-title">Become a Partner</h1>
//       <p className="partner-subtitle">
//         Choose how you want to collaborate with Signpost
//       </p>

//       <div className="partner-cards">
//         {/* Connecting Hub */}
//         <div
//           className="partner-card"
//           onClick={() => navigate("/login")}
//         >
//           <h2>Connecting Hub</h2>
//           <p>
//             Act as a local or digital hub connecting businesses,
//             professionals, and customers.
//           </p>
//           <span className="partner-cta">Get Started →</span>
//         </div>

//         {/* Revenue Partner */}
//         <div
//           className="partner-card"
//           onClick={() => navigate("/login")}
//         >
//           <h2>Revenue Partner</h2>
//           <p>
//             Earn revenue by promoting, onboarding, and supporting
//             businesses on the platform.
//           </p>
//           <span className="partner-cta">Join Now →</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Partner;



// import { useState, useEffect } from "react";
// import Swal from "sweetalert2";
// import { supabase } from "../../services/supabaseClient";
// import "./Desktop_css/partner.css";
// import "bootstrap/dist/css/bootstrap.min.css";

// const Partner = () => {
//   const [profileType, setProfileType] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [mobileExists, setMobileExists] = useState(false);
//   const [touched, setTouched] = useState({}); // 🔹 added

//   useEffect(() => {
//     const checkMobile = async () => {
//       if (formData.mobile_number?.length === 10) {
//         const { data: existingUser } = await supabase
//           .from("profiles")
//           .select("id")
//           .eq("mobile_number", formData.mobile_number)
//           .single();

//         setMobileExists(!!existingUser);
//       } else {
//         setMobileExists(false);
//       }
//     };

//     checkMobile();
//   }, [formData.mobile_number]);

//   const getInitialState = (type) => {
//     return type === "business"
//       ? {
//           profile_type: "business",
//           mobile_number: "",
//           business_name: "",
//           owner_name: "",
//           owner_prefix: "",
//           keywords: [],
//           description: "",
//           landline_code: "",
//           landline_number: "",
//           door_no: "",
//           street_name: "",
//           area: "",
//           city: "",
//           pincode: "",
//           email: "",
//           promo_code: "",
//           business_prefix: "M/s.",
//         }
//       : {
//           profile_type: "person",
//           mobile_number: "",
//           person_name: "",
//           person_prefix: "",
//           profession: "",
//           landline_code: "",
//           landline_number: "",
//           door_no: "",
//           street_name: "",
//           area: "",
//           city: "",
//           pincode: "",
//           email: "",
//           promo_code: "",
//         };
//   };

//   const handleTypeSelection = (type) => {
//     setProfileType(type);
//     setFormData(getInitialState(type));
//     setTouched({});
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setTouched({ ...touched, [name]: true });

//     if (name === "keywords") {
//       setFormData({
//         ...formData,
//         [name]: value.split(",").map((kw) => kw.trim()),
//       });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   // 🔹 Live validation helpers
//   const isRequiredValid = (name) =>
//     formData[name] &&
//     (!Array.isArray(formData[name]) || formData[name].length > 0);

//   const isMobileValid = () => /^[6-9]\d{9}$/.test(formData.mobile_number || "");

//   const fieldClass = (name, customCheck) => {
//     if (!touched[name]) return "form-control";
//     const valid = customCheck ? customCheck() : isRequiredValid(name);
//     return `form-control ${valid ? "is-valid" : "is-invalid"}`;
//   };

//   const validateForm = () => {
//     const requiredFields =
//       profileType === "business"
//         ? [
//             "mobile_number",
//             "business_name",
//             "owner_name",
//             "owner_prefix",
//             "keywords",
//             "door_no",
//             "street_name",
//             "area",
//             "city",
//             "pincode",
//           ]
//         : [
//             "mobile_number",
//             "person_name",
//             "person_prefix",
//             "profession",
//             "door_no",
//             "street_name",
//             "area",
//             "city",
//             "pincode",
//           ];

//     for (let field of requiredFields) {
//       if (!isRequiredValid(field)) {
//         Swal.fire({
//           icon: "warning",
//           title: "Validation Error",
//           text: `${field.replace(/_/g, " ")} is required.`,
//         });
//         return false;
//       }
//     }

//     if (!isMobileValid()) {
//       Swal.fire({
//         icon: "warning",
//         title: "Validation Error",
//         text: "Invalid mobile number",
//       });
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     try {
//       const { data: existingUser } = await supabase
//         .from("profiles")
//         .select("id")
//         .eq("mobile_number", formData.mobile_number)
//         .single();

//       if (existingUser) {
//         Swal.fire({
//           icon: "error",
//           title: "Registration Failed",
//           text: "Mobile number already exists",
//         });
//         return;
//       }

//       const cleanedData = Object.fromEntries(
//         Object.entries(formData).map(([k, v]) => [k, v === "" ? null : v])
//       );

//       const { error } = await supabase.from("profiles").insert([cleanedData]);

//       if (error) throw error;

//       Swal.fire("Success", "Form submitted successfully!", "success");

//       setFormData(getInitialState(profileType));
//       setProfileType(null);
//     } catch (err) {
//       Swal.fire("Error", "Something went wrong", "error");
//     }
//   };

//   if (!profileType) {
//     return (
//       <div className="WholeSection d-flex align-items-center justify-content-center">
//           <div className="cardd p-4 shadow" style={{ width: "90%" }}>
//           <h2 className="text-center fw-bold">MEDIA PATNER</h2>
//           <p className="text-center">By adding</p>
//           <h2 className="text-center fw-bold">Choose account type</h2>

//           <div className="row mt-4">
//             <div className="col-md-6 mb-3">
//               <div className="border rounded text-center p-4 h-100">
//                 {/* Person SVG */}
//                 <div className="mb-3">
//                   <svg
//                     width="48"
//                     height="48"
//                     viewBox="0 0 24 24"
//                     fill="#007bff"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 1.2c-3.2 0-9.6 1.6-9.6 4.8V21h19.2v-3c0-3.2-6.4-4.8-9.6-4.8z" />
//                   </svg>
//                 </div>
//                 <h5 className="fw-bold">Person</h5>
//                 <p>Looking for services? Create an account and explore.</p>
//                 <button
//                   className="btn btn-primary"
//                   onClick={() => handleTypeSelection("person")}
//                 >
//                   Create a Person Account
//                 </button>
//               </div>
//             </div>

//             <div className="col-md-6 mb-3">
//               <div className="border rounded text-center p-4 h-100">
//                 {/* Business SVG */}
//                 <div className="mb-3">
//                   <svg
//                     width="48"
//                     height="48"
//                     viewBox="0 0 24 24"
//                     fill="#fbbd08"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm4 2h4v2h-4V8zm0 4h4v2h-4v-2z" />
//                   </svg>
//                 </div>
//                 <h5 className="fw-bold">Business</h5>
//                 <p>Promote your business and reach your audience.</p>
//                 <button
//                   className="btn btn-warning text-white"
//                   onClick={() => handleTypeSelection("business")}
//                 >
//                   Create a Business Account
//                 </button>
//               </div>
//             </div>
//           </div>

//           <p className="text-center mt-4 small">
//             By Adding and inviting people, You’ll be rewarded for every
//             successful member.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="signup-container">
//       <div className="form-card">
//         {/* 🔹 BACK BUTTON */}
//         <button
//           type="button"
//           className="btn btn-outline-secondary mb-3"
//           onClick={() => {
//             setProfileType(null);
//             setFormData({});
//           }}
//         >
//           ← Back
//         </button>

//         <form onSubmit={handleSubmit}>
//           <div className="row">
//             <div className="col-md-6 mb-3">
//               <label>Mobile Number *</label>
//               <input
//                 type="text"
//                 name="mobile_number"
//                 value={formData.mobile_number}
//                 onChange={handleChange}
//                 className={fieldClass("mobile_number", isMobileValid)}
//               />
//               {mobileExists && (
//                 <small className="text-danger">
//                   Mobile number already registered
//                 </small>
//               )}
//             </div>

//             {profileType === "business" ? (
//               <>
//                 <div className="col-md-6 mb-3">
//                   <label>Business Name *</label>
//                   <input
//                     name="business_name"
//                     value={formData.business_name}
//                     onChange={handleChange}
//                     className={fieldClass("business_name")}
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label>Owner Name *</label>
//                   <input
//                     name="owner_name"
//                     value={formData.owner_name}
//                     onChange={handleChange}
//                     className={fieldClass("owner_name")}
//                   />
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="col-md-6 mb-3">
//                   <label>Person Name *</label>
//                   <input
//                     name="person_name"
//                     value={formData.person_name}
//                     onChange={handleChange}
//                     className={fieldClass("person_name")}
//                   />
//                 </div>
//               </>
//             )}
//           </div>

//           <div className="text-center">
//             <button className="btn btn-success" type="submit" disabled={mobileExists}>
//               Submit
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Partner;







// import { useState, useEffect } from "react";
// import Swal from "sweetalert2";
// import { supabase } from "../../services/supabaseClient";
// import "./Desktop_css/partner.css";
// import "bootstrap/dist/css/bootstrap.min.css";

// const Partner = () => {
//   const [profileType, setProfileType] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [mobileExists, setMobileExists] = useState(false);

//   useEffect(() => {
//     const checkMobile = async () => {
//       if (formData.mobile_number?.length === 10) {
//         const { data: existingUser } = await supabase
//           .from("profiles")
//           .select("id")
//           .eq("mobile_number", formData.mobile_number)
//           .single();

//         setMobileExists(!!existingUser);
//       } else {
//         setMobileExists(false);
//       }
//     };

//     checkMobile();
//   }, [formData.mobile_number]);

//   const getInitialState = (type) => {
//     return type === "business"
//       ? {
//         profile_type: "business",
//         mobile_number: "",
//         business_name: "",
//         owner_name: "",
//         owner_prefix: "",
//         keywords: [],
//         description: "",
//         landline_code: "",
//         landline_number: "",
//         door_no: "",
//         street_name: "",
//         area: "",
//         city: "",
//         pincode: "",
//         email: "",
//         promo_code: "",
//         business_prefix: "M/s.",
//       }
//       : {
//         profile_type: "person",
//         mobile_number: "",
//         person_name: "",
//         person_prefix: "",
//         profession: "",
//         landline_code: "",
//         landline_number: "",
//         door_no: "",
//         street_name: "",
//         area: "",
//         city: "",
//         pincode: "",
//         email: "",
//         promo_code: "",
//       };
//   };

//   const handleTypeSelection = (type) => {
//     setProfileType(type);
//     setFormData(getInitialState(type));
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "keywords") {
//       setFormData({
//         ...formData,
//         [name]: value.split(",").map((kw) => kw.trim()),
//       });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const validateForm = () => {
//     if (profileType === "business") {
//       const requiredFields = [
//         "mobile_number",
//         "business_name",
//         "owner_name",
//         "owner_prefix",
//         "keywords",
//         "door_no",
//         "street_name",
//         "area",
//         "city",
//         "pincode",
//       ];

//       for (let field of requiredFields) {
//         if (
//           !formData[field] ||
//           (Array.isArray(formData[field]) && formData[field].length === 0)
//         ) {
//           Swal.fire({
//             icon: "warning",
//             title: "Validation Error",
//             text: `${field.replace(/_/g, " ")} is required.`,
//           });
//           return false;
//         }
//       }
//     } else if (profileType === "person") {
//       const requiredFields = [
//         "mobile_number",
//         "person_name",
//         "person_prefix",
//         "profession",
//         "door_no",
//         "street_name",
//         "area",
//         "city",
//         "pincode",
//       ];

//       for (let field of requiredFields) {
//         if (
//           !formData[field] ||
//           (Array.isArray(formData[field]) && formData[field].length === 0)
//         ) {
//           Swal.fire({
//             icon: "warning",
//             title: "Validation Error",
//             text: `${field.replace(/_/g, " ")} is required.`,
//           });
//           return false;
//         }
//       }
//     } else {
//       Swal.fire({
//         icon: "warning",
//         title: "Validation Error",
//         text: "Please select a profile type.",
//       });
//       return false;
//     }

//     const mobilePattern = /^[6-9]\d{9}$/;
//     if (!mobilePattern.test(formData.mobile_number)) {
//       Swal.fire({
//         icon: "warning",
//         title: "Validation Error",
//         text: "Invalid mobile number (must start with 6-9 and be 10 digits)",
//       });
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     try {



//       if (signupError) {
//         Swal.fire({
//           icon: "error",
//           title: "Signup Error",
//           text: signupError.message,
//         });
//         return;
//       }

//       const userId = signupData.user?.id;
//       if (!userId) {
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: "Could not retrieve user ID after signup.",
//         });
//         return;
//       }

//       // 2. Check if mobile already exists in profiles
//       const { data: existingUser } = await supabase
//         .from("profiles")
//         .select("id")
//         .eq("mobile_number", formData.mobile_number)
//         .single();

//       if (existingUser) {
//         Swal.fire({
//           icon: "error",
//           title: "Registration Failed",
//           text: "Mobile number is already registered.",
//         });
//         return;
//       }

//       // 3. Prepare cleaned data including user_id
//       const cleanedData = Object.fromEntries(
//         Object.entries({
//           ...formData,
//           user_id: userId,
//         }).map(([key, value]) => [key, value === "" ? null : value])
//       );

//       // 4. Insert into profiles
//       // 4. Insert into profiles
//       const { data, error } = await supabase.from("profiles").insert([cleanedData]);

//       if (error) {
//         console.error("Supabase Error:", error);
//         Swal.fire({
//           icon: "error",
//           title: "Submission Error",
//           text: "Error submitting form. Please try again later.",
//         });
//       } else {
//         Swal.fire({
//           icon: "success",
//           title: "Success",
//           text: "Form submitted successfully!",
//         });

//         // --- Send SMS after successful registration ---
//         const smsBody = encodeURIComponent(
//           `Dear sir,
// Signpost PHONE BOOK is a portal for Mobile Number Finder & Dialer with Digital Marketing. Please kindly view and verify the correctness of details on your firm, at the earliest.

// URL :- www.signpostphonebook.in
// User name :- ${formData.mobile_number}
// Password :- Signpost

// You can use the PHONE BOOK for your business promotion in any desired (Pincode) area so Entire Coimbatore`
//         );

//         const smsLink = `sms:${formData.mobile_number}?body=${smsBody}`;

//         setTimeout(() => {
//           window.location.href = smsLink;
//         }, 2000);
//         // ---------------------------------------------

//         setFormData(getInitialState(profileType));
//         setProfileType(null); // reset profile type after successful submit
//       }

//     } catch (err) {
//       console.error(err);
//       Swal.fire({
//         icon: "error",
//         title: "Unexpected Error",
//         text: "Something went wrong. Please try again later.",
//       });
//     }
//   };

//   if (!profileType) {
//     return (
// <div className="WholeSection  d-flex align-items-center justify-content-center">
//         <div className="cardd p-4 shadow" style={{ width: "90%" }}>
//           <h2 className="text-center fw-bold">MEDIA PATNER</h2>
//           <p className="text-center">By adding</p>
//           <h2 className="text-center fw-bold">Choose account type</h2>

//           <div className="row mt-4">
//             <div className="col-md-6 mb-3">
//               <div className="border rounded text-center p-4 h-100">
//                 {/* Person SVG */}
//                 <div className="mb-3">
//                   <svg
//                     width="48"
//                     height="48"
//                     viewBox="0 0 24 24"
//                     fill="#007bff"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 1.2c-3.2 0-9.6 1.6-9.6 4.8V21h19.2v-3c0-3.2-6.4-4.8-9.6-4.8z" />
//                   </svg>
//                 </div>
//                 <h5 className="fw-bold">Person</h5>
//                 <p>Looking for services? Create an account and explore.</p>
//                 <button
//                   className="btn btn-primary"
//                   onClick={() => handleTypeSelection("person")}
//                 >
//                   Create a Person Account
//                 </button>
//               </div>
//             </div>

//             <div className="col-md-6 mb-3">
//               <div className="border rounded text-center p-4 h-100">
//                 {/* Business SVG */}
//                 <div className="mb-3">
//                   <svg
//                     width="48"
//                     height="48"
//                     viewBox="0 0 24 24"
//                     fill="#fbbd08"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm4 2h4v2h-4V8zm0 4h4v2h-4v-2z" />
//                   </svg>
//                 </div>
//                 <h5 className="fw-bold">Business</h5>
//                 <p>Promote your business and reach your audience.</p>
//                 <button
//                   className="btn btn-warning text-white"
//                   onClick={() => handleTypeSelection("business")}
//                 >
//                   Create a Business Account
//                 </button>
//               </div>
//             </div>
//           </div>

//           <p className="text-center mt-4 small">
//             By Adding and inviting people, You’ll be rewarded for every
//             successful member.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // Render form after selection
//   return (
//     <div className="signup-container">
//       <div className="form-card">
//         <form onSubmit={handleSubmit}>
//           <div className="row">
//             <div className="col-md-6 mb-3">
//               <label>Mobile Number *</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="mobile_number"
//                 value={formData.mobile_number}
//                 onChange={handleChange}
//               />
//               {mobileExists && (
//                 <small className="text-danger">
//                   Mobile number is already registered.
//                 </small>
//               )}
//             </div>

//             {profileType === "business" ? (
//               <>
//                 <div className="col-md-6 mb-3">
//                   <label>Business Name *</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="business_name"
//                     value={formData.business_name}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label>Owner Name *</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="owner_name"
//                     value={formData.owner_name}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="d-block mb-2">Owner Prefix *</label>
//                   <div className="form-check form-check-inline">
//                     <input
//                       className="form-check-input"
//                       type="radio"
//                       name="owner_prefix"
//                       value="Mr."
//                       checked={formData.owner_prefix === "Mr."}
//                       onChange={handleChange}
//                     />
//                     <label className="form-check-label">Mr.</label>
//                   </div>
//                   <div className="form-check form-check-inline">
//                     <input
//                       className="form-check-input"
//                       type="radio"
//                       name="owner_prefix"
//                       value="Ms."
//                       checked={formData.owner_prefix === "Ms."}
//                       onChange={handleChange}
//                     />
//                     <label className="form-check-label">Ms.</label>
//                   </div>
//                 </div>

//                 <div className="col-12 mb-3">
//                   <label>Keywords (comma separated) *</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="keywords"
//                     value={formData.keywords.join(", ")}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div className="col-12 mb-3">
//                   <label>Description</label>
//                   <textarea
//                     className="form-control"
//                     name="description"
//                     value={formData.description}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="col-md-6 mb-3">
//                   <label>Person Name *</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="person_name"
//                     value={formData.person_name}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="d-block mb-2">Person Prefix *</label>
//                   <div className="form-check form-check-inline">
//                     <input
//                       className="form-check-input"
//                       type="radio"
//                       name="person_prefix"
//                       value="Mr."
//                       checked={formData.person_prefix === "Mr."}
//                       onChange={handleChange}
//                       id="personPrefixMr"
//                     />
//                     <label
//                       className="form-check-label"
//                       htmlFor="personPrefixMr"
//                     >
//                       Mr.
//                     </label>
//                   </div>
//                   <div className="form-check form-check-inline">
//                     <input
//                       className="form-check-input"
//                       type="radio"
//                       name="person_prefix"
//                       value="Ms."
//                       checked={formData.person_prefix === "Ms."}
//                       onChange={handleChange}
//                       id="personPrefixMs"
//                     />
//                     <label
//                       className="form-check-label"
//                       htmlFor="personPrefixMs"
//                     >
//                       Ms.
//                     </label>
//                   </div>
//                 </div>

//                 <div className="col-12 mb-3">
//                   <label>Profession *</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="profession"
//                     value={formData.profession}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </>
//             )}

//             {/* Common Fields */}
//             <div className="col-md-3 mb-3">
//               <label>Landline Code</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="landline_code"
//                 value={formData.landline_code}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="col-md-3 mb-3">
//               <label>Landline Number</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="landline_number"
//                 value={formData.landline_number}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-md-6 mb-3">
//               <label>Door No *</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="door_no"
//                 value={formData.door_no}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-md-6 mb-3">
//               <label>Street Name *</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="street_name"
//                 value={formData.street_name}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-md-6 mb-3">
//               <label>Area *</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="area"
//                 value={formData.area}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-md-4 mb-3">
//               <label>City *</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="city"
//                 value={formData.city}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-md-2 mb-3">
//               <label>Pincode *</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="pincode"
//                 value={formData.pincode}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-md-6 mb-3">
//               <label>Email</label>
//               <input
//                 type="email"
//                 className="form-control"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-md-6 mb-3">
//               <label>Promo Code</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="promo_code"
//                 value={formData.promo_code}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div className="text-center">
//             <button
//               className="btn btn-success"
//               type="submit"
//               disabled={mobileExists}
//             >
//               Submit
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Partner;






import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { supabase } from "../../services/supabaseClient";
import "./Desktop_css/partner.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Partner = () => {
  const [profileType, setProfileType] = useState(null);
  const [formData, setFormData] = useState({});
  const [mobileExists, setMobileExists] = useState(false);
  const [touched, setTouched] = useState({}); // to track which fields were touched

  useEffect(() => {
    const checkMobile = async () => {
      if (formData.mobile_number?.length === 10) {
        const { data: existingUser } = await supabase
          .from("profiles")
          .select("id")
          .eq("mobile_number", formData.mobile_number)
          .single();

        setMobileExists(!!existingUser);
      } else {
        setMobileExists(false);
      }
    };

    checkMobile();
  }, [formData.mobile_number]);

  const getInitialState = (type) => {
    return type === "business"
      ? {
          profile_type: "business",
          mobile_number: "",
          business_name: "",
          owner_name: "",
          owner_prefix: "",
          keywords: [],
          description: "",
          landline_code: "",
          landline_number: "",
          door_no: "",
          street_name: "",
          area: "",
          city: "",
          pincode: "",
          email: "",
          promo_code: "",
          business_prefix: "M/s.",
        }
      : {
          profile_type: "person",
          mobile_number: "",
          person_name: "",
          person_prefix: "",
          profession: "",
          landline_code: "",
          landline_number: "",
          door_no: "",
          street_name: "",
          area: "",
          city: "",
          pincode: "",
          email: "",
          promo_code: "",
        };
  };

  const handleTypeSelection = (type) => {
    setProfileType(type);
    setFormData(getInitialState(type));
    setTouched({}); // reset touched fields when changing type
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;

    // Special handling for pincode (only 6 digits)
    if (name === "pincode") {
      formattedValue = value.replace(/\D/g, "").slice(0, 6);
    }

    // Special handling for mobile number (only 10 digits)
    if (name === "mobile_number") {
      formattedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    if (name === "keywords") {
      setFormData({
        ...formData,
        [name]: formattedValue.split(",").map((kw) => kw.trim()),
      });
    } else {
      setFormData({ ...formData, [name]: formattedValue });
    }

    // Mark field as touched
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const getInputClass = (fieldName, value, extraCondition = true) => {
    if (!touched[fieldName]) return "form-control";
    if (!value || !extraCondition) return "form-control border-danger";
    return "form-control border-success";
  };

  const validateForm = () => {
    if (profileType === "business") {
      const requiredFields = [
        "mobile_number",
        "business_name",
        "owner_name",
        "owner_prefix",
        "keywords",
        "door_no",
        "street_name",
        "area",
        "city",
        "pincode",
      ];

      for (let field of requiredFields) {
        if (
          !formData[field] ||
          (Array.isArray(formData[field]) && formData[field].length === 0)
        ) {
          Swal.fire({
            icon: "warning",
            title: "Validation Error",
            text: `${field.replace(/_/g, " ")} is required.`,
          });
          return false;
        }
      }
    } else if (profileType === "person") {
      const requiredFields = [
        "mobile_number",
        "person_name",
        "person_prefix",
        "profession",
        "door_no",
        "street_name",
        "area",
        "city",
        "pincode",
      ];

      for (let field of requiredFields) {
        if (
          !formData[field] ||
          (Array.isArray(formData[field]) && formData[field].length === 0)
        ) {
          Swal.fire({
            icon: "warning",
            title: "Validation Error",
            text: `${field.replace(/_/g, " ")} is required.`,
          });
          return false;
        }
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please select a profile type.",
      });
      return false;
    }

    const mobilePattern = /^[6-9]\d{9}$/;
    if (!mobilePattern.test(formData.mobile_number)) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Invalid mobile number (must start with 6-9 and be 10 digits)",
      });
      return false;
    }

    if (formData.pincode.length !== 6) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Pincode must be exactly 6 digits",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Your signup logic here (was missing in original)
      // const { data: signupData, error: signupError } = await supabase.auth.signUp({...});

      // For now — assuming you complete the signup part later
      // -------------------------------------------------------

      const userId = "temp-user-id"; // ← replace with real userId after signup

      // Check if mobile already exists in profiles
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("mobile_number", formData.mobile_number)
        .single();

      if (existingUser) {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: "Mobile number is already registered.",
        });
        return;
      }

      const cleanedData = Object.fromEntries(
        Object.entries({
          ...formData,
          user_id: userId,
        }).map(([key, value]) => [key, value === "" ? null : value])
      );

      const { data, error } = await supabase.from("profiles").insert([cleanedData]);

      if (error) {
        console.error("Supabase Error:", error);
        Swal.fire({
          icon: "error",
          title: "Submission Error",
          text: "Error submitting form. Please try again later.",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Form submitted successfully!",
        });

        const smsBody = encodeURIComponent(
          `Dear sir,\nSignpost PHONE BOOK is a portal for Mobile Number Finder & Dialer with Digital Marketing. Please kindly view and verify the correctness of details on your firm, at the earliest.\n\nURL :- www.signpostphonebook.in\nUser name :- ${formData.mobile_number}\nPassword :- Signpost\n\nYou can use the PHONE BOOK for your business promotion in any desired (Pincode) area so Entire Coimbatore`
        );

        const smsLink = `sms:${formData.mobile_number}?body=${smsBody}`;

        setTimeout(() => {
          window.location.href = smsLink;
        }, 2000);

        setFormData(getInitialState(profileType));
        setProfileType(null);
        setTouched({});
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Unexpected Error",
        text: "Something went wrong. Please try again later.",
      });
    }
  };

  if (!profileType) {
    return (
      <div className="WholeSection d-flex align-items-center justify-content-center">
        <div className="cardd p-4 shadow" style={{ width: "90%", maxWidth: "700px" }}>
          <h2 className="text-center fw-bold">MEDIA PARTNER</h2>
          <p className="text-center">By adding</p>
          <h2 className="text-center fw-bold">Choose account type</h2>

          <div className="row mt-4">
            <div className="col-md-6 mb-3">
              <div className="border rounded text-center p-4 h-100">
                <div className="mb-3">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="#007bff" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 1.2c-3.2 0-9.6 1.6-9.6 4.8V21h19.2v-3c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </div>
                <h5 className="fw-bold">Person</h5>
                <p>Looking for services? Create an account and explore.</p>
                <button className="btn btn-primary" onClick={() => handleTypeSelection("person")}>
                  Create a Person Account
                </button>
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <div className="border rounded text-center p-4 h-100">
                <div className="mb-3">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="#fbbd08" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm4 2h4v2h-4V8zm0 4h4v2h-4v-2z" />
                  </svg>
                </div>
                <h5 className="fw-bold">Business</h5>
                <p>Promote your business and reach your audience.</p>
                <button className="btn btn-warning text-white" onClick={() => handleTypeSelection("business")}>
                  Create a Business Account
                </button>
              </div>
            </div>
          </div>

          <p className="text-center mt-4 small">
            By Adding and inviting people, You’ll be rewarded for every successful member.
          </p>
        </div>
      </div>
    );
  }

  // Form with back button + live validation
  return (
    <div className="signup-container p-3 p-md-5">
      <div className="form-card shadow p-4 p-md-5" style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              setProfileType(null);
              setTouched({});
            }}
          >
            ← Back
          </button>
          <h3 className="m-0">
            {profileType === "business" ? "Business Account" : "Person Account"}
          </h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Mobile Number *</label>
              <input
                type="text"
                className={getInputClass("mobile_number", formData.mobile_number, formData.mobile_number?.length === 10)}
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleChange}
                placeholder="Enter 10 digit mobile number"
                inputMode="numeric"
              />
              {mobileExists && (
                <small className="text-danger">Mobile number is already registered.</small>
              )}
              {touched.mobile_number && formData.mobile_number?.length > 0 && formData.mobile_number?.length !== 10 && (
                <small className="text-danger">Must be exactly 10 digits</small>
              )}
            </div>

            {profileType === "business" ? (
              <>
                <div className="col-md-6">
                  <label className="form-label">Business Name *</label>
                  <input
                    type="text"
                    className={getInputClass("business_name", formData.business_name)}
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Owner Name *</label>
                  <input
                    type="text"
                    className={getInputClass("owner_name", formData.owner_name)}
                    name="owner_name"
                    value={formData.owner_name}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label d-block mb-2">Owner Prefix *</label>
                  <div className="d-flex gap-3">
                    {["Mr.", "Ms."].map((prefix) => (
                      <div key={prefix} className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="owner_prefix"
                          value={prefix}
                          checked={formData.owner_prefix === prefix}
                          onChange={handleChange}
                        />
                        <label className="form-check-label">{prefix}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label">Keywords (comma separated) *</label>
                  <input
                    type="text"
                    className={getInputClass("keywords", formData.keywords?.length > 0)}
                    name="keywords"
                    value={formData.keywords?.join(", ")}
                    onChange={handleChange}
                    placeholder="e.g. plumber, electrician, ac repair"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="col-md-6">
                  <label className="form-label">Person Name *</label>
                  <input
                    type="text"
                    className={getInputClass("person_name", formData.person_name)}
                    name="person_name"
                    value={formData.person_name}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label d-block mb-2">Person Prefix *</label>
                  <div className="d-flex gap-3">
                    {["Mr.", "Ms."].map((prefix) => (
                      <div key={prefix} className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="person_prefix"
                          value={prefix}
                          checked={formData.person_prefix === prefix}
                          onChange={handleChange}
                        />
                        <label className="form-check-label">{prefix}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label">Profession *</label>
                  <input
                    type="text"
                    className={getInputClass("profession", formData.profession)}
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            {/* Common Fields */}
            <div className="col-md-3">
              <label className="form-label">Landline Code</label>
              <input
                type="text"
                className="form-control"
                name="landline_code"
                value={formData.landline_code}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Landline Number</label>
              <input
                type="text"
                className="form-control"
                name="landline_number"
                value={formData.landline_number}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Door No *</label>
              <input
                type="text"
                className={getInputClass("door_no", formData.door_no)}
                name="door_no"
                value={formData.door_no}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Street Name *</label>
              <input
                type="text"
                className={getInputClass("street_name", formData.street_name)}
                name="street_name"
                value={formData.street_name}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Area *</label>
              <input
                type="text"
                className={getInputClass("area", formData.area)}
                name="area"
                value={formData.area}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">City *</label>
              <input
                type="text"
                className={getInputClass("city", formData.city)}
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Pincode *</label>
              <input
                type="text"
                className={getInputClass("pincode", formData.pincode, formData.pincode?.length === 6)}
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="6 digits"
                maxLength={6}
                inputMode="numeric"
              />
              {touched.pincode && formData.pincode?.length > 0 && formData.pincode?.length !== 6 && (
                <small className="text-danger">Pincode must be 6 digits</small>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Promo Code</label>
              <input
                type="text"
                className="form-control"
                name="promo_code"
                value={formData.promo_code}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="text-center mt-5">
            <button
              className="btn btn-success btn-lg px-5"
              type="submit"
              disabled={mobileExists || !formData.mobile_number?.length === 10}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Partner;