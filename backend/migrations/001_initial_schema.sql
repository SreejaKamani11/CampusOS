-- CampusOS Phase 1 — Initial Database Schema
-- PostgreSQL 15+
-- Migration: 001_initial_schema.sql

-- =============================================================================
-- Extensions
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- Enum Types
-- =============================================================================

CREATE TYPE user_role AS ENUM (
  'student',
  'staff',
  'admin'
);

CREATE TYPE service_type AS ENUM (
  'stationery',
  'canteen',
  'printout'
);

CREATE TYPE order_status AS ENUM (
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'picked_up',
  'cancelled'
);

-- =============================================================================
-- Utility: auto-update updated_at on row modification
-- =============================================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- Users & Authentication
-- =============================================================================

CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(255) NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  name            VARCHAR(255) NOT NULL,
  campus_id       VARCHAR(100),
  role            user_role NOT NULL DEFAULT 'student',
  active          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT users_email_unique UNIQUE (email)
);

CREATE TABLE refresh_tokens (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL,
  token_hash      VARCHAR(255) NOT NULL,
  expires_at      TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT refresh_tokens_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- =============================================================================
-- Cart
-- =============================================================================

CREATE TABLE carts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT carts_user_id_unique UNIQUE (user_id),
  CONSTRAINT carts_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id         UUID NOT NULL,
  service_type    service_type NOT NULL,
  reference_id    UUID NOT NULL,
  quantity        INTEGER NOT NULL DEFAULT 1,
  options         JSONB NOT NULL DEFAULT '{}',
  unit_price      NUMERIC(10, 2) NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT cart_items_quantity_positive CHECK (quantity > 0),
  CONSTRAINT cart_items_unit_price_non_negative CHECK (unit_price >= 0),
  CONSTRAINT cart_items_cart_id_fkey
    FOREIGN KEY (cart_id) REFERENCES carts (id) ON DELETE CASCADE
);

-- reference_id is polymorphic (stationery_products, canteen_menu_items, print_jobs)
-- and is validated at the application layer based on service_type.

-- =============================================================================
-- Orders
-- =============================================================================

CREATE TABLE orders (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number            VARCHAR(50) NOT NULL,
  user_id                 UUID NOT NULL,
  service_type            service_type NOT NULL,
  status                  order_status NOT NULL DEFAULT 'pending',
  total                   NUMERIC(10, 2) NOT NULL,
  pickup_token            VARCHAR(255),
  pickup_token_expires_at TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT orders_order_number_unique UNIQUE (order_number),
  CONSTRAINT orders_total_non_negative CHECK (total >= 0),
  CONSTRAINT orders_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT
);

CREATE TABLE order_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL,
  name            VARCHAR(255) NOT NULL,
  quantity        INTEGER NOT NULL,
  unit_price      NUMERIC(10, 2) NOT NULL,
  options         JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT order_items_quantity_positive CHECK (quantity > 0),
  CONSTRAINT order_items_unit_price_non_negative CHECK (unit_price >= 0),
  CONSTRAINT order_items_order_id_fkey
    FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE RESTRICT
);

CREATE TABLE order_status_history (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL,
  status          order_status NOT NULL,
  changed_by      UUID,
  changed_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT order_status_history_order_id_fkey
    FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE RESTRICT,
  CONSTRAINT order_status_history_changed_by_fkey
    FOREIGN KEY (changed_by) REFERENCES users (id) ON DELETE SET NULL
);

-- =============================================================================
-- Stationery
-- =============================================================================

CREATE TABLE stationery_categories (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(255) NOT NULL,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE stationery_products (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id     UUID NOT NULL,
  name            VARCHAR(255) NOT NULL,
  description     TEXT,
  price           NUMERIC(10, 2) NOT NULL,
  stock           INTEGER NOT NULL DEFAULT 0,
  image_url       VARCHAR(500),
  active          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT stationery_products_price_non_negative CHECK (price >= 0),
  CONSTRAINT stationery_products_stock_non_negative CHECK (stock >= 0),
  CONSTRAINT stationery_products_category_id_fkey
    FOREIGN KEY (category_id) REFERENCES stationery_categories (id) ON DELETE RESTRICT
);

-- =============================================================================
-- Canteen
-- =============================================================================

CREATE TABLE canteen_categories (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(255) NOT NULL,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE canteen_menu_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id     UUID NOT NULL,
  name            VARCHAR(255) NOT NULL,
  description     TEXT,
  price           NUMERIC(10, 2) NOT NULL,
  available       BOOLEAN NOT NULL DEFAULT TRUE,
  meal_periods    JSONB NOT NULL DEFAULT '[]',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT canteen_menu_items_price_non_negative CHECK (price >= 0),
  CONSTRAINT canteen_menu_items_category_id_fkey
    FOREIGN KEY (category_id) REFERENCES canteen_categories (id) ON DELETE RESTRICT
);

-- meal_periods stores applicable slots, e.g. ["breakfast", "lunch", "snacks"]

-- =============================================================================
-- Printout
-- =============================================================================

CREATE TABLE print_jobs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL,
  file_path         VARCHAR(500) NOT NULL,
  file_name         VARCHAR(255) NOT NULL,
  page_count        INTEGER NOT NULL,
  options           JSONB NOT NULL DEFAULT '{}',
  calculated_price  NUMERIC(10, 2),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT print_jobs_page_count_positive CHECK (page_count > 0),
  CONSTRAINT print_jobs_calculated_price_non_negative CHECK (
    calculated_price IS NULL OR calculated_price >= 0
  ),
  CONSTRAINT print_jobs_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- options stores print configuration: copies, color_mode, sides, page_range

-- =============================================================================
-- Indexes
-- =============================================================================

-- users
CREATE INDEX idx_users_role ON users (role);
CREATE INDEX idx_users_active ON users (active);

-- refresh_tokens
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens (user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens (expires_at);

-- carts
CREATE INDEX idx_carts_user_id ON carts (user_id);

-- cart_items
CREATE INDEX idx_cart_items_cart_id ON cart_items (cart_id);
CREATE INDEX idx_cart_items_service_type ON cart_items (service_type);

-- orders
CREATE INDEX idx_orders_user_id ON orders (user_id);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_service_type ON orders (service_type);
CREATE INDEX idx_orders_service_type_status ON orders (service_type, status);
CREATE INDEX idx_orders_created_at ON orders (created_at);
CREATE UNIQUE INDEX idx_orders_pickup_token_unique
  ON orders (pickup_token)
  WHERE pickup_token IS NOT NULL;

-- order_items
CREATE INDEX idx_order_items_order_id ON order_items (order_id);

-- order_status_history
CREATE INDEX idx_order_status_history_order_id ON order_status_history (order_id);
CREATE INDEX idx_order_status_history_changed_at ON order_status_history (changed_at);

-- stationery
CREATE INDEX idx_stationery_categories_sort_order ON stationery_categories (sort_order);
CREATE INDEX idx_stationery_products_category_id ON stationery_products (category_id);
CREATE INDEX idx_stationery_products_active ON stationery_products (active);
CREATE INDEX idx_stationery_products_category_active
  ON stationery_products (category_id, active);

-- canteen
CREATE INDEX idx_canteen_categories_sort_order ON canteen_categories (sort_order);
CREATE INDEX idx_canteen_menu_items_category_id ON canteen_menu_items (category_id);
CREATE INDEX idx_canteen_menu_items_available ON canteen_menu_items (available);
CREATE INDEX idx_canteen_menu_items_category_available
  ON canteen_menu_items (category_id, available);

-- print_jobs
CREATE INDEX idx_print_jobs_user_id ON print_jobs (user_id);
CREATE INDEX idx_print_jobs_created_at ON print_jobs (created_at);

-- =============================================================================
-- updated_at Triggers
-- =============================================================================

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_refresh_tokens_updated_at
  BEFORE UPDATE ON refresh_tokens
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_carts_updated_at
  BEFORE UPDATE ON carts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_order_items_updated_at
  BEFORE UPDATE ON order_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_order_status_history_updated_at
  BEFORE UPDATE ON order_status_history
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_stationery_categories_updated_at
  BEFORE UPDATE ON stationery_categories
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_stationery_products_updated_at
  BEFORE UPDATE ON stationery_products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_canteen_categories_updated_at
  BEFORE UPDATE ON canteen_categories
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_canteen_menu_items_updated_at
  BEFORE UPDATE ON canteen_menu_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_print_jobs_updated_at
  BEFORE UPDATE ON print_jobs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
