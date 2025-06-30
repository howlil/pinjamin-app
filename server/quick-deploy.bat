@echo off
echo 🚀 Quick Deploy Backend to Cloud Run
echo =====================================

REM Check if Docker is running
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker tidak terdeteksi atau tidak berjalan
    echo Pastikan Docker Desktop sudah running
    pause
    exit /b 1
)

REM Check if gcloud is installed
gcloud version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Google Cloud CLI tidak terdeteksi
    echo Install dari: https://cloud.google.com/sdk/docs/install
    pause
    exit /b 1
)

REM Get project ID
echo 📝 Masukkan Project ID Google Cloud Anda:
set /p PROJECT_ID=Project ID: 

if "%PROJECT_ID%"=="" (
    echo ❌ Project ID tidak boleh kosong
    pause
    exit /b 1
)

echo ✅ Project ID: %PROJECT_ID%

REM Set project
gcloud config set project %PROJECT_ID%

REM Build and deploy
echo 🔨 Building Docker image...
docker build -t gcr.io/%PROJECT_ID%/pbf-server:latest .

echo 📤 Pushing to Container Registry...
gcloud auth configure-docker
docker push gcr.io/%PROJECT_ID%/pbf-server:latest

echo 🚀 Deploying to Cloud Run...
gcloud run deploy pbf-server ^
    --image gcr.io/%PROJECT_ID%/pbf-server:latest ^
    --platform managed ^
    --region asia-southeast2 ^
    --allow-unauthenticated ^
    --port 8080 ^
    --memory 1Gi ^
    --cpu 1 ^
    --max-instances 10

echo ✅ Deployment completed!
echo.
echo 🔗 Getting service URL...
for /f "delims=" %%i in ('gcloud run services describe pbf-server --region=asia-southeast2 --format="value(status.url)"') do set SERVICE_URL=%%i

echo.
echo 🎉 Backend deployed successfully!
echo Frontend URL: https://pbf-frontend-845113946067.asia-southeast2.run.app/
echo Backend URL: %SERVICE_URL%
echo API Base URL: %SERVICE_URL%/api/v1
echo.
echo 📝 Update frontend environment variable:
echo VITE_API_BASE_URL=%SERVICE_URL%/api/v1
echo.
echo 🔍 Test backend health:
echo curl %SERVICE_URL%/health
echo.
pause 