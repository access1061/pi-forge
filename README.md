# Pi Forge

Pi Forge는 Pi Coding Agent에 forge 방식의 작업 루프를 적용하기 위한 실험용 패키지입니다.

Claude Code의 forge가 사용하는 핵심 개념인 **계획 → 실행 → 검증 → 회고 → 완료** 흐름을 Pi Coding Agent에서 쉽게 사용할 수 있도록 정리한 패키지 구조입니다.

> 현재 버전은 MVP 설계안입니다. 실제 Pi Extension API 세부 구현은 Pi Coding Agent 버전에 따라 조정이 필요할 수 있습니다.

---

## 왜 만들었나요?

AI 코딩 에이전트를 사용할 때 자주 생기는 문제는 다음과 같습니다.

- 바로 코드를 고치다가 방향이 틀어짐
- 작업 상태가 남지 않음
- 테스트나 검증 없이 완료했다고 판단함
- 같은 실수를 반복함
- 이전 작업에서 배운 점이 다음 작업에 반영되지 않음

Pi Forge는 이 문제를 줄이기 위해 작업을 아래 흐름으로 고정합니다.

```text
요청 이해
→ 계획 작성
→ 최소 변경 실행
→ 검증
→ 회고 기록
→ 완료 처리
```

---

## 핵심 개념

| 개념 | 설명 |
|---|---|
| Plan | 작업 전에 무엇을 할지 정리합니다. |
| Run | 계획에 따라 최소한의 변경을 실행합니다. |
| Review | 변경 결과와 검증 여부를 확인합니다. |
| Learn | 재사용 가능한 규칙이나 교훈을 기록합니다. |
| Done | 작업을 완료 상태로 정리합니다. |

---

## 폴더 구조

```text
pi-forge/
├─ package.json
├─ extensions/
│  └─ forge.ts
├─ skills/
│  ├─ forge-plan.md
│  ├─ forge-review.md
│  └─ forge-learn.md
├─ prompts/
│  ├─ forge-start.md
│  ├─ forge-next.md
│  └─ forge-done.md
└─ README.md
```

프로젝트에서 실행되면 다음 작업 상태 폴더를 사용합니다.

```text
.forge/
├─ active/
│  ├─ plan.md
│  └─ status.md
├─ done/
└─ retro/
   └─ lessons.md
```

---

## 설치 방법

### 1. 저장소 클론

```bash
git clone https://github.com/access1061/pi-forge.git
cd pi-forge
```

### 2. 의존성 설치

```bash
npm install
```

또는 pnpm을 사용한다면 다음처럼 설치합니다.

```bash
pnpm install
```

---

## Pi 프로젝트에 연결하는 방법

Pi Coding Agent를 사용하는 프로젝트 루트에서 아래 명령을 실행합니다.

```bash
pi install -l ../pi-forge
```

`-l` 옵션은 현재 프로젝트에만 패키지를 연결한다는 뜻입니다.

즉, 전역 설정을 건드리지 않고 해당 프로젝트에서만 Pi Forge를 사용할 수 있습니다.

---

## 모든 프로젝트에 전역 적용하는 방법

Pi Forge를 특정 프로젝트 하나가 아니라 **모든 프로젝트에서 기본으로 사용**하고 싶다면 `-l` 옵션을 빼고 설치합니다.

```bash
pi install https://github.com/access1061/pi-forge
```

또는 git 형식으로 설치할 수도 있습니다.

```bash
pi install git:github.com/access1061/pi-forge
```

중요한 차이는 다음과 같습니다.

| 설치 방식 | 명령어 | 적용 범위 |
|---|---|---|
| 전역 설치 | `pi install https://github.com/access1061/pi-forge` | 모든 프로젝트 |
| 프로젝트 전용 설치 | `pi install -l https://github.com/access1061/pi-forge` | 현재 프로젝트만 |

즉, 모든 프로젝트에서 쓰려면 아래처럼 설치하면 됩니다.

```bash
pi install https://github.com/access1061/pi-forge
```

설치 후 아무 프로젝트 폴더에서 Pi를 실행합니다.

```bash
cd 내프로젝트경로
pi
```

Pi가 실행되면 다음 명령을 사용할 수 있습니다.

```text
/forge 작업명
/forge-status
/forge-done
```

예시는 다음과 같습니다.

```text
/forge 로그인 오류 수정
```

설치가 잘 되었는지 확인하려면 다음 명령을 사용합니다.

```bash
pi list
```

패키지를 최신 상태로 갱신하려면 다음 명령을 사용합니다.

```bash
pi update --extensions
```

Pi 자체와 패키지를 모두 업데이트하려면 다음 명령을 사용합니다.

```bash
pi update --all
```

정리하면, 전역 적용 순서는 다음과 같습니다.

```bash
pi install https://github.com/access1061/pi-forge
pi list
cd 원하는프로젝트
pi
```

그다음 Pi 안에서 다음처럼 시작합니다.

```text
/forge 작업명
```

---

## 임시 테스트 방법

설치하지 않고 한 번만 테스트하려면 다음처럼 실행합니다.

```bash
pi -e ./pi-forge
```

또는 프로젝트 밖에 패키지가 있다면 다음처럼 실행합니다.

```bash
pi -e ../pi-forge
```

---

## 기본 사용법

### 1. 작업 시작

Pi 안에서 다음처럼 입력합니다.

```text
/forge 로그인 오류 수정
```

그러면 `.forge/active/plan.md` 파일이 생성됩니다.

---

### 2. 현재 상태 확인

```text
/forge-status
```

현재 진행 중인 작업의 상태를 확인합니다.

확인 대상 파일은 다음입니다.

```text
.forge/active/plan.md
.forge/active/status.md
```

---

### 3. 다음 작업 진행

Pi에게 이렇게 요청합니다.

```text
계획에 따라 다음 단계 진행해줘
```

또는 프롬프트 템플릿을 사용하는 경우 다음 명령을 사용합니다.

```text
/forge-next
```

이 단계에서는 다음 기준을 따릅니다.

1. 기존 계획 확인
2. 관련 파일 검사
3. 가장 작은 안전한 변경 실행
4. 변경 결과 기록
5. 검증 방법 확인

---

### 4. 작업 완료

```text
/forge-done
```

완료 시 현재 작업이 `.forge/done/` 아래에 기록됩니다.

그리고 재사용 가능한 교훈은 다음 파일에 기록합니다.

```text
.forge/retro/lessons.md
```

---

## 실제 사용 예시

예를 들어 로그인 오류를 고치고 싶다면 다음 순서로 사용합니다.

```text
/forge 로그인 실패 시 에러 메시지가 표시되지 않는 문제 수정
```

Pi는 먼저 작업 계획을 만듭니다.

```text
.forge/active/plan.md
```

그다음 이렇게 요청합니다.

```text
계획에 따라 관련 파일을 확인하고 최소 변경으로 수정해줘
```

수정 후에는 이렇게 확인합니다.

```text
검증 결과와 변경 파일을 정리해줘
```

마지막으로 완료 처리합니다.

```text
/forge-done
```

---

## 언제 사용하면 좋은가요?

| 상황 | 적합도 |
|---|---:|
| 단순 오타 수정 | 낮음 |
| 버그 수정 | 높음 |
| 기능 추가 | 높음 |
| 리팩터링 | 높음 |
| 테스트 작성 | 높음 |
| 큰 구조 변경 | 매우 높음 |

단순한 한 줄 수정에는 굳이 사용할 필요가 없습니다.

하지만 파일 여러 개를 건드리거나 작업 순서가 중요한 경우에는 유용합니다.

---

## 작업 원칙

### 1. 바로 수정하지 않습니다

먼저 요청을 이해하고 계획을 만듭니다.

### 2. 최소 변경을 우선합니다

큰 리팩터링보다 문제를 해결하는 가장 작은 변경을 선호합니다.

### 3. 검증 없는 완료를 피합니다

테스트, 빌드, 타입 체크, 직접 확인 중 가능한 방법으로 검증합니다.

검증하지 못한 경우에는 반드시 이유를 남깁니다.

### 4. 배운 점을 기록합니다

반복될 수 있는 문제나 규칙은 `.forge/retro/lessons.md`에 기록합니다.

---

## 제공되는 명령어

| 명령어 | 역할 |
|---|---|
| `/forge <작업명>` | 새 작업을 시작하고 계획 파일을 만듭니다. |
| `/forge-status` | 현재 작업 상태를 확인합니다. |
| `/forge-done` | 작업을 완료 처리하고 기록합니다. |

---

## 제공되는 Skill

| Skill | 역할 |
|---|---|
| forge-plan | 작업 전 계획 수립 |
| forge-review | 변경 후 검토 |
| forge-learn | 회고 및 교훈 기록 |

---

## 제공되는 Prompt

| Prompt | 역할 |
|---|---|
| forge-start | 작업 시작용 프롬프트 |
| forge-next | 다음 단계 진행용 프롬프트 |
| forge-done | 완료 정리용 프롬프트 |

---

## 개발 로드맵

### 1차 MVP

- [x] 기본 패키지 구조
- [x] `/forge` 명령
- [x] `/forge-status` 명령
- [x] `/forge-done` 명령
- [x] Skill 문서
- [x] Prompt 문서
- [x] 한글 README

### 2차

- [ ] Git diff 자동 요약
- [ ] 테스트 명령 자동 추천
- [ ] 실패한 테스트 기반 재수정 루프
- [ ] 작업별 로그 파일 분리

### 3차

- [ ] Task Graph 지원
- [ ] 여러 작업 동시 관리
- [ ] 프로젝트별 장기 메모리
- [ ] 자동 ADR 생성

---

## 주의사항

이 패키지는 Pi Coding Agent의 확장 구조를 기준으로 설계되었습니다.

다만 Pi의 Extension API가 변경되면 `extensions/forge.ts`의 타입이나 이벤트 이름은 조정이 필요할 수 있습니다.

처음 적용할 때는 다음 순서로 확인하는 것이 좋습니다.

```bash
pi -e ./pi-forge
```

문제가 없으면 프로젝트에 설치합니다.

```bash
pi install -l ./pi-forge
```

모든 프로젝트에 적용하려면 `-l` 없이 설치합니다.

```bash
pi install https://github.com/access1061/pi-forge
```

---

## 한 줄 요약

Pi Forge는 Pi Coding Agent가 작업을 즉흥적으로 처리하지 않고, **계획하고 실행하고 검증하고 배우는 방식으로 움직이게 만드는 워크플로우 패키지**입니다.
