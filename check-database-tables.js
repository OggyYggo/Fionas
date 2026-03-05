// Database Table Checker
// Run this in the browser console to see what tables exist

async function checkDatabaseTables() {
  console.log('🔍 Checking database tables...')
  
  try {
    const { supabase } = await import('/lib/supabase.js')
    console.log('✅ Supabase client imported')
    
    // Try to list all tables using PostgreSQL information_schema
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name, table_schema')
      .eq('table_schema', 'public')
      .eq('table_type', 'BASE TABLE')
    
    if (tableError) {
      console.error('❌ Error listing tables:', tableError)
      
      // Fallback: try common table names
      const commonTables = ['tours', 'tour_packages', 'bookings', 'destinations']
      console.log('🔍 Testing common table names...')
      
      for (const tableName of commonTables) {
        try {
          const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .limit(1)
          
          if (error) {
            console.log(`❌ Table '${tableName}' not accessible:`, error.message)
          } else {
            console.log(`✅ Table '${tableName}' exists and is accessible`)
            console.log(`📋 Sample data from '${tableName}':`, data)
          }
        } catch (e) {
          console.log(`❌ Table '${tableName}' error:`, e.message)
        }
      }
    } else {
      console.log('✅ Found tables:', tables)
    }
    
    // Check if tour_packages table exists and its structure
    console.log('🔍 Checking tour_packages table structure...')
    try {
      const { data: tourPackagesData, error: tourPackagesError } = await supabase
        .from('tour_packages')
        .select('*')
        .limit(3)
      
      if (tourPackagesError) {
        console.error('❌ tour_packages table error:', tourPackagesError)
      } else {
        console.log('✅ tour_packages table exists')
        console.log('📋 Sample tour_packages data:', tourPackagesData)
        
        // Get column information
        if (tourPackagesData.length > 0) {
          console.log('📋 Available columns:', Object.keys(tourPackagesData[0]))
        }
      }
    } catch (e) {
      console.error('❌ Error checking tour_packages:', e)
    }
    
  } catch (error) {
    console.error('❌ Database check failed:', error)
  }
}

console.log('🔧 Database checker loaded. Run checkDatabaseTables() to see available tables.')
