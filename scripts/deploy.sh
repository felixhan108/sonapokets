 export PATH="/usr/local/bin:$PATH"
 
#!/bin/bash
set -e

# 도커 컨테이너 업데이트
docker-compose down

# frontend 빌드 (package.json이 변경되지 않았다면 npm install은 캐시 사용)
docker-compose build frontend --build-arg CACHEBUST=$(date +%s)

docker-compose pull
docker-compose up -d

# Nginx 설정 테스트
docker-compose exec -T nginx nginx -t

# Nginx 재시작
docker-compose restart nginx

echo "배포 완료!"