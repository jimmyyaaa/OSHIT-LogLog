#!/bin/bash
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SERVER="oshit-operational"
REMOTE_DIR="/data/dist/loglog-backend"
SCREEN_NAME="loglog-backend"
JAR_NAME="loglog-backend.jar"

echo "=== LogLog Backend Deploy ==="
echo ""

# 1. Build
echo "[1/3] Building backend..."
cd "$ROOT/backend"
./gradlew build -x test --quiet
JAR_PATH=$(ls build/libs/*.jar | grep -v plain | head -1)
if [ -z "$JAR_PATH" ]; then
  echo "ERROR: No jar found in build/libs/"
  exit 1
fi
echo "  Built: $JAR_PATH"

# 2. Upload
echo "[2/3] Uploading to $SERVER..."
ssh "$SERVER" "mkdir -p $REMOTE_DIR"
rsync -az --progress "$JAR_PATH" "$SERVER:$REMOTE_DIR/$JAR_NAME"
echo "  Uploaded to $REMOTE_DIR/$JAR_NAME"

# 3. Restart
echo "[3/3] Restarting service on $SERVER..."
ssh "$SERVER" bash -s <<EOF
  # Kill existing screen session if any
  screen -S $SCREEN_NAME -X quit 2>/dev/null || true
  sleep 1
  # Start new screen session
  cd $REMOTE_DIR
  screen -dmS $SCREEN_NAME java -jar $JAR_NAME --spring.profiles.active=prod
  echo "  Service started in screen session: $SCREEN_NAME"
EOF

echo ""
echo "=== Deploy complete ==="
echo "  Server:  $SERVER"
echo "  Path:    $REMOTE_DIR/$JAR_NAME"
echo "  Screen:  $SCREEN_NAME"
echo "  Profile: prod"
echo ""
echo "  To check logs:  ssh $SERVER screen -r $SCREEN_NAME"
