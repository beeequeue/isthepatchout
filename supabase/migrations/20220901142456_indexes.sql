CREATE INDEX idx_number ON public.patches USING btree (number);

CREATE INDEX "idx_releasedAt" ON public.patches USING btree ("releasedAt");
