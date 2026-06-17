# RB Developers - Issues Quick Reference Checklist

## CRITICAL ISSUES (Blocking - Fix Immediately)

### 1. Environment Variables
- [ ] **MongoDB URI mismatch**: `MONGO_URI` (backend) vs `MONGODB_URI` (frontend)
  - Backend: [backend/.env.example](backend/.env.example#L2), [backend/config/db.js](backend/config/db.js#L4)
  - Frontend: [lib/db.ts](lib/db.ts#L3)

- [ ] **JWT Expiration name mismatch**: `JWT_EXPIRES_IN` (backend) vs `JWT_EXPIRE` (frontend)
  - Backend: [backend/.env.example](backend/.env.example#L4), [backend/controllers/authController.js](backend/controllers/authController.js#L8)
  - Frontend: [lib/auth.ts](lib/auth.ts#L5)

- [ ] **No .env file in frontend** - Create `.env.local` in root with required variables

- [ ] **Real credentials in .env.example** - Replace with placeholder values
  - File: [backend/.env.example](backend/.env.example)

### 2. Backend API Routes
- [ ] **Inquiry routes not mounted** in [backend/app.js](backend/app.js)
  - File exists: [backend/routes/inquiryRoutes.js](backend/routes/inquiryRoutes.js)
  - Not imported or mounted

- [ ] **Property routes missing entirely**
  - Missing: `backend/routes/propertyRoutes.js`
  - Missing: `backend/controllers/propertyController.js`

- [ ] **Missing property route mounting** in [backend/app.js](backend/app.js#L13-31)

### 3. Database Models
- [ ] **User model field mismatch**
  - Backend uses: `fullName`, `contactNumber`, `profilePicture` [backend/models/User.js](backend/models/User.js)
  - Frontend uses: `name` [lib/models/User.ts](lib/models/User.ts)
  - Role enum: Backend `['Buyer', 'Agent', 'Admin']` vs Frontend `['admin', 'user']`

- [ ] **Inquiry status enum mismatch**
  - Backend: `['pending', 'reviewed', 'resolved']` [backend/models/Inquiry.js](backend/models/Inquiry.js#L30-33)
  - Frontend: `['new', 'contacted', 'closed']` [lib/models/Inquiry.ts](lib/models/Inquiry.ts#L43-46)

- [ ] **Property model incomplete in backend**
  - Backend missing: `specs`, `amenities`, `featured`, `propertyType` [backend/models/Property.js](backend/models/Property.js)
  - Frontend expects all fields [lib/models/Property.ts](lib/models/Property.ts)

### 4. Authentication
- [ ] **JWT payload mismatch**
  - Backend: `{ id: userId }` [backend/controllers/authController.js](backend/controllers/authController.js#L5)
  - Frontend: `{ userId, email, role }` [lib/auth.ts](lib/auth.ts#L8-11)

- [ ] **Role type comparison will fail**
  - Comparing `'admin'` (frontend) vs `'Admin'` (backend) [app/admin/page.tsx](app/admin/page.tsx#L14)

- [ ] **Password requirements mismatch**
  - Frontend: min 6 chars [app/login/LoginForm.tsx](app/login/LoginForm.tsx#L14), [app/register/RegisterForm.tsx](app/register/RegisterForm.tsx#L14)
  - Backend: min 8 chars [backend/models/User.js](backend/models/User.js#L18)

### 5. Admin Components
- [ ] **PropertyFormModal not implemented**
  - File: [app/admin/PropertyFormModal.tsx](app/admin/PropertyFormModal.tsx#L88-93)
  - onSubmit() shows toast but doesn't call API

- [ ] **PropertiesTab uses hardcoded sample data**
  - File: [app/admin/PropertiesTab.tsx](app/admin/PropertiesTab.tsx#L27-56)
  - Should fetch from API instead

- [ ] **InquiriesTab uses hardcoded sample data**
  - File: [app/admin/InquiriesTab.tsx](app/admin/InquiriesTab.tsx#L14-60)
  - Should fetch from API instead

---

## HIGH PRIORITY ISSUES (Should Fix Soon)

### 6. API Validation
- [ ] **InquiryForm missing enum validation** on backend [app/api/inquiries/route.ts](app/api/inquiries/route.ts#L43-55)

- [ ] **Phone field no format validation** 
  - Frontend: [components/forms/InquiryForm.tsx](components/forms/InquiryForm.tsx#L10)
  - Backend: [backend/routes/inquiryRoutes.js](backend/routes/inquiryRoutes.js)

- [ ] **PropertyFormModal has no input validation** for required fields [app/api/properties/route.ts](app/api/properties/route.ts#L67)

### 7. Error Handling
- [ ] **Backend error handler status code bug**
  - File: [backend/middleware/errorMiddleware.js](backend/middleware/errorMiddleware.js#L8)
  - Status code logic incorrect: `res.statusCode === 200 ? 500 : res.statusCode`

- [ ] **Async routes not wrapped with asyncHandler**
  - File: [backend/middleware/asyncHandler.js](backend/middleware/asyncHandler.js)
  - Exists but not used in authRoutes or inquiryRoutes

- [ ] **Admin components missing error handling**
  - Files: [app/admin/PropertiesTab.tsx](app/admin/PropertiesTab.tsx#L63), [app/admin/InquiriesTab.tsx](app/admin/InquiriesTab.tsx)

### 8. Cookie Configuration
- [ ] **Cookie configuration mismatch**
  - Backend: [backend/controllers/authController.js](backend/controllers/authController.js#L13-18)
  - Frontend: [app/api/auth/login/route.ts](app/api/auth/login/route.ts#L56-61)
  - Different secure flag logic

### 9. CORS Security
- [ ] **CORS too permissive** - Allows any origin
  - File: [backend/app.js](backend/app.js#L15)
  - `cors({ origin: true, credentials: true })`
  - Should specify allowed origins

- [ ] **No CORS headers on Next.js API routes**
  - Files: [app/api/auth/login/route.ts](app/api/auth/login/route.ts), [app/api/inquiries/route.ts](app/api/inquiries/route.ts), etc.

- [ ] **Rate limiting not applying to all routes**
  - File: [backend/app.js](backend/app.js#L21)
  - Only auth routes have rate limit, should apply to POST /api/inquiries too

---

## MEDIUM PRIORITY ISSUES (Nice to Have)

### 10. Frontend Data Integration
- [ ] **PortfolioContent uses sample data**
  - File: [app/portfolio/PortfolioContent.tsx](app/portfolio/PortfolioContent.tsx#L10-84)
  - Should fetch from `/api/properties`

- [ ] **Portfolio [slug] route missing error handling**
  - File: [app/portfolio/[slug]/page.tsx](app/portfolio/[slug]/page.tsx)
  - No generateStaticParams, no 404 handling

- [ ] **No loading states in admin components**
  - Files: [app/admin/PropertiesTab.tsx](app/admin/PropertiesTab.tsx#L30), [app/admin/InquiriesTab.tsx](app/admin/InquiriesTab.tsx)
  - isLoading defined but never set

### 11. Missing Pages & Links
- [ ] **Privacy Policy page missing** - Footer links to `/privacy`
  - File: [components/layout/Footer.tsx](components/layout/Footer.tsx)
  - Create: `app/privacy/page.tsx`

- [ ] **Terms page missing** - Footer links to `/terms`
  - File: [components/layout/Footer.tsx](components/layout/Footer.tsx)
  - Create: `app/terms/page.tsx`

### 12. TypeScript Issues
- [ ] **Types defined in multiple places**
  - RouteParams: [app/api/properties/[id]/route.ts](app/api/properties/[id]/route.ts#L4-6), [app/api/inquiries/[id]/route.ts](app/api/inquiries/[id]/route.ts#L4-6)
  - Property: [app/admin/PropertiesTab.tsx](app/admin/PropertiesTab.tsx#L12-21), [app/admin/PropertyFormModal.tsx](app/admin/PropertyFormModal.tsx#L29-36)
  - Should be centralized

- [ ] **User type spread across files**
  - File: [lib/store.ts](lib/store.ts#L3-8)
  - Should export User type

- [ ] **Strict null checking issues**
  - File: [app/api/inquiries/route.ts](app/api/inquiries/route.ts#L51)
  - Property optionality not properly typed

### 13. Package Dependencies
- [ ] **bcryptjs version mismatch**
  - Frontend: `3.0.3` [package.json](package.json)
  - Backend: `^2.4.3` [backend/package.json](backend/package.json)

- [ ] **mongoose version mismatch**
  - Frontend: `9.6.2` [package.json](package.json)
  - Backend: `^7.5.2` [backend/package.json](backend/package.json)

- [ ] **Frontend missing bcryptjs in package.json**
  - Used in: [lib/models/User.ts](lib/models/User.ts#L2)
  - But not listed as dependency

- [ ] **Backend missing TypeScript types**
  - Missing: `@types/node`, `@types/express`

### 14. Other Security
- [ ] **No request size limits** on Express
  - File: [backend/app.js](backend/app.js#L14-16)

- [ ] **No HTTPS validation** in production
  - File: [backend/controllers/authController.js](backend/controllers/authController.js#L13)

- [ ] **No refresh token mechanism**
  - Sessions expire after 7 days with no way to extend

---

## TOTAL ISSUES BY SEVERITY

- **Critical (Blocking)**: 15 issues
- **High Priority**: 13 issues  
- **Medium Priority**: 15 issues
- **Total**: 43 identified issues

---

## RECOMMENDED FIX ORDER

1. **Phase 1 (Day 1)**: Fix environment variables and standardize names
2. **Phase 2 (Day 1-2)**: Fix database model mismatches and create missing backend routes
3. **Phase 3 (Day 2)**: Fix authentication flow and role comparisons
4. **Phase 4 (Day 2-3)**: Implement admin component API integration
5. **Phase 5 (Day 3)**: Fix CORS and security issues
6. **Phase 6 (Day 3-4)**: Add missing pages and improve TypeScript types

