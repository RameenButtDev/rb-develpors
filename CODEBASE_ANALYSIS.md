# RB Developers - Comprehensive Codebase Analysis

## Analysis Date: 2026-06-16

---

## 1. ENVIRONMENT VARIABLE CONFIGURATION ISSUES

### Critical Issues:

#### 1.1 Conflicting MongoDB URI Variable Names
- **Issue**: Frontend and backend use different environment variable names
  - Frontend: `MONGODB_URI` ([lib/db.ts](lib/db.ts#L3))
  - Backend: `MONGO_URI` ([backend/.env.example](backend/.env.example#L2), [backend/config/db.js](backend/config/db.js#L4))
- **Impact**: MongoDB connection will fail for both if not properly configured
- **Files Affected**:
  - [lib/db.ts](lib/db.ts#L3) - Uses `process.env.MONGODB_URI`
  - [backend/.env.example](backend/.env.example#L2) - Defines `MONGO_URI`
  - [backend/config/db.js](backend/config/db.js#L4) - Uses `process.env.MONGO_URI`
- **Solution**: Standardize to one variable name across both frontend and backend

#### 1.2 JWT Expiration Variable Name Mismatch
- **Issue**: JWT expiration uses different names
  - Frontend: `JWT_EXPIRE` ([lib/auth.ts](lib/auth.ts#L5))
  - Backend: `JWT_EXPIRES_IN` ([backend/.env.example](backend/.env.example#L4), [backend/controllers/authController.js](backend/controllers/authController.js#L8))
- **Files Affected**:
  - [lib/auth.ts](lib/auth.ts#L5)
  - [backend/.env.example](backend/.env.example#L4)
  - [backend/controllers/authController.js](backend/controllers/authController.js#L8)

#### 1.3 Missing Frontend .env File
- **Issue**: No `.env` file exists in frontend root directory
- **Impact**: Frontend cannot connect to database or authenticate users
- **Files Affected**:
  - Only `.env.example` exists in backend ([backend/.env.example](backend/.env.example))
  - Frontend needs: `.env.local` with `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRE`

#### 1.4 Exposed Credentials in .env.example
- **Issue**: `.env.example` contains real MongoDB credentials and JWT secret
- **Files Affected**:
  - [backend/.env.example](backend/.env.example#L2) - Contains real MongoDB connection string
  - [backend/.env.example](backend/.env.example#L3) - Contains real JWT secret
- **Security Risk**: Should use placeholder values instead

#### 1.5 Missing environment variable validation
- **Issue**: Code throws errors but doesn't gracefully handle missing env vars in frontend
- **File**: [lib/db.ts](lib/db.ts#L4) throws error correctly, but frontend needs error boundary

---

## 2. API ENDPOINT DEFINITIONS AND CORRECTNESS

### Critical Issues:

#### 2.1 Backend Routes Not Mounted
- **Issue**: Inquiry and Property routes defined but not mounted in Express app
- **Files Affected**:
  - [backend/app.js](backend/app.js#L13-L31) - Only `/api/auth` is mounted
  - [backend/routes/inquiryRoutes.js](backend/routes/inquiryRoutes.js) - Defined but not used
  - **Missing**: Property routes not mounted anywhere
  - **Missing**: Property controller doesn't exist ([backend/controllers/](backend/controllers/))
- **Impact**: API calls to `/api/inquiries` and `/api/properties` from Next.js will work, but Express backend API would fail
- **Solution**: Mount routes in `backend/app.js`:
  ```javascript
  app.use('/api/inquiries', inquiryRoutes);
  app.use('/api/properties', propertyRoutes);
  ```

#### 2.2 Frontend/Backend API Endpoint Mismatch
- **Issue**: Frontend calls different auth endpoints than backend
  - Frontend expects: `/api/auth/login`, `/api/auth/signup` (Next.js routes)
  - Backend has: `/api/auth/signin`, `/api/auth/signup` (Express routes)
- **Files Affected**:
  - [app/login/LoginForm.tsx](app/login/LoginForm.tsx#L38) - Calls `/api/auth/login` (correct for Next.js)
  - [backend/routes/authRoutes.js](backend/routes/authRoutes.js#L13) - Has `/signin` not `/login`
- **Note**: Frontend uses separate Next.js API layer, so this isn't necessarily wrong but creates confusion

#### 2.3 Missing Property Controller
- **Issue**: Property routes handler doesn't exist
- **Files Affected**:
  - [backend/routes/inquiryRoutes.js](backend/routes/inquiryRoutes.js#L1) exists
  - **Missing**: `backend/routes/propertyRoutes.js`
  - **Missing**: `backend/controllers/propertyController.js`
- **Impact**: Backend cannot handle property CRUD operations

#### 2.4 Next.js API Routes Incomplete Validation
- **Issue**: POST endpoints don't validate enum values properly
- **Files Affected**:
  - [app/api/inquiries/route.ts](app/api/inquiries/route.ts#L45-L47) - Doesn't validate `inquiryType` enum
  - [app/api/inquiries/route.ts](app/api/inquiries/route.ts#L51) - Sets status to 'new' without validation
  - [app/api/properties/route.ts](app/api/properties/route.ts#L67) - No input validation for required fields

#### 2.5 Missing Inquiry Status Update Endpoint
- **Issue**: Frontend InquiriesTab updates status but no PATCH endpoint in initial design
- **Files Affected**:
  - [app/api/inquiries/[id]/route.ts](app/api/inquiries/[id]/route.ts#L46-L71) - PUT endpoint exists (good)
  - [backend/controllers/inquiryController.js](backend/controllers/inquiryController.js#L50) - Backend has status update

#### 2.6 Property Modal Doesn't Submit
- **Issue**: PropertyFormModal component has no actual API call
- **Files Affected**:
  - [app/admin/PropertyFormModal.tsx](app/admin/PropertyFormModal.tsx#L89) - `onSubmit` function shows success but doesn't call API
  - Should call `POST /api/properties` or `PUT /api/properties/[id]`

---

## 3. DATABASE MODEL DEFINITIONS

### Critical Issues:

#### 3.1 User Model Field Mismatch
- **Issue**: Backend and Frontend have different User model structures
- **Backend User Model** ([backend/models/User.js](backend/models/User.js)):
  - Fields: `fullName`, `email`, `password`, `role`, `profilePicture`, `contactNumber`
  - Role enum: `['Buyer', 'Agent', 'Admin']`
- **Frontend User Model** ([lib/models/User.ts](lib/models/User.ts)):
  - Fields: `name`, `email`, `password`, `role`
  - Role enum: `['admin', 'user']`
- **Files Affected**:
  - [backend/models/User.js](backend/models/User.js#L1-45)
  - [lib/models/User.ts](lib/models/User.ts#L1-60)
- **Impact**: Cannot share user data between frontend and backend APIs

#### 3.2 Inquiry Status Enum Mismatch
- **Issue**: Different status values across backend and frontend
- **Backend Inquiry Model** ([backend/models/Inquiry.js](backend/models/Inquiry.js#L30-33)):
  - Status: `['pending', 'reviewed', 'resolved']`
- **Frontend Inquiry Model** ([lib/models/Inquiry.ts](lib/models/Inquiry.ts#L43-46)):
  - Status: `['new', 'contacted', 'closed']`
- **Files Affected**:
  - [backend/models/Inquiry.js](backend/models/Inquiry.js#L30-33)
  - [lib/models/Inquiry.ts](lib/models/Inquiry.ts#L43-46)
  - [app/api/inquiries/[id]/route.ts](app/api/inquiries/[id]/route.ts#L56) - Validates against `['new', 'contacted', 'closed']`
- **Impact**: Inconsistent data validation and display

#### 3.3 Property Model Field Mismatch
- **Issue**: Backend Property model is too basic compared to frontend expectations
- **Backend Property Model** ([backend/models/Property.js](backend/models/Property.js)):
  - Missing: `specs`, `amenities`, `featured`, `propertyType`
  - Minimal fields
- **Frontend Property Model** ([lib/models/Property.ts](lib/models/Property.ts#L1-80)):
  - Complete fields: `specs`, `amenities`, `featured`, `propertyType`, `slug`
- **Files Affected**:
  - [backend/models/Property.js](backend/models/Property.js#L1-32)
  - [lib/models/Property.ts](lib/models/Property.ts#L1-80)
- **Impact**: Backend cannot store all required property information

#### 3.4 Missing Index on Inquiry.email
- **Issue**: No index on email field for quick queries
- **Files Affected**:
  - [backend/models/Inquiry.js](backend/models/Inquiry.js#L1-43) - Missing email index
  - [lib/models/Inquiry.ts](lib/models/Inquiry.ts#L1-60) - Missing email index
- **Impact**: Slow queries when searching inquiries by email

---

## 4. AUTHENTICATION FLOW AND JWT IMPLEMENTATION

### Critical Issues:

#### 4.1 JWT Payload Structure Mismatch
- **Issue**: Frontend and backend use different JWT payload structures
- **Backend JWT** ([backend/controllers/authController.js](backend/controllers/authController.js#L5)):
  - Payload: `{ id: userId }`
- **Frontend JWT** ([lib/auth.ts](lib/auth.ts#L8-11)):
  - Payload: `{ userId: string, email: string, role: 'admin' | 'user' }`
- **Files Affected**:
  - [backend/controllers/authController.js](backend/controllers/authController.js#L5)
  - [lib/auth.ts](lib/auth.ts#L8-11)
  - [app/api/auth/login/route.ts](app/api/auth/login/route.ts#L34-37)
  - [app/api/auth/signup/route.ts](app/api/auth/signup/route.ts#L47-50)
- **Impact**: JWT verification will fail if tokens from different sources are mixed

#### 4.2 Role Type Mismatch in JWT
- **Issue**: Backend uses different role values than frontend
- **Backend roles**: `'Buyer'`, `'Agent'`, `'Admin'` ([backend/models/User.js](backend/models/User.js#L23-26))
- **Frontend roles**: `'admin'`, `'user'` ([lib/models/User.ts](lib/models/User.ts#L25))
- **Files Affected**:
  - [backend/models/User.js](backend/models/User.js#L23-26)
  - [lib/models/User.ts](lib/models/User.ts#L25)
  - [app/api/auth/login/route.ts](app/api/auth/login/route.ts#L34-37)
- **Impact**: Admin role checks will fail: comparing `'admin'` vs `'Admin'`

#### 4.3 Frontend JWT Sign Uses Hardcoded Values
- **Issue**: Frontend JWT signing doesn't use environment variables correctly
- **File**: [lib/auth.ts](lib/auth.ts#L5)
  - `JWT_EXPIRE` set to `'7d'` if not provided, should error
  - Missing validation that secret exists at sign time
- **Impact**: May fail with confusing error messages in production

#### 4.4 Backend JWT Missing Expiration in Sign Function
- **Issue**: JWT created without explicit verification
- **Files Affected**:
  - [backend/controllers/authController.js](backend/controllers/authController.js#L5-8) - Creates token but minimal payload
  - [backend/middleware/authMiddleware.js](backend/middleware/authMiddleware.js#L16) - Verifies correctly

#### 4.5 Cookie Configuration Mismatch
- **Issue**: Frontend and backend set different cookie options
- **Backend** ([backend/controllers/authController.js](backend/controllers/authController.js#L13-18)):
  - Uses `process.env.COOKIE_SECURE === 'true'`
  - `sameSite: process.env.COOKIE_SAME_SITE || 'lax'`
- **Frontend** ([app/api/auth/login/route.ts](app/api/auth/login/route.ts#L56-61)):
  - Uses `process.env.NODE_ENV === 'production'` for secure flag
  - Hardcoded `sameSite: 'lax'`
- **Files Affected**:
  - [backend/controllers/authController.js](backend/controllers/authController.js#L13-18)
  - [app/api/auth/login/route.ts](app/api/auth/login/route.ts#L56-61)
  - [app/api/auth/signup/route.ts](app/api/auth/signup/route.ts#L62-67)
- **Impact**: Inconsistent session behavior between environments

#### 4.6 No Token Refresh Mechanism
- **Issue**: No refresh token implementation
- **Impact**: Sessions expire after 7 days with no way to extend
- **Files Affected**: All auth files

---

## 5. FORM VALIDATION AND ERROR HANDLING

### Critical Issues:

#### 5.1 Frontend Password Validation Too Loose
- **Issue**: Frontend requires 6 characters but backend requires 8
- **Frontend** ([app/login/LoginForm.tsx](app/login/LoginForm.tsx#L14)):
  - `z.string().min(6, 'Password must be at least 6 characters')`
- **Backend** ([backend/models/User.js](backend/models/User.js#L18)):
  - `minlength: [8, 'Password must be at least 8 characters']`
- **Files Affected**:
  - [app/login/LoginForm.tsx](app/login/LoginForm.tsx#L14)
  - [app/register/RegisterForm.tsx](app/register/RegisterForm.tsx#L14)
  - [backend/models/User.js](backend/models/User.js#L18)
- **Impact**: Frontend allows passwords that backend rejects

#### 5.2 InquiryForm Missing Enum Validation
- **Issue**: inquiryType values not validated properly in backend
- **File**: [app/api/inquiries/route.ts](app/api/inquiries/route.ts#L43-55)
  - No validation that `inquiryType` matches enum values
- **Frontend** ([components/forms/InquiryForm.tsx](components/forms/InquiryForm.tsx#L10)):
  - Correctly validates: `z.enum(['general', 'property', 'viewing'])`

#### 5.3 Incomplete Error Handling in Admin Components
- **Issue**: Admin API calls don't handle errors properly
- **Files Affected**:
  - [app/admin/PropertiesTab.tsx](app/admin/PropertiesTab.tsx#L63) - Delete shows toast but no API error handling
  - [app/admin/PropertyFormModal.tsx](app/admin/PropertyFormModal.tsx#L89) - No actual API call

#### 5.4 Backend Error Handler Doesn't Set Response Status Correctly
- **Issue**: Error response status logic is flawed
- **File**: [backend/middleware/errorMiddleware.js](backend/middleware/errorMiddleware.js#L8)
  ```javascript
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  ```
  - Should use default 500 if status is 200 or not set
- **Impact**: Some errors return 200 status code instead of proper error code

#### 5.5 Async Route Handlers Not Wrapped in Try-Catch Properly
- **Issue**: Backend middleware doesn't properly catch async errors
- **File**: [backend/middleware/asyncHandler.js](backend/middleware/asyncHandler.js#L1-3)
  - Implementation is correct, but not used in authRoutes or inquiryRoutes
  - Routes should wrap controller functions with asyncHandler

#### 5.6 InquiryForm Phone Validation Missing Regex
- **Issue**: Phone field accepts any string
- **File**: [components/forms/InquiryForm.tsx](components/forms/InquiryForm.tsx#L10)
  - Phone is optional but no format validation
- **Backend** ([backend/routes/inquiryRoutes.js](backend/routes/inquiryRoutes.js#L14)):
  - Also no phone validation

---

## 6. COMPONENT STRUCTURE AND POTENTIAL ISSUES

### Critical Issues:

#### 6.1 PropertyFormModal Has No Implementation
- **Issue**: Modal accepts properties but doesn't submit
- **File**: [app/admin/PropertyFormModal.tsx](app/admin/PropertyFormModal.tsx#L88-93)
  - `onSubmit` function shows success toast but doesn't call API
  - No actual POST or PUT request
- **Impact**: Admin cannot create or edit properties

#### 6.2 InquiriesTab Uses Sample Data
- **Issue**: Sample data hardcoded, no API integration
- **File**: [app/admin/InquiriesTab.tsx](app/admin/InquiriesTab.tsx#L14-60)
  - Uses `sampleInquiries` array instead of fetching from API
- **Impact**: No real inquiries displayed to admin

#### 6.3 PropertiesTab Uses Sample Data
- **Issue**: Sample data hardcoded, no real API integration
- **File**: [app/admin/PropertiesTab.tsx](app/admin/PropertiesTab.tsx#L27-56)
  - Uses `sampleProperties` array
  - Delete function doesn't call API

#### 6.4 PortfolioContent Uses Sample Data
- **Issue**: Portfolio page doesn't fetch real properties from API
- **File**: [app/portfolio/PortfolioContent.tsx](app/portfolio/PortfolioContent.tsx#L10-84)
  - Uses hardcoded `sampleProperties`
  - No useEffect to fetch from `/api/properties`

#### 6.5 AdminDashboardContent Missing Initial Data Load
- **Issue**: No useEffect to fetch inquiries and properties on load
- **File**: [app/admin/AdminDashboardContent.tsx](app/admin/AdminDashboardContent.tsx#L1-50)
  - No loading state management
  - Relies on child components to fetch data

#### 6.6 Missing Loading States
- **Issue**: No loading indicators while fetching data
- **Files Affected**:
  - [app/admin/PropertiesTab.tsx](app/admin/PropertiesTab.tsx#L30) - Has `isLoading` but never sets it
  - [app/admin/InquiriesTab.tsx](app/admin/InquiriesTab.tsx) - No loading state

#### 6.7 Image Optimization Missing
- **Issue**: Images in PropertyFormModal and PropertiesTab use regular `<img>` and `<Image>` without optimization
- **File**: [app/admin/PropertiesTab.tsx](app/admin/PropertiesTab.tsx#L106-111)
  - Image component missing `fill` or `width`/`height`
  - Needs priority prop for above-fold images

---

## 7. PACKAGE DEPENDENCIES AND VERSIONS

### Issues:

#### 7.1 Version Mismatch Between Frontend and Backend
- **Frontend package.json**: [package.json](package.json)
  - `mongoose@9.6.2` (very latest)
  - `bcryptjs@3.0.3` (very latest)
  - `jsonwebtoken@9.0.3` (correct)
- **Backend package.json**: [backend/package.json](backend/package.json)
  - `mongoose@^7.5.2` (locked older version)
  - `bcryptjs@^2.4.3` (different major version)
  - `jsonwebtoken@^9.0.3` (compatible)
- **Impact**: Different encryption/database behavior between frontend and backend

#### 7.2 Missing Dependencies
- **Frontend**: Missing `bcryptjs` in dependencies (uses only `jsonwebtoken`)
  - Used in: [lib/models/User.ts](lib/models/User.ts#L2)
  - But dependency not in [package.json](package.json)
- **Backend**: Missing `express-async-errors` package
  - Has asyncHandler but not using express-async-errors

#### 7.3 TypeScript Version Mismatch
- **Frontend**: `typescript@6.0.3` (beta/latest)
- **Backend**: No TypeScript (pure Node.js)
- **Impact**: Different type checking behavior

#### 7.4 Missing Dev Dependencies
- **Backend**: Missing `@types/node`, `@types/express`
- **Impact**: No type safety in backend code

---

## 8. TYPESCRIPT TYPE ERRORS OR MISMATCHES

### Critical Issues:

#### 8.1 User Data Type Mismatch in Login Response
- **Issue**: LoginForm expects different data structure than API returns
- **Frontend expects** ([app/login/LoginForm.tsx](app/login/LoginForm.tsx#L48-52)):
  ```typescript
  { id, name, email, role }
  ```
- **API returns** ([app/api/auth/login/route.ts](app/api/auth/login/route.ts#L48-52)):
  ```typescript
  { id, name, email, role }
  ```
- **Backend returns** ([backend/controllers/authController.js](backend/controllers/authController.js#L38-45)):
  - Different structure with `fullName` instead of `name`
- **Files Affected**:
  - [app/login/LoginForm.tsx](app/login/LoginForm.tsx#L48-52)
  - [app/api/auth/login/route.ts](app/api/auth/login/route.ts#L48-52)
  - [app/api/auth/signup/route.ts](app/api/auth/signup/route.ts#L60-65)

#### 8.2 Property Type Mismatch in Admin Components
- **Issue**: PropertiesTab and PropertyFormModal have different Property interface definitions
- **Files Affected**:
  - [app/admin/PropertiesTab.tsx](app/admin/PropertiesTab.tsx#L12-21) - Define interface locally
  - [app/admin/PropertyFormModal.tsx](app/admin/PropertyFormModal.tsx#L29-36) - Define interface locally
  - [lib/models/Property.ts](lib/models/Property.ts) - Defines correct interface
- **Solution**: Import from lib/models/Property.ts instead

#### 8.3 RouteParams Type Definition Mismatch
- **Issue**: RouteParams interface defined in multiple places
- **Files Affected**:
  - [app/api/properties/[id]/route.ts](app/api/properties/[id]/route.ts#L4-6) - Local definition
  - [app/api/inquiries/[id]/route.ts](app/api/inquiries/[id]/route.ts#L4-6) - Local definition
- **Solution**: Create shared type in lib/types or shared directory

#### 8.4 Inquiry Type Mismatch
- **Issue**: InquiryForm and InquiriesTab have different Inquiry interface definitions
- **Files Affected**:
  - [app/admin/InquiriesTab.tsx](app/admin/InquiriesTab.tsx#L8-17) - Local interface
  - [lib/models/Inquiry.ts](lib/models/Inquiry.ts#L3-14) - TypeScript interface

#### 8.5 Store Types Not Properly Exported
- **Issue**: useAuthStore types spread across multiple files
- **File**: [lib/store.ts](lib/store.ts#L1-40)
  - User interface defined inline in Zustand store
  - Should be exported as separate type
- **Impact**: Hard to import User type in other components

#### 8.6 Missing Strict Null Checks
- **Issue**: Properties like `property` can be null/undefined but not properly typed
- **Files Affected**:
  - [app/api/inquiries/route.ts](app/api/inquiries/route.ts#L51) - `property: property || undefined`
  - [lib/models/Inquiry.ts](lib/models/Inquiry.ts#L17-19) - Optional property reference

---

## 9. ROUTING ISSUES OR 404 PATHS

### Issues:

#### 9.1 Missing Privacy Policy and Terms Pages
- **Issue**: Footer links to `/privacy` and `/terms` pages that don't exist
- **Files Affected**:
  - [components/layout/Footer.tsx](components/layout/Footer.tsx) - Links to non-existent pages
  - App structure shows no `/privacy` or `/terms` directory
  - Missing: `app/privacy/page.tsx`, `app/terms/page.tsx`

#### 9.2 Portfolio Dynamic Route May 404
- **Issue**: Portfolio [slug] route expects data to exist
- **File**: [app/portfolio/[slug]/page.tsx](app/portfolio/[slug]/page.tsx)
  - No error handling if slug doesn't match any property
  - No generateStaticParams implementation for static generation

#### 9.3 Missing Redirects
- **Issue**: No redirects configured for backend API routes
- **Files Affected**:
  - Frontend API routes exist but no backend routes mounted
  - If both frontend and backend try to serve API, there's confusion

#### 9.4 Backend API Routes Not Accessible
- **Issue**: Backend Express server not integrated with Next.js routing
- **Files Affected**:
  - Backend runs on separate port (5000 by default)
  - Frontend calls `/api/*` which routes to Next.js, not Express
  - This is actually correct design but can cause confusion

---

## 10. CORS CONFIGURATION

### Critical Issues:

#### 10.1 Overly Permissive CORS Policy
- **Issue**: Backend CORS allows any origin
- **File**: [backend/app.js](backend/app.js#L15)
  ```javascript
  app.use(cors({ origin: true, credentials: true }));
  ```
- **Security Risk**: `origin: true` allows requests from ANY origin
- **Solution**: Should specify allowed origins:
  ```javascript
  app.use(cors({ 
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true 
  }));
  ```

#### 10.2 No CORS Configuration for Frontend API
- **Issue**: Frontend Next.js API routes have no CORS headers
- **Files Affected**:
  - [app/api/auth/login/route.ts](app/api/auth/login/route.ts)
  - [app/api/auth/signup/route.ts](app/api/auth/signup/route.ts)
  - [app/api/inquiries/route.ts](app/api/inquiries/route.ts)
  - [app/api/properties/route.ts](app/api/properties/route.ts)
- **Impact**: External API calls will fail without proper CORS headers

#### 10.3 Missing CORS Origin Validation on Backend
- **Issue**: No environment variable for CORS origins
- **File**: [backend/.env.example](backend/.env.example)
  - Missing `CORS_ORIGINS` variable
- **Impact**: Can't configure different origins for different environments

#### 10.4 Backend Rate Limiter Not Applying CORS Headers
- **Issue**: Rate limiter responses don't include CORS headers
- **File**: [backend/middleware/rateLimiter.js](backend/middleware/rateLimiter.js)
  - No CORS headers in rate limit response

---

## 11. ADDITIONAL SECURITY ISSUES

### Issues:

#### 11.1 No HTTPS Enforcement in Backend
- **File**: [backend/controllers/authController.js](backend/controllers/authController.js#L13)
  - Uses `process.env.COOKIE_SECURE === 'true'` but no validation it's set
  - Should always be true in production

#### 11.2 No Request Size Limits
- **Issue**: Express app has no request size limits
- **File**: [backend/app.js](backend/app.js#L14-16)
  - `app.use(express.json())` - no size limit
  - Could allow large payloads

#### 11.3 No Rate Limiting on Non-Auth Routes
- **File**: [backend/app.js](backend/app.js#L21)
  - Only auth routes have rate limiting
  - Should apply to `/api/inquiries` POST as well

#### 11.4 Password Sent in Clear Text Over HTTP During Development
- **Issue**: In development, cookies not secure
- **File**: [backend/controllers/authController.js](backend/controllers/authController.js#L13)
- **Mitigation**: Document requirement to use HTTPS in production

---

## SUMMARY OF CRITICAL ISSUES

### Must Fix (Blocking):
1. **Environment variable naming conflicts** - MONGO_URI vs MONGODB_URI, JWT_EXPIRE vs JWT_EXPIRES_IN
2. **Backend API routes not mounted** - Inquiry and Property routes not accessible
3. **User model mismatch** - fullName vs name, different role enums
4. **Inquiry status mismatch** - Different enum values between backend/frontend
5. **PropertyFormModal not implemented** - No API submission
6. **Password validation mismatch** - Frontend allows 6 chars, backend requires 8

### Should Fix (High Priority):
1. **Role type mismatch** - 'admin' vs 'Admin' comparison failures
2. **JWT payload structure differs** - Backend vs Frontend inconsistency
3. **Admin components use sample data** - No real API integration
4. **Property model too basic in backend** - Missing specs, amenities, etc.
5. **CORS configuration too permissive** - Security risk

### Nice to Have (Medium Priority):
1. **Missing privacy/terms pages**
2. **No loading states in components**
3. **Missing error boundaries**
4. **No refresh token mechanism**
5. **TypeScript types scattered across files**

---

## FILE STRUCTURE SUMMARY

```
✅ Working:
- Frontend API routes (Next.js)
- Frontend form validation with Zod
- Frontend authentication flow
- Database connection logic

❌ Not Working/Incomplete:
- Backend route mounting
- Admin dashboard API integration
- Property CRUD operations
- Environment variable consistency
- Admin form submissions
```

