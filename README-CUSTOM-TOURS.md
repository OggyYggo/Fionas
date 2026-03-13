# Custom Tours Database Integration

This document explains the custom tours database setup and how to use it.

## Overview

The custom tours system now has its own dedicated database integration with Supabase, separate from the main bookings system. This allows for better management of custom tour requests and page data.

## Database Schema

### Tables Created

1. **`custom_tours_page_data`** - Stores page configuration and content
2. **`custom_tour_submissions`** - Stores custom tour form submissions

### Key Features

- **Separate from main bookings**: Custom tour submissions are stored separately for better management
- **Page data management**: Dynamic content management for the custom tours page
- **Status tracking**: Full workflow from pending to accepted/rejected
- **Analytics**: Built-in statistics and reporting
- **Row Level Security**: Proper data access controls

## API Endpoints

### Page Data Management
- `GET /api/custom-tours/page-data` - Get page configuration
- `PUT /api/custom-tours/page-data` - Update page configuration

### Submissions Management
- `GET /api/custom-tours/submissions` - Get all submissions (with filtering)
- `POST /api/custom-tours/submissions` - Create new submission
- `GET /api/custom-tours/submissions/[id]` - Get specific submission
- `PUT /api/custom-tours/submissions/[id]` - Update submission status

### Analytics
- `GET /api/custom-tours/stats` - Get submission statistics

## Database Setup

### 1. Run the Schema

Execute the SQL schema file in your Supabase project:

```sql
-- Run this in Supabase SQL Editor
-- File: supabase/custom-tours-schema.sql
```

### 2. Environment Variables

Make sure you have these in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Usage Examples

### Frontend - Custom Tours Form

The custom tours form now uses the dedicated `CustomToursService`:

```typescript
import { CustomToursService } from '@/lib/custom-tours-db'

// Submit a custom tour request
const result = await CustomToursService.saveFormSubmission({
  fullName: 'John Doe',
  email: 'john@example.com',
  phone: '+639123456789',
  destination: 'Panglao Island',
  startDate: '2024-06-15',
  adults: 2,
  children: 0,
  activities: ['island-hopping', 'diving'],
  budgetRange: 'premium',
  accommodation: 'luxury',
  transportation: 'private',
  agreement: true
})
```

### Admin Dashboard

Access the admin dashboard at `/admin/custom-tours` to:
- View all custom tour submissions
- Filter by status, email, or destination
- Update submission status
- View analytics and statistics

### Page Data Management

Update custom tours page content dynamically:

```typescript
import { CustomToursService } from '@/lib/custom-tours-db'

// Update page data
const result = await CustomToursService.savePageData({
  heroTitle: "Custom Title",
  heroSubtitle: "Custom subtitle",
  destinations: [
    { id: "new-dest", name: "New Destination", description: "Description", popular: true }
  ]
})
```

## Status Workflow

Custom tour submissions follow this workflow:

1. **pending** - New submission received
2. **reviewed** - Submission reviewed by staff
3. **contacted** - Customer contacted for details
4. **quoted** - Quote sent to customer
5. **accepted** - Customer accepted quote
6. **rejected** - Customer rejected or request cancelled

## Data Structure

### Custom Tour Submission

```typescript
interface CustomTourSubmission {
  id: string
  fullName: string
  email: string
  phone: string
  destination: string
  startDate: string
  endDate?: string
  adults: number
  children: number
  activities: string[]
  otherActivity?: string
  budgetRange: string
  accommodation: string
  transportation: string
  tourGuide?: string
  specialRequests?: string
  agreement: boolean
  status: 'pending' | 'reviewed' | 'contacted' | 'quoted' | 'accepted' | 'rejected'
  assignedTo?: string
  internalNotes?: string
  quoteAmount?: number
  quoteCurrency?: string
  followUpDate?: string
  submissionDate: string
  updatedAt: string
}
```

### Page Data

```typescript
interface PageData {
  heroTitle: string
  heroSubtitle: string
  heroBackgroundImage?: string
  features: Array<{
    title: string
    description: string
    icon?: string
  }>
  destinations: Array<{
    id: string
    name: string
    description: string
    popular?: boolean
  }>
  activities: Array<{
    id: string
    name: string
    description: string
    category: string
    popular?: boolean
  }>
  // ... more configuration options
}
```

## Security Features

- **Row Level Security**: Users can only access their own submissions
- **Admin Access**: Admin role required for full access
- **Input Validation**: Server-side validation for all inputs
- **Type Safety**: Full TypeScript support

## Benefits

1. **Separation of Concerns**: Custom tours data is isolated from main bookings
2. **Better Analytics**: Dedicated statistics for custom tours
3. **Workflow Management**: Full status tracking and management
4. **Dynamic Content**: Page content can be updated without code changes
5. **Scalability**: Designed to handle growth in custom tour requests

## Migration Notes

- Existing custom tour bookings in the main `bookings` table remain unchanged
- New submissions will go to the dedicated `custom_tour_submissions` table
- Both systems can run in parallel
- Consider migrating old data if needed

## Troubleshooting

### Common Issues

1. **Permission Denied**: Check RLS policies in Supabase
2. **Table Not Found**: Run the schema SQL file
3. **Environment Variables**: Verify Supabase credentials
4. **CORS Issues**: Check Supabase project settings

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
```

This will provide detailed console logs for troubleshooting.
