# Kiva Blog — Kubernetes Deployment with Helm

A 3-tier blog application deployed to Kubernetes using Helm charts.

## Architecture

- **Frontend** — React app served via Nginx
- **Backend** — Node.js/Express REST API
- **Database** — MongoDB

## Tech Stack

- Kubernetes (Minikube for local)
- Helm
- Docker
- Node.js
- React
- MongoDB
- Nginx

## Project Structure

kiva-chart/          — Helm chart
  templates/
    frontend.yaml    — Frontend Deployment + Service
    backend.yaml     — Backend Deployment + Service
    mongo.yaml       — MongoDB Deployment + Service
  values.yaml        — Configuration values
frontend/
  Dockerfile         — Multi-stage build (Node → Nginx)
  nginx.conf         — Reverse proxy config
backend/
  Dockerfile         — Node.js container

## How it works

Each tier runs in its own Kubernetes pod. The frontend Nginx container proxies API requests to the backend service. The backend connects to MongoDB using Kubernetes internal DNS. Helm manages all manifests and configuration through a single values.yaml file.

## Deploy locally

minikube start --driver=docker
helm install kiva ./kiva-chart
minikube service kiva-frontend
```

---

**GitHub repo description** (the one liner under the repo name):
```
3-tier blog app (React + Node.js + MongoDB) deployed to Kubernetes using Helm charts
