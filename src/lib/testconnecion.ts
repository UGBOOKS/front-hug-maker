import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

// Add test connection code here
async function testConnection() {
  console.log('Testing Supabase connection...')
  
  // Try to fetch from a table (replace 'your_table' with an actual table name)
  const { data, error } = await supabase
    .from('users')  // Change this to a real table
    .select('*')
    .limit(1)
  
  if (error) {
    console.error('❌ Connection failed:', error.message)
  } else {
    console.log('✅ Connection successful!')
    console.log('Data:', data)
  }
}

// Run the test
testConnection()