import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nptwxzdwbmguadqndufs.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wdHd4emR3Ym1ndWFkcW5kdWZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NDk0MzYsImV4cCI6MjA5NjEyNTQzNn0.oPUL35itiU8TozwIZR7WkILv6jXbvAaemxAsleAi7ks";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listTables() {
  console.log("Fetching system schema information...");
  // We can query postgrest to see the schema table definitions exposed
  const { data, error } = await supabase.rpc("get_tables"); // Or just fetch from an empty select
  if (error) {
    console.error("RPC failed:", error);
    // Alternatively, let's try reading a common table to see if it exists
    const tables = [
      "profiles",
      "orders",
      "order_items",
      "menu_items",
      "notifications",
      "messages",
    ];
    for (const table of tables) {
      const { error: err } = await supabase
        .from(table)
        .select("count", { count: "exact", head: true });
      if (err) {
        console.log(`Table '${table}' does not exist or error:`, err.message);
      } else {
        console.log(`Table '${table}' exists!`);
      }
    }
  }
}

listTables();
