-- Local development seed data.
-- Applied by `supabase db reset` after migrations. Mirrors the in-repo seed
-- catalog (src/content/destinations.ts) so the DB-backed provider renders the
-- same content, making provider failover easy to observe locally.

insert into public.destinations (id, name, country, headline, mood, image_url) values
  ('kyoto', 'Kyoto', 'Japan', 'Lantern-lit alleys and the slow theatre of the tea house.', 'Contemplative', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80'),
  ('santorini', 'Santorini', 'Greece', 'Whitewashed terraces poured over a drowned volcano.', 'Luminous', 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1600&q=80'),
  ('marrakech', 'Marrakech', 'Morocco', 'Spice smoke, brass light, and a medina that never quite sleeps.', 'Electric', 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1600&q=80'),
  ('patagonia', 'Patagonia', 'Chile', 'Granite cathedrals and wind that rearranges the sky.', 'Untamed', 'https://images.unsplash.com/photo-1531794343993-cd2ef0e94c5b?auto=format&fit=crop&w=1600&q=80')
on conflict (id) do nothing;

-- Minimal affiliate sample so the routing resolver returns a result locally
-- once the `affiliate-catalog` flag is enabled. Replace with real partner data.
insert into public.affiliate_providers (id, name, enabled) values
  ('sample-net', 'Sample Affiliate Network', true)
on conflict (id) do nothing;

insert into public.affiliate_campaigns (id, provider_id, category, enabled) values
  ('sample-hotels', 'sample-net', 'hotels', true)
on conflict (id) do nothing;

insert into public.affiliate_links (id, campaign_id, category, url_template, enabled) values
  ('sample-hotels-link', 'sample-hotels', 'hotels', 'https://example.com/hotels?aid={token}', true)
on conflict (id) do nothing;

insert into public.affiliate_priority_rules (campaign_id, category, region, priority) values
  ('sample-hotels', 'hotels', null, 10);
