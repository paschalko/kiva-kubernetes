# Kiva Blog: Kubernetes Deployment with Helm

A 3-tier blog application (React, Node.js/Express, MongoDB) packaged as a Helm chart
and deployed to Kubernetes, with rolling updates, health probes and persistent storage.

## Architecture

```
Browser → NodePort Service → Frontend (Nginx, 2 replicas)
                                  │  /api, /uploads
                                  ▼
                            Backend (Express API) ──► MongoDB
                                  │                     │
                           uploads volume (PVC)   data volume (PVC)
```

- **Frontend**: React app built with Vite and served by Nginx, which also proxies `/api` to the backend
- **Backend**: Node.js/Express REST API with JWT authentication
- **Database**: MongoDB with a PersistentVolumeClaim, so data survives pod restarts

## What the chart does

| Feature | How |
|---|---|
| Zero-downtime updates | `RollingUpdate` with `maxUnavailable: 0`, so new pods must pass readiness checks before old ones stop |
| Health checks | Readiness and liveness probes on every tier (`/healthz`, `/api/health`, MongoDB TCP) |
| Secrets | JWT secret stored in a Kubernetes Secret, generated on first install and kept on upgrades |
| Persistence | PVCs for MongoDB data and uploaded images |
| Resource control | CPU and memory requests and limits on every container |
| Configuration | All settings in one `values.yaml` |

## Project structure

```
kiva-chart/
  templates/
    frontend.yaml   Frontend Deployment + NodePort Service
    backend.yaml    Backend Deployment + Service
    mongo.yaml      MongoDB Deployment + Service
    secret.yaml     JWT secret
    pvc.yaml        Storage for MongoDB and uploads
  values.yaml
frontend/
  Dockerfile        Multi-stage build (Node → Nginx)
  nginx.conf        Static files + reverse proxy to the backend
backend/
  Dockerfile        Node.js API image (runs as non-root)
```

## Deploy locally (Minikube)

```bash
minikube start --driver=docker

# Build images inside Minikube's Docker
eval $(minikube docker-env)
docker build -t kiva-frontend:v2 ./frontend
docker build -t kiva-backend:v2 ./backend

helm install kiva ./kiva-chart
kubectl get pods -w          # wait until all pods are Running and Ready
minikube service kiva-frontend
```

Upgrade after a change, with no downtime:

```bash
docker build -t kiva-backend:v3 ./backend
helm upgrade kiva ./kiva-chart --set backend.image=kiva-backend:v3
kubectl rollout status deployment/kiva-backend
```

## Run the backend without Kubernetes

```bash
cd backend
cp .env.example .env    # set JWT_SECRET and MONGODB_URI
npm install && npm run dev
```
