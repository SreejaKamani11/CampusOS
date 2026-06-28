-- CampusOS Phase 1 — Schema Improvements
-- PostgreSQL 15+
-- Migration: 002_schema_improvements.sql
--
-- Depends on: 001_initial_schema.sql
--
-- Changes:
--   1. Extract QR pickup data into dedicated qr_pickups table
--   2. Add soft-delete support (deleted_at) on selected tables
--   3. Add inventory_transactions audit table for stationery stock

-- =============================================================================
-- 1. QR Pickups
-- =============================================================================

CREATE TABLE qr_pickups (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL,
  pickup_token    VARCHAR(255) NOT NULL,
  scanned_by      UUID,
  scanned_at      TIMESTAMPTZ,
  is_used         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT qr_pickups_order_id_unique UNIQUE (order_id),
  CONSTRAINT qr_pickups_pickup_token_unique UNIQUE (pickup_token),
  CONSTRAINT qr_pickups_order_id_fkey
    FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE RESTRICT,
  CONSTRAINT qr_pickups_scanned_by_fkey
    FOREIGN KEY (scanned_by) REFERENCES users (id) ON DELETE SET NULL,
  CONSTRAINT qr_pickups_scanned_consistency CHECK (
    (is_used = FALSE AND scanned_at IS NULL AND scanned_by IS NULL)
    OR (is_used = TRUE AND scanned_at IS NOT NULL)
  )
);

-- Migrate existing pickup tokens from orders (if any exist from prior deployments)
INSERT INTO qr_pickups (order_id, pickup_token, is_used, created_at, updated_at)
SELECT
  o.id,
  o.pickup_token,
  o.status = 'picked_up',
  o.created_at,
  o.updated_at
FROM orders o
WHERE o.pickup_token IS NOT NULL;

UPDATE qr_pickups qp
SET
  scanned_at = o.updated_at,
  updated_at = NOW()
FROM orders o
WHERE qp.order_id = o.id
  AND qp.is_used = TRUE
  AND qp.scanned_at IS NULL;

-- Remove denormalized pickup columns from orders (now owned by qr_pickups)
DROP INDEX IF EXISTS idx_orders_pickup_token_unique;

ALTER TABLE orders
  DROP COLUMN IF EXISTS pickup_token,
  DROP COLUMN IF EXISTS pickup_token_expires_at;

CREATE INDEX idx_qr_pickups_order_id ON qr_pickups (order_id);
CREATE INDEX idx_qr_pickups_pickup_token ON qr_pickups (pickup_token);
CREATE INDEX idx_qr_pickups_is_used ON qr_pickups (is_used);
CREATE INDEX idx_qr_pickups_unused ON qr_pickups (pickup_token)
  WHERE is_used = FALSE;

CREATE TRIGGER trg_qr_pickups_updated_at
  BEFORE UPDATE ON qr_pickups
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- 2. Soft Delete Support
-- =============================================================================

ALTER TABLE users
  ADD COLUMN deleted_at TIMESTAMPTZ;

ALTER TABLE stationery_products
  ADD COLUMN deleted_at TIMESTAMPTZ;

ALTER TABLE canteen_menu_items
  ADD COLUMN deleted_at TIMESTAMPTZ;

-- Allow re-registration after soft-deleted accounts
ALTER TABLE users DROP CONSTRAINT users_email_unique;

CREATE UNIQUE INDEX idx_users_email_active
  ON users (email)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_users_deleted_at ON users (deleted_at)
  WHERE deleted_at IS NOT NULL;

CREATE INDEX idx_stationery_products_not_deleted
  ON stationery_products (category_id, active)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_canteen_menu_items_not_deleted
  ON canteen_menu_items (category_id, available)
  WHERE deleted_at IS NULL;

-- =============================================================================
-- 3. Inventory Transactions
-- =============================================================================

CREATE TABLE inventory_transactions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id        UUID NOT NULL,
  quantity_change   INTEGER NOT NULL,
  reason            VARCHAR(255),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT inventory_transactions_quantity_non_zero CHECK (quantity_change <> 0),
  CONSTRAINT inventory_transactions_product_id_fkey
    FOREIGN KEY (product_id) REFERENCES stationery_products (id) ON DELETE RESTRICT
);

CREATE INDEX idx_inventory_transactions_product_id
  ON inventory_transactions (product_id);

CREATE INDEX idx_inventory_transactions_created_at
  ON inventory_transactions (created_at);

CREATE INDEX idx_inventory_transactions_product_created
  ON inventory_transactions (product_id, created_at DESC);
