# Supabase setup

## 1. Create project
- Create a new Supabase project.
- Copy URL and anon key into `.env`.

## 2. Run schema
- Open SQL Editor.
- Paste `docs/schema.sql`.
- Run it.

## 3. Create first admin
- Sign up with email auth.
- Insert a row in `profiles` with role `admin`.

## 4. Storage buckets
Create these buckets:
- project-assets
- movie-posters
- blog-covers
- site-banners

## 5. EmailJS
- Create free EmailJS account.
- Add a service and template.
- Put keys in `.env`.