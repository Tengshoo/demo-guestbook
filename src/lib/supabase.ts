import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { EVENT_CONFIG } from '@/config/eventConfig';

export interface SupabaseGuestEntry {
  id: number;
  event_id?: string;
  name: string;
  message: string;
  photo_url?: string | null;
  signature_svg?: string | null;
  audio_url?: string | null;
  is_approved: number;
  created_at: string;
}

export const MAX_PHOTOS_PER_WISH = 10;

const SAFE_PHOTO_DATA_URL_REGEX = /^data:image\/(jpeg|jpg|png|webp);base64,[A-Za-z0-9+/=\s]+$/;
const SAFE_HTTPS_IMAGE_REGEX = /^https:\/\/images\.unsplash\.com\/[^\s"<>]+$/;
const MAX_PHOTO_DATA_URL_LENGTH = 4_500_000;

export function sanitizePhotoUrl(url?: string | null): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (
    trimmed.length > 0 &&
    trimmed.length <= MAX_PHOTO_DATA_URL_LENGTH &&
    (SAFE_PHOTO_DATA_URL_REGEX.test(trimmed) || SAFE_HTTPS_IMAGE_REGEX.test(trimmed))
  ) {
    return trimmed;
  }
  return null;
}

export function parsePhotoUrls(rawPhotoField?: string | null): string[] {
  if (!rawPhotoField || typeof rawPhotoField !== 'string') return [];
  const trimmed = rawPhotoField.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => (typeof item === 'string' ? sanitizePhotoUrl(item) : null))
          .filter((item): item is string => Boolean(item))
          .slice(0, MAX_PHOTOS_PER_WISH);
      }
    } catch {
      return [];
    }
  }

  const single = sanitizePhotoUrl(trimmed);
  return single ? [single] : [];
}

export function serializePhotoUrls(urls: string[]): string | null {
  const valid = urls
    .map((u) => sanitizePhotoUrl(u))
    .filter((u): u is string => Boolean(u))
    .slice(0, MAX_PHOTOS_PER_WISH);

  if (valid.length === 0) return null;
  if (valid.length === 1) return valid[0];
  return JSON.stringify(valid);
}

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  EVENT_CONFIG.supabase?.url ||
  '';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  EVENT_CONFIG.supabase?.anonKey ||
  '';
const currentEventId = EVENT_CONFIG.supabase?.eventId || 'demo-arman-farah';

let supabaseInstance: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  // If in demo mode without explicit environment variable overrides, prefer fast local showcase store
  if (EVENT_CONFIG.isDemoMode && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return false;
  }
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.trim().length > 0 &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.trim().length > 0
  );
}

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
}

// Scoped local storage key for demo entries
const LOCAL_STORAGE_KEY = `everafter_guestbook_entries_${currentEventId}`;
const BROADCAST_CHANNEL_NAME = `everafter_guestbook_bus_${currentEventId}`;

// Realistic, curated demo entries for Arman & Farah's Wedding Celebration
export const DEFAULT_DEMO_ENTRIES: SupabaseGuestEntry[] = [
  {
    id: 101,
    name: 'Maya & Sarah (Bridesmaids)',
    message:
      'Farah, you look absolutely ethereal tonight! Arman, you better take care of our bestie! Wishing you both endless laughter, spontaneous road trips, and boundless love! 💕🥂',
    photo_url:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
    signature_svg:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" fill="none" stroke="#B45309" stroke-width="2.5" stroke-linecap="round"><path d="M15,42 Q45,8 80,38 T140,25 Q175,5 210,38 T230,28" /></svg>',
    audio_url: '/assets/demo-voice-wish.wav',
    is_approved: 1,
    created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: 102,
    name: 'Dato\' Sri & Datin Kamil (Keluarga)',
    message:
      'Alhamdulillah. Melihat anakanda berdua di atas pelamin indah ini meruntun jiwa kami dengan kesyukuran yang amat mendalam. Semoga mahligai Arman & Farah sentiasa dipayungi sakinah, mawaddah, dan warahmah. Tahniah!',
    photo_url:
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80',
    signature_svg:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" fill="none" stroke="#241D17" stroke-width="2.2" stroke-linecap="round"><path d="M20,35 Q60,10 95,40 T150,20 Q190,45 220,18" /></svg>',
    audio_url: '/assets/demo-voice-wish.wav',
    is_approved: 1,
    created_at: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
  },
  {
    id: 103,
    name: 'The Seputeh Crew (Table 5)',
    message:
      'Best wedding celebration of 2026 hands down! The photobooth is crazy fun and the dessert bar is chef\'s kiss 🤌 Long live the newlyweds! Cheers to #ArmanFarahForever! 🎉✨',
    photo_url:
      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=80',
    signature_svg: null,
    audio_url: null,
    is_approved: 1,
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 104,
    name: 'Marcus Vance (Best Man)',
    message:
      'Arman, you are the brother I never had. Farah, you bring out the best smile in him every single day. Raise your glasses everyone—to a lifetime of grand adventures and unending toasts! 🥂',
    photo_url:
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1000&q=80',
    signature_svg:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" fill="none" stroke="#451A03" stroke-width="2.5" stroke-linecap="round"><path d="M15,48 Q40,12 85,35 T155,18 Q190,40 225,22" /></svg>',
    audio_url: '/assets/demo-voice-wish.wav',
    is_approved: 1,
    created_at: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
  },
  {
    id: 105,
    name: 'Uncle David & Auntie Lynn (Vancouver)',
    message:
      'Flew halfway around the world to be here tonight and we would do it again in a heartbeat! You two belong together. Never stop dancing like nobody is watching! ❤️',
    photo_url:
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80',
    signature_svg: null,
    audio_url: null,
    is_approved: 1,
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: 106,
    name: 'Kak Sofia & Abang Fikri',
    message:
      'Selamat Pengantin Baru Arman & Farah! Sama cantik sama padan bagai pinang dibelah dua. Moga dikurniakan zuriat yang soleh & solehah serta bahagia hingga jannah! 💐',
    photo_url:
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80',
    signature_svg:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" fill="none" stroke="#9A3412" stroke-width="2" stroke-linecap="round"><path d="M18,30 Q50,55 90,20 T160,35 Q195,15 228,30" /></svg>',
    audio_url: null,
    is_approved: 1,
    created_at: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
  },
  {
    id: 107,
    name: 'Sample Pending Toast (Moderation Demo)',
    message:
      'Welcome to the Host Admin Dashboard! This message is currently hidden/unapproved so you can test the 1-click moderation workflow. Click "Approve" above to instantly push it to the Live Wall!',
    photo_url:
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1000&q=80',
    signature_svg: null,
    audio_url: null,
    is_approved: 0, // Pending / Hidden for Admin demo!
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
];

// Broadcast notification channel for multi-tab reactivity
function notifyGuestbookChange() {
  if (typeof window === 'undefined') return;

  // 1. Dispatch DOM event in current tab
  window.dispatchEvent(new CustomEvent('everafter_guestbook_updated'));

  // 2. BroadcastChannel to other open tabs/windows
  try {
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.postMessage({ type: 'GUESTBOOK_UPDATED', timestamp: Date.now() });
      channel.close();
    }
  } catch {
    // BroadcastChannel unsupported or restricted
  }
}

/**
 * Subscribe to guestbook updates across tabs or Supabase Realtime
 */
export function subscribeToGuestbookUpdates(onUpdate: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  // 1. Listen for local custom events
  const handleLocalEvent = () => onUpdate();
  window.addEventListener('everafter_guestbook_updated', handleLocalEvent);

  // 2. Listen for localStorage changes across windows
  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === LOCAL_STORAGE_KEY) {
      onUpdate();
    }
  };
  window.addEventListener('storage', handleStorageEvent);

  // 3. Listen for BroadcastChannel messages
  let broadcastChannel: BroadcastChannel | null = null;
  if ('BroadcastChannel' in window) {
    try {
      broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      broadcastChannel.onmessage = () => {
        onUpdate();
      };
    } catch {
      // BroadcastChannel unavailable
    }
  }

  // 4. Supabase Realtime channel if configured
  const supabase = getSupabase();
  let supabaseChannel: RealtimeChannel | null = null;
  if (supabase) {
    supabaseChannel = supabase
      .channel('entries_realtime_stream')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'entries' },
        () => {
          onUpdate();
        }
      )
      .subscribe();
  }

  return () => {
    window.removeEventListener('everafter_guestbook_updated', handleLocalEvent);
    window.removeEventListener('storage', handleStorageEvent);
    if (broadcastChannel) {
      broadcastChannel.close();
    }
    if (supabase && supabaseChannel) {
      supabase.removeChannel(supabaseChannel);
    }
  };
}

function getLocalEntries(): SupabaseGuestEntry[] {
  if (typeof window === 'undefined') return DEFAULT_DEMO_ENTRIES;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_DEMO_ENTRIES));
      return DEFAULT_DEMO_ENTRIES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_DEMO_ENTRIES));
      return DEFAULT_DEMO_ENTRIES;
    }
    return parsed;
  } catch {
    return DEFAULT_DEMO_ENTRIES;
  }
}

function saveLocalEntries(entries: SupabaseGuestEntry[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
    notifyGuestbookChange();
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

/**
 * Reset demo entries back to default sample state
 */
export function resetDemoEntries(): SupabaseGuestEntry[] {
  if (typeof window === 'undefined') return DEFAULT_DEMO_ENTRIES;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_DEMO_ENTRIES));
  notifyGuestbookChange();
  return DEFAULT_DEMO_ENTRIES;
}

/**
 * Add a quick randomized test toast to test the live wall in 1-click
 */
export function addQuickDemoEntry(): SupabaseGuestEntry {
  const sampleGuests = [
    {
      name: 'Dr. Jason & Alya',
      message: 'What a breathtaking celebration! Farah looks stunning and Arman is glowing with joy. Wishing you two an adventurous and blissful lifetime together! 🥂',
      photo: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'Nadia (Cousin from Penang)',
      message: 'So honored to witness this fairytale wedding! Everything from the decor to the music is pure perfection. Tahniah Arman & Farah! ✨🌸',
      photo: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'The Gym Bros (Arman\'s Crew)',
      message: 'He put a ring on it! 💍 Couldn\'t be happier for you brother. You found the real MVP in Farah! Cheers to the next big chapter!',
      photo: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'Syahira & Danial',
      message: 'Selamat Pengantin Baru buat pasangan merpati dua sejoli! Moga ikatan cinta ini bersemi hingga ke jannah. Selamat menempuh alam rumah tangga! 💖',
      photo: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=80',
    },
  ];

  const pick = sampleGuests[Math.floor(Math.random() * sampleGuests.length)];
  const newEntry: SupabaseGuestEntry = {
    id: Date.now(),
    name: `${pick.name} (Live Test)`,
    message: pick.message,
    photo_url: pick.photo,
    signature_svg:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" fill="none" stroke="#D97706" stroke-width="2.2" stroke-linecap="round"><path d="M15,40 Q55,10 90,45 T160,25 Q195,10 225,40" /></svg>',
    audio_url: '/assets/demo-voice-wish.wav',
    is_approved: 1,
    created_at: new Date().toISOString(),
  };

  const current = getLocalEntries();
  saveLocalEntries([newEntry, ...current]);
  return newEntry;
}

/**
 * Get total count of photo uploads for the current event
 */
export async function getPhotoUploadCount(): Promise<number> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      let query = supabase
        .from('entries')
        .select('*', { count: 'exact', head: true })
        .not('photo_url', 'is', null);

      if (currentEventId) {
        query = query.eq('event_id', currentEventId);
      }

      const { count, error } = await query;
      if (!error && typeof count === 'number') {
        return count;
      }
    } catch (err) {
      console.warn('Supabase photo count error, falling back to local:', err);
    }
  }

  const local = getLocalEntries();
  return local.filter((e) => e.photo_url && e.photo_url.trim().length > 0).length;
}

/**
 * Check if photo upload is currently permitted for this event
 */
export async function isPhotoUploadAllowed(): Promise<{
  allowed: boolean;
  currentCount: number;
  limit: number;
}> {
  const limit = EVENT_CONFIG.photoUploadLimit ?? 500;
  const currentCount = await getPhotoUploadCount();
  return {
    allowed: currentCount < limit,
    currentCount,
    limit,
  };
}

/**
 * Submit a new guestbook memory
 */
export async function submitGuestbookEntry(entry: {
  name: string;
  message: string;
  photo_url?: string | null;
  photo_urls?: string[];
  audio_url?: string | null;
}): Promise<{ success: boolean; error?: string }> {
  const serializedPhotos =
    entry.photo_urls && entry.photo_urls.length > 0
      ? serializePhotoUrls(entry.photo_urls)
      : entry.photo_url
      ? serializePhotoUrls(parsePhotoUrls(entry.photo_url))
      : null;

  // Enforce photo upload limit if a photo is attached
  if (serializedPhotos) {
    const { allowed, currentCount, limit } = await isPhotoUploadAllowed();
    if (!allowed) {
      return {
        success: false,
        error: `Had muat naik foto sebanyak ${limit} keping telah dicapai (${currentCount}/${limit}). Anda tetap dialu-alukan menghantar ucapan teks & nota suara!`,
      };
    }
  }

  const supabase = getSupabase();

  if (supabase) {
    try {
      const { error } = await supabase.from('entries').insert([
        {
          event_id: currentEventId,
          name: entry.name.trim(),
          message: entry.message.trim(),
          photo_url: serializedPhotos,
          audio_url: entry.audio_url || null,
          is_approved: 1, // Automatically approved or set to 0 if manual moderation is preferred
        },
      ]);
      if (error) {
        console.warn('Supabase insert error, falling back to local:', error);
      } else {
        notifyGuestbookChange();
        return { success: true };
      }
    } catch (err: unknown) {
      console.warn('Supabase insert exception, falling back to local:', err);
    }
  }

  // Fallback: LocalStorage when running demo without cloud Supabase credentials
  const current = getLocalEntries();
  const newEntry: SupabaseGuestEntry = {
    id: Date.now(),
    name: entry.name.trim(),
    message: entry.message.trim(),
    photo_url: serializedPhotos,
    audio_url: entry.audio_url || null,
    is_approved: 1,
    created_at: new Date().toISOString(),
  };
  saveLocalEntries([newEntry, ...current]);
  return { success: true };
}

/**
 * Fetch all approved entries for the Live Wall
 */
export async function getApprovedEntries(): Promise<SupabaseGuestEntry[]> {
  const supabase = getSupabase();

  if (supabase) {
    try {
      let query = supabase
        .from('entries')
        .select('*')
        .eq('is_approved', 1);

      if (currentEventId) {
        query = query.eq('event_id', currentEventId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn('Supabase live wall query error, falling back to local:', err);
    }
  }

  return getLocalEntries().filter((e) => e.is_approved === 1);
}

/**
 * Fetch all entries for Admin Moderation
 */
export async function getAllEntriesForAdmin(pin?: string): Promise<SupabaseGuestEntry[]> {
  const expectedPin = process.env.NEXT_PUBLIC_ADMIN_PIN || EVENT_CONFIG.adminPin || '1234';
  if (pin !== undefined && pin !== expectedPin) {
    throw new Error('Invalid Host Admin PIN');
  }
  const supabase = getSupabase();

  if (supabase) {
    try {
      let query = supabase.from('entries').select('*');

      if (currentEventId) {
        query = query.eq('event_id', currentEventId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn('Supabase admin query error, falling back to local:', err);
    }
  }

  return getLocalEntries();
}

/**
 * Update approval status of an entry
 */
export async function updateEntryApproval(
  id: number,
  isApproved: number,
  _pin?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { error } = await supabase
        .from('entries')
        .update({ is_approved: isApproved })
        .eq('id', id);
      if (!error) {
        notifyGuestbookChange();
        return { success: true };
      }
    } catch (err) {
      console.warn('Supabase update approval error, falling back to local:', err);
    }
  }

  const current = getLocalEntries();
  const updated = current.map((e) =>
    e.id === id ? { ...e, is_approved: isApproved } : e
  );
  saveLocalEntries(updated);
  return { success: true };
}

/**
 * Delete an entry
 */
export async function deleteGuestEntry(
  id: number,
  _pin?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { error } = await supabase.from('entries').delete().eq('id', id);
      if (!error) {
        notifyGuestbookChange();
        return { success: true };
      }
    } catch (err) {
      console.warn('Supabase delete entry error, falling back to local:', err);
    }
  }

  const current = getLocalEntries();
  const updated = current.filter((e) => e.id !== id);
  saveLocalEntries(updated);
  return { success: true };
}
