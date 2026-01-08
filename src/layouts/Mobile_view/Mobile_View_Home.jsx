import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { supabase } from "../../services/supabaseClient";
import "../Mobile_view/Mobile_css/Mobile_View_Home.css";

import {
    Hospital,
    Hotel,
    GraduationCap,
    Plane,
    Stethoscope,
    ShoppingBag,
    FlaskConical,
    Zap,
    Factory,
    Cpu,
    Plug,
    Boxes,
    Building2,
    Search
} from "lucide-react";


const MobileViewHome = () => {
    const navigate = useNavigate();
    const [welcomeMessage, setWelcomeMessage] = useState("Welcome Guest User");
    const [banners, setBanners] = useState([]);
    const [b2cCategories, setB2cCategories] = useState([]);
    const [b2bCategories, setB2bCategories] = useState([]);
    const [popularFirms, setPopularFirms] = useState([]);
    const [loadingBanners, setLoadingBanners] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingFirms, setLoadingFirms] = useState(true);

    // Demo fallback data
    const demoB2C = [
        { title: "Hospital", keywords: "hospital" },
        { title: "Hotels", keywords: "hotel" },
        { title: "Colleges", keywords: "college" },
        { title: "Travel", keywords: "travel" },
        { title: "Doctors", keywords: "doctor" },
        { title: "Shops", keywords: "shop" },
        { title: "Parlour", keywords: "parlour" },
    ];

    const demoB2B = [
        { title: "Chemical", keywords: "chemical" },
        { title: "Electrical", keywords: "electrical" },
        { title: "Steel", keywords: "steel" },
        { title: "CNC", keywords: "cnc" },
        { title: "Electronics", keywords: "electronics" },
        { title: "Builder", keywords: "builder" },
        { title: "Hydraulic", keywords: "hydraulic" },
    ];

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        await Promise.all([
            loadUserAndWelcome(),
            loadBanners(),
            loadCategories(),
            loadPopularFirms(),
        ]);
    };

    const loadUserAndWelcome = async () => {
        let name = "Guest User";
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { data, error } = await supabase
                .from("profiles")
                .select("person_name, business_name")
                .eq("id", user.id)
                .single();

            if (!error && data) {
                name = data.business_name?.trim() || data.person_name?.trim() || name;
            }
        }

        if (!name || name.toLowerCase() === "guest") {
            name = "Guest User";
        } else {
            const parts = name.trim().split(" ");
            if (parts.length > 3) {
                name = `${parts[0]} ${parts[1]}..`;
            } else {
                name = parts.join(" ");
            }
        }

        setWelcomeMessage(`Welcome ${name}`);
    };

    const loadBanners = async () => {
        try {
            const { data } = await supabase.from("app_banner").select();
            setBanners(data || []);
        } catch (e) {
            console.error("Banners error:", e);
        } finally {
            setLoadingBanners(false);
        }
    };

    const loadCategories = async () => {
        try {
            const { data } = await supabase.from("tiles_titles").select();
            const items =
                data?.map((item) => ({
                    title: item.group_title || item.title || "",
                    image: item.image || item.image_url || "",
                    keywords: item.image_keywords || item.keywords || "",
                })) || [];

            setB2cCategories(items.filter((c) => /(hospital|hotel|college|travel|parlour|doctor|shop)/i.test(c.keywords)));
            setB2bCategories(items.filter((c) => /(chemical|electrical|builder|steel|cnc|hydraulic|electronics)/i.test(c.keywords)));
        } catch (e) {
            console.error("Categories error:", e);
        } finally {
            setLoadingCategories(false);
        }
    };

    const loadPopularFirms = async () => {
        try {
            const { data } = await supabase
                .from("featured_firms")
                .select(`
          profile_id,
          display_order,
          profiles (*)
        `)
                .eq("is_active", true)
                .order("display_order", { ascending: true })
                .limit(6);

            const firms = data?.map((row) => row.profiles) || [];
            setPopularFirms(firms);
        } catch (e) {
            console.error("Featured firms error:", e);
            setPopularFirms([]);
        } finally {
            setLoadingFirms(false);
        }
    };

    const openSearch = (query = "", options = {}) => {
        navigate("/search", {
            state: {
                initialFilter: query,
                forceGeneralSearch: options.forceGeneral || false,
                subcategoryContext: options.subcategory || null,
                // You can pass pre-filtered companies if needed
                // filteredCompanies: someArray,
            },
        });
    };

    const getIcon = (keywords) => {
        const k = keywords.toLowerCase();

        // B2C
        if (k.includes("hospital")) return <Hospital size={22} />;
        if (k.includes("hotel")) return <Hotel size={22} />;
        if (k.includes("college")) return <GraduationCap size={22} />;
        if (k.includes("travel")) return <Plane size={22} />;
        if (k.includes("doctor")) return <Stethoscope size={22} />;
        if (k.includes("shop") || k.includes("parlour"))
            return <ShoppingBag size={22} />;

        // B2B
        if (k.includes("chemical")) return <FlaskConical size={22} />;
        if (k.includes("electrical")) return <Zap size={22} />;
        if (k.includes("steel") || k.includes("builder"))
            return <Factory size={22} />;
        if (k.includes("cnc") || k.includes("hydraulic"))
            return <Cpu size={22} />;
        if (k.includes("electronics")) return <Plug size={22} />;

        return <Boxes size={22} />;
    };


    return (
        <div className="mobile-home-container">
            {/* Fixed Header */}
            <header className="mobile-header">
                <div className="header-content">
                    <h1 className="app-title">PHONEBOOK</h1>
                    <div className="search-bar" onClick={() => openSearch("")}>
                        <span className="search-icon">
                            <Search size={18} />
                        </span>

                        <span className="search-placeholder">Search Firms, Persons, Products...</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="mobile-main">
                <h2 className="welcome-text">{welcomeMessage}</h2>

                {/* Banners */}
                <div className="banner-section">
                    {loadingBanners ? (
                        <div className="loader-container">
                            <div className="spinner"></div>
                        </div>
                    ) : (
                        <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false} interval={4000}>
                            {banners.length > 0 ? (
                                banners.map((b, i) => (
                                    <div key={i} className="banner-slide">
                                        <img src={b.image_url} alt="Banner" className="banner-img" />
                                    </div>
                                ))
                            ) : (
                                <div className="no-offer-banner">No Offers</div>
                            )}
                        </Carousel>
                    )}
                </div>

                {/* A-Z Row */}
                <div className="az-row">
                    {Array.from({ length: 26 }, (_, i) => {
                        const letter = String.fromCharCode(65 + i);
                        return (
                            <button key={letter} onClick={() => openSearch(letter)} className="az-button">
                                {letter}
                            </button>
                        );
                    })}
                </div>

                {/* B2C Categories */}
                <CategorySection
                    title="Popular Categories B2C"
                    items={loadingCategories ? [] : b2cCategories.length > 0 ? b2cCategories : demoB2C}
                    onMoreTap={() => openSearch()}
                    getIcon={getIcon}
                />

                {/* Ad Carousel */}
                <div className="ad-carousel">
                    <Carousel autoPlay interval={4000} showThumbs={false} showStatus={false}>
                        {[1, 2, 3].map((i) => (
                            <img key={i} src={`/assets/images${i}.png`} alt="Ad" className="ad-img" />
                        ))}
                    </Carousel>
                </div>

                {/* B2B Categories */}
                <CategorySection
                    title="Popular Categories B2B"
                    items={loadingCategories ? [] : b2bCategories.length > 0 ? b2bCategories : demoB2B}
                    onMoreTap={() => openSearch()}
                    getIcon={getIcon}
                />

                {/* Popular Firms */}
                <section className="popular-firms-section">
                    <h3 className="section-title">Popular Firms</h3>
                    {loadingFirms ? (
                        <div className="loader-container">
                            <div className="spinner large"></div>
                        </div>
                    ) : popularFirms.length === 0 ? (
                        <p className="no-data">No featured firms yet</p>
                    ) : (
                        <div className="firms-grid">
                            {popularFirms.map((firm, i) => (
                                <div
                                    key={i}
                                    className="firm-card"
                                    onClick={() => navigate(`/profile/${firm.id}`)}
                                >
                                    <div className="firm-avatar">
                                        {firm.profile_image ? (
                                            <img src={firm.profile_image} alt={firm.business_name} />
                                        ) : (
                                            <Building2 size={26} />

                                        )}
                                    </div>
                                    <p className="firm-name">{firm.business_name || "Business"}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Play Book */}
                <section className="playbook-section">
                    <h3 className="section-title">Play Book</h3>
                    <div className="playbook-carousel">
                        <PlayBookCard
                            image="/assets/gold.jpg"
                            title="Gem & Jewellery Directory"
                            onTap={() => openSearch("gold", { subcategory: "gold" })}
                        />
                        <PlayBookCard image="/assets/foundary.jpg" title="Foundries Directory" onTap={() => openSearch("foundry")} />
                        <PlayBookLinkCard
                            image="/assets/book1.png"
                            title="Coimbatore Phone Book"
                            link="https://play.google.com/store/books/details/Lion_Dr_Er_J_Shivakumaar_Chief_Editor_COIMBATORE_N?id=nCpLDwAAQBAJ"
                        />
                        <PlayBookLinkCard
                            image="/assets/book2.png"
                            title="Coimbatore 2025-26 Industry"
                            link="https://play.google.com/store/books/details/Lion_Dr_Er_J_Shivakumaar_COIMBATORE_2025_26_Indust?id=sCE6EQAAQBAJ"
                        />
                        <PlayBookLinkCard
                            image="/assets/book3.png"
                            title="Coimbatore 2024 Industrial"
                            link="https://play.google.com/store/books/details/Lion_Dr_Er_J_Shivakumaar_COIMBATORE_2024_Industria?id=kwgSEQAAQBAJ"
                        />
                    </div>
                </section>
            </main>
        </div>
    );
};

// Reusable Components
const CategorySection = ({ title, items, onMoreTap, getIcon }) => {
    const displayItems = items.length > 0 ? items.slice(0, 7) : items.slice(0, 7);

    return (
        <section className="category-section">
            <h3 className="section-title">{title}</h3>
            <div className="category-grid">
                {displayItems.map((cat, i) => (
                    <div
                        key={i}
                        className="category-tile"
                        onClick={() => openSearch(cat.keywords, { subcategory: cat.keywords })}
                    >
                        <div className="category-icon">{getIcon(cat.keywords)}</div>
                        <p className="category-label">{cat.title}</p>
                    </div>
                ))}
                <div className="category-tile more-tile" onClick={() => openSearch("")}>
                    <div className="more-icon">
                        <span>More<br />{title.includes("B2C") ? "B2C" : "B2B"}</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

const PlayBookCard = ({ image, title, onTap }) => (
    <div className="playbook-card" onClick={onTap}>
        <img src={image} alt={title} />
        <p>{title}</p>
    </div>
);

const PlayBookLinkCard = ({ image, title, link }) => (
    <a href={link} target="_blank" rel="noopener noreferrer" className="playbook-card">
        <img src={image} alt={title} />
        <p>{title}</p>
    </a>
);

export default MobileViewHome;