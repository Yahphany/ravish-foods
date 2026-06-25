import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nptwxzdwbmguadqndufs.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wdHd4emR3Ym1ndWFkcW5kdWZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NDk0MzYsImV4cCI6MjA5NjEyNTQzNn0.oPUL35itiU8TozwIZR7WkILv6jXbvAaemxAsleAi7ks";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabase() {
  console.log("--- Fetching Profiles ---");
  const { data: profiles, error: profErr } = await supabase
    .from("profiles")
    .select("*");
  if (profErr) console.error("Profiles error:", profErr);
  else console.log("Profiles:", JSON.stringify(profiles, null, 2));

  console.log("--- Fetching Orders ---");
  const { data: orders, error: orderErr } = await supabase
    .from("orders")
    .select("*");
  if (orderErr) console.error("Orders error:", orderErr);
  else console.log("Orders:", JSON.stringify(orders, null, 2));

  console.log("--- Fetching Order Items ---");
  const { data: items, error: itemsErr } = await supabase
    .from("order_items")
    .select("*");
  if (itemsErr) console.error("Order Items error:", itemsErr);
  else console.log("Order Items:", JSON.stringify(items, null, 2));
}

checkDatabase();
