/**
 * Central provider registration.
 *
 * Importing this module wires up every available adapter. Import order does not
 * affect routing — the registry sorts by `priority`. Add new adapters here.
 */
import "./destinations.local";
import "./destinations.supabase";
import "./affiliate.supabase";
