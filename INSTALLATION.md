# Setup & Installation Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web server
- `body-parser` - Parse request bodies
- `typescript` - TypeScript compiler
- `@types/node` - TypeScript definitions for Node.js
- `@types/express` - TypeScript definitions for Express

### Step 2: Build TypeScript

```bash
npm run build
```

This compiles `app.ts` and `server.ts` to JavaScript.

### Step 3: Start the Server

```bash
npm start
```

The server will start at `http://localhost:3000`

### Step 4: Open in Browser

Visit: **http://localhost:3000**

---

## 📦 Project Setup Details

### Files Generated/Modified

```
✓ index.html         - Main website
✓ app.ts             - Frontend TypeScript
✓ app.js             - Compiled JavaScript
✓ server.ts          - Backend Express server
✓ styles.css         - Responsive styling
✓ package.json       - Dependencies & scripts
✓ tsconfig.json      - TypeScript config
✓ sitemap.xml        - SEO sitemap
✓ robots.txt         - Search engine directives
✓ manifest.json      - PWA configuration
✓ README.md          - Project documentation
✓ SEO-GUIDE.md       - SEO best practices
```

---

## 🎯 Features Included

### ✅ Tourist Spots Showcase
- 6 featured attractions with descriptions
- High-quality images
- Pricing information
- Key features/highlights

### ✅ Online Booking System
- Real-time form validation
- Multiple tour packages
- Date picker (future dates only)
- Group booking support (1-50 guests)
- Special requests field

### ✅ SEO Optimization
- Meta tags (title, description, keywords)
- Open Graph tags (social sharing)
- Schema markup (JSON-LD)
- XML sitemap
- Robots.txt
- Mobile-responsive design
- Image optimization
- Proper header hierarchy

### ✅ Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop layout
- Touch-friendly buttons
- Optimized for all screen sizes

### ✅ Backend API
- Booking endpoint: `POST /api/book`
- Tourist spots: `GET /api/spots`
- Booking retrieval: `GET /api/bookings`
- Health check: `GET /api/health`

---

## 🔧 Configuration

### Environment Variables (.env)

Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Then edit `.env`:

```env
PORT=3000
NODE_ENV=development
SEND_CONFIRMATION_EMAIL=false
```

### Database Setup (Optional)

Currently bookings are stored in-memory. For production:

1. **PostgreSQL Setup**:
   ```sql
   CREATE DATABASE bohol_travel;
   CREATE TABLE bookings (
       id SERIAL PRIMARY KEY,
       booking_id VARCHAR(100) UNIQUE,
       fullname VARCHAR(255),
       email VARCHAR(255),
       phone VARCHAR(20),
       spot VARCHAR(255),
       date DATE,
       guests INT,
       package_type VARCHAR(50),
       notes TEXT,
       booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       status VARCHAR(50)
   );
   ```

2. **Update server.ts** to use database instead of in-memory storage

---

## 📁 Project Structure

```
bohol-travel-agency/
├── index.html           # Main website with SEO meta tags
├── styles.css          # Responsive CSS styling
├── app.ts              # TypeScript frontend logic
├── app.js              # Compiled JavaScript
├── server.ts           # Express backend
├── package.json        # NPM configuration
├── tsconfig.json       # TypeScript configuration
├── sitemap.xml         # XML sitemap for SEO
├── robots.txt          # Search engine directives
├── manifest.json       # PWA configuration
├── .env.example        # Environment template
└── README.md           # Project documentation
```

---

## 🌐 API Endpoints

### Book a Tour
**POST** `/api/book`

Request:
```json
{
  "fullname": "John Doe",
  "email": "john@example.com",
  "phone": "+63 912 345 6789",
  "spot": "Chocolate Hills - ₱1,500",
  "date": "2026-03-15",
  "guests": 4,
  "packageType": "Premium",
  "notes": "Birthday celebration"
}
```

Response:
```json
{
  "success": true,
  "message": "Booking submitted successfully!",
  "bookingId": "BOH-1234567890-ABC123"
}
```

### Get Tourist Spots
**GET** `/api/spots`

Response:
```json
{
  "success": true,
  "spots": [
    {
      "id": 1,
      "name": "Chocolate Hills",
      "price": 1500,
      "description": "Over 1,200 dome-shaped hills"
    }
  ]
}
```

### Get All Bookings (Admin)
**GET** `/api/bookings`

Response:
```json
{
  "success": true,
  "totalBookings": 5,
  "bookings": [...]
}
```

---

## 🧪 Testing

### Test the Website

1. **Homepage loads**: ✓
2. **Navigation works**: ✓
3. **Booking form validates**: ✓
4. **Mobile responsive**: ✓
5. **Smooth scrolling**: ✓

### Manual Testing

1. Open browser DevTools (F12)
2. Go to Console tab
3. Test form submissions
4. Check Network tab for API calls

### Test API Endpoints

Using curl:
```bash
# Test health check
curl http://localhost:3000/api/health

# Test booking
curl -X POST http://localhost:3000/api/book \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "Test User",
    "email": "test@example.com",
    "phone": "+63 912 345 6789",
    "spot": "Chocolate Hills",
    "date": "2026-03-20",
    "guests": 2,
    "packageType": "Regular"
  }'
```

---

## 🚀 Deployment

### Deploy to Vercel

1. Push project to GitHub
2. Connect GitHub to Vercel
3. Vercel automatically detects Node.js project
4. Deploy!

```bash
npm install -g vercel
vercel
```

### Deploy to Heroku

```bash
heroku create your-app-name
git push heroku main
heroku logs --tail
```

### Deploy to AWS EC2

1. Launch EC2 instance (Node.js AMI)
2. SSH into instance
3. Clone repository
4. Install dependencies
5. Start server with PM2

```bash
npm install -g pm2
pm2 start server.js --name "bohol-travel"
```

### Custom Domain

Update `sitemap.xml` and `index.html`:
```html
<meta property="og:url" content="https://yourdomain.com">
```

Update `robots.txt`:
```
Sitemap: https://yourdomain.com/sitemap.xml
```

---

## 📊 Monitoring

### Server Logs

Check server output:
```
✅ New Booking Received:
   Booking ID: BOH-1234567890-ABC123
   Customer: John Doe
   Destination: Chocolate Hills
   Date: 2026-03-15
   Guests: 4
```

### View Stored Bookings

Bookings stored in: `logs/bookings.json`

```json
[
  {
    "bookingId": "BOH-1234567890-ABC123",
    "fullname": "John Doe",
    "email": "john@example.com",
    ...
  }
]
```

---

## 🔐 Security Considerations

### For Production

1. **Enable HTTPS**: Use SSL certificate
2. **Validate Input**: Add request validation middleware
3. **Rate Limiting**: Prevent spam bookings
4. **Database**: Use PostgreSQL instead of in-memory
5. **Environment Variables**: Keep secrets in .env
6. **CORS**: Configure allowed origins
7. **Email Verification**: Verify customer email
8. **Payment Processing**: Integrate payment gateway

### Add Rate Limiting

```bash
npm install express-rate-limit
```

---

## 🐛 Troubleshooting

### Issue: Port already in use

**Solution**:
```bash
# Change port in .env
PORT=3001

# Or kill process using port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000   # Windows
```

### Issue: Module not found

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Issue: TypeScript errors

**Solution**:
```bash
# Rebuild TypeScript
npm run build
```

### Issue: Form not submitting

**Solution**:
1. Open browser console (F12)
2. Check for JavaScript errors
3. Verify backend is running
4. Check Network tab for API response

---

## 📈 Next Steps

1. ✅ Website is ready
2. ⏭️ **Register Domain**: Get `.ph` domain
3. ⏭️ **Deploy**: Host on Vercel or AWS
4. ⏭️ **Add Database**: Connect PostgreSQL
5. ⏭️ **Email Service**: Setup confirmation emails
6. ⏭️ **Payment Gateway**: Integrate GCash/PayMaya
7. ⏭️ **Analytics**: Setup Google Analytics
8. ⏭️ **Marketing**: Promote on Google, Facebook

---

## 📞 Support

For technical issues:
- Check [Node.js docs](https://nodejs.org/docs/)
- Check [Express docs](https://expressjs.com/)
- Check [TypeScript docs](https://www.typescriptlang.org/)

---

**Last Updated**: February 27, 2026
**Estimated Read Time**: 10 minutes
