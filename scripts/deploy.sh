 export PATH="/usr/local/bin:$PATH"
 
#!/bin/bash
set -e

# 도커 컨테이너 업데이트
docker-compose down

# frontend 새로 빌드 (캐시 없이)
docker-compose build frontend --no-cache

docker-compose pull
docker-compose up -d

# Nginx 설정 테스트
docker-compose exec -T nginx nginx -t

# Nginx 재시작
docker-compose restart nginx

echo "배포 완료!"