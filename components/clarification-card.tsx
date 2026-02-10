export function ClarificationCard() {
  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-8">
      <h3 className="text-amber-500 font-semibold mb-3 flex items-center gap-2">
        <span className="w-1 h-4 bg-amber-500 rounded-full" />
        ACLARACIÓN
      </h3>
      <div className="space-y-3 text-xs text-white leading-relaxed">
        <p>
          <strong>Cambios completos o parciales</strong> se cobra como adicional
          en base a la tarea correspondiente (sólicita). Por ej. reemplazo
          parcial o completo de una sección.
        </p>
        <p>
          <strong>Cambios pequeños</strong> no se cobran siempre y cuando sean
          dentro del plazo de desarrollo. Sólo incluye: modificaciones de texto
          (que no requieran redacción), modificación de hasta 1-2 imágenes
          (deben estar en la resolución correcta y/o no deben requerir
          modificaciones extras), eliminación de un elemento, o cambio de lugar
          de un elemento.
        </p>
        <p>
          <strong>Para dudas o solicitud de requisitos</strong> que no estén en
          la lista consultar por mensaje. Gracias.
        </p>
      </div>
    </div>
  );
}
