--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.4 (Debian 17.4-1.pgdg120+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: category_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.category_type AS ENUM (
    'travel_tips',
    'adventure',
    'food',
    'culture',
    'nature',
    'city_guide',
    'budget_travel',
    'photography',
    'other'
);


ALTER TYPE public.category_type OWNER TO postgres;

--
-- Name: post_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.post_status AS ENUM (
    'draft',
    'published'
);


ALTER TYPE public.post_status OWNER TO postgres;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'user'
);


ALTER TYPE public.user_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activity (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    day_id uuid NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    location text NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    image text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.activity OWNER TO postgres;

--
-- Name: ai_usage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ai_usage (
    user_id uuid NOT NULL,
    date date NOT NULL,
    count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.ai_usage OWNER TO postgres;

--
-- Name: comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comment (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    content text NOT NULL,
    post_id uuid NOT NULL,
    author_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.comment OWNER TO postgres;

--
-- Name: day; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.day (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    itinerary_id uuid NOT NULL,
    date timestamp without time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.day OWNER TO postgres;

--
-- Name: destination; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.destination (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    itinerary_id uuid NOT NULL,
    name text NOT NULL,
    address text NOT NULL,
    image text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.destination OWNER TO postgres;

--
-- Name: itinerary; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.itinerary (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone,
    created_by_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.itinerary OWNER TO postgres;

--
-- Name: like; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."like" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."like" OWNER TO postgres;

--
-- Name: notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    type text NOT NULL,
    post_id uuid,
    comment_id uuid,
    from_user_id uuid NOT NULL,
    read boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.notification OWNER TO postgres;

--
-- Name: post; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    content jsonb NOT NULL,
    excerpt text,
    featured_image text DEFAULT 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'::text,
    status public.post_status DEFAULT 'draft'::public.post_status NOT NULL,
    category public.category_type DEFAULT 'other'::public.category_type,
    author_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.post OWNER TO postgres;

--
-- Name: reminder_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reminder_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    itinerary_id uuid NOT NULL,
    sent_at timestamp without time zone NOT NULL,
    email_id text,
    status text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.reminder_log OWNER TO postgres;

--
-- Name: reminder_preference; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reminder_preference (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    opt_out boolean DEFAULT false NOT NULL,
    days_before integer DEFAULT 7 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.reminder_preference OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "clerkUserId" text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    role public.user_role DEFAULT 'user'::public.user_role NOT NULL,
    image text,
    plan text DEFAULT 'free'::text NOT NULL,
    "polarCustomerId" text,
    "subscriptionId" text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Data for Name: activity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activity (id, day_id, title, description, location, start_time, end_time, image, created_at, updated_at) FROM stdin;
9c3a53c0-efd1-4f18-9fd3-213131d55df1	95ec1883-bd69-46d0-9274-b192617a5a0a	Shivapuri Nagarjun National Park Hike	Embark on a scenic hike to the beautiful Shivapuri Nagarjun National Park, enjoying the lush forests and stunning views of the Kathmandu valley.	Shivapuri Nagarjun National Park	08:00:00	13:00:00	https://images.unsplash.com/photo-1686052903991-fedc0903ad4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxTaGl2YXB1cmklMjBOYWdhcmp1biUyME5hdGlvbmFsJTIwUGFyayUyMEhpa2UlMjBTdW5kYXJpamFsfGVufDB8MHx8fDE3NDc3OTgzMTN8MA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 03:31:52.897476+00	2025-05-21 03:31:52.897476+00
09f5dce9-dffd-4695-bbe6-80dd56423145	95ec1883-bd69-46d0-9274-b192617a5a0a	Lunch in Sundarijal	Have a delightful lunch at a local restaurant in Sundarijal, savoring traditional Nepali cuisine.	Local Restaurant in Sundarijal	13:00:00	14:00:00	https://images.unsplash.com/photo-1628191138144-a51eeee8e2c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxMdW5jaCUyMGluJTIwU3VuZGFyaWphbCUyMFN1bmRhcmlqYWx8ZW58MHwwfHx8MTc0Nzc5ODMxNHww&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 03:31:52.897476+00	2025-05-21 03:31:52.897476+00
f8f868d1-b9a1-43f9-acf5-3303a7b7ceba	95ec1883-bd69-46d0-9274-b192617a5a0a	Sundarijal Waterfalls	Visit the serene Sundarijal Waterfalls, taking in the refreshing spray and the natural beauty of the surrounding area.	Sundarijal Waterfalls	14:00:00	16:00:00	https://images.unsplash.com/photo-1603726192441-18fb022c1980?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxTdW5kYXJpamFsJTIwV2F0ZXJmYWxscyUyMFN1bmRhcmlqYWx8ZW58MHwwfHx8MTc0Nzc5ODMxNHww&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 03:31:52.897476+00	2025-05-21 03:31:52.897476+00
d7a36234-a393-460f-b8e5-4a7b4e95891a	95ec1883-bd69-46d0-9274-b192617a5a0a	Relaxation and Exploration in Sundarijal	Relax and enjoy the peaceful atmosphere of Sundarijal, perhaps taking a stroll along the trails or simply unwinding by the river.	Sundarijal	16:00:00	18:00:00	https://images.unsplash.com/photo-1614314266357-8a2e58059af5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxSZWxheGF0aW9uJTIwYW5kJTIwRXhwbG9yYXRpb24lMjBpbiUyMFN1bmRhcmlqYWwlMjBTdW5kYXJpamFsfGVufDB8MHx8fDE3NDc3OTgzMTV8MA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 03:31:52.897476+00	2025-05-21 03:31:52.897476+00
2d83cbd2-c851-4d70-af00-39e792202878	4298357a-79e6-4411-829e-59ee6d3315cc	Arrival and Transfer to Hotel	Arrive at Tribhuvan International Airport (KTM), Kathmandu. Transfer to your hotel in Thamel, the tourist hub. Check in and freshen up.	Tribhuvan International Airport (KTM) and Thamel	12:00:00	14:00:00	https://images.unsplash.com/photo-1445991842772-097fea258e7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxBcnJpdmFsJTIwYW5kJTIwVHJhbnNmZXIlMjB0byUyMEhvdGVsJTIwS2F0aG1hbmR1fGVufDB8MHx8fDE3NDc3OTgzOTh8MA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 03:33:17.565428+00	2025-05-21 03:33:17.565428+00
dba375ca-a3ea-4bbb-8cef-cdfb8db526cd	4298357a-79e6-4411-829e-59ee6d3315cc	Thamel Exploration and Lunch	Explore the vibrant streets of Thamel, browsing through shops selling handicrafts, trekking gear, and souvenirs. Enjoy a delicious Nepali lunch at OR2K, known for its authentic Nepali cuisine and rooftop views.	Thamel	14:00:00	16:00:00	https://images.unsplash.com/photo-1516477485464-abbcea8f9b1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxUaGFtZWwlMjBFeHBsb3JhdGlvbiUyMGFuZCUyMEx1bmNoJTIwS2F0aG1hbmR1fGVufDB8MHx8fDE3NDc3OTgzOTh8MA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 03:33:17.565428+00	2025-05-21 03:33:17.565428+00
85037e31-4954-49d1-9762-6d424461d66d	4298357a-79e6-4411-829e-59ee6d3315cc	Kathmandu Durbar Square	Visit Kathmandu Durbar Square, a UNESCO World Heritage Site, and marvel at the ancient palaces, temples, and courtyards. Witness the rich history and architecture of the old city.	Kathmandu Durbar Square	16:00:00	19:00:00	https://images.unsplash.com/photo-1516477485464-abbcea8f9b1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxLYXRobWFuZHUlMjBEdXJiYXIlMjBTcXVhcmUlMjBLYXRobWFuZHV8ZW58MHwwfHx8MTc0Nzc5ODM5OXww&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 03:33:17.565428+00	2025-05-21 03:33:17.565428+00
94cb61f1-ddf9-4912-b54f-6aebbbb98082	4298357a-79e6-4411-829e-59ee6d3315cc	Dinner and Evening Relaxation	Enjoy dinner at Bhojan Griha, a restaurant offering a traditional Nepali Thali experience.  Afterwards, relax at your hotel or explore the local bars in Thamel.	Bhojan Griha and Thamel	19:30:00	22:00:00	https://images.unsplash.com/photo-1516477485464-abbcea8f9b1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxEaW5uZXIlMjBhbmQlMjBFdmVuaW5nJTIwUmVsYXhhdGlvbiUyMEthdGhtYW5kdXxlbnwwfDB8fHwxNzQ3Nzk4Mzk5fDA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 03:33:17.565428+00	2025-05-21 03:33:17.565428+00
d5bb0f09-9fa6-4c65-9b0e-8ce90b1d99ae	fd17c8ab-3e39-419f-91a8-e917be8f90ae	Swayambhunath Stupa Visit	Start your day with a visit to Swayambhunath Stupa (Monkey Temple), offering panoramic views of Kathmandu valley. Explore the ancient stupa and interact with the playful monkeys.	Swayambhunath Stupa	08:00:00	11:00:00	https://images.unsplash.com/photo-1665435246390-4557a3112924?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxTd2F5YW1iaHVuYXRoJTIwU3R1cGElMjBWaXNpdCUyMEthdGhtYW5kdXxlbnwwfDB8fHwxNzQ3Nzk4NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 03:33:17.565428+00	2025-05-21 03:33:17.565428+00
6d71d306-fe75-4d4e-b452-9dde650c78fa	fd17c8ab-3e39-419f-91a8-e917be8f90ae	Lunch and Boudhanath Stupa	Have lunch at a local restaurant near Swayambhunath, trying some street food or momos. Afterwards, head to Boudhanath Stupa, one of the largest spherical stupas in Nepal.	Near Swayambhunath and Boudhanath Stupa	11:00:00	14:00:00	https://images.unsplash.com/photo-1650638987536-6fbcb9bc6085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxMdW5jaCUyMGFuZCUyMEJvdWRoYW5hdGglMjBTdHVwYSUyMEthdGhtYW5kdXxlbnwwfDB8fHwxNzQ3Nzk4NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 03:33:17.565428+00	2025-05-21 03:33:17.565428+00
d2298aa9-687e-45b7-bf95-c4507bf6b03d	fd17c8ab-3e39-419f-91a8-e917be8f90ae	Boudhanath Stupa Exploration	Explore Boudhanath Stupa, a UNESCO World Heritage Site, and observe the Buddhist pilgrims circumambulating the stupa. Experience the peaceful and spiritual atmosphere.	Boudhanath Stupa	14:00:00	17:00:00	https://images.unsplash.com/photo-1650638987536-6fbcb9bc6085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxCb3VkaGFuYXRoJTIwU3R1cGElMjBFeHBsb3JhdGlvbiUyMEthdGhtYW5kdXxlbnwwfDB8fHwxNzQ3Nzk4NDAxfDA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 03:33:17.565428+00	2025-05-21 03:33:17.565428+00
d921422b-7365-4768-98ab-1cd7b2c20df0	fd17c8ab-3e39-419f-91a8-e917be8f90ae	Farewell Dinner and Departure	Enjoy a farewell dinner at a restaurant of your choice in Thamel, reflecting on your Kathmandu experience. Transfer to Tribhuvan International Airport for your departure.	Thamel and Tribhuvan International Airport (KTM)	18:00:00	23:00:00	https://images.unsplash.com/photo-1516477485464-abbcea8f9b1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxGYXJld2VsbCUyMERpbm5lciUyMGFuZCUyMERlcGFydHVyZSUyMEthdGhtYW5kdXxlbnwwfDB8fHwxNzQ3Nzk4NDAxfDA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 03:33:17.565428+00	2025-05-21 03:33:17.565428+00
2a5b5969-4c9d-49b6-9b72-50358d642db1	32a1ea3d-79c8-4d5c-886a-b5099e78742e	Eiffel Tower & Champ de Mars	Begin your Parisian adventure at the iconic Eiffel Tower. Take the elevator to the top for breathtaking panoramic views of the city. Afterwards, enjoy a leisurely stroll through the Champ de Mars gardens.	Eiffel Tower & Champ de Mars	10:00:00	13:00:00	https://images.unsplash.com/photo-1471623432079-b009d30b6729?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxFaWZmZWwlMjBUb3dlciUyMCUyNiUyMENoYW1wJTIwZGUlMjBNYXJzJTIwUGFyaXN8ZW58MHwwfHx8MTc0NzcwNzg1N3ww&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 03:40:55.422025+00	2025-05-21 03:40:55.422025+00
73e3d7c2-5909-40f1-9945-8f8f3321c498	32a1ea3d-79c8-4d5c-886a-b5099e78742e	Lunch at a Parisian Bistro	Indulge in a classic French lunch at a traditional bistro near the Eiffel Tower.  Many offer outdoor seating, perfect for people-watching.	Bistro near Eiffel Tower	13:00:00	14:30:00	https://images.unsplash.com/photo-1499856871958-5b9627545d1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxMdW5jaCUyMGF0JTIwYSUyMFBhcmlzaWFuJTIwQmlzdHJvJTIwUGFyaXN8ZW58MHwwfHx8MTc0NzcwNzg2N3ww&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 03:40:55.422025+00	2025-05-21 03:40:55.422025+00
84f0a25b-a603-4b60-be2d-831557ce7b0e	32a1ea3d-79c8-4d5c-886a-b5099e78742e	Louvre Museum	Immerse yourself in the world of art at the Louvre Museum, home to masterpieces like the Mona Lisa and Venus de Milo. Pre-booking tickets is highly recommended to avoid long queues.	Louvre Museum	14:30:00	18:00:00	https://images.unsplash.com/photo-1699567806583-2d82e1ec2b66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxMb3V2cmUlMjBNdXNldW0lMjBQYXJpc3xlbnwwfDB8fHwxNzQ3NzA3ODc3fDA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 03:40:55.422025+00	2025-05-21 03:40:55.422025+00
64608a27-46f0-4b23-8630-82240d47e734	32a1ea3d-79c8-4d5c-886a-b5099e78742e	Seine River Cruise	Enjoy a relaxing evening cruise on the Seine River, offering stunning views of illuminated Parisian landmarks. Many cruises include dinner and drinks.	Seine River	19:00:00	21:00:00	https://images.unsplash.com/photo-1567187155374-cd9135b1f247?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxTZWluZSUyMFJpdmVyJTIwQ3J1aXNlJTIwUGFyaXN8ZW58MHwwfHx8MTc0NzcwODA4N3ww&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 03:40:55.422025+00	2025-05-21 03:40:55.422025+00
bc3cf07c-d404-479c-8262-df4710d31054	5c3302b8-f5ea-4459-a8dd-d9363a334c9c	Palace of Versailles	Start your day with a visit to the magnificent Palace of Versailles, the opulent former residence of French royalty. Explore the palace, gardens, and Marie Antoinette's Estate.	Palace of Versailles	09:00:00	14:00:00	https://images.unsplash.com/photo-1624301466553-cb1721edab2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxQYWxhY2UlMjBvZiUyMFZlcnNhaWxsZXMlMjBQYXJpc3xlbnwwfDB8fHwxNzQ3NzA4MDg1fDA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 03:40:55.422025+00	2025-05-21 03:40:55.422025+00
0fc966b6-fe8f-4e31-909b-a98a7866565a	5c3302b8-f5ea-4459-a8dd-d9363a334c9c	Lunch in Versailles	Have lunch at a charming restaurant in the town of Versailles, offering a variety of French cuisine options.	Restaurant in Versailles	14:00:00	15:30:00	https://images.unsplash.com/photo-1499856871958-5b9627545d1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxMdW5jaCUyMGluJTIwVmVyc2FpbGxlcyUyMFBhcmlzfGVufDB8MHx8fDE3NDc3OTg4NTd8MA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 03:40:55.422025+00	2025-05-21 03:40:55.422025+00
543d0fd5-8ed8-4198-bc53-d9dab6e9b625	5c3302b8-f5ea-4459-a8dd-d9363a334c9c	Latin Quarter Exploration	Explore the charming Latin Quarter, known for its historic streets, student atmosphere, and the Sorbonne University. Visit Shakespeare and Company, a legendary English-language bookstore.	Latin Quarter	15:30:00	18:00:00	https://images.unsplash.com/photo-1499856871958-5b9627545d1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxMYXRpbiUyMFF1YXJ0ZXIlMjBFeHBsb3JhdGlvbiUyMFBhcmlzfGVufDB8MHx8fDE3NDc3OTg4NTd8MA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 03:40:55.422025+00	2025-05-21 03:40:55.422025+00
23bc1117-3226-4a03-80dd-87e4d059e6a0	5c3302b8-f5ea-4459-a8dd-d9363a334c9c	Dinner in the Latin Quarter	Enjoy dinner at a traditional French restaurant in the Latin Quarter, known for its lively atmosphere and diverse culinary offerings.	Restaurant in Latin Quarter	18:30:00	20:00:00	https://images.unsplash.com/photo-1499856871958-5b9627545d1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxEaW5uZXIlMjBpbiUyMHRoZSUyMExhdGluJTIwUXVhcnRlciUyMFBhcmlzfGVufDB8MHx8fDE3NDc3MDgxNjB8MA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 03:40:55.422025+00	2025-05-21 03:40:55.422025+00
87e07991-b4d4-4b41-89a9-df9cc08687c2	9fd6e869-f3a1-4cec-bacb-6c9134d71c7f	Arc de Triomphe & Champs-Élysées	Visit the iconic Arc de Triomphe, climb to the top for stunning views of the Champs-Élysées and the city. Afterwards, stroll down the Champs-Élysées, a famous avenue known for its luxury shops and cafes.	Arc de Triomphe & Champs-Élysées	09:00:00	12:00:00	https://images.unsplash.com/photo-1499856871958-5b9627545d1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxBcmMlMjBkZSUyMFRyaW9tcGhlJTIwJTI2JTIwQ2hhbXBzLSVDMyU4OWx5cyVDMyVBOWVzJTIwUGFyaXN8ZW58MHwwfHx8MTc0Nzc5ODg1OHww&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 03:40:55.422025+00	2025-05-21 03:40:55.422025+00
2cbf2eea-07f9-4308-9a73-394211d9250f	9fd6e869-f3a1-4cec-bacb-6c9134d71c7f	Lunch on Champs-Élysées	Enjoy lunch at a cafe on the Champs-Élysées, offering a variety of options from quick bites to elegant meals.	Cafe on Champs-Élysées	12:00:00	13:30:00	https://images.unsplash.com/photo-1499856871958-5b9627545d1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxMdW5jaCUyMG9uJTIwQ2hhbXBzLSVDMyU4OWx5cyVDMyVBOWVzJTIwUGFyaXN8ZW58MHwwfHx8MTc0Nzc5ODg1OHww&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 03:40:55.422025+00	2025-05-21 03:40:55.422025+00
34a763e4-6eaa-48b5-8dca-90ade21fa9a3	9fd6e869-f3a1-4cec-bacb-6c9134d71c7f	Explore Montmartre	Explore the charming Montmartre district, known for its artistic history, Sacré-Cœur Basilica, and Place du Tertre, where artists create and sell their work.	Montmartre	13:30:00	17:00:00	https://images.unsplash.com/photo-1499856871958-5b9627545d1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxFeHBsb3JlJTIwTW9udG1hcnRyZSUyMFBhcmlzfGVufDB8MHx8fDE3NDc3OTg4NTl8MA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 03:40:55.422025+00	2025-05-21 03:40:55.422025+00
26279fb7-d421-4a3c-a533-8e20ce69f58b	9fd6e869-f3a1-4cec-bacb-6c9134d71c7f	Farewell Dinner in Montmartre	Enjoy a farewell dinner at a restaurant in Montmartre, offering breathtaking views of the city and delicious French cuisine.	Restaurant in Montmartre	18:00:00	20:00:00	https://images.unsplash.com/photo-1499856871958-5b9627545d1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxGYXJld2VsbCUyMERpbm5lciUyMGluJTIwTW9udG1hcnRyZSUyMFBhcmlzfGVufDB8MHx8fDE3NDc3OTg4NTl8MA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 03:40:55.422025+00	2025-05-21 03:40:55.422025+00
bc6dd984-33b2-4fa3-aa15-7d511715e283	c156231d-aa48-466b-bf4f-f3dbad3103d3	Arrival in Beijing	Arrive at Beijing Capital International Airport (PEK), transfer to your hotel in the city center. Check in and leave your luggage.	Beijing Capital International Airport (PEK) and your hotel	12:00:00	14:00:00	https://images.unsplash.com/photo-1510001618818-4b4e3d86bf0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxBcnJpdmFsJTIwaW4lMjBCZWlqaW5nJTIwQ2hpbmF8ZW58MHwwfHx8MTc0NzgwMDI2NXww&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 04:04:24.899557+00	2025-05-21 04:04:24.899557+00
718c714c-0c89-4806-af16-76e096ed8182	c156231d-aa48-466b-bf4f-f3dbad3103d3	Tiananmen Square and Forbidden City	Visit Tiananmen Square, the world's largest public square, and explore the iconic Forbidden City, the former imperial palace.  Enjoy the grandeur of the architecture and history.	Tiananmen Square and Forbidden City	14:00:00	18:00:00	https://images.unsplash.com/photo-1621970685078-fdc977ad71ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxUaWFuYW5tZW4lMjBTcXVhcmUlMjBhbmQlMjBGb3JiaWRkZW4lMjBDaXR5JTIwQ2hpbmF8ZW58MHwwfHx8MTc0NzgwMDI2Nnww&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 04:04:24.899557+00	2025-05-21 04:04:24.899557+00
71255cb5-180b-49d6-a6ae-ef53488d6618	c156231d-aa48-466b-bf4f-f3dbad3103d3	Peking Duck Dinner	Enjoy a traditional Peking duck dinner at Da Dong, known for its exquisite preparation and crispy skin. 	Da Dong (Peking duck restaurant)	19:00:00	20:00:00	https://images.unsplash.com/photo-1510001618818-4b4e3d86bf0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxQZWtpbmclMjBEdWNrJTIwRGlubmVyJTIwQ2hpbmF8ZW58MHwwfHx8MTc0NzgwMDI2N3ww&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 04:04:24.899557+00	2025-05-21 04:04:24.899557+00
89ba9e55-8bb8-4584-a160-a00ea4934388	d29d596f-76b7-4816-9885-a362a3b5e87d	Temple of Heaven	Visit the Temple of Heaven, a complex of religious buildings where emperors performed ceremonies to Heaven. Explore the serene park surrounding the temple.	Temple of Heaven	09:00:00	12:00:00	https://images.unsplash.com/photo-1612192422324-551b76c2985d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxUZW1wbGUlMjBvZiUyMEhlYXZlbiUyMENoaW5hfGVufDB8MHx8fDE3NDc4MDAyNjd8MA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 04:04:24.899557+00	2025-05-21 04:04:24.899557+00
6b412ed5-2968-43d2-8eff-e1f691d45e39	d29d596f-76b7-4816-9885-a362a3b5e87d	Jingshan Park and Panoramic Views	Ascend the Jingshan Park for panoramic views of the Forbidden City and surrounding areas. Capture stunning photos of the city's skyline.	Jingshan Park	12:00:00	14:00:00	https://images.unsplash.com/photo-1510001618818-4b4e3d86bf0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxKaW5nc2hhbiUyMFBhcmslMjBhbmQlMjBQYW5vcmFtaWMlMjBWaWV3cyUyMENoaW5hfGVufDB8MHx8fDE3NDc4MDAyNjh8MA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 04:04:24.899557+00	2025-05-21 04:04:24.899557+00
391b14e0-93e8-427c-8bac-aec021fc9620	d29d596f-76b7-4816-9885-a362a3b5e87d	Hutong Exploration by Rickshaw	Explore the vibrant Hutongs, Beijing's traditional alleyways, by rickshaw. Experience local life and discover hidden courtyards and shops.	Beijing Hutongs	14:00:00	17:00:00	https://images.unsplash.com/photo-1510001618818-4b4e3d86bf0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxIdXRvbmclMjBFeHBsb3JhdGlvbiUyMGJ5JTIwUmlja3NoYXclMjBDaGluYXxlbnwwfDB8fHwxNzQ3ODAwMjY4fDA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 04:04:24.899557+00	2025-05-21 04:04:24.899557+00
9ad76e98-c88e-4f24-837e-18b7dfcf898d	d29d596f-76b7-4816-9885-a362a3b5e87d	Hutong Dinner	Enjoy dinner at a local restaurant in the Hutongs, savoring authentic Beijing cuisine and experiencing the lively atmosphere.	Local restaurant in Hutongs	18:00:00	19:00:00	https://images.unsplash.com/photo-1510001618818-4b4e3d86bf0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxIdXRvbmclMjBEaW5uZXIlMjBDaGluYXxlbnwwfDB8fHwxNzQ3ODAwMjY5fDA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 04:04:24.899557+00	2025-05-21 04:04:24.899557+00
dedf8211-2961-4fd5-9908-6d257960bf32	acfd5505-2a7f-4154-92e6-2a44f702b165	Great Wall of China (Mutianyu Section)	Visit the Great Wall of China at Mutianyu section, a less crowded area offering stunning views and a more immersive experience. Hike a portion of the wall.	Mutianyu section of the Great Wall	08:00:00	14:00:00	https://images.unsplash.com/photo-1510001618818-4b4e3d86bf0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxHcmVhdCUyMFdhbGwlMjBvZiUyMENoaW5hJTIwJTI4TXV0aWFueXUlMjBTZWN0aW9uJTI5JTIwQ2hpbmF8ZW58MHwwfHx8MTc0NzgwMDI2OXww&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 04:04:24.899557+00	2025-05-21 04:04:24.899557+00
e91101e7-2b20-4cfd-9a28-d2b5f4b41c8e	acfd5505-2a7f-4154-92e6-2a44f702b165	Lunch near the Great Wall	Enjoy lunch at a restaurant near the Great Wall, savoring local dishes with a view.	Restaurant near Mutianyu	14:00:00	15:30:00	https://images.unsplash.com/photo-1510001618818-4b4e3d86bf0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxMdW5jaCUyMG5lYXIlMjB0aGUlMjBHcmVhdCUyMFdhbGwlMjBDaGluYXxlbnwwfDB8fHwxNzQ3ODAwMjcwfDA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 04:04:24.899557+00	2025-05-21 04:04:24.899557+00
97e0d660-afd4-4c88-9718-7d5c80ff9346	acfd5505-2a7f-4154-92e6-2a44f702b165	Souvenir Shopping and Departure	Return to Beijing and enjoy some free time for souvenir shopping or relaxing before heading to the airport for your departure.	Beijing city center and Beijing Capital International Airport (PEK)	16:00:00	21:00:00	https://images.unsplash.com/photo-1510001618818-4b4e3d86bf0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxTb3V2ZW5pciUyMFNob3BwaW5nJTIwYW5kJTIwRGVwYXJ0dXJlJTIwQ2hpbmF8ZW58MHwwfHx8MTc0NzgwMDI3MHww&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 04:04:24.899557+00	2025-05-21 04:04:24.899557+00
dd475f35-80e2-4e74-ab91-153214cb2464	a68c5e04-6e0a-417f-89f6-7c276ce2810a	Japanese Breakfast	Begin your culinary journey with a traditional Japanese breakfast at a local cafe.  Savor the delicate flavors of fresh fish, rice, miso soup, and pickles.	Local Cafe near your hotel	07:00:00	08:00:00	https://images.unsplash.com/photo-1516226392000-3536759b78e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxKYXBhbmVzZSUyMEJyZWFrZmFzdCUyMEphcGFufGVufDB8MHx8fDE3NDc4MDA2MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 04:10:35.099314+00	2025-05-21 04:10:35.099314+00
89c39f22-378d-4986-80c8-1c556d51e46d	a68c5e04-6e0a-417f-89f6-7c276ce2810a	Tsukiji Outer Market Exploration	Immerse yourself in the vibrant atmosphere of the Tsukiji Outer Market, browsing through an array of fresh seafood, produce, and unique Japanese snacks. Grab a quick and delicious lunch here.	Tsukiji Outer Market	08:30:00	12:00:00	https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxUc3VraWppJTIwT3V0ZXIlMjBNYXJrZXQlMjBFeHBsb3JhdGlvbiUyMEphcGFufGVufDB8MHx8fDE3NDc4MDA2MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 04:10:35.099314+00	2025-05-21 04:10:35.099314+00
18a64e0e-0466-4a7e-84e2-b4447c1fabe8	a68c5e04-6e0a-417f-89f6-7c276ce2810a	Meiji Jingu Shrine Visit	Visit the iconic Meiji Jingu Shrine, a peaceful oasis dedicated to Emperor Meiji and Empress Shoken. Explore the serene gardens and admire the traditional architecture.	Meiji Jingu Shrine	12:30:00	15:00:00	https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxNZWlqaSUyMEppbmd1JTIwU2hyaW5lJTIwVmlzaXQlMjBKYXBhbnxlbnwwfDB8fHwxNzQ3ODAwNjM3fDA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 04:10:35.099314+00	2025-05-21 04:10:35.099314+00
7b0af102-e312-4622-96ef-05874877430c	a68c5e04-6e0a-417f-89f6-7c276ce2810a	Shibuya Crossing & Dinner	Experience the dazzling lights and energy of Shibuya Crossing, the world's busiest intersection. Enjoy dinner at a restaurant in the trendy Shibuya district.	Shibuya Crossing & Shibuya District	15:30:00	20:00:00	https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxTaGlidXlhJTIwQ3Jvc3NpbmclMjAlMjYlMjBEaW5uZXIlMjBKYXBhbnxlbnwwfDB8fHwxNzQ3ODAwNjM3fDA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 04:10:35.099314+00	2025-05-21 04:10:35.099314+00
6b420524-a948-46cc-bcb6-6e0f2cfd6838	060e7663-fa5f-42d4-b41e-35e339d17f1c	Sensō-ji Temple and Nakamise-dori Market	Start your day with a visit to the Sensō-ji Temple, Tokyo's oldest temple, and explore the Nakamise-dori market leading up to it.  Enjoy the traditional atmosphere and browse unique souvenirs.	Sensō-ji Temple & Nakamise-dori	09:00:00	12:00:00	https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxTZW5zJUM1JThELWppJTIwVGVtcGxlJTIwYW5kJTIwTmFrYW1pc2UtZG9yaSUyME1hcmtldCUyMEphcGFufGVufDB8MHx8fDE3NDc4MDA2Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 04:10:35.099314+00	2025-05-21 04:10:35.099314+00
4b77051d-2c6f-4ffa-892f-b06b5380eefe	060e7663-fa5f-42d4-b41e-35e339d17f1c	Sumida River Cruise	Take a scenic boat ride on the Sumida River, offering stunning views of Tokyo's skyline and iconic landmarks. Enjoy a relaxing cruise and capture memorable photos.	Sumida River	12:30:00	14:00:00	https://images.unsplash.com/photo-1542051841857-5f90071e7989?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxTdW1pZGElMjBSaXZlciUyMENydWlzZSUyMEphcGFufGVufDB8MHx8fDE3NDc4MDA2Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 04:10:35.099314+00	2025-05-21 04:10:35.099314+00
c54b84a3-5fb7-42f9-9cb7-02660b8ac106	060e7663-fa5f-42d4-b41e-35e339d17f1c	Harajuku Exploration	Explore the trendy and fashionable Harajuku district, known for its unique street style and quirky shops. Enjoy lunch and people-watching in Takeshita Street.	Harajuku District (Takeshita Street)	14:30:00	17:00:00	https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxIYXJhanVrdSUyMEV4cGxvcmF0aW9uJTIwSmFwYW58ZW58MHwwfHx8MTc0NzgwMDYzOXww&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 04:10:35.099314+00	2025-05-21 04:10:35.099314+00
0ac0c7e9-d2b2-4f62-aa81-17b041f2ce3c	060e7663-fa5f-42d4-b41e-35e339d17f1c	Shinjuku Dinner	Enjoy dinner in the vibrant Shinjuku area, known for its diverse culinary scene.  Consider trying Robot Restaurant for a unique and unforgettable dining experience.	Shinjuku Golden Gai	17:30:00	21:00:00	https://images.unsplash.com/photo-1473106328154-ae21d6ff7836?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxTaGluanVrdSUyMERpbm5lciUyMEphcGFufGVufDB8MHx8fDE3NDc4MDA2Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 04:10:35.099314+00	2025-05-21 04:10:35.099314+00
b6596b1c-3c1a-4275-af83-2d1f5246c8aa	ceeac1cd-1be4-4d02-861b-d60a0411a99b	Imperial Palace East Garden	Visit the Imperial Palace East Garden, the former site of Edo Castle, and explore its vast grounds and historical structures. Enjoy a peaceful morning stroll.	Imperial Palace East Garden	09:00:00	11:00:00	https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxJbXBlcmlhbCUyMFBhbGFjZSUyMEVhc3QlMjBHYXJkZW4lMjBKYXBhbnxlbnwwfDB8fHwxNzQ3ODAwNjQwfDA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 04:10:35.099314+00	2025-05-21 04:10:35.099314+00
66e2f97a-ac25-4877-8a04-74799708f9ff	ceeac1cd-1be4-4d02-861b-d60a0411a99b	Ueno Park Exploration	Explore the Ueno Park, home to several museums, a zoo, and beautiful gardens. Choose a museum based on your interests (e.g., Tokyo National Museum, Ueno Zoo).	Ueno Park (Tokyo National Museum or Ueno Zoo)	11:30:00	15:00:00	https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxVZW5vJTIwUGFyayUyMEV4cGxvcmF0aW9uJTIwSmFwYW58ZW58MHwwfHx8MTc0NzgwMDY0MXww&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 04:10:35.099314+00	2025-05-21 04:10:35.099314+00
c920413d-3324-46d8-9965-99e805adad98	ceeac1cd-1be4-4d02-861b-d60a0411a99b	Farewell Japanese Lunch	Enjoy a final Japanese lunch near Ueno Park before heading to the airport for your departure.	Restaurant near Ueno Park	15:30:00	16:30:00	https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxGYXJld2VsbCUyMEphcGFuZXNlJTIwTHVuY2glMjBKYXBhbnxlbnwwfDB8fHwxNzQ3ODAwNjQxfDA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 04:10:35.099314+00	2025-05-21 04:10:35.099314+00
161e33fb-3b25-4554-a201-3ef1cb1e8f1c	ceeac1cd-1be4-4d02-861b-d60a0411a99b	Departure	Depart from Narita (NRT) or Haneda (HND) airport.	Narita (NRT) or Haneda (HND) Airport	17:00:00	20:00:00	https://images.unsplash.com/photo-1524390308157-a4cc42cb95d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxEZXBhcnR1cmUlMjBKYXBhbnxlbnwwfDB8fHwxNzQ3ODAwNjQyfDA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 04:10:35.099314+00	2025-05-21 04:10:35.099314+00
381bc30b-5a68-44df-9c57-c9cace02956f	aaab58f6-1ef5-42e1-86f7-a8b54903ea80	Arrival and Check-in	Arrive at Pokhara Airport (PKR) and check into your hotel. Freshen up and leave your luggage.	Pokhara Airport (PKR) and Hotel	12:00:00	13:00:00	https://images.unsplash.com/photo-1567676435472-66341c78f2d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxBcnJpdmFsJTIwYW5kJTIwQ2hlY2staW4lMjBQb2toYXJhfGVufDB8MHx8fDE3NDgxNTMxMTV8MA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-25 06:05:13.811485+00	2025-05-25 06:05:13.811485+00
95e25ad2-79b2-426d-a4e0-44f10b918298	aaab58f6-1ef5-42e1-86f7-a8b54903ea80	Lunch at a Local Restaurant	Enjoy a delicious Nepali lunch at a local restaurant. Try some traditional dishes like Dal Bhat or Momo.	Local Restaurant (e.g., OR2K)	13:30:00	14:30:00	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxMdW5jaCUyMGF0JTIwYSUyMExvY2FsJTIwUmVzdGF1cmFudCUyMFBva2hhcmF8ZW58MHwwfHx8MTc0ODE1MzExNXww&ixlib=rb-4.1.0&q=80&w=1080	2025-05-25 06:05:13.811485+00	2025-05-25 06:05:13.811485+00
4bd6397f-a33d-4ffc-999d-20de2e86d65a	aaab58f6-1ef5-42e1-86f7-a8b54903ea80	Fewa Lake and Tal Barahi Temple	Visit Fewa Lake and take a boat ride to Tal Barahi Temple, a two-storied pagoda located on an island in the lake. Enjoy the serene views of the Annapurna range reflected in the lake.	Fewa Lake and Tal Barahi Temple	15:00:00	18:00:00	https://images.unsplash.com/photo-1439066290691-510066268af5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxGZXdhJTIwTGFrZSUyMGFuZCUyMFRhbCUyMEJhcmFoaSUyMFRlbXBsZSUyMFBva2hhcmF8ZW58MHwwfHx8MTc0ODE1MzExNnww&ixlib=rb-4.1.0&q=80&w=1080	2025-05-25 06:05:13.811485+00	2025-05-25 06:05:13.811485+00
4636ae97-5993-4f4f-abdf-639f46e33397	aaab58f6-1ef5-42e1-86f7-a8b54903ea80	Dinner with a View	Enjoy dinner at a lakeside restaurant with stunning views of the Annapurna range at sunset. Many restaurants offer live music and cultural performances.	Lakeside Restaurant (e.g., Moondance)	19:00:00	20:00:00	https://images.unsplash.com/photo-1567676435472-66341c78f2d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxEaW5uZXIlMjB3aXRoJTIwYSUyMFZpZXclMjBQb2toYXJhfGVufDB8MHx8fDE3NDgxNTMxMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-25 06:05:13.811485+00	2025-05-25 06:05:13.811485+00
cf6a000a-9a92-42ca-af4f-9ab33b6f53a2	36cd840a-88d1-4500-afaa-8c76d7504509	Sunrise Trek to Sarangkot	Start your day with a sunrise trek to Sarangkot for breathtaking panoramic views of the Annapurna and Dhaulagiri mountain ranges. It's a moderately challenging hike, but the views are worth it.	Sarangkot	06:00:00	09:00:00	https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxTdW5yaXNlJTIwVHJlayUyMHRvJTIwU2FyYW5na290JTIwUG9raGFyYXxlbnwwfDB8fHwxNzQ4MTUzMTE3fDA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-25 06:05:13.811485+00	2025-05-25 06:05:13.811485+00
9c6ad7d7-1a60-41f7-be22-bea019807825	36cd840a-88d1-4500-afaa-8c76d7504509	Breakfast in Sarangkot	After the trek, enjoy breakfast at a local teahouse in Sarangkot with stunning mountain views.	Teahouse in Sarangkot	09:00:00	10:00:00	https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxCcmVha2Zhc3QlMjBpbiUyMFNhcmFuZ2tvdCUyMFBva2hhcmF8ZW58MHwwfHx8MTc0ODE1MzExN3ww&ixlib=rb-4.1.0&q=80&w=1080	2025-05-25 06:05:13.811485+00	2025-05-25 06:05:13.811485+00
a8ceeaca-1b16-4cc1-a325-c74598d7daf7	36cd840a-88d1-4500-afaa-8c76d7504509	Visit World Peace Pagoda	Visit the World Peace Pagoda, a stunning white stupa offering panoramic views of Pokhara valley and the surrounding mountains. It's a peaceful and serene place to reflect.	World Peace Pagoda	10:30:00	13:00:00	https://images.unsplash.com/photo-1491414416654-c4de0c986af8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxWaXNpdCUyMFdvcmxkJTIwUGVhY2UlMjBQYWdvZGElMjBQb2toYXJhfGVufDB8MHx8fDE3NDgxNTMxMTd8MA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-25 06:05:13.811485+00	2025-05-25 06:05:13.811485+00
2f83bfa2-7b12-4985-833f-2ae4b7339f90	36cd840a-88d1-4500-afaa-8c76d7504509	Lunch and Departure	Have lunch at a restaurant near the World Peace Pagoda or back in Pokhara city. Depart from Pokhara in the afternoon.	Restaurant near World Peace Pagoda or Pokhara city	13:30:00	15:00:00	https://images.unsplash.com/photo-1567676435472-66341c78f2d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxMdW5jaCUyMGFuZCUyMERlcGFydHVyZSUyMFBva2hhcmF8ZW58MHwwfHx8MTc0ODE1MzExOHww&ixlib=rb-4.1.0&q=80&w=1080	2025-05-25 06:05:13.811485+00	2025-05-25 06:05:13.811485+00
\.


--
-- Data for Name: ai_usage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ai_usage (user_id, date, count) FROM stdin;
dd85e8a5-dc51-40e0-a1b8-70e977039593	2025-05-20	3
64f4ad5f-e3d4-43f0-a8af-768bd64acb8d	2025-05-24	1
\.


--
-- Data for Name: comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comment (id, content, post_id, author_id, created_at, updated_at) FROM stdin;
92b1b211-3b08-4e32-9b49-958cb08aa714	Such a magnificent blog post. Thank you for the information. Love to go there <3	0afdc885-d100-4183-afe8-420f39021136	9bb6cace-c884-4b03-9807-0856c6279cd4	2025-05-25 01:43:13.546738+00	2025-05-25 01:43:13.546738+00
\.


--
-- Data for Name: day; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.day (id, itinerary_id, date, created_at, updated_at) FROM stdin;
95ec1883-bd69-46d0-9274-b192617a5a0a	e738eadc-2ef4-4b71-a3a1-8bcca063f8b5	2025-05-31 00:00:00	2025-05-21 03:31:52.897476+00	2025-05-21 03:31:52.897476+00
4298357a-79e6-4411-829e-59ee6d3315cc	ba2bb255-cedc-4fe6-a420-a8f02a8c386d	2025-06-06 00:00:00	2025-05-21 03:33:17.565428+00	2025-05-21 03:33:17.565428+00
fd17c8ab-3e39-419f-91a8-e917be8f90ae	ba2bb255-cedc-4fe6-a420-a8f02a8c386d	2025-06-07 00:00:00	2025-05-21 03:33:17.565428+00	2025-05-21 03:33:17.565428+00
32a1ea3d-79c8-4d5c-886a-b5099e78742e	6960c8f8-e65d-4fdf-90d0-f346296fc5f7	2025-06-12 00:00:00	2025-05-21 03:40:55.422025+00	2025-05-21 03:40:55.422025+00
5c3302b8-f5ea-4459-a8dd-d9363a334c9c	6960c8f8-e65d-4fdf-90d0-f346296fc5f7	2025-06-13 00:00:00	2025-05-21 03:40:55.422025+00	2025-05-21 03:40:55.422025+00
9fd6e869-f3a1-4cec-bacb-6c9134d71c7f	6960c8f8-e65d-4fdf-90d0-f346296fc5f7	2025-06-14 00:00:00	2025-05-21 03:40:55.422025+00	2025-05-21 03:40:55.422025+00
c156231d-aa48-466b-bf4f-f3dbad3103d3	857ad7d6-5c69-41fe-856f-bb4755d6792b	2025-06-19 00:00:00	2025-05-21 04:04:24.899557+00	2025-05-21 04:04:24.899557+00
d29d596f-76b7-4816-9885-a362a3b5e87d	857ad7d6-5c69-41fe-856f-bb4755d6792b	2025-06-20 00:00:00	2025-05-21 04:04:24.899557+00	2025-05-21 04:04:24.899557+00
acfd5505-2a7f-4154-92e6-2a44f702b165	857ad7d6-5c69-41fe-856f-bb4755d6792b	2025-06-21 00:00:00	2025-05-21 04:04:24.899557+00	2025-05-21 04:04:24.899557+00
a68c5e04-6e0a-417f-89f6-7c276ce2810a	8c3bcabc-c672-42dc-a3e1-ee554bf3d787	2025-06-26 00:00:00	2025-05-21 04:10:35.099314+00	2025-05-21 04:10:35.099314+00
060e7663-fa5f-42d4-b41e-35e339d17f1c	8c3bcabc-c672-42dc-a3e1-ee554bf3d787	2025-06-27 00:00:00	2025-05-21 04:10:35.099314+00	2025-05-21 04:10:35.099314+00
ceeac1cd-1be4-4d02-861b-d60a0411a99b	8c3bcabc-c672-42dc-a3e1-ee554bf3d787	2025-06-28 00:00:00	2025-05-21 04:10:35.099314+00	2025-05-21 04:10:35.099314+00
aaab58f6-1ef5-42e1-86f7-a8b54903ea80	38a289be-7d72-4ddf-9802-de8a2899de7a	2025-06-06 00:00:00	2025-05-25 06:05:13.811485+00	2025-05-25 06:05:13.811485+00
36cd840a-88d1-4500-afaa-8c76d7504509	38a289be-7d72-4ddf-9802-de8a2899de7a	2025-06-07 00:00:00	2025-05-25 06:05:13.811485+00	2025-05-25 06:05:13.811485+00
\.


--
-- Data for Name: destination; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.destination (id, itinerary_id, name, address, image, created_at, updated_at) FROM stdin;
78ff87fc-0dd2-48ae-a711-7b3ff8683446	e738eadc-2ef4-4b71-a3a1-8bcca063f8b5	Sundarijal	Kathmandu, Bagmati Province, 44603, Nepal	https://images.unsplash.com/photo-1603726192441-18fb022c1980?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxTdW5kYXJpamFsfGVufDB8MHx8fDE3NDc3OTgzMTN8MA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 03:31:52.897476+00	2025-05-21 03:31:52.897476+00
d9fb95f7-2ea8-404b-b4d6-2b122a66adcd	ba2bb255-cedc-4fe6-a420-a8f02a8c386d	Kathmandu	Bagmati Province, 46000, Nepal	https://images.unsplash.com/photo-1605640840605-14ac1855827b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxLYXRobWFuZHV8ZW58MHwwfHx8MTc0Nzc5ODM5OHww&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 03:33:17.565428+00	2025-05-21 03:33:17.565428+00
b0716a74-ce92-47e5-b485-ffd9f9914f32	6960c8f8-e65d-4fdf-90d0-f346296fc5f7	Paris	Ile-de-France, 75000, France	https://images.unsplash.com/photo-1499856871958-5b9627545d1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxQYXJpc3xlbnwwfDB8fHwxNzQ3NzA3ODUwfDA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 03:40:55.422025+00	2025-05-21 03:40:55.422025+00
bb946ecc-f729-4159-a133-4bdb26960409	857ad7d6-5c69-41fe-856f-bb4755d6792b	China	cn	https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxDaGluYXxlbnwwfDB8fHwxNzQ3ODAwMjY1fDA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 04:04:24.899557+00	2025-05-21 04:04:24.899557+00
91308730-fee8-415c-9d93-f44b31c9da1c	8c3bcabc-c672-42dc-a3e1-ee554bf3d787	Japan	jp	https://images.unsplash.com/photo-1542051841857-5f90071e7989?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxKYXBhbnxlbnwwfDB8fHwxNzQ3ODAwNjM1fDA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-21 04:10:35.099314+00	2025-05-21 04:10:35.099314+00
b160e1a4-76cd-47a7-b355-b2f31f737270	38a289be-7d72-4ddf-9802-de8a2899de7a	Pokhara	Kaski, Gandaki Province, Nepal	https://images.unsplash.com/photo-1610997686651-98492fd08108?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxQb2toYXJhfGVufDB8MHx8fDE3NDgxNTMxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080	2025-05-25 06:05:13.811485+00	2025-05-25 06:05:13.811485+00
\.


--
-- Data for Name: itinerary; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.itinerary (id, title, start_date, end_date, created_by_id, created_at, updated_at) FROM stdin;
e738eadc-2ef4-4b71-a3a1-8bcca063f8b5	One Day in Sundarijal: Nature and Tranquility	2025-05-30 18:15:00	\N	dd85e8a5-dc51-40e0-a1b8-70e977039593	2025-05-21 03:31:52.897476+00	2025-05-21 03:31:52.897476+00
ba2bb255-cedc-4fe6-a420-a8f02a8c386d	Kathmandu Cultural Exploration	2025-06-05 18:15:00	2025-06-06 18:15:00	dd85e8a5-dc51-40e0-a1b8-70e977039593	2025-05-21 03:33:17.565428+00	2025-05-21 03:33:17.565428+00
6960c8f8-e65d-4fdf-90d0-f346296fc5f7	A Parisian Escape	2025-06-11 18:15:00	2025-06-13 18:15:00	dd85e8a5-dc51-40e0-a1b8-70e977039593	2025-05-21 03:40:55.422025+00	2025-05-21 03:40:55.422025+00
857ad7d6-5c69-41fe-856f-bb4755d6792b	Beijing Express: A 3-Day Cultural Journey	2025-06-18 18:15:00	2025-06-20 18:15:00	dd85e8a5-dc51-40e0-a1b8-70e977039593	2025-05-21 04:04:24.899557+00	2025-05-21 04:04:24.899557+00
8c3bcabc-c672-42dc-a3e1-ee554bf3d787	Tokyo Highlights: A 3-Day Itinerary	2025-06-25 18:15:00	2025-06-27 18:15:00	dd85e8a5-dc51-40e0-a1b8-70e977039593	2025-05-21 04:10:35.099314+00	2025-05-21 04:10:35.099314+00
38a289be-7d72-4ddf-9802-de8a2899de7a	Pokhara Adventure: Two-Day Itinerary	2025-06-05 18:15:00	2025-06-06 18:15:00	64f4ad5f-e3d4-43f0-a8af-768bd64acb8d	2025-05-25 06:05:13.811485+00	2025-05-25 06:05:13.811485+00
\.


--
-- Data for Name: like; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."like" (id, post_id, user_id, created_at) FROM stdin;
0945c117-b5f6-459a-ad40-b96cfcc45137	ebde56cb-854a-4ebd-a61b-a09fd0fedc7b	9bb6cace-c884-4b03-9807-0856c6279cd4	2025-05-23 06:54:12.019981+00
01c861bb-c1b2-47bf-95f0-547f1fecd6ab	7e95feb7-82eb-492c-ad75-ec8c3c477371	dd85e8a5-dc51-40e0-a1b8-70e977039593	2025-05-23 07:46:32.031335+00
bea4bed1-ad88-4706-ac12-6577b2cc2207	0afdc885-d100-4183-afe8-420f39021136	9bb6cace-c884-4b03-9807-0856c6279cd4	2025-05-25 00:54:56.474046+00
d2cda7ac-d9c1-4466-abd0-e500aace3c6b	7e95feb7-82eb-492c-ad75-ec8c3c477371	9bb6cace-c884-4b03-9807-0856c6279cd4	2025-05-25 01:49:07.136949+00
\.


--
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification (id, user_id, type, post_id, comment_id, from_user_id, read, created_at) FROM stdin;
d8fa7eb0-7bd7-42ea-9204-a7bf1623b9c9	9bb6cace-c884-4b03-9807-0856c6279cd4	like	ebde56cb-854a-4ebd-a61b-a09fd0fedc7b	\N	dd85e8a5-dc51-40e0-a1b8-70e977039593	t	2025-05-25 01:44:02.532757+00
ff9b73cc-2ec5-4dfd-a39c-45334c222698	dd85e8a5-dc51-40e0-a1b8-70e977039593	like	0afdc885-d100-4183-afe8-420f39021136	\N	9bb6cace-c884-4b03-9807-0856c6279cd4	t	2025-05-25 00:54:56.48147+00
76fa7679-16a9-49cf-8211-9c09a9b2a60b	dd85e8a5-dc51-40e0-a1b8-70e977039593	comment	0afdc885-d100-4183-afe8-420f39021136	92b1b211-3b08-4e32-9b49-958cb08aa714	9bb6cace-c884-4b03-9807-0856c6279cd4	t	2025-05-25 01:43:13.550272+00
39b07594-ce47-4eb2-a05f-61a256e3bfce	dd85e8a5-dc51-40e0-a1b8-70e977039593	like	7e95feb7-82eb-492c-ad75-ec8c3c477371	\N	9bb6cace-c884-4b03-9807-0856c6279cd4	t	2025-05-25 01:49:07.146508+00
\.


--
-- Data for Name: post; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.post (id, title, slug, content, excerpt, featured_image, status, category, author_id, created_at, updated_at) FROM stdin;
0afdc885-d100-4183-afe8-420f39021136	3 Days In Kathmandu	3-days-in-kathmandu-eOUFW	[{"id": "64cee5b6-0e78-4a90-b95e-f72c336a84dc", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Kathmandu is the capital of Nepal.", "type": "text", "styles": {}}], "children": []}, {"id": "43dcb190-5031-4629-87b2-9ad0da3f8143", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "There are many reasons ", "type": "text", "styles": {}}, {"href": "https://guyontheroad.com/blog/reasons-to-visit-nepal", "type": "link", "content": [{"text": "why visit Nepal", "type": "text", "styles": {"bold": true}}]}, {"text": ", and Kathmandu is one of them.", "type": "text", "styles": {}}], "children": []}, {"id": "ab4ce736-4f09-4723-a5c5-eaf012c3dc27", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "‍", "type": "text", "styles": {}}], "children": []}, {"id": "54cd8694-983a-467c-b603-1fc121e0d89e", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Kathmandu is a crowded city, it has heavy air pollution, and it is prone to many earthquakes, but despite all this, it is considered a popular city and all the many tourists who come to Nepal come first to it and from there go for the variety of trips that Nepal has to offer.", "type": "text", "styles": {}}], "children": []}, {"id": "5e4ea4d4-66ba-4894-9782-ca048b7e53da", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "‍", "type": "text", "styles": {}}], "children": []}, {"id": "95e859f2-fb9a-48a7-8bfe-cff925e8b8b8", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Kathmandu is known as a secret and mysterious gem that is worth exploring and testing all its charms, and this is exactly what the many tourists who visit it try to do.", "type": "text", "styles": {}}], "children": []}, {"id": "0fdbde13-e589-4a0a-923b-6336d57c5f63", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "‍", "type": "text", "styles": {}}], "children": []}, {"id": "d6a20735-1e29-4d68-b3ba-f85fde683ccb", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "I visited Kathmandu as part of my ", "type": "text", "styles": {}}, {"href": "https://guyontheroad.com/blog/solo-travel-nepal", "type": "link", "content": [{"text": "solo travel to Nepal", "type": "text", "styles": {"bold": true}}]}, {"text": ".", "type": "text", "styles": {}}], "children": []}, {"id": "1e832517-740c-441d-9de5-e30eeaa9c0e9", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "In Kathmandu, you can not expect luxurious accommodation and high-level tourism services. However, you will be exposed to a different and unique cultural experience.", "type": "text", "styles": {}}], "children": []}, {"id": "f16da8bd-b4df-420b-ba6e-1a82b38b4b4d", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [], "children": []}, {"id": "67b13440-027e-45b3-945f-b4bcca5417e0", "type": "image", "props": {"url": "https://i0.wp.com/www.guyontheroad.com/wp-content/uploads/2025/03/62794f4975ec0552d0afcaab_kathmandu20city20nepal.jpg?resize=768%2C512&ssl=1", "name": "62794f4975ec0552d0afcaab_kathmandu20city20nepal.jpg?resize=768%2C512&ssl=1", "caption": "", "showPreview": true, "textAlignment": "left", "backgroundColor": "default"}, "children": []}, {"id": "0d1ff7ba-0497-4680-af80-34b9a0f90633", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [], "children": []}, {"id": "1537b99a-f471-4ec6-b9a0-a4ede62e3eea", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "For many people getting off the plane and entering Kathmandu is an instructive and unique experience.", "type": "text", "styles": {}}], "children": []}, {"id": "80c07577-bdec-46df-aa96-cc33e6e6768a", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "The sounds, the colorful sights, and the smells that can easily lead to sensory flooding are different from other places in the world.", "type": "text", "styles": {}}], "children": []}, {"id": "82625588-e473-4de6-b879-b26b4f48f716", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "‍", "type": "text", "styles": {}}], "children": []}, {"id": "ea10a0db-1934-4051-bad0-427816a24bae", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Wandering the stone streets of Kathmandu will expose you to an abundance of shops, a spectacular variety of colors, street food, and many temples but also the chaos of transportation, cars crossing everywhere, and many traffic jams within ancient, narrow, and cobbled streets.", "type": "text", "styles": {}}], "children": []}, {"id": "29e6b9ec-5a83-4712-a2a6-c40a268450d4", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "‍", "type": "text", "styles": {}}], "children": []}, {"id": "0a4ceb96-bb07-4c06-8600-203898ddf34c", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Kathmandu is a noisy, vibrant city, exhausting and tiring but charming!", "type": "text", "styles": {}}], "children": []}, {"id": "2e69abeb-45e5-4094-b144-1ff0d5d0ee10", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [], "children": []}]	Thinking of spending 3 days in Kathmandu? My ultimate Kathmandu Itinerary is everything you need to plan a perfect trip, what to do, where to stay in Kathmandu, and much more!	https://images.unsplash.com/photo-1605640797058-58b7040a0e61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwzfHxrYXRobWFuZHV8ZW58MHwwfHx8MTc0NzcwNjg0Nnww&ixlib=rb-4.1.0&q=80&w=1080	published	travel_tips	dd85e8a5-dc51-40e0-a1b8-70e977039593	2025-05-21 07:58:57.690244+00	2025-05-21 07:58:57.690244+00
7129775e-a17e-42d7-9bd9-ee122a8d582c	Best Foods in Kathmandu you Absolutely have to Try	best-foods-in-kathmandu-you-absolutely-have-to-try-EABaH	[{"id": "b0fc6d31-73c2-4801-8feb-4b62306ceb7e", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Have you ever wondered how many types of food are there in the World? I bet you didn’t wonder just to the moment. To your surprise, the answer is uncountable!! With 500 types of different plants, more than 100 types of meats, thousands of herbs, and millions of spices, the number of foods you can prepare from it is countless.", "type": "text", "styles": {}}], "children": []}, {"id": "7413414a-457e-4ec6-9aa4-0fb167971232", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Over the year, food has been an identity of a specific location that works as a bridge to connect travelers with the local culture, historical background, and the availability of natural ingredients of the place. No matter where you travel in the World, there is something else in the tastes of the street foods that is unbeaten by the elegantly presented restaurant meal. However, there are times of disappointment when you order a dish without even knowing their names and ingredients and regretted later.", "type": "text", "styles": {}}], "children": []}, {"id": "46325d83-deb0-47b1-9f7b-ea355b105103", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "To help you avoid the awkward situation on your next Nepal visit, we will guide you on what to eat and drink on this blog, Top 10 foods to try in Kathmandu. Here we have included the famous Nepali dishes, including the street foods that are flavor blasted with the rich spices and ingredients from across the country lodged in Kathmandu.", "type": "text", "styles": {}}], "children": []}, {"id": "f590e16e-f0e6-4112-83b7-352201c69169", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [], "children": []}, {"id": "58609610-b425-4183-a7cf-f30e2fd06a8e", "type": "quote", "props": {"textColor": "default", "backgroundColor": "default"}, "content": [{"text": "Know how to prepare some delicious Nepali dishes with us Typical Nepali Food Cooking Class", "type": "text", "styles": {}}], "children": []}, {"id": "23e33f30-d14e-4a15-946d-bf56b4a570cd", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [], "children": []}, {"id": "a6a698d4-a5a3-4c6f-8119-47546becb249", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "The city of temples and getaway to the Mountains, Kathmandu is the center for major happenings in the country. With people from different parts of the country inhabiting the city, Kathmandu is a hub for delicious local cuisine and major festivals. Although the Nepalese cuisine is not recognized in the International level as that of Indian and Chinese cuisines, Nepal has plenty of dishes that will melt your heart in the first place. So let's dig in and get lost in the rich flavors of Nepal, starting right away with the famous foods that Nepal offers.", "type": "text", "styles": {}}], "children": []}, {"id": "ed0b5b16-7ca4-4a33-937f-86cf0c3c150c", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [], "children": []}, {"id": "f07fff27-ec7a-47f4-b915-eeb82bb44710", "type": "heading", "props": {"level": 2, "textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Delicious Local Nepali Cuisine", "type": "text", "styles": {}}], "children": []}, {"id": "f8424be5-8217-4063-93ea-0a0f5a82673e", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "With majority of Newar's inhabiting the city, Kathmandu has plenty of local cuisine to enjoy on your Nepal visit. From a plate full Samaya Baji to the Nepali Pizza, Chatamari, all you can do is drool upon the tales of the unique Nepali flavors.", "type": "text", "styles": {}}], "children": []}, {"id": "8d594e4d-6a5b-4f49-8f4d-36519ad01312", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [], "children": []}, {"id": "7dd23e17-ad07-447f-8e51-538e7609df78", "type": "heading", "props": {"level": 3, "textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Thakali Khana Set", "type": "text", "styles": {}}], "children": []}, {"id": "f9e7f90f-b51b-4937-9770-57931f52f2d9", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Dal Bhat Power 24 hours as they say in Nepal, Dal Bhat and Tarkari is the staple food that Nepalese savor twice a day. Other than the regular Nepali Dal Bhat, the Thakali Khana originated from Mustang consists of rice, lentils, and vegetables with meat (chicken or mutton) for non-vegetarians together with spicy fried potatoes, spinach, offered with Timur and hot chili pepper as condiments.", "type": "text", "styles": {}}], "children": []}, {"id": "14713183-e853-4fda-b44c-ff57e78c4adf", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Popular for the rich flavors, the Thakali Khana set utilizes local resources such as ghee, garlic, Jimbu, Timur, and dried red chili to enhance the taste and color of the regular meal. The long grain Basmati rice served with the creamy lentil soup fragranced by the wild Himalayan herb, and freshly prepared tomato pickle is believed to make you hungry just with the aroma.", "type": "text", "styles": {}}], "children": []}, {"id": "425ef350-5207-49b0-b608-2b1bbf60ab61", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "You can also opt for the Dhido, a Himalayan staple food prepared from the bucket wheat served with the same side dishes together with Gundruk ko Aachar. With all the main dish and side dishes served on your table, don't forget to spread melted ghee on the top of Dhido or rice before you relish in the unique taste of the Nepali dish.", "type": "text", "styles": {}}], "children": []}, {"id": "15829343-95b0-4980-adae-f275ede8e152", "type": "bulletListItem", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Cost:", "type": "text", "styles": {"bold": true}}, {"text": " NPR 600 to 700 ", "type": "text", "styles": {}}], "children": []}, {"id": "2608e029-f467-4896-8dc6-60e4a001af0a", "type": "bulletListItem", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Where to eat:", "type": "text", "styles": {"bold": true}}, {"text": " Dal Bhat Nepali Kitchen, Lazimpat Road", "type": "text", "styles": {}}], "children": []}, {"id": "08a05e18-c354-45aa-a4e9-7525ac84e84d", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [], "children": []}, {"id": "509348c4-1dcd-488e-9202-0616300603fc", "type": "heading", "props": {"level": 3, "textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "MO:MO", "type": "text", "styles": {"bold": true}}], "children": []}, {"id": "36e86719-b9c6-4a51-bd29-eaa2c671647c", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "The Nepalese love for MOMO has no bound, and hence the madness can be seen at every corner of the street with a banner that says, MOMO is available here. Also known as dumplings and dim sum in some places, MOMO is a steam bun, filled with minced vegetables and meat fillings. Usually served with Tomato based chutney, a single plate MOMO is never enough for MOMO delighters.", "type": "text", "styles": {}}], "children": []}, {"id": "85849f03-0aa7-46e8-aea8-7e391e6b2a95", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Nepal has been serving a wide variety of MOMO ranging from Chocolate Momo, Sadheko Momo, Kothey Momo, Open Momo, Tandoori Momo, and Chilly Momo to the juicy Steam Momo over the year. The tempting MOMO pieces when dipped into the surprisingly rich taste of the chutney, the combination goes beyond yum, making you fall in love with the dish repeatedly until your stomach says I am full, jokes apart. Leaving Kathmandu without rejoicing the taste of MOMO will surely make your trip incomplete. So do try these bundles of flavors on your next visit.", "type": "text", "styles": {}}], "children": []}, {"id": "3e850ca1-ed91-41b2-9782-53db08755a87", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Cost:", "type": "text", "styles": {"bold": true}}], "children": []}, {"id": "0b7e7b2a-646f-4203-9316-46b98126845b", "type": "bulletListItem", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "10 MOMO (at smaller stalls) - NPR 80-110", "type": "text", "styles": {}}], "children": []}, {"id": "17c0e123-7de9-4ec5-8100-e4ef8f78699a", "type": "bulletListItem", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "In restaurants - NPR 150 to NPR 200", "type": "text", "styles": {}}], "children": []}, {"id": "0b377ad8-6d38-422d-a635-86fd1b49b8b1", "type": "bulletListItem", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Where to eat: Shandaar Momo, Basantpur Durbar Square", "type": "text", "styles": {}}], "children": []}, {"id": "766707ba-e975-4836-867f-349b76394d92", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [], "children": []}]	Have you ever wondered how many types of food are there in the World? I bet you didn’t wonder just to the moment. To your surprise, the answer is uncountable!! With 500 types of different plants, more than 100 types of meats, thousands of herbs, and millions of spices, the number of foods you can prepare from it is countless.	https://fux7glt2j7.ufs.sh/f/AL25fQICNL1rXlvbrXPnHNkTf1C6da3PRqVD40GueLXE2SyB	published	food	dd85e8a5-dc51-40e0-a1b8-70e977039593	2025-05-21 08:14:23.670511+00	2025-05-21 08:15:46.357+00
7e95feb7-82eb-492c-ad75-ec8c3c477371	Best Trekking Destinations in Nepal	best-trekking-destinations-in-nepal-HnvJo	[{"id": "6c0f31fe-eb6b-4473-bc10-fa612a80dfaf", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Nepal, the land of the Himalayas, is a treasure trove for adventurers and nature enthusiasts. With its towering peaks, diverse landscapes, and rich cultural heritage, it’s no wonder Nepal is a top destination for trekking. In 2024, the allure of Nepal’s trekking routes remains as strong as ever. Whether you’re a seasoned trekker or a beginner seeking to explore nature, this guide will introduce you to the best trekking destinations in Nepal.", "type": "text", "styles": {}}], "children": []}, {"id": "5c4e227e-bbe7-41e1-b751-8a99789da710", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [], "children": []}, {"id": "d00d70f8-577d-4724-980d-24423dce6e07", "type": "heading", "props": {"level": 2, "textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Everest Base Camp Trek (EBC)", "type": "text", "styles": {}}], "children": []}, {"id": "538b130a-8919-4d36-9a36-0945916d6f3f", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "The Everest Base Camp Trek is an iconic journey that offers stunning views of the world’s highest peak, Mount Everest (8,848.86 meters). This trek takes you through the heart of the Khumbu region, allowing you to experience Sherpa culture, visit ancient monasteries, and marvel at the beauty of the Himalayan landscapes.", "type": "text", "styles": {}}], "children": []}, {"id": "926a977a-b201-4b1d-9917-f3b130ef1575", "type": "bulletListItem", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Duration", "type": "text", "styles": {"bold": true}}, {"text": ": 12-14 days", "type": "text", "styles": {}}], "children": []}, {"id": "7447ae17-c795-4907-9c75-e234ffbed6eb", "type": "bulletListItem", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Best Time to Visit", "type": "text", "styles": {"bold": true}}, {"text": ": March-May and September-November", "type": "text", "styles": {}}], "children": []}, {"id": "95494f62-778e-4607-ab1a-a0c830a4fa90", "type": "bulletListItem", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Highlights", "type": "text", "styles": {"bold": true}}, {"text": ":", "type": "text", "styles": {}}], "children": [{"id": "5f7cc293-b442-4f6d-be0e-161deee6ec6f", "type": "bulletListItem", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Scenic flight to Lukla", "type": "text", "styles": {}}], "children": []}, {"id": "1c1d6139-d02a-4bd8-be34-50344db930b7", "type": "bulletListItem", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Namche Bazaar, the vibrant Sherpa town", "type": "text", "styles": {}}], "children": []}, {"id": "c3f98cba-2269-4abe-8db2-2ddefed2d8c2", "type": "bulletListItem", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Tengboche Monastery", "type": "text", "styles": {}}], "children": []}, {"id": "9ccbc15e-25ab-4a3b-a695-62746886e3d7", "type": "bulletListItem", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Panoramic views of Everest, Lhotse, and Nuptse", "type": "text", "styles": {}}], "children": []}]}, {"id": "9c3eeff5-248a-4995-9503-e2367408f8b5", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "For a seamless trekking experience, consider reputable local trekking agencies. Their expertise ensures your safety and enhances your journey.", "type": "text", "styles": {}}], "children": []}, {"id": "677d64fa-cf71-41ed-92c3-4a83292c5e74", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [], "children": []}, {"id": "ca685dae-3df0-4644-b1b6-48702d433f14", "type": "heading", "props": {"level": 2, "textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Annapurna Circuit Trek", "type": "text", "styles": {}}], "children": []}, {"id": "d6699b31-f3a7-4080-accc-a28b86898303", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Known as one of the most diverse and scenic treks in the world, the Annapurna Circuit Trek takes you through lush subtropical forests, alpine meadows, and arid landscapes. The trek encircles the Annapurna Massif and crosses the Thorong La Pass, one of the highest trekking passes at 5,416 meters.", "type": "text", "styles": {}}], "children": []}, {"id": "e7067ecc-0fce-4385-9aa4-fbfe2f8ded1d", "type": "bulletListItem", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Duration", "type": "text", "styles": {"bold": true}}, {"text": ": 15-20 days", "type": "text", "styles": {}}], "children": []}, {"id": "0457bcbb-bc1f-4617-bf9e-ce117f0fe2a1", "type": "bulletListItem", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Best Time to Visit", "type": "text", "styles": {"bold": true}}, {"text": ": March-May and September-November", "type": "text", "styles": {}}], "children": []}, {"id": "6c9de8f8-bed9-4a47-843d-136312f7be3f", "type": "bulletListItem", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Highlights", "type": "text", "styles": {"bold": true}}, {"text": ":", "type": "text", "styles": {}}], "children": [{"id": "f44c2cb4-36d1-470e-b076-01e715726144", "type": "bulletListItem", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Breathtaking views of Annapurna, Dhaulagiri, and Manaslu", "type": "text", "styles": {}}], "children": []}, {"id": "7d6fbfce-e142-4186-8a4a-aea2ff5726d3", "type": "bulletListItem", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Cultural diversity of Gurung, Thakali, and Tibetan communities", "type": "text", "styles": {}}], "children": []}, {"id": "07e210bf-d5fa-4d45-a567-f59a1191beb9", "type": "bulletListItem", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Hot springs at Tatopani", "type": "text", "styles": {}}], "children": []}, {"id": "a5a1dc03-3cd2-429d-a4a4-4541bbed77b9", "type": "bulletListItem", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Visit to Muktinath Temple", "type": "text", "styles": {}}], "children": []}]}, {"id": "794ed132-839d-4c84-ac21-28af6273aa6b", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Ensure your Annapurna trekking permits (ACAP and TIMS) are in order before starting your adventure.", "type": "text", "styles": {}}], "children": []}, {"id": "494d5f7d-d23d-4f03-8301-c484ad70caee", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [], "children": []}, {"id": "d22ff268-61f4-4cb5-bd0b-42ca83ded860", "type": "heading", "props": {"level": 2, "textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Langtang Valley Trek", "type": "text", "styles": {}}], "children": []}, {"id": "bba17557-0d13-4ee4-a3b0-a50f6037cbf4", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Situated close to Kathmandu, the Langtang Valley Trek is perfect for those seeking a shorter yet rewarding trek. Known as the “Valley of Glaciers,” this region offers a mix of natural beauty and Tamang culture.", "type": "text", "styles": {}}], "children": []}, {"id": "ebec81be-bcdb-409f-a739-f431fd0fc083", "type": "bulletListItem", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Duration", "type": "text", "styles": {"bold": true}}, {"text": ": 7-10 days", "type": "text", "styles": {}}], "children": []}, {"id": "5fa4822f-f7e4-43ca-a8fb-f43476815072", "type": "bulletListItem", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Best Time to Visit", "type": "text", "styles": {"bold": true}}, {"text": ": March-May and September-November", "type": "text", "styles": {}}], "children": []}, {"id": "d9e336da-1243-4945-8419-04fb5bfdc1ad", "type": "bulletListItem", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Highlights", "type": "text", "styles": {"bold": true}}, {"text": ":", "type": "text", "styles": {}}], "children": [{"id": "0d7e1731-f179-4192-947d-69e5151c54e7", "type": "bulletListItem", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Stunning views of Langtang Lirung (7,227 meters)", "type": "text", "styles": {}}], "children": []}, {"id": "e3147746-ab3b-4fdb-b14b-56bbff080477", "type": "bulletListItem", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Kyanjin Gompa and cheese factory", "type": "text", "styles": {}}], "children": []}, {"id": "9c8b5699-f858-4169-ab39-239ccd34cedf", "type": "bulletListItem", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Rhododendron forests and bamboo groves", "type": "text", "styles": {}}], "children": []}]}, {"id": "52b86b2b-9f18-4a15-89b4-766e01868290", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "The Langtang Valley Trek is also a tribute to the resilience of the locals who rebuilt their lives after the 2015 earthquake.", "type": "text", "styles": {}}], "children": []}, {"id": "a82ac9b5-64d7-4e88-9710-8ea7c3cdf4a9", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"href": "https://chatgpt.com/c/678debb1-53e4-800f-9f80-76fe6e0947e9#", "type": "link", "content": [{"text": "Discover Langtang Valley Treks", "type": "text", "styles": {}}]}], "children": []}, {"id": "325d16b9-b458-46d5-acfb-cca52ce51b79", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [], "children": []}]	Best Trekking Destinations in Nepal – A Hiker’s Dream Guide – 2024	https://images.unsplash.com/photo-1551632811-561732d1e306?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHx0cmVraW5nfGVufDB8MHx8fDE3NDc4MTYzNTB8MA&ixlib=rb-4.1.0&q=80&w=1080	published	adventure	dd85e8a5-dc51-40e0-a1b8-70e977039593	2025-05-21 08:32:43.848059+00	2025-05-21 08:32:43.848059+00
ebde56cb-854a-4ebd-a61b-a09fd0fedc7b	Nepal Travel Blog	nepal-travel-blog-GWHlw	[{"id": "9abf9366-522e-414a-9834-46a3656d4c72", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Our ", "type": "text", "styles": {}}, {"text": "Nepal travel blog", "type": "text", "styles": {"bold": true}}, {"text": " will help you in visiting Nepal to trek, to climb, to see the cultural sites and places of interest in Nepal, or just to hang out in Kathmandu or Pokhara. It’s also about first-hand experiences of Nepal as trekkers, tourists, and travel bloggers, as singles, couples, and later as a family with kids. We love Nepal, it’s a fabulous destination, but not an easy one. We’ve seen Nepal before and after the earthquake, we were there during the aftershocks and power cuts, so we can give you a realistic idea of what to expect. We were there back in 2001 as well as recently for more treks including the Everest Base Camp trek and Annapurna Circuit.  We added more unusual destinations in Nepal, Lumbini, Nagarkot, Chitwan, and Bhaktapur, to give you up-to-date useful information on what to see and do in Nepal.", "type": "text", "styles": {}}], "children": []}, {"id": "6b1f2a28-6e25-4e8a-b6ad-8b6bba3d44a7", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [], "children": []}, {"id": "95aebfd2-7969-43cc-9270-ea7bd9195353", "type": "heading", "props": {"level": 2, "textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Nepal Travel Blog", "type": "text", "styles": {"bold": true}}], "children": []}, {"id": "53771a02-01aa-49a8-b2e8-18c5a030bcca", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Nepal couldn’t be called an “easy” country to visit and it’s not necessarily cheap, but even with kids (ours were 9 and 11 the first time they saw Everest) it’s great if you know what to expect and understand the realities of travel in Nepal", "type": "text", "styles": {}}], "children": []}, {"id": "cb52c437-3bb8-4f73-90df-3313631f6303", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Short video on Nepal below.", "type": "text", "styles": {}}], "children": []}, {"id": "c027c15b-156f-4a83-822c-cec5d62dddef", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "There is magic in the air in Nepal, along with pollution. There are wonders to behold and tragedies, both personal and environmental unfolding right in front of you.", "type": "text", "styles": {}}], "children": []}, {"id": "8139faee-5e58-4994-b7ff-ec2c686ad098", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Nepal is special, another world sheltered by the majestic Himalayas and populated by some of the best and most beautiful people on the planet. We hope you love it as much as we do.", "type": "text", "styles": {}}], "children": []}, {"id": "8ddab0fa-086d-43ee-8626-4c7484d1992e", "type": "image", "props": {"url": "https://worldtravelfamily.com/wp-content/uploads/2016/09/Nepal-Travel-Blog-Trekkers-supermarket-Kathmandu.jpg", "name": "", "caption": "The famous trekker’s supermarket in Thamel, Kathmandu. This is where millions of trekkers and climbers have stocked up on Snickers and hand gel before heading to the mountains. Just to be here, is amazing.", "showPreview": true, "textAlignment": "left", "backgroundColor": "default"}, "children": []}, {"id": "324ed078-b0a3-4f58-ae4c-76c5449d2fca", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [], "children": []}, {"id": "49a8e5e8-e025-444d-b983-989681832f97", "type": "heading", "props": {"level": 2, "textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Getting Around Nepal", "type": "text", "styles": {"bold": true}}], "children": []}, {"id": "76ba952b-90e0-4b10-8cd3-fa0bdfb6d1a6", "type": "image", "props": {"url": "https://worldtravelfamily.com/wp-content/uploads/2016/09/Nepal-Travel-Blog-Getting-Around-Nepal.jpg", "name": "", "caption": "Buses in Nepal, waiting to leave Pokhara in convoy, heading for Kathmandu.", "showPreview": true, "textAlignment": "left", "backgroundColor": "default"}, "children": []}, {"id": "57ebf127-051e-44d3-b19f-ede866363528", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Getting around Nepal isn’t difficult, there are buses, jeeps and planes, but it can be hair raising. Arguably, transport in Nepal can be dangerous. Nepal has a strong and well-established tourist industry so there are plenty of ways for tourists to get around. If you choose to book via a tout, agent or through your hotel you will probably pay extra in commission.", "type": "text", "styles": {}}], "children": []}, {"id": "e61ac2c6-0dd4-43d1-930d-dddd8db41372", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "As with booking treks or any tourist services in Nepal, shop around and negotiate. A fleet of buses shuttles tourists on all of the main tourist routes, Pokhara bus station is in the photo above.", "type": "text", "styles": {}}], "children": []}, {"id": "8a49a7c0-acbd-4b4d-b5b1-d18aa879c315", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [], "children": []}, {"id": "714bbb1f-270a-427a-bdbc-5649f8527037", "type": "heading", "props": {"level": 2, "textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Kathmandu and Things to Do in the Kathmandu Valley", "type": "text", "styles": {"bold": true}}], "children": []}, {"id": "bf81bf31-2e09-4b8f-a39e-bb1550e4eb4e", "type": "image", "props": {"url": "https://worldtravelfamily.com/wp-content/uploads/2019/01/nepal-travel-blog-and-guide.jpg", "name": "", "caption": "The most instantly recognisable icon of Nepal, Swayambhunath Kathmandu. Also known as the monkey temple, for good reason.", "showPreview": true, "textAlignment": "left", "backgroundColor": "default"}, "children": []}, {"id": "39414dc3-bd22-43db-80bf-b5e630184957", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"href": "https://worldtravelfamily.com/places-to-visit-in-kathmandu/", "type": "link", "content": [{"text": "Things to do in and around Kathmandu, sites to visit and places to see", "type": "text", "styles": {"bold": true, "underline": true}}]}, {"text": ". Also, how to get to them. Most of these places to see in Kathmandu and nearby have their own detailed guides and tips on our blog, but this one blog post gives you a good overview to plan your Nepal itinerary. While in Kathmandu you should, of course see majestic ", "type": "text", "styles": {}}, {"href": "https://worldtravelfamily.com/swayambhunath-kathmandu-nepal/", "type": "link", "content": [{"text": "Swayambhunath", "type": "text", "styles": {"bold": true, "underline": true}}]}, {"text": ", The Monkey Temple, as in the photo above. There is also old ", "type": "text", "styles": {}}, {"href": "https://worldtravelfamily.com/freak-street-kathmandu-hippies-nepal/", "type": "link", "content": [{"text": "Freak Street", "type": "text", "styles": {"bold": true, "underline": true}}]}, {"text": " to explore, and the temple complexes of Pashupatinath and Boudhanath.", "type": "text", "styles": {}}], "children": []}, {"id": "7f1e46e8-dff7-422d-a5d8-82180cf9a911", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Patan has Kathmandu’s second Durbar Square and is a short taxi ride from tourist Kathmandu. Just off the Patan Durbar Square you’ll find the ", "type": "text", "styles": {}}, {"href": "https://worldtravelfamily.com/rat-temple-nepal/", "type": "link", "content": [{"text": "Golden Temple", "type": "text", "styles": {"bold": true, "underline": true}}]}, {"text": ". It’s a must-visit.", "type": "text", "styles": {}}], "children": []}, {"id": "40d2c585-be4c-44c1-80bf-7d2f336888fa", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "Years ago, the Golden Temple was a rat temple. We visited way back when, but on our recent visit there was not a rat to be seen.", "type": "text", "styles": {}}], "children": []}, {"id": "3b6abb2b-46a8-41a0-9bcb-bdce1479c8a4", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "A look at ", "type": "text", "styles": {}}, {"href": "https://worldtravelfamily.com/patan-durbar-square/", "type": "link", "content": [{"text": "Patan’s Durbar Square", "type": "text", "styles": {"bold": true, "underline": true}}]}, {"text": ". In the photo below you can see entrails strung accross a doorway. A post-earthquake look at the damage in this historic region. We also bumped into Prince Harry there. Read about that too.", "type": "text", "styles": {}}], "children": []}, {"id": "613f29f2-8145-4326-9534-18bc45171caa", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"text": "If you have time, get outside of Kathmandu and explore the Kathmandu Valley. Starting with Bhaktapur and Nagarkot. Bhaktapur is ancient and relatively tourist-free, it is the Kathmandu Valley’s third Durbar Square. Nagarkot is famous as a Himalayan view point, in season. Both are within 2 hours of Kathmandu.", "type": "text", "styles": {}}], "children": []}, {"id": "f0641218-377e-4c0b-8b99-ad7928b5371e", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [{"href": "https://worldtravelfamily.com/nagarkot-nepal-is-it-worth-the-trip/", "type": "link", "content": [{"text": "Nagarkot", "type": "text", "styles": {"bold": true, "underline": true}}]}, {"text": ", we got there by bus from Bhaktapur and stayed a few nights, you could also take a day trip to see the Himalayas. Know which times of year will bring you clear skies.", "type": "text", "styles": {}}], "children": []}, {"id": "c2d40384-0656-4ab9-b0ca-476e2fe6d085", "type": "paragraph", "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"}, "content": [], "children": []}]	Our Nepal travel blog will help you in visiting Nepal to trek, to climb, to see the cultural sites and places of interest in Nepal, or just to hang out in Kathmandu or Pokhara.	https://images.unsplash.com/photo-1544735716-392fe2489ffa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MjY5MjJ8MHwxfHNlYXJjaHwxfHxuZXBhbHxlbnwwfDB8fHwxNzQ3OTgwMDEwfDA&ixlib=rb-4.1.0&q=80&w=1080	published	travel_tips	9bb6cace-c884-4b03-9807-0856c6279cd4	2025-05-23 06:00:41.395086+00	2025-05-23 06:53:34.848+00
\.


--
-- Data for Name: reminder_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reminder_log (id, user_id, itinerary_id, sent_at, email_id, status, created_at) FROM stdin;
\.


--
-- Data for Name: reminder_preference; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reminder_preference (id, user_id, opt_out, days_before, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, "clerkUserId", name, email, role, image, plan, "polarCustomerId", "subscriptionId", created_at, updated_at) FROM stdin;
dd85e8a5-dc51-40e0-a1b8-70e977039593	user_2xO6myQUZTdMZNM1TEx2GAZFwbV	Biraj Shrestha	birajshrestha2007@gmail.com	user	https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yeE82bjNXSUp0U0ZHb256UkdUcDAzWmdjOHQifQ	pro	fcfe70b2-de88-4954-9852-6d7616725b4f	d172b5ba-14a5-4397-a5dc-cc2eb5c7bddf	2025-05-21 03:08:57.503933+00	2025-05-21 03:47:46.548+00
9bb6cace-c884-4b03-9807-0856c6279cd4	user_2xU3pgWYaBLflToHx28DhAuMKho	Biraj Shrestha	birajdotdev@gmail.com	user	https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yeFUzcGFoeklVUE13emMyM0Q3N1p2TmlESWkifQ	free	317e8095-f94b-49dd-b64b-1e41e06d25da	\N	2025-05-23 05:43:34.757103+00	2025-05-23 05:43:35.947+00
64f4ad5f-e3d4-43f0-a8af-768bd64acb8d	user_2xZbWMJOB9seJWpkQvs5HiKcxUw	Biraj Shrestha	np03cs4s230227@heraldcollege.edu.np	user	https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZmFjZWJvb2svaW1nXzJ4WmJXTklQVll5eEFKbmF6YXJscDd5ZzNqYyJ9	free	fb5afad1-7a56-420e-8fa8-52fa6f906138	\N	2025-05-25 04:49:34.701583+00	2025-05-25 04:49:35.603+00
\.


--
-- Name: activity activity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity
    ADD CONSTRAINT activity_pkey PRIMARY KEY (id);


--
-- Name: comment comment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_pkey PRIMARY KEY (id);


--
-- Name: day day_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.day
    ADD CONSTRAINT day_pkey PRIMARY KEY (id);


--
-- Name: destination destination_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.destination
    ADD CONSTRAINT destination_pkey PRIMARY KEY (id);


--
-- Name: itinerary itinerary_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itinerary
    ADD CONSTRAINT itinerary_pkey PRIMARY KEY (id);


--
-- Name: like like_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."like"
    ADD CONSTRAINT like_pkey PRIMARY KEY (id);


--
-- Name: like like_post_id_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."like"
    ADD CONSTRAINT like_post_id_user_id_unique UNIQUE (post_id, user_id);


--
-- Name: notification notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (id);


--
-- Name: post post_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post
    ADD CONSTRAINT post_pkey PRIMARY KEY (id);


--
-- Name: post post_slug_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post
    ADD CONSTRAINT post_slug_unique UNIQUE (slug);


--
-- Name: reminder_log reminder_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reminder_log
    ADD CONSTRAINT reminder_log_pkey PRIMARY KEY (id);


--
-- Name: reminder_preference reminder_preference_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reminder_preference
    ADD CONSTRAINT reminder_preference_pkey PRIMARY KEY (id);


--
-- Name: reminder_preference reminder_preference_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reminder_preference
    ADD CONSTRAINT reminder_preference_user_id_unique UNIQUE (user_id);


--
-- Name: user user_clerkUserId_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "user_clerkUserId_unique" UNIQUE ("clerkUserId");


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: activity_day_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX activity_day_idx ON public.activity USING btree (day_id);


--
-- Name: comment_author_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX comment_author_idx ON public.comment USING btree (author_id);


--
-- Name: comment_post_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX comment_post_idx ON public.comment USING btree (post_id);


--
-- Name: itinerary_created_by_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX itinerary_created_by_idx ON public.itinerary USING btree (created_by_id);


--
-- Name: itinerary_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX itinerary_date_idx ON public.itinerary USING btree (start_date, end_date);


--
-- Name: itinerary_title_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX itinerary_title_idx ON public.itinerary USING btree (title);


--
-- Name: like_post_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX like_post_idx ON public."like" USING btree (post_id);


--
-- Name: like_user_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX like_user_idx ON public."like" USING btree (user_id);


--
-- Name: notification_post_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notification_post_idx ON public.notification USING btree (post_id);


--
-- Name: notification_read_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notification_read_idx ON public.notification USING btree (read);


--
-- Name: notification_user_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notification_user_idx ON public.notification USING btree (user_id);


--
-- Name: post_author_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX post_author_idx ON public.post USING btree (author_id);


--
-- Name: post_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX post_category_idx ON public.post USING btree (category);


--
-- Name: post_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX post_slug_idx ON public.post USING btree (slug);


--
-- Name: post_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX post_status_idx ON public.post USING btree (status);


--
-- Name: reminder_log_itinerary_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX reminder_log_itinerary_idx ON public.reminder_log USING btree (itinerary_id);


--
-- Name: reminder_log_user_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX reminder_log_user_idx ON public.reminder_log USING btree (user_id);


--
-- Name: reminder_preference_user_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX reminder_preference_user_idx ON public.reminder_preference USING btree (user_id);


--
-- Name: activity activity_day_id_day_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity
    ADD CONSTRAINT activity_day_id_day_id_fk FOREIGN KEY (day_id) REFERENCES public.day(id) ON DELETE CASCADE;


--
-- Name: ai_usage ai_usage_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_usage
    ADD CONSTRAINT ai_usage_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: comment comment_author_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_author_id_user_id_fk FOREIGN KEY (author_id) REFERENCES public."user"(id);


--
-- Name: comment comment_post_id_post_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_post_id_post_id_fk FOREIGN KEY (post_id) REFERENCES public.post(id) ON DELETE CASCADE;


--
-- Name: day day_itinerary_id_itinerary_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.day
    ADD CONSTRAINT day_itinerary_id_itinerary_id_fk FOREIGN KEY (itinerary_id) REFERENCES public.itinerary(id) ON DELETE CASCADE;


--
-- Name: destination destination_itinerary_id_itinerary_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.destination
    ADD CONSTRAINT destination_itinerary_id_itinerary_id_fk FOREIGN KEY (itinerary_id) REFERENCES public.itinerary(id) ON DELETE CASCADE;


--
-- Name: itinerary itinerary_created_by_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itinerary
    ADD CONSTRAINT itinerary_created_by_id_user_id_fk FOREIGN KEY (created_by_id) REFERENCES public."user"(id);


--
-- Name: like like_post_id_post_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."like"
    ADD CONSTRAINT like_post_id_post_id_fk FOREIGN KEY (post_id) REFERENCES public.post(id) ON DELETE CASCADE;


--
-- Name: like like_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."like"
    ADD CONSTRAINT like_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: notification notification_comment_id_comment_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_comment_id_comment_id_fk FOREIGN KEY (comment_id) REFERENCES public.comment(id) ON DELETE CASCADE;


--
-- Name: notification notification_from_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_from_user_id_user_id_fk FOREIGN KEY (from_user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: notification notification_post_id_post_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_post_id_post_id_fk FOREIGN KEY (post_id) REFERENCES public.post(id) ON DELETE CASCADE;


--
-- Name: notification notification_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: post post_author_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post
    ADD CONSTRAINT post_author_id_user_id_fk FOREIGN KEY (author_id) REFERENCES public."user"(id);


--
-- Name: reminder_log reminder_log_itinerary_id_itinerary_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reminder_log
    ADD CONSTRAINT reminder_log_itinerary_id_itinerary_id_fk FOREIGN KEY (itinerary_id) REFERENCES public.itinerary(id) ON DELETE CASCADE;


--
-- Name: reminder_log reminder_log_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reminder_log
    ADD CONSTRAINT reminder_log_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: reminder_preference reminder_preference_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reminder_preference
    ADD CONSTRAINT reminder_preference_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

