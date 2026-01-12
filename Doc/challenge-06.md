# Challenge 06 – Búsqueda y Filtrado

## Descripción General

Este desafío agrega **búsqueda avanzada, filtrado, ordenamiento y paginación** al listado de productos.  
El objetivo fue construir un **sistema de filtrado escalable y controlado desde el backend**, manteniendo al mismo tiempo un frontend limpio, predecible y fácil de extender.

Todos los filtros funcionan de forma integrada con la paginación implementada en el **Challenge 04**.

---

## Implementación en el Backend

### Endpoint actualizado

`GET /api/products`

El endpoint fue extendido para soportar **búsqueda, filtrado por precio, ordenamiento y paginación** en una sola petición.

### Parámetros soportados

- `search`  
  Realiza una **búsqueda no sensible a mayúsculas/minúsculas** sobre:
  - Nombre del producto
  - Descripción del producto

- `min_price` / `max_price`  
  Filtra los productos por rango de precio.

- `sort_by`  
  Permite ordenar por:
  - `name`
  - `price`
  - `stock`

- `order`  
  Dirección del ordenamiento:
  - `asc`
  - `desc`

- `page`  
  Número de página actual.

- `limit`  
  Cantidad de productos por página.

### Ejemplo de request

GET /api/products?search=wireless&min_price=20&max_price=150&sort_by=price&order=asc&page=1&limit=10


### Decisiones de diseño (Backend)

- **Un solo endpoint para todos los filtros**  
  Evita crear múltiples endpoints especializados y mantiene la API flexible.

- **Filtrado y ordenamiento a nivel de base de datos**  
  Garantiza buen rendimiento y evita enviar datos innecesarios al frontend.

- **Respuesta paginada (`PaginatedProducts`)**  
  Mantiene metadatos consistentes (`total`, `page`, `pages`) reutilizables en otros desafíos.

- **Los controladores manejan la lógica de negocio**  
  Las rutas se mantienen delgadas (1–2 líneas), mejorando mantenibilidad y facilidad de pruebas.

---

## Implementación en el Frontend

### Interfaz de Búsqueda y Filtros

Se agregó un panel de filtros encima de la grilla de productos.

#### Funcionalidades

- Campo de búsqueda (nombre y descripción)
- Campos de precio mínimo y máximo
- Selector de ordenamiento (nombre, precio, stock)
- Selector de orden (ascendente / descendente)
- Botón **Aplicar filtros**
- Botón **Limpiar filtros**

### Comportamiento de los filtros

- **Los filtros solo se aplican cuando el usuario presiona “Aplicar filtros”**  
  Evita llamadas innecesarias al backend por cada tecla presionada.

- **La paginación se reinicia a la página 1 cuando cambian los filtros**  
  Evita páginas inválidas después de filtrar.

- **“Limpiar filtros” reinicia tanto la UI como el estado del backend**

### Flujo de datos

1. El usuario ajusta los filtros localmente
2. Presiona **Aplicar filtros**
3. El estado se guarda en `filtersApplied`
4. Se consultan los productos usando query parameters
5. La paginación y el total se actualizan automáticamente

### Decisiones de diseño (Frontend)

- **Separación entre estado de UI y filtros aplicados**
  - `searchTerm`, `minPrice`, etc. → estado de interfaz
  - `filtersApplied` → estado real enviado al backend

- **El backend es la fuente de verdad**
  - Filtrado, ordenamiento y paginación ocurren en el servidor
  - El frontend solo renderiza los resultados

- **Paginación reutilizable**
  - Totalmente compatible con el Challenge 04

---

## Integración con la Paginación (Challenge 04)

Todos los filtros funcionan junto con la paginación:

- Los resultados filtrados se paginan
- El conteo total se actualiza correctamente
- La navegación entre páginas sigue funcionando
- La página se reinicia cuando cambian los filtros

---

## Checklist de Criterios de Aceptación

### Backend

- ✓ Búsqueda en nombre y descripción (no sensible a mayúsculas)
- ✓ Filtro por rango de precios
- ✓ Ordenamiento por nombre, precio y stock
- ✓ Orden ascendente y descendente
- ✓ Combinación de filtros correcta
- ✓ Paginación funcional con filtros

### Frontend

- ✓ Barra de búsqueda implementada
- ✓ Panel de filtros implementado
- ✓ Selector de ordenamiento
- ✓ Botón de limpiar filtros
- ✓ Los filtros solo se aplican al confirmar
- ✓ El conteo de resultados se actualiza
- ✓ La paginación funciona con filtros activos

---

## Resultado Final

Este desafío entrega un **sistema de filtrado robusto y escalable**, adecuado para aplicaciones reales de e-commerce.  
La solución prioriza:

- Diseño limpio de la API
- Comportamiento predecible en el frontend
- Reutilización para futuras funcionalidades
- Separación clara de responsabilidades

---

## Próximos pasos / Mejoras

- Agregar búsqueda en tiempo real con debounce
- Sincronizar filtros con la URL
- Agregar filtrado por categorías
- Agregar skeleton loaders en el frontend
- Mejorar UX del panel de filtros en móviles

---

**Challenge 06 completado exitosamente.**
