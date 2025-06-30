# express-social-network

social network backend service using express v4 + swagger + drizzle + postgresql

## how to run

### setup

- install latest bun runtime

```sh
$ curl -fsSL https://bun.sh/install | bash
bun was installed successfully to ~/.bun/bin/bun

$ bun -v
1.2.15
```

### configure

- install packages with bun

```sh
$ bun init
$ bun i
```

- create runtime variables

```sh
$ cat .env
API_PORT_NO=4000
COOKIE_SECRET={YOUR_COOKIE_SECRET}
DATABASE_URL=postgres://id:pw@localhost:5432/db
GITHUB_API_URL=https://api.github.com
GITHUB_AUTH_URL=https://github.com/login/oauth
GITHUB_CLIENT_ID={YOUR_GITHUB_CLIENT_ID}
GITHUB_CLIENT_SECRET={YOUR_GITHUB_CLIENT_SECRET}
```

### launch

- run bun app with development mode

```sh
$ bun dev
```
