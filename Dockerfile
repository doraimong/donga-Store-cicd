# Node.js 버전 14 사용
FROM node:14

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json을 복사
COPY package*.json ./

# 종속성 설치(ci: 이전빌드에서 서리된 종속성 캐시하여 설치 속도 향상 / install: 매번 모든 종속성 다시 다운 및 설치)
RUN npm ci

# 애플리케이션 소스 코드를 복사
COPY . .

EXPOSE 5000

# 애플리케이션 실행 (CMD : Docker 컨테이너가 시작될 때 기본적으로 실행되는 명령어
CMD ["npm", "run", "start"]
