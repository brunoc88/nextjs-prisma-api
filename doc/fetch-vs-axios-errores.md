# Fetch vs Axios – Manejo de Errores

Este documento resume la diferencia real entre fetch y axios en el manejo de errores,
especialmente útil para desarrolladores con background backend (Express / APIs REST).

---

## 1. Diferencia fundamental

### Axios
- Rechaza automáticamente la promesa cuando el status NO es 2xx
- Los errores HTTP entran directo al catch
- Modelo mental similar a Express

### Fetch
- NO rechaza la promesa por errores HTTP
- 4xx / 5xx NO disparan catch
- El error HTTP es un dato, no una excepción

---

## 2. Qué dispara el catch

### Axios
```ts
axios.get('/api/user')
  .then(res => {
    // status 2xx
  })
  .catch(err => {
    // status 4xx / 5xx
    console.log(err.response.status)
    console.log(err.response.data)
  })
```

El catch se ejecuta con:
- 4xx
- 5xx
- errores de red

---

### Fetch
```ts
fetch('/api/user')
  .then(res => {
    // 404 → res.ok === false
  })
  .catch(err => {
    // solo errores de red o JS
  })
```

---

## 3. Manejo correcto de errores HTTP

### Axios
```ts
try {
  await axios.post('/api/user', data)
} catch (err) {
  console.log(err.response.data.error)
}
```

### Fetch
```ts
const res = await fetch('/api/user', options)
const data = await res.json()

if (!res.ok) {
  throw new Error(data.error)
}
```

---

## 4. Errores de negocio

### Backend (Express / Next)
```ts
return res.status(403).json({
  error: 'No tiene permisos'
})
```

### Axios
```ts
catch (err) {
  setError(err.response.data.error)
}
```

---

## 5. Separación de responsabilidades

| Capa | Responsabilidad |
|-----|-----------------|
| Backend | Status HTTP + mensaje |
| Cliente HTTP | Detectar error |
| UI | Mostrar error |

---

## 6. Conclusión

Axios:
- Convierte cualquier status != 2xx en excepción

Fetch:
- Requiere throw manual

Frase clave:
"Axios trata los errores HTTP como excepciones; fetch no."
