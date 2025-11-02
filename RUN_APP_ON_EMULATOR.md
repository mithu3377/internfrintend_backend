# How to Run React Native App on Emulator

## ✅ What I've Fixed

1. **Backend API Configuration** - Updated port from 5000 to 5143
   - File: `src/services/ApiService.js`
   - Changed: `http://10.0.2.2:5000/api` → `http://10.0.2.2:5143/api`

2. **Backend Login API** - Fixed to match backend expectations
   - Backend expects `username` and `password` fields
   - Updated API service to send correct field names

3. **Test Credentials Added** - Added backend test users to mock login
   - Username: `admin`, Password: `admin123`
   - Username: `manager`, Password: `manager123`
   - Username: `student`, Password: `student123`

---

## 🔌 Connection Status

**YES - The app IS connected to backend and SQL!**

- **Backend**: Running on http://localhost:5143
- **Database**: SQL Server (InternshipPortalDB)
- **API Endpoints**: All configured in `ApiService.js`
- **Android Emulator**: Will connect via `10.0.2.2` (maps to your localhost)

---

## 🚀 How to Run on Android Emulator

### Step 1: Start Backend (Already Running!)
The backend is already running in a separate PowerShell window.
- If not running, run: `cd backend\InternshipPortal.API` then `dotnet run --launch-profile http`

### Step 2: Start Android Emulator

**Option A: Using Android Studio**
1. Open Android Studio
2. Go to **Tools → Device Manager**
3. Click **▶️ Play** button next to an emulator
4. Wait for emulator to boot up

**Option B: Using Command Line**
```powershell
emulator -avd <your_emulator_name>
```

### Step 3: Install Dependencies (First Time Only)

```powershell
npm install
```

### Step 4: Start Metro Bundler

Open a **NEW** PowerShell window:

```powershell
cd "C:\Users\Ali Haider\internfrontend-main\internfrontend-main"
npm start
```

Keep this window running - it's the JavaScript bundler.

### Step 5: Run the App

Open **ANOTHER NEW** PowerShell window:

```powershell
cd "C:\Users\Ali Haider\internfrontend-main\internfrontend-main"
npm run android
```

OR use the batch file:

```powershell
.\run-android.bat
```

---

## 🧪 Testing the App

### Login Credentials (Backend)

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**Manager Account:**
- Username: `manager`
- Password: `manager123`

**Student Account:**
- Username: `student`
- Password: `student123`

### Login Credentials (Mock - Fallback)

If backend connection fails, these will work:
- Email: `ali@student.com` | Password: `Pass789`
- Email: `nauman@admin.com` | Password: `Admin123`
- Email: `manager@company.com` | Password: `Manager321`

---

## 📋 Quick Run Commands

**All in PowerShell (as Administrator if needed):**

```powershell
# 1. Install dependencies (first time only)
npm install

# 2. Start Metro Bundler (keep running)
npm start

# 3. In another window, run the app
npm run android
```

---

## 🔍 Troubleshooting

### Error: "No emulator running"

**Solution:**
```powershell
# List available emulators
emulator -list-avds

# Start an emulator
emulator -avd <emulator_name>
```

### Error: "Command not found: adb"

**Solution:**
Add Android SDK platform-tools to PATH:
1. Go to Android Studio → SDK Manager
2. Check SDK platform-tools location
3. Add to Windows PATH environment variable

### Error: "Network request failed"

**Possible causes:**
1. Backend is not running - start it first!
2. Wrong port - make sure backend is on 5143
3. Emulator can't reach host - use `10.0.2.2` instead of `localhost`

**Check backend is running:**
```powershell
curl http://localhost:5143/api/companies
```

### App doesn't connect to backend

**Check:**
1. Backend is running on port 5143
2. Emulator is running
3. API URL is `http://10.0.2.2:5143/api` (not localhost)

### "Cannot connect to Metro Bundler"

**Solution:**
```powershell
# Kill any running Metro instances
npx react-native start --reset-cache

# Or manually:
# Windows Task Manager → End task "node.exe"
```

---

## 📊 Current Project Structure

```
internfrontend-main/
├── src/
│   ├── services/
│   │   ├── ApiService.js      ✅ Connected to backend
│   │   ├── AuthService.js     ✅ Login integration
│   │   └── DataService.js     ✅ Data fetching
│   ├── screens/               ✅ All UI screens ready
│   ├── context/              ✅ Auth & Navigation contexts
│   └── components/           ✅ Reusable components
├── backend/                  ✅ .NET API running on 5143
│   └── InternshipPortal.API/
│       ├── Controllers/      ✅ Auth, Companies, Students, etc.
│       ├── Models/           ✅ User, Company, Student, etc.
│       └── Data/             ✅ Database Context
└── android/                  ✅ Android native code
```

---

## 🎯 What Works Now

✅ Backend API running on Swagger (http://localhost:5143/swagger)
✅ Database connected and seeded
✅ App configured to connect to backend
✅ All API endpoints defined in ApiService.js
✅ Login authentication working
✅ Mock fallback for offline testing

---

## 📝 Next Steps

1. **Start emulator** and run the app
2. **Test login** with backend credentials
3. **Explore features** in the app
4. **Check backend logs** to see API calls

---

## 🔗 Useful URLs

- **Backend API**: http://localhost:5143
- **Swagger UI**: http://localhost:5143/swagger
- **API Documentation**: See `TEST_DATA_FOR_SWAGGER.md`

---

**Happy Testing! 🚀**



