# 🍏 himath - 스마트 교육 웹 서비스 (Next.js Boilerplate)

Vercel에 빌드 에러 없이 즉시 배포 가능한 **himath** 교육용 웹 서비스의 모던 애플(Apple) 감성 뼈대(Boilerplate) 프로젝트입니다.

---

## 🌟 프로젝트 특징

1. **Vercel 배포 최적화**: 엄격한 TypeScript 및 빌드 검증을 거쳐 에러 없이 즉시 배포가 가능합니다.
2. **모던 애플 감성 UI**:
   - 여백이 많고 극도로 세련된 배경 (`bg-gray-50`)과 짙은 차콜 텍스트
   - 반투명 유리 효과 (Glassmorphism, `backdrop-blur-md bg-white/70`)
   - 둥근 모서리 (`rounded-2xl`, `rounded-3xl`, `rounded-full`) 및 부드러운 그림자
   - Inter 폰트 자간 최적화 (`tracking-tight`)
3. **선생님 맞춤형 확장성**: 코딩 초보자 선생님들도 쉽게 코드를 이해하고 기능을 추가할 수 있도록 모든 핵심 파일에 한국어 주석이 꼼꼼하게 작성되어 있습니다.
4. **반응형 디자인**: 모바일, 태블릿, PC 환경 어디서나 깔끔한 레이아웃을 제공합니다.

---

## 📁 폴더 및 파일 구조

```text
math/
├── app/
│   ├── components/
│   │   ├── Header.tsx     # 상단 로고(himath) 및 네비게이션 바
│   │   └── Footer.tsx     # 하단 카피라이트 및 시스템 정보
│   ├── globals.css        # Tailwind CSS 메인 스타일시트
│   ├── layout.tsx         # RootLayout (폰트, 메타데이터, 레이아웃 감싸기)
│   └── page.tsx           # 메인 메인 화면 (Hero Section 및 Placeholder 버튼)
├── public/                # 파비콘 및 정적 자원 저장소
├── .gitignore             # Git 추적 제외 목록
├── next.config.mjs        # Next.js 환경 설정
├── package.json           # 프로젝트 의존성 및 스크립트 정의
├── postcss.config.js      # PostCSS 및 Tailwind 연결 설정
├── tailwind.config.ts     # Tailwind CSS 테마 설정
└── tsconfig.json          # TypeScript 컴파일 설정
```

---

## 🚀 시작하기 (로컬 개발 환경)

1. **의존성 패키지 설치**:
   ```bash
   npm install
   ```

2. **개발 서버 실행**:
   ```bash
   npm run dev
   ```
   브라우저에서 `http://localhost:3000` 접속

3. **프로젝트 빌드 검증**:
   ```bash
   npm run build
   ```

---

## 📦 GitHub 저장소 푸시 및 Vercel 배포 안내

아래 명령어로 GitHub 원격 저장소에 푸시한 뒤, Vercel 웹사이트에서 저장소를 연결하면 1분 만에 서비스 배포가 완료됩니다!

```bash
git add .
git commit -m "feat: himath Next.js Apple-style boilerplate setup"
git push origin main
```
