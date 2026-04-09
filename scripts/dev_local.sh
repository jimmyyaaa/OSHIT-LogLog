#!/bin/bash

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "Starting LogLog dev environment..."
echo ""

# Start backend
cd "$ROOT/backend"
./gradlew bootRun &
BACKEND_PID=$!

# Start frontend
cd "$ROOT/frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop both servers."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Stopped.'" EXIT

wait
