# Complete Backend and React Native Integration Guide

## Backend Setup and Publishing with Visual Studio

### 1. Database Setup

#### Option A: SQL Server LocalDB (Recommended for Development)
1. Install SQL Server LocalDB if not already installed
2. The connection string in `appsettings.json` is already configured:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=InternshipPortalDB;Trusted_Connection=true;MultipleActiveResultSets=true"
   }
   ```

#### Option B: SQL Server Express/Full SQL Server
1. Install SQL Server Express or Full SQL Server
2. Update connection string in `appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=InternshipPortalDB;Trusted_Connection=true;MultipleActiveResultSets=true"
   }
   ```

#### Option C: Azure SQL Database (For Production)
1. Create Azure SQL Database
2. Update connection string:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=tcp:your-server.database.windows.net,1433;Initial Catalog=InternshipPortalDB;Persist Security Info=False;User ID=your-username;Password=your-password;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
   }
   ```

### 2. Visual Studio Setup

1. **Open the Project**
   - Open Visual Studio 2022 or later
   - Open the solution file: `backend/InternshipPortal.API/InternshipPortal.API.csproj`

2. **Restore NuGet Packages**
   - Right-click on the project in Solution Explorer
   - Select "Restore NuGet Packages"

3. **Build the Project**
   - Press `Ctrl+Shift+B` or go to Build → Build Solution
   - Ensure there are no build errors

### 3. Database Migration (Entity Framework)

1. **Open Package Manager Console**
   - Go to Tools → NuGet Package Manager → Package Manager Console

2. **Run Migration Commands**
   ```powershell
   # Add initial migration
   Add-Migration InitialCreate
   
   # Update database
   Update-Database
   ```

3. **Verify Database Creation**
   - Check SQL Server Management Studio or Visual Studio Server Explorer
   - Database `InternshipPortalDB` should be created with all tables

### 4. Running the API Locally

1. **Set Startup Project**
   - Right-click on `InternshipPortal.API` project
   - Select "Set as Startup Project"

2. **Run the Application**
   - Press `F5` or click the "Start" button
   - The API will start on `https://localhost:7000` (or similar port)
   - Swagger UI will be available at `https://localhost:7000/swagger`

3. **Test the API**
   - Use Swagger UI to test endpoints
   - Default admin credentials:
     - Email: `admin@internshipportal.com`
     - Password: `admin123`

### 5. Publishing to Azure App Service

#### Step 1: Create Azure App Service
1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "App Service"
4. Click "Create"
5. Fill in the details:
   - **Resource Group**: Create new or select existing
   - **Name**: `internship-portal-api` (must be unique)
   - **Runtime Stack**: `.NET 8`
   - **Operating System**: Windows
   - **Region**: Choose closest to your users
6. Click "Review + Create" then "Create"

#### Step 2: Configure Database
1. **Create Azure SQL Database**:
   - Go to Azure Portal
   - Create new SQL Database
   - Configure firewall rules to allow Azure services
   - Note the connection string

2. **Update App Settings**:
   - Go to your App Service
   - Navigate to "Configuration" → "Application settings"
   - Add/Update:
     ```
     ConnectionStrings__DefaultConnection = [Your Azure SQL Connection String]
     JwtSettings__SecretKey = [Your Secret Key]
     JwtSettings__Issuer = InternshipPortalAPI
     JwtSettings__Audience = InternshipPortalClient
     ```

#### Step 3: Publish from Visual Studio
1. **Right-click on the project**
   - Select "Publish"

2. **Choose Target**
   - Select "Azure"
   - Select "Azure App Service (Windows)"
   - Choose your subscription and App Service

3. **Configure Publish Settings**
   - **Configuration**: Release
   - **Target Framework**: net8.0
   - **Deployment Mode**: Framework-dependent
   - **Target Runtime**: win-x64

4. **Publish**
   - Click "Publish"
   - Wait for deployment to complete

#### Step 4: Configure CORS for Production
1. **Update Program.cs** for production CORS:
   ```csharp
   builder.Services.AddCors(options =>
   {
       options.AddPolicy("AllowReactNative", policy =>
       {
           policy.WithOrigins("https://your-react-native-app.com")
                 .AllowAnyMethod()
                 .AllowAnyHeader();
       });
   });
   ```

### 6. Publishing to IIS (On-Premises)

#### Step 1: Install IIS and ASP.NET Core Hosting Bundle
1. Install IIS with required features
2. Download and install [ASP.NET Core Hosting Bundle](https://dotnet.microsoft.com/download/dotnet/8.0)

#### Step 2: Create IIS Application
1. Open IIS Manager
2. Create new Application Pool:
   - Name: `InternshipPortalAPI`
   - .NET CLR Version: No Managed Code
   - Process Model Identity: ApplicationPoolIdentity

3. Create new Site:
   - Site Name: `InternshipPortalAPI`
   - Physical Path: Point to your published folder
   - Port: 80 (or your preferred port)

#### Step 3: Publish from Visual Studio
1. Right-click project → Publish
2. Choose "Folder"
3. Set target folder (e.g., `C:\inetpub\wwwroot\InternshipPortalAPI`)
4. Configuration: Release
5. Click Publish

### 7. Environment Configuration

#### Development (appsettings.Development.json)
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=InternshipPortalDB_Dev;Trusted_Connection=true;MultipleActiveResultSets=true"
  }
}
```

#### Production (appsettings.Production.json)
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "[Production Connection String]"
  }
}
```

## React Native Integration

### 1. Install Required Dependencies

```bash
npm install @react-native-async-storage/async-storage
npm install react-native-fetch-blob
# For iOS
cd ios && pod install
```

### 2. Update API Service Configuration

Update the `API_BASE_URL` in `src/services/ApiService.js`:

```javascript
// For local development
const API_BASE_URL = 'https://localhost:7000/api';

// For production
const API_BASE_URL = 'https://your-api-url.azurewebsites.net/api';
```

### 3. Update AuthContext

Replace your existing AuthContext with this enhanced version:

```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/AuthService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const isAuthenticated = await authService.initialize();
      if (isAuthenticated) {
        setUser(authService.getCurrentUser());
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const result = await authService.login(email, password);
      if (result.success) {
        setUser(result.user);
        return { success: true };
      }
      return { success: false, message: result.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const result = await authService.register(userData);
      if (result.success) {
        setUser(result.user);
        return { success: true };
      }
      return { success: false, message: result.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: authService.isAuthenticated(),
    isAdmin: authService.isAdmin(),
    isStudent: authService.isStudent(),
    isManager: authService.isManager(),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 4. Example Usage in Components

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import apiService from '../services/ApiService';
import { useAuth } from '../context/AuthContext';

const CompaniesScreen = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCompanies();
      setCompanies(data);
    } catch (error) {
      console.error('Failed to load companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCompany = async (companyData) => {
    try {
      const newCompany = await apiService.createCompany(companyData);
      setCompanies([...companies, newCompany]);
    } catch (error) {
      console.error('Failed to create company:', error);
    }
  };

  return (
    <View>
      <FlatList
        data={companies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Text>{item.area}</Text>
            <Text>Max Internships: {item.maxInternships}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default CompaniesScreen;
```

### 5. Error Handling

Create a utility for consistent error handling:

```javascript
// src/utils/errorHandler.js
export const handleApiError = (error) => {
  if (error.message.includes('401')) {
    return 'Unauthorized. Please login again.';
  } else if (error.message.includes('403')) {
    return 'Access denied. You do not have permission.';
  } else if (error.message.includes('404')) {
    return 'Resource not found.';
  } else if (error.message.includes('500')) {
    return 'Server error. Please try again later.';
  } else {
    return error.message || 'An unexpected error occurred.';
  }
};
```

### 6. Testing the Integration

1. **Start the Backend API**
   - Run the API from Visual Studio
   - Note the URL (e.g., `https://localhost:7000`)

2. **Update React Native API URL**
   - Update `API_BASE_URL` in `ApiService.js`

3. **Test Authentication**
   - Try logging in with admin credentials
   - Verify token is stored and used in subsequent requests

4. **Test CRUD Operations**
   - Create, read, update, delete companies
   - Test student assignments
   - Generate certificates

### 7. Production Deployment Checklist

- [ ] Update API_BASE_URL to production URL
- [ ] Configure proper CORS settings
- [ ] Set up SSL certificates
- [ ] Configure database connection strings
- [ ] Set up logging and monitoring
- [ ] Configure backup strategies
- [ ] Set up CI/CD pipeline
- [ ] Test all endpoints thoroughly
- [ ] Configure rate limiting
- [ ] Set up health checks

This comprehensive guide provides everything needed to set up, publish, and integrate your internship portal backend with React Native frontend.





