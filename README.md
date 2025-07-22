# express-social-network

social network backend web app using express v4 + swagger + drizzle + postgresql + minio

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
MODE=DEV
API_SERVER_URL=http://localhost
API_PORT_NO=4000
COOKIE_SECRET={YOUR_COOKIE_SECRET}
GITHUB_API_URL=https://api.github.com
GITHUB_AUTH_URL=https://github.com/login/oauth
GITHUB_CLIENT_ID={YOUR_GITHUB_CLIENT_ID}
GITHUB_CLIENT_SECRET={YOUR_GITHUB_CLIENT_SECRET}
DATABASE_URL=postgres://id:pw@localhost:5432/db
STORAGE_SERVER="minio | cloudflare r2 | aws s3"
STORAGE_REGION=auto
STORAGE_ENDPOINT_URL={YOUR_ENDPOINT_URL}
STORAGE_ACCESS_KEY_ID={YOUR_ACCESS_KEY_ID}
STORAGE_SECRET_ACCESS_KEY={YOUR_SECRET_ACCESS_KEY}
STORAGE_DOWNLOAD_URL_VIDEO={YOUR_PUBLIC_VIDEO_DOMAIN}
STORAGE_DOWNLOAD_URL_IMAGE={YOUR_PUBLIC_IMAGE_DOMAIN}
```

### launch

- run bun app with development mode

```sh
$ bun dev
```
