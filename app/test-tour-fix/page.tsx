'use client'

import { useState } from 'react'
import { SimpleTourService } from '@/lib/simpleTourService'

export default function TestTourFixPage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testTourCreation = async () => {
    setLoading(true)
    setResult('')
    
    try {
      const testTour = {
        title: 'Test Tour Fix',
        description: 'Testing if the tour creation fix works',
        image: 'https://example.com/test.jpg',
        duration: 'Half Day',
        maxPeople: 'Max 5',
        price: '₱1,000',
        tag: 'Test',
        featured: false
      }
      
      const newTour = await SimpleTourService.createTour(testTour)
      setResult(`✅ SUCCESS: Tour created with ID ${newTour.id}`)
      
      // Clean up
      await SimpleTourService.deleteTour(newTour.id)
      setResult(prev => prev + ' (and cleaned up)')
      
    } catch (error) {
      setResult(`❌ ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Tour Creation Fix Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Tour Creation</h2>
          <p className="text-gray-600 mb-6">
            Click the button below to test if the tour creation issue has been fixed.
            This will create a test tour and then delete it.
          </p>
          
          <button
            onClick={testTourCreation}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Tour Creation'}
          </button>
          
          {result && (
            <div className={`mt-6 p-4 rounded-lg ${result.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              <pre className="whitespace-pre-wrap">{result}</pre>
            </div>
          )}
        </div>
        
        <div className="bg-blue-50 rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">What this tests:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Connection to the correct <code>tours</code> table (not tour_packages)</li>
            <li>Proper column mapping including <code>duration</code> field</li>
            <li>Supabase authentication and permissions</li>
            <li>Row Level Security policies</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
