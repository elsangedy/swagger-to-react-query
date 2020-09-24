# swagger-to-react-query WIP

## Try

```bash
$ git clone https://github.com/elsangedy/swagger-to-react-query.git
$ cd swagger-to-react-query/examples
$ node ../src/index config.js
$ // or
$ swagger-to-react-query config.js
```


```js
const addToken = (request) => {
  const token = authService.getToken()
  if (token) {
    request.headers.set('authorization', `Bearer ${token}`)
  }
}
const refreshToken = async ({ request }) => {
  try {
    await authService.refreshToken()
    addToken(request)
  } catch (e) {
    authService.logout()
  }
}

// https://github.com/sindresorhus/ky
extendApi({
  prefixUrl: API_URL,
  hooks: {
    beforeRequest: [addToken],
    beforeRetry: [refreshToken],
  },
})
```
