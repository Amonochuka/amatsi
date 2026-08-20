# Team Role Split

## PERSON A - Team Lead / Full-Stack Developer

**Role Description:** The glue that holds everything together. Responsible for project coordination, the core Golang backend, and ensuring all pieces integrate smoothly.

### Primary Responsibilities

**Project Management**
- [ ] Set up GitHub repository with proper branch structure
- [ ] Create project board (GitHub Projects or Trello)
- [ ] Coordinate team communication (WhatsApp/Slack/Telegram)
- [ ] Ensure all team members have required software installed
- [ ] Create initial folder structure for all services
- [ ] Document team rules and code standards

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
- [ ] Implement farm CRUD handlers
- [ ] Implement auth handlers (login/signup)
- [ ] Create API client for Python AI service
- [ ] Implement error handling and logging
- [ ] Create response formatters (JSON)

**Integration & Coordination**
- [ ] Ensure all services communicate correctly
- [ ] Test end-to-end data flow
- [ ] Coordinate deployment with Person E
- [ ] Handle any integration issues

**Frontend API Client**
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

**Presentation**
- [ ] Prepare demo script
- [ ] Lead the presentation
- [ ] Ensure all team members know their speaking parts

### Key Deliverables
- [ ] Working Golang API with all routes
- [ ] JWT authentication system
- [ ] Integration with all external services
- [ ] Offline-first functionality
- [ ] Realtime updates
- [ ] Clean, documented code

---

## PERSON B - Backend Developer

**Role Description:** Focuses on the database layer, external API clients, and business logic. Works closely with Person A.

### Primary Responsibilities

**Database Layer**
- [ ] Set up Supabase project
- [ ] Create all database tables using SQL
- [ ] Enable Row Level Security (RLS)
- [ ] Create RLS policies for all tables
- [ ] Set up TimescaleDB extension
- [ ] Set up PostGIS extension
- [ ] Create seed data for demonstration
- [ ] Test database connections

**Repository Layer**
- [ ] Create farm_repository.go (CRUD operations)
- [ ] Create recommendation_repository.go
- [ ] Create alert_repository.go
- [ ] Create weather_repository.go
- [ ] Implement GetFarmByID, GetFarmsByFarmer
- [ ] Implement CreateFarm, UpdateFarm, DeleteFarm
- [ ] Implement CreateRecommendation
- [ ] Implement CreateSMSLog, GetSMSLogs

**External API Clients**
- [ ] Define API contracts with Person D (request/response schemas, base URLs, credentials)
- [ ] Create kijanibox.go wrapper (calls service owned by Person D)
- [ ] GetWeatherForecast()
- [ ] GetSoilMoisture()
- [ ] Error handling and timeout
- [ ] Create africastalking.go wrapper (calls service owned by Person D)
- [ ] SendSMS() with phone formatting
- [ ] Error handling
- [ ] Retry logic
- [ ] Create python_ai.go client (calls Person D's FastAPI service)
- [ ] GetRecommendation()
- [ ] Timeout handling
- [ ] Response parsing

**Task Queue**
- [ ] Set up Asynq server and client
- [ ] Create task definitions (tasks.go)
- [ ] Implement SendSMSTask worker
- [ ] Add retry logic for failed tasks
- [ ] Test task queue locally

**Business Logic**
- [ ] Create recommendation_service.go
- [ ] Create alert_service.go
- [ ] Create farm_service.go
- [ ] Implement water calculation logic

**Testing**
- [ ] Write unit tests for repositories
- [ ] Test all API calls with Postman
- [ ] Test error scenarios

### Key Deliverables
- [ ] Fully functional Supabase database
- [ ] All external API integrations working
- [ ] Asynq task queue for SMS
- [ ] Clean, tested repository code

---

## PERSON C - Frontend Developer

**Role Description:** Builds the user-facing Next.js application. Responsible for beautiful, responsive, and functional UI.

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

**Dashboard Components**
- [ ] WeatherCard - temperature, rain probability
- [ ] SoilMoistureCard - soil moisture percentage
- [ ] TankLevelCard - water tank level with progress bar
- [ ] RecommendationCard - main recommendation display
- [ ] WaterUsageChart - Recharts bar chart
- [ ] RecentAlerts - SMS history list
- [ ] FarmMap - Leaflet map with farm location

**Feature Pages**
- [ ] /irrigation - Irrigation advisor page
- [ ] /planner - Crop planner page
- [ ] /farms - Farm management page
- [ ] List farms
- [ ] Add farm form
- [ ] Edit farm form
- [ ] Delete farm
- [ ] /alerts - Alert history page

**Polish**
- [ ] Mobile responsiveness check
- [ ] Cross-browser testing
- [ ] Performance optimization
- [ ] Add loading states
- [ ] Add error boundaries

### Key Deliverables
- [ ] Beautiful, responsive web app
- [ ] Working authentication flow
- [ ] Full dashboard with all features
- [ ] Polished presentation-ready UI

---

## PERSON D - AI & Integration Specialist

**Role Description:** Builds the Python AI service, integrates KijaniBox, and sets up Africa's Talking. Focuses on the "brains" of the application. Sole owner of all KijaniBox and Africa's Talking credentials, documentation, and live testing; Person B implements the Go wrappers against the clients and contracts defined here.

### Primary Responsibilities

**Python AI Service**
- [ ] Set up FastAPI application
- [ ] Create folder structure
- [ ] Install dependencies (requirements.txt)
- [ ] Create main.py with FastAPI
- [ ] Add CORS middleware
- [ ] Implement health check endpoint

**Rule Engine**
- [ ] Create recommendation.py service
- [ ] Define crop water requirements dictionary
- [ ] Implement calculate_water_needed() function
- [ ] Implement rule-based recommendation logic:
  - [ ] Rule 1: If rain > 60%, WAIT
  - [ ] Rule 2: If soil < 30%, IRRIGATE
  - [ ] Rule 3: If soil 30-60%, MONITOR
  - [ ] Rule 4: If tank < 500L, CONSERVE
  - [ ] Rule 5: If soil > 80%, MONITOR
- [ ] Implement water_saved_estimate calculation
- [ ] Add logging

**KijaniBox Integration**
- [ ] Get KijaniBox API key
- [ ] Review API documentation
- [ ] Create kijanibox_client.py
- [ ] Implement get_weather(lat, lon)
- [ ] Implement get_soil_moisture(lat, lon)
- [ ] Implement get_rainfall_probability(lat, lon)
- [ ] Add error handling
- [ ] Add timeout
- [ ] Test with live API

**API Endpoints**
- [ ] Create /predict POST endpoint
- [ ] Define request/response models (Pydantic)
- [ ] Connect to rule engine
- [ ] Connect to KijaniBox client
- [ ] Add error handling

**Africa's Talking Integration**
- [ ] Get Africa's Talking API key
- [ ] Review API documentation
- [ ] Create SMS template:
  - [ ] English version
  - [ ] Kiswahili version
  - [ ] Luo version
- [ ] Test SMS sending
- [ ] Create message formatting function
- [ ] Test with sandbox numbers

**Testing**
- [ ] Write unit tests for rule engine
- [ ] Test all API endpoints with Postman
- [ ] Test KijaniBox integration
- [ ] Test Africa's Talking integration
- [ ] Create mock data for offline testing

### Key Deliverables
- [ ] Working Python AI service
- [ ] Rule-based recommendation engine
- [ ] KijaniBox data integration
- [ ] Africa's Talking SMS integration
- [ ] Tested, reliable service

---

## PERSON E - DevOps & Quality Assurance

**Role Description:** Ensures the application is deployed, secure, and working. Handles environment setup, Docker, and testing.

### Primary Responsibilities

**Environment Setup**
- [ ] Create .env templates for all services
- [ ] Set up local development environment
- [ ] Install Docker Desktop
- [ ] Create Dockerfiles:
  - [ ] Golang Dockerfile
  - [ ] Python Dockerfile
  - [ ] Next.js Dockerfile
- [ ] Create docker-compose.yml for local development
- [ ] Test local build

**Deployment Setup**
- [ ] Create Railway account
- [ ] Create Vercel account
- [ ] Set up Upstash Redis
- [ ] Configure Supabase production

**Golang Deployment**
- [ ] Push code to GitHub
- [ ] Create Railway project
- [ ] Connect GitHub repository
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
  - [ ] PORT
- [ ] Deploy service
- [ ] Test health endpoint

**Python AI Deployment**
- [ ] Add second service to Railway
- [ ] Set environment variables
- [ ] Deploy service
- [ ] Test health endpoint

**Frontend Deployment**
- [ ] Push code to GitHub
- [ ] Import to Vercel
- [ ] Set environment variables:
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [ ] NEXT_PUBLIC_API_URL
- [ ] Deploy service
- [ ] Test application

**Testing & Quality Assurance**
- [ ] Test all API endpoints
- [ ] Test end-to-end flow:
  - [ ] Signup
  - [ ] Login
  - [ ] Add Farm
  - [ ] Generate Recommendation
  - [ ] Send SMS
- [ ] Test SMS templates in all languages (using Person D's sandbox)
- [ ] Verify SMS delivery statuses and opt-out handling
- [ ] Test offline mode
- [ ] Test realtime updates
- [ ] Test mobile responsiveness
- [ ] Test cross-browser compatibility
- [ ] Test error handling

**Security Checks**
- [ ] Ensure no hardcoded API keys
- [ ] Check CORS configuration
- [ ] Verify JWT authentication
- [ ] Check RLS policies
- [ ] Verify environment variables

**Documentation**
- [ ] Create README.md
- [ ] Document API endpoints
- [ ] Document environment variables
- [ ] Create deployment guide
- [ ] Document known issues

**Presentation Support**
- [ ] Prepare backup screenshots
- [ ] Record demo video (if needed)
- [ ] Test presentation environment
- [ ] Set up offline demo fallback
- [ ] Create QR code for live app

### Key Deliverables
- [ ] All services deployed and live
- [ ] Fully tested application
- [ ] Complete documentation
- [ ] Presentation materials
- [ ] Backup demo plan