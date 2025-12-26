# Mathstat Quiz Backend API

Backend API для обработки обратной связи из [Mathstat Quiz](https://nicshik.github.io/mathstat-exam-quiz/).

## Функционал

- ✅ Прием обратной связи от студентов через REST API
- ✅ Отправка email с деталями обратной связи
- ✅ CORS настроен для GitHub Pages
- ✅ Валидация данных
- ✅ Красиво оформленные HTML email

## Технологии

- **Node.js** + **Express.js** - веб-сервер
- **Nodemailer** - отправка email
- **CORS** - кроссдоменные запросы
- **dotenv** - управление переменными окружения

## Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка переменных окружения

```bash
cp .env.example .env
```

Отредактируйте `.env` файл:

```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # App Password из Gmail
RECIPIENT_EMAIL=shikhirev.nn@phystech.edu
PORT=3000
```

#### Как получить Gmail App Password:

1. Перейдите: https://myaccount.google.com/security
2. Включите **2-Step Verification**
3. Перейдите: https://myaccount.google.com/apppasswords
4. Выберите "Mail" + "Other device"
5. Скопируйте 16-символьный пароль
6. Вставьте в `.env` как `EMAIL_PASSWORD`

### 3. Запуск сервера

```bash
# Production
npm start

# Development (с auto-reload)
npm run dev
```

### 4. Проверка работы

Откройте в браузере:
```
http://localhost:3000
```

Должны увидеть:
```json
{
  "status": "Mathstat Quiz Backend API",
  "version": "1.0.0",
  "endpoints": {...}
}
```

## API Endpoints

### `GET /`
Информация об API

### `GET /api/health`
Проверка статуса сервера

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-26T08:00:00.000Z",
  "emailReady": true
}
```

### `POST /api/feedback`
Отправка обратной связи

**Request body:**
```json
{
  "taskId": "1",
  "questionText": "Выведите формулу...",
  "userAnswer": "A. Вариант A",
  "correctAnswer": "B. Вариант B",
  "description": "Описание проблемы...",
  "timestamp": "2025-12-26T08:00:00Z",
  "userAgent": "Mozilla/5.0..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Спасибо за обратную связь!",
  "timestamp": "2025-12-26T08:00:00.000Z"
}
```

## Развертывание на Railway

### Способ 1: Через интерфейс Railway

1. Зайдите на [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. Выберите `nicshik/mathstat-quiz-backend`
4. **Variables** → добавьте:
   - `EMAIL_USER`
   - `EMAIL_PASSWORD`
   - `RECIPIENT_EMAIL`
5. **Settings** → **Networking** → **Generate Domain**
6. Скопируйте URL (например: `https://mathstat-backend.up.railway.app`)

### Способ 2: Через Railway CLI

```bash
# Установите Railway CLI
npm install -g @railway/cli

# Войдите
railway login

# Инициализируйте проект
railway init

# Добавьте переменные
railway variables set EMAIL_USER=your-gmail@gmail.com
railway variables set EMAIL_PASSWORD="xxxx xxxx xxxx xxxx"
railway variables set RECIPIENT_EMAIL=shikhirev.nn@phystech.edu

# Разверните
railway up

# Откройте в браузере
railway open
```

## Проверка после развертывания

1. Откройте Railway URL в браузере
2. Проверьте `/api/health` endpoint
3. Проверьте логи в Railway Dashboard
4. Протестируйте отправку feedback с frontend

## Структура проекта

```
mathstat-quiz-backend/
├── server.js           # Основной файл сервера
├── package.json        # Зависимости и скрипты
├── .env.example        # Шаблон переменных окружения
├── .gitignore          # Git ignore rules
└── README.md           # Эта документация
```

## Troubleshooting

### Email не отправляется

✅ Проверьте:
- `EMAIL_PASSWORD` это **App Password** (не обычный пароль Gmail)
- 2FA включена в Gmail
- Нет опечаток в email адресах
- Логи сервера показывают "Email service ready"

### CORS ошибки

✅ Убедитесь:
- `origin` в `server.js` это `https://nicshik.github.io`
- Frontend обращается к правильному Railway URL

### Сервер не запускается на Railway

✅ Проверьте:
- `package.json` содержит `"start": "node server.js"`
- Все зависимости в `dependencies`, а не `devDependencies`
- Переменные окружения добавлены в Railway

## Frontend Integration

В `app.js` вашего frontend (на GitHub Pages):

```javascript
const BACKEND_URL = 'https://your-railway-url.up.railway.app';

async function submitFeedback(event) {
    // ...
    const response = await fetch(`${BACKEND_URL}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackPayload)
    });
    // ...
}
```

## Мониторинг

Railway предоставляет:
- **Metrics** - CPU, RAM, Network usage
- **Logs** - все console.log из приложения
- **Deployments** - история деплоев

## Лимиты бесплатного плана Railway

- ✅ $5 бесплатных credits в месяц
- ✅ Достаточно для ~500 запросов/день
- ✅ Автоматический SSL (HTTPS)
- ✅ Автодеплой при push в GitHub

## Безопасность

- ✅ `.env` файл исключен из git
- ✅ Валидация входящих данных
- ✅ CORS ограничен только GitHub Pages
- ✅ Email credentials в переменных окружения

## Лицензия

MIT

## Автор

Nikita Shikhirev (nicshik)

## Ссылки

- **Frontend**: https://nicshik.github.io/mathstat-exam-quiz/
- **Backend Repo**: https://github.com/nicshik/mathstat-quiz-backend
- **Railway**: https://railway.app
- **Gmail App Passwords**: https://myaccount.google.com/apppasswords
