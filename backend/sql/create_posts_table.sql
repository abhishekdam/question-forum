-- SQL to create a simple posts table for the forum
-- Run this in your Supabase SQL editor

create extension if not exists "pgcrypto";

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  author text,
  created_at timestamptz default now()
);
