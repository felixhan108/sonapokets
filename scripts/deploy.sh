export PATH="/usr/local/bin:$PATH"

#!/bin/bash
set -e

# 컨테이너 재시작 그리고 빌드

# docker-compose down
# docker-compose pull
docker-compose up -d --build