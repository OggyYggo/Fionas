import Paymongo from 'paymongo-node'

const paymongo = new Paymongo(process.env.PAYMONGO_SECRET_KEY)

export interface PaymentData {
  cardNumber?: string
  cardName?: string
  expiryDate?: string
  cvv?: string
  billingAddress?: string
  paymentType: 'card' | 'gcash' | 'paymaya'
  phoneNumber?: string
  email?: string
}

export interface PaymentResult {
  success: boolean
  paymentId?: string
  error?: string
}

export class PayMongoService {
  static async createPaymentIntent(amount: number, description: string): Promise<any> {
    try {
      // Check if environment variables are set
      if (!process.env.PAYMONGO_SECRET_KEY) {
        throw new Error('PayMongo secret key is not configured')
      }

      console.log('Creating payment intent with amount:', amount, 'and description:', description)
      
      const paymentIntent = await paymongo.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency: 'PHP',
        description: description,
        payment_method_allowed: ['card'],
        capture_type: 'automatic'
      })
      
      console.log('Payment intent created successfully:', paymentIntent)
      return paymentIntent.data
    } catch (error) {
      console.error('Error creating payment intent:', error)
      throw error
    }
  }

  static async createPaymentMethod(paymentData: PaymentData): Promise<any> {
    try {
      // Check if environment variables are set
      if (!process.env.PAYMONGO_SECRET_KEY) {
        throw new Error('PayMongo secret key is not configured')
      }

      console.log('Creating payment method for type:', paymentData.paymentType)
      
      if (paymentData.paymentType === 'card') {
        // Extract month and year from expiry date (MM/YY format)
        const [month, year] = paymentData.expiryDate?.split('/') || ['', '']
        const fullYear = `20${year}` // Convert YY to YYYY
        
        const paymentMethod = await paymongo.paymentMethods.create({
          type: 'card',
          card: {
            number: paymentData.cardNumber?.replace(/\s/g, '') || '', // Remove spaces
            exp_month: parseInt(month),
            exp_year: parseInt(fullYear),
            cvc: paymentData.cvv || ''
          },
          billing: {
            name: paymentData.cardName || '',
            address: {
              line1: paymentData.billingAddress || '',
              country: 'PH' // Philippines
            }
          }
        })
        
        return paymentMethod.data
      } else {
        // Create E-wallet payment method
        const paymentMethod = await paymongo.paymentMethods.create({
          type: paymentData.paymentType === 'gcash' ? 'gcash' : 'paymaya',
          billing: {
            name: paymentData.cardName || '',
            email: paymentData.email || '',
            phone: paymentData.phoneNumber || ''
          }
        })
        
        return paymentMethod.data
      }
    } catch (error) {
      console.error('Error creating payment method:', error)
      throw error
    }
  }

  static async attachPaymentMethodToIntent(paymentIntentId: string, paymentMethodId: string): Promise<any> {
    try {
      const attachment = await paymongo.paymentIntents.attach(
        paymentIntentId,
        { payment_method: paymentMethodId }
      )
      
      return attachment.data
    } catch (error) {
      console.error('Error attaching payment method:', error)
      throw error
    }
  }

  static async processPayment(amount: number, description: string, paymentData: PaymentData): Promise<PaymentResult> {
    try {
      console.log('Starting payment processing:', { amount, description, paymentType: paymentData.paymentType })
      
      // For development, use mock payment directly
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock payment for development')
        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        return {
          success: true,
          paymentId: 'mock_payment_' + Date.now()
        }
      }
      
      // Step 1: Create payment intent
      const paymentIntent = await this.createPaymentIntent(amount, description)
      
      // Step 2: Create payment method
      const paymentMethod = await this.createPaymentMethod(paymentData)
      
      // Step 3: Attach payment method to intent
      const result = await this.attachPaymentMethodToIntent(
        paymentIntent.id,
        paymentMethod.id
      )
      
      console.log('Payment processing result:', result)
      
      // Check if payment was successful
      if (result.attributes.status === 'succeeded') {
        return {
          success: true,
          paymentId: result.id
        }
      } else {
        return {
          success: false,
          error: `Payment failed with status: ${result.attributes.status}`
        }
      }
    } catch (error: any) {
      console.error('Payment processing error:', error)
      
      // For development, fall back to mock payment if PayMongo fails
      if (process.env.NODE_ENV === 'development') {
        console.log('PayMongo failed, using mock payment for development')
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        return {
          success: true,
          paymentId: 'mock_payment_' + Date.now()
        }
      }
      
      return {
        success: false,
        error: error.message || 'Payment processing failed'
      }
    }
  }

  static formatCardNumber(cardNumber: string): string {
    // Format card number with spaces for display
    const cleaned = cardNumber.replace(/\s/g, '')
    const chunks = cleaned.match(/.{1,4}/g) || []
    return chunks.join(' ')
  }

  static validateCardData(paymentData: PaymentData): { isValid: boolean; errors: Partial<PaymentData> } {
    const errors: Partial<PaymentData> = {}
    
    if (paymentData.paymentType === 'card') {
      // Card number validation (basic)
      if (!paymentData.cardNumber?.replace(/\s/g, '').match(/^\d{13,19}$/)) {
        errors.cardNumber = 'Invalid card number'
      }
      
      // Expiry date validation
      if (!paymentData.expiryDate?.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
        errors.expiryDate = 'Invalid expiry date (MM/YY)'
      }
      
      // CVV validation
      if (!paymentData.cvv?.match(/^\d{3,4}$/)) {
        errors.cvv = 'Invalid CVV'
      }
      
      // Name validation
      if (!paymentData.cardName?.trim()) {
        errors.cardName = 'Cardholder name is required'
      }
      
      // Address validation
      if (!paymentData.billingAddress?.trim()) {
        errors.billingAddress = 'Billing address is required'
      }
    } else {
      // E-wallet validation
      if (!paymentData.phoneNumber?.trim()) {
        errors.phoneNumber = 'Phone number is required for E-wallet payments'
      }
      
      if (!paymentData.email?.trim()) {
        errors.email = 'Email is required for E-wallet payments'
      }
      
      if (!paymentData.cardName?.trim()) {
        errors.cardName = 'Account holder name is required'
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }
}
