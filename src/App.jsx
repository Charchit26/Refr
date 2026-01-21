import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { getReferrals, addReferral, updateVotes } from './firebase';
import Header from './components/Header';
import Hero from './components/Hero';
import AppFilter from './components/AppFilter';
import ReferralCard from './components/ReferralCard';
import AddReferralModal from './components/AddReferralModal';
import EmptyState from './components/EmptyState';
import './App.css';

// Popular apps with their colors
export const POPULAR_APPS = [
  { name: 'Uber', color: '#000000', icon: '🚗' },
  { name: 'Lyft', color: '#FF00BF', icon: '🚙' },
  { name: 'DoorDash', color: '#FF3008', icon: '🍔' },
  { name: 'Uber Eats', color: '#06C167', icon: '🍕' },
  { name: 'Instacart', color: '#43B02A', icon: '🛒' },
  { name: 'Robinhood', color: '#00C805', icon: '📈' },
  { name: 'Coinbase', color: '#0052FF', icon: '₿' },
  { name: 'Cash App', color: '#00D632', icon: '💵' },
  { name: 'Venmo', color: '#3D95CE', icon: '💸' },
  { name: 'PayPal', color: '#003087', icon: '💳' },
  { name: 'Dropbox', color: '#0061FF', icon: '📦' },
  { name: 'Airbnb', color: '#FF5A5F', icon: '🏠' },
  { name: 'Tesla', color: '#CC0000', icon: '⚡' },
  { name: 'Rakuten', color: '#BF0000', icon: '💰' },
  { name: 'Honey', color: '#FF6801', icon: '🍯' },
  { name: 'Other', color: '#6B7280', icon: '📱' },
];

// Threshold for hiding bad referrals (40% downvotes)
const DOWNVOTE_THRESHOLD = 0.4;

function App() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const [votedItems, setVotedItems] = useState(() => {
    const saved = localStorage.getItem('refr-votes');
    return saved ? JSON.parse(saved) : {};
  });

  // Fetch referrals on mount
  useEffect(() => {
    fetchReferrals();
  }, []);

  // Save votes to localStorage
  useEffect(() => {
    localStorage.setItem('refr-votes', JSON.stringify(votedItems));
  }, [votedItems]);

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const data = await getReferrals();
      setReferrals(data);
    } catch (error) {
      toast.error('Failed to load referrals. Check your Firebase config.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddReferral = async (data) => {
    try {
      const newReferral = await addReferral(data);
      setReferrals(prev => [newReferral, ...prev]);
      setShowAddModal(false);
      toast.success('Referral code added!');
    } catch (error) {
      toast.error('Failed to add referral. Try again.');
    }
  };

  const handleVote = useCallback(async (referralId, voteType) => {
    // Check if already voted
    if (votedItems[referralId]) {
      toast.error('You already voted on this referral!');
      return;
    }

    // Find the referral
    const referral = referrals.find(r => r.id === referralId);
    if (!referral) return;

    const newUpvotes = voteType === 'up' ? (referral.upvotes || 0) + 1 : (referral.upvotes || 0);
    const newDownvotes = voteType === 'down' ? (referral.downvotes || 0) + 1 : (referral.downvotes || 0);

    try {
      await updateVotes(referralId, newUpvotes, newDownvotes);
      
      // Update local state
      setReferrals(prev => prev.map(r => 
        r.id === referralId 
          ? { ...r, upvotes: newUpvotes, downvotes: newDownvotes }
          : r
      ));

      // Mark as voted
      setVotedItems(prev => ({ ...prev, [referralId]: voteType }));
      
      toast.success(voteType === 'up' ? '👍 Thanks for the feedback!' : '👎 Thanks for reporting!');
    } catch (error) {
      toast.error('Failed to record vote. Try again.');
    }
  }, [referrals, votedItems]);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  };

  // Filter referrals
  const filteredReferrals = referrals.filter(r => {
    // Filter by app
    if (selectedApp && r.appName !== selectedApp) return false;
    
    // Calculate downvote ratio
    const totalVotes = (r.upvotes || 0) + (r.downvotes || 0);
    const downvoteRatio = totalVotes > 0 ? (r.downvotes || 0) / totalVotes : 0;
    
    // Hide if too many downvotes (unless showHidden is true)
    if (!showHidden && totalVotes >= 3 && downvoteRatio >= DOWNVOTE_THRESHOLD) {
      return false;
    }
    
    return true;
  });

  // Count hidden referrals
  const hiddenCount = referrals.filter(r => {
    const totalVotes = (r.upvotes || 0) + (r.downvotes || 0);
    const downvoteRatio = totalVotes > 0 ? (r.downvotes || 0) / totalVotes : 0;
    return totalVotes >= 3 && downvoteRatio >= DOWNVOTE_THRESHOLD;
  }).length;

  // Get unique apps from referrals
  const appsInUse = [...new Set(referrals.map(r => r.appName))];

  return (
    <div className="app">
      <Toaster 
        position="bottom-center"
        toastOptions={{
          className: 'toast-custom',
          duration: 3000,
        }}
      />
      
      <Header onAddClick={() => setShowAddModal(true)} />
      
      <main>
        <Hero 
          totalCodes={referrals.length}
          onAddClick={() => setShowAddModal(true)}
        />
        
        <section className="referrals-section">
          <div className="container">
            <div className="section-header">
              <h2>Browse Referral Codes</h2>
              <p>Find codes, save money, and help others earn rewards</p>
            </div>

            <AppFilter 
              apps={POPULAR_APPS}
              appsInUse={appsInUse}
              selectedApp={selectedApp}
              onSelectApp={setSelectedApp}
            />

            {hiddenCount > 0 && (
              <motion.button
                className="show-hidden-btn"
                onClick={() => setShowHidden(!showHidden)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {showHidden ? 'Hide' : 'Show'} {hiddenCount} hidden code{hiddenCount !== 1 ? 's' : ''} 
                (flagged by community)
              </motion.button>
            )}

            {loading ? (
              <div className="loading-grid">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="skeleton-card" />
                ))}
              </div>
            ) : filteredReferrals.length > 0 ? (
              <motion.div 
                className="referrals-grid"
                layout
              >
                <AnimatePresence mode="popLayout">
                  {filteredReferrals.map((referral, index) => (
                    <ReferralCard
                      key={referral.id}
                      referral={referral}
                      index={index}
                      onVote={handleVote}
                      onCopy={handleCopy}
                      userVote={votedItems[referral.id]}
                      apps={POPULAR_APPS}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <EmptyState 
                hasFilter={!!selectedApp}
                onClearFilter={() => setSelectedApp(null)}
                onAddClick={() => setShowAddModal(true)}
              />
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>
            Made with 🧡 • Share referrals, earn together
          </p>
          <p className="footer-note">
            No tracking, no accounts, just sharing
          </p>
        </div>
      </footer>

      <AnimatePresence>
        {showAddModal && (
          <AddReferralModal
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddReferral}
            apps={POPULAR_APPS}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
