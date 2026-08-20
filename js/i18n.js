// ==========================================================================
// i18n — sistema de traducción ES/EN
// ==========================================================================

export const translations = {
  es: {
    nav: {
      about: "Sobre mí",
      education: "Educación",
      experience: "Experiencia",
      projects: "Proyectos",
      skills: "Skills",
      contact: "Contacto",
    },
    hero: {
      badge: "Disponible para prácticas",
      subtitle:
        "Estudiante de Ingeniería Informática con mención en Ciencias de la Computación. Diseño sistemas eficientes y dejo que las máquinas hagan el trabajo repetitivo.",
      location: "Córdoba, España",
      scroll: "scroll",
    },
    about: {
      label: "( 01 ) — Sobre mí",
      heading: "Soy Luis. Ingeniero en formación.",
      body:
        "Empecé programando en C y C++ para entender cómo funcionan las cosas por dentro, y hoy estoy inmerso en el mundo de la inteligencia artificial y el desarrollo de software. Uso la IA como una herramienta más del oficio: para refactorizar, diagnosticar y acelerar lo que antes llevaba horas. Ahora mismo sigo aprendiendo — parte del curso la hice en Ostrava, República Checa, dentro de mi programa Erasmus+.",
    },
    education: {
      label: "( 02 ) — Educación",
      heading: "Formación",
      uco: {
        date: "Sep 2023 — 2027 (previsto)",
        title: "Grado en Ingeniería Informática — Computación",
        place: "Universidad de Córdoba (UCO) - EPSC, España",
        desc:
          "Cuarto curso. Especialización en computación, con base en algoritmia, sistemas y desarrollo de software.",
      },
      erasmus: {
        date: "Sep 2025 — Jun 2026",
        title: "Programa de Intercambio Erasmus+",
        place: "VSB-TUO, Ostrava, República Checa",
        desc:
          "Curso completo impartido en inglés. Una vuelta de tuerca a mi forma de estudiar y de trabajar en equipo.",
      },
    },
    experience: {
      label: "( 03 ) — Experiencia",
      heading: "Experiencia laboral",
      line1: "$ whoami",
      line2: "> desarrollador_backend_practicas",
      line3: "$ cat stack.txt",
      line4: "> Python · FastAPI · PostgreSQL · Docker · GitLab CI/CD · Pytest",
      line5: "$ git log --oneline -3",
      line6: "> feat: microservicios RESTful escalables con integración de IA",
      line7: "> test: suite de pruebas automatizadas con Pytest",
      line8: "> chore: flujos GitFlow + Scrum, documentación en Jira/Confluence",
      role: "Desarrollador Backend (Prácticas)",
      place: "Plenitas — Córdoba, España",
      date: "Jul 2026 — Sep 2026",
    },
    projects: {
      label: "( 04 ) — Proyectos",
      heading: "Proyectos",
      impactLabel: "Impacto",
      roleLabel: "Rol",
      viewRepo: "Ver repositorio",
      private: "Proyecto privado",
      academic: "Proyecto académico",
      clinics: {
        year: "2025",
        tag: "AWS · Docker · RAG · n8n",
        title: "Sistemas de IA y automatización para clínicas",
        desc:
          "Agentes con arquitectura RAG, bots de WhatsApp 24/7 y agentes de voz mediante la API de Meta que gestionan citas y atención básica, integrados con los sistemas de gestión de las clínicas. Desplegado en AWS (EC2) con Docker para alta disponibilidad.",
        impact: "Horas de gestión administrativa liberadas cada semana.",
      },
      meetmind: {
        year: "2025",
        tag: "FastAPI · LangGraph · Gemini · WebSockets",
        title: "MeetMind — Agente de inteligencia para reuniones",
        desc:
          "Un agente autónomo que se une a videollamadas, transcribe en tiempo real y extrae decisiones, tareas y riesgos con un pipeline de 5 nodos construido en LangGraph.",
        role: "Arquitectura backend y diseño del agente de IA",
      },
      ml: {
        year: "Dic 2025",
        tag: "Python · Scikit-Learn · Pandas",
        title: "Predicción de enfermedad cardíaca",
        desc:
          "Modelo predictivo sobre datos clínicos, comparando algoritmos de Machine Learning hasta lograr un 89% de precisión con Random Forest.",
        impact: "89% de precisión tras ajuste exhaustivo de hiperparámetros.",
      },
    },
    skills: {
      label: "( 05 ) — Skills",
      heading: "Skills",
      microservices: "Arquitectura de microservicios",
      apiDesign: "Diseño de APIs",
      linux: "Linux",
      rag: "Arquitectura RAG",
      metaApi: "API de Meta",
      aiAssisted: "Desarrollo asistido por IA",
      promptEng: "Prompt Engineering",
      aiCli: "CLIs de IA",
      spanish: "Español (nativo)",
      english: "Inglés (C1 — Aptis)",
    },
    contact: {
      marquee: "ESCRÍBEME · CONECTEMOS · HABLEMOS DE TU PROYECTO · ",
      label: "( 06 ) — Contacto",
      heading: "Contacto",
      languages: "Español (nativo) · Inglés (C1)",
    },
    footer: {
      note: "Diseñado y construido por Luis López León · 2026",
    },
  },

  en: {
    nav: {
      about: "About",
      education: "Education",
      experience: "Experience",
      projects: "Projects",
      skills: "Skills",
      contact: "Contact",
    },
    hero: {
      badge: "Open to internships",
      subtitle:
        "Computer Engineering student specialized in Computer Science. I design efficient systems and let machines handle the repetitive work.",
      location: "Córdoba, Spain",
      scroll: "scroll",
    },
    about: {
      label: "( 01 ) — About",
      heading: "I'm Luis. Engineer in training.",
      body:
        "I started coding in C and C++ to understand how things actually work under the hood, and today I am obssesed with artificial intelligence and software development. I use AI as just another tool of the trade: to refactor, diagnose, and speed up what used to take hours. Right now I'm still learning — part of my degree happened in Ostrava, Czech Republic, through my Erasmus+ exchange.",
    },
    education: {
      label: "( 02 ) — Education",
      heading: "Education",
      uco: {
        date: "Sep 2023 — 2027 (expected)",
        title: "B.Eng. in Computer Science — Computing",
        place: "University of Córdoba (UCO) - EPSC, Spain",
        desc:
          "Fourth year. Specialization in computing, grounded in algorithms, systems, and software development.",
      },
      erasmus: {
        date: "Sep 2025 — Jun 2026",
        title: "Erasmus+ Exchange Program",
        place: "VSB-TUO, Ostrava, Czech Republic",
        desc:
          "A full year taught in English. A shift in how I study and how I work with people from other backgrounds.",
      },
    },
    experience: {
      label: "( 03 ) — Experience",
      heading: "Work experience",
      line1: "$ whoami",
      line2: "> backend_developer_intern",
      line3: "$ cat stack.txt",
      line4: "> Python · FastAPI · PostgreSQL · Docker · GitLab CI/CD · Pytest",
      line5: "$ git log --oneline -3",
      line6: "> feat: scalable RESTful microservices with AI integration",
      line7: "> test: automated test suite with Pytest",
      line8: "> chore: GitFlow + Scrum workflows, docs in Jira/Confluence",
      role: "Backend Developer (Internship)",
      place: "Plenitas — Córdoba, Spain",
      date: "Jul 2026 — Sep 2026",
    },
    projects: {
      label: "( 04 ) — Projects",
      heading: "Projects",
      impactLabel: "Impact",
      roleLabel: "Role",
      viewRepo: "View repository",
      private: "Private project",
      academic: "Academic project",
      clinics: {
        year: "2025",
        tag: "AWS · Docker · RAG · n8n",
        title: "AI & automation systems for clinics",
        desc:
          "RAG-based agents, 24/7 WhatsApp bots and voice agents via the Meta API that handle appointment scheduling and basic support, integrated directly with the clinics' management systems. Deployed on AWS (EC2) with Docker for high availability.",
        impact: "Hours of administrative work saved every week.",
      },
      meetmind: {
        year: "2025",
        tag: "FastAPI · LangGraph · Gemini · WebSockets",
        title: "MeetMind — Meeting intelligence agent",
        desc:
          "An autonomous agent that joins video calls, transcribes in real time, and extracts decisions, action items and risks through a 5-node LangGraph pipeline.",
        role: "Backend architecture and AI agent design",
      },
      ml: {
        year: "Dec 2025",
        tag: "Python · Scikit-Learn · Pandas",
        title: "Heart disease prediction",
        desc:
          "A predictive model built on clinical data, comparing Machine Learning algorithms and reaching 89% accuracy with Random Forest.",
        impact: "89% accuracy after exhaustive hyperparameter tuning.",
      },
    },
    skills: {
      label: "( 05 ) — Skills",
      heading: "Skills",
      microservices: "Microservices architecture",
      apiDesign: "API design",
      linux: "Linux",
      rag: "RAG architecture",
      metaApi: "Meta API",
      aiAssisted: "AI-assisted development",
      promptEng: "Prompt Engineering",
      aiCli: "AI CLIs",
      spanish: "Spanish (native)",
      english: "English (C1 — Aptis)",
    },
    contact: {
      marquee: "GET IN TOUCH · LET'S CONNECT · LET'S TALK ABOUT YOUR PROJECT · ",
      label: "( 06 ) — Contact",
      heading: "Contact",
      languages: "Spanish (native) · English (C1)",
    },
    footer: {
      note: "Designed and built by Luis López León · 2026",
    },
  },
};

function resolve(dict, path) {
  return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), dict);
}

export function applyLang(lang) {
  const dict = translations[lang] || translations.es;
  document.documentElement.setAttribute("data-lang", lang);
  document.documentElement.setAttribute("lang", lang);

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const value = resolve(dict, key);
    if (value !== null) el.textContent = value;
  });

  document.querySelectorAll("[data-lang-opt]").forEach((el) => {
    el.classList.toggle("is-active", el.getAttribute("data-lang-opt") === lang);
  });

  document.title =
    lang === "en"
      ? "Luis López León — Backend & AI"
      : "Luis López León — Backend & IA";

  localStorage.setItem("pf-lang", lang);
}

export function initLang() {
  const stored = localStorage.getItem("pf-lang");
  const browser = navigator.language?.startsWith("en") ? "en" : "es";
  const initial = stored || browser;
  applyLang(initial);

  const toggle = document.getElementById("lang-toggle");
  toggle?.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-lang");
    applyLang(current === "es" ? "en" : "es");
  });
}
