# KIJANIFARMER – TASK TO FILE MAPPING

## Complete Execution File Reference for Each Role

---

## PERSON A – Team Lead / Backend Developer

| # | Task | File(s) | Description |
| :--- | :--- | :--- | :--- |
| 1 | Set up main.go with Gin router | `backend/cmd/server/main.go` | Entry point, server initialization, Gin router setup |
| 2 | Implement configuration loader | `backend/internal/config/config.go` | Load environment variables, return Config struct |
| 3 | Create database connection pool | `backend/internal/clients/supabase.go` | Supabase PostgreSQL connection pool |
| 4 | Set up CORS middleware | `backend/internal/api/middleware/cors.go` | CORS configuration for frontend access |
| 5 | Implement health check endpoint | `backend/cmd/server/main.go` | `/health` endpoint for deployment verification |
| 6 | Create Redis client connection | `backend/internal/clients/redis.go` | Redis connection for Asynq task queue |
| 7 | Set up Asynq task queue server | `backend/internal/queue/asynq.go` | Asynq server and client initialization |
| 8 | Implement JWT authentication middleware | `backend/internal/api/middleware/auth.go` | JWT token validation, extract user ID |
| 9 | Create route registration | `backend/internal/api/routes/routes.go` | Register all API routes |
| 10 | Implement auth handlers | `backend/internal/api/handlers/auth_handler.go` | Login, Signup, Refresh Token endpoints |
| 11 | Implement farm CRUD handlers | `backend/internal/api/handlers/farm_handler.go` | Create, Read, Update, Delete farms |
| 12 | Create API client for Python AI | `backend/internal/clients/python_ai.go` | HTTP client to call Python AI service |
| 13 | Implement error handling | `backend/internal/api/middleware/logger.go` | Global error handling and logging |
| 14 | Create response formatters | `backend/internal/api/handlers/*.go` | JSON response formatting utilities |
| 15 | Perform code reviews | All `backend/` files | Review team members' code |

---

## PERSON B – Backend & Database Developer

| # | Task | File(s) | Description |
| :--- | :--- | :--- | :--- |
| 1 | Set up Supabase project | Supabase Dashboard | Create project, get credentials |
| 2 | Create farmers table | `backend/migrations/001_create_farmers.sql` | Farmers table schema |
| 3 | Create farms table | `backend/migrations/002_create_farms.sql` | Farms table with PostGIS |
| 4 | Create environmental data table | `backend/migrations/003_create_environmental_data.sql` | TimescaleDB hypertable |
| 5 | Create recommendations table | `backend/migrations/004_create_recommendations.sql` | Recommendations table |
| 6 | Create SMS logs table | `backend/migrations/005_create_sms_logs.sql` | SMS logs table |
| 7 | Create phone numbers table | `backend/migrations/006_create_farmer_phone_numbers.sql` | Multi-phone support table |
| 8 | Enable RLS | All migration files | Row Level Security enable |
| 9 | Create RLS policies | All migration files | Security policies per table |
| 10 | Set up TimescaleDB | `backend/migrations/003_create_environmental_data.sql` | TimescaleDB extension |
| 11 | Set up PostGIS | `backend/migrations/002_create_farms.sql` | PostGIS extension |
| 12 | Create seed data | `backend/migrations/seed_data.sql` | Demo data for presentation |
| 13 | Create farm_repository.go | `backend/internal/repository/farm_repository.go` | Farm CRUD operations |
| 14 | Create recommendation_repository.go | `backend/internal/repository/recommendation_repository.go` | Recommendation operations |
| 15 | Create alert_repository.go | `backend/internal/repository/alert_repository.go` | SMS log operations |
| 16 | Create phone_repository.go | `backend/internal/repository/phone_repository.go` | Phone number operations |
| 17 | Create kijanibox.go client | `backend/internal/clients/kijanibox.go` | KijaniBox API client (Go) |
| 18 | Create africastalking.go client | `backend/internal/clients/africastalking.go` | Africa's Talking SMS client |
| 19 | Create python_ai.go client | `backend/internal/clients/python_ai.go` | Python AI service client |
| 20 | Set up Asynq server | `backend/internal/queue/asynq.go` | Task queue server |
| 21 | Create task definitions | `backend/internal/queue/tasks.go` | SendSMSTask definition |
| 22 | Implement SMS worker | `backend/internal/queue/workers/sms_worker.go` | SMS task processor |
| 23 | Create farm_service.go | `backend/internal/services/farm_service.go` | Farm business logic |
| 24 | Create recommendation_service.go | `backend/internal/services/recommendation_service.go` | Recommendation logic |
| 25 | Create alert_service.go | `backend/internal/services/alert_service.go` | SMS sending logic |
| 26 | Create phone_service.go | `backend/internal/services/phone_service.go` | Phone number management |
| 27 | Implement water calculation | `backend/internal/services/recommendation_service.go` | Water needed calculation |
| 28 | Create Dockerfile | `backend/Dockerfile` | Docker build file |
| 29 | Create docker-compose.yml | `docker-compose.yml` | Local development compose |

---

## PERSON C – Frontend Developer

| # | Task | File(s) | Description |
| :--- | :--- | :--- | :--- |
| 1 | Initialize Next.js | `frontend/package.json`, `frontend/tsconfig.json` | Project initialization |
| 2 | Set up Tailwind | `frontend/tailwind.config.js`, `frontend/postcss.config.js` | Tailwind configuration |
| 3 | Install dependencies | `frontend/package.json` | Add required packages |
| 4 | Configure theme | `frontend/tailwind.config.js` | Custom color theme |
| 5 | Set up shadcn/ui | `frontend/components/ui/*.tsx` | UI component library |
| 6 | Create Supabase client | `frontend/lib/supabase/client.ts` | Browser Supabase client |
| 7 | Create Supabase server client | `frontend/lib/supabase/server.ts` | Server-side Supabase client |
| 8 | Implement login page | `frontend/app/auth/login/page.tsx` | Login page UI and logic |
| 9 | Implement signup page | `frontend/app/auth/signup/page.tsx` | Signup page UI and logic |
| 10 | Add form validation | `frontend/lib/utils/validators.ts` | Zod validation schemas |
| 11 | Implement protected routes | `frontend/middleware.ts` | Route protection middleware |
| 12 | Add logout functionality | `frontend/components/ui/Sidebar.tsx` | Logout button |
| 13 | Store JWT token | `frontend/lib/supabase/client.ts` | Token storage in localStorage |
| 14 | Create landing page | `frontend/app/page.tsx` | Public landing page |
| 15 | Hero section | `frontend/app/page.tsx` | Hero with tagline and CTA |
| 16 | Problem section | `frontend/app/page.tsx` | Statistics and problem statement |
| 17 | Solution section | `frontend/app/page.tsx` | 3-step flow explanation |
| 18 | Tech stack badges | `frontend/app/page.tsx` | Technology badges |
| 19 | Call to Action | `frontend/app/page.tsx` | "Get Started" button |
| 20 | Create Footer | `frontend/components/ui/Footer.tsx` | Footer component |
| 21 | Create dashboard layout | `frontend/app/dashboard/layout.tsx` | Dashboard layout with sidebar |
| 22 | Add sidebar navigation | `frontend/components/ui/Sidebar.tsx` | Navigation sidebar |
| 23 | Create header | `frontend/components/ui/Header.tsx` | Dashboard header |
| 24 | Implement responsive design | `frontend/app/globals.css` | Responsive styles |
| 25 | Add offline indicator | `frontend/components/ui/Header.tsx` | Offline status indicator |
| 26 | Create WeatherCard | `frontend/components/dashboard/WeatherCard.tsx` | Weather display component |
| 27 | Create SoilMoistureCard | `frontend/components/dashboard/SoilMoistureCard.tsx` | Soil moisture display |
| 28 | Create TankLevelCard | `frontend/components/dashboard/TankLevelCard.tsx` | Tank level display |
| 29 | Create RecommendationCard | `frontend/components/dashboard/RecommendationCard.tsx` | Main recommendation display |
| 30 | Show IRRIGATE/WAIT/MONITOR | `frontend/components/dashboard/RecommendationAction.tsx` | Action display with colors |
| 31 | Display reason and water saved | `frontend/components/dashboard/RecommendationCard.tsx` | Reason and water saved |
| 32 | Create "Send SMS" button | `frontend/components/dashboard/RecommendationCard.tsx` | SMS trigger button |
| 33 | Create Axios client | `frontend/lib/api/client.ts` | API client with interceptors |
| 34 | Implement farmAPI | `frontend/lib/api/farmAPI.ts` | Farm CRUD API calls |
| 35 | Implement weatherAPI | `frontend/lib/api/weatherAPI.ts` | Weather data API calls |
| 36 | Implement recommendationAPI | `frontend/lib/api/recommendationAPI.ts` | Recommendation API calls |
| 37 | Implement alertAPI | `frontend/lib/api/alertAPI.ts` | SMS alert API calls |
| 38 | Add error handling | `frontend/lib/api/client.ts` | Global error handling |
| 39 | Create useOffline hook | `frontend/hooks/useOffline.ts` | Offline detection hook |
| 40 | Cache recommendations | `frontend/hooks/useOffline.ts` | localStorage caching |
| 41 | Cache weather data | `frontend/hooks/useOffline.ts` | localStorage caching |
| 42 | Cache soil data | `frontend/hooks/useOffline.ts` | localStorage caching |
| 43 | Sync on reconnect | `frontend/hooks/useOffline.ts` | Auto-sync when online |
| 44 | Create useRealtime hook | `frontend/hooks/useRealtime.ts` | Supabase Realtime subscription |
| 45 | Subscribe to recommendations | `frontend/hooks/useRealtime.ts` | Realtime subscription |
| 46 | Update dashboard live | `frontend/app/dashboard/page.tsx` | Live dashboard updates |
| 47 | Create Toast notifications | `frontend/components/ui/Toast.tsx` | Toast notification component |

---

## PERSON D – AI & Integration Specialist

| # | Task | File(s) | Description |
| :--- | :--- | :--- | :--- |
| 1 | Set up FastAPI | `ai-service/app/main.py` | FastAPI application setup |
| 2 | Create folder structure | `ai-service/app/` | Directory structure |
| 3 | Install dependencies | `ai-service/requirements.txt` | Python dependencies |
| 4 | Add CORS middleware | `ai-service/app/main.py` | CORS configuration |
| 5 | Implement health check | `ai-service/app/main.py` | `/health` endpoint |
| 6 | Create recommendation.py | `ai-service/app/services/recommendation.py` | Rule engine logic |
| 7 | Define crop water requirements | `ai-service/app/services/recommendation.py` | Crop water dictionary |
| 8 | Implement calculate_water_needed() | `ai-service/app/services/recommendation.py` | Water calculation function |
| 9 | Rule 1: Rain > 60% → WAIT | `ai-service/app/services/recommendation.py` | Rule logic |
| 10 | Rule 2: Soil < 30% → IRRIGATE | `ai-service/app/services/recommendation.py` | Rule logic |
| 11 | Rule 3: Soil 30-60% → MONITOR | `ai-service/app/services/recommendation.py` | Rule logic |
| 12 | Rule 4: Tank < 500L → CONSERVE | `ai-service/app/services/recommendation.py` | Rule logic |
| 13 | Rule 5: Soil > 80% → MONITOR | `ai-service/app/services/recommendation.py` | Rule logic |
| 14 | Implement water_saved_estimate | `ai-service/app/services/recommendation.py` | Water saved calculation |
| 15 | Add logging | `ai-service/app/services/recommendation.py` | Logging configuration |
| 16 | Get KijaniBox API key | External | API key acquisition |
| 17 | Review API docs | External | Documentation review |
| 18 | Create kijanibox_client.py | `ai-service/app/services/kijanibox_client.py` | KijaniBox Python client |
| 19 | Implement get_weather() | `ai-service/app/services/kijanibox_client.py` | Weather data fetch |
| 20 | Implement get_soil_moisture() | `ai-service/app/services/kijanibox_client.py` | Soil moisture fetch |
| 21 | Implement get_rainfall() | `ai-service/app/services/kijanibox_client.py` | Rainfall probability fetch |
| 22 | Add error handling | `ai-service/app/services/kijanibox_client.py` | API error handling |
| 23 | Add timeout | `ai-service/app/services/kijanibox_client.py` | Request timeout configuration |
| 24 | Create /predict endpoint | `ai-service/app/routes/predict.py` | POST /predict endpoint |
| 25 | Define request model | `ai-service/app/models/request.py` | Pydantic request model |
| 26 | Define response model | `ai-service/app/models/response.py` | Pydantic response model |
| 27 | Connect to rule engine | `ai-service/app/routes/predict.py` | Rule engine integration |
| 28 | Get Africa's Talking API key | External | API key acquisition |
| 29 | Review API docs | External | Documentation review |
| 30 | Create SMS templates | `ai-service/app/services/sms_templates.py` | English, Kiswahili, Luo |
| 31 | English template | `ai-service/app/services/sms_templates.py` | English SMS content |
| 32 | Kiswahili template | `ai-service/app/services/sms_templates.py` | Kiswahili SMS content |
| 33 | Luo template | `ai-service/app/services/sms_templates.py` | Luo SMS content |
| 34 | Test SMS sending | Africa's Talking Sandbox | SMS testing |
| 35 | Create message formatter | `ai-service/app/services/sms_templates.py` | Message formatting function |
| 36 | Write unit tests | `ai-service/test/test_recommendation.py` | Rule engine tests |
| 37 | Test API endpoints | `ai-service/test/test_api.py` | API endpoint tests |
| 38 | Test KijaniBox | `ai-service/test/test_kijanibox.py` | KijaniBox integration tests |
| 39 | Test Africa's Talking | `ai-service/test/test_sms.py` | SMS integration tests |
| 40 | Create mock data | `ai-service/test/mock_data.py` | Mock data for testing |
| 41 | Create Dockerfile | `ai-service/Dockerfile` | Docker build file |

---

## PERSON E – Frontend & Full-Stack Support

| # | Task | File(s) | Description |
| :--- | :--- | :--- | :--- |
| 1 | Create /irrigation page | `frontend/app/dashboard/irrigation/page.tsx` | Irrigation Advisor page |
| 2 | Generate recommendation button | `frontend/app/dashboard/irrigation/page.tsx` | "Generate Recommendation" button |
| 3 | Current recommendation display | `frontend/app/dashboard/irrigation/page.tsx` | Show current recommendation |
| 4 | Historical recommendations list | `frontend/app/dashboard/irrigation/page.tsx` | Past recommendations history |
| 5 | Create /planner page | `frontend/app/dashboard/planner/page.tsx` | Crop Planner page |
| 6 | 30-day weather forecast | `frontend/app/dashboard/planner/page.tsx` | Extended forecast display |
| 7 | Crop recommendations | `frontend/app/dashboard/planner/page.tsx` | Crop suggestions based on forecast |
| 8 | Planting calendar | `frontend/app/dashboard/planner/page.tsx` | Calendar with planting dates |
| 9 | Create /farms page | `frontend/app/dashboard/farms/page.tsx` | My Farms page |
| 10 | List all farms | `frontend/app/dashboard/farms/page.tsx` | Farm cards list |
| 11 | Add farm form | `frontend/components/forms/FarmForm.tsx` | Create new farm form |
| 12 | Edit farm form | `frontend/components/forms/FarmForm.tsx` | Edit existing farm form |
| 13 | Delete farm | `frontend/components/forms/FarmForm.tsx` | Delete with confirmation |
| 14 | Create /alerts page | `frontend/app/dashboard/alerts/page.tsx` | Alerts History page |
| 15 | SMS history list | `frontend/app/dashboard/alerts/page.tsx` | All SMS messages |
| 16 | Status indicators | `frontend/components/dashboard/AlertStatusBadge.tsx` | Delivered/Failed/Pending |
| 17 | Search and filter | `frontend/app/dashboard/alerts/page.tsx` | Search and filter controls |
| 18 | Create RecentAlerts | `frontend/components/dashboard/RecentAlerts.tsx` | Recent alerts for dashboard home |
| 19 | Create WaterUsageChart | `frontend/components/dashboard/WaterUsageChart.tsx` | Recharts bar chart |
| 20 | Create FarmMap | `frontend/components/dashboard/FarmMap.tsx` | Leaflet map component |
| 21 | Create loading states | `frontend/components/ui/LoadingSpinner.tsx` | Loading skeletons |
| 22 | Create error boundaries | `frontend/components/ui/ErrorBoundary.tsx` | Error boundary component |
| 23 | Farm name field | `frontend/components/forms/FarmForm.tsx` | Input field |
| 24 | Location map picker | `frontend/components/forms/FarmForm.tsx` | Map for location selection |
| 25 | Area field | `frontend/components/forms/FarmForm.tsx` | Hectares input |
| 26 | Crop type dropdown | `frontend/components/forms/FarmForm.tsx` | Crop selection dropdown |
| 27 | Planting date picker | `frontend/components/forms/FarmForm.tsx` | Date selection |
| 28 | Soil type dropdown | `frontend/components/forms/FarmForm.tsx` | Soil selection dropdown |
| 29 | Irrigation method dropdown | `frontend/components/forms/FarmForm.tsx` | Method selection dropdown |
| 30 | Tank capacity input | `frontend/components/forms/FarmForm.tsx` | Liters input |
| 31 | Create Settings page | `frontend/app/dashboard/settings/page.tsx` | Settings page |
| 32 | Profile section | `frontend/components/settings/ProfileSection.tsx` | Edit profile |
| 33 | Change password | `frontend/components/settings/ChangePassword.tsx` | Password update |
| 34 | Language selector | `frontend/components/settings/LanguageSelector.tsx` | Language preference |
| 35 | Theme selector | `frontend/components/settings/ThemeSelector.tsx` | Light/Dark theme |
| 36 | SMS preference | `frontend/components/settings/SMSPreference.tsx` | Enable/disable SMS |
| 37 | Phone numbers manager | `frontend/components/settings/PhoneNumbersManager.tsx` | Add/remove phone numbers |
| 38 | Delete account | `frontend/components/settings/DeleteAccount.tsx` | Account deletion |
| 39 | Offline sync settings | `frontend/components/settings/DataSyncSettings.tsx` | Sync preferences |
| 40 | Implement phoneAPI | `frontend/lib/api/phoneAPI.ts` | Phone number API calls |
| 41 | Implement settingsAPI | `frontend/lib/api/settingsAPI.ts` | Settings API calls |
| 42 | Mobile responsiveness | All `frontend/app/dashboard/*/page.tsx` | Mobile-first design |
| 43 | Cross-browser testing | All pages | Chrome, Firefox, Safari |
| 44 | Performance optimization | All pages | Lighthouse optimization |
| 45 | Help with API client | `frontend/lib/api/client.ts` | Support Person C |
| 46 | Additional API calls | `frontend/lib/api/*.ts` | Implement missing endpoints |

---

## Shared Files (Multiple People)

| # | File | People | Purpose |
| :--- | :--- | :--- | :--- |
| 1 | `backend/internal/api/routes/routes.go` | A, B | Route registration (A writes, B adds) |
| 2 | `backend/internal/clients/python_ai.go` | A, B | Go client for AI service (A uses, B maintains) |
| 3 | `frontend/lib/api/client.ts` | C, E | Axios client (C creates, E extends) |
| 4 | `frontend/components/ui/*` | C, E | Shared UI components (C creates, E uses) |
| 5 | `frontend/hooks/*` | C, E | Custom hooks (C creates, E uses) |
| 6 | `backend/.env` | A, B | Environment variables (both need) |
| 7 | `backend/go.mod` | A, B | Go dependencies (both add) |
| 8 | `docker-compose.yml` | B, A | Local development (B creates, A uses) |

---

## Deployment Files (All Persons)

| # | File | Person | Description |
| :--- | :--- | :--- | :--- |
| 1 | `backend/Dockerfile` | B | Go service container |
| 2 | `ai-service/Dockerfile` | D | Python service container |
| 3 | `frontend/next.config.js` | C | Next.js configuration |
| 4 | `docker-compose.yml` | B | Local development |
| 5 | Railway Setup | A | Golang deployment |
| 6 | Railway Setup | D | Python deployment |
| 7 | Vercel Setup | C | Frontend deployment |
| 8 | Upstash Setup | B | Redis deployment |
| 9 | Supabase Setup | B | Database deployment |
| 10 | `.env` all services | All | Environment variables |

---

## Critical Path by Person

| Person | First File | Last File | Critical Path |
| :--- | :--- | :--- | :--- |
| **A** | `backend/cmd/server/main.go` | `backend/internal/api/routes/routes.go` | Core → Handlers → Routes |
| **B** | Supabase Dashboard | `backend/internal/services/alert_service.go` | Database → Repos → Clients → Services |
| **C** | `frontend/app/layout.tsx` | `frontend/hooks/useRealtime.ts` | Setup → Auth → Dashboard → Offline → Realtime |
| **D** | `ai-service/requirements.txt` | `ai-service/app/routes/predict.py` | Setup → Rule Engine → KijaniBox → SMS → Endpoints |
| **E** | `frontend/app/dashboard/irrigation/page.tsx` | `frontend/components/settings/PhoneNumbersManager.tsx` | Pages → Components → Forms → Settings |

---

**Good luck, Team KijaniFarmer! 🚀🌱**