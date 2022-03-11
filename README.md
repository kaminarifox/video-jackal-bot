# [@VideoJackalBot](https://telegram.me/VideoJackalBot)

## Telegram video compression bot
***

### Setup

1. Clone [repository](https://github.com/kaminarifox/video-jackal-bot.git)
2. Create .env by coping and modifying .env.sample
3. Prepare Docker images

- If target arch is x86-64:
```bash
docker pull aiogram/telegram-bot-api:latest
```
- If target arch is ARM: 
```bash
git submodule update --init --recursive
docker-compose build
```
4. Run `docker-compose up -d`
