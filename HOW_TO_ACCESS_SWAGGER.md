# How to Access Swagger UI

## ✅ Swagger is Already Built Into Your Backend!

You don't need to download Swagger - it's already included in your .NET Core API!

## How to Access Swagger UI:

### Step 1: Make Sure Backend is Running

The backend API should be running. If not, run:
```bash
cd internfrontend-main/internfrontend-main/backend/InternshipPortal.API
dotnet run
```

### Step 2: Open Swagger in Chrome

Open Chrome browser and go to:

```
http://localhost:5000/swagger
```

**OR**

```
https://localhost:7000/swagger
```

### Step 3: You'll See the Swagger UI!

You'll see a nice web interface with all your API endpoints listed:

- ✅ Auth Controller
- ✅ Companies Controller
- ✅ Students Controller
- ✅ Assignments Controller
- ✅ Certificates Controller

## How to Test Endpoints in Swagger:

1. Click on any endpoint (e.g., `GET /api/companies`)
2. Click the blue **"Try it out"** button
3. Click the **"Execute"** button
4. See the response below!

## What You'll See:

### Example: Get All Companies
- Endpoint: `GET /api/companies`
- Response will show:
```json
[
  {
    "companyID": 1,
    "name": "Tech Solutions Inc",
    "area": "Web Development",
    "technologies": "React, Node.js, MongoDB",
    "maxInternships": 10,
    "currentInternships": 2,
    ...
  }
]
```

## ⚠️ Important Notes:

1. **First, create the database** by running `COMPLETE_SETUP.sql` in SSMS
2. **Then** the Swagger UI will show real data
3. If you see empty arrays `[]`, it means the database tables don't exist yet

## Quick Test in Chrome:

Just type this in Chrome address bar:
```
http://localhost:5000/swagger
```

That's it! No download needed! 🎉

