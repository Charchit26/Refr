import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiXMark } from 'react-icons/hi2';
import './AddReferralModal.css';

function AddReferralModal({ onClose, onSubmit, apps }) {
  const [formData, setFormData] = useState({
    appName: '',
    code: '',
    referralLink: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.appName || !formData.code) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const selectedApp = apps.find(a => a.name === formData.appName);

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Share a Referral Code</h2>
          <button className="close-btn" onClick={onClose}>
            <HiXMark />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* App Selection */}
          <div className="form-group">
            <label htmlFor="appName">App / Service *</label>
            <div className="app-grid">
              {apps.map(app => (
                <button
                  key={app.name}
                  type="button"
                  className={`app-option ${formData.appName === app.name ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, appName: app.name }))}
                  style={{ '--app-color': app.color }}
                >
                  <span className="app-option-icon">{app.icon}</span>
                  <span className="app-option-name">{app.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Code Input */}
          <div className="form-group">
            <label htmlFor="code">Referral Code *</label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g., JOHN2024"
              required
              autoComplete="off"
            />
          </div>

          {/* Link Input */}
          <div className="form-group">
            <label htmlFor="referralLink">
              Referral Link <span className="optional">(optional)</span>
            </label>
            <input
              type="url"
              id="referralLink"
              name="referralLink"
              value={formData.referralLink}
              onChange={handleChange}
              placeholder="https://..."
              autoComplete="off"
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">
              Note <span className="optional">(optional)</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., Both get $10 off first ride"
              rows={2}
              maxLength={200}
            />
            <span className="char-count">{formData.description.length}/200</span>
          </div>

          {/* Preview */}
          {formData.appName && formData.code && (
            <motion.div 
              className="preview-section"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <div className="preview-label">Preview</div>
              <div className="preview-card" style={{ '--app-color': selectedApp?.color }}>
                <span className="preview-icon">{selectedApp?.icon}</span>
                <span className="preview-app">{formData.appName}</span>
                <code className="preview-code">{formData.code}</code>
              </div>
            </motion.div>
          )}

          {/* Submit */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              className="submit-btn"
              disabled={!formData.appName || !formData.code || loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Adding...' : 'Add Referral'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default AddReferralModal;
