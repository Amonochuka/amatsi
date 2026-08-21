# Team Role Split

> **NOTE:** Don't forget deployment! The build only counts if it's live. Budget dedicated time to deploy the Go API, Python AI service, and frontend before the demo. See the deployment tasks in `to-do-list.md` (Phase 7).

## PERSON A - Team Lead / Backend Developer

**Role Description:** Leads the team and builds the core Golang backend API. Responsible for all backend infrastructure and ensuring integration with other services.

### Primary Responsibilities

**Golang Backend Core**
- [ ] Set up main.go with Gin router
- [ ] Implement configuration loader (config.go)
- [ ] Create database connection pool (Supabase)
- [ ] Set up CORS middleware
- [ ] Implement health check endpoint
- [ ] Create Redis client connection
- [ ] Set up Asynq task queue server
- [ ] Implement JWT authentication middleware

**API Development**
- [ ] Create route registration (routes.go)
- [ ] Implement auth handlers (login/signup)
- [ ] Implement farm CRUD handlers
- [ ] Create API client for Python AI service
- [ ] Implement error handling and logging
- [ ] Create response formatters (JSON)

**Integration**
- [ ] Ensure all services communicate correctly
- [ ] Test end-to-end data flow
- [ ] Handle any integration issues
- [ ] Resolve blocking issues

**Code Quality**
- [ ] Perform code reviews
- [ ] Ensure consistent coding standards
- [ ] Refactor where needed

### Key Deliverables
- [ ] Working Golang API with all routes
- [ ] JWT authentication system
- [ ] Integration with Python AI service
- [ ] Clean, documented code
- [ ] Team coordination and project plan

---

## PERSON B - Backend & Database Developer

**Role Description:** Focuses on the database layer, external API clients, infrastructure helpers, business logic, task queue, and premium IoT automated irrigation feature. ✅ **COMPLETE**

### Primary Responsibilities

**Infrastructure & Configuration**
- [x] Implement environment variable config loader (`internal/config/config.go`)
- [x] Create Supabase pgxpool connection helper (`internal/clients/supabase.go`)
- [x] Create Redis client factory (`internal/clients/redis.go`)
- [x] Add Asynq (Redis) + Mosquitto MQTT broker to `docker-compose.yml`

**Database Layer**
- [x] Set up Supabase project
- [x] Create all database tables using individual SQL migration files (one per table)
- [x] Enable Row Level Security (RLS) on all tables
- [x] Create RLS policies for all tables using `auth.uid()`
- [ ] Set up TimescaleDB extension *(skipped — using standard lat/long per team decision)*
- [ ] Set up PostGIS extension *(skipped — using standard lat/long per team decision)*
- [x] Create seed data for demonstration (`006_seed_data.sql`)
- [x] Remove empty/duplicate stub SQL files

**Repository Layer**
- [x] Create `farm_repository.go` (full CRUD)
- [x] Create `recommendation_repository.go`
- [x] Create `alert_repository.go`
- [x] Create `weather_repository.go`
- [x] Create `user_repository.go` (GetUserByID for premium checks)
- [x] Implement GetFarmByID, GetFarmsByUserID
- [x] Implement CreateFarm, UpdateFarm, DeleteFarm
- [x] Implement CreateRecommendation
- [x] Implement CreateAlert, GetAlertsByFarmID

**External API Clients**
- [x] Create `kijanibox.go` client
  - [x] `GetWeatherForecast()`
  - [x] `GetSoilMoisture()`
  - [x] Error handling and timeout
- [x] Create `africastalking.go` client
  - [x] `SendSMS()` with phone formatting
  - [x] Error handling and response parsing
- [x] Create `python_ai.go` client
  - [x] `GetRecommendation()`
  - [x] Timeout handling and response parsing
- [x] Create `mqtt.go` client (paho.mqtt.golang)
  - [x] `TriggerIrrigation()` — publishes `OPEN_VALVE` to device topic

**Task Queue**
- [x] Set up Asynq server and client (`queue/asynq.go`)
- [x] Create SMS task definition (`queue/tasks.go`)
- [x] Implement `SendSMSTask` worker (`queue/workers/sms_worker.go`)
- [x] Retry logic handled by Asynq framework

**Business Logic**
- [x] Create `recommendation_service.go` — orchestrates Kijanibox → Python AI → DB → MQTT/SMS
- [x] Create `alert_service.go` — logs alert and queues async SMS via Asynq
- [x] Create `farm_service.go` — wraps farm repository for clean CRUD

**Premium IoT Automated Irrigation** *(Bonus Feature)*
- [x] Migration `007_add_premium_tier.sql` — adds `is_premium` to users, `device_id` to farms
- [x] Updated `User` and `Farm` models with new fields
- [x] `recommendation_service.go` triggers MQTT for premium users on `IRRIGATE`
- [x] `iot/mock_device.go` — standalone Go simulator mimicking ESP32 hardware with edge safety timer

### Key Deliverables
- [x] All database tables with RLS policies (7 migration files)
- [x] Full repository layer using pgxpool (no ORM)
- [x] All external API clients (Kijanibox, Africa's Talking, Python AI, MQTT)
- [x] Asynq task queue for async SMS delivery
- [x] Config loader, Supabase pool, Redis client infrastructure helpers
- [x] Core business logic services (Farm, Recommendation, Alert)
- [x] Premium IoT automated valve integration with Go hardware simulator

---

## PERSON C - Frontend Developer

**Role Description:** Builds the user-facing Next.js application. Responsible for the main UI, authentication, and core dashboard components.

### Primary Responsibilities

**Project Setup**
- [ ] Initialize Next.js with TypeScript and Tailwind
- [ ] Set up folder structure
- [ ] Install required dependencies
- [ ] Configure Tailwind with custom theme
- [ ] Set up shadcn/ui components

**Supabase Auth Integration**
- [ ] Create Supabase client (client.ts)
- [ ] Implement login page (/auth/login)
- [ ] Implement signup page (/auth/signup)
- [ ] Add form validation (Zod + React Hook Form)
- [ ] Implement protected routes
- [ ] Add logout functionality
- [ ] Store JWT token in localStorage

**Landing Page**
- [ ] Hero section with tagline and CTA
- [ ] Problem section with statistics
- [ ] Solution section with 3-step flow
- [ ] Tech stack badges
- [ ] Call to Action section
- [ ] Footer

**Dashboard Layout**
- [ ] Create dashboard layout with sidebar
- [ ] Add sidebar navigation items
- [ ] Create header with user info
- [ ] Implement responsive design
- [ ] Add offline indicator

**Core Dashboard Components**
- [ ] WeatherCard - temperature, rain probability
- [ ] SoilMoistureCard - soil moisture percentage
- [ ] TankLevelCard - water tank level with progress bar
- [ ] RecommendationCard - main recommendation display
- [ ] Show IRRIGATE/WAIT/MONITOR/CONSERVE
- [ ] Display reason and water saved
- [ ] "Send SMS" button (shown only for free-tier users)

**Premium IoT Subscription**
- [ ] Add `is_premium` toggle to the signup form ("Enable Smart IoT Automated Watering")
- [ ] Add `device_id` text input field on the Farm Registration/Edit form ("IoT Device ID e.g. ESP32-Kijani-001")
- [ ] Only show the `device_id` field when `is_premium` is enabled
- [ ] Submit `is_premium` and `device_id` in the API payload when creating/updating a farm
- [ ] On the dashboard, show a premium badge and "Valve will auto-trigger" status instead of the SMS button for premium users

**API Client**
- [ ] Create Axios client with interceptors
- [ ] Implement farmAPI functions
- [ ] Implement weatherAPI functions
- [ ] Implement recommendationAPI functions
- [ ] Implement alertAPI functions
- [ ] Add error handling

**Offline-First**
- [ ] Create useOffline hook
- [ ] Cache recommendations in localStorage
- [ ] Cache weather data in localStorage
- [ ] Show offline indicator in header
- [ ] Sync on reconnect

**Realtime**
- [ ] Create useRealtime hook
- [ ] Subscribe to recommendations table
- [ ] Update dashboard on new recommendations
- [ ] Show toast notifications

### Key Deliverables
- [ ] Beautiful, responsive web app
- [ ] Working authentication flow
- [ ] Core dashboard with main components
- [ ] Offline-first functionality
- [ ] Realtime updates
- [ ] Polished UI
- [ ] Premium IoT subscription toggle and device ID form fields

---

## PERSON D - AI & Integration Specialist

**Role Description:** Builds the Python AI service, integrates KijaniBox, and sets up Africa's Talking. Focuses on the "brains" of the application.

### Primary Responsibilities

**Python AI Service**
- [x] Set up FastAPI application
- [x] Create folder structure
- [x] Install dependencies (requirements.txt)
- [x] Create main.py with FastAPI
- [x] Add CORS middleware
- [x] Implement health check endpoint

**Rule Engine**
- [x] Create recommendation.py service
- [x] Define crop water requirements dictionary
- [x] Implement calculate_water_needed() function
- [x] Implement rule-based recommendation logic:
  - [x] Rule 1: If rain > 60%, WAIT
  - [x] Rule 2: If soil < 30%, IRRIGATE
  - [x] Rule 3: If soil 30-60%, MONITOR
  - [x] Rule 4: If tank < 500L, CONSERVE
  - [x] Rule 5: If soil > 80%, MONITOR
- [x] Implement water_saved_estimate calculation
- [x] Add logging

**KijaniBox Integration**
- [ ] Get KijaniBox API key
- [ ] Review API documentation
- [x] Create kijanibox_client.py (`app/clients/kijanibox_client.py`)
- [x] Implement get_weather(lat, lon)
- [x] Implement get_soil_moisture(lat, lon)
- [x] Implement get_rainfall_probability(lat, lon)
- [x] Add error handling
- [x] Add timeout
- [ ] Test with live API

**API Endpoints**
- [x] Create /predict POST endpoint
- [x] Define request/response models (Pydantic)
- [x] Connect to rule engine
- [x] Connect to KijaniBox client *(optional lat/lon enrichment via `app/services/enrichment.py`)*
- [x] Add error handling

**Africa's Talking Integration**
- [ ] Get Africa's Talking API key
- [ ] Review API documentation
- [x] Create SMS template (`app/services/sms.py`):
  - [x] English version
  - [x] Kiswahili version
  - [x] Luo version
- [ ] Test SMS sending
- [x] Create message formatting function
- [ ] Test with sandbox numbers

**Testing**
- [x] Write unit tests for rule engine
- [ ] Test all API endpoints with Postman
- [ ] Test KijaniBox integration
- [ ] Test Africa's Talking integration
- [x] Create mock data for offline testing (`app/clients/mock_data.py`)

### Key Deliverables
- [ ] Working Python AI service
- [ ] Rule-based recommendation engine
- [ ] KijaniBox data integration
- [ ] Africa's Talking SMS integration
- [ ] Tested, reliable service

---

## PERSON E - Frontend & Full-Stack Support

**Role Description:** Builds additional frontend pages and supports the frontend developer with components and API integration.

### Primary Responsibilities

**Dashboard Feature Pages**
- [ ] Create /dashboard/irrigation page
- [ ] Generate recommendation button
- [ ] Current recommendation display
- [ ] Historical recommendations list
- [ ] Create /dashboard/planner page
- [ ] 30-day weather forecast
- [ ] Crop recommendations based on forecast
- [ ] Planting calendar
- [ ] Create /dashboard/farms page
- [ ] List all farms with cards
- [ ] Add farm form (modal or page)
- [ ] Edit farm form
- [ ] Delete farm with confirmation
- [ ] Create /dashboard/alerts page
- [ ] List all SMS messages sent
- [ ] Status indicators (delivered/failed/pending)
- [ ] Search and filter

**Additional Components**
- [ ] RecentAlerts component for dashboard home
- [ ] WaterUsageChart component with Recharts
- [ ] FarmMap component with Leaflet
- [ ] Loading states and skeletons
- [ ] Error boundaries

**Farm Management Features**
- [ ] Farm form with validation
- [ ] Farm name
- [ ] Location (map picker)
- [ ] Area (hectares)
- [ ] Crop type (dropdown)
- [ ] Planting date (date picker)
- [ ] Soil type (dropdown)
- [ ] Irrigation method (dropdown)
- [ ] Tank capacity (number input)

**API Integration Support**
- [ ] Help Person C with API client functions
- [ ] Implement additional API calls as needed
- [ ] Test API integration in frontend

**UI Polish**
- [ ] Mobile responsiveness check for all pages
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Performance optimization
- [ ] Add loading states
- [ ] Add error boundaries

**Frontend Support**
- [ ] Help Person C with any frontend issues
- [ ] Build additional UI components as needed
- [ ] Ensure consistent styling across all pages

### Key Deliverables
- [ ] Complete feature pages (Irrigation, Planner, Farms, Alerts)
- [ ] Farm management CRUD functionality
- [ ] Water usage chart with analytics
- [ ] Map integration with farm locations
- [ ] Mobile-responsive all pages
- [ ] Polished, consistent UI

---

## Dependencies Between Roles

| Task | Who Does It | Who Depends On It |
|---|---|---|
| Supabase Database | Person B | Person A (needs DB for API), Person C (needs auth), Person D (needs data) |
| Golang API Foundation | Person A | Person C (frontend calls API), Person D (Go calls Python) |
| Python AI Service | Person D | Person A (Go calls Python) |
| Go API Clients | Person B | Person A (uses clients), Person C (frontend API) |
| Frontend API Client | Person C + E | Person A (backend) |
| Dashboard Components | Person C | Person E (needs to build pages) |
| Feature Pages | Person E | Person C (needs integration) |
| SMS Sandbox & Templates | Person D | Person A/B (test SMS flow), Person E (verify delivery) |
| Deployment & E2E Testing | Shared (A coordinates) | All roles (verify their work in production) |