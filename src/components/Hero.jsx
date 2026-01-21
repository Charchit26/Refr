import { motion } from 'framer-motion';
import { HiSparkles, HiUserGroup, HiCurrencyDollar } from 'react-icons/hi2';
import './Hero.css';

function Hero({ totalCodes, onAddClick }) {
  const stats = [
    { icon: <HiSparkles />, value: totalCodes, label: 'Referral Codes' },
    { icon: <HiUserGroup />, value: '∞', label: 'People Helped' },
    { icon: <HiCurrencyDollar />, value: '$$$', label: 'Saved Together' },
  ];

  return (
    <section className="hero">
      <div className="container">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="hero-badge">
            <span>🎁</span>
            <span>Share codes. Earn together.</span>
          </div>
          
          <h1 className="hero-title">
            The Community
            <span className="gradient-text"> Referral Hub</span>
          </h1>
          
          <p className="hero-description">
            Find working referral codes for your favorite apps, or share yours to help others save. 
            Upvote codes that work, downvote the ones that don't.
          </p>

          <div className="hero-actions">
            <motion.button
              className="hero-btn primary"
              onClick={onAddClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Share Your Code
            </motion.button>
            <motion.a
              href="#browse"
              className="hero-btn secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Codes
            </motion.a>
          </div>
        </motion.div>

        <motion.div 
          className="hero-stats"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={stat.label}
              className="stat-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
            >
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="hero-decoration">
        <div className="glow-orb orb-1" />
        <div className="glow-orb orb-2" />
      </div>
    </section>
  );
}

export default Hero;
