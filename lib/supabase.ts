import { createClient } from "@supabase/supabase-js";

// Server-only client — uses the service-role key, same pattern as
// content-generator's lib/supabase.ts. Never import this file from a
// "use client" component; it must only be reached from route handlers,
// server components, or server actions.
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
