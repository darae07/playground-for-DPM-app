# playground-for-DPM-app
## **RN 웹뷰 인증 쿠키 통신**

### 로그인

웹뷰 - 로그인 -> 응답 -> 쿠키에 저장, RN에 쿠키 전송(post message)

RN -  전송받은 쿠키를 쿠키에 저장

### 서버 api 호출시

RN - [웹뷰](https://github.com/react-native-webview/react-native-webview)와 쿠키를 공유

웹뷰 - next [server side 쿠키](https://nextjs.org/docs/app/api-reference/functions/cookies)를 검사하여 있으면 보내고 없으면 인증 요구하도록 처리

### 로그아웃

웹뷰 - 쿠키 삭제, RN에 인증 정보 삭제 메시지 송신

RN - 인증 삭제 메시지 수신시 쿠키 삭제

- 초기 화면
    - 쿠키 없으므로 로그인 버튼 표출
- 로그인 화면
    - 로그인 요청시 로그인 성공을 가정하고, RN에 메시지 송신(`{ type: "BEARER_TOKEN", message: "1" }` ) #대충 1번 유저라는 뜻
- (다시)초기 화면
    - (새로고침시) 토큰 값을 가져와 테스트 api(jsonplaceholder) 호출함
        - [ ]  새로고침 안해도되게 처리하기..
    - 불러온 할일 아이템 UI 표출
- 해야할일
    - 로그아웃 처리
    - RN에서 쿠키삭제시 웹쿠키삭제 반영 안되어 좀더 테스트 필요
