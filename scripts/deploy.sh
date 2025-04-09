 export PATH="/usr/local/bin:$PATH"
 
#!/bin/bash
set -e

# 도커 컨테이너 업데이트
docker-compose down
docker-compose pull
docker-compose up -d

npm version patch # 0.1.0 -> 0.1.1
# npm run build가 캐쉬로 인해 계속 반영 되지 않아 (CACHEBUST=$(date +%s)을 이용해 캐쉬 사용을 불가능하게 변경)
docker-compose build frontend --build-arg CACHEBUST=$(date +%s)

# 프론트엔드를 up -d 처럼 빌드 다시한번 더 up
docker-compose up -d frontend
# Nginx 설정 테스트
docker-compose exec -T nginx nginx -t
# Nginx 재시작
docker-compose restart nginx
# 프론트엔드 재시작

echo "배포 완료!"