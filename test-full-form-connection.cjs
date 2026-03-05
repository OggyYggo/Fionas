// Test script to verify all form fields are connected to database
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFullFormConnection() {
  try {
    console.log('🔍 Testing full form field connection...\n');
    
    // Test data with all form fields
    const completeTourData = {
      title: 'Complete Form Test Tour',
      description: 'Testing all form fields are saved to database',
      image: 'https://via.placeholder.com/300x200?text=Complete+Test',
      duration: 'Full Day',
      max_people: 'Max 10',
      price: '₱3,500',
      tag: 'Adventure',
      featured: true,
      highlights: [
        'Professional tour guide',
        'Hotel pickup and drop-off',
        'All entrance fees included',
        'Small group experience'
      ],
      included: [
        'Hotel pickup and drop-off',
        'Boat transfers',
        'Snorkeling equipment',
        'Local guide',
        'Morning snacks',
        'Environmental fees'
      ],
      not_included: [
        'Lunch',
        'Underwater camera',
        'Tips and gratuities',
        'Personal expenses'
      ],
      pricing: {
        local: [
          { pax: 1, price: '₱3,500' },
          { pax: 2, price: '₱2,000' },
          { pax: '10+', price: '₱650' }
        ],
        foreigner: [
          { pax: 1, price: '$70' },
          { pax: 2, price: '$40' },
          { pax: '10+', price: '$13' }
        ]
      }
    };
    
    console.log('1. Creating tour with all form fields...');
    const { data: insertData, error: insertError } = await supabase
      .from('tours')
      .insert([completeTourData])
      .select()
      .single();
    
    if (insertError) {
      console.log('❌ Insert failed:', insertError.message);
      console.log('💡 This might indicate missing database columns');
      return;
    }
    
    console.log('✅ Tour created successfully with ID:', insertData.id);
    
    console.log('\n2. Retrieving tour to verify all fields...');
    const { data: retrievedTour, error: retrieveError } = await supabase
      .from('tours')
      .select('*')
      .eq('id', insertData.id)
      .single();
    
    if (retrieveError) {
      console.log('❌ Retrieve failed:', retrieveError.message);
      return;
    }
    
    console.log('✅ Tour retrieved successfully');
    
    // Verify all fields were saved correctly
    console.log('\n3. Verifying field integrity...');
    const checks = [
      { field: 'title', expected: completeTourData.title, actual: retrievedTour.title },
      { field: 'highlights', expected: completeTourData.highlights, actual: retrievedTour.highlights },
      { field: 'included', expected: completeTourData.included, actual: retrievedTour.included },
      { field: 'not_included', expected: completeTourData.not_included, actual: retrievedTour.not_included },
      { field: 'pricing', expected: completeTourData.pricing, actual: retrievedTour.pricing },
      { field: 'featured', expected: completeTourData.featured, actual: retrievedTour.featured }
    ];
    
    let allPassed = true;
    checks.forEach(check => {
      const passed = JSON.stringify(check.expected) === JSON.stringify(check.actual);
      console.log(`${passed ? '✅' : '❌'} ${check.field}: ${passed ? 'PASS' : 'FAIL'}`);
      if (!passed) {
        console.log(`   Expected: ${JSON.stringify(check.expected)}`);
        console.log(`   Actual: ${JSON.stringify(check.actual)}`);
        allPassed = false;
      }
    });
    
    // Clean up test record
    await supabase.from('tours').delete().eq('id', insertData.id);
    console.log('\n🧹 Test record cleaned up');
    
    console.log(`\n🎉 Full form connection test ${allPassed ? 'PASSED' : 'FAILED'}!`);
    
    if (allPassed) {
      console.log('\n✅ All form fields are properly connected to the database!');
      console.log('✅ Your TourForm will now save all data correctly!');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testFullFormConnection();
