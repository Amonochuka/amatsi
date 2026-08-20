# KijaniFarmer - To-Do List

## PHASE 0: PREPARATION

### Project Setup
- [ ] Create GitHub repository named kijanifarmer
- [ ] Clone repository to local machine
- [ ] Initialize project folder structure as shown in folderstructure.md

### Supabase Setup
- [ ] Create Supabase account (supabase.com)
- [ ] Create new project (choose region: Frankfurt/eu-central-1)
- [ ] Save Project URL (e.g., https://xyzref.supabase.co)
- [ ] Save Anon Key (public key)
- [ ] Save Service Role Key (secret - keep safe)
- [ ] Enable TimescaleDB extension in SQL Editor
- [ ] Run all migration SQL scripts (001-005)
- [ ] Enable Row Level Security (RLS) on all tables
- [ ] Create RLS policies for farmers table
- [ ] Create RLS policies for farms table
- [ ] Create RLS policies for recommendations table
- [ ] Create RLS policies for sms_logs table
- [ ] Test connection from local machine

### Africa's Talking Setup
- [ ] Create Africa's Talking account (africastalking.com)
- [ ] Get sandbox API Key
- [ ] Get sandbox username
- [ ] Create Sender ID (e.g., KIJANIFARM)
- [ ] Set up SMS callback URL (for delivery reports) - optional
- [ ] Add test phone numbers to sandbox
- [ ] Test SMS sending via API (curl or Postman)

### KijaniBox Setup
- [ ] Register for KijaniBox API access
- [ ] Get API Key
- [ ] Review API documentation
- [ ] Identify endpoints needed:
  - [ ] Weather forecast endpoint
  - [ ] Soil moisture endpoint
  - [ ] Rainfall data endpoint
- [ ] Test API calls with Postman

### Redis Setup (Upstash)
- [ ] Create Upstash account (upstash.com)
- [ ] Create Redis database
- [ ] Save Redis URL (e.g., redis://default:password@xyz.upstash.io:6379)
- [ ] Test connection from local machine

### Docker Setup (Optional)
- [ ] Install Docker Desktop
- [ ] Create Dockerfile for Go backend
- [ ] Create Dockerfile for Python AI
- [ ] Create docker-compose.yml for local dev

### Local Development Environment
- [ ] Install Go (1.22+)
- [ ] Install Node.js (20+)
- [ ] Install Python (3.11+)
- [ ] Install Postman (for API testing)
- [ ] Install VS Code with extensions:
  - [ ] Go Extension
  - [ ] Prettier
  - [ ] Tailwind CSS IntelliSense
  - [ ] ESLint
- [ ] Set up ~/.ssh for GitHub

## PHASE 1: BACKEND (Golang)

### Project Initialization
- [ ] Navigate to /backend folder
- [ ] Run go mod init github.com/yourusername/kijanifarmer
- [ ] Create .env file with all environment variables
- [ ] Install required Go packages:
  - [ ] go get github.com/gin-gonic/gin
  - [ ] go get github.com/jackc/pgx/v5
  - [ ] go get github.com/joho/godotenv
  - [ ] go get github.com/golang-jwt/jwt/v5
  - [ ] go get github.com/rs/cors
  - [ ] go get github.com/hibiken/asynq
  - [ ] go get github.com/redis/go-redis/v9
  - [ ] go get github.com/tech-kenya/africastalkingsms
  - [ ] go get github.com/google/uuid
  - [ ] go get github.com/stretchr/testify

### Core Infrastructure
- [ ] Create /cmd/server/main.go
- [ ] Implement main() function
- [ ] Load environment variables with godotenv
- [ ] Initialize Gin router
- [ ] Add CORS middleware
- [ ] Add Logger middleware
- [ ] Add Recovery middleware (panic handling)
- [ ] Create health check endpoint: GET /health
- [ ] Test server runs on port 8080

### Database Layer
- [ ] Create /internal/config/config.go
- [ ] Load DB connection string from environment
- [ ] Create /internal/clients/supabase.go
- [ ] Implement NewSupabasePool() function
- [ ] Add connection pool configuration (max 10 connections)
- [ ] Test database connection on startup
- [ ] Create /internal/repository/farm_repository.go
- [ ] Implement GetFarmByID(ctx, id)
- [ ] Implement GetFarmsByFarmer(ctx, farmerID)
- [ ] Implement CreateFarm(ctx, farm)
- [ ] Implement UpdateFarm(ctx, farm)
- [ ] Implement DeleteFarm(ctx, id)
- [ ] Create /internal/repository/recommendation_repository.go
- [ ] Implement GetRecommendationsByFarm(ctx, farmID)
- [ ] Implement CreateRecommendation(ctx, rec)
- [ ] Implement MarkRecommendationAsRead(ctx, id)
- [ ] Create /internal/repository/alert_repository.go
- [ ] Implement CreateSMSLog(ctx, log)
- [ ] Implement GetSMSLogsByFarmer(ctx, farmerID)

### External API Clients
- [ ] Create /internal/clients/kijanibox.go
- [ ] Define KijaniBoxClient struct
- [ ] Implement NewKijaniBoxClient(apiKey, baseURL)
- [ ] Implement GetWeatherForecast(ctx, lat, lon)
- [ ] Implement GetSoilMoisture(ctx, lat, lon)
- [ ] Implement GetRainfallProbability(ctx, lat, lon)
- [ ] Add error handling for API calls
- [ ] Add timeout (10 seconds per request)
- [ ] Add logging for all API calls
- [ ] Test with Postman/curl
- [ ] Create /internal/clients/africastalking.go
- [ ] Define AfricaTalkingClient struct
- [ ] Implement NewAfricaTalkingClient(apiKey, username, senderID)
- [ ] Implement SendSMS(ctx, phoneNumber, message)
- [ ] Add error handling
- [ ] Test SMS sending
- [ ] Create /internal/clients/python_ai.go
- [ ] Define PythonAIClient struct
- [ ] Implement NewPythonAIClient(baseURL)
- [ ] Implement GetRecommendation(ctx, farmData)
- [ ] Add timeout (5 seconds)
- [ ] Test with Python service (or mock)

### Task Queue
- [ ] Create /internal/clients/redis.go
- [ ] Implement NewRedisClient(url) using go-redis
- [ ] Test Redis connection
- [ ] Create /internal/queue/asynq.go
- [ ] Initialize Asynq client and server
- [ ] Create /internal/queue/tasks.go
- [ ] Define SendSMSTask struct
- [ ] Implement NewSendSMSTask(phone, message)
- [ ] Define task type constant: TypeSendSMS
- [ ] Create /internal/queue/workers/sms_worker.go
- [ ] Implement SendSMSWorker function
- [ ] Add task processing logic
- [ ] Add error handling (retry on failure)

### API Routes & Handlers
- [ ] Create /internal/api/routes/routes.go
- [ ] Register all routes with Gin router:
  - [ ] POST /api/auth/login
  - [ ] POST /api/auth/signup
  - [ ] POST /api/auth/logout
  - [ ] GET /api/farms
  - [ ] POST /api/farms
  - [ ] GET /api/farms/:id
  - [ ] PUT /api/farms/:id
  - [ ] DELETE /api/farms/:id
  - [ ] GET /api/weather/:farmId
  - [ ] GET /api/soil/:farmId
  - [ ] GET /api/recommendations/:farmId
  - [ ] POST /api/recommendations/generate
  - [ ] POST /api/alerts/send
  - [ ] GET /api/alerts/history
- [ ] Create /internal/api/handlers/auth_handler.go
- [ ] Implement LoginHandler
- [ ] Implement SignupHandler
- [ ] Implement LogoutHandler
- [ ] Add JWT token generation/validation
- [ ] Add password hashing (bcrypt)
- [ ] Create /internal/api/handlers/farm_handler.go
- [ ] Implement GetFarmsHandler
- [ ] Implement GetFarmHandler
- [ ] Implement CreateFarmHandler
- [ ] Implement UpdateFarmHandler
- [ ] Implement DeleteFarmHandler
- [ ] Create /internal/api/handlers/weather_handler.go
- [ ] Implement GetWeatherHandler
- [ ] Implement GetSoilMoistureHandler
- [ ] Add Redis caching layer (TTL: 1 hour)
- [ ] Create /internal/api/handlers/recommendation_handler.go
- [ ] Implement GetRecommendationsHandler
- [ ] Implement GenerateRecommendationHandler
- [ ] Call Python AI service
- [ ] Store result in Supabase
- [ ] Create /internal/api/handlers/alert_handler.go
- [ ] Implement SendAlertHandler
- [ ] Queue SMS task via Asynq
- [ ] Implement GetAlertHistoryHandler

### Authentication Middleware
- [ ] Create /internal/api/middleware/auth.go
- [ ] Implement JWT validation middleware
- [ ] Extract user ID from token
- [ ] Set user ID in context
- [ ] Add to protected routes
- [ ] Create /internal/api/middleware/cors.go
- [ ] Configure CORS for Vercel frontend
- [ ] Create /internal/api/middleware/logger.go
- [ ] Log all requests with method, path, status, duration

## PHASE 2: AI SERVICE (Python)

### Project Initialization
- [ ] Navigate to /ai-service folder
- [ ] Create requirements.txt
- [ ] Add dependencies:
  - [ ] fastapi==0.104.0
  - [ ] uvicorn[standard]==0.24.0
  - [ ] pydantic==2.5.0
  - [ ] requests==2.31.0
  - [ ] python-dotenv==1.0.0
  - [ ] httpx==0.25.0 (for async HTTP)
- [ ] Create .env file
- [ ] Install dependencies: pip install -r requirements.txt

### Core Service
- [ ] Create /app/main.py
- [ ] Initialize FastAPI app
- [ ] Add CORS middleware
- [ ] Add health check endpoint: GET /health
- [ ] Add root endpoint: GET /
- [ ] Create /app/routes/predict.py
- [ ] Define RecommendationRequest model
- [ ] Define RecommendationResponse model
- [ ] Implement POST /predict endpoint
- [ ] Extract farm data from request (soil, weather, crop)

### Rule Engine
- [ ] Create /app/services/recommendation.py
- [ ] Implement generate_recommendation() function
- [ ] Implement Rule 1: If rain > 60%, recommend WAIT
- [ ] Implement Rule 2: If soil < 30%, recommend IRRIGATE
- [ ] Implement Rule 3: If soil is adequate (30-60%), recommend MONITOR
- [ ] Implement calculate_water_needed() function
- [ ] Maize: 30L/m2
- [ ] Beans: 20L/m2
- [ ] Tomatoes: 35L/m2
- [ ] Default: 25L/m2
- [ ] Implement calculate_water_saved() function
- [ ] Add error handling

### KijaniBox Python Client
- [ ] Create /app/services/kijanibox_client.py
- [ ] Implement get_weather(lat, lon)
- [ ] Implement get_soil_moisture(lat, lon)
- [ ] Add error handling
- [ ] Add timeout
- [ ] Test with live API

### Testing
- [ ] Create /test/test_recommendation.py
- [ ] Test Rule 1 (rain > 60%)
- [ ] Test Rule 2 (soil < 30%)
- [ ] Test Rule 3 (soil adequate)
- [ ] Test water calculation logic

### Docker Setup
- [ ] Create Dockerfile
- [ ] Set base image: python:3.11-slim
- [ ] Copy requirements.txt
- [ ] Run pip install -r requirements.txt
- [ ] Copy application code
- [ ] Set CMD: uvicorn app.main:app --host 0.0.0.0 --port 8000
- [ ] Test Docker build locally

## PHASE 3: FRONTEND (Next.js)

### Project Initialization
- [ ] Navigate to /frontend folder
- [ ] Run npx create-next-app@latest . --typescript --tailwind --app
- [ ] Install dependencies:
  - [ ] npm install @supabase/supabase-js
  - [ ] npm install @supabase/ssr
  - [ ] npm install tailwindcss postcss autoprefixer
  - [ ] npm install @radix-ui/react-slot
  - [ ] npm install class-variance-authority
  - [ ] npm install clsx
  - [ ] npm install tailwind-merge
  - [ ] npm install lucide-react (icons)
  - [ ] npm install recharts (charts)
  - [ ] npm install react-leaflet leaflet (maps)
  - [ ] npm install axios (API client)
  - [ ] npm install @tanstack/react-query (data fetching)
  - [ ] npm install react-hook-form (forms)
  - [ ] npm install zod (validation)

### UI Setup
- [ ] Create /styles/tailwind.css
- [ ] Configure Tailwind with custom theme:
  - [ ] Primary color: Green (#16a34a)
  - [ ] Secondary: Earth (#8B7355)
  - [ ] Font: Inter
- [ ] Create /components/ui/Button.tsx
- [ ] Create /components/ui/Card.tsx
- [ ] Create /components/ui/Input.tsx
- [ ] Create /components/ui/Navbar.tsx
- [ ] Create /components/ui/Sidebar.tsx
- [ ] Create /components/ui/Header.tsx
- [ ] Create /components/ui/Footer.tsx
- [ ] Create /components/ui/LoadingSpinner.tsx

### Supabase Client
- [ ] Create /lib/supabase/client.ts
- [ ] Initialize Supabase client with URL + Anon Key
- [ ] Create /lib/supabase/server.ts
- [ ] Initialize Supabase server client (SSR)
- [ ] Create /types/supabase.ts
- [ ] Generate types from Supabase schema

### Authentication Pages
- [ ] Create /app/auth/login/page.tsx
- [ ] Build LoginForm component
- [ ] Add phone/email input
- [ ] Add password input
- [ ] Add "Forgot Password?" link
- [ ] Implement login logic with Supabase
- [ ] Add error handling
- [ ] Add loading state
- [ ] Create /app/auth/signup/page.tsx
- [ ] Build SignupForm component
- [ ] Add name, phone, password fields
- [ ] Add confirm password field
- [ ] Implement signup logic with Supabase
- [ ] Add form validation
- [ ] Add success/error messaging

### Landing Page
- [ ] Create /app/page.tsx
- [ ] Create HeroSection component
- [ ] Tagline: "AI-Powered Farming for Water Security"
- [ ] CTA Button: "Launch App"
- [ ] Create ProblemSection component
- [ ] Stats: "Farmers lose 40% of water"
- [ ] Impact numbers
- [ ] Create SolutionSection component
- [ ] Show dashboard mockup/screenshot
- [ ] 3-step flow: "1. Add farm, 2. AI analyzes, 3. Get advice"
- [ ] Create TechStackSection component
- [ ] Badges: Golang, Next.js, Supabase, KijaniBox, Africa's Talking
- [ ] Create CTASection component
- [ ] "Ready to save water? Login"

### Dashboard Layout
- [ ] Create /app/dashboard/layout.tsx
- [ ] Add Sidebar navigation
- [ ] Overview
- [ ] Irrigation Advisor
- [ ] Crop Planner
- [ ] My Farms
- [ ] Alerts History
- [ ] Add Header
- [ ] User name
- [ ] Logout button
- [ ] Offline indicator
- [ ] Create /app/dashboard/page.tsx
- [ ] Create DashboardOverview component structure:
- [ ] WeatherCard
- [ ] SoilMoistureCard
- [ ] TankLevelCard
- [ ] RecommendationCard
- [ ] WaterUsageChart
- [ ] RecentAlerts

### API Client
- [ ] Create /lib/api/client.ts
- [ ] Configure Axios instance with base URL
- [ ] Add request interceptor (add JWT token)
- [ ] Add response interceptor (error handling)
- [ ] Create API functions:
  - [ ] getFarms()
  - [ ] createFarm(data)
  - [ ] getWeather(farmId)
  - [ ] getSoilMoisture(farmId)
  - [ ] getRecommendations(farmId)
  - [ ] generateRecommendation(farmId)
  - [ ] sendAlert(farmId)
  - [ ] getAlertHistory()

## PHASE 4: DASHBOARD FEATURES

### Weather & Environment Cards
- [ ] Create /components/dashboard/WeatherCard.tsx
- [ ] Fetch weather data from Go API
- [ ] Display temperature, rain probability, humidity
- [ ] Show 5-day forecast
- [ ] Add rain probability visualization
- [ ] Create /components/dashboard/SoilMoistureCard.tsx
- [ ] Fetch soil moisture from Go API
- [ ] Display percentage with progress bar
- [ ] Show target range (55-75%)
- [ ] Add color coding: Optimal / Caution / Dry
- [ ] Create /components/dashboard/TankLevelCard.tsx
- [ ] Fetch tank level from Go API
- [ ] Display progress bar
- [ ] Show liters remaining
- [ ] Estimate days remaining

### Recommendation Card
- [ ] Create /components/dashboard/RecommendationCard.tsx
- [ ] Fetch latest recommendation from Go API
- [ ] Display action: IRRIGATE / WAIT / MONITOR
- [ ] Show reason (e.g., "78% chance of rain tomorrow")
- [ ] Show estimated water saved
- [ ] Add "Send SMS to my phone" button
- [ ] Implement SMS trigger API call
- [ ] Add success/error toast notification

### Charts & Analytics
- [ ] Create /components/dashboard/WaterUsageChart.tsx
- [ ] Use Recharts library
- [ ] Fetch water usage history from Go API
- [ ] Display bar chart of last 7 days
- [ ] Show weekly total
- [ ] Show comparison to previous week
- [ ] Display "Water Saved" metric

### Map Integration
- [ ] Create /components/dashboard/FarmMap.tsx
- [ ] Install Leaflet + React-Leaflet
- [ ] Display farm locations on map
- [ ] Show weather overlay (rain forecast)
- [ ] Show soil moisture heatmap (optional)

### Farm Management
- [ ] Create /app/dashboard/farms/page.tsx
- [ ] List all farms with cards
- [ ] Create farm form (modal or page)
- [ ] Farm name
- [ ] Location (map picker)
- [ ] Area (hectares)
- [ ] Crop type (dropdown)
- [ ] Planting date (date picker)
- [ ] Soil type (dropdown)
- [ ] Irrigation method (dropdown)
- [ ] Tank capacity (number input)
- [ ] Implement create farm API call
- [ ] Implement update farm API call
- [ ] Implement delete farm API call
- [ ] Add confirmation dialogs

### Crop Planner
- [ ] Create /app/dashboard/planner/page.tsx
- [ ] Fetch weather forecast from KijaniBox
- [ ] Analyze future conditions (1 month)
- [ ] Display crop recommendations:
  - [ ] Based on upcoming weather
  - [ ] Based on soil type
  - [ ] Based on market prices (optional)
- [ ] Show planting calendar
- [ ] Show expected yields

### Alert History
- [ ] Create /app/dashboard/alerts/page.tsx
- [ ] Fetch SMS logs from Go API
- [ ] Display list of sent alerts
- [ ] Show status: Delivered / Failed
- [ ] Show timestamp
- [ ] Search/filter by date

## PHASE 5: OFFLINE & REALTIME

### Offline-First Implementation
- [ ] Create /hooks/useOffline.ts
- [ ] Detect online/offline status
- [ ] Display indicator in header
- [ ] Implement offline caching:
  - [ ] Cache last recommendations in localStorage
  - [ ] Cache weather data in localStorage
  - [ ] Cache soil moisture data in localStorage
  - [ ] Cache farm details in localStorage
- [ ] Show "Last synced X min ago" indicator
- [ ] Implement sync on reconnect:
  - [ ] Check for pending data when online returns
  - [ ] Sync cached recommendations
  - [ ] Sync cached SMS logs
- [ ] Create service worker for PWA:
  - [ ] Register service worker
  - [ ] Cache static assets
  - [ ] Provide offline fallback page

### Realtime Subscriptions
- [ ] Create /hooks/useRealtime.ts
- [ ] Subscribe to recommendations table
- [ ] Subscribe to soil moisture updates
- [ ] Subscribe to weather updates
- [ ] Update dashboard when new data arrives
- [ ] Show toast notification on new recommendation

## PHASE 6: SMS & ALERTS

### SMS Integration
- [ ] Test Africa's Talking API from Go
- [ ] Send test SMS to sandbox numbers
- [ ] Create SMS template:
  - [ ] English: "Don't irrigate today. 78% rain expected. Save 450L."
  - [ ] Kiswahili: "Usimwagilie leo. 78% ya mvua inatarajiwa. Okoa 450L."
  - [ ] Luo: "Kik irigi kawuono. 78% koth biro. Res 450L."
- [ ] Implement SMS queuing via Asynq
- [ ] Store SMS logs in Supabase
- [ ] Track delivery status

### Alert Triggers
- [ ] Implement daily scheduled recommendations:
  - [ ] Get all farms
  - [ ] For each farm, generate recommendation
  - [ ] Send SMS if preference is enabled
  - [ ] Log all activity
- [ ] Implement manual SMS trigger (user clicks button)
- [ ] Add SMS opt-out handling
  - [ ] If farmer replies "STOP", update database preference
  - [ ] Africa's Talking handles auto opt-out

## PHASE 7: DEPLOYMENT

### Backend Deployment (Railway)
- [ ] Push code to GitHub
- [ ] Create Railway account (railway.app)
- [ ] Create new project in Railway
- [ ] Connect GitHub repository
- [ ] Set up Go service:
  - [ ] Select Dockerfile
  - [ ] Set environment variables:
    - [ ] SUPABASE_DB_URL
    - [ ] KIJANIBOX_API_KEY
    - [ ] KIJANIBOX_BASE_URL
    - [ ] AFRICA_TALKING_API_KEY
    - [ ] AFRICA_TALKING_USERNAME
    - [ ] AFRICA_TALKING_SENDER_ID
    - [ ] REDIS_URL
    - [ ] AI_SERVICE_URL
    - [ ] JWT_SECRET
  - [ ] Deploy service
  - [ ] Get public URL (e.g., https://kijani-api.up.railway.app)
- [ ] Set up Python AI service:
  - [ ] Add second service to same Railway project
  - [ ] Select Dockerfile
  - [ ] Set environment variables:
    - [ ] KIJANIBOX_API_KEY
    - [ ] KIJANIBOX_BASE_URL
  - [ ] Deploy service
  - [ ] Get public URL (e.g., https://kijani-ai.up.railway.app)
- [ ] Test both services:
  - [ ] GET /health on Go API
  - [ ] GET /health on Python AI
  - [ ] Test Go to Python communication

### Frontend Deployment (Vercel)
- [ ] Push code to GitHub
- [ ] Create Vercel account (vercel.com)
- [ ] Import GitHub repository
- [ ] Configure project:
  - [ ] Framework: Next.js
  - [ ] Build command: npm run build
  - [ ] Output directory: .next
- [ ] Set environment variables:
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [ ] NEXT_PUBLIC_API_URL (Railway Go API URL)
- [ ] Deploy project
- [ ] Get production URL (e.g., https://kijanifarmer.vercel.app)

### Connect Services
- [ ] Update Go API with production AI URL
- [ ] Update Go API with production Supabase URL
- [ ] Update Next.js with production API URL
- [ ] Redeploy all services
- [ ] Test end-to-end flow on production

### Production Testing
- [ ] Test landing page loads
- [ ] Test signup creates account
- [ ] Test login works
- [ ] Test farm creation
- [ ] Test weather data displays
- [ ] Test recommendation generates
- [ ] Test SMS sends (to sandbox)
- [ ] Test offline mode (turn off WiFi)
- [ ] Test realtime updates

### Monitoring & Logging
- [ ] Add production logging to Go API
- [ ] Add error reporting (Sentry) - optional
- [ ] Set up uptime monitoring (UptimeRobot) - optional

## PHASE 8: PRESENTATION PREP

### Demo Script
- [ ] Write 5-minute pitch script:
  - [ ] 1 min: Problem statement
  - [ ] 1 min: Our solution (KijaniFarmer)
  - [ ] 1 min: Live demo (walk through dashboard)
  - [ ] 1 min: Tech stack overview
  - [ ] 1 min: Impact & call to action
- [ ] Plan live demo flow:
  - [ ] Start on Landing page
  - [ ] Click Login
  - [ ] Show Dashboard Overview
  - [ ] Click Irrigation Advisor
  - [ ] Generate recommendation
  - [ ] Click "Send SMS" - show phone receiving message
  - [ ] Show Offline mode (toggle WiFi off)
  - [ ] Show Realtime updates (new recommendation appears)

### Contingency Plan
- [ ] Record demo video (5 minutes)
- [ ] Take screenshots of all pages
- [ ] Save offline versions of key data
- [ ] Prepare backup in case API rate limits hit
- [ ] Have mock data ready if KijaniBox is slow
- [ ] Prepare local version if deployment fails

### Presentation Materials
- [ ] Create 1-page project overview (PDF)
- [ ] Create 1-page tech stack summary
- [ ] Create QR code to live app
- [ ] Prepare team introduction
- [ ] Practice transitions between sections
- [ ] Time the presentation (under 5 minutes)

### Final Checklist
- [ ] All services are live and accessible
- [ ] End-to-end flow works on production
- [ ] SMS sends to real phone
- [ ] Offline mode works
- [ ] Realtime updates work
- [ ] Mobile responsive design is polished
- [ ] All environment variables are set
- [ ] Demo script is rehearsed
- [ ] Backup video/screenshots ready
- [ ] Team is aligned on presentation roles