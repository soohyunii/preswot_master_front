# `components/layouts`

`App.vue` 에 쓰이는 요소 중에서
`router-view` 안에 속하지 않고 유저에게 계속 노출되는 Header, Navigation, Footer를 정의한다.

여기서 header, footer는 이미 html에서 정의하고 있는 pre-defined tag 들이므로 namespace collision을 피하기 위해 앞에 접두어 App을 붙였다.