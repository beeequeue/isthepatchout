/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable */

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      patches: {
        Row: {
          id: string
          links: string[]
          releasedAt: string | null
          number: number
        }
        Insert: {
          id: string
          links: string[]
          releasedAt?: string | null
          number: number
        }
        Update: {
          id?: string
          links?: string[]
          releasedAt?: string | null
          number?: number
        }
      }
      subscriptions: {
        Row: {
          endpoint: string
          auth: string
          extra: string | null
          environment: string
          lastNotified: number
          createdAt: string
          type: string
        }
        Insert: {
          endpoint: string
          auth: string
          extra?: string | null
          environment: string
          lastNotified: number
          createdAt?: string
          type?: string
        }
        Update: {
          endpoint?: string
          auth?: string
          extra?: string | null
          environment?: string
          lastNotified?: number
          createdAt?: string
          type?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
  }
}
