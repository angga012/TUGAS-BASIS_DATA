--
-- PostgreSQL database dump
--

\restrict behJxqI0AY9Wbm3VtQsL6i2xmY1kxwiZSquh7ZoILY7fcxzxFRKZTxn4Gr2C9g4

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-06-05 22:17:45

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
-- TOC entry 219 (class 1259 OID 17114)
-- Name: cash_payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cash_payment (
    cash_payment_id integer NOT NULL
);


ALTER TABLE public.cash_payment OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 17120)
-- Name: ewallet_payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ewallet_payment (
    ewallet_payment_id integer NOT NULL,
    wallet_type character varying(50) NOT NULL
);


ALTER TABLE public.ewallet_payment OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 17144)
-- Name: member_customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.member_customer (
    customer_id integer NOT NULL,
    membership_level character varying(30) NOT NULL,
    expired_date date NOT NULL
);


ALTER TABLE public.member_customer OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 17157)
-- Name: regular_customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.regular_customer (
    customer_id integer NOT NULL
);


ALTER TABLE public.regular_customer OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 17192)
-- Name: tb_booking; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_booking (
    booking_id integer NOT NULL,
    booking_date date NOT NULL,
    booking_time date NOT NULL,
    duration integer NOT NULL,
    customer_id integer NOT NULL,
    schedule_id integer NOT NULL,
    notes character varying(255)
);


ALTER TABLE public.tb_booking OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 17213)
-- Name: tb_booking_detail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_booking_detail (
    booking_detail_id integer NOT NULL,
    booking_id integer NOT NULL,
    booking_type character varying(50) NOT NULL,
    start_period date NOT NULL,
    end_period date NOT NULL,
    total_sessions integer NOT NULL,
    price_total numeric NOT NULL,
    discount numeric,
    description text
);


ALTER TABLE public.tb_booking_detail OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 17134)
-- Name: tb_customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_customer (
    customer_id integer NOT NULL,
    customer_name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    address character varying(100),
    phone_number character varying(100),
    membership_status character varying(100)
);


ALTER TABLE public.tb_customer OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 17168)
-- Name: tb_field; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_field (
    field_id integer NOT NULL,
    field_name character varying(100) NOT NULL,
    price_per_hour numeric(10,2) NOT NULL,
    capacity integer NOT NULL,
    field_type character varying(50),
    status character varying(50)
);


ALTER TABLE public.tb_field OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 17232)
-- Name: tb_payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_payment (
    payment_id integer NOT NULL,
    payment_method character varying(30) NOT NULL,
    payment_type character varying(20) NOT NULL,
    payment_date date NOT NULL,
    amount numeric(10,2) NOT NULL,
    booking_id integer NOT NULL,
    proof_of_payment character varying(255),
    cash_payment_id integer,
    transfer_payment_id integer,
    ewallet_payment_id integer,
    CONSTRAINT arc_payment_chk CHECK ((((cash_payment_id IS NOT NULL) AND (transfer_payment_id IS NULL) AND (ewallet_payment_id IS NULL)) OR ((cash_payment_id IS NULL) AND (transfer_payment_id IS NOT NULL) AND (ewallet_payment_id IS NULL)) OR ((cash_payment_id IS NULL) AND (transfer_payment_id IS NULL) AND (ewallet_payment_id IS NOT NULL))))
);


ALTER TABLE public.tb_payment OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 17177)
-- Name: tb_schedule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_schedule (
    schedule_id integer NOT NULL,
    field_id integer NOT NULL,
    available_date date NOT NULL,
    start_time date NOT NULL,
    end_time date NOT NULL,
    status character varying(50)
);


ALTER TABLE public.tb_schedule OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 17127)
-- Name: transfer_payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transfer_payment (
    transfer_payment_id integer NOT NULL,
    bank_name character varying(50) NOT NULL
);


ALTER TABLE public.transfer_payment OWNER TO postgres;

--
-- TOC entry 5075 (class 0 OID 17114)
-- Dependencies: 219
-- Data for Name: cash_payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.cash_payment (cash_payment_id) VALUES (1);
INSERT INTO public.cash_payment (cash_payment_id) VALUES (2);


--
-- TOC entry 5076 (class 0 OID 17120)
-- Dependencies: 220
-- Data for Name: ewallet_payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.ewallet_payment (ewallet_payment_id, wallet_type) VALUES (1, 'GoPay');
INSERT INTO public.ewallet_payment (ewallet_payment_id, wallet_type) VALUES (2, 'OVO');


--
-- TOC entry 5079 (class 0 OID 17144)
-- Dependencies: 223
-- Data for Name: member_customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.member_customer (customer_id, membership_level, expired_date) VALUES (1, 'Gold', '2027-01-01');


--
-- TOC entry 5080 (class 0 OID 17157)
-- Dependencies: 224
-- Data for Name: regular_customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.regular_customer (customer_id) VALUES (2);


--
-- TOC entry 5083 (class 0 OID 17192)
-- Dependencies: 227
-- Data for Name: tb_booking; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tb_booking (booking_id, booking_date, booking_time, duration, customer_id, schedule_id, notes) VALUES (1, '2026-06-10', '2026-06-10', 2, 1, 1, 'Booking latihan tim');
INSERT INTO public.tb_booking (booking_id, booking_date, booking_time, duration, customer_id, schedule_id, notes) VALUES (2, '2026-06-10', '2026-06-10', 1, 2, 2, 'Booking futsal santai');


--
-- TOC entry 5084 (class 0 OID 17213)
-- Dependencies: 228
-- Data for Name: tb_booking_detail; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tb_booking_detail (booking_detail_id, booking_id, booking_type, start_period, end_period, total_sessions, price_total, discount, description) VALUES (1, 1, 'Regular Booking', '2026-06-10', '2026-06-10', 1, 200000.00, 0.00, 'Latihan rutin tim futsal lokal');
INSERT INTO public.tb_booking_detail (booking_detail_id, booking_id, booking_type, start_period, end_period, total_sessions, price_total, discount, description) VALUES (2, 2, 'Regular Booking', '2026-06-10', '2026-06-10', 1, 120000.00, 0.00, 'Main santai bareng teman kantor');


--
-- TOC entry 5078 (class 0 OID 17134)
-- Dependencies: 222
-- Data for Name: tb_customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tb_customer (customer_id, customer_name, email, address, phone_number, membership_status) VALUES (1, 'Andi', 'andi@gmail.com', 'Sidoarjo', '081234567890', 'Member');
INSERT INTO public.tb_customer (customer_id, customer_name, email, address, phone_number, membership_status) VALUES (2, 'Budi', 'budi@gmail.com', 'Surabaya', '089876543210', 'Regular');


--
-- TOC entry 5081 (class 0 OID 17168)
-- Dependencies: 225
-- Data for Name: tb_field; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tb_field (field_id, field_name, price_per_hour, capacity, field_type, status) VALUES (1, 'Lapangan A', 100000.00, 12, 'Sintetis', 'Tersedia');
INSERT INTO public.tb_field (field_id, field_name, price_per_hour, capacity, field_type, status) VALUES (2, 'Lapangan B', 120000.00, 12, 'Vinyl', 'Tersedia');


--
-- TOC entry 5085 (class 0 OID 17232)
-- Dependencies: 229
-- Data for Name: tb_payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tb_payment (payment_id, payment_method, payment_type, payment_date, amount, booking_id, proof_of_payment, cash_payment_id, transfer_payment_id, ewallet_payment_id) VALUES (1, 'Cash', 'Lunas', '2026-06-05', 200000.00, 1, NULL, 1, NULL, NULL);
INSERT INTO public.tb_payment (payment_id, payment_method, payment_type, payment_date, amount, booking_id, proof_of_payment, cash_payment_id, transfer_payment_id, ewallet_payment_id) VALUES (2, 'Transfer', 'Lunas', '2026-06-05', 120000.00, 2, 'bukti_transfer_budi.png', NULL, 1, NULL);


--
-- TOC entry 5082 (class 0 OID 17177)
-- Dependencies: 226
-- Data for Name: tb_schedule; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tb_schedule (schedule_id, field_id, available_date, start_time, end_time, status) VALUES (1, 1, '2026-06-10', '2026-06-10', '2026-06-10', 'Available');
INSERT INTO public.tb_schedule (schedule_id, field_id, available_date, start_time, end_time, status) VALUES (2, 2, '2026-06-10', '2026-06-10', '2026-06-10', 'Available');


--
-- TOC entry 5077 (class 0 OID 17127)
-- Dependencies: 221
-- Data for Name: transfer_payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.transfer_payment (transfer_payment_id, bank_name) VALUES (1, 'Bank BCA');
INSERT INTO public.transfer_payment (transfer_payment_id, bank_name) VALUES (2, 'Bank Mandiri');


--
-- TOC entry 4897 (class 2606 OID 17119)
-- Name: cash_payment cash_payment_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cash_payment
    ADD CONSTRAINT cash_payment_pk PRIMARY KEY (cash_payment_id);


--
-- TOC entry 4899 (class 2606 OID 17126)
-- Name: ewallet_payment ewallet_payment_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ewallet_payment
    ADD CONSTRAINT ewallet_payment_pk PRIMARY KEY (ewallet_payment_id);


--
-- TOC entry 4905 (class 2606 OID 17151)
-- Name: member_customer member_customer_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member_customer
    ADD CONSTRAINT member_customer_pk PRIMARY KEY (customer_id);


--
-- TOC entry 4907 (class 2606 OID 17162)
-- Name: regular_customer regular_customer_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.regular_customer
    ADD CONSTRAINT regular_customer_pk PRIMARY KEY (customer_id);


--
-- TOC entry 4915 (class 2606 OID 17226)
-- Name: tb_booking_detail tb_booking_detail_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_booking_detail
    ADD CONSTRAINT tb_booking_detail_pk PRIMARY KEY (booking_detail_id);


--
-- TOC entry 4913 (class 2606 OID 17202)
-- Name: tb_booking tb_booking_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_booking
    ADD CONSTRAINT tb_booking_pk PRIMARY KEY (booking_id);


--
-- TOC entry 4903 (class 2606 OID 17143)
-- Name: tb_customer tb_customer_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_customer
    ADD CONSTRAINT tb_customer_pk PRIMARY KEY (customer_id);


--
-- TOC entry 4909 (class 2606 OID 17176)
-- Name: tb_field tb_field_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_field
    ADD CONSTRAINT tb_field_pk PRIMARY KEY (field_id);


--
-- TOC entry 4917 (class 2606 OID 17243)
-- Name: tb_payment tb_payment_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_payment
    ADD CONSTRAINT tb_payment_pk PRIMARY KEY (payment_id);


--
-- TOC entry 4911 (class 2606 OID 17186)
-- Name: tb_schedule tb_schedule_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_schedule
    ADD CONSTRAINT tb_schedule_pk PRIMARY KEY (schedule_id);


--
-- TOC entry 4901 (class 2606 OID 17133)
-- Name: transfer_payment transfer_payment_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transfer_payment
    ADD CONSTRAINT transfer_payment_pk PRIMARY KEY (transfer_payment_id);


--
-- TOC entry 4921 (class 2606 OID 17203)
-- Name: tb_booking book_cust_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_booking
    ADD CONSTRAINT book_cust_fk FOREIGN KEY (customer_id) REFERENCES public.tb_customer(customer_id);


--
-- TOC entry 4922 (class 2606 OID 17208)
-- Name: tb_booking book_sch_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_booking
    ADD CONSTRAINT book_sch_fk FOREIGN KEY (schedule_id) REFERENCES public.tb_schedule(schedule_id);


--
-- TOC entry 4923 (class 2606 OID 17227)
-- Name: tb_booking_detail bookdet_book_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_booking_detail
    ADD CONSTRAINT bookdet_book_fk FOREIGN KEY (booking_id) REFERENCES public.tb_booking(booking_id);


--
-- TOC entry 4918 (class 2606 OID 17152)
-- Name: member_customer member_customer_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member_customer
    ADD CONSTRAINT member_customer_fk FOREIGN KEY (customer_id) REFERENCES public.tb_customer(customer_id);


--
-- TOC entry 4924 (class 2606 OID 17244)
-- Name: tb_payment pay_book_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_payment
    ADD CONSTRAINT pay_book_fk FOREIGN KEY (booking_id) REFERENCES public.tb_booking(booking_id);


--
-- TOC entry 4925 (class 2606 OID 17249)
-- Name: tb_payment pay_cash_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_payment
    ADD CONSTRAINT pay_cash_fk FOREIGN KEY (cash_payment_id) REFERENCES public.cash_payment(cash_payment_id);


--
-- TOC entry 4926 (class 2606 OID 17259)
-- Name: tb_payment pay_ewallet_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_payment
    ADD CONSTRAINT pay_ewallet_fk FOREIGN KEY (ewallet_payment_id) REFERENCES public.ewallet_payment(ewallet_payment_id);


--
-- TOC entry 4927 (class 2606 OID 17254)
-- Name: tb_payment pay_trans_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_payment
    ADD CONSTRAINT pay_trans_fk FOREIGN KEY (transfer_payment_id) REFERENCES public.transfer_payment(transfer_payment_id);


--
-- TOC entry 4919 (class 2606 OID 17163)
-- Name: regular_customer rc_cust_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.regular_customer
    ADD CONSTRAINT rc_cust_fk FOREIGN KEY (customer_id) REFERENCES public.tb_customer(customer_id);


--
-- TOC entry 4920 (class 2606 OID 17187)
-- Name: tb_schedule sch_field_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_schedule
    ADD CONSTRAINT sch_field_fk FOREIGN KEY (field_id) REFERENCES public.tb_field(field_id);


-- Completed on 2026-06-05 22:17:45

--
-- PostgreSQL database dump complete
--

\unrestrict behJxqI0AY9Wbm3VtQsL6i2xmY1kxwiZSquh7ZoILY7fcxzxFRKZTxn4Gr2C9g4

