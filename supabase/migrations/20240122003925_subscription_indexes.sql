CREATE INDEX "subscriptions_list_order_idx" ON public.subscriptions USING btree ("createdAt");

CREATE INDEX "subscriptions_list_idx" ON public.subscriptions USING btree (environment, "lastNotified");
