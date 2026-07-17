export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          role: 'super_admin' | 'template_admin' | 'customer_support' | 'user'
          updated_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: 'super_admin' | 'template_admin' | 'customer_support' | 'user'
          updated_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: 'super_admin' | 'template_admin' | 'customer_support' | 'user'
          updated_at?: string | null
        }
      }
      templates: {
        Row: {
          id: string
          kategori: string
          thumbnail_url: string | null
          default_theme_config: Json
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          kategori: string
          thumbnail_url?: string | null
          default_theme_config?: Json
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          kategori?: string
          thumbnail_url?: string | null
          default_theme_config?: Json
          is_active?: boolean
          created_at?: string
        }
      }
      invitations: {
        Row: {
          id: string
          owner_id: string
          template_id: string | null
          slug: string
          status: 'draft' | 'published'
          masa_aktif_mulai: string | null
          masa_aktif_selesai: string | null
          data: Json
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          template_id?: string | null
          slug: string
          status?: 'draft' | 'published'
          masa_aktif_mulai?: string | null
          masa_aktif_selesai?: string | null
          data?: Json
          created_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          template_id?: string | null
          slug?: string
          status?: 'draft' | 'published'
          masa_aktif_mulai?: string | null
          academic_year?: string | null
          masa_aktif_selesai?: string | null
          data?: Json
          created_at?: string
        }
      }
      wishes: {
        Row: {
          id: string
          invitation_id: string
          nama_tamu: string
          pesan: string
          created_at: string
        }
        Insert: {
          id?: string
          invitation_id: string
          nama_tamu: string
          pesan: string
          created_at?: string
        }
        Update: {
          id?: string
          invitation_id?: string
          nama_tamu?: string
          pesan?: string
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          invitation_id: string | null
          jumlah: number
          status: 'pending' | 'settlement' | 'expire' | 'cancel'
          midtrans_order_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          invitation_id?: string | null
          jumlah: number
          status?: 'pending' | 'settlement' | 'expire' | 'cancel'
          midtrans_order_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          invitation_id?: string | null
          jumlah?: number
          status?: 'pending' | 'settlement' | 'expire' | 'cancel'
          midtrans_order_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
