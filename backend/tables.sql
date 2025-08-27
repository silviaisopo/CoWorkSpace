-- ENUM per tipi di location
DO $$ BEGIN
    CREATE TYPE location_type_enum AS ENUM ('sala riunioni', 'ufficio privato', 'postazione condivisa');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ENUM per servizi
DO $$ BEGIN
    CREATE TYPE location_service_enum AS ENUM ('Wi-Fi', 'Proiettore', 'Stampante', 'LIM', 'Aria condizionata');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users Table
CREATE TABLE IF NOT EXISTS public.users (
                                            id SERIAL PRIMARY KEY,
                                            name VARCHAR(255) NOT NULL,
                                            email VARCHAR(255) UNIQUE NOT NULL,
                                            password VARCHAR(255) NOT NULL,
                                            role VARCHAR(50) NOT NULL DEFAULT 'user'
);

ALTER TABLE public.users OWNER TO postgres;

-- Locations Table
CREATE TABLE IF NOT EXISTS public.locations (
                                                id SERIAL PRIMARY KEY,
                                                name VARCHAR(255) NOT NULL,
                                                address TEXT NOT NULL,
                                                city VARCHAR(255) NOT NULL,
                                                description TEXT,
                                                type location_type_enum NOT NULL DEFAULT 'ufficio privato',
                                                capacity INTEGER NOT NULL DEFAULT 1,
                                                service location_service_enum NOT NULL DEFAULT 'Wi-Fi',
                                                price_per_hour NUMERIC(10, 2) NOT NULL,
                                                manager_id INTEGER REFERENCES public.users(id)
);

ALTER TABLE public.locations OWNER TO postgres;

-- Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
                                               id SERIAL PRIMARY KEY,
                                               user_id INTEGER REFERENCES public.users(id) ON DELETE CASCADE,
                                               workspace_id INTEGER REFERENCES public.locations(id) ON DELETE CASCADE,
                                               start_time TIMESTAMP WITH TIME ZONE NOT NULL,
                                               end_time TIMESTAMP WITH TIME ZONE NOT NULL,
                                               total_price NUMERIC(10,2) NOT NULL,
                                               status VARCHAR(50) NOT NULL DEFAULT 'pending'
);

ALTER TABLE public.bookings OWNER TO postgres;

-- Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
                                               id SERIAL PRIMARY KEY,
                                               booking_id INTEGER REFERENCES public.bookings(id) ON UPDATE CASCADE ON DELETE SET NULL,
                                               amount NUMERIC(10,2) NOT NULL,
                                               payment_method VARCHAR(100),
                                               status VARCHAR(50) NOT NULL DEFAULT 'completed',
                                               transaction_id VARCHAR(255)
);

ALTER TABLE public.payments OWNER TO postgres;
