# 📋 Informe de Auditoría - Sistema de Mesas y Resúmenes (Bar System)

**Fecha:** 25 de febrero de 2025  
**Rol:** Tester Senior - Análisis de inconsistencias y riesgos en producción  
**Alcance:** Frontend, Backend, manejo de mesas y cálculo de totales (diario, mensual)

---

## 1. Resumen Ejecutivo

Se identificaron **8 fallas críticas o de alto riesgo** y varias mejoras recomendadas relacionadas con el manejo de mesas, sumas de dinero y consistencia de datos. Algunos problemas pueden causar **datos incorrectos en producción** sin que se detecten de forma obvia.

---

## 2. Arquitectura del Sistema (Resumen)

- **Frontend:** React + Ant Design, páginas Daily (registro), DaySummary (resumen diario), MonthSummary (resumen mensual)
- **Backend:** Express + Sequelize + PostgreSQL
- **Modelos clave:** Mesa (ventas), Comentario (gastos), Turno, Bar
- **Flujo:** Mesa se crea con `monto`, `tipo_pago`, `propina`, `fecha`, `turno_id`. Los resúmenes agregan por fecha/turno

---

## 3. Fallas Críticas

### 🔴 3.1 Bug Crítico: Resumen Diario no filtra correctamente por turno

**Archivo:** `backend/src/services/resumenService.js` (líneas 24-36)

**Problema:** Se filtra por rango de fechas/horas (`fecha >= inicio, fecha < fin`) usando `inicio.utc().toDate()` y `fin.utc().toDate()`, pero la columna `Mesa.fecha` es de tipo **DATEONLY** (solo fecha, sin hora).

Al comparar en PostgreSQL un `DATE` (medianoche) con un `TIMESTAMP` (ej. 12:00 UTC), la fecha medianoche resulta **menor** que el timestamp del mediodía. Por tanto, **las mesas NO pasan el filtro** y el resumen diario puede devolver **ceros o datos vacíos** aunque existan mesas.

**Evidencia:**
```javascript
// Línea 27 - La mesa tiene fecha = '2025-02-25' (DATE)
// inicio podría ser 2025-02-25 12:00 UTC
// fecha >= inicio → '2025-02-25 00:00' >= '2025-02-25 12:00' → FALSE
fecha: { [Op.gte]: inicio.utc().toDate(), [Op.lt]: fin.utc().toDate() }
```

**Solución recomendada:** La mesa ya tiene `turno_id` asignado al crearse. Filtrar por `turno_id` y `fecha`:

```javascript
const mesas = await Mesa.findAll({
  where: {
    bar_id,
    turno_id: t.id,
    fecha: fechaISO
  },
});
```

Lo mismo aplica para `Comentario` si se decide asociarlo a turnos. Actualmente `Comentario` no tiene `turno_id`; los gastos se asignan por rango horario, que con la misma lógica falla. Se recomienda decidir si los gastos van por turno o solo por día.

---

### 🔴 3.2 Inconsistencia hora límite de turno vs. asignación

**Archivos:** `backend/src/services/mesaService.js`, `backend/src/utils/initTurnos.js`

**Problema:**
- `mesaService.js`: A partir de las 16:00 se asigna `turno_id = 2` (Noche).
- `initTurnos.js`: Noche va de 17:00 a 06:00.

Hay un desfase de 1 hora: entre 16:00 y 17:00 las mesas se marcan como Noche pero según el turno oficial siguen siendo Mañana.

**Recomendación:** Unificar el criterio, por ejemplo usar 17:00 como corte en `mesaService` para coincidir con `initTurnos`.

---

### 🔴 3.3 Propina no se incluye en los resúmenes

**Archivos:** `backend/src/services/resumenService.js`, `frontend/*`

**Problema:** La mesa tiene `propina` y se guarda, pero en los resúmenes (diario y mensual) solo se suma `monto`. La propina no aparece en ningún total.

**Impacto:** Totales mostrados a la gerencia no coinciden con el dinero real si la propina es relevante.

**Solución:** Definir si la propina cuenta como ingreso y, si es así, sumarla (p.ej. `monto + propina`) en los cálculos de resumen.

---

### 🔴 3.4 Posible NaN en sumas por null/undefined

**Archivo:** `backend/src/services/resumenService.js` (líneas 38-42, 106-108)

**Problema:** Se usa `+m.monto` y `parseFloat(v.total)`. Si `monto` es `null` o `undefined`:
- `+null` → `0`
- `+undefined` → `NaN`
- `parseFloat(undefined)` → `NaN`

Un solo valor corrupto puede provocar que toda la suma sea `NaN`.

**Recomendación:**
```javascript
const total = mesas.reduce((s, m) => s + (Number(m.monto) || 0), 0);
const monto = parseFloat(v.total) || 0;
```

---

### 🔴 3.5 Formato de fecha inconsistente en resumen mensual

**Archivo:** `backend/src/services/resumenService.js` (líneas 95-98, 117-118)

**Problema:** Con `raw: true`, `v.fecha` y `g.fecha` pueden devolverse como objetos `Date`. Al usar `resumenPorDia[fecha]`, la clave puede variar:
- Si es string: `"2025-02-25"`
- Si es Date: depende de `.toString()`, pudiendo producir claves distintas

**Riesgo:** Días duplicados o días no agrupados correctamente.

**Solución:**
```javascript
const fechaKey = (v.fecha instanceof Date) 
  ? v.fecha.toISOString().split('T')[0] 
  : String(v.fecha);
```

---

### 🟠 3.6 Falta resumen semanal

**Problema:** Se mencionan totales diario, semanal y mensual, pero **solo existen diario y mensual**. No hay endpoint ni lógica para resumen semanal.

**Recomendación:** Implementar `getResumenSemanalService` si es requerido por negocio.

---

### 🟠 3.7 `getMesasByIdBar` sin validación de `barId`

**Archivo:** `backend/src/controllers/mesaController.js` (línea 21)

**Problema:** Si `bar-seleccionado` no se envía o está vacío, `barId` es `undefined`. `getMesasByIdBarService` compara `bar_id: undefined`, lo que puede devolver todas las mesas o comportarse de forma inesperada.

**Recomendación:** Validar como en otros endpoints:
```javascript
if (!barId) {
  return res.status(400).json({ mensaje: 'Bar no seleccionado' });
}
```

---

### 🟠 3.8 Tipo de pago desconocido no contabilizado en desglose

**Archivo:** `backend/src/services/resumenService.js` (líneas 111-114)

**Problema:** Si `tipo_pago` no es Efectivo, Tarjeta o Mercado Pago (ej. typo o nuevo tipo), entra en `ventaTotal` pero no en `efectivo` ni `tarjeta`.

**Impacto:** En el frontend, `efectivo + tarjeta` puede ser menor que `ventaTotal`, generando confusión.

**Solución:** Incluir un tipo genérico (p.ej. "Otros") o validar que los valores sean uno de los esperados antes de guardar.

---

## 4. Otras observaciones

### 4.1 Timezone en fecha del servidor

`mesaService` y `comentarioService` usan:
```javascript
const fechaFormateada = new Date().toISOString().split('T')[0];
```

Esto usa UTC. En Argentina, pasada la medianoche local (03:00 UTC), la fecha local puede ser distinta a la UTC. Se recomienda usar timezone explícita (dayjs con `America/Argentina/Buenos_Aires`) para consistencia.

### 4.2 `initTurnos` referencia modelo inexistente

`backend/src/utils/initTurnos.js` hace:
```javascript
const Turno = require('../models/turnoModel');
```

El archivo real es `turno.js`, no `turnoModel.js`. Puede fallar al ejecutar este script.

### 4.3 Logs en producción

En `resumenService.js` hay `console.log` (líneas 55, 137). Se recomienda usar un logger configurable y desactivar logs detallados en producción.

### 4.4 Sin límite en edición de mesa

`editarMesaService` permite actualizar cualquier campo, incluido `monto`, sin validación. Un cambio malintencionado o accidental podría alterar totales históricos.

---

## 5. Recomendaciones prioritarias

| Prioridad | Acción |
|----------|--------|
| P0 | Corregir filtro de resumen diario (usar `turno_id` + `fecha`) |
| P0 | Añadir validación contra NaN/null en sumas de montos |
| P1 | Normalizar fechas en resumen mensual (string consistente) |
| P1 | Decidir y aplicar política de propina en totales |
| P1 | Añadir validación de `barId` en `getMesasByIdBar` |
| P2 | Corregir `initTurnos` (require correcto de Turno) |
| P2 | Implementar resumen semanal si es requisito de negocio |
| P2 | Revisar manejo de timezone para fechas del día |

---

## 6. Checklist de pruebas sugeridas

- [ ] Crear mesas en Mañana y Noche y verificar que el resumen diario muestre totales correctos por turno.
- [ ] Comparar suma de mesas manual vs. total del resumen diario.
- [ ] Verificar resumen mensual: suma de días debe coincidir con total mensual.
- [ ] Probar fechas en UTC vs. Argentina (antes/después de medianoche).
- [ ] Enviar requests sin `bar-seleccionado` y verificar que se rechacen.
- [ ] Introducir mesa con `monto` null/undefined y verificar que no se produzca NaN.
- [ ] Editar mesa cambiando `monto` y comprobar que los resúmenes se actualicen correctamente.

---

*Documento generado tras análisis del proyecto bar_system.*
