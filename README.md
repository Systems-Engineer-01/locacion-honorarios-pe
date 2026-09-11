# Sistema de Locación de Servicios y Honorarios - Perú

Sistema web para la generación automática de Contratos de Locación de Servicios civiles (Art. 1764-1770 del Código Civil del Perú) y el detalle mensual de Recibos por Honorarios con cálculo automático de retención del 8% de Impuesto a la Renta.

## Stack Tecnológico

- **Backend / API**: Node.js + Express + TypeScript + Zod
- **Base de Datos**: SQLite + Prisma ORM
- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Generación de Documentos**: docxtemplater (.docx)
- **CI/CD**: GitHub Actions
- **Testing**: Vitest + Supertest

## Estado del Proyecto

`Sprint 1 - Modelo de datos & API REST completados` 🚀

---

## Modelo de Datos

El sistema consta de 4 entidades principales relacionadas en SQLite mediante Prisma ORM:

```mermaid
erDiagram
    COMITENTE ||--o{ CONTRATO : "contrata (1:N)"
    LOCADOR ||--o{ CONTRATO : "presta servicio (1:N)"
    CONTRATO ||--o{ RECIBO : "emite (1:N)"

    COMITENTE {
        int id PK
        string tipo "publica | privada | natural"
        string razonSocialNombre
        string numDoc "RUC (11 dig) o DNI (8 dig)"
        string domicilio
        string repLegalNombre "opcional"
        string repLegalDni "opcional"
        string repLegalCargo "opcional"
    }

    LOCADOR {
        int id PK
        string nombreCompleto
        string dni "8 digitos"
        string ruc "opcional (11 dig)"
        string domicilio
        string profesionOficio
    }

    CONTRATO {
        int id PK
        string numContrato UK
        int comitenteId FK
        int locadorId FK
        string objetoServicio
        datetime fechaInicio
        datetime fechaFin
        float montoTotal
        string formaPago
        string antecedentes
        string estado "activo | finalizado | resuelto"
    }

    RECIBO {
        int id PK
        int contratoId FK
        string numRecibo
        datetime fechaEmision
        string periodo
        float montoBruto
        boolean aplicaRetencion
        float montoRetencion
        float montoNeto
        string modalidadPago "contado | credito"
        string descripcionServicio
    }
```

---

## Cómo ejecutar localmente

### 1. Clonar el repositorio

```bash
git clone https://github.com/Systems-Engineer-01/locacion-honorarios-pe.git
cd locacion-honorarios-pe
```

### 2. Backend (API)

```bash
cd backend
npm install
npx prisma db push
npm run dev
```

El servidor backend estará disponible en `http://localhost:5000` (Endpoint de verificación: `http://localhost:5000/health`).

### 3. Frontend (UI)

En una nueva terminal:

```bash
cd frontend
npm install
npm run dev
```

La aplicación web estará disponible en `http://localhost:5173`.

---

## Scripts Disponibles

### Backend (`/backend`)
- `npm run dev`: Inicia el servidor en modo desarrollo con recarga en vivo (`tsx`).
- `npm run build`: Compila TypeScript a JavaScript en `/dist`.
- `npm run lint`: Ejecuta ESLint.
- `npm test`: Ejecuta las pruebas unitarias e integración con Vitest.
- `npm run format`: Formatea el código con Prettier.

### Frontend (`/frontend`)
- `npm run dev`: Inicia el servidor de desarrollo Vite.
- `npm run build`: Compila la aplicación para producción.
- `npm run lint`: Ejecuta ESLint.
- `npm run preview`: Previsualiza el build de producción.