// src/pages/SearchPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import '../Mobile_view/Mobile_css/SearchPage.css';
import {
  Phone,
  Heart,
  CheckCircle,
  Star,
  MapPin,
  Package,
  BadgeCheck,
} from 'lucide-react';
import { FiSearch, FiPhoneCall, FiHeart as FiHeartIcon } from 'react-icons/fi';

// ================================
// Shared Helper Functions
// ================================
const trimName = (name) => {
  if (!name) return 'User';
  const words = name.trim().split(' ');
  if (words.length <= 2) return name;
  return `${words[0]} ${words[1]}...`;
};

const getKeywordsString = (k) => {
  if (!k) return 'No products';
  if (typeof k === 'string') {
    return k
      .split(',')
      .map((e) => e.split(':')[0].trim())
      .join(', ');
  }
  if (Array.isArray(k)) {
    return k
      .map((e) => (typeof e === 'object' ? e.name || e.title || '' : e))
      .filter(Boolean)
      .join(', ');
  }
  return 'No products';
};

// ================================
// Favorite Modal
// ================================
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
        alert('Please sign in first.');
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
    } catch (error) {
      console.error('Error saving favorite:', error);
      alert('Failed to save. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Save {name} to Group</h3>

        {groups.map((group) => (
          <label key={group} className="radio-label">
            <input
              type="radio"
              name="group"
              checked={selected === group}
              onChange={() => setSelected(group)}
            />
            <span>{group}</span>
          </label>
        ))}

        <div className="modal-actions">
          <button className="btn-secondary" onClick={() => setSelected(null)}>
            Clear
          </button>
          <button
            className="btn-primary"
            onClick={saveFavorite}
            disabled={!selected || loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ================================
// Main SearchPage
// ================================
const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state || {};
  const initialFilter = state.initialFilter || '';
  const filteredCompanies = state.filteredCompanies || null;
  const forceGeneralSearch = state.forceGeneralSearch || false;
  const subcategoryContext = state.subcategoryContext || null;

  const [firmPersonQuery, setFirmPersonQuery] = useState('');
  const [keywordsQuery, setKeywordsQuery] = useState('');
  const [isFirmPersonFocused, setIsFirmPersonFocused] = useState(false);
  const [isKeywordsFocused, setIsKeywordsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);
  const [favoriteProfile, setFavoriteProfile] = useState(null);

  // === NEW: Proper login check using localStorage (same as SigninPage & SettingsPage) ===
  const isLoggedIn = () => !!localStorage.getItem('userId');

  const checkLoginAndProceed = (action) => {
    if (!isLoggedIn()) {
      if (window.confirm('You need to sign in to use this feature.')) {
        navigate('/signin');
      }
      return;
    }
    action();
  };

  useEffect(() => {
    const filter = initialFilter?.trim();

    if (filteredCompanies?.length > 0) {
      setSearchResults(sortResults(filteredCompanies));
      return;
    }

    if (!filter) {
      fetchAllCompanies();
      return;
    }

    if (filter.length === 1 && /^[A-Z]$/.test(filter)) {
      performSearch(filter, 'letter');
      return;
    }

    if (forceGeneralSearch) {
      setFirmPersonQuery(filter);
      setKeywordsQuery('');
      setIsFirmPersonFocused(true);
      performCategorySearch(filter);
      return;
    }

    setKeywordsQuery(filter);
    setIsKeywordsFocused(true);
    performCategorySearch(filter);
  }, [initialFilter, filteredCompanies, forceGeneralSearch, subcategoryContext]);

  const sortResults = (results) => {
    return [...results].sort((a, b) => {
      const primeA = a.is_prime === true;
      const primeB = b.is_prime === true;
      const prioA = a.priority === true;
      const prioB = b.priority === true;

      if (primeA && !primeB) return -1;
      if (!primeA && primeB) return 1;
      if (prioA && !prioB) return -1;
      if (!prioA && prioB) return 1;

      const order = ['gold', 'business', 'normal_business', 'free'];
      const subA = (a.subscription || '').toLowerCase();
      const subB = (b.subscription || '').toLowerCase();
      return order.indexOf(subA) - order.indexOf(subB);
    });
  };

  const fetchAllCompanies = async () => {
    setIsLoading(true);
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('is_prime', { ascending: false });

      setSearchResults(sortResults(data || []));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const performSearch = async (query, type) => {
    if (!query) return;
    setIsLoading(true);

    try {
      let queryBuilder = supabase.from('profiles').select('*');

      if (type === 'name') {
        queryBuilder = queryBuilder.or(
          `business_name.ilike.%${query}%,person_name.ilike.%${query}%`
        );
      } else if (type === 'keywords') {
        queryBuilder = queryBuilder.ilike('keywords', `%${query}%`);
      } else if (type === 'letter') {
        queryBuilder = queryBuilder.ilike(
          'business_name',
          `${query.toUpperCase()}%`
        );
      }

      const { data } = await queryBuilder.order('is_prime', {
        ascending: false,
      });

      setSearchResults(sortResults(data || []));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const performCategorySearch = async (category) => {
    setIsLoading(true);
    try {
      const query = category.trim();
      if (!query) return fetchAllCompanies();

      let queryBuilder = supabase.from('profiles').select('*');

      if (subcategoryContext) {
        const ctx = subcategoryContext.toLowerCase();
        let boost = '';

        if (ctx === 'college') {
          boost =
            'keywords.ilike.%college%,keywords.ilike.%institute%,keywords.ilike.%university%';
        } else if (ctx === 'doctor') {
          boost =
            'keywords.ilike.%doctor%,keywords.ilike.%clinic%,keywords.ilike.%hospital%';
        }

        if (boost) queryBuilder = queryBuilder.or(boost);
      }

      queryBuilder = queryBuilder.or(
        `business_name.ilike.%${query}%,person_name.ilike.%${query}%,keywords.ilike.%${query}%`
      );

      const words = query.split(' ').filter((w) => w.length >= 2);
      if (words.length) {
        const orQuery = words
          .map(
            (w) =>
              `business_name.ilike.%${w}%,person_name.ilike.%${w}%,keywords.ilike.%${w}%`
          )
          .join(',');

        queryBuilder = queryBuilder.or(orQuery);
      }

      const { data } = await queryBuilder
        .order('is_prime', { ascending: false })
        .order('priority', { ascending: false });

      setSearchResults(sortResults(data || []));
    } catch (e) {
      console.error(e);
      fetchAllCompanies();
    } finally {
      setIsLoading(false);
    }
  };

  const openProfile = (item) => {
    navigate('/Modal', { state: { profile: item } });
  };

  const handleCall = (mobile) => {
    window.location.href = `tel:${mobile}`;
  };

  const showEnquiryModal = (name, mobile) => {
    const defaultMsg =
      'I Saw Your Listing in SIGNPOST PHONE BOOK. I am Interested in your Products. Please Send Details/Call Me.';

    const message = prompt('Your Message (max 160 chars):', defaultMsg);

    if (message && message.length <= 160) {
      const useWhatsApp = window.confirm(
        'Choose action:\nOK = WhatsApp\nCancel = SMS'
      );

      if (useWhatsApp) {
        window.open(
          `https://wa.me/${mobile}?text=${encodeURIComponent(message)}`,
          '_blank'
        );
      } else {
        window.location.href = `sms:${mobile}?body=${encodeURIComponent(
          message
        )}`;
      }
    }
  };

  const openFavoriteModal = (profile) => {
    setFavoriteProfile(profile);
    setShowFavoriteModal(true);
  };

  const title =
    initialFilter && initialFilter.length === 1 && /^[A-Z]$/.test(initialFilter)
      ? `Starts with ${initialFilter}`
      : initialFilter || 'Search Results';

  return (
    <div className="search-page">
      <div className="search-inputs">
        <div className={`search-field ${isFirmPersonFocused ? 'expanded' : ''}`}>
          <FiSearch className="search-input-icon" />
          <input
            type="text"
            placeholder="Firm / Person"
            value={firmPersonQuery}
            onFocus={() => {
              setIsFirmPersonFocused(true);
              setIsKeywordsFocused(false);
              setKeywordsQuery('');
              fetchAllCompanies();
            }}
            onChange={(e) => {
              const val = e.target.value;
              setFirmPersonQuery(val);
              if (val.length >= 3) performSearch(val, 'name');
              else if (!val) fetchAllCompanies();
            }}
          />
        </div>

        <div className={`search-field ${isKeywordsFocused ? 'expanded' : ''}`}>
          <input
            type="text"
            placeholder="Keywords"
            value={keywordsQuery}
            onFocus={() => {
              setIsKeywordsFocused(true);
              setIsFirmPersonFocused(false);
              setFirmPersonQuery('');
              fetchAllCompanies();
            }}
            onChange={(e) => {
              const val = e.target.value;
              setKeywordsQuery(val);
              if (val.length >= 3) performSearch(val, 'keywords');
              else if (!val) fetchAllCompanies();
            }}
          />
        </div>
      </div>

      <div className="results-container">
        {isLoading ? (
          <div className="loader"></div>
        ) : searchResults.length === 0 ? (
          <div className="no-results">No results found</div>
        ) : (
          <div className="results-list">
            {searchResults.map((item) => {
              const sub = (item.subscription || '').toLowerCase();
              const isGold = item.is_prime === true || sub === 'gold';
              const fullName =
                item.business_name || item.person_name || 'User';
              const mobile = item.mobile_number || '';
              const maskedMobile =
                mobile.length >= 5
                  ? `${mobile.substring(0, 5)} XXXXX`
                  : mobile;

              const displayText = isKeywordsFocused
                ? getKeywordsString(item.keywords)
                : `${item.city || ''}, ${item.pincode || ''}`.trim() ||
                  'No location';

              const handleCardClick = () => {
                console.log('Clicked card, profile data:', item);
                checkLoginAndProceed(() => openProfile(item));
              };

              return isGold ? (
                <GoldCard
                  key={item.id}
                  item={item}
                  fullName={fullName}
                  maskedMobile={maskedMobile}
                  displayText={displayText}
                  onCardClick={handleCardClick}
                  onCall={() => checkLoginAndProceed(() => handleCall(mobile))}
                  onEnquire={() =>
                    checkLoginAndProceed(() =>
                      showEnquiryModal(fullName, mobile)
                    )
                  }
                  onFavorite={() =>
                    checkLoginAndProceed(() => openFavoriteModal(item))
                  }
                />
              ) : (
                <TieredCard
                  key={item.id}
                  item={item}
                  fullName={fullName}
                  displayText={displayText}
                  maskedMobile={maskedMobile}
                  tier={
                    sub === 'business'
                      ? 'business'
                      : sub.includes('normal')
                      ? 'normal_business'
                      : 'free'
                  }
                  onCardClick={handleCardClick}
                  
                  onCall={() => checkLoginAndProceed(() => handleCall(mobile))}
                  onEnquire={() =>
                    checkLoginAndProceed(() =>
                      showEnquiryModal(fullName, mobile)
                    )
                  }
                  onFavorite={() =>
                    checkLoginAndProceed(() => openFavoriteModal(item))
                  }
                />
              );
            })}
          </div>
        )}
      </div>

      {showFavoriteModal && favoriteProfile && (
        <FavoriteModal
          name={
            favoriteProfile.business_name ||
            favoriteProfile.person_name ||
            'User'
          }
          mobile={favoriteProfile.mobile_number || ''}
          onClose={() => setShowFavoriteModal(false)}
        />
      )}
    </div>
  );
};

// ================================
// Gold Card
// ================================
const GoldCard = ({
  item,
  fullName,
  maskedMobile,
  displayText,
  onCardClick,
  onCall,
  onEnquire,
  onFavorite,
}) => {
  const truncatedName = trimName(fullName);

  return (
    <div className="gold-card" onClick={onCardClick}>
      <div className="gold-inner">
        <div className="gold-content">
          <div className="gold-header">
            <div className="gold-name-section">
              <span className="gold-name">{truncatedName}</span>
              <Star size={18} className="gold-premium-icon" />
              <BadgeCheck size={18} className="gold-verified-icon" />
            </div>

            <div className="gold-actions">
              <div
                className="gold-call"
                onClick={(e) => {
                  e.stopPropagation();
                  onCall();
                }}
              >
                <Phone size={24} />
              </div>

              <div
                className="gold-favorite"
                onClick={(e) => {
                  e.stopPropagation();
                  onFavorite();
                }}
              >
                <FiHeartIcon size={24} />
              </div>
            </div>
          </div>

          <div className="gold-detail">
            {item.keywords ? <Package size={16} /> : <MapPin size={16} />}
            <span>{displayText}</span>
          </div>

          <div className="gold-detail">
            <span className="gold-detail-icon"><Phone size={14}/></span>
            <span>{maskedMobile}</span>
          </div>
        </div>

        <div
          className="gold-enquire-btn"
          onClick={(e) => {
            e.stopPropagation();
            onEnquire();
          }}
        >
          Enquire
        </div>
      </div>
    </div>
  );
};

// ================================
// Tiered Card
// ================================
const TieredCard = ({
  item,
  fullName,
  displayText,
  maskedMobile,
  tier,
  onCardClick,
  onCall,
  onEnquire,
  onFavorite,
}) => {
  const truncatedName = trimName(fullName);
  const isPriority = item.priority === true;

  const tierStyles = {
    business: { border: '#E91E63', button: '#E91E63' },
    normal_business: { border: '#8B5CF6', button: '#8B5CF6' },
    free: { border: '#999', button: '#777' },
  };

  const style = tierStyles[tier] || tierStyles.free;

  return (
    <div
      className="tier-card"
      style={{ borderColor: style.border }}
      onClick={onCardClick}
    >
      <div className="tier-content">
        <div className="tier-header">
          <div className="tier-name-section">
            <span className="tier-name">{truncatedName}</span>
            {tier !== 'free' && (
              <CheckCircle size={18} className="tier-verified" />
            )}
            {isPriority && (
              <span className="tier-featured">Featured</span>
            )}
          </div>

          <div className="tier-actions">
            <div
              className="tier-call"
              onClick={(e) => {
                e.stopPropagation();
                onCall();
              }}
            >
              <FiPhoneCall size={24} />
            </div>

            <div
              className="tier-favorite"
              onClick={(e) => {
                e.stopPropagation();
                onFavorite();
              }}
            >
              <FiHeartIcon size={24} />
            </div>
          </div>
        </div>

        <div className="tier-detail">
          {item.keywords ? <Package size={16} /> : <MapPin size={16} />}
          <span>{displayText}</span>
        </div>

        <div className="tier-detail">
          <span className="tier-detail-icon">Phone</span>
          <span>{maskedMobile}</span>
        </div>
      </div>

      <div
        className="tier-enquire-btn"
        style={{ backgroundColor: style.button }}
        onClick={(e) => {
          e.stopPropagation();
          onEnquire();
        }}
      >
        Enquire
      </div>
    </div>
  );
};

export default SearchPage;