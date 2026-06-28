-- CampusOS Phase 1 — Mixed Order Service Type
-- PostgreSQL 15+
-- Migration: 003_add_mixed_service_type.sql

ALTER TYPE service_type ADD VALUE IF NOT EXISTS 'mixed';