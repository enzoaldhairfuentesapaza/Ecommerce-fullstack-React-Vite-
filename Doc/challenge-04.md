# Challenge 04 – Paginated Product Listing & Persistent Cart

## 📌 Objetivo
Implementar un sistema de **listado de productos paginado** con **carrito persistente**, asegurando que los usuarios puedan:

- Navegar entre páginas de productos sin perder los items seleccionados en el carrito.
- Añadir productos al carrito con animación de feedback visual.
- Ver correctamente el total de items y precio sin importar la página.
- Cumplir un flujo completo de compra desde el listado hasta la creación de órdenes.

Este challenge se centra en **frontend con React**, **gestión de estado**, **interacción con backend** y **UI responsiva**.

---

## 🧠 Decisiones de Arquitectura

### 1. Gestión de productos paginados
Se implementó **paginación** con:

- Estado `products` → productos de la página actual
- Estado `allProducts` → todos los productos cargados hasta ahora (para mantener persistencia en el carrito)

**Motivo:**  
Antes, al cambiar de página se perdían los productos seleccionados en el carrito si no estaban visibles en la página actual. `allProducts` garantiza que el carrito siempre pueda mostrar correctamente los productos seleccionados.

---

### 2. Carrito persistente entre páginas
- El carrito se mantiene en un estado global `cart`.
- Los productos en el carrito se buscan dentro de `allProducts`.
- Se eliminó el `fetchProducts()` dentro de `addToCart` para evitar reseteos de página y animaciones.

**Beneficio:**  
- Los items del carrito no desaparecen al cambiar de página.  
- La animación de "Add to Cart" funciona correctamente.  
- Experiencia de usuario fluida y consistente.

---

### 3. Paginación
- Estados: `page`, `limit`, `totalPages`, `totalProducts`.  
- Botones `Previous / Next` y numeración de páginas.  
- Texto informativo: `Showing X - Y of Z products`.

**Decisiones clave:**  
- Solo se cargan los productos de la página actual desde el backend.  
- `allProducts` mantiene los productos agregados al carrito, evitando que desaparezcan al cambiar de página.

---

### 4. Integración con backend

Endpoints usados:

- `/api/products/paginated` → productos por página  
- `/api/cart/{sessionId}` → obtener carrito persistente  
- `/api/cart/{sessionId}/items` → agregar producto  
- `/api/cart/{sessionId}/items/{productId}` → actualizar/eliminar producto  
- `/api/orders` → crear orden  

**Decisiones:**  
- Evitar reload completo de productos al agregar un item al carrito.  
- Mantener `sessionId` en `localStorage` para persistencia entre recargas.

---

### 5. Animación y UX

- Antes, la animación del botón “Add to Cart” se interrumpía al hacer fetch de productos.
- Ahora se asegura que:
  - `fetchProducts()` no se llame dentro de `addToCart`.
  - Animación se ejecuta sin interrumpirse.
  - Carrito y página no se resetean.

---

### 6. Diseño UI/CSS

- Grid responsivo para listado de productos.  
- Panel de carrito lateral con detalle de items.  
- Paginación con botón activo resaltado.  
- Botones de añadir, quitar y eliminar con estilo claro.  
- Total de carrito y número de items siempre visible.  
- Todo basado en el mockup de producto y carrito.

---

## ✅ Checklist de Requisitos Completados

| Requisito | Estado | Notas |
|-----------|--------|-------|
| Listado de productos paginado | ✔ | Implementado con `page`, `limit`, `totalPages`, `totalProducts` |
| Carrito persistente entre páginas | ✔ | Usando `cart` y `allProducts` |
| Animación “Add to Cart” funcional | ✔ | Evitando fetch innecesario al agregar producto |
| Manejo correcto de stock y total | ✔ | `getCartTotal()` calcula total dinámicamente |
| Paginación con navegación Previous/Next y números de página | ✔ | Estado actualizado y UI responsiva |
| Creación de orden desde carrito | ✔ | `/api/orders` y modal de confirmación funcional |
| Estado de sesión persistente | ✔ | `sessionId` guardado en `localStorage` |
| UI consistente y responsiva | ✔ | Grids, paneles y botones estilizados según mockup |

---

## 🚀 Posibles mejoras futuras

- Cache global de productos (Context o Zustand) para optimizar fetch.  
- Soporte para más filtros y búsqueda de productos.  
- Animaciones más sofisticadas en “Add to Cart”.  
- Actualización de stock en tiempo real sin recargar productos.  
- Historial de páginas vistas para restaurar scroll al regresar.

---

**Challenge 04 completado exitosamente.**

