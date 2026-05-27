-- Local development seed data.
-- Applied by `supabase db reset` after migrations. Mirrors the in-repo seed
-- catalog (src/content/destinations.ts) so the DB-backed provider renders the
-- same content, making provider failover easy to observe locally.

insert into public.destinations
  (id, name, country, headline, mood, image_url, latitude, longitude, description, best_time) values
  ('kyoto', 'Kyoto', 'Japan', 'Lantern-lit alleys and the slow theatre of the tea house.', 'Contemplative', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80', 35.0116, 135.7681, 'Kyoto rewards slowness. Beyond the headline shrines, the city is a thousand small rituals — a kettle''s whistle in a machiya, moss kept like a secret, lantern light pooling on wet stone after rain.', 'Late November for maple fire; early April for cherry blossom.'),
  ('santorini', 'Santorini', 'Greece', 'Whitewashed terraces poured over a drowned volcano.', 'Luminous', 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1600&q=80', 36.3932, 25.4615, 'Santorini is a study in contrast — blinding white against volcanic black, the caldera dropping away beneath terraces that seem poured rather than built. Come for the light; stay for the long, slow dusk.', 'Late spring or September — past the heat, before the crowds.'),
  ('marrakech', 'Marrakech', 'Morocco', 'Spice smoke, brass light, and a medina that never quite sleeps.', 'Electric', 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1600&q=80', 31.6295, -7.9811, 'Marrakech arrives through the senses first — saffron and smoke, the call to prayer over the Jemaa el-Fnaa, a medina that folds in on itself until a riad''s quiet courtyard opens like a held breath.', 'Spring and autumn; high summer is fierce.'),
  ('patagonia', 'Patagonia', 'Chile', 'Granite cathedrals and wind that rearranges the sky.', 'Untamed', 'https://images.unsplash.com/photo-1531794343993-cd2ef0e94c5b?auto=format&fit=crop&w=1600&q=80', -51.0, -73.0, 'Patagonia is scale you feel in the chest — granite towers, glaciers calving into milk-blue lakes, and a wind that rewrites the sky by the hour. It humbles and clarifies in equal measure.', 'November–March (austral summer) for trekking.')
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
