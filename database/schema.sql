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
INSERT INTO provinces (name, slug) VALUES ('تهران', 'tehran-province');
INSERT INTO cities (province_id, name, slug) VALUES (1, 'تهران', 'tehran');
INSERT INTO districts (city_id, name, slug, region_zone) VALUES 
(1, 'سعادت‌آباد', 'saadat-abad', 'غرب و شمال غرب'),
(1, 'زعفرانیه', 'zaferanieh', 'شمال'),
(1, 'شهرک غرب', 'shahrak-gharb', 'غرب'),
(1, 'ولیعصر', 'valiasr', 'مرکز');

INSERT INTO specialties (title, slug) VALUES 
('دندانپزشک عمومی', 'general-dentist'),
('متخصص جراحی دهان، فک و صورت', 'maxillofacial-surgeon'),
('متخصص درمان ریشه (اندو)', 'endodontist'),
('متخصص پروتزهای دندانی و ایمپلنت', 'prosthodontist'),
('متخصص جراحی لثه (پریو)', 'periodontist'),
('دندانپزشک کودکان', 'pediatric-dentist');

INSERT INTO insurances (name, slug, insurance_type) VALUES 
('بیمه دانا', 'dana', 'supplementary'),
('بیمه البرز', 'alborz', 'supplementary'),
('بیمه ایران', 'iran', 'supplementary'),
('تأمین اجتماعی', 'tamin', 'basic');
