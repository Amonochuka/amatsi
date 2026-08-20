# KIJANIFARMER – SMART IRRIGATION ADVISORY PLATFORM

## Complete Project Description

---

## 1. Executive Summary

KijaniFarmer is a smart irrigation advisory platform designed specifically for smallholder farmers in Kenya's Lake Victoria Basin. The platform answers the farmer's most critical daily question: "Should I irrigate today, and if so, how much water should I use?"

The system combines satellite-based Earth observation data, weather intelligence, and a rule-based artificial intelligence engine to generate personalized, actionable irrigation recommendations. These recommendations are delivered via SMS (reaching farmers without smartphones) and through a responsive web dashboard (for those with internet access). The platform is designed to work offline, making it practical for rural areas with limited connectivity.

The name "Kijani" means "green" in Swahili, reflecting the platform's mission to promote sustainable, climate-resilient agriculture.

---

## 2. The Problem

Smallholder farmers in Kenya face three interconnected challenges that threaten their livelihoods and food security.

### 2.1 Water Wastage

Smallholder farmers lose up to 40 percent of water through inefficient irrigation practices. Without access to real-time data, farmers either over-water their crops, wasting scarce water resources, or under-water them, significantly reducing yields. This inefficiency is particularly critical in the Lake Victoria Basin, where water resources are under increasing pressure from pollution, climate change, and population growth.

### 2.2 Climate Uncertainty

Rainfall patterns in East Africa are becoming increasingly unpredictable. Traditional farming knowledge, passed down through generations, is no longer reliable for planning planting and irrigation schedules. Farmers face more frequent droughts, floods, and erratic rainfall, making it difficult to plan their agricultural activities.

### 2.3 Limited Information Access

Most smallholder farmers lack access to:
- Real-time weather data and forecasts
- Soil moisture information for their specific fields
- Scientific irrigation recommendations based on their crops
- Early warning systems for droughts, floods, or pest outbreaks

Seventy percent of smallholders lack access to weather data. Sixty percent of crop losses are directly attributable to water mismanagement. These statistics highlight the urgent need for accessible, practical solutions.

---

## 3. The Solution

KijaniFarmer provides a complete ecosystem of tools and services designed to address these challenges.

### 3.1 Smart Recommendations

Every day, the system analyzes multiple data sources to generate a personalized recommendation for each registered farm.

The system considers:
- Soil moisture levels derived from satellite data (KijaniBox)
- Current and forecasted rain probability
- Expected rainfall amounts
- Current temperature and humidity
- The farmer's tank water levels (manual input or sensor-based)
- The specific crop type and growth stage
- Field size and soil type

Based on this analysis, the system generates one of four recommendations:

IRRIGATE: The soil is too dry. The farmer should water now, with specific volume and timing guidance.

WAIT: Rain is likely within the next 24-48 hours. The farmer should delay irrigation to save water and money.

MONITOR: Soil moisture is adequate. The farmer should check conditions again tomorrow.

CONSERVE: Water is scarce. The farmer should use water sparingly and prioritize critical areas.

### 3.2 SMS Alerts

Farmers without smartphones receive recommendations directly via SMS. Messages are sent in their preferred language (English, Kiswahili, or Luo). The SMS includes the recommendation, the reason for the decision, and the estimated water saved by following the advice.

Example SMS: "KijaniFarmer: WAIT. 78% chance of rain tomorrow. Save 450L by delaying irrigation. – KijaniFarmer"

### 3.3 Web Dashboard

Farmers with internet access can view a comprehensive dashboard containing:
- Live weather data (temperature, rain probability, humidity)
- Soil moisture levels with visual indicators (optimal, caution, dry)
- Tank water levels with estimated days remaining
- Current recommendation with full explanation
- Historical recommendations and water saved metrics
- Water usage analytics with charts and trends
- Crop planning tools for future seasons

### 3.4 Offline-First Architecture

The mobile web application works even in areas with poor or no internet connectivity. Recommendations are cached locally in the browser. When connectivity is restored, the system automatically syncs all data. This is critical for rural areas where internet access is unreliable.

### 3.5 Realtime Updates

When the artificial intelligence engine generates a new recommendation, the dashboard updates automatically without requiring a page refresh. Farmers see the latest advice immediately. This is enabled by Supabase Realtime subscriptions.

### 3.6 Crop Planning

Farmers can plan ahead by viewing:
- Weather forecasts for the next 30 days
- Crop recommendations based on predicted conditions
- Optimal planting times based on historical patterns
- Expected yields and water requirements for different crops

---

## 4. The Farmer's Journey

### 4.1 Registration

A farmer signs up using their phone number and creates a password. They select their preferred language from English, Kiswahili, or Luo.

### 4.2 Farm Setup

The farmer adds their farm details through a simple form. This setup is performed once.

Required information includes:
- Farm location (via map picker or GPS coordinates)
- Crop type (maize, beans, tomatoes, onions, cabbage, potatoes, rice)
- Field size (in hectares)
- Soil type (loam, clay, sandy, silt, other)
- Irrigation method (drip, sprinkler, furrow, manual)
- Tank capacity (in liters)

### 4.3 Daily Recommendations

Every morning, the system automatically:
1. Fetches the latest weather and soil data from KijaniBox
2. Retrieves the farmer's crop and field information from the database
3. Applies the rule-based logic to generate a recommendation
4. Updates the web dashboard in real-time
5. Sends an SMS alert if the farmer has enabled this option

### 4.4 Farmer Action

The farmer follows the recommendation:
- If IRRIGATE: They water the field using the recommended volume at the recommended time
- If WAIT: They delay irrigation, saving water and money
- If MONITOR: They check conditions again the next day
- If CONSERVE: They reduce water usage and prioritize critical crops

### 4.5 Track Progress

Over time, the farmer can see measurable results:
- Water saved in liters
- Yield improvements in kilograms
- Cost savings from reduced water usage
- Historical weather patterns and their impact
- Recommendations history with outcomes

---

## 5. System Architecture

### 5.1 High-Level Architecture

KijaniFarmer is built as a three-tier architecture consisting of a presentation layer, an application layer, and a data layer.

The Presentation Layer consists of the Next.js web application, which provides the user interface. It is hosted on Vercel and supports both desktop and mobile browsers.

The Application Layer consists of two main components. The Golang API Gateway handles authentication, business logic, routing, and external communication. The Python AI Service implements the rule-based recommendation engine and integrates with KijaniBox.

The Data Layer consists of Supabase (PostgreSQL with TimescaleDB extension) for data storage, Redis for caching and task queuing, and external APIs (KijaniBox and Africa's Talking) for data ingestion and communication.

### 5.2 Data Flow

The system follows a clear data flow pattern.

KijaniBox API provides weather, soil moisture, and rainfall data to the Python AI Service. The Python AI Service applies rule-based logic to generate recommendations and returns them to the Golang API Gateway. The Golang API Gateway stores all data in Supabase and sends SMS alerts via Africa's Talking when required. The Next.js frontend displays data from the Golang API Gateway and uses Supabase Realtime for live updates.

### 5.3 External Integrations

KijaniBox serves as the primary data source. It aggregates Earth observation data from multiple satellite sources including Sentinel-1, Sentinel-2, ERA5, and meteoblue. The platform provides soil moisture data, weather forecasts, rainfall probability, and vegetation indices.

Africa's Talking serves as the SMS gateway. It enables the platform to send SMS alerts to farmers in their preferred language. The service supports delivery status tracking and automatic opt-out handling.

Supabase provides the database infrastructure. It offers PostgreSQL with TimescaleDB extension for time-series data, Row Level Security for data isolation, Realtime subscriptions for live updates, and built-in authentication.

Upstash provides managed Redis for the task queue, enabling reliable asynchronous processing of SMS tasks.

### 5.4 Security Architecture

The platform implements multiple layers of security. All API endpoints use JWT-based authentication. The Golang API validates all incoming tokens and extracts the user identity. Row Level Security in Supabase ensures that farmers can only access their own data.

All sensitive data, including API keys and database credentials, are stored as environment variables. The production environment never exposes these values. All communication between services uses HTTPS with TLS encryption.

---

## 6. Technical Components

### 6.1 Golang Backend API

The backend API is built with Golang using the Gin framework. It provides RESTful endpoints for all platform functionality.

The authentication system uses JWT tokens generated from user credentials. The Golang API validates these tokens and provides the user identity to downstream handlers.

The API implements CRUD operations for farm management, including creating, reading, updating, and deleting farm records. It also provides endpoints for generating recommendations, fetching weather data, sending SMS alerts, and retrieving alert history.

The Golang API integrates with three external services: Supabase for database operations, the Python AI Service for recommendations, and Africa's Talking for SMS delivery. It uses Asynq with Redis for asynchronous task processing, specifically for sending SMS messages without blocking the main API response.

### 6.2 Python AI Service

The Python AI Service is built with FastAPI and implements the rule-based recommendation engine. It receives farm data and returns a recommendation.

The rule engine implements several decision rules in priority order. If rain probability exceeds 60 percent, the system recommends WAIT and calculates the water saved. If soil moisture is below 30 percent, the system recommends IRRIGATE with the calculated water volume. If soil moisture is between 30 and 60 percent, the system recommends MONITOR. If the tank level is below 500 liters, the system recommends CONSERVE. If soil moisture exceeds 80 percent, the system recommends MONITOR with a warning about over-saturation.

The system calculates water requirements based on crop type. Different crops have different water needs, ranging from 20 liters per square meter per week for beans to 40 liters per square meter per week for rice. The default is 25 liters per square meter per week.

The KijaniBox client in the AI service fetches weather forecasts, soil moisture data, and rainfall probability for any given latitude and longitude.

### 6.3 Next.js Frontend

The frontend is built with Next.js using TypeScript and Tailwind CSS. It provides a responsive, mobile-first user experience.

The landing page serves as the public face of the platform. It includes a hero section with the tagline and call-to-action, a problem section with statistics, a solution section explaining the three-step process, a tech stack section showing the technologies used, and a final call-to-action for signup.

The authentication pages implement login and signup functionality using Supabase Auth. The login page accepts phone number or email and password. The signup page collects name, phone number, password, and language preference. Both pages include form validation and error handling.

The dashboard is the main user interface after login. It includes a persistent sidebar navigation with sections for Overview, Irrigation Advisor, Crop Planner, My Farms, and Alerts History.

The Overview page displays the current recommendation, weather card, soil moisture card, tank level card, water usage chart, and recent alerts.

The Irrigation Advisor page allows farmers to generate new recommendations and view their history.

The Crop Planner page shows 30-day weather forecasts and provides crop recommendations based on predicted conditions.

The My Farms page allows farmers to manage their farm plots, including adding, editing, and deleting farms.

The Alerts History page shows all SMS messages sent to the farmer with delivery status.

The frontend implements an offline-first architecture. The useOffline hook detects connectivity status. Data is cached in localStorage for offline access. When connectivity is restored, the system automatically syncs cached data. The header displays an offline indicator showing the last sync time.

The frontend implements realtime updates using the useRealtime hook. This subscribes to Supabase Realtime channels and updates the dashboard when new recommendations are inserted.

### 6.4 Database Schema

The database schema consists of six main tables.

The farmers table stores user information including phone number, name, email, language preference, and SMS opt-in status.

The farms table stores farm plot information including name, area, crop type, planting date, soil type, irrigation method, tank capacity, and location.

The environmental_data table stores time-series data for each farm, including temperature, rainfall, soil moisture, rain probability, humidity, wind speed, and vegetation index. This table uses TimescaleDB for efficient time-series storage and querying.

The recommendations table stores all generated recommendations including the action, volume, reason, water saved estimate, and read status.

The sms_logs table tracks all SMS messages sent, including the recipient phone number, message content, delivery status, and timestamps.

The water_usage_logs table tracks water usage for analytics and reporting.

Row Level Security is enabled on all tables. Policies ensure that farmers can only access their own data. Authentication is provided by Supabase Auth.

### 6.5 Task Queue

The task queue is implemented using Asynq with Redis as the backing store. It handles asynchronous processing of SMS tasks.

When a farmer requests an SMS, the task is placed in the queue rather than being sent immediately. A worker process runs in the background, fetching tasks from the queue and executing them. This prevents slow SMS delivery from blocking the main API response.

The task includes retry logic for failed deliveries. If an SMS fails, the task is retried up to three times with exponential backoff.

### 6.6 Deployment Infrastructure

The system is deployed across multiple platforms.

Supabase provides the managed PostgreSQL database with TimescaleDB extension. The database includes automated backups, point-in-time recovery, and connection pooling.

Vercel hosts the Next.js frontend with automatic builds and deployments from the GitHub repository. Vercel provides CDN distribution, automatic HTTPS, and preview deployments for pull requests.

Railway hosts the Golang backend API and Python AI Service. Railway provides container-based deployment, environment variable management, and automatic HTTPS.

Upstash provides managed Redis for the task queue. Upstash includes automatic scaling, backups, and monitoring.

All services are connected via HTTPS with TLS encryption. Environment variables are stored securely in each platform's configuration system.

---

## 7. Feature Deep Dive

### 7.1 The "Irrigate or Wait?" Decision Engine

This is the heart of KijaniFarmer. Instead of showing complex graphs and raw data, the system gives a clear, simple recommendation.

When the system recommends IRRIGATE, the farmer sees the soil moisture percentage, the recommended volume in liters, the best time to irrigate, and the expected duration.

When the system recommends WAIT, the farmer sees the rain probability, expected rainfall amount, current soil moisture, and the water saved by waiting.

This simplicity is intentional. The target user is a smallholder farmer who may not be comfortable interpreting complex data. They need a clear, actionable answer to a simple question: What should I do today?

### 7.2 Water Savings Calculator

Every time the system recommends waiting for rain, it calculates and displays the estimated water saved. This gives farmers a tangible metric of the platform's value.

The calculation considers the crop type, field size, and the number of days until the expected rain. The water saved is displayed in liters and can be accumulated over time to show total savings.

This metric is also used in the pitch to demonstrate impact. For example, "John Ochieng saved 2,450 liters of water in one month by following our advice."

### 7.3 Crop Planner

The crop planner helps farmers plan ahead for future seasons. It analyzes 30-day weather forecasts and provides recommendations on what to plant and when to plant it.

The system considers predicted rainfall, temperature patterns, and soil moisture trends. It recommends crops that are well-suited to the predicted conditions. It also calculates expected yields and water requirements for each recommended crop.

This feature helps farmers shift from reactive decision-making to proactive planning, increasing their resilience to climate variability.

### 7.4 Risk Alerts

The system continuously monitors for potential risks. If a drought is predicted, the system sends an alert with water conservation recommendations. If heavy rainfall is expected, the system sends a flood warning with protective measures. If conditions are favorable for pest outbreaks, the system sends an alert with preventive measures.

These alerts are delivered via SMS and displayed on the dashboard. They help farmers prepare for and mitigate climate risks.

### 7.5 Offline Mode

When internet is unavailable, the application continues to function. The dashboard displays the last known recommendations, cached weather data, and historical water usage. The offline indicator shows the last synchronization time.

When connectivity is restored, the system automatically syncs all cached data. Pending actions are processed, and the dashboard is updated with the latest information.

This is critical for rural areas where internet access is intermittent or nonexistent.

### 7.6 Realtime Dashboard Updates

When the AI generates a new recommendation, the dashboard updates immediately without requiring a page refresh. This is enabled by Supabase Realtime subscriptions.

The farmer sees the new recommendation appear automatically. This creates a sense of immediacy and helps the farmer trust that the information is current and relevant.

---

## 8. Technology Stack Summary

### 8.1 Frontend Technologies

Next.js serves as the React framework with TypeScript for type safety. Tailwind CSS provides utility-first styling. shadcn/ui offers reusable component primitives. Recharts creates data visualizations. Leaflet integrates mapping functionality. Axios handles HTTP requests. Supabase provides authentication and realtime subscriptions.

### 8.2 Backend Technologies

Golang serves as the primary programming language with the Gin web framework. PostgreSQL with TimescaleDB extension provides the database. Asynq implements the task queue. Redis handles caching and queue storage.

### 8.3 AI Service Technologies

Python serves as the programming language with FastAPI as the web framework. The rule-based recommendation engine implements the core logic. HTTPX and Requests handle external API calls.

### 8.4 External Services

Supabase provides the database, authentication, and realtime subscriptions. KijaniBox provides Earth observation data. Africa's Talking provides SMS capabilities. Upstash provides managed Redis. Vercel hosts the frontend. Railway hosts the backend services.

---

## 9. Key Differentiators

### 9.1 Offline-First Architecture

Unlike most digital farming solutions that require continuous internet connectivity, KijaniFarmer is designed to work offline. This makes it practical for rural areas where connectivity is unreliable or nonexistent.

### 9.2 SMS Integration

By using SMS, KijaniFarmer reaches farmers who do not own smartphones. This is a significant percentage of smallholder farmers in Kenya. The SMS messages are sent in the farmer's preferred language.

### 9.3 Local Language Support

The platform supports English, Kiswahili, and Luo. This ensures that farmers can understand the recommendations in their native language. This increases adoption and comprehension.

### 9.4 Rule-Based AI

Instead of using complex machine learning models that require extensive training data, the system uses transparent, explainable rules. Farmers and judges can understand why a particular recommendation was made. This builds trust and makes the system auditable.

### 9.5 Simple, Actionable Output

The system does not overwhelm farmers with data. It provides a single, clear recommendation: IRRIGATE, WAIT, MONITOR, or CONSERVE. This simplicity is the product's strength.

---

## 10. Impact Metrics

### 10.1 Measurable Outcomes

Water saved is measured in liters. Every time the system recommends waiting for rain, the water saved is calculated and displayed. This metric accumulates over time, showing the total water conservation impact.

Yield increase is measured in kilograms. Farmers can compare their yields before and after using KijaniFarmer. The system provides tools to track and report yield improvements.

Income improvement is measured in Kenyan Shillings. Farmers can calculate the additional income from improved yields and reduced water costs.

Number of farmers reached is a key adoption metric. The platform tracks registered farmers, active users, and recommendation engagement.

### 10.2 Example Impact Statement

John Ochieng, a smallholder farmer in Kisumu, saved 2,450 liters of water in one month by following KijaniFarmer's recommendations. His maize yield increased by 25 percent compared to the previous season. He now checks his recommendations daily and has reduced his water costs significantly.

---

## 11. Future Roadmap

### 11.1 Post-Hackathon Enhancements

Enhanced AI will be implemented by replacing the rule-based engine with machine learning models. This will enable more accurate predictions and recommendations based on historical data and patterns.

Community features will be added including farmer forums, peer-to-peer learning, and group buying for agricultural inputs.

Marketplace integration will enable direct access to suppliers, price comparisons, and bulk purchasing opportunities.

Financial inclusion will be enabled through M-PESA integration, micro-loans, and crop insurance.

### 11.2 Scalability Considerations

The architecture is designed to scale. The Golang API can handle thousands of concurrent requests. The database can be scaled vertically or horizontally. The task queue can be distributed across multiple workers.

The platform can be replicated across regions, providing localized versions for different parts of Africa.

---

## 12. Alignment with Hackathon Requirements

### 12.1 Track 2 Requirements

The platform implements smart irrigation management by providing daily recommendations to farmers. It includes mobile advisory applications through SMS alerts and responsive web design. It monitors soil moisture through KijaniBox satellite data integration.

Weather-informed recommendations are generated by combining weather forecasts, soil moisture data, and crop water requirements. Water consumption analytics are provided through the dashboard with charts and historical data.

Offline-first farming applications are implemented through caching and local storage. The platform works without internet connectivity.

### 12.2 Emerging Technology Requirements

The platform integrates at least one emerging technology. Artificial intelligence is used in the rule-based recommendation engine. Cloud computing is used through Supabase, Railway, and Vercel.

The platform also demonstrates edge computing principles through offline-first architecture and local data caching.

---

## 13. Conclusion

KijaniFarmer is a practical, scalable, and impactful solution to the water management challenges facing smallholder farmers in Kenya. By combining satellite data, rule-based AI, and SMS delivery, the platform provides actionable recommendations that save water, increase yields, and build climate resilience.

The technology stack is modern, well-chosen, and aligned with the hackathon requirements. Golang provides high-performance backend APIs. Next.js delivers a responsive, offline-capable frontend. Supabase offers database, authentication, and realtime capabilities. KijaniBox and Africa's Talking provide essential external integrations.

The platform is designed with the user in mind. It is simple enough for any farmer to use, yet sophisticated enough to provide genuine value. It works offline, reaches farmers without smartphones, and communicates in local languages.

KijaniFarmer represents a step toward a more sustainable, resilient agricultural future for Kenya's Lake Victoria Basin and beyond. It is not just a hackathon project but a viable solution to a real-world problem.

---

*KijaniFarmer – Built for the Zone01 Kisumu GreenTech Hackathon 2026*