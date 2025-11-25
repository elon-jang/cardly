import React, { useState, useRef, useEffect } from 'react';
import CardForm from './components/CardForm';
import CardPreview from './components/CardPreview';
import SavedCards from './components/SavedCards';
import UserProfile from './components/UserProfile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { exportAsImage, exportAsPDF } from './utils/export';
import { saveCard, getUserCards } from './utils/cardService';
import { getUserProfile } from './utils/userProfileService';
import { getUserCustomImages, addCustomImage } from './utils/customImageService';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { Save, LogOut, PlusCircle, BookmarkCheck, User, Zap } from 'lucide-react';

function AppContent() {
  const { user, loading, signOut } = useAuth();
  const { showToast } = useToast();
  const [authMode, setAuthMode] = useState('login');
  const [activeTab, setActiveTab] = useState('create');
  const savedCardsRef = useRef(null);
  const [cardData, setCardData] = useState({
    name: 'Clara Schumann',
    title: 'Professional Piano Instructor',
    phone: '+1 (555) 123-4567',
    email: 'clara@piano-lessons.com',
    instagram: '@clara_piano_art',
    blog: 'blog.naver.com/clara_music',
    image: null,
    theme: 'pastel',
    layout: 'standard'
  });
  const [saveStatus, setSaveStatus] = useState('');
  const [userProfileLoaded, setUserProfileLoaded] = useState(false);
  const [customImages, setCustomImages] = useState([]);

  // Load custom images from Supabase when user logs in
  useEffect(() => {
    const loadCustomImages = async () => {
      if (user) {
        const { data, error } = await getUserCustomImages(user.id);
        if (!error && data) {
          setCustomImages(data.map(img => img.image_data));
        }
      } else {
        // Clear custom images when user logs out
        setCustomImages([]);
      }
    };
    loadCustomImages();
  }, [user]);

  // Load user profile when user logs in
  useEffect(() => {
    if (user && !userProfileLoaded) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;

    const { data, error } = await getUserProfile(user.id);

    if (!error && data && (data.name || data.title || data.phone || data.email || data.instagram || data.blog)) {
      // User has profile data, use it
      setCardData(prev => ({
        ...prev,
        name: data.name || prev.name,
        title: data.title || prev.title,
        phone: data.phone || prev.phone,
        email: data.email || prev.email,
        instagram: data.instagram || prev.instagram,
        blog: data.blog || prev.blog,
      }));
    }
    // If no profile or error, keep Clara Schumann defaults
    setUserProfileLoaded(true);
  };

  const handleProfileUpdate = (profile) => {
    // Update cardData with new profile info
    setCardData(prev => ({
      ...prev,
      name: profile.name || prev.name,
      title: profile.title || prev.title,
      phone: profile.phone || prev.phone,
      email: profile.email || prev.email,
      instagram: profile.instagram || prev.instagram,
      blog: profile.blog || prev.blog,
    }));
  };

  const handleInputChange = (name, value) => {
    setCardData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageUrl = reader.result;
        // Check if image already exists
        if (customImages.includes(imageUrl)) {
          showToast('This image has already been uploaded.', 'info');
          // Still set it as current image
          setCardData(prev => ({
            ...prev,
            image: imageUrl
          }));
        } else {
          // Save to Supabase
          const { data, error } = await addCustomImage(user.id, imageUrl);
          if (error) {
            showToast('Failed to save custom image: ' + error.message, 'error');
          } else {
            // Add to custom images
            setCustomImages(prev => [...prev, imageUrl]);
            // Set as current image
            setCardData(prev => ({
              ...prev,
              image: imageUrl
            }));
            showToast('Custom image uploaded successfully!', 'success');
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCard = async () => {
    if (!user) {
      showToast('Please sign in to save cards', 'info');
      return;
    }

    // Check for duplicate cards
    const { data: existingCards } = await getUserCards(user.id);
    if (existingCards) {
      const isDuplicate = existingCards.some(card =>
        card.name === cardData.name &&
        card.title === cardData.title &&
        card.phone === cardData.phone &&
        card.email === cardData.email &&
        card.instagram === cardData.instagram &&
        card.blog === cardData.blog &&
        card.image === cardData.image &&
        card.theme === cardData.theme &&
        card.layout === cardData.layout &&
        card.image_gradient === (cardData.imageGradient || false)
      );

      if (isDuplicate) {
        showToast('This card already exists in your saved cards.', 'info');
        return;
      }
    }

    setSaveStatus('saving');
    const { data, error } = await saveCard(cardData, user.id);

    if (error) {
      setSaveStatus('error');
      showToast('Failed to save card: ' + error.message, 'error');
    } else {
      setSaveStatus('success');
      showToast('Card saved successfully!', 'success');

      // Refresh saved cards list
      if (savedCardsRef.current) {
        savedCardsRef.current.refresh();
      }

      setTimeout(() => {
        setSaveStatus('');
      }, 3000);
    }
  };

  const handleLoadCard = (card) => {
    setCardData(card);
    setActiveTab('create');
    showToast('Card loaded successfully', 'success');
  };

  const handleSignOut = async () => {
    await signOut();
    showToast('Signed out successfully', 'info');
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return authMode === 'login' ? (
      <Login onToggleMode={() => setAuthMode('signup')} />
    ) : (
      <Signup onToggleMode={() => setAuthMode('login')} />
    );
  }

  return (
    <div className="container">
      <header className="header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1>Cardly</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {user.email}
            </span>
            <button
              className="btn btn-outline"
              onClick={handleSignOut}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
        <div className="hero-section">
          <h2 className="hero-tagline">
            Create professional business cards <span className="highlight">in seconds</span>
          </h2>
        </div>
      </header>

      {/* Tab Navigation */}
      {/* Tab Navigation */}
      <div className="tab-nav">
        <button
          className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          <PlusCircle size={18} />
          <span>Create Card</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          <BookmarkCheck size={18} />
          <span>My Saved Cards</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={18} />
          <span>My Profile</span>
        </button>
      </div>

      <main className="main-layout">
        {activeTab === 'create' ? (
          <>
            <div className="form-section">
              <CardForm
                data={cardData}
                onChange={handleInputChange}
                onImageChange={handleImageChange}
                customImages={customImages}
              />
            </div>

            <div className="preview-container">
              <div className="preview-wrapper">
                <div className="scale-container">
                  <CardPreview data={cardData} />
                </div>
              </div>

              <div className="preview-actions">
                <button
                  className="btn btn-primary"
                  onClick={handleSaveCard}
                  disabled={saveStatus === 'saving'}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
                >
                  <Save size={16} />
                  {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : 'Save Card'}
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => exportAsImage('business-card')}
                >
                  Download PNG
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => exportAsPDF('business-card')}
                >
                  Download PDF
                </button>
              </div>
            </div>
          </>
        ) : activeTab === 'saved' ? (
          <div style={{ width: '100%' }}>
            <SavedCards
              ref={savedCardsRef}
              onLoadCard={handleLoadCard}
              onCreateCard={() => setActiveTab('create')}
            />
          </div>
        ) : (
          <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <UserProfile onProfileUpdate={handleProfileUpdate} />
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
