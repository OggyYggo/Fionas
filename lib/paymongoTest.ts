import Paymongo from 'paymongo-node'

export async function testPayMongoConnection() {
  try {
    console.log('Testing PayMongo connection...')
    console.log('Secret Key exists:', !!process.env.PAYMONGO_SECRET_KEY)
    console.log('Secret Key starts with sk_test:', process.env.PAYMONGO_SECRET_KEY?.startsWith('sk_test'))
    
    const paymongo = new Paymongo(process.env.PAYMONGO_SECRET_KEY)
    
    // Test creating a simple payment intent
    const paymentIntent = await paymongo.paymentIntents.create({
      amount: 10000, // 100 PHP in cents
      currency: 'PHP',
      description: 'Test payment',
      payment_method_allowed: ['card'],
      capture_type: 'automatic'
    })
    
    console.log('PayMongo connection successful:', paymentIntent)
    return { success: true, data: paymentIntent }
  } catch (error: any) {
    console.error('PayMongo connection failed:', error)
    return { success: false, error: error.message || error.toString() }
  }
}
