# Guía de aprendizaje con IA

Esta guía ayuda a transformar una idea en un cambio pequeño, entendible y verificable dentro de la landing de los Intercolegiales.

## Recorrido rápido

1. Escribí qué querés cambiar y qué querés conservar.
2. Pedile a la IA que explique qué archivos tocaría antes de editar.
3. Aplicá un cambio pequeño.
4. Probalo en celular y escritorio.
5. Ejecutá `npm run lint` y `npm run build`.
6. Anotá qué aprendiste y cuál sería el próximo experimento.

## Prompts para copiar

### Cambiar una sección

> Mejorá solo el Hero. Conservá su contenido y colores principales. Antes de editar, explicame qué componente vas a tocar y después resumí qué aprendí.

### Pensar en celular

> Adaptá esta sección para una pantalla de 375 px. Revisá primero desbordes, botones táctiles, legibilidad y orden de columnas. No cambies las otras secciones.

### Aprender antes de modificar

> Explicame cómo funciona `src/components/ScoreboardSection.tsx` con palabras simples. No hagas cambios todavía; proponé dos mejoras y sus posibles efectos.

### Revisar calidad

> Revisá esta sección por accesibilidad y responsive. Señalá problemas concretos, proponé cambios pequeños y verificá que no dependan de una librería nueva.

### Pedir una continuación

> Ahora agregá un estado vacío para cuando no haya resultados. Usá el patrón visual existente, indicá qué archivo cambia y verificá desktop y mobile.

## Mapa de decisiones

| Si querés... | Probablemente revisás... | Después ejecutás... |
|---|---|---|
| Cambiar una sección | `src/components/*Section.tsx` | `npm run lint` |
| Cambiar escuelas o disciplinas | `src/data/tournamentData.ts` | `npm run build` |
| Cambiar colores o animaciones | `src/index.css` y el componente | `npm run build` |
| Mejorar el menú celular | `src/components/Navbar.tsx` | prueba a 375 px |
| Mejorar un modal | `HouseModal.tsx` o `LocationModal.tsx` | abrir, cerrar y hacer scroll |
| Modificar el formulario | `RegistrationSection.tsx` | completar, resetear y revisar mobile |

## Checklist antes de darlo por terminado

- [ ] El cambio afecta solo los archivos necesarios.
- [ ] La pantalla no desborda horizontalmente a 375 px.
- [ ] Los botones se entienden y se pueden usar con teclado o táctil.
- [ ] Los modales tienen cierre visible y contenido con scroll.
- [ ] Las animaciones usan clases disponibles y no dificultan la lectura.

## Bitácora de aprendizaje

- **Prompt usado:**
- **Archivo o componente trabajado:**
- **Qué cambió:**
- **Qué error apareció:**
- **Cómo lo resolvimos:**
- **Qué probaría después:**
