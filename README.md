# CPU-bound Worker Pool (Node.js Worker Threads)

This project demonstrates how Worker Threads improve performance for CPU-bound tasks (Fibonacci calculation).

## When should we use Worker Threads?
- Heavy calculations
- CPU-bound tasks
- When a single-threaded execution is slow

## When are Worker Threads not needed?
- Database queries
- Network requests
- Asynchronous file reading  
(Node.js already handles these efficiently)

## What happens if we use too many workers?
- Performance may not improve
- Workers compete for CPU resources
- Best practice: keep workers close to CPU cores

## Results (my run)
- Number of tasks: 65
- Execution without workers: 1:49.571
- Execution with Worker Pool (4 workers): 28.386s

```md
## Run with Docker
```bash
docker build -t cpu-worker-pool .
docker run --rm cpu-worker-pool

## Production Deployment

This project was deployed using Railway (Docker-based cloud platform).

The application runs as a background worker and outputs logs (no HTTP endpoint).
