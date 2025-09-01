-- SEQUENZE
CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.locations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- TABELLA USERS
CREATE TABLE public.users (
                              id integer DEFAULT nextval('public.users_id_seq'::regclass) NOT NULL PRIMARY KEY,
                              name character varying(255) NOT NULL,
                              email character varying(255) NOT NULL UNIQUE,
                              password character varying(255) NOT NULL,
                              role character varying(50) DEFAULT 'user'::character varying NOT NULL
);

-- TABELLA LOCATIONS
CREATE TABLE public.locations (
                                  id integer DEFAULT nextval('public.locations_id_seq'::regclass) NOT NULL PRIMARY KEY,
                                  name character varying(255) NOT NULL,
                                  address text NOT NULL,
                                  city character varying(255) NOT NULL,
                                  description text,
                                  capacity integer DEFAULT 1 NOT NULL,
                                  price_per_hour numeric(10,2) NOT NULL,
                                  manager_id integer REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
                                  type character varying(50) DEFAULT 'ufficio privato'::character varying NOT NULL,
                                  services text,
                                  image_url character varying(255)
);

-- TABELLA BOOKINGS
CREATE TABLE public.bookings (
                                 id integer DEFAULT nextval('public.bookings_id_seq'::regclass) NOT NULL PRIMARY KEY,
                                 start_time timestamp with time zone NOT NULL,
                                 end_time timestamp with time zone NOT NULL,
                                 total_price numeric(10,2) NOT NULL,
                                 status character varying(50) DEFAULT 'pending'::character varying NOT NULL,
                                 location_id integer NOT NULL REFERENCES public.locations(id) ON UPDATE CASCADE ON DELETE CASCADE,
                                 user_id integer NOT NULL REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- TABELLA PAYMENTS
CREATE TABLE public.payments (
                                 id integer DEFAULT nextval('public.payments_id_seq'::regclass) NOT NULL PRIMARY KEY,
                                 booking_id integer NOT NULL REFERENCES public.bookings(id) ON UPDATE CASCADE ON DELETE CASCADE,
                                 amount numeric(10,2) NOT NULL,
                                 payment_method character varying(100),
                                 status character varying(50) DEFAULT 'completed'::character varying NOT NULL,
                                 transaction_id character varying(255)
);

-- INDICE
CREATE INDEX fki_payments_booking_id_fkey ON public.payments USING btree (booking_id);