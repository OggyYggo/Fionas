import express from 'express';
import type { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// __dirname replacement for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
const PORT = process.env.PORT || 3000;

// ========== Middleware ==========
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Serve static files from public folder (one level up from dist)
app.use(express.static(path.join(__dirname, '../public')));

// ========== Data Storage (In-memory for demo) ==========
interface BookingData {
    bookingId: string;
    fullname: string;
    email: string;
    phone: string;
    spot: string;
    date: string;
    guests: number;
    packageType: string;
    notes: string;
    bookingDate: string;
    status: string;
}

const bookings: BookingData[] = [];

// Generate unique booking ID
function generateBookingId(): string {
    return 'BOH-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// ========== API Routes ==========

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', message: 'Bohol Travel Agency server is running' });
});

// Booking endpoint
app.post('/api/book', (req: Request, res: Response) => {
    try {
        const { fullname, email, phone, spot, date, guests, packageType, notes } = req.body;

        // Validate required fields
        if (!fullname || !email || !phone || !spot || !date || !guests || !packageType) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Generate booking ID
        const bookingId = generateBookingId();

        // Create booking object
        const newBooking: BookingData = {
            bookingId,
            fullname,
            email,
            phone,
            spot,
            date,
            guests: parseInt(guests),
            packageType,
            notes: notes || '',
            bookingDate: new Date().toISOString(),
            status: 'Pending'
        };

        // Store booking (in production, save to database)
        bookings.push(newBooking);

        // Log booking to file
        logBooking(newBooking);

        // Send confirmation email (simulate)
        sendConfirmationEmail(newBooking);

        console.log('\n✅ New Booking Received:');
        console.log(`   Booking ID: ${bookingId}`);
        console.log(`   Customer: ${fullname}`);
        console.log(`   Destination: ${spot}`);
        console.log(`   Date: ${date}`);
        console.log(`   Guests: ${guests}`);
        console.log('');

        res.status(200).json({
            success: true,
            message: 'Booking submitted successfully!',
            bookingId: bookingId,
            booking: newBooking
        });

    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while processing booking'
        });
    }
});

// Get all bookings (admin endpoint)
app.get('/api/bookings', (req: Request, res: Response) => {
    res.json({
        success: true,
        totalBookings: bookings.length,
        bookings: bookings
    });
});

// Get booking by ID
app.get('/api/bookings/:bookingId', (req: Request, res: Response) => {
    const booking = bookings.find(b => b.bookingId === req.params.bookingId);
    
    if (!booking) {
        return res.status(404).json({
            success: false,
            message: 'Booking not found'
        });
    }

    res.json({
        success: true,
        booking: booking
    });
});

// Get tourist spots
app.get('/api/spots', (req: Request, res: Response) => {
    const spots = [
        {
            id: 1,
            name: 'Chocolate Hills',
            price: 1500,
            description: 'Over 1,200 dome-shaped hills',
            image: 'https://images.unsplash.com/photo-1599580676039-c9a3e1e6d0a2'
        },
        {
            id: 2,
            name: 'Panglao Island',
            price: 2000,
            description: 'Beautiful beaches and water activities',
            image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19'
        },
        {
            id: 3,
            name: 'Tarsier Sanctuary',
            price: 1200,
            description: 'Home to rare Philippine tarsiers',
            image: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5'
        },
        {
            id: 4,
            name: 'Bol-Anon Falls',
            price: 800,
            description: 'Scenic waterfall with natural pool',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'
        },
        {
            id: 5,
            name: 'Hinagdanan Cave',
            price: 1300,
            description: 'Underground cave exploration',
            image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800'
        },
        {
            id: 6,
            name: 'Baclayon Church',
            price: 600,
            description: 'Historic baroque church from 1727',
            image: 'https://images.unsplash.com/photo-1535624066051-41fc524b9541'
        }
    ];

    res.json({
        success: true,
        spots: spots
    });
});

// Serve index.html for root path
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ========== Helper Functions ==========

// Log booking to file
function logBooking(booking: BookingData): void {
    const logDir = path.join(__dirname, '../logs');
    
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }

    const logFile = path.join(logDir, 'bookings.json');
    let existingData: BookingData[] = [];

    try {
        if (fs.existsSync(logFile)) {
            const data = fs.readFileSync(logFile, 'utf-8');
            existingData = JSON.parse(data);
        }
    } catch (error) {
        console.error('Error reading existing bookings:', error);
    }

    existingData.push(booking);

    try {
        fs.writeFileSync(logFile, JSON.stringify(existingData, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing booking log:', error);
    }
}

// Simulate sending confirmation email
function sendConfirmationEmail(booking: BookingData): void {
    console.log(`📧 Confirmation email sent to: ${booking.email}`);
    console.log(`   Subject: Booking Confirmation - ${booking.bookingId}`);
    console.log(`   Message: Thank you for booking with Bohol Travel Agency!`);
}

// ========== Error Handling ==========
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Handle 404
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// ========== Server Startup ==========
app.listen(PORT, () => {
    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║  🌴 Bohol Travel Agency Server Running   ║');
    console.log('╠════════════════════════════════════════════╣');
    console.log(`║  Server: http://localhost:${PORT}`);
    console.log('║  Status: Ready to accept bookings ✅');
    console.log('║  API: http://localhost:' + PORT + '/api/book');
    console.log('╚════════════════════════════════════════════╝\n');
});

export default app;
