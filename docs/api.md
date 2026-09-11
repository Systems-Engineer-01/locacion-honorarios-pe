# Documentación de la API REST — Sistema de Locación de Servicios y Honorarios (Perú)

Esta documentación describe las rutas y endpoints disponibles en el backend (`/backend/src/routes`).

---

## 1. Comitentes (`/api/comitentes`)

| Método | Ruta | Body Esperado | Respuesta HTTP / Ejemplo |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/comitentes` | Ninguno | `200 OK` — Lista JSON de todos los comitentes. |
| **GET** | `/api/comitentes/:id` | Ninguno | `200 OK` — Objeto JSON del comitente.<br>`404 Not Found` — Si no existe. |
| **POST** | `/api/comitentes` | `{ tipo: "publica" \| "privada" \| "natural", razonSocialNombre: string, numDoc: string (8/11 dig), domicilio: string, repLegalNombre?: string, repLegalDni?: string, repLegalCargo?: string }` | `201 Created` — Objeto creado.<br>`400 Bad Request` — Error de validación Zod. |
| **PUT** | `/api/comitentes/:id` | Objeto parcial o completo de Comitente. | `200 OK` — Objeto actualizado.<br>`404 Not Found` / `400 Bad Request`. |
| **DELETE** | `/api/comitentes/:id` | Ninguno | `204 No Content`<br>`404 Not Found`. |

---

## 2. Locadores (`/api/locadores`)

| Método | Ruta | Body Esperado | Respuesta HTTP / Ejemplo |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/locadores` | Ninguno | `200 OK` — Lista JSON de todos los locadores. |
| **GET** | `/api/locadores/:id` | Ninguno | `200 OK` — Objeto JSON del locador.<br>`404 Not Found`. |
| **POST** | `/api/locadores` | `{ nombreCompleto: string, dni: string (8 dig), ruc?: string (11 dig), domicilio: string, profesionOficio: string }` | `201 Created` — Objeto creado.<br>`400 Bad Request` — DNI/RUC inválido. |
| **PUT** | `/api/locadores/:id` | Objeto parcial o completo de Locador. | `200 OK` — Objeto actualizado.<br>`404 Not Found` / `400 Bad Request`. |
| **DELETE** | `/api/locadores/:id` | Ninguno | `204 No Content`<br>`404 Not Found`. |

---

## 3. Contratos (`/api/contratos`)

| Método | Ruta | Body Esperado | Respuesta HTTP / Ejemplo |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/contratos` | Ninguno | `200 OK` — Lista JSON de contratos incluyendo datos de comitente y locador. |
| **GET** | `/api/contratos/:id` | Ninguno | `200 OK` — Detalle del contrato con comitente, locador y recibos asociados. |
| **POST** | `/api/contratos` | `{ numContrato: string, comitenteId: number, locadorId: number, objetoServicio: string, fechaInicio: string, fechaFin: string, montoTotal: number (>0), formaPago: string, antecedentes: string, estado?: "activo" \| "finalizado" \| "resuelto" }` | `201 Created` — Contrato creado.<br>`404 Not Found` — Si `comitenteId` o `locadorId` no existen.<br>`400 Bad Request` — Error de validación o número duplicado. |
| **PUT** | `/api/contratos/:id` | Campos a actualizar de Contrato. | `200 OK`<br>`404 Not Found` / `400 Bad Request`. |
| **DELETE** | `/api/contratos/:id` | Ninguno | `204 No Content`<br>`404 Not Found`. |

---

## 4. Recibos por Honorarios (`/api/contratos/:id/recibos`)

| Método | Ruta | Body Esperado | Respuesta HTTP / Ejemplo |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/contratos/:id/recibos` | Ninguno | `200 OK` — Lista de recibos emitidos para el contrato `:id`.<br>`404 Not Found` — Si el contrato no existe. |
| **POST** | `/api/contratos/:id/recibos` | `{ numRecibo: string, fechaEmision: string, periodo: string, montoBruto: number (>0), modalidadPago: "contado" \| "credito", descripcionServicio: string }` | `201 Created` — Recibo creado guardando `montoBruto` y `montoNeto`.<br>`404 Not Found` — Si el contrato no existe.<br>`400 Bad Request` — Validación fallida. |
