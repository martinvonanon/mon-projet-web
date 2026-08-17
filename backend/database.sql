--
-- PostgreSQL database dump
--

\restrict 4TqvVdcMXzDC83PAlAp9GYDyltoUzN6PaAoG6e89KjlEQ8ufoGoEekAWaZBJbbQ

-- Dumped from database version 16.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-08-17 16:34:28

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 16436)
-- Name: inscription; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inscription (
    id integer NOT NULL,
    nom character varying(255) NOT NULL,
    prenom character varying(255) NOT NULL,
    sexe character varying(25) NOT NULL,
    tel character varying(30) NOT NULL,
    email character varying(255) NOT NULL,
    datenaiss date NOT NULL,
    statut character varying(255) NOT NULL
);


ALTER TABLE public.inscription OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16435)
-- Name: inscription_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inscription_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inscription_id_seq OWNER TO postgres;

--
-- TOC entry 4888 (class 0 OID 0)
-- Dependencies: 215
-- Name: inscription_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inscription_id_seq OWNED BY public.inscription.id;


--
-- TOC entry 4735 (class 2604 OID 16439)
-- Name: inscription id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscription ALTER COLUMN id SET DEFAULT nextval('public.inscription_id_seq'::regclass);


--
-- TOC entry 4882 (class 0 OID 16436)
-- Dependencies: 216
-- Data for Name: inscription; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inscription (id, nom, prenom, sexe, tel, email, datenaiss, statut) FROM stdin;
\.


--
-- TOC entry 4889 (class 0 OID 0)
-- Dependencies: 215
-- Name: inscription_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inscription_id_seq', 1, false);


--
-- TOC entry 4737 (class 2606 OID 16443)
-- Name: inscription inscription_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscription
    ADD CONSTRAINT inscription_pkey PRIMARY KEY (id);


-- Completed on 2026-08-17 16:34:28

--
-- PostgreSQL database dump complete
--

\unrestrict 4TqvVdcMXzDC83PAlAp9GYDyltoUzN6PaAoG6e89KjlEQ8ufoGoEekAWaZBJbbQ

