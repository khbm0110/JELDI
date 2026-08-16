// Hand-written to match supabase/migrations/0001_init.sql and
// 0002_contact_messages.sql. If the schema drifts from this file,
// regenerate with:
//   supabase gen types typescript --project-id <ref> > lib/database.types.ts
//
// Each table entry below includes `Relationships` (even when empty)
// since newer @supabase/supabase-js generics require it to treat the
// entry as a valid table shape — omit it and inserts/updates silently
// type as `never` instead of erroring loudly.
//
// package.json pins @supabase/supabase-js to exactly 2.45.0 (not a
// caret range) because 2.112.3 — the latest as of this writing — uses
// a substantially different generic contract (Database is expected to
// carry an internal `__InternalSupabase` version marker) that this
// hand-written file doesn't match, and produced the same silent
// `never` failures even with `Relationships` present. When you run
// the real migrations against a live Supabase project, regenerate
// this file with `supabase gen types typescript`, and it's worth
// upgrading the package at the same time so both stay in sync.

export type StockStatus = "coming_soon" | "available" | "limited" | "sold_out";
export type OrderStatus = "pending" | "paid" | "shipped" | "fulfilled" | "cancelled" | "refunded";
export type StoryContentType = "text" | "markdown" | "image_url";
export type ContactMessageStatus = "new" | "read" | "replied";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  /** Cents. Null means the price is still pending — never render a fake number. */
  price_cents: number | null;
  currency: string;
  images: string[];
  stock_status: StockStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  product_id: string;
  customer_email: string;
  customer_name: string | null;
  shipping_address: Record<string, unknown> | null;
  quantity: number;
  total_cents: number;
  currency: string;
  status: OrderStatus;
  paypal_order_id: string | null;
  paypal_transaction_id: string | null;
  /** Nullable — set once a package actually ships (see 0003_order_tracking.sql). */
  tracking_number: string | null;
  carrier: string | null;
  tracking_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface StoryContentBlock {
  id: string;
  section_key: string;
  content_type: StoryContentType;
  content: string;
  sort_order: number;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: ContactMessageStatus;
  created_at: string;
}

type Relationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

export interface Database {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: Partial<Product> & Pick<Product, "slug" | "name">;
        Update: Partial<Product>;
        Relationships: Relationship[];
      };
      orders: {
        Row: Order;
        Insert: Partial<Order> &
          Pick<Order, "product_id" | "customer_email" | "total_cents">;
        Update: Partial<Order>;
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      story_content: {
        Row: StoryContentBlock;
        Insert: Partial<StoryContentBlock> &
          Pick<StoryContentBlock, "section_key" | "content">;
        Update: Partial<StoryContentBlock>;
        Relationships: Relationship[];
      };
      contact_messages: {
        Row: ContactMessage;
        Insert: Partial<ContactMessage> &
          Pick<ContactMessage, "name" | "email" | "message">;
        Update: Partial<ContactMessage>;
        Relationships: Relationship[];
      };
    };
  };
}
