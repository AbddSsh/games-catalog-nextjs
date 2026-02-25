# Ревалидация кэша

## API для бэкенда: `POST /api/revalidate`

**URL:** `https://домен-сайт/api/revalidate`  
**Метод:** POST  
**Content-Type:** application/json

**Body (JSON):**

- **secret** (обязательно) — значение из `REVALIDATION_SECRET` в .env Next-приложения. Если не совпадает → 401.

Дальше один из вариантов:

### 1) По модели и сущности

| model           | entry              | Что инвалидируется |
|-----------------|--------------------|--------------------|
| `game`          | `{ slug, locale? }`| Конкретная игра, теги `games` + `game:{slug}`, path `/{locale}/game/{slug}` |
| `category`      | `{ slug, locale? }`| Конкретная категория, теги `categories` + `category:{slug}`, path `/{locale}/category/{slug}` |
| `games`         | `{ locale? }`      | Список игр: тег `games`, path `/{locale}/catalog` |
| `categories`    | `{ locale? }`      | Список категорий: тег `categories`, path `/{locale}/catalog` |
| `page_home`     | `{ locale? }`      | Главная: теги `page:home` + `page:home:{locale}`, path `/{locale}` |
| `locales`       | —                  | Список локалей: тег `locales`, корневой layout |
| `translations`  | `{ locale? }`      | Переводы для локали: теги `translations` + `translation:{locale}`, пути `/{locale}` и каталог |

`locale` по умолчанию `"en"`.

**Примеры запросов:**

```json
{ "secret": "твой_REVALIDATION_SECRET", "model": "game", "entry": { "slug": "hero-wars", "locale": "en" } }
{ "secret": "...", "model": "category", "entry": { "slug": "action" } }
{ "secret": "...", "model": "games" }
{ "secret": "...", "model": "page_home", "entry": { "locale": "sk" } }
```

### 2) Явный path и/или теги

- **path** — строка, например `"/en/game/hero-wars"` → вызывается `revalidatePath(path)`.
- **tag** — одна строка, **tags** — массив строк → вызывается `revalidateTag` для каждого.

**Примеры:**

```json
{ "secret": "...", "path": "/en/game/hero-wars" }
{ "secret": "...", "tag": "game:hero-wars" }
{ "secret": "...", "tags": ["games", "category:action"] }
```

**Ответ 200:**  
`{ "message": "Revalidation successful", "revalidatedPaths": [...], "revalidatedTags": [...], "model": "game" }`

**Ошибки:** 401 (неверный secret), 400 (unknown model), 500 (ошибка сервера).
