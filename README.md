# 하루니 AI 일기 Companion 🐻✍️

## 🌟 프로젝트 소개

**하루니**는 사용자와의 1:1 대화를 통해 하루를 기록하고, 이를 바탕으로 다채로운 기능을 제공하는 인공지능 일기 앱입니다.  
커스텀 성격을 가진 AI 챗봇 '하루니'와 대화하며 하루의 정보를 쌓고, 앱은 이를 자동으로 요약하여 그림일기 형태로 캘린더에 기록해줍니다.  
사용자의 감정 변화를 추적하고, 의미있는 피드백을 제공하여 꾸준한 사용을 유도합니다.

---

## ✨ 주요 기능

- **AI 챗봇 '하루니'**
  - 사용자 맞춤형 성격 설정이 가능한 AI 챗봇과 1:1 대화
  - 대화를 통해 자연스럽게 하루의 일과와 감정 기록

- **자동 일기 생성 및 캘린더**
  - AI가 하루 대화 내용을 자동으로 요약
  - 요약된 내용과 함께 어울리는 그림으로 일기를 생성하여 캘린더에 표시

- **주간 감정 분석 및 피드백**
  - 일주일 치 일기가 쌓이면, 주간 감정 흐름을 그래프로 시각화
  - 분석된 감정 패턴을 기반으로 다음 주를 위한 활동이나 조언 추천

- **인터랙티브 3D 캐릭터**
  - 메인 화면에 Unity WebGL로 제작된 3D 캐릭터 '하루니' 표시
  - React Native와 상호작용하여 터치, 대화 등에 반응
  - 사용자의 앱 참여도에 따라 캐릭터 레벨 상승 및 외형 진화 (성장 시스템)

---

## 🛠️ 사용 기술

| 분류 | 기술 |
|------|------|
| **프론트엔드** | `React Native` |
| **3D 캐릭터** | `Unity` (WebGL 빌드 후 React Native에 통합) |
| **AI 챗봇** | *(사용된 AI 라이브러리 명시 예정)* |
| **개발 및 배포** | `npm`, `Metro`, `Android Studio`, `Gradle` |

---

## ⚙️ 설치 및 실행 방법

### 🔧 사전 준비 사항

- `Node.js` 및 `npm` 설치
- `Android Studio` 설치 및 Android SDK / 에뮬레이터 설정

---

### 📦 1. 프로젝트 클론

```bash
git clone [프로젝트 저장소 URL]
cd [프로젝트 디렉토리]
```

### 📥 2. 라이브러리 설치
```
npm install
React Native prebuild 기준
```

### ▶️ 3. 에뮬레이터로 실행 

```
npm run android
안드로이드 에뮬레이터 또는 연결된 디바이스 필요
```

### 📦 4. APK 빌드 (Release)
```
Android Studio 사용:
android/ 디렉토리를 Android Studio로 열기

Gradle 동기화 완료 후, 상단 메뉴에서:
Build > Generate Signed Bundle / APK... 선택

APK → Next

키 스토어 경로, 비밀번호 입력 또는 생성

Build Type: release → Finish

CLI 명령어:
cd android
./gradlew assembleRelease
빌드 완료 후 아래 경로에서 APK 확인:
android/app/build/outputs/apk/release/app-release.apk
```
### Frontend 위주의 별도 설명입니다!
