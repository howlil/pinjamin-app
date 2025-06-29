# CI/CD Setup untuk PBF Project

Dokumentasi ini menjelaskan setup CI/CD pipeline untuk deploy server ke VM GCP dengan PM2 dan frontend ke Cloud Run menggunakan Docker.

## Arsitektur Deployment

- **Server (Backend)**: Deploy ke VM GCP menggunakan PM2 dan pnpm
- **Frontend**: Deploy ke Cloud Run menggunakan Docker dan Artifact Registry

## Setup GitHub Secrets

Untuk menjalankan CI/CD pipeline, Anda perlu mengatur secrets berikut di GitHub repository:

### 1. Secrets untuk Deploy Server ke VM GCP

```
GCP_VM_IP=<IP_ADDRESS_VM_GCP>
GCP_VM_USER=<USERNAME_VM_GCP>
GCP_VM_SSH_PRIVATE_KEY=<SSH_PRIVATE_KEY>
```

### 2. Secrets untuk Deploy Frontend ke Cloud Run

```
GCP_PROJECT_ID=<PROJECT_ID_GCP>
GCP_SA_KEY=<SERVICE_ACCOUNT_KEY_JSON>
```

### 3. Environment Variables untuk Backend

```
DATABASE_URL=<DATABASE_CONNECTION_STRING>
JWT_SECRET=<JWT_SECRET_KEY>
EMAIL_USER=<EMAIL_USERNAME>
EMAIL_PASS=<EMAIL_PASSWORD>
XENDIT_SECRET_KEY=<XENDIT_SECRET>
PUSHER_APP_ID=<PUSHER_APP_ID>
PUSHER_KEY=<PUSHER_KEY>
PUSHER_SECRET=<PUSHER_SECRET>
PUSHER_CLUSTER=<PUSHER_CLUSTER>
```

### 4. Environment Variables untuk Frontend

```
VITE_API_URL=<BACKEND_API_URL>
VITE_PUSHER_KEY=<PUSHER_PUBLIC_KEY>
VITE_PUSHER_CLUSTER=<PUSHER_CLUSTER>
```

## Setup VM GCP untuk Backend

### 1. Persiapan VM

```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm globally
sudo npm install -g pnpm

# Install PM2 globally
sudo npm install -g pm2

# Install Git
sudo apt install git -y

# Buat user untuk aplikasi (opsional)
sudo adduser pbf-user
sudo usermod -aG sudo pbf-user
```

### 2. Setup SSH Key

```bash
# Pada local machine, generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# Copy public key ke VM
ssh-copy-id username@vm-ip-address

# Atau manual copy ke ~/.ssh/authorized_keys di VM
```

### 3. Setup Directory Structure

```bash
# Di VM, buat direktori untuk aplikasi
sudo mkdir -p /home/username/pbf-server
sudo chown username:username /home/username/pbf-server

# Buat direktori logs untuk PM2
mkdir -p /home/username/pbf-server/server/logs
```

## Setup GCP Service Account untuk Cloud Run & Artifact Registry

### 1. Enable APIs yang Diperlukan

```bash
# Enable APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

### 2. Buat Service Account

```bash
# Menggunakan gcloud CLI
gcloud iam service-accounts create pbf-deployer \
    --description="Service account for PBF deployment" \
    --display-name="PBF Deployer"
```

### 3. Berikan Permissions

```bash
# Cloud Run permissions
gcloud projects add-iam-policy-binding PROJECT_ID \
    --member="serviceAccount:pbf-deployer@PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/run.admin"

# Artifact Registry permissions
gcloud projects add-iam-policy-binding PROJECT_ID \
    --member="serviceAccount:pbf-deployer@PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/artifactregistry.admin"

# Storage permissions
gcloud projects add-iam-policy-binding PROJECT_ID \
    --member="serviceAccount:pbf-deployer@PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

# Service Account User
gcloud projects add-iam-policy-binding PROJECT_ID \
    --member="serviceAccount:pbf-deployer@PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/iam.serviceAccountUser"
```

### 4. Download Service Account Key

```bash
gcloud iam service-accounts keys create key.json \
    --iam-account=pbf-deployer@PROJECT_ID.iam.gserviceaccount.com
```

## Local Development & Testing

### 1. Setup Authentication Lokal

```bash
# Login ke Google Cloud
gcloud auth login

# Set project ID
gcloud config set project YOUR_PROJECT_ID

# Configure Docker untuk GCR/Artifact Registry
gcloud auth configure-docker
gcloud auth configure-docker asia-southeast2-docker.pkg.dev
```

### 2. Manual Build & Test Docker

```bash
# Build image
cd fe
docker build \
  --build-arg VITE_API_URL=http://localhost:3000 \
  --build-arg VITE_PUSHER_KEY=your-pusher-key \
  --build-arg VITE_PUSHER_CLUSTER=ap1 \
  -t pbf-frontend .

# Test run lokal
docker run -p 8080:80 pbf-frontend

# Push ke Artifact Registry (manual test)
docker tag pbf-frontend asia-southeast2-docker.pkg.dev/PROJECT_ID/pbf-frontend/pbf-frontend:latest
docker push asia-southeast2-docker.pkg.dev/PROJECT_ID/pbf-frontend/pbf-frontend:latest
```

### 3. Test Backend dengan PM2

```bash
cd server

# Install dependencies
pnpm install

# Generate Prisma client
pnpm run db:generate

# Start dengan PM2
pm2 start ecosystem.config.js --env production

# Monitor
pm2 status
pm2 logs pbf-server
```

## Workflow Files

### 1. Deploy Server (.github/workflows/deploy-server.yml)
- Trigger: Push ke branch `main` pada folder `server/**`
- Aksi: SSH ke VM GCP, clone/update code, install dependencies dengan pnpm, restart PM2

### 2. Deploy Frontend (.github/workflows/deploy-frontend.yml)
- Trigger: Push ke branch `main` pada folder `fe/**`
- Aksi: Build Docker image dengan pnpm, push ke Artifact Registry, deploy ke Cloud Run

## Monitoring dan Maintenance

### 1. PM2 Commands pada VM

```bash
# Melihat status aplikasi
pm2 status

# Melihat logs
pm2 logs pbf-server

# Restart aplikasi
pm2 restart pbf-server

# Monitor real-time
pm2 monit

# Reload aplikasi (zero-downtime)
pm2 reload pbf-server

# Save PM2 process list
pm2 save

# Resurrect saved processes
pm2 resurrect
```

### 2. Cloud Run Monitoring

```bash
# Melihat services
gcloud run services list

# Melihat logs
gcloud logs read --filter="resource.type=cloud_run_revision AND resource.labels.service_name=pbf-frontend"

# Update service
gcloud run services update pbf-frontend --region=asia-southeast2

# Melihat traffic
gcloud run services describe pbf-frontend --region=asia-southeast2
```

### 3. Artifact Registry Management

```bash
# List repositories
gcloud artifacts repositories list

# List images
gcloud artifacts docker images list asia-southeast2-docker.pkg.dev/PROJECT_ID/pbf-frontend

# Delete old images
gcloud artifacts docker images delete asia-southeast2-docker.pkg.dev/PROJECT_ID/pbf-frontend/pbf-frontend:TAG
```

## Troubleshooting

### 1. Authentication Issues

**Docker push denied:**
```bash
# Re-configure Docker authentication
gcloud auth configure-docker
gcloud auth configure-docker asia-southeast2-docker.pkg.dev

# Check authentication status
gcloud auth list

# Application default credentials
gcloud auth application-default login
```

**Service account issues:**
```bash
# Verify service account permissions
gcloud projects get-iam-policy PROJECT_ID --flatten="bindings[].members" --format="table(bindings.role)" --filter="bindings.members:pbf-deployer@PROJECT_ID.iam.gserviceaccount.com"
```

### 2. Server Deployment Issues

**SSH connection problems:**
```bash
# Test SSH connection
ssh -v username@vm-ip

# Check SSH key
ssh-add -l

# Generate new SSH key if needed
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
```

**PM2 issues:**
```bash
# Check PM2 status
pm2 list

# Kill all PM2 processes
pm2 kill

# Start fresh
pm2 start ecosystem.config.js --env production
pm2 save
```

**pnpm issues:**
```bash
# Clear pnpm cache
pnpm store prune

# Reinstall dependencies
rm -rf node_modules
pnpm install
```

### 3. Frontend Deployment Issues

**Docker build failures:**
```bash
# Build with verbose output
docker build --progress=plain -t pbf-frontend .

# Check Dockerfile syntax
docker build --dry-run .
```

**Artifact Registry issues:**
```bash
# Create repository if not exists
gcloud artifacts repositories create pbf-frontend \
  --repository-format=docker \
  --location=asia-southeast2

# List repositories
gcloud artifacts repositories list
```

### 4. Cloud Run Issues

**Service not responding:**
```bash
# Check service status
gcloud run services describe pbf-frontend --region=asia-southeast2

# View recent logs
gcloud logs read --limit=50 --filter="resource.type=cloud_run_revision"

# Update service configuration
gcloud run services update pbf-frontend \
  --memory=1Gi \
  --cpu=2 \
  --region=asia-southeast2
```

## Security Best Practices

1. **SSH Keys**: Gunakan SSH keys alih-alih password
2. **Firewall**: Batasi akses ke VM hanya untuk port yang diperlukan (22, 3000, 80, 443)
3. **Environment Variables**: Jangan hardcode secrets dalam code
4. **Service Account**: Gunakan principle of least privilege
5. **HTTPS**: Pastikan semua komunikasi menggunakan HTTPS
6. **Monitoring**: Setup monitoring dan alerting untuk deteksi anomali
7. **Image Security**: Scan Docker images untuk vulnerabilities
8. **Access Control**: Review akses secara berkala

## Performance Optimization

### 1. Backend (PM2)
```bash
# Use cluster mode for better performance
pm2 start ecosystem.config.js --env production -i max

# Monitor memory usage
pm2 monit

# Setup log rotation
pm2 install pm2-logrotate
```

### 2. Frontend (Docker)
```bash
# Use multi-stage build untuk ukuran image lebih kecil
# Enable gzip compression di nginx
# Setup CDN untuk static assets
```

### 3. Cloud Run
```bash
# Set appropriate resource limits
# Use minimum instances for faster cold starts
# Enable CPU allocation always allocated
```

## Maintenance Schedule

- **Daily**: Monitor logs dan performance
- **Weekly**: Update dependencies (pnpm update)
- **Monthly**: Update OS dan runtime
- **Quarterly**: Review security dan performance metrics
- **Yearly**: Audit akses dan permissions

## Backup Strategy

### 1. Database Backup
```bash
# Backup PostgreSQL (contoh)
pg_dump DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 2. Application Backup
```bash
# Backup application files
tar -czf pbf-backup-$(date +%Y%m%d).tar.gz /home/username/pbf-server
```

### 3. Docker Images
```bash
# Tag dan push stable versions
docker tag pbf-frontend:latest pbf-frontend:stable-v1.0.0
docker push asia-southeast2-docker.pkg.dev/PROJECT_ID/pbf-frontend/pbf-frontend:stable-v1.0.0
``` 