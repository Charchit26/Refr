import { motion } from 'framer-motion';
import './AppFilter.css';

function AppFilter({ apps, appsInUse, selectedApp, onSelectApp }) {
  // Only show apps that have referrals + "All" option
  const availableApps = apps.filter(app => appsInUse.includes(app.name));

  return (
    <div className="app-filter" id="browse">
      <motion.button
        className={`filter-chip ${!selectedApp ? 'active' : ''}`}
        onClick={() => onSelectApp(null)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="chip-icon">✨</span>
        <span>All</span>
      </motion.button>

      {availableApps.map(app => (
        <motion.button
          key={app.name}
          className={`filter-chip ${selectedApp === app.name ? 'active' : ''}`}
          onClick={() => onSelectApp(app.name)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            '--app-color': app.color,
          }}
        >
          <span className="chip-icon">{app.icon}</span>
          <span>{app.name}</span>
        </motion.button>
      ))}

      {availableApps.length === 0 && (
        <p className="no-apps-hint">
          No referrals yet. Be the first to add one!
        </p>
      )}
    </div>
  );
}

export default AppFilter;
