--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1
-- Dumped by pg_dump version 14.3 (Debian 14.3-1.pgdg110+1)

--
-- Name: patches; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE "public"."patches"
(
  "id"         "text"   NOT NULL,
  "links"      "text"[] NOT NULL,
  "releasedAt" timestamp without time zone,
  "number"     integer  NOT NULL
);

--
-- Name: COLUMN "patches"."id"; Type: COMMENT; Schema: public; Owner: supabase_admin
--

COMMENT ON COLUMN "public"."patches"."id" IS 'The patch ID, e.g. `7.00`, `7.28c`, `7.29`';


--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE "public"."sub  scriptions"
(
  "endpoint"     "text"                                      NOT NULL,
  "createdAt"    timestamp without time zone DEFAULT "now"() NOT NULL,
  "auth"         "text"                                      NOT NULL,
  "extra"        "text",
  "environment"  "text"                                      NOT NULL,
  "lastNotified" integer                                     NOT NULL,
  "type"         "text"                      DEFAULT 'push'::"text" NOT NULL
);


--
-- Name: TABLE "subscriptions"; Type: COMMENT; Schema: public; Owner: supabase_admin
--

COMMENT ON TABLE "public"."subscriptions" IS 'Web Push Notifications subscription data';


--
-- Name: patches patches_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY "public"."patches"
  ADD CONSTRAINT "patches_pkey" PRIMARY KEY ("id");


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY "public"."subscriptions"
  ADD CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("endpoint");


--
-- Name: patches anyone can read patches; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE
POLICY "anyone can read patches" ON "public"."patches" FOR
SELECT USING (true);


--
-- Name: patches; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE "public"."patches" ENABLE ROW LEVEL SECURITY;

--
-- Name: subscriptions; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE "public"."subscriptions" ENABLE ROW LEVEL SECURITY;
