// src/layouts/Mobile_view/ModelPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import {
  Phone,
  MessageCircle,
  Mail,
  Globe,
  MapPin,
  User,
  Heart,
  ChevronLeft,
  Camera,
  Package,
  X,
  Loader2,
} from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import "../Mobile_view/Mobile_css/ModalPage.css";

const ModelPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const profile = location.state?.profile;

  // If no profile passed, show error
  if (!profile) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        color: '#666'
      }}>
        <h2>No Profile Data</h2>
        <p>The profile information could not be loaded.</p>
        <button
          onClick={() => navigate(-1)}
          style={{
            marginTop: '20px',
            padding: '12px 24px',
            backgroundColor: '#3f51b5',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [priorityProducts, setPriorityProducts] = useState([]);
  const [secondaryProducts, setSecondaryProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);
  const [activeTab, setActiveTab] = useState('about');

  const autoScrollTimer = useRef(null);

  // Tier logic
  const isPrime = profile.is_prime === true;
  const sub = (profile.subscription || '').toString().toLowerCase();
  const tier = isPrime || sub === 'gold'
    ? 'gold'
    : sub === 'business'
    ? 'business'
    : sub === 'normal_business' || sub === 'normal business'
    ? 'normal_business'
    : 'free';

  const isPremium = tier !== 'free';
  const showProductTab = tier === 'gold';

  // Colors
  const colors = {
    gold: { primary: '#d97706', light: '#fbbf24' },
    business: { primary: '#ec4899', light: '#f472b6' },
    normal_business: { primary: '#4f46e5', light: '#a78bfa' },
    free: { primary: '#4b5563', light: '#9ca3af' },
  }[tier];

  // Profile data
  const mobile = profile.mobile_number || '';
  const whatsapp = profile.whats_app || mobile;
  const email = profile.email || '';
  const website = (profile.web_site || '').trim();
  const namePrefix = profile.person_prefix || '';
  const personName = profile.person_name || '';
  const businessName = profile.business_name || '';
  const displayName = businessName || (personName ? `${namePrefix} ${personName}`.trim() : 'User');
  const keyword = profile.keywords || '';
  const address = profile.address || '';
  const city = profile.city || '';
  const pin = profile.pincode || '';
  const landline = profile.landline || '';
  const landCode = profile.landline_code || '';
  const fullLandline = landCode ? `${landCode}${landline}` : landline;
  const description = profile.description || '';

  const allProducts = [...priorityProducts, ...secondaryProducts];

  const formatMobile = (n) => (n.length >= 5 ? `${n.substring(0, 5)} XXXXX` : n);

  const launch = (url) => window.open(url, '_blank');

  const handleCall = (num) => launch(`tel:${num}`);
  const handleWA = (num) => launch(`https://wa.me/${num}`);
  const handleSMS = (num) => launch(`sms:${num}`);
  const handleMail = (e) => launch(`mailto:${e}`);
  const handleWeb = (url) => launch(url.startsWith('http') ? url : `https://${url}`);

  // Back function
  const onBack = () => navigate(-1);

  useEffect(() => {
    const profileId = profile.id?.toString() || '';

    if (tier === 'free') {
      loadFreeTierImages();
    } else {
      loadCoverPhoto(profileId);
    }

    loadProducts(profileId);
  }, [profile.id, tier]);

  useEffect(() => {
    if (tier === 'free' && images.length > 0) {
      autoScrollTimer.current = setInterval(() => {
        setCurrentPage((prev) => (prev + 1) % images.length);
      }, 4000);
      return () => clearInterval(autoScrollTimer.current);
    }
  }, [images.length, tier]);

  const loadFreeTierImages = async () => {
    try {
      const { data } = await supabase
        .from('free_tier_shared_header_images')
        .select('image_url')
        .order('sort_order', { ascending: true });
      setImages(data?.map(i => i.image_url) || []);
    } catch (e) {
      console.error(e);
      setImages([]);
    }
  };

  const loadCoverPhoto = async (profileId) => {
    if (!profileId) return;
    try {
      const { data } = await supabase
        .from('users_table')
        .select('cover_photo')
        .eq('user_id', profileId)
        .maybeSingle();
      if (data?.cover_photo) setImages([data.cover_photo]);
    } catch (e) {
      console.error(e);
    }
  };

  const loadProducts = async (profileId) => {
    if (!profileId) return;
    setLoadingProducts(true);
    try {
      const { data: desRows } = await supabase
        .from('product_des_table')
        .select('prod_des_id, product_desc')
        .eq('userId', profileId);

      if (!desRows?.length) {
        setPriorityProducts([]);
        setSecondaryProducts([]);
        setLoadingProducts(false);
        return;
      }

      const descMap = {};
      const ids = desRows.filter(r => r.prod_des_id).map(r => {
        descMap[r.prod_des_id] = r.product_desc || '';
        return r.prod_des_id;
      });

      const { data: prodRows } = await supabase
        .from('product_table')
        .select('product_id, prod_des_id, product_name, product_image, product_description, price')
        .in('prod_des_id', ids);

      const priority = [], secondary = [];
      prodRows?.forEach(row => {
        const product = {
          id: row.product_id,
          name: row.product_name,
          image: row.product_image,
          description: row.product_description,
          price: row.price?.toString(),
        };
        if (descMap[row.prod_des_id] === 'priority') priority.push(product);
        else secondary.push(product);
      });

      setPriorityProducts(priority);
      setSecondaryProducts(secondary);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingProducts(false);
    }
  };

  const ActionButton = ({ icon: Icon, color, label, onClick }) => (
    <button onClick={onClick} className="action-btn">
      <div className={`action-icon-bg action-icon-${color}`}>
        <Icon size={32} color="#fff" />
      </div>
      <span className="action-label">{label}</span>
    </button>
  );

  const ProductCard = ({ product }) => (
    <div className="product-card">
      <div className="product-header">
        <div className="product-icon" style={{ backgroundColor: colors.primary }}>
          <Package size={20} color="#fff" />
        </div>
        <h3 className="product-name">{product.name}</h3>
      </div>
      <div className="product-body">
        {product.image && <img src={product.image} alt={product.name} className="product-image" />}
        {product.price && <p className="product-price" style={{ color: colors.primary }}>Price: {product.price}</p>}
        {product.description && <p className="product-desc">{product.description}</p>}
      </div>
    </div>
  );

  const InfoRow = ({ icon: Icon, color, text }) => (
    <div className="info-row">
      <Icon size={24} color={color} />
      <span className="info-text">{text}</span>
    </div>
  );

  const FreeCarousel = () => (
    <div className="free-carousel">
      {images.length > 0 ? (
        <div className="carousel-track" style={{ transform: `translateX(-${currentPage * 100}%)` }}>
          {images.map((img, i) => (
            <img key={i} src={img} alt="header" className="carousel-img" onClick={() => setShowGallery(true)} />
          ))}
        </div>
      ) : (
        <div className="carousel-placeholder">
          <Camera size={80} color="#999" />
        </div>
      )}
    </div>
  );

  const PremiumHeader = () => (
    <div className="premium-header">
      {images.length > 0 ? (
        <PhotoProvider>
          <div className="cover-container">
            <PhotoView src={images[currentPage]}>
              <img src={images[currentPage]} alt="cover" className="cover-img" />
            </PhotoView>
            {images.length > 1 && (
              <div className="cover-dots">
                {images.map((_, i) => (
                  <div key={i} className={`dot ${i === currentPage ? 'active' : ''}`} />
                ))}
              </div>
            )}
          </div>
        </PhotoProvider>
      ) : (
        <div className="cover-placeholder">
          <Camera size={100} color={colors.primary} />
        </div>
      )}

      <button onClick={onBack} className="header-btn back-btn">
        <ChevronLeft size={24} />
      </button>
      <button onClick={() => setShowFavoriteModal(true)} className="header-btn fav-btn">
        <Heart size={24} color="#ec4899" fill="#ec4899" />
      </button>
    </div>
  );

  return (
    <div className="model-page">
      {isPremium ? (
        <>
          <PremiumHeader />

          <div className="premium-content">
            <div className="profile-header">
              <div className="avatar" style={{ backgroundColor: `${colors.light}30`, color: colors.primary }}>
                {displayName[0].toUpperCase()}
              </div>
              <div>
                <h1 className="display-name">{displayName}</h1>
                {keyword && <p className="keyword">{keyword}</p>}
              </div>
            </div>

            {showProductTab && (
              <div className="tab-bar">
                <button
                  onClick={() => setActiveTab('about')}
                  className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
                  style={{ borderColor: activeTab === 'about' ? colors.primary : 'transparent' }}
                >
                  About
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
                  style={{ borderColor: activeTab === 'products' ? colors.primary : 'transparent' }}
                >
                  Products
                </button>
              </div>
            )}

            {activeTab === 'products' && showProductTab ? (
              loadingProducts ? (
                <div className="loader-center">
                  <Loader2 size={40} className="spinner" />
                </div>
              ) : allProducts.length === 0 ? (
                <p className="no-data">No products listed</p>
              ) : (
                <div className="products-list">
                  {priorityProducts.map(p => <ProductCard key={p.id} product={p} />)}
                  {secondaryProducts.length > 0 && (
                    <>
                      <h3 className="section-title">Other Products</h3>
                      {secondaryProducts.map(p => <ProductCard key={p.id} product={p} />)}
                    </>
                  )}
                </div>
              )
            ) : (
              <>
                <div className="action-buttons">
                  {mobile && <ActionButton icon={Phone} color="green" label="Call" onClick={() => handleCall(mobile)} />}
                  {whatsapp && <ActionButton icon={MessageCircle} color="green" label="WhatsApp" onClick={() => handleWA(whatsapp)} />}
                  {mobile && <ActionButton icon={MessageCircle} color="blue" label="SMS" onClick={() => handleSMS(mobile)} />}
                  {email && <ActionButton icon={Mail} color="orange" label="Email" onClick={() => handleMail(email)} />}
                  {website && <ActionButton icon={Globe} color="purple" label="Website" onClick={() => handleWeb(website)} />}
                  {landline && <ActionButton icon={Phone} color="purple" label="Landline" onClick={() => handleCall(fullLandline)} />}
                </div>

                <div className="info-list">
                  {personName && <InfoRow icon={User} color="#2563eb" text={`${namePrefix} ${personName}`.trim()} />}
                  {(address || city || pin) && <InfoRow icon={MapPin} color="#dc2626" text={`${address}, ${city}, ${pin}`.trim()} />}
                  {mobile && <InfoRow icon={Phone} color="#16a34a" text={formatMobile(mobile)} />}
                  {landline && <InfoRow icon={Phone} color="#0d9488" text={formatMobile(fullLandline)} />}
                  {email && <InfoRow icon={Mail} color="#ea580c" text={email} />}
                  {website && <InfoRow icon={Globe} color="#9333ea" text={website} />}
                  {description && (
                    <div className="description-section">
                      <h3 className="section-title">Description</h3>
                      <p className='description-text' >{description}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <header className="free-header">
            <button onClick={onBack}><ChevronLeft size={28} /></button>
            <button onClick={() => setShowFavoriteModal(true)}><Heart size={28} color="#ec4899" fill="#ec4899" /></button>
          </header>

          <FreeCarousel />

          <div className="free-content">
            <h1 className="display-name">{displayName}</h1>
            {keyword && <p className="keyword italic">{keyword}</p>}

            <div className="action-buttons">
              {mobile && <ActionButton icon={Phone} color="green" label="Call" onClick={() => handleCall(mobile)} />}
              {whatsapp && <ActionButton icon={MessageCircle} color="green" label="WhatsApp" onClick={() => handleWA(whatsapp)} />}
              {mobile && <ActionButton icon={MessageCircle} color="blue" label="SMS" onClick={() => handleSMS(mobile)} />}
              {email && <ActionButton icon={Mail} color="orange" label="Email" onClick={() => handleMail(email)} />}
              {website && <ActionButton icon={Globe} color="purple" label="Website" onClick={() => handleWeb(website)} />}
              {landline && <ActionButton icon={Phone} color="purple" label="Landline" onClick={() => handleCall(fullLandline)} />}
            </div>

            <div className="info-list">
              {personName && <InfoRow icon={User} color="#1f2937" text={`${namePrefix} ${personName}`.trim()} />}
              {(address || city || pin) && <InfoRow icon={MapPin} color="#dc2626" text={`${address}, ${city}, ${pin}`.trim()} />}
              {mobile && <InfoRow icon={Phone} color="#16a34a" text={formatMobile(mobile)} />}
              {landline && <InfoRow icon={Phone} color="#0d9488" text={formatMobile(fullLandline)} />}
              {email && <InfoRow icon={Mail} color="#ea580c" text={email} />}
              {website && <InfoRow icon={Globe} color="#9333ea" text={website} />}
              {description && <p className="description-text">{description}</p>}
              {allProducts.length > 0 && (
                <div className="products-summary">
                  <h3 className="section-title">Products/Services:</h3>
                  <p>{allProducts.map(p => p.name).filter(Boolean).join(', ')}</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Gallery Modal */}
      {showGallery && images.length > 0 && (
        <div className="gallery-modal">
          <button onClick={() => setShowGallery(false)} className="close-gallery">
            <X size={40} color="#fff" />
          </button>
          <PhotoProvider>
            {images.map((src, i) => (
              <PhotoView key={i} src={src} />
            ))}
          </PhotoProvider>
        </div>
      )}

      {/* Favorite Modal */}
      {showFavoriteModal && (
        <FavoriteModal name={displayName} mobile={mobile} onClose={() => setShowFavoriteModal(false)} />
      )}
    </div>
  );
};

const FavoriteModal = ({ name, mobile, onClose }) => {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const groups = ['My Buyers', 'My Sellers', 'Family & Friends', 'My List'];

  const saveFavorite = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('Please log in first');
        setLoading(false);
        return;
      }

      const { data: existingGroup } = await supabase
        .from('favorites_groups')
        .select('id')
        .eq('group_name', selected)
        .eq('user_id', userId)
        .single();

      let groupId = existingGroup?.id;

      if (!groupId) {
        const { data: newGroup } = await supabase
          .from('favorites_groups')
          .insert({ group_name: selected, user_id: userId })
          .select()
          .single();
        groupId = newGroup.id;
      }

      const { data: existingMember } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', groupId)
        .eq('mobile_number', mobile)
        .single();

      if (existingMember) {
        alert(`${name} is already in ${selected}`);
        setLoading(false);
        return;
      }

      await supabase.from('group_members').insert({
        group_id: groupId,
        member_name: name,
        mobile_number: mobile,
      });

      alert(`${name} saved to ${selected}`);
      onClose();
    } catch (e) {
      console.error(e);
      alert('Error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="favorite-modal">
        <h3>Save {name} to Group</h3>
        {groups.map(g => (
          <label key={g} className="radio-option">
            <input
              type="radio"
              name="group"
              checked={selected === g}
              onChange={() => setSelected(g)}
            />
            <span>{g}</span>
          </label>
        ))}
        <div className="modal-actions">
          <button onClick={() => setSelected(null)} className="btn-clear">Clear</button>
          <button onClick={saveFavorite} disabled={loading || !selected} className="btn-save">
            {loading ? <Loader2 size={20} className="spinner" /> : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelPage;