# Go-Gist Signal Server

A WebRTC signaling server built with Next.js for peer-to-peer communication.

## Features

- 🚀 WebRTC signaling for peer-to-peer connections
- 🔐 Session-based peer management
- 📡 Signal polling and sending API
- 🎨 Modern UI with Rubik Storm font and animations
- 🐳 Docker-ready with multi-stage builds
- ☸️ Kubernetes deployment manifests
- 🔒 Comprehensive security scanning

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm
- Vercel KV (Redis) for session storage

### Environment Variables

Create a `.env.local` file:

```env
KV_URL=your-redis-url
KV_REST_API_URL=your-kv-rest-api-url
KV_REST_API_TOKEN=your-kv-api-token
KV_REST_API_READ_ONLY_TOKEN=your-kv-readonly-token
```

### Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run tests
pnpm test

# Run linting
pnpm lint

# Format code
pnpm format
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## API Endpoints

| Endpoint              | Method | Description                    |
| --------------------- | ------ | ------------------------------ |
| `/api/session/create` | POST   | Create or join a session       |
| `/api/session/peers`  | POST   | Get list of peers in a session |
| `/api/signal/send`    | POST   | Send a signal to a peer        |
| `/api/signal/poll`    | POST   | Poll for incoming signals      |

## CI/CD Pipeline

This project uses GitHub Actions for a comprehensive CI/CD pipeline:

### Workflows

| Workflow             | Description                          | Trigger                  |
| -------------------- | ------------------------------------ | ------------------------ |
| **CI**               | Tests and builds                     | Push to main/master, PRs |
| **Code Quality**     | ESLint, Prettier, TypeScript, CodeQL | Push to main/master, PRs |
| **DevSecOps**        | SAST, SCA, Secret Detection, OWASP   | Push to main/master, PRs |
| **Containerization** | Docker build, smoke test, publish    | Push to main/master      |
| **CD**               | Deploy to Kubernetes, DAST           | After Containerization   |

### Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CI/CD Pipeline                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐  ┌──────────────┐  ┌───────────┐                  │
│  │    CI    │  │ Code Quality │  │ DevSecOps │                  │
│  │  Tests   │  │   ESLint     │  │   SAST    │                  │
│  │  Build   │  │   Prettier   │  │   SCA     │                  │
│  │          │  │   TypeScript │  │  Secrets  │                  │
│  │          │  │   CodeQL     │  │   OWASP   │                  │
│  └────┬─────┘  └──────┬───────┘  └─────┬─────┘                  │
│       │               │                │                         │
│       └───────────────┼────────────────┘                         │
│                       ▼                                          │
│              ┌─────────────────┐                                 │
│              │ Containerization│                                 │
│              │   Docker Build  │                                 │
│              │   Smoke Test    │                                 │
│              │   Publish GHCR  │                                 │
│              │ Publish DockerHub│                                │
│              └────────┬────────┘                                 │
│                       │                                          │
│                       ▼                                          │
│              ┌─────────────────┐                                 │
│              │       CD        │                                 │
│              │  Deploy to K8s  │                                 │
│              │  Health Check   │                                 │
│              │  DAST (ZAP)     │                                 │
│              │  Auto-Rollback  │                                 │
│              └─────────────────┘                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Required GitHub Secrets

#### For Containerization

| Secret               | Description            |
| -------------------- | ---------------------- |
| `DOCKERHUB_USERNAME` | DockerHub username     |
| `DOCKERHUB_TOKEN`    | DockerHub access token |

#### For CD (DigitalOcean Kubernetes)

| Secret                        | Description               |
| ----------------------------- | ------------------------- |
| `DIGITALOCEAN_ACCESS_TOKEN`   | DigitalOcean API token    |
| `DIGITALOCEAN_CLUSTER_NAME`   | Name of your DOKS cluster |
| `KV_URL`                      | Redis connection URL      |
| `KV_REST_API_URL`             | Vercel KV REST API URL    |
| `KV_REST_API_TOKEN`           | Vercel KV API token       |
| `KV_REST_API_READ_ONLY_TOKEN` | Vercel KV read-only token |

#### GitHub Environment Variables

| Variable  | Description                                        |
| --------- | -------------------------------------------------- |
| `APP_URL` | Application URL (e.g., https://signal.example.com) |

## Docker

### Build and Run Locally

```bash
# Build
docker build -t go-gist-signal-server .

# Run
docker run -p 3000:3000 \
  -e KV_URL=your-kv-url \
  -e KV_REST_API_URL=your-kv-rest-api-url \
  -e KV_REST_API_TOKEN=your-token \
  go-gist-signal-server
```

### Container Registries

Images are published to:

- **GHCR:** `ghcr.io/skushagra/go-gist-signal-server`
- **DockerHub:** `kushagra0/go-gist-signal-server`

## Kubernetes Deployment

### Prerequisites

1. A DigitalOcean Kubernetes cluster
2. cert-manager installed for TLS
3. nginx-ingress controller

### Manual Deployment

```bash
# Apply manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml  # Edit with your secrets first
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa.yaml

# Check status
kubectl get pods -n go-gist-signal-server
```

### Deployment Features

- **Rolling Updates:** Zero-downtime deployments
- **Auto-scaling:** HPA with 2-10 replicas based on CPU/memory
- **Health Checks:** Liveness and readiness probes
- **TLS:** Automatic certificate via cert-manager
- **Auto-Rollback:** Reverts to previous version on failure

## Security

### Security Scanning

- **SAST:** Semgrep static analysis
- **SCA:** Trivy vulnerability scanning
- **DAST:** OWASP ZAP dynamic testing
- **Secrets:** Gitleaks secret detection
- **Dependencies:** OWASP Dependency Check

### Security Headers

The application includes security headers via Next.js config and Ingress annotations.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [WebRTC Signaling](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling)
- [OWASP ZAP](https://www.zaproxy.org/)
- [DigitalOcean Kubernetes](https://docs.digitalocean.com/products/kubernetes/)

## License

MIT


Hi