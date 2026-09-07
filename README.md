# 🏆 Intercolegiales San Benito 2026

<div align="center">

![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide_Icons-F05032?style=for-the-badge&logo=git&logoColor=white)

**Plataforma Oficial del Torneo Deportivo, Cultural y Tecnológico Intercolegial**  
_Sede Central: Parque Vieytes — Ciudad de San Benito, Entre Ríos, Argentina_

[Explorar Secciones](#-características-y-secciones) • [Instituciones](#-escuelas-participantes) • [Instalación](#-instalación-y-desarrollo) • [Guía de Aprendizaje](#-guía-de-aprendizaje-con-ia) • [Créditos y Pasantías](#-proyecto-educativo-y-comunitario)

---

</div>

## 🌟 Acerca del Proyecto

**Intercolegiales San Benito** es la plataforma web interactiva desarrollada para impulsar el encuentro, la camaradería y la competencia sana entre los jóvenes de la ciudad. Diseñada con una estética moderna e inmersiva inspirada en interfaces _cyber-sports_, combina la gestión de información del torneo con herramientas dinámicas de participación ciudadana y estudiantil.

> 🤝 **Iniciativa y Desarrollo Colaborativo:**  
> Este proyecto fue **creado y desarrollado en conjunto en el marco del programa de pasantías educativas con los estudiantes de las escuelas secundarias de la ciudad de San Benito**, fomentando el aprendizaje práctico en desarrollo web moderno, trabajo en equipo y habilidades digitales aplicadas a eventos reales de la comunidad.

---

## 🏫 Escuelas Participantes

El torneo reúne a las delegaciones de las 5 instituciones de educación secundaria de San Benito:

| Identificador | Institución                    | Color Representativo    |
| :-----------: | :----------------------------- | :---------------------- |
|    **SBA**    | **San Benito Abad**            | Rojo Fuego & Ámbar      |
|    **SAH**    | **San Alberto Hurtado**        | Cyan Eléctrico & Índigo |
|    **EZU**    | **Escuela Zuloaga**            | Ámbar & Naranja Dorado  |
|    **EVA**    | **Escuela Evita**              | Púrpura & Fucsia Neón   |
|    **E18**    | **Escuela Técnica ENET N° 18** | Verde Esmeralda & Teal  |

---

## ⚡ Características y Secciones

- 🎯 **Hero Dinámico**: Cuenta regresiva en tiempo real para el inicio del torneo, métricas HUD de delegaciones e inspectores de sede.
- 🛡️ **Showcase de Escuelas ("Casas")**: Fichas interactivas con la identidad, insignias y colores de cada colegio.
- 🏅 **Módulo de Disciplinas y Categorías**: Información de fútbol 11, fútbol femenino, vóley, atletismo, competencias culturales y torneos de _E-Sports_.
- 📝 **Formulario de Inscripción Oficial**: Sistema ágil para que los delegados y estudiantes registren sus equipos y disciplinas.
- 📊 **Tablero de Puntajes & Scoreboard**: Tabla de posiciones en vivo con cálculo de puntos para coronar a la institución campeona.
- 📍 **Mapa y Guía de Sede**: Modal geolocalizado con accesos, puntos de encuentro y servicios del Parque Vieytes.

---

## 🛠️ Stack Tecnológico

- **Framework**: [React 19](https://react.dev/)
- **Empaquetador y Entorno**: [Vite](https://vite.dev/)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/) (con `@tailwindcss/vite`)
- **Iconografía**: [Lucide React](https://lucide.dev/)

---

## 🚀 Instalación y Desarrollo Local

Para correr el proyecto localmente, asegurate de tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior) o [Bun](https://bun.sh/).

### 1. Clonar el repositorio

```bash
git clone https://github.com/MuniSanBenito/intercolegiales.git
cd intercolegiales
```

### 2. Instalar dependencias

Con npm:

```bash
npm install
```

_O si utilizás bun:_

```bash
bun install
```

### 3. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abrí tu navegador en [http://localhost:5173](http://localhost:5173) para ver la aplicación en vivo.

### 4. Compilar para producción

```bash
npm run build
```

---

## 📂 Estructura del Proyecto

```text
intercolegiales/
├── public/                # Recursos estáticos y logos
├── src/
│   ├── assets/            # Imágenes e íconos locales
│   ├── components/        # Componentes modulares de la interfaz
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── HousesSection.tsx
│   │   ├── DisciplinesSection.tsx
│   │   ├── RegistrationSection.tsx
│   │   ├── ScheduleSection.tsx
│   │   ├── ScoreboardSection.tsx
│   │   ├── InteractiveQuiz.tsx
│   │   ├── LocationModal.tsx
│   │   └── Footer.tsx
│   ├── data/
│   │   └── tournamentData.ts # Datos de escuelas, disciplinas y eventos
│   ├── App.tsx            # Ensamblado principal de la aplicación
│   ├── index.css          # Configuración global de estilos y Tailwind
│   └── main.tsx           # Punto de entrada de React
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## � Guía de Aprendizaje con IA

El proyecto incluye una guía práctica para que los estudiantes puedan escribir mejores prompts, entender qué archivos modifica la IA y verificar cada cambio en celular y computadora.

👉 [Leer la Guía de Aprendizaje](docs/GUIA-APRENDIZAJE.md)

---

## �🤝 Proyecto Educativo y Comunitario

Este desarrollo es el resultado del esfuerzo conjunto y las ganas de innovar de la juventud de nuestra ciudad:

- **Impulsado por**: Municipalidad de San Benito, Entre Ríos.
- **Participantes**: Estudiantes de las escuelas secundarias de San Benito en el marco del programa de **Pasantías Educativas**.
- **Valores**: Trabajo en equipo, aprendizaje tecnológico, deporte, cultura y juego limpio (_Fair Play_).

---

<div align="center">

**Intercolegiales San Benito 2026** • _Juventud, Deporte y Futuro_

</div>
