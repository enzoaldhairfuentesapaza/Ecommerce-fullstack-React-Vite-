# Challenge 02A – Order Confirmation Modal

## 1. Objetivo
Reemplazar el uso de `alert()` del navegador por un **modal de confirmación de orden personalizado**, siguiendo el diseño y comportamiento del mockup `02-order-confirmation-modal.html`, con el fin de mejorar la experiencia de usuario.

---

## 2. Qué se construyó
Se implementó un sistema de modales reutilizable y un modal específico de confirmación de orden que:
- Muestra un mensaje de éxito
- Visualiza el ID de la orden creada
- Incluye acciones de “Continue Shopping” y “View Order”
- Puede cerrarse por múltiples métodos

---

## 3. Arquitectura y decisiones técnicas

### Separación de componentes
Se crearon dos componentes diferenciados:

```
src/
 └── components/
     ├── Modal.jsx
     └── OrderConfirmationModal.jsx
```

- **Modal.jsx**: componente genérico que maneja overlay, animaciones y cierre.
- **OrderConfirmationModal.jsx**: componente de dominio que define el contenido visual de la confirmación.

Esta separación permite reutilizar el sistema de modales en futuras funcionalidades.

---

### Manejo de estado
En `App.jsx` se añadieron los estados:

```js
const [showOrderModal, setShowOrderModal] = useState(false)
const [createdOrderId, setCreatedOrderId] = useState(null)
```

El modal se abre únicamente luego de que la orden se crea exitosamente.

---

## 4. Flujo de funcionamiento

1. El usuario crea una orden
2. El backend responde con el ID de la orden
3. Se guarda el ID en estado
4. Se muestra el modal de confirmación
5. El usuario puede cerrar el modal o continuar el flujo

---

## 5. Evidencia

📹 Video de funcionamiento:  
`/test-videos/challenge-02a.mp4`

---

## 6. Requisitos cumplidos

| Requisito | Estado |
|---------|--------|
| Modal personalizado con animación | ✅ |
| Overlay semitransparente | ✅ |
| Mostrar ID de la orden | ✅ |
| Botones de acción | ✅ |
| Cierre por overlay y Escape | ✅ |
| Diseño responsive | ✅ |
| Sin uso de alert() | ✅ |

---

## 7. Resultado

El Challenge 02A mejora significativamente la UX al crear órdenes, elimina dependencias del navegador y establece una base sólida para futuros flujos basados en modales.

---

## 8. Próximos pasos

- Reutilizar el sistema de modales para errores o warnings
- Agregar transiciones más avanzadas
- Integrar navegación directa al detalle de orden
