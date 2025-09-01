# Documentazione Tecnica – TIPLSW CoWorkSpace

## Indice
1. [Panoramica del progetto](#panoramica-del-progetto)
2. [Architettura](#architettura)
3. [Specifiche API](#specifiche-api)
    - [Autenticazione](#autenticazione)
    - [Gestione utenti](#gestione-utenti)
    - [Prenotazioni](#prenotazioni)
    - [Location](#location)
    - [Pagamenti](#pagamenti)
    - [Gestione manager](#gestione-manager)
4. [Gestione Database](#gestione-database)
5. [Deploy Frontend React](#deploy-frontend-react)
6. [Deploy Backend Node.js](#deploy-backend-nodejs)
7. [Gestione Errori e Rollback](#gestione-errori-e-rollback)
8. [Testing e CI/CD](#testing-e-cicd)
9. [Sicurezza](#sicurezza)
10. [Strumenti e Librerie Utilizzate](#strumenti-e-librerie-utilizzate)

---

## Panoramica del progetto
Il progetto **TIPLSW CoWorkSpace** è una piattaforma per la gestione di spazi di co-working, con funzionalità di:
- Registrazione e autenticazione utenti
- Prenotazione postazioni
- Gestione location e disponibilità
- Gestione pagamenti
- Pannello manageriale per l’amministrazione

La soluzione è basata su **stack JavaScript full-stack**:
- **Frontend**: React.js
- **Backend**: Node.js con Express
- **Database**: PostgreSQL (schema fornito in `tables.sql`)

---

## Architettura
```
Frontend (React) → API REST (Express.js) → Database (PostgreSQL)
```

- **Frontend**: interfaccia web responsive
- **Backend**: gestisce logica applicativa, autenticazione JWT, validazione
- **Database**: relazionale, gestito tramite script SQL e modelli ORM custom

---

## Specifiche API

### Autenticazione
**Endpoint**:
- `POST /api/auth/register` → registrazione utente
- `POST /api/auth/login` → login con email/password, ritorna token JWT

**Esempio richiesta:**
```json
{
  "email": "utente@example.com",
  "password": "password123"
}
```

**Esempio risposta (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "email": "utente@example.com" }
}
```

**Esempio risposta (401 Unauthorized):**
```json
{
  "error": "Credenziali non valide"
}
```

---

### Gestione Utenti
- `GET /api/users` → lista utenti (solo admin/manager)
- `GET /api/users/:id` → dettaglio utente
- `PUT /api/users/:id` → modifica dati utente
- `DELETE /api/users/:id` → elimina utente

**Esempio risposta (200 OK):**
```json
{
  "id": 3,
  "nome": "Mario Rossi",
  "email": "mario@example.com",
  "ruolo": "utente"
}
```

**Esempio risposta (404 Not Found):**
```json
{
  "error": "Utente non trovato"
}
```

---

### Prenotazioni
- `POST /api/bookings` → crea prenotazione
- `GET /api/bookings/:id` → dettaglio prenotazione
- `GET /api/bookings/user/:id` → prenotazioni di un utente
- `DELETE /api/bookings/:id` → annulla prenotazione

**Esempio risposta (201 Created):**
```json
{
  "id": 15,
  "utente": 3,
  "location": 2,
  "data": "2025-09-10",
  "status": "confermata"
}
```

**Esempio risposta (400 Bad Request):**
```json
{
  "error": "Data non disponibile"
}
```

---

### Location
- `GET /api/locations` → elenco location disponibili
- `POST /api/locations` → aggiungi location (manager)
- `PUT /api/locations/:id` → modifica location
- `DELETE /api/locations/:id` → rimuovi location

**Esempio risposta (200 OK):**
```json
[
  { "id": 1, "nome": "Sala Riunioni", "posti": 10 },
  { "id": 2, "nome": "Open Space", "posti": 25 }
]
```

---

### Pagamenti
- `POST /api/payments` → esegui pagamento prenotazione
- `GET /api/payments/:id` → dettaglio pagamento

**Esempio risposta (200 OK):**
```json
{
  "id": 5,
  "bookingId": 15,
  "importo": 49.99,
  "stato": "completato"
}
```

**Esempio risposta (402 Payment Required):**
```json
{
  "error": "Pagamento rifiutato"
}
```

---

### Gestione Manager
- `POST /api/manager/create` → crea account manager
- `GET /api/manager/bookings` → lista prenotazioni sotto gestione

**Esempio risposta (200 OK):**
```json
[
  { "id": 15, "utente": "mario@example.com", "stato": "confermata" }
]
```

---

## Gestione Database
Lo schema relazionale è contenuto in `backend/tables.sql`.  
Per inizializzare il database:

```bash
psql -U postgres -d coworkspace -f backend/tables.sql
```

Connessione configurata in `backend/config/db.js`, con parametri letti da `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=****
DB_NAME=coworkspace
```

---

## Deploy Frontend React
### Setup locale
```bash
cd TIPLSW-Uninsubria2025-CoWorkSpace
npm install
npm start
```
- Applicazione disponibile su `http://localhost:3000`

### Build produzione
```bash
npm run build
serve -s build
```

---

## Deploy Backend Node.js
### Setup locale
```bash
cd backend
npm install
npm run dev
```

### Variabili ambiente
- `PORT=5000`
- `JWT_SECRET=supersegreto`
- `DB_HOST, DB_USER, DB_PASSWORD, DB_NAME`

---

## Gestione Errori e Rollback
- Middleware di gestione errori centralizzato (`backend/middleware/`) cattura eccezioni e restituisce JSON coerenti.
- **Codici di stato**:
    - `400` → errore validazione input
    - `401` → autenticazione fallita
    - `403` → accesso negato
    - `404` → risorsa non trovata
    - `500` → errore interno server

**Rollback**:
- In caso di errore durante una prenotazione/pagamento, il backend effettua rollback transazionale sul DB.
- Log degli errori in `backend/server.log`.

---

## Testing e CI/CD
- Test unitari e di integrazione possono essere implementati con **Jest** / **Mocha**.
- CI/CD tramite GitHub Actions o GitLab CI:
    - Linting + test → build → deploy automatico.

---

## Sicurezza
- **JWT** per autenticazione e autorizzazione
- Hashing password con **bcrypt**
- Validazione input lato backend e frontend
- Variabili sensibili in `.env`, mai committate

---

## Strumenti e Librerie Utilizzate
- **Frontend**: React, Axios, React Router
- **Backend**: Express.js, bcrypt, jsonwebtoken, pg (PostgreSQL driver)
- **Database**: PostgreSQL
- **Gestione processi**: nodemon in sviluppo, pm2 in produzione
- **Controllo versione**: GitHub
- **Deploy**: Heroku / Vercel / Render (opzioni possibili)


## Schema Database

Di seguito lo schema delle principali tabelle SQL utilizzate dal progetto.

### Tabella users
```sql
CREATE TABLE users (
    id integer PRIMARY KEY,
    name varchar(255) NOT NULL,
    email varchar(255) NOT NULL UNIQUE,
    password varchar(255) NOT NULL,
    role varchar(50) DEFAULT 'user' NOT NULL
);

CREATE TABLE locations (
    id integer PRIMARY KEY,
    name varchar(255) NOT NULL,
    address text NOT NULL,
    city varchar(255) NOT NULL,
    description text,
    capacity integer DEFAULT 1 NOT NULL,
    price_per_hour numeric(10,2) NOT NULL,
    manager_id integer REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    type varchar(50) DEFAULT 'ufficio privato' NOT NULL,
    services text,
    image_url varchar(255)
);


CREATE TABLE bookings (
    id integer PRIMARY KEY,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone NOT NULL,
    total_price numeric(10,2) NOT NULL,
    status varchar(50) DEFAULT 'pending' NOT NULL,
    location_id integer NOT NULL REFERENCES locations(id) ON UPDATE CASCADE ON DELETE CASCADE,
    user_id integer NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE payments (
    id integer PRIMARY KEY,
    booking_id integer NOT NULL REFERENCES bookings(id) ON UPDATE CASCADE ON DELETE CASCADE,
    amount numeric(10,2) NOT NULL,
    payment_method varchar(100),
    status varchar(50) DEFAULT 'completed' NOT NULL,
    transaction_id varchar(255)
);
