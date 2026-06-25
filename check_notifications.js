import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nptwxzdwbmguadqndufs.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wdHd4emR3Ym1ndWFkcW5kdWZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NDk0MzYsImV4cCI6MjA5NjEyNTQzNn0.oPUL35itiU8TozwIZR7WkILv6jXbvAaemxAsleAi7ks";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkNotificationsSchema() {
  console.log("Fetching notifications schema...");
  // We can insert a dummy row and select it, or check column names by querying empty
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .limit(1);
  if (error) {
    console.error("Error fetching notifications:", error);
  } else {
    console.log("Notifications columns:", data);
  }
}

checkNotificationsSchema();
