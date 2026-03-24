-- Migration: Add careCache column to Plants table
-- Run this on existing databases that were set up before this change.
ALTER TABLE Plants ADD COLUMN IF NOT EXISTS careCache JSON NULL;
