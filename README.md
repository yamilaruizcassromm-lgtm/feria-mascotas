# Sistema de Gestión de Adopciones - Feria de Mascotas

Proyecto práctico de Software y Laboratorio desarrollado por **Yamila Ruiz** (Bachillerato Técnico en Informática - Colegio Nacional EMD Asunción Escalada).

El sistema permite a un refugio registrar, listar, modificar, eliminar y filtrar animales según su estado (`disponible` o `adoptado`) utilizando **Supabase** como base de datos persistente, **GitHub** para el control de versiones y **Render** para el despliegue web.

---

## Documentación de apoyo con Inteligencia Artificial

* **Consulta realizada a la IA:**  
  *"¿Cómo estructuro una tabla en Supabase con restricciones de estado ('disponible' y 'adoptado') y cómo habilito las políticas RLS para poder realizar operaciones CRUD desde un cliente web en JavaScript?"*

* **Sugerencia aplicada y decisión tomada:**  
  La IA sugirió utilizar un campo `TEXT` con la restricción `CHECK (estado IN ('disponible', 'adoptado'))` para evitar errores de tipeo en la base de datos, y crear políticas públicas en Row Level Security (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) para que el frontend pueda comunicarse con Supabase mediante la `anon key`. Apliqué ambas sugerencias en el script SQL y adapté el formulario HTML con un `<select>` cerrado para que coincida exactamente con los valores permitidos por la base de datos.

* **Comprobación del resultado:**  
  1. Ejecuté el script SQL en el editor de Supabase y verifiqué en el *Table Editor* que los 3 registros ficticios se crearon correctamente.
  2. Desde la interfaz web probé registrar un nuevo animal, editar su estado de `disponible` a `adoptado`, aplicar el filtro por estado y eliminar un registro de prueba.
  3. Recargué el navegador (`F5`) y confirmé que todos los cambios persistían en la base de datos sin errores de permisos.