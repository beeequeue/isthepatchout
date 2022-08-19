-- Remove realtime from subscriptions, it _might_ have sensitive data at some point and RLS doesn't work on it
DO
$do$
    BEGIN
        IF EXISTS(SELECT FROM pg_catalog.pg_publication_tables WHERE tablename = 'subscriptions') THEN
            ALTER publication supabase_realtime DROP TABLE subscriptions;
        END IF;
    END
$do$;

-- Add realtime to patches
DO
$do$
    BEGIN
        IF NOT EXISTS(SELECT FROM pg_catalog.pg_publication_tables WHERE tablename = 'patches') THEN
            ALTER publication supabase_realtime ADD TABLE patches;
        END IF;
    END
$do$;

