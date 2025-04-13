export PATH="/usr/local/bin:$PATH"

#!/bin/bash
set -e

# 도커 컨테이너 실행 정지
docker-compose down --remove-orphans
# 도커 이미지 업데이트
docker-compose pull


docker-compose build frontend

docker-compose build backend


# 애플리케이션 빌드 및 시작 (docker-compose.yml의 build 설정 사용)
#    --build: docker-compose.yml의 build 섹션에 정의된 서비스 이미지를 빌드 (소스 변경 시 재빌드)
#    -d: 백그라운드에서 컨테이너 실행
docker-compose up -d photoprism nginx
docker-compose up -d frontend
docker-compose up -d backend

# backend 빌드
  # -t 옵션: 이미지 이름과 태그(선택사항)를 지정합니다.
  # . : 현재 디렉토리의 Dockerfile을 사용하라는 의미입니다.
# docker build -t your-java-app-image ./backend

# Nginx 설정 테스트
# (선택사항) Nginx 설정 유효성 검사
# docker-compose exec -T nginx nginx -t

# Nginx 재시작
# docker-compose restart nginx

# 프론트엔드 재시작
echo "배포 완료!"



docker-compose up -d ollama