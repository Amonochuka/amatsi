# AMATSI - Folder Structure

```
AMATSI/
├── README.md                 # Project overview
├── docker-compose.yml        # Root Docker Compose orchestration
│
├── ai-service/               # Python AI service (FastAPI)
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .env                  # Environment variables
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py           # FastAPI entry point
│   │   ├── models/           # Request/response schemas
│   │   │   ├── request.py
│   │   │   └── response.py
│   │   ├── routes/
│   │   │   └── predict.py    # Prediction endpoints
│   │   └── services/
│   │       └── recommendation.py  # Recommendation logic
│   ├── test/
│   │   └── test_recommendation.py
│   └── utils/
│       └── helpers.py
│
├── backend/                  # Go backend API
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── go.mod / go.sum
│   ├── .env                  # Environment variables
│   ├── README.md
│   ├── cmd/
│   │   └── server/
│   │       └── main.go       # Go entry point
│   ├── internal/
│   │   ├── api/
│   │   │   ├── handlers/     # HTTP handlers
│   │   │   │   ├── alert_handler.go
│   │   │   │   ├── auth_handler.go
│   │   │   │   ├── farm_handler.go
│   │   │   │   ├── recommendation_handler.go
│   │   │   │   └── weather_handler.go
│   │   │   ├── middleware/
│   │   │   │   ├── auth.go
│   │   │   │   ├── cors.go
│   │   │   │   ├── logger.go
│   │   │   │   └── rate_limit.go
│   │   │   └── routes/
│   │   │       ├── alerts.go
│   │   │       ├── auth.go
│   │   │       ├── farms.go
│   │   │       ├── recommendations.go
│   │   │       ├── routes.go
│   │   │       └── weather.go
│   │   ├── clients/          # External service clients
│   │   │   ├── africastalking.go  # SMS
│   │   │   ├── kijanibox.go       # Weather
│   │   │   ├── python_ai.go       # AI service
│   │   │   ├── redis.go
│   │   │   └── supabase.go
│   │   ├── config/
│   │   │   └── config.go
│   │   ├── models/           # Domain models
│   │   │   ├── alert.go
│   │   │   ├── farm.go
│   │   │   ├── recommendation.go
│   │   │   ├── user.go
│   │   │   └── weather.go
│   │   ├── queue/            # Async job queue
│   │   │   ├── asynq.go
│   │   │   ├── tasks.go
│   │   │   └── workers/
│   │   │       └── sms_worker.go
│   │   ├── repository/       # Data access layer
│   │   │   ├── alert_repository.go
│   │   │   ├── farm_repository.go
│   │   │   ├── recommendation_repository.go
│   │   │   └── weather_repository.go
│   │   └── services/         # Business logic
│   │       ├── alert_service.go
│   │       ├── farm_service.go
│   │       └── recommendation_service.go
│   ├── migrations/           # SQL migrations
│   │   ├── 001_create_farmers.sql
│   │   ├── 002_create_farms.sql
│   │   ├── 003_create_environmental_data.sql
│   │   ├── 004_create_recommendations.sql
│   │   └── 005_create_sms_logs.sql
│   ├── scripts/
│   │   └── seed_data.sql
│   └── test/
│       ├── api_test.go
│       ├── service_test.go
│       └── mock/
│
├── frontend/                 # Next.js frontend
│   ├── README.md
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   ├── .env.local
│   ├── app/                  # App Router pages
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Landing page
│   │   ├── api/
│   │   │   └── auth/[...nextauth]/route.ts
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   └── dashboard/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── alerts/page.tsx
│   │       ├── farms/page.tsx
│   │       ├── irrigation/page.tsx
│   │       └── planner/page.tsx
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── dashboard/
│   │   │   ├── FarmMap.tsx
│   │   │   ├── RecentAlerts.tsx
│   │   │   ├── RecommendationCard.tsx
│   │   │   ├── SoilMoistureCard.tsx
│   │   │   ├── TankLevelCard.tsx
│   │   │   ├── WaterUsageChart.tsx
│   │   │   └── WeatherCard.tsx
│   │   ├── landing/
│   │   │   ├── CTASection.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ProblemSection.tsx
│   │   │   ├── SolutionSection.tsx
│   │   │   └── TechStackSection.tsx
│   │   └── ui/               # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Footer.tsx
│   │       ├── Header.tsx
│   │       ├── Input.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── Navbar.tsx
│   │       └── Sidebar.tsx
│   ├── hooks/                # React hooks
│   │   ├── useAuth.ts
│   │   ├── useOffline.ts
│   │   └── useRealtime.ts
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   └── transform.ts
│   │   ├── mock/data.ts
│   │   └── utils/
│   │       ├── formatDate.ts
│   │       ├── formatNumber.ts
│   │       └── validators.ts
│   ├── public/
│   │   ├── icons/
│   │   └── images/
│   │       ├── favicon.ico
│   │       ├── hero-bg.jpg
│   │       └── logo.png
│   ├── styles/
│   │   └── tailwind.css
│   └── types/
│       └── index.ts

└── docs/                     # Documentation
    └── folderstructure.md    # This file
```
