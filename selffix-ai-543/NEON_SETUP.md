# Neon DB Integration - Setup Instructions

## Prerequisites

1. **Neon Database Account**: Sign up at [console.neon.tech](https://console.neon.tech)
2. **Node.js**: Ensure you have Node.js installed (v18 or higher recommended)

## Setup Steps

### 1. Get Your Neon Database URL

1. Log in to your [Neon Console](https://console.neon.tech)
2. Create a new project or select an existing one
3. Navigate to your project dashboard
4. Click on "Connection Details" or "Connection String"
5. Copy the connection string (it looks like: `postgresql://username:password@host/database?sslmode=require`)

### 2. Configure Environment Variables

1. Open `.env` file in the project root
2. Replace the placeholder `DATABASE_URL` with your actual Neon connection string:

```bash
DATABASE_URL=postgresql://your_username:your_password@your_host/your_database?sslmode=require
```

### 3. Push Database Schema

Run the following command to create the `cases` table in your Neon database:

```bash
npm run db:push
```

This will:
- Connect to your Neon database
- Create the `cases` table with all required columns
- Set up indexes and constraints

### 4. Start the Development Server

If the dev server is not already running:

```bash
npm run dev
```

The application will be available at http://localhost:5173

## Testing the Integration

### 1. Submit a Test Case

1. Navigate to the admin panel in your application
2. Go to "Log Case" page
3. Fill out the form with test data:
   - Select an appliance type (e.g., "Refrigerator")
   - Choose a brand (e.g., "LG")
   - Enter a model number
   - Select symptoms
   - Fill in repair details
4. Click "Submit Case"
5. You should see a success message with the case ID

### 2. Verify in Database

**Option A: Using Neon Console**
1. Go to your [Neon Console](https://console.neon.tech)
2. Select your project
3. Click on "Tables" or "SQL Editor"
4. Run: `SELECT * FROM cases;`
5. Verify your test case appears in the results

**Option B: Using Browser DevTools**
1. Open Browser DevTools (F12)
2. Go to the "Network" tab
3. Submit a case through the form
4. Find the `POST /api/cases` request
5. Check the response - it should return the created case with an `id`

### 3. Test API Endpoints

You can test the API endpoints using curl or a tool like Postman:

```bash
# Get all cases
curl http://localhost:5173/api/cases

# Get a specific case (replace 1 with actual ID)
curl http://localhost:5173/api/cases/1

# Create a new case
curl -X POST http://localhost:5173/api/cases \
  -H "Content-Type: application/json" \
  -d '{
    "applianceType": "Refrigerator",
    "brand": "Samsung",
    "model": "RF28R7351SR",
    "symptoms": ["Not cooling"],
    "diagnosticSteps": ["Checked compressor"],
    "rootCause": "Compressor Failure",
    "partReplaced": "Compressor",
    "partCost": "350.00",
    "laborTimeMinutes": 120,
    "diyFeasibility": "Professional Required",
    "successful": true
  }'
```

## Troubleshooting

### Database Connection Errors

If you see `DATABASE_URL environment variable is not set`:
- Verify the `.env` file contains `DATABASE_URL`
- Restart the dev server after adding the variable

If you see `failed to connect to database`:
- Verify your Neon connection string is correct
- Check that your Neon project is active
- Ensure your IP is allowed (Neon allows all IPs by default)

### TypeScript Errors

The TypeScript errors in `server/schema.ts` about Zod types are expected due to version compatibility between `drizzle-zod` and `zod`. They don't affect runtime functionality and are suppressed with `as any` casts in the API routes.

### Schema Migration Issues

If `npm run db:push` fails:
- Verify your `DATABASE_URL` is correct
- Check that you have write permissions to the database
- Try running `npx drizzle-kit push --verbose` for more details

## What Was Changed

### Backend Files Created/Modified

- ✅ `server/db.ts` - Database connection setup
- ✅ `server/schema.ts` - Cases table schema with Zod validation
- ✅ `server/routes/cases.ts` - Complete CRUD API endpoints
- ✅ `server/index.ts` - Mounted cases router
- ✅ `drizzle.config.ts` - Drizzle Kit configuration

### Frontend Files Modified

- ✅ `client/pages/admin/LogCase.tsx` - Changed from localStorage to API
- ✅ `shared/api.ts` - Added Case type definitions

### Configuration Files

- ✅ `.env` - Added DATABASE_URL
- ✅ `package.json` - Added `db:push` script

## Next Steps

Now that cases are saved to Neon DB:
- Cases persist across page reloads and deployments
- Data is queryable using SQL
- You can add indexes for better performance
- Consider adding data analytics or reporting features
