export interface Task {
  id: string;
  name: string;
  description: string;
  price: number;
  hours: number;
  category: string;
  component: "Toggle" | "Quantity" | "Solo visible en el resumen";
  defaultQuantity?: number;
  visibleWhen?: string; // Task ID that must be active for this to show
  mutuallyExclusiveWith?: string; // Task ID that hides when this is active
}

export interface TaskSelection {
  [taskId: string]: {
    enabled: boolean;
    quantity: number;
  };
}

export const tasks: Task[] = [
  // Esencial (hidden, auto-included)
  {
    id: "h",
    name: "Configuración de hosting, dominio e instalación de WordPress",
    description: "",
    price: 40000,
    hours: 4,
    category: "Esencial",
    component: "Solo visible en el resumen",
  },
  {
    id: "dc",
    name: "Personalización del diseño (encabezado, pie de página, colores y fuentes)",
    description: "",
    price: 50000,
    hours: 6,
    category: "Esencial",
    component: "Solo visible en el resumen",
  },
  {
    id: "tst",
    name: "Testing",
    description: "",
    price: 162000,
    hours: 24,
    category: "Esencial",
    component: "Solo visible en el resumen",
  },
  // Principal
  {
    id: "p3s",
    name: "Página de 3 secciones",
    description:
      "Desarrollo de una unidad individual (por ej. Quiénes somos) dentro de un sitio web compuesta por hasta tres bloques de contenido.",
    price: 80000,
    hours: 8,
    category: "Principal",
    component: "Quantity",
    defaultQuantity: 1,
  },
  {
    id: "as",
    name: "Sección adicional",
    description:
      "Bloque de contenido que forma parte de una página. Por ej. contenido informativo de texto con iconos o imágenes.",
    price: 30000,
    hours: 3,
    category: "Principal",
    component: "Quantity",
  },
  {
    id: "m",
    name: "Configuración de mail",
    description: "",
    price: 60000,
    hours: 8,
    category: "Principal",
    component: "Toggle",
  },
  {
    id: "am",
    name: "Casilla de mail adicional",
    description:
      "Creación y puesta en funcionamiento de una cuenta de correo extra asociada al dominio, independiente de la principal.",
    price: 6000,
    hours: 1,
    category: "Principal",
    component: "Quantity",
    visibleWhen: "mail-config",
  },
  {
    id: "sf",
    name: "Formulario de contacto simple",
    description:
      "Campos básicos, sin lógica condicional ni cálculos, orientado a la recepción de mensajes estándar. Por ej. nombre, mail, mensaje.",
    price: 64000,
    hours: 8,
    category: "Principal",
    component: "Toggle",
  },
  {
    id: "asf",
    name: "Formulario de contacto simple adicional (Distintos campos)",
    description:
      "Formulario adicional, sin lógica condicional ni cálculos, con campos diferentes al formulario simple principal.",
    price: 24000,
    hours: 3,
    category: "Principal",
    component: "Quantity",
    visibleWhen: "simple-contact-form",
  },
  {
    id: "cf",
    name: "Formulario complejo",
    description:
      "Campos con lógica avanzada, validaciones y/o cálculos. Por ej. subida de archivos, selección de provincias, búsqueda.",
    price: 160000,
    hours: 18,
    category: "Principal",
    component: "Toggle",
  },
  {
    id: "acf",
    name: "Formulario complejo adicional (Distintos campos)",
    description:
      "Formulario avanzado adicional que incorpora lógica, validaciones o cálculos, utilizando un conjunto de campos distinto al formulario complejo principal.",
    price: 128000,
    hours: 16,
    category: "Principal",
    component: "Quantity",
    visibleWhen: "complex-form",
  },
  {
    id: "seo",
    name: "Optimización para motores de búsqueda y rendimiento",
    description:
      "Mejoras para velocidad de carga, posicionamiento en buscadores y accesibilidad del sitio.",
    price: 140000,
    hours: 16,
    category: "Principal",
    component: "Toggle",
  },
  // Contenido
  {
    id: "b",
    name: "Blog",
    description:
      "Área del sitio destinada a la publicación de artículos o entradas.",
    price: 144000,
    hours: 18,
    category: "Contenido",
    component: "Quantity",
  },
  {
    id: "ig",
    name: "Galería de imágenes",
    description:
      "Bloque visual para mostrar múltiples imágenes organizadas en grilla, carrusel o vista ampliada.",
    price: 29000,
    hours: 3,
    category: "Contenido",
    component: "Quantity",
  },
  {
    id: "tw",
    name: "Redacción de texto por sección",
    description:
      "Textos redactados manualmente a partir de investigación, usando IA para corrección y pulido.",
    price: 10000,
    hours: 1,
    category: "Contenido",
    component: "Quantity",
  },
  {
    id: "ic",
    name: "Creación de imagen o compra de imagen stock",
    description:
      "Generación de imágenes propias o selección de imágenes de stock. Incluye edición.",
    price: 40000,
    hours: 4,
    category: "Contenido",
    component: "Quantity",
  },
  {
    id: "ie",
    name: "Edición de imagen",
    description:
      "Puede incluir ajustes visuales, limpieza de imperfecciones y redimensionado.",
    price: 7000,
    hours: 1,
    category: "Contenido",
    component: "Quantity",
  },
  {
    id: "l",
    name: "Creación de logo",
    description:
      "Diseño simple de logo con versión a color, positivo y negativo. No incluye manual de marca.",
    price: 256000,
    hours: 32,
    category: "Contenido",
    component: "Quantity",
  },
  // Funcionalidades
  {
    id: "ga",
    name: "Integración con Google Analytics",
    description:
      "Vinculación con herramientas de medición para obtener datos de visitas y comportamiento de usuario.",
    price: 44000,
    hours: 5,
    category: "Funcionalidades",
    component: "Toggle",
  },
  {
    id: "ur",
    name: "Sistema de roles y permisos de usuario por persona",
    description:
      "Definición de accesos y permisos según el tipo de usuario dentro del sitio.",
    price: 62000,
    hours: 8,
    category: "Funcionalidades",
    component: "Toggle",
  },
  {
    id: "sp",
    name: "Panel simplificado de edición y subida de archivos",
    description:
      "Configuración de una interfaz clara para que el cliente pueda editar contenidos o subir archivos sin conocimientos técnicos.",
    price: 296000,
    hours: 32,
    category: "Funcionalidades",
    component: "Toggle",
  },
  {
    id: "df",
    name: "Implementación de archivos descargables",
    description:
      "Configuración de archivos para descarga directa desde el sitio con acceso controlado.",
    price: 64000,
    hours: 8,
    category: "Funcionalidades",
    component: "Toggle",
  },
  {
    id: "ps",
    name: "Sistema de pagos",
    description:
      "Integración de pasarela de pago con métodos como Mercado Pago y tarjetas.",
    price: 216000,
    hours: 24,
    category: "Funcionalidades",
    component: "Toggle",
  },
  {
    id: "ds",
    name: "Sistema de descuentos",
    description: "Configuración de cupones y reglas de descuento.",
    price: 40000,
    hours: 3,
    category: "Funcionalidades",
    component: "Toggle",
    visibleWhen: "payment-system",
  },
  {
    id: "bs",
    name: "Tienda online básica",
    description:
      "Tienda con estructura simple para mostrar y vender productos, con catálogo reducido y botón de consulta por WhatsApp. No incluye sistema de pago.",
    price: 234000,
    hours: 26,
    category: "Funcionalidades",
    component: "Toggle",
    mutuallyExclusiveWith: "complete-store",
  },
  {
    id: "cs",
    name: "Tienda online completa",
    description:
      "Implementación integral de e-commerce que incluye productos, categorías, envíos, impuestos, checkout, emails y pasarela de pago.",
    price: 698000,
    hours: 96,
    category: "Funcionalidades",
    component: "Toggle",
    mutuallyExclusiveWith: "basic-store",
  },
  {
    id: "pl",
    name: "Carga de productos",
    description:
      "Incorporación de productos a la tienda con datos básicos. No incluye imagen ni descripción.",
    price: 3000,
    hours: 0.2,
    category: "Funcionalidades",
    component: "Quantity",
    visibleWhen: "basic-store|complete-store",
  },
  // Soporte y seguridad
  {
    id: "sec",
    name: "Configuración completa de seguridad",
    description:
      "Implementación de medidas de seguridad como firewall, captcha, filtros y protección contra ataques.",
    price: 350000,
    hours: 36,
    category: "Soporte y seguridad",
    component: "Toggle",
  },
  {
    id: "pc",
    name: "Política de privacidad / Cookies",
    description:
      "Implementación de aviso de cookies con gestión de consentimiento.",
    price: 30000,
    hours: 3,
    category: "Soporte y seguridad",
    component: "Toggle",
  },
  {
    id: "ot",
    name: "Capacitación por hora online",
    description:
      "Sesión de formación para aprender a usar y administrar el sitio web por videollamada.",
    price: 22000,
    hours: 1,
    category: "Soporte y seguridad",
    component: "Quantity",
  },
  {
    id: "pt",
    name: "Capacitación por hora presencial",
    description:
      "Sesión de formación para aprender a usar y administrar el sitio web de forma presencial.",
    price: 25000,
    hours: 1,
    category: "Soporte y seguridad",
    component: "Quantity",
  },
  {
    id: "doc",
    name: "Documentación: Manual de uso",
    description:
      "Entrega de manual mediante sitio web y/o PDF con instrucciones claras para gestionar el sitio.",
    price: 120000,
    hours: 12,
    category: "Soporte y seguridad",
    component: "Toggle",
  },
  {
    id: "vt",
    name: "Video tutorial por tema",
    description:
      "Video explicativo sobre un tema específico, con duración máxima de 10 minutos.",
    price: 120000,
    hours: 12,
    category: "Soporte y seguridad",
    component: "Quantity",
  },
  {
    id: "mm",
    name: "Mantenimiento básico mensual",
    description:
      "Servicio recurrente con pago mensual independiente que incluye actualizaciones, revisiones de seguridad y copias de respaldo.",
    price: 10000,
    hours: 1,
    category: "Soporte y seguridad",
    component: "Toggle",
  },
  // Incluido gratis
  {
    id: "epl",
    name: "Plugins esenciales",
    description: "",
    price: 0,
    hours: 1,
    category: "Incluido gratis",
    component: "Solo visible en el resumen",
  },
  {
    id: "res",
    name: "Implementación responsive",
    description: "",
    price: 0,
    hours: 12,
    category: "Incluido gratis",
    component: "Solo visible en el resumen",
  },
  {
    id: "fv",
    name: "Favicon",
    description: "",
    price: 0,
    hours: 1,
    category: "Incluido gratis",
    component: "Solo visible en el resumen",
  },
  {
    id: "irs",
    name: "Integración redes sociales",
    description: "",
    price: 0,
    hours: 1,
    category: "Incluido gratis",
    component: "Solo visible en el resumen",
  },
  {
    id: "sup",
    name: "Soporte dentro de plazo de trabajo",
    description: "",
    price: 0,
    hours: 0,
    category: "Incluido gratis",
    component: "Solo visible en el resumen",
  },
];

export const categories = [
  "Principal",
  "Contenido",
  "Funcionalidades",
  "Soporte y seguridad",
];

export function isTaskVisible(task: Task, selections: TaskSelection): boolean {
  // Always visible if no dependency
  if (!task.visibleWhen && !task.mutuallyExclusiveWith) return true;

  // Check visibility dependency
  if (task.visibleWhen) {
    // Support OR condition with pipe
    const dependencies = task.visibleWhen.split("|");
    const anyActive = dependencies.some((depId) => {
      const sel = selections[depId];
      return sel && (sel.enabled || sel.quantity > 0);
    });
    if (!anyActive) return false;
  }

  // Check mutual exclusivity - hide if the other is active
  if (task.mutuallyExclusiveWith) {
    const otherSel = selections[task.mutuallyExclusiveWith];
    if (otherSel && (otherSel.enabled || otherSel.quantity > 0)) {
      return false;
    }
  }

  return true;
}

export function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-AR")}`;
}

export function formatTime(hours: number): string {
  const businessDays = Math.ceil(hours / 8);

  if (businessDays < 5) {
    return `${businessDays} día${businessDays !== 1 ? "s" : ""}`;
  }

  const weeks = Math.floor(businessDays / 5);
  const remainingDays = businessDays % 5;

  if (weeks < 4) {
    if (remainingDays === 0) {
      return `${weeks} semana${weeks !== 1 ? "s" : ""}`;
    }
    return `${weeks} semana${weeks !== 1 ? "s" : ""} y ${remainingDays} día${remainingDays !== 1 ? "s" : ""}`;
  }

  const months = Math.floor(businessDays / 22);
  const remainingAfterMonths = businessDays % 22;

  if (months > 0) {
    if (remainingAfterMonths === 0) {
      return `${months} mes${months !== 1 ? "es" : ""}`;
    }
    return `${months} mes${months !== 1 ? "es" : ""} y ${remainingAfterMonths} día${remainingAfterMonths !== 1 ? "s" : ""}`;
  }

  return `${businessDays} días`;
}

export function calculateDates(hours: number): { start: Date; end: Date } {
  const start = new Date();
  const businessDays = Math.ceil(hours / 8);

  let daysAdded = 0;
  const end = new Date(start);

  while (daysAdded < businessDays) {
    end.setDate(end.getDate() + 1);
    const dayOfWeek = end.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      daysAdded++;
    }
  }

  return { start, end };
}

export function formatDate(date: Date): string {
  const days = ["Dom.", "Lun.", "Mar.", "Mié.", "Jue.", "Vie.", "Sáb."];
  const months = [
    "ene.",
    "feb.",
    "mar.",
    "abr.",
    "may.",
    "jun.",
    "jul.",
    "ago.",
    "sep.",
    "oct.",
    "nov.",
    "dic.",
  ];

  const dayName = days[date.getDay()];
  const dayNum = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${dayName} ${dayNum} ${month} ${year}`;
}
