# 🚀 Supabase Database Setup - Step by Step

## 🔍 **Current Issue: Tours Not Saving to Database**

Your tours are saving to fallback storage instead of Supabase because the database table doesn't exist yet.

## 📋 **Step-by-Step Fix**

### **Step 1: Check Your Connection**
Visit: `http://localhost:3000/api/check-supabase`
- This will tell you exactly what's missing
- Look for the "fix" instructions in the response

### **Step 2: Get Your Supabase Credentials**
1. Go to your Supabase project dashboard
2. Navigate to **Project Settings** → **API**
3. Copy these values:
   - **Project URL** (looks like: https://xxx.supabase.co)
   - **anon public** key (starts with: eyJhbGciOiJIUzI...)

### **Step 3: Update Environment Variables**
Create/update your `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Step 4: Create Database Table**
1. Go to your Supabase project
2. Navigate to **SQL Editor**
3. Click **New query**
4. Copy the entire content of `supabase/create-tours-table.sql`
5. Paste and click **Run**

### **Step 5: Restart Your Server**
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### **Step 6: Test the Connection**
Visit: `http://localhost:3000/api/check-supabase` again
- Should show: `"success": true`
- If not, check the error message

### **Step 7: Test Tour Creation**
1. Go to: `http://localhost:3000/admin/tours`
2. Click "Add New Tour"
3. Fill in the form
4. Click "Create Tour"
5. **Should save to Supabase now!**

## 🔧 **Quick Troubleshooting**

### **If you see "Missing Supabase environment variables":**
- Your `.env.local` file is missing or incorrect
- Follow Step 2 & 3 above

### **If you see "Cannot connect to tours table":**
- Database table doesn't exist
- Follow Step 4 above

### **If you see "Supabase connection failed":**
- Wrong URL or key in `.env.local`
- Check your credentials in Step 2

## 🎯 **Verify It's Working**

After setup, you should see:

1. ✅ **Test Connection**: `http://localhost:3000/api/check-supabase` shows success
2. ✅ **Admin Panel**: Tours appear in the table after creation
3. ✅ **Database**: Check Supabase Table Editor → tours table
4. ✅ **Frontend**: New tours appear on `/tours` page

## 🚨 **Common Mistakes**

### **❌ Wrong Environment File**
- Use `.env.local` (not `.env`)
- Make sure it's in the project root

### **❌ Wrong URL Format**
- ❌ `your-project.supabase.co`
- ✅ `https://your-project.supabase.co`

### **❌ SQL Script Issues**
- Make sure you run the ENTIRE script
- Check for any error messages in SQL Editor

### **❌ Not Restarting Server**
- Environment variables need server restart
- Stop with Ctrl+C, then `npm run dev`

## 🎉 **Success Indicators**

When it's working, you'll see:
- 🟢 Green success messages in admin panel
- 🟊 Tours appear immediately in the table
- 🗄️ Data visible in Supabase Table Editor
- 🔄 Real-time updates across all pages

## 🆘 **Still Not Working?**

1. Check browser console (F12) for errors
2. Visit `http://localhost:3000/api/check-supabase` for diagnostics
3. Verify each step above was completed correctly
4. Make sure your Supabase project is active

**The system is designed to work - just need to complete the setup!** 🚀
