# AGENTS.md

## Objetivo del proyecto

Este proyecto es una landing page desarrollada con Vite, React, TypeScript y Tailwind CSS.

El objetivo es que el usuario pueda construir y mejorar la página principalmente mediante instrucciones en lenguaje natural utilizando un agente de IA.

La prioridad es obtener un resultado:

- Visualmente atractivo.
- Moderno.
- Profesional.
- Responsive.
- Simple de mantener.
- Fácil de modificar mediante prompts.

---

## Tecnologías

Utilizar exclusivamente las siguientes tecnologías salvo que el usuario solicite explícitamente otra cosa:

- Vite
- React
- TypeScript
- Tailwind CSS

No incorporar frameworks adicionales innecesariamente.

No utilizar Next.js.

No incorporar backend, base de datos, autenticación ni APIs externas salvo que el usuario lo solicite expresamente.

---

## Forma de trabajar

El usuario puede describir lo que quiere utilizando lenguaje natural.

Interpretá la intención del usuario y realizá los cambios necesarios en el proyecto.

No es necesario pedirle al usuario que indique qué archivo modificar.

Antes de realizar cambios importantes:

1. Analizá la estructura existente.
2. Identificá los componentes que pueden reutilizarse.
3. Evitá modificar archivos que no sean necesarios.
4. Mantené el proyecto funcionando después de cada cambio.

Cuando el pedido sea claro, no hagas preguntas innecesarias.

---

## Diseño

La landing debe priorizar la calidad visual.

Utilizar:

- Buen uso del espacio.
- Jerarquía visual clara.
- Tipografía moderna.
- Bordes y sombras sutiles.
- Diseño limpio.
- Buen contraste.
- Animaciones suaves cuando aporten valor.
- Secciones visualmente diferenciadas.
- Diseño responsive.

Evitar diseños genéricos o que parezcan una plantilla básica.

Cuando el usuario pida "más moderno", "más lindo", "más profesional" o algo similar, mejorar principalmente:

- Composición.
- Espaciado.
- Tipografía.
- Jerarquía visual.
- Contraste.
- Microinteracciones.
- Animaciones.
- Consistencia entre componentes.

---

## Responsive

Todo diseño debe funcionar correctamente en:

- Teléfonos.
- Tablets.
- Computadoras.

Diseñar primero pensando en pantallas pequeñas y adaptar progresivamente a pantallas grandes cuando corresponda.

No crear elementos que desborden horizontalmente en dispositivos móviles.

---

## Componentes

Utilizar componentes React reutilizables.

Por ejemplo:

```text
src/
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── CTA.tsx
│   └── Footer.tsx
├── App.tsx
├── main.tsx
└── index.css
```

No crear componentes innecesariamente pequeños.

Si una sección es suficientemente independiente y puede reutilizarse, convertirla en componente.

---

## Contenido

Si el usuario no proporciona contenido específico, generar textos de ejemplo coherentes con el concepto de la landing.

No utilizar textos genéricos como:

"Lorem ipsum"

salvo que el usuario lo solicite.

Los textos deben parecer contenido real y profesional.

---

## Imágenes

Si se necesitan imágenes y el usuario no proporciona ninguna, utilizar soluciones apropiadas para una landing de demostración.

Preferir imágenes que sean coherentes con el concepto visual.

No utilizar imágenes que tengan marcas de agua visibles.

Si las imágenes son solamente decorativas, considerar gradientes, formas, ilustraciones o recursos CSS antes de agregar dependencias innecesarias.

---

## Animaciones

Las animaciones deben ser sutiles y profesionales.

Se pueden utilizar:

- Transiciones.
- Hover effects.
- Apariciones suaves.
- Transformaciones.
- Animaciones al hacer scroll cuando sea apropiado.

Evitar:

- Animaciones excesivas.
- Efectos que dificulten la lectura.
- Animaciones constantes sin propósito.
- Diseños que parezcan una demostración técnica en lugar de una landing profesional.

---

## Accesibilidad

Siempre que sea posible:

- Utilizar HTML semántico.
- Agregar `alt` a las imágenes.
- Utilizar botones para acciones.
- Mantener buen contraste.
- Mantener navegación comprensible.
- No depender únicamente del color para transmitir información.

---

## Código

Mantener el código:

- Claro.
- Simple.
- Legible.
- Organizado.

No agregar abstracciones innecesarias.

No instalar dependencias nuevas sin una razón clara.

No modificar la configuración de Vite o Tailwind si no es necesario.

No eliminar funcionalidades existentes para implementar una nueva característica.

---

## Dependencias

Antes de instalar una nueva dependencia, comprobar si el problema puede resolverse con:

- React.
- Tailwind CSS.
- CSS.
- HTML.
- JavaScript/TypeScript.

Solo instalar una dependencia adicional cuando aporte un beneficio claro.

---

## Regla importante: preservar el trabajo existente

Antes de modificar una sección existente, revisar qué contiene actualmente.

No reemplazar toda la aplicación cuando el usuario solicite modificar una parte específica.

Preservar:

- Contenido existente.
- Componentes existentes.
- Funcionalidades existentes.
- Diseño que el usuario haya indicado que quiere conservar.

---

## Comunicación

Cuando se realicen cambios importantes, explicar brevemente:

1. Qué se modificó.
2. Qué componentes se agregaron o modificaron.
3. Qué resultado debería observar el usuario.

No dar explicaciones técnicas excesivamente largas salvo que el usuario las solicite.

---

## Objetivo final

El agente debe comportarse como un diseñador y desarrollador frontend que ayuda al usuario a transformar ideas expresadas mediante prompts en una landing page moderna.

El usuario no necesita conocer React, TypeScript o Tailwind para solicitar cambios.

Debe poder escribir instrucciones como:

> Hacé el Hero más moderno.

> Quiero una sección con tres beneficios.

> Cambiá los colores a una estética tecnológica.

> Agregá una animación cuando aparezcan las tarjetas.

> Hacé que se vea mejor en celular.

> Quiero que el botón principal tenga más protagonismo.

> Agregá un footer profesional.

El agente debe interpretar estas instrucciones y realizar los cambios directamente en el proyecto.
