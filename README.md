# Bohol Travel Agency Website

A professional travel and tour agency website showcasing tourist spots in Bohol, Philippines with online booking functionality and full SEO optimization.

## 🌴 Features

### Showcase
- **6 Featured Tourist Attractions**: Chocolate Hills, Panglao Island, Tarsier Sanctuary, Bol-Anon Falls, Hinagdanan Cave, Baclayon Church
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Image Optimization**: High-quality tourist images with lazy loading
- **Beautiful UI**: Modern, professional design with smooth animations

### Booking System
- **Online Booking Form**: Easy-to-use booking interface
- **Real-time Validation**: Client and server-side validation
- **Multiple Packages**: Regular, Premium, and Deluxe tour options
- **Flexible Dates**: Book tours up to 1 year in advance
- **Group Bookings**: Support for 1-50 guests per booking
- **Special Requests**: Custom messages field for unique requirements

### SEO Optimization
- **Meta Tags**: Comprehensive meta descriptions and Open Graph tags
- **Schema Markup**: Structured data for tourist attractions and orders
- **Sitemap**: XML sitemap for search engine crawling
- **Robots.txt**: Proper crawling directives for search engines
- **Responsive Images**: Optimized images with alt text
- **Mobile Optimization**: Mobile-first design approach
- **Fast Loading**: Optimized CSS and JavaScript
- **Accessibility**: WCAG compliance standards

## 📋 SEO Implementation Checklist

✅ **On-Page SEO**
- Meta descriptions with target keywords
- Title tags with brand name
- H1-H6 header hierarchy
- Image alt text on all images
- Internal linking structure

✅ **Technical SEO**
- XML sitemap (sitemap.xml)
- Robots.txt configuration
- Canonical URLs
- Mobile-responsive design
- Fast page load times
- Schema markup (JSON-LD)

✅ **Off-Page SEO**
- Social media meta tags (OG tags)
- Twitter card integration
- Structured data ready for rich snippets

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Build TypeScript**
   ```bash
   npm run build
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
bohol-travel-agency/
├── index.html           # Main website (with SEO meta tags)
├── styles.css           # Responsive styling
├── app.ts               # Frontend interactivity
├── app.js              # Compiled JavaScript
├── server.ts           # Express backend
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── sitemap.xml         # SEO sitemap
├── robots.txt          # Search engine directives
└── README.md           # This file
```

## 🔧 Configuration

### Database (Currently In-Memory)
The current version stores bookings in memory. For production:

1. **Connect PostgreSQL/MySQL**:
   ```typescript
   // Edit server.ts to add database connection
   import { Pool } from 'pg';
   ```

2. **Add environment variables** (.env):
   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=password
   DB_NAME=bohol_travel
   ```

## 📊 API Endpoints

### Booking
- `POST /api/book` - Submit new booking
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:bookingId` - Get booking by ID

### Tourist Spots
- `GET /api/spots` - Get all available spots

### Health Check
- `GET /api/health` - Server status

## 💾 Booking Data Storage

Bookings are logged to `logs/bookings.json` for easy reference:

```json
{
  "bookingId": "BOH-1234567890-ABC123",
  "fullname": "John Doe",
  "email": "john@example.com",
  "phone": "+63 912 345 6789",
  "spot": "Chocolate Hills - ₱1,500",
  "date": "2026-03-15",
  "guests": 4,
  "packageType": "Premium",
  "notes": "Birthday celebration trip"
}
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Deploy to AWS/Google Cloud
Follow platform-specific deployment guides using Node.js.

## 📧 Email Integration (Future)

To enable booking confirmation emails:

1. Install email library:
   ```bash
   npm install nodemailer
   ```

2. Update `server.ts`:
   ```typescript
   import nodemailer from 'nodemailer';
   
   // Configure email service
   const transporter = nodemailer.createTransport({...});
   ```

## 📞 Contact Information

- **Email**: info@boholtravelagency.ph
- **Phone**: +63 (38) 501-9999
- **Address**: Tagbilaran City, Bohol, Philippines

## 🎯 SEO Keywords

Primary Keywords:
- Bohol tours
- Tourist spots in Bohol
- Bohol travel packages
- Book tours Bohol
- Chocolate Hills Bohol
- Panglao Island tours

Long-tail Keywords:
- Best tourist attractions in Bohol
- Where to go in Bohol Philippines
- Budget-friendly tours in Bohol
- Family-friendly activities Bohol
- Adventure tours Bohol

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📄 License

ISC License - Feel free to modify for your business

## 🤝 Support

For issues or feature requests, please contact support@boholtravelagency.ph

---

**Built with ❤️ for Bohol Travel & Tourism**
