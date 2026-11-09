-- ==========================================
-- 0. CLEAN RESET (FOR RE-RUNNABILITY & IDEMPOTENCY)
-- ==========================================
DROP TABLE IF EXISTS lead_valuations CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS pages CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS clinical_packages CASCADE;
DROP TABLE IF EXISTS components CASCADE;
DROP TABLE IF EXISTS doctor_implant_types CASCADE;
DROP TABLE IF EXISTS clinic_doctors CASCADE;
DROP TABLE IF EXISTS clinic_insurances CASCADE;
DROP TABLE IF EXISTS insurances CASCADE;
DROP TABLE IF EXISTS clinics CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS specialties CASCADE;
DROP TABLE IF EXISTS implant_types CASCADE;
DROP TABLE IF EXISTS implant_brands CASCADE;
DROP TABLE IF EXISTS manufacturers CASCADE;
DROP TABLE IF EXISTS districts CASCADE;
DROP TABLE IF EXISTS cities CASCADE;
DROP TABLE IF EXISTS provinces CASCADE;
DROP TABLE IF EXISTS countries CASCADE;

DROP TYPE IF EXISTS gender_enum CASCADE;
DROP TYPE IF EXISTS age_group_enum CASCADE;
DROP TYPE IF EXISTS center_type_enum CASCADE;
DROP TYPE IF EXISTS insurance_type_enum CASCADE;
DROP TYPE IF EXISTS component_category CASCADE;
DROP TYPE IF EXISTS admin_role CASCADE;

-- ==========================================
-- 1. ENUM TYPES
-- ==========================================
CREATE TYPE gender_enum AS ENUM ('male', 'female');
CREATE TYPE age_group_enum AS ENUM ('adults', 'children', 'both');
CREATE TYPE center_type_enum AS ENUM ('private_office', 'clinic', 'hospital');
CREATE TYPE insurance_type_enum AS ENUM ('basic', 'supplementary');

-- ==========================================
-- 2. GEOGRAPHY & LOCATION HIERARCHY
-- ==========================================
CREATE TABLE countries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    iso_code CHAR(2) UNIQUE -- e.g., KR, CH, DE, US, IR
);

CREATE TABLE provinces (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    province_id INT NOT NULL REFERENCES provinces(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    UNIQUE(province_id, name)
);

CREATE TABLE districts (
    id SERIAL PRIMARY KEY,
    city_id INT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL,
    region_zone VARCHAR(50), -- e.g., شمال تهران، غرب تهران، مرکز
    UNIQUE(city_id, name),
    UNIQUE(city_id, slug)
);

-- ==========================================
-- 3. IMPLANT PRODUCT HIERARCHY
-- ==========================================
CREATE TABLE manufacturers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    slug VARCHAR(150) NOT NULL UNIQUE,
    hq_country_id INT NOT NULL REFERENCES countries(id) ON DELETE RESTRICT,
    website VARCHAR(255)
);

CREATE TABLE implant_brands (
    id SERIAL PRIMARY KEY,
    manufacturer_id INT NOT NULL REFERENCES manufacturers(id) ON DELETE CASCADE,
    origin_country_id INT NOT NULL REFERENCES countries(id) ON DELETE RESTRICT,
    name VARCHAR(150) NOT NULL UNIQUE,
    slug VARCHAR(150) NOT NULL UNIQUE,
    warranty_description VARCHAR(255)
);

CREATE TABLE implant_types (
    id SERIAL PRIMARY KEY,
    brand_id INT NOT NULL REFERENCES implant_brands(id) ON DELETE CASCADE,
    model_name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL,
    implant_category VARCHAR(100) NOT NULL, -- Bone Level, Tissue Level, Basal
    material VARCHAR(100) DEFAULT 'Titanium', -- Titanium Grade 4/5, Roxolid, Zirconia
    surface_technology VARCHAR(150), -- SLActive, XPEED, MPS, SA
    avg_lifespan_years INT CHECK (avg_lifespan_years > 0),
    extra_specs JSONB DEFAULT '{}'::jsonb, -- {"connection_type": "Morse Taper", "diameters": [3.5, 4.0, 4.5], "fda_approved": true}
    UNIQUE(brand_id, model_name),
    UNIQUE(brand_id, slug)
);

-- ==========================================
-- 4. DOCTORS & SPECIALTIES
-- ==========================================
CREATE TABLE specialties (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL UNIQUE,
    slug VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    slug VARCHAR(200) NOT NULL,
    medical_council_code VARCHAR(50) NOT NULL UNIQUE,
    gender gender_enum NOT NULL,
    specialty_id INT NOT NULL REFERENCES specialties(id) ON DELETE RESTRICT,
    patient_age_group age_group_enum NOT NULL DEFAULT 'adults',
    passport_committed BOOLEAN NOT NULL DEFAULT TRUE,
    bio TEXT,
    rating NUMERIC(3,2) DEFAULT 4.9,
    reviews_count INT DEFAULT 0,
    experience_years INT DEFAULT 10,
    avatar TEXT,
    verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 5. UNIFIED MEDICAL CENTERS (CLINICS & OFFICES) & INSURANCES
-- ==========================================
CREATE TABLE clinics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL,
    center_type center_type_enum NOT NULL DEFAULT 'clinic', -- 'private_office' | 'clinic' | 'hospital'
    city_id INT NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
    district_id INT REFERENCES districts(id) ON DELETE SET NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    phone VARCHAR(50),
    is_24_7 BOOLEAN NOT NULL DEFAULT FALSE,
    working_hours JSONB DEFAULT '{}'::jsonb, -- {"saturday_to_wednesday": "09:00-21:00", "thursday": "09:00-14:00", "friday": "closed"}
    is_free_tariff_only BOOLEAN NOT NULL DEFAULT FALSE,
    image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE insurances (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    insurance_type insurance_type_enum NOT NULL DEFAULT 'supplementary'
);

-- ==========================================
-- 6. JUNCTION TABLES (M:N RELATIONSHIPS)
-- ==========================================
CREATE TABLE clinic_insurances (
    clinic_id INT NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    insurance_id INT NOT NULL REFERENCES insurances(id) ON DELETE CASCADE,
    PRIMARY KEY (clinic_id, insurance_id)
);

CREATE TABLE clinic_doctors (
    id SERIAL PRIMARY KEY,
    clinic_id INT NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    doctor_id INT NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    shift_schedule JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE (clinic_id, doctor_id)
);

CREATE TABLE doctor_implant_types (
    doctor_id INT NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    implant_type_id INT NOT NULL REFERENCES implant_types(id) ON DELETE CASCADE,
    PRIMARY KEY (doctor_id, implant_type_id)
);

-- ==========================================
-- 5. COMPONENTS & CLINICAL PACKAGES DOMAIN
-- ==========================================
CREATE TYPE component_category AS ENUM (
    'fixture',
    'abutment',
    'healing',
    'impression_coping',
    'analog',
    'surgical_kit',
    'scan_body',
    'digital_analog'
);

CREATE TABLE components (
    id SERIAL PRIMARY KEY,
    brand_id INT REFERENCES implant_brands(id) ON DELETE SET NULL,
    category component_category NOT NULL,
    ref_code VARCHAR(100) UNIQUE NOT NULL,
    lot_number VARCHAR(100) NOT NULL,
    name_fa VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    description TEXT,
    material VARCHAR(150),
    platform_size VARCHAR(100),
    hex_size VARCHAR(100),
    morse_taper_angle VARCHAR(100),
    surface VARCHAR(150),
    torque_ncm NUMERIC(6,2),
    compatibility VARCHAR(255),
    price_toman BIGINT NOT NULL DEFAULT 0,
    in_stock BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    is_critical BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clinical_packages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    brand_name VARCHAR(150) NOT NULL,
    fixture_ref VARCHAR(100),
    abutment_ref VARCHAR(100),
    healing_ref VARCHAR(100),
    impression_ref VARCHAR(100),
    price_toman BIGINT NOT NULL,
    description TEXT,
    badge VARCHAR(100),
    items_included JSONB DEFAULT '[]'::jsonb
);

-- ==========================================
-- 6. CMS & HEADLESS BLOG DOMAIN
-- ==========================================
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    author VARCHAR(150) NOT NULL,
    read_time_minutes INT DEFAULT 5,
    featured_image TEXT,
    published_at VARCHAR(100) NOT NULL,
    meta_robots VARCHAR(50) DEFAULT 'index, follow',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(150) DEFAULT 'تیم دنتال مپ',
    template VARCHAR(50) DEFAULT 'default',
    published_at VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'publish',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE site_settings (
    id SERIAL PRIMARY KEY,
    hotline VARCHAR(50) DEFAULT '021-88001144',
    site_title VARCHAR(255) NOT NULL,
    announcement TEXT,
    meta_description TEXT,
    canonical_domain VARCHAR(255) DEFAULT 'https://dentalmap.ir',
    is_lead_engine_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lead_valuations (
    id SERIAL PRIMARY KEY,
    clinic_id INT NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    doctor_id INT REFERENCES doctors(id) ON DELETE SET NULL,
    lead_count INT DEFAULT 0,
    total_valuation_toman BIGINT DEFAULT 0,
    last_lead_at VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 6.5. ADMIN & AUTHENTICATION DOMAIN
-- ==========================================
CREATE TYPE admin_role AS ENUM ('super_admin', 'moderator', 'analyst');

CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role admin_role DEFAULT 'super_admin',
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admin_users_username ON admin_users(username);
CREATE INDEX idx_admin_users_email ON admin_users(email);

-- ==========================================
-- 7. PERFORMANCE & SEO ROUTING INDEXES
-- ==========================================
CREATE INDEX idx_clinics_location ON clinics(city_id, district_id);
CREATE INDEX idx_clinics_type_24_7 ON clinics(center_type, is_24_7);
CREATE INDEX idx_doctors_filters ON doctors(specialty_id, gender, patient_age_group);
CREATE INDEX idx_implant_brands_country ON implant_brands(origin_country_id);
CREATE INDEX idx_implant_types_specs ON implant_types USING GIN (extra_specs);
CREATE INDEX idx_cities_slug ON cities(slug);
CREATE INDEX idx_districts_slug ON districts(city_id, slug);
CREATE INDEX idx_specialties_slug ON specialties(slug);
CREATE INDEX idx_brands_slug ON implant_brands(slug);
CREATE INDEX idx_implant_types_slug ON implant_types(brand_id, slug);
CREATE INDEX idx_insurances_slug ON insurances(slug);
CREATE INDEX idx_doctors_medical_code_slug ON doctors(medical_council_code, slug);

-- ==========================================
-- 8. INITIAL SEED DATA
-- ==========================================
INSERT INTO provinces (name, slug) VALUES ('تهران', 'tehran-province')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO cities (province_id, name, slug) VALUES 
((SELECT id FROM provinces WHERE slug = 'tehran-province' LIMIT 1), 'تهران', 'tehran')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO districts (city_id, name, slug, region_zone) VALUES 
((SELECT id FROM cities WHERE slug = 'tehran' LIMIT 1), 'سعادت‌آباد', 'saadat-abad', 'غرب و شمال غرب'),
((SELECT id FROM cities WHERE slug = 'tehran' LIMIT 1), 'زعفرانیه', 'zaferanieh', 'شمال'),
((SELECT id FROM cities WHERE slug = 'tehran' LIMIT 1), 'شهرک غرب', 'shahrak-gharb', 'غرب'),
((SELECT id FROM cities WHERE slug = 'tehran' LIMIT 1), 'ولیعصر', 'valiasr', 'مرکز')
ON CONFLICT (city_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO specialties (title, slug) VALUES 
('دندانپزشک عمومی', 'general-dentist'),
('متخصص جراحی دهان، فک و صورت', 'maxillofacial-surgeon'),
('متخصص درمان ریشه (اندو)', 'endodontist'),
('متخصص پروتزهای دندانی و ایمپلنت', 'prosthodontist'),
('متخصص جراحی لثه (پریو)', 'periodontist'),
('دندانپزشک کودکان', 'pediatric-dentist')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO insurances (name, slug, insurance_type) VALUES 
('بیمه دانا', 'dana', 'supplementary'),
('بیمه البرز', 'alborz', 'supplementary'),
('بیمه ایران', 'iran', 'supplementary'),
('تأمین اجتماعی', 'tamin', 'basic')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

-- ==========================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
-- By default in Supabase, tables need permissions granted to 'anon' role
ALTER TABLE provinces DISABLE ROW LEVEL SECURITY;
ALTER TABLE cities DISABLE ROW LEVEL SECURITY;
ALTER TABLE districts DISABLE ROW LEVEL SECURITY;
ALTER TABLE specialties DISABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturers DISABLE ROW LEVEL SECURITY;
ALTER TABLE implant_brands DISABLE ROW LEVEL SECURITY;
ALTER TABLE implant_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE doctors DISABLE ROW LEVEL SECURITY;
ALTER TABLE clinics DISABLE ROW LEVEL SECURITY;
ALTER TABLE insurances DISABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_insurances DISABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_doctors DISABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_implant_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE components DISABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_packages DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE pages DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE lead_valuations DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

