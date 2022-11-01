# Batnotes Api



## System Requirements

- [Node 14.x LTS](https://nodejs.org/en/blog/release/v14.17.3/)
- [Yarn 1.x](https://yarnpkg.com/)

### Local Development Setup

1. Clone the repository

```bash
git clone git@github.com:ambat25/batnotes.git
```

2. Install all dependencies

```bash
yarn install --no-lockfile --production=false --silent
```

3. Create env file and update the details
```bash
cp sample.env .env
```

4. source the `env` file
```bash
source .env
```

5. Start the Application
```bash
yarn start
```