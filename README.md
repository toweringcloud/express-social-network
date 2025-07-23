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

- define runtime variables

```sh
$ cat .env
MODE=DEV
COOKIE_SECRET={YOUR_COOKIE_SECRET}
GITHUB_API_URL=https://api.github.com
GITHUB_AUTH_URL=https://github.com/login/oauth
GITHUB_CALLBACK_URL=http://localhost:3000/github/callback
GITHUB_CLIENT_ID={YOUR_GITHUB_CLIENT_ID}
GITHUB_CLIENT_SECRET={YOUR_GITHUB_CLIENT_SECRET}
DATABASE_URL=postgres://id:pw@localhost:5432/db
STORAGE_SERVER="minio | cloudflare r2 | aws s3"
STORAGE_REGION=auto
STORAGE_ENDPOINT_URL={YOUR_ENDPOINT_URL}
STORAGE_ACCESS_KEY_ID={YOUR_ACCESS_KEY_ID}
STORAGE_SECRET_ACCESS_KEY={YOUR_SECRET_ACCESS_KEY}
STORAGE_DOWNLOAD_URL={YOUR_PUBLIC_DOMAIN}
```

### launch

- create db schema with drizzle-kit

```sh
$ bun run db:generate
$ drizzle-kit generate
No config path provided, using default 'drizzle.config.ts'
Reading config file '...\drizzle.config.ts'
4 tables
comments 6 columns 0 indexes 2 fks
likes 3 columns 0 indexes 2 fks
threads 8 columns 0 indexes 1 fks
users 9 columns 0 indexes 0 fks

[✓] Your SQL migration file ➜ 0000_clammy_luke_cage.sql 🚀
```

- apply db schema into database server

```sh
$ bun run db:migrate
$ bun run src/models/migrate.ts
Running migrations...
Migrations completed!
```

- run bun app with development mode

```sh
$ bun dev
```
