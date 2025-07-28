import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

const AnnouncementBanner = ({ location = 'global', userRole = 'all' }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
    loadDismissedAnnouncements();
  }, [location, userRole]);

  const fetchAnnouncements = async () => {
    try {
      const params = new URLSearchParams({
        active_only: 'true',
        location: location,
        userRole: userRole
      });

      const response = await fetch(`/api/announcements?${params}`);
      const data = await response.json();

      if (data.success) {
        setAnnouncements(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDismissedAnnouncements = () => {
    try {
      const dismissed = localStorage.getItem('dismissedAnnouncements');
      if (dismissed) {
        setDismissedAnnouncements(JSON.parse(dismissed));
      }
    } catch (error) {
      console.error('Error loading dismissed announcements:', error);
    }
  };

  const saveDismissedAnnouncements = (dismissed) => {
    try {
      localStorage.setItem('dismissedAnnouncements', JSON.stringify(dismissed));
    } catch (error) {
      console.error('Error saving dismissed announcements:', error);
    }
  };

  const dismissAnnouncement = async (announcementId) => {
    // Track dismissal in analytics
    try {
      await fetch(`/api/announcements/${announcementId}/dismiss`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error tracking dismissal:', error);
    }

    // Add to dismissed list
    const newDismissed = [...dismissedAnnouncements, announcementId];
    setDismissedAnnouncements(newDismissed);
    saveDismissedAnnouncements(newDismissed);
  };

  const handleActionClick = async (announcement) => {
    // Track click in analytics
    try {
      await fetch(`/api/announcements/${announcement._id}/click`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error tracking click:', error);
    }

    // Open link
    if (announcement.actionButton?.link) {
      window.open(announcement.actionButton.link, '_blank');
    }
  };

  // Filter out dismissed announcements
  const visibleAnnouncements = announcements.filter(
    announcement => !dismissedAnnouncements.includes(announcement._id)
  );

  if (loading || visibleAnnouncements.length === 0) {
    return null;
  }

  return (
    <div className="relative z-50">
      <AnimatePresence>
        {visibleAnnouncements.map((announcement, index) => (
          <AnnouncementItem
            key={announcement._id}
            announcement={announcement}
            index={index}
            onDismiss={() => dismissAnnouncement(announcement._id)}
            onActionClick={() => handleActionClick(announcement)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const AnnouncementItem = ({ announcement, index, onDismiss, onActionClick }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-hide functionality
    if (announcement.autoHide && announcement.autoHideDelay) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300); // Wait for animation to complete
      }, announcement.autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [announcement.autoHide, announcement.autoHideDelay, onDismiss]);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300); // Wait for animation to complete
  };

  const isPopup = announcement.displayLocation?.includes('popup');

  if (isPopup) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        onClick={announcement.dismissible ? handleDismiss : undefined}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="max-w-md w-full shadow-2xl rounded-2xl overflow-hidden"
          style={{
            backgroundColor: announcement.backgroundColor,
            borderColor: announcement.borderColor,
            color: announcement.textColor,
            borderWidth: '2px',
            borderStyle: 'solid'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {announcement.icon && (
                  <span className="text-2xl">{announcement.icon}</span>
                )}
                <h3 className="text-lg font-semibold">
                  {announcement.title}
                </h3>
              </div>
              {announcement.dismissible && (
                <button
                  onClick={handleDismiss}
                  className="text-current opacity-70 hover:opacity-100 transition-opacity"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>

            <p className="text-sm opacity-90 mb-4">
              {announcement.content}
            </p>

            {announcement.actionButton?.text && announcement.actionButton?.link && (
              <button
                onClick={onActionClick}
                className="w-full px-4 py-2 rounded-lg font-medium transition-opacity hover:opacity-80"
                style={{ backgroundColor: announcement.actionButton.color }}
              >
                {announcement.actionButton.text}
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Banner style announcement
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="w-full shadow-lg"
      style={{
        backgroundColor: announcement.backgroundColor,
        borderColor: announcement.borderColor,
        color: announcement.textColor,
        borderBottomWidth: '2px',
        borderBottomStyle: 'solid'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1 min-w-0">
            {announcement.icon && (
              <span className="text-xl mr-3 flex-shrink-0">{announcement.icon}</span>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">
                {announcement.title}
              </p>
              <p className="text-xs opacity-90 mt-1">
                {announcement.content}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-4">
            {announcement.actionButton?.text && announcement.actionButton?.link && (
              <button
                onClick={onActionClick}
                className="px-3 py-1 text-xs font-medium rounded transition-opacity hover:opacity-80 whitespace-nowrap"
                style={{ backgroundColor: announcement.actionButton.color }}
              >
                {announcement.actionButton.text}
              </button>
            )}

            {announcement.dismissible && (
              <button
                onClick={handleDismiss}
                className="text-current opacity-70 hover:opacity-100 transition-opacity flex-shrink-0"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnnouncementBanner; 