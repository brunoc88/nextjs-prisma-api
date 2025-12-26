# Manejo de errores por capas en Next.js (Service + Repository)

Este documento explica **por qué** y **cómo** usar clases de error personalizadas en una arquitectura con:
- Routes (API)
- Services
- Repositories
- Error handler centralizado

Está pensado para proyectos chicos/medianos con Next.js + Prisma, sin sobreingeniería.

---

## 1. Problema que resolvemos

Cuando todo se maneja en el controlador:
- Mucho `if / else`
- Mucha repetición
- Controllers gordos
- Tests más complejos

Cuando pasamos a **services**, necesitamos una forma limpia de:
- cortar el flujo
- indicar el tipo de error
- mapearlo a HTTP

👉 Solución: **errores tipados por dominio**

---

## 2. `super`: qué es y por qué es obligatorio

```ts
class AppError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}
```

### Qué hace `super(message)`:
- Llama al constructor de `Error`
- Inicializa `error.message`
- Genera el stack trace

⚠️ Si no llamás a `super`, la clase explota.

Regla:
> **Si extendés una clase, siempre llamás a `super()` primero**

---

## 3. `AppError`: el error base

```ts
export class AppError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}
```

Responsabilidad:
- Representar errores del **dominio**
- Transportar `status` HTTP sin acoplar el service a HTTP

El service **no devuelve JSON**, solo lanza errores.

---

## 4. Errores concretos (hijos)

```ts
export class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Sin autorización') {
    super(message, 401)
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Solicitud inválida') {
    super(message, 400)
  }
}
```

Ventajas:
- No dependés de strings
- No dependés de mensajes
- No crece el errorHandler sin control

---

## 5. Uso correcto en el Service

```ts
if (!post) throw new NotFoundError()

if (post.userId !== userId)
  throw new UnauthorizedError()

return postRepo.update(data, postId)
```

El service:
- valida reglas de negocio
- decide si algo está permitido
- **no devuelve HTTP**
- **no devuelve JSON**

---

## 6. Error Handler limpio

```ts
import { AppError } from '@/lib/errors'

const errorHandler = (error: any) => {
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status }
    )
  }

  if (error.code === 'P2002') {
    return NextResponse.json(
      { error: 'Campo duplicado' },
      { status: 409 }
    )
  }

  return NextResponse.json(
    { error: 'Error interno del servidor' },
    { status: 500 }
  )
}
```

Responsabilidad:
- Traducir errores a HTTP
- No conocer reglas de negocio
- No crecer innecesariamente

---

## 7. `instanceof`: cómo funciona

```ts
error instanceof AppError
```

Devuelve `true` si:
- el error es `AppError`
- o cualquier clase que herede de `AppError`

Jerarquía:

```txt
UnauthorizedError
  └── AppError
        └── Error
              └── Object
```

Por eso no hace falta chequear cada error individual.

---

## 8. Arquitectura final (reglas claras)

- Routes:
  - parsean request
  - devuelven JSON
  - solo camino feliz

- Services:
  - reglas de negocio
  - lanzan errores

- Repositories:
  - Prisma puro
  - sin lógica

- ErrorHandler:
  - traduce errores a HTTP

---

## 9. Regla de oro

> **Las routes no deciden**
> **Los services no responden**
> **Los repos no opinan**
> **Los errores viajan**

Fin.
