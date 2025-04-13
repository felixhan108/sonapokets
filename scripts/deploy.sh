export PATH="/usr/local/bin:$PATH"

#!/bin/bash
set -e

# 백엔드 서비스 빌드 및 시작
# up : 서비스 시작
# --build : 이미지 빌드
# --force-recreate : 컨테이너 강제 재생성
docker-compose up --build --force-recreate backend

# 프론트엔드 서비스 빌드 및 시작
# up : 서비스 시작
# --build : 이미지 빌드
# --force-recreate : 컨테이너 강제 재생성
docker-compose up --build --force-recreate frontend

# Nginx 서비스 시작
# up : 서비스 시작
# --force-recreate : 컨테이너 강제 재생성
docker-compose up --force-recreate nginx