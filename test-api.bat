@echo off
echo 🧪 Testing GovConnect API Endpoints...
echo.

echo 1️⃣ Testing Health Check...
curl -s http://localhost:5000/api/health
echo.
echo.

echo 2️⃣ Testing Citizen Registration...
curl -s -X POST http://localhost:5000/api/auth/register/citizen ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"mobile\":\"9876543210\",\"password\":\"password123\"}"
echo.
echo.

echo 3️⃣ Testing Login...
curl -s -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
echo.
echo.

echo ✅ API Tests Complete! Check responses above.
pause
