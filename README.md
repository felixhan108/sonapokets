# sonapokets

Nginx + ssl + Photoprism + Next.js

## CI/CD 파이프라인

이 저장소는 GitHub Actions를 통한 자동 배포를 지원합니다.
필요한 GitHub Secrets:

Github

- SSH_PRIVATE_KEY=string

./.env

- CHATGPT_API=string

/frontend/.env.local

- PHOTOPRISM_ADMIN_PASSWORD=''
- NEXT_PUBLIC_API_URL=https://sonapokets.day
