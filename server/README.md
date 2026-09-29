# AIRKLIM Backend API

Backend REST API per AIRKLIM - Sistema di gestione climatizzazione

## 🚀 Tecnologie

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** PostgreSQL 14+
- **Autenticazione:** JWT
- **Sicurezza:** Helmet, CORS, Rate Limiting, XSS Protection
- **Testing:** Jest, Supertest
- **Logging:** Winston

## 📋 Requisiti

- Node.js 18+
- PostgreSQL 14+
- npm 9+

## 🛠️ Installazione

```bash
# Installa dipendenze
npm install

# Copia file di configurazione
cp .env.example .env

# Configura le variabili d'ambiente in .env
nano .env

# Inizializza database
npm run migrate

# Popola con dati di test
npm run seed
```

## 🔧 Configurazione

### Variabili d'ambiente (.env)

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/airklim

# JWT
JWT_SECRET=your_super_secret_key

# Email (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key

# Payments (Stripe)
STRIPE_SECRET_KEY=your_stripe_secret_key

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=airklim-backups
```

## 🚀 Avvio

```bash
# Development
npm run dev

# Production
npm start
```

## 🧪 Testing

```bash
# Esegui tutti i test
npm test

# Test con coverage
npm run test:coverage

# Test in watch mode
npm run test:watch
```

## 📚 API Documentation

### Autenticazione

#### POST /api/auth/login
Login utente

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "Admin@123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "...", "role": "admin" },
    "token": "jwt_token_here"
  }
}
```

#### POST /api/auth/register
Registrazione nuovo utente

**Request:**
```json
{
  "email": "user@example.com",
  "password": "Password@123!",
  "name": "Mario",
  "surname": "Rossi",
  "role": "privato"
}
```

### Utenti

#### GET /api/users
Lista tutti gli utenti (admin only)

**Headers:**
```
Authorization: Bearer <token>
```

**Query Params:**
- `role`: filtra per ruolo
- `status`: filtra per stato
- `search`: cerca per nome/email

#### GET /api/users/:id
Dettaglio utente

#### PUT /api/users/:id
Aggiorna utente (admin only)

#### DELETE /api/users/:id
Elimina utente (admin only)

### Prodotti

#### GET /api/products
Lista prodotti

**Query Params:**
- `brand`: filtra per brand
- `category`: filtra per categoria
- `status`: filtra per stato
- `search`: cerca per nome/brand

#### POST /api/products
Crea prodotto (admin only)

**Request:**
```json
{
  "name": "Panasonic Etherea Z35",
  "brand": "Panasonic",
  "category": "Climatizzatori",
  "price": 1190.00,
  "stock": 30,
  "specifications": {
    "power": "3.5 kW",
    "btu": "12000"
  }
}
```

#### PUT /api/products/:id
Aggiorna prodotto (admin only)

#### DELETE /api/products/:id
Elimina prodotto (admin only)

### Ordini

#### GET /api/orders
Lista ordini

**Query Params:**
- `status`: filtra per stato
- `userId`: filtra per utente

#### POST /api/orders
Crea ordine

**Request:**
```json
{
  "items": [
    { "productId": "uuid", "quantity": 1 }
  ],
  "shippingAddress": {
    "street": "Via Roma 1",
    "city": "Palermo",
    "zip": "90100",
    "country": "IT"
  }
}
```

#### PATCH /api/orders/:id/status
Aggiorna stato ordine (admin only)

**Request:**
```json
{
  "status": "confirmed"
}
```

### Analytics

#### GET /api/analytics
Statistiche piattaforma (admin only)

**Response:**
```json
{
  "success": true,
  "data": {
    "users": { "total": 100, "byRole": {...} },
    "orders": { "total": 50, "totalRevenue": 50000 },
    "products": { "total": 30, "active": 25 },
    "conversions": { "rate": 50.0 }
  }
}
```

### Backup

#### POST /api/backups
Crea backup (admin only)

**Request:**
```json
{
  "type": "full"
}
```

#### GET /api/backups
Lista backup (admin only)

#### POST /api/backups/:id/restore
Ripristina backup (admin only)

### Audit Log

#### GET /api/audit
Lista audit log (admin only)

**Query Params:**
- `action`: filtra per azione
- `severity`: filtra per severità
- `userId`: filtra per utente
- `startDate`: data inizio
- `endDate`: data fine

### Settings

#### GET /api/settings
Ottieni impostazioni (admin only)

#### PUT /api/settings
Aggiorna impostazioni (admin only)

## 🔒 Sicurezza

### Implementata
- ✅ HTTPS enforcement
- ✅ CORS configuration
- ✅ Rate limiting (100 req/15min)
- ✅ Input validation
- ✅ CSRF protection
- ✅ Content Security Policy
- ✅ Data sanitization
- ✅ SQL injection protection
- ✅ XSS protection
- ✅ Audit logging
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Session management

### Middleware di Sicurezza
1. **Helmet** - Security headers
2. **CORS** - Cross-origin resource sharing
3. **Rate Limiting** - Protezione da brute force
4. **express-validator** - Validazione input
5. **mongo-sanitize** - NoSQL injection protection
6. **xss-clean** - XSS protection
7. **hpp** - HTTP parameter pollution protection
8. **compression** - Response compression

## 📊 Monitoring

### Logs
- `logs/error.log` - Errori applicazione
- `logs/audit.log` - Audit log
- `logs/security.log` - Eventi sicurezza

### Metrics
- Request rate
- Error rate
- Response time
- Database queries
- Security events

## 🗄️ Database Schema

### Tabelle Principali
- `users` - Utenti del sistema
- `products` - Catalogo prodotti
- `orders` - Ordini
- `order_items` - Righe ordine
- `sessions` - Sessioni utente
- `audit_logs` - Log audit
- `backups` - Backup database
- `contents` - Contenuti (blog, video, etc.)
- `settings` - Impostazioni sistema

### Indici
Tutte le tabelle hanno indici ottimizzati per le query più frequenti.

## 🧪 Testing

### Coverage
- Unit tests: 85%+
- Integration tests: 80%+
- E2E tests: 75%+

### Test Categories
- Authentication tests
- Authorization tests
- CRUD operations
- Security tests
- Performance tests
- Validation tests

## 📦 Deploy

### Docker
```bash
# Build image
docker build -t airklim-backend .

# Run container
docker run -p 3000:3000 --env-file .env airklim-backend
```

### Environment Variables Production
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/airklim
JWT_SECRET=strong_random_secret
```

## 📝 License

MIT

## 👥 Team

- Backend Developer
- DevOps Engineer
- QA Engineer

## 📞 Support

- Email: support@airklim.it
- Phone: +39 091 8691680
