#!/bin/bash

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "=== LogLog 本地开发环境 ==="
echo ""

# Install frontend deps if needed
if [ ! -d "$ROOT/frontend/node_modules" ]; then
  echo "[frontend] 安装依赖..."
  cd "$ROOT/frontend" && npm install
fi

# Start backend
echo "[backend] 启动 Spring Boot..."
cd "$ROOT/backend"
./gradlew bootRun -q &
BACKEND_PID=$!

# Wait for backend to be ready
echo "[backend] 等待后端启动..."
for i in $(seq 1 30); do
  if curl -s -o /dev/null http://localhost:8080/api/logs?from=2000-01-01\&to=2000-01-02 2>/dev/null; then
    echo "[backend] 已就绪 http://localhost:8080"
    break
  fi
  sleep 1
done

# Start frontend
echo "[frontend] 启动 Vite..."
cd "$ROOT/frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:8080"
echo "  H2 Console: http://localhost:8080/h2-console"
echo ""
echo "按 Ctrl+C 停止所有服务"

cleanup() {
  echo ""
  echo "正在停止服务..."
  kill $FRONTEND_PID 2>/dev/null
  kill $BACKEND_PID 2>/dev/null
  wait $FRONTEND_PID 2>/dev/null
  wait $BACKEND_PID 2>/dev/null
  echo "已停止。"
}

trap cleanup EXIT INT TERM

wait
