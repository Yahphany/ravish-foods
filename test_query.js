import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nptwxzdwbmguadqndufs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wdHd4emR3Ym1ndWFkcW5kdWZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NDk0MzYsImV4cCI6MjA5NjEyNTQzNn0.oPUL35itiU8TozwIZR7WkILv6jXbvAaemxAsleAi7ks';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUnauthenticatedQuery() {
  console.log('--- Testing query with profiles:user_id ---');
  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      status,
      total,
      delivery_fee,
      delivery_address,
      created_at,
      user_id,
      vendor_id,
      dispatcher_id,

      order_items (
        id,
        menu_item_id,
        name,
        price,
        quantity,
        image
      )
    `);

  if (error) {
    console.error('Query failed with error:');
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('Details:', error.details);
    console.error('Hint:', error.hint);
  } else {
    console.log('Query succeeded! Data count:', data.length);
  }
}

testUnauthenticatedQuery();
