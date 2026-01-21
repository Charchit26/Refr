import { motion } from 'framer-motion';
import { HiHandThumbUp, HiHandThumbDown, HiClipboardDocument, HiLink } from 'react-icons/hi2';
import './ReferralCard.css';

function ReferralCard({ referral, index, onVote, onCopy, userVote, apps }) {
  const { id, appName, code, referralLink, description, upvotes = 0, downvotes = 0 } = referral;
  
  // Find app info
  const appInfo = apps.find(a => a.name === appName) || { icon: '📱', color: '#6B7280' };
  
  // Calculate trust score
  const totalVotes = upvotes + downvotes;
  const trustScore = totalVotes > 0 ? Math.round((upvotes / totalVotes) * 100) : null;
  
  // Determine trust level
  const getTrustLevel = () => {
    if (totalVotes < 3) return { label: 'New', color: 'var(--text-muted)' };
    if (trustScore >= 80) return { label: 'Trusted', color: 'var(--success)' };
    if (trustScore >= 60) return { label: 'Good', color: 'var(--warning)' };
    if (trustScore >= 40) return { label: 'Mixed', color: 'var(--warning)' };
    return { label: 'Flagged', color: 'var(--danger)' };
  };
  
  const trustLevel = getTrustLevel();

  return (
    <motion.article
      className="referral-card"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      style={{ '--app-color': appInfo.color }}
    >
      {/* Header */}
      <div className="card-header">
        <div className="app-badge">
          <span className="app-icon">{appInfo.icon}</span>
          <span className="app-name">{appName}</span>
        </div>
        <div className="trust-badge" style={{ color: trustLevel.color }}>
          {trustLevel.label}
          {trustScore !== null && (
            <span className="trust-score">{trustScore}%</span>
          )}
        </div>
      </div>

      {/* Code */}
      <div className="code-section">
        <div className="code-display">
          <code>{code}</code>
        </div>
        <motion.button
          className="copy-btn"
          onClick={() => onCopy(code)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Copy code"
        >
          <HiClipboardDocument />
        </motion.button>
      </div>

      {/* Link (if available) */}
      {referralLink && (
        <a 
          href={referralLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="referral-link"
        >
          <HiLink />
          <span>Open referral link</span>
        </a>
      )}

      {/* Description */}
      {description && (
        <p className="card-description">{description}</p>
      )}

      {/* Footer with voting */}
      <div className="card-footer">
        <div className="vote-section">
          <motion.button
            className={`vote-btn upvote ${userVote === 'up' ? 'voted' : ''}`}
            onClick={() => onVote(id, 'up')}
            disabled={!!userVote}
            whileHover={!userVote ? { scale: 1.1 } : {}}
            whileTap={!userVote ? { scale: 0.9 } : {}}
            title="This code works!"
          >
            <HiHandThumbUp />
            <span>{upvotes}</span>
          </motion.button>
          
          <motion.button
            className={`vote-btn downvote ${userVote === 'down' ? 'voted' : ''}`}
            onClick={() => onVote(id, 'down')}
            disabled={!!userVote}
            whileHover={!userVote ? { scale: 1.1 } : {}}
            whileTap={!userVote ? { scale: 0.9 } : {}}
            title="This code doesn't work"
          >
            <HiHandThumbDown />
            <span>{downvotes}</span>
          </motion.button>
        </div>

        <div className="vote-hint">
          {userVote ? (
            <span className="voted-text">Thanks for voting!</span>
          ) : (
            <span>Did it work?</span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default ReferralCard;
