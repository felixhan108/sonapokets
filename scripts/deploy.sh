 export PATH="/usr/local/bin:$PATH"
 
#!/bin/bash
set -e

# 도커 컨테이너 업데이트
docker-compose down
# frontend 빌드
# npm run build가 캐쉬로 인해 계속 반영 되지 않아 (CACHEBUST=$(date +%s)을 이용해 캐쉬 사용을 불가능하게 변경)
docker-compose build frontend --build-arg CACHEBUST=$(date +%s)
docker-compose pull
docker-compose up -d

# Nginx 설정 테스트
docker-compose exec -T nginx nginx -t

# Nginx 재시작
docker-compose restart nginx

echo "배포 완료!"