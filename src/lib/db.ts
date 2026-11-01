// Unused legacy database helper (all active operations use Supabase & LocalStorage client-side)
export interface GuestbookEntry {
  id: number;
  name: string;
  message: string;
  photo_url?: string | null;
  signature_svg?: string | null;
  audio_url?: string | null;
  is_approved: number;
  created_at: string;
}
