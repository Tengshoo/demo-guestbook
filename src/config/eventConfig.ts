/**
 * =========================================================================
 * 👰🤵 DEMO EVENT CONFIGURATION (EVERAFTER SHOWCASE DEMO)
 * =========================================================================
 * 
 * Configured for Arman & Farah's Wedding Celebration Demo at Glasshouse at Seputeh.
 * All pages (Cover, Guestbook, Photobooth Studio, Live Wall, and Admin Dashboard)
 * automatically display these demo details.
 * 
 * =========================================================================
 */

export const EVENT_CONFIG = {
  // 1. Couple or Event Main Names
  title: 'Arman & Farah',

  // 2. Event Type / Subtitle (Displayed above the main couple name)
  eventType: {
    en: 'Wedding Celebration',
    ms: 'Majlis Perkahwinan',
  },

  // 3. Event Date
  date: {
    en: 'Saturday, 28 November 2026',
    ms: 'Sabtu, 28 November 2026',
    numeric: '28.11.2026',        // Used in photobooth strip taglines & stamps
  },

  // 4. Event Venue / Location
  venue: 'Glasshouse at Seputeh, Kuala Lumpur',

  // 5. Social Media Hashtag
  hashtag: '#ArmanFarahForever',

  // 6. Photobooth Studio Strip Customization
  photobooth: {
    coupleNames: 'Arman & Farah',
    date: '28.11.2026',
    tagline: 'golden memories & joyful laughs',
  },

  // 7. Cover Photos (Saved in /public/assets/img/ folder)
  images: {
    // Couple portrait avatar (circular photo on front page cover)
    avatar: '/assets/img/arman-farah-welcome.jpg',
    // Background venue image (full-bleed cinematic cover photo for Home & Live Wall)
    background: '/assets/img/arman-farah-venue.png',
  },

  // 8. Supabase Cloud Database (With seamless, zero-config local demo fallback)
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    // Scoped storage ID for this demo
    eventId: 'demo-arman-farah',
  },

  // 9. Google Drive Photo Storage (Optional in Demo Mode)
  googleDrive: {
    scriptUrl: process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || '',
    folderUrl: process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_URL || '',
  },

  // 10. Host Admin PIN (Default PIN for /admin moderation page)
  adminPin: '1234',

  // 11. Photo Upload Limit (Total allowed across Gallery, Selfie & Photobooth)
  photoUploadLimit: 500,

  // 12. Demo Showcase Mode Flag
  isDemoMode: true,
};
