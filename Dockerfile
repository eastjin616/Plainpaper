FROM node:20-alpine

# 작업 디렉토리
WORKDIR /app

# 의존성 먼저 복사 (캐시 최적화)
COPY package*.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# Next.js 개발 서버 포트
EXPOSE 3000

# 개발 모드 실행
CMD ["npm", "run", "dev"]