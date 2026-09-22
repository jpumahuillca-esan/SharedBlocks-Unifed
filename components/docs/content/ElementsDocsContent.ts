/**
 * ElementsDocsContent — descripción + snippet de uso para cada Elemento,
 * usado por la página de Documentación (components/docs/).
 *
 * Deliberadamente separado de components/pre_elements/ElementsRegistry.ts:
 * ese registro es para el sidebar del editor (label + ícono + preview),
 * este es contenido específico de documentación (no lo necesita el
 * editor). Las llaves coinciden 1:1 con las de ELEMENTS_REGISTRY.
 *
 * El "code" transcribe TODAS las variantes que se ven en el preview de
 * cada Elemento (Preview*.vue en components/pre_elements/), no solo un
 * ejemplo mínimo — si el preview muestra 4 estados, el código muestra
 * los 4. Se quita únicamente el wrapper de maquetación propio de la
 * página de docs/sidebar (.preview-stack, .preview-group, los v-for de
 * variantes usados por brevedad en el propio Preview*.vue, etc.); el
 * markup y las props de cada componente son exactamente los mismos.
 */
export interface ElementDoc {
  description: string;
  code: string;
}

export const ELEMENTS_DOCS: Record<string, ElementDoc> = {
  Buttons: {
    description: 'AtomButton, con las variantes del Figma de arcis-2. Con caja: primary, secondary y terciary, sin ícono o con ícono a cualquiera de los dos lados (manda el orden en el marcado), en tres tamaños. "Button Icon": text (etiqueta con flecha, sin caja) y el button-arrow, el cuadrado de solo ícono (icon) en rojo (primary) o en blanco (light, para superficies claras), con la esquina superior izquierda en ángulo recto; su ícono toma el tamaño que se le pase a AtomIcon. "Button Link": link, que además se subraya al pasar. "List-Link": list, una fila a todo el ancho con filete inferior; con la flecha al final y el texto en <span>, la flecha se empuja hasta el borde. Todas tienen hover, pressed y deshabilitado (disabled); sobre fondo oscuro, la prop negative da su versión para ese fondo (el principal pasa a blanco con texto rojo). surface es propia de la librería: blanco translúcido para ir sobre un panel de color. Siempre se renderiza como <a>: con destino (href o to) usa NuxtLink en public-site o RouterLink en el admin, si están disponibles.',
    code: `<!-- Primary · Secondary · Terciary: sin ícono, ícono a la derecha, a la izquierda, deshabilitado -->
<AtomButton variant="primary">Button</AtomButton>
<AtomButton variant="primary">
  Button
  <AtomIcon name="arrow-right" :size="16" />
</AtomButton>
<AtomButton variant="primary">
  <AtomIcon name="check-circle" :size="16" />
  Button
</AtomButton>
<AtomButton variant="primary" disabled>Button</AtomButton>
<AtomButton variant="primary" disabled>
  <AtomIcon name="check-circle" :size="16" />
  Button
</AtomButton>

<AtomButton variant="secondary">Button</AtomButton>
<AtomButton variant="secondary">
  Button
  <AtomIcon name="arrow-right" :size="16" />
</AtomButton>
<AtomButton variant="secondary">
  <AtomIcon name="check-circle" :size="16" />
  Button
</AtomButton>
<AtomButton variant="secondary" disabled>Button</AtomButton>
<AtomButton variant="secondary" disabled>
  <AtomIcon name="check-circle" :size="16" />
  Button
</AtomButton>

<AtomButton variant="terciary">Button</AtomButton>
<AtomButton variant="terciary">
  Button
  <AtomIcon name="arrow-right" :size="16" />
</AtomButton>
<AtomButton variant="terciary">
  <AtomIcon name="check-circle" :size="16" />
  Button
</AtomButton>
<AtomButton variant="terciary" disabled>Button</AtomButton>
<AtomButton variant="terciary" disabled>
  <AtomIcon name="check-circle" :size="16" />
  Button
</AtomButton>

<!-- Tamaños -->
<AtomButton variant="primary" size="sm">Pequeño</AtomButton>
<AtomButton variant="primary" size="md">Mediano</AtomButton>
<AtomButton variant="primary" size="lg">Grande</AtomButton>

<!-- Button Icon: texto con flecha (a la izquierda o a la derecha) -->
<AtomButton variant="text">
  <AtomIcon name="arrow-right" :size="16" />
  label
</AtomButton>
<AtomButton variant="text">
  label
  <AtomIcon name="arrow-right" :size="16" />
</AtomButton>
<AtomButton variant="text" disabled>
  label
  <AtomIcon name="arrow-right" :size="16" />
</AtomButton>

<!-- Button Icon: button-arrow, solo ícono (siempre con aria-label) -->
<AtomButton variant="primary" icon size="sm" aria-label="Siguiente">
  <AtomIcon name="chevron-right" :size="16" />
</AtomButton>
<AtomButton variant="primary" icon aria-label="Siguiente">
  <AtomIcon name="chevron-right" :size="16" />
</AtomButton>
<AtomButton variant="primary" icon size="lg" aria-label="Siguiente">
  <AtomIcon name="chevron-right" :size="24" />
</AtomButton>
<AtomButton variant="primary" icon disabled aria-label="Siguiente">
  <AtomIcon name="chevron-right" :size="16" />
</AtomButton>

<!-- En blanco, sobre una superficie clara (--ds-color-background-light) -->
<AtomButton variant="light" icon size="sm" aria-label="Siguiente">
  <AtomIcon name="chevron-right" :size="16" />
</AtomButton>
<AtomButton variant="light" icon aria-label="Siguiente">
  <AtomIcon name="chevron-right" :size="16" />
</AtomButton>
<AtomButton variant="light" icon size="lg" aria-label="Siguiente">
  <AtomIcon name="chevron-right" :size="24" />
</AtomButton>
<AtomButton variant="light" icon disabled aria-label="Siguiente">
  <AtomIcon name="chevron-right" :size="16" />
</AtomButton>

<!-- Button Link: se subraya al pasar -->
<AtomButton variant="link" href="/historias">
  Ver historia
  <AtomIcon name="arrow-right" :size="16" />
</AtomButton>
<AtomButton variant="link" size="sm" href="/historias">
  Ver historia
  <AtomIcon name="arrow-right" :size="16" />
</AtomButton>
<AtomButton variant="link" disabled>
  Ver historia
  <AtomIcon name="arrow-right" :size="16" />
</AtomButton>

<!-- List-Link: fila a todo el ancho; con la flecha al final y el texto en <span>, va al borde -->
<AtomButton variant="list" href="/carreras">
  <span>Placeholder</span>
  <AtomIcon name="arrow-right" :size="16" />
</AtomButton>
<AtomButton variant="list" href="/carreras">
  <AtomIcon name="arrow-right" :size="16" />
  Placeholder
</AtomButton>
<AtomButton variant="list" disabled>
  <span>Placeholder</span>
  <AtomIcon name="arrow-right" :size="16" />
</AtomButton>

<!-- Sobre fondo oscuro: negative -->
<AtomButton variant="primary" negative>Primary</AtomButton>
<AtomButton variant="primary" negative>
  Primary
  <AtomIcon name="arrow-right" :size="16" />
</AtomButton>
<AtomButton variant="primary" negative>
  <AtomIcon name="check-circle" :size="16" />
  Primary
</AtomButton>
<AtomButton variant="secondary" negative>Secondary</AtomButton>
<AtomButton variant="secondary" negative>
  Secondary
  <AtomIcon name="arrow-right" :size="16" />
</AtomButton>
<AtomButton variant="secondary" negative>
  <AtomIcon name="check-circle" :size="16" />
  Secondary
</AtomButton>
<AtomButton variant="text" negative>
  <AtomIcon name="arrow-right" :size="16" />
  label
</AtomButton>
<AtomButton variant="text" negative>
  label
  <AtomIcon name="arrow-right" :size="16" />
</AtomButton>
<AtomButton variant="link" negative>
  Ver historia
  <AtomIcon name="arrow-right" :size="16" />
</AtomButton>
<AtomButton variant="list" negative>
  <AtomIcon name="arrow-right" :size="16" />
  Placeholder
</AtomButton>
<AtomButton variant="list" negative>
  <span>Placeholder</span>
  <AtomIcon name="arrow-right" :size="16" />
</AtomButton>

<!-- Sobre un panel de color: surface -->
<AtomButton variant="surface" icon size="sm" aria-label="Ir">
  <AtomIcon name="chevron-right" :size="16" />
</AtomButton>
<AtomButton variant="surface" icon aria-label="Ir">
  <AtomIcon name="chevron-right" :size="16" />
</AtomButton>
<AtomButton variant="primary" negative icon size="sm" aria-label="Ir">
  <AtomIcon name="chevron-right" :size="16" />
</AtomButton>`,
  },
  Badges: {
    description: 'AtomEyebrow (etiqueta corta sobre títulos de sección, variantes brand/neutral/inverse) y AtomBadge (etiqueta de estado o categoría): brand, brand-solid, neutral, outline (sin relleno, con contorno) y las cuatro de feedback. Con la prop fixed, la forma "Badges fixed" del Figma: mismo color, más alta y con una sola esquina redondeada, la inferior derecha, en vez de la píldora.',
    code: `<!-- Eyebrow -->
<AtomEyebrow variant="brand">Maestrías</AtomEyebrow>
<AtomEyebrow variant="neutral">Actualidad ESAN</AtomEyebrow>

<!-- Badge -->
<AtomBadge variant="brand">Nuevo</AtomBadge>
<AtomBadge variant="brand-solid">Conferencia informativa</AtomBadge>
<AtomBadge variant="neutral">Presencial</AtomBadge>
<AtomBadge variant="outline">Texto</AtomBadge>
<AtomBadge variant="info">Informativo</AtomBadge>
<AtomBadge variant="success">Acreditado</AtomBadge>
<AtomBadge variant="warning">Últimas vacantes</AtomBadge>
<AtomBadge variant="error">Cerrado</AtomBadge>

<!-- Badge fixed: más alta y con la esquina inferior derecha redondeada -->
<AtomBadge variant="brand-solid" fixed>Texto</AtomBadge>
<AtomBadge variant="info" fixed>Texto</AtomBadge>
<AtomBadge variant="success" fixed>Texto</AtomBadge>
<AtomBadge variant="warning" fixed>Texto</AtomBadge>
<AtomBadge variant="error" fixed>Texto</AtomBadge>`,
  },
  Cards: {
    description: 'MoleculeCard: 3 variantes con DOM propio, no solo cambio de clase. "default" e "image" admiten eyebrow (slot) y acciones (slot); "service" es solo número de paso + título + texto, sin envoltura de cuerpo (única variante autorizada a numeración secuencial).',
    code: `<!-- Card -->
<MoleculeCard
  variant="default"
  image="/foto1.jpg"
  title="Centro de Innovación y Emprendimiento"
  text="Investigación aplicada al servicio de la comunidad empresarial peruana."
>
  <template #eyebrow>
    <AtomEyebrow>Investigación</AtomEyebrow>
  </template>
  <template #actions>
    <AtomButton variant="link">
      Leer más
      <AtomIcon name="arrow-right" :size="16" />
    </AtomButton>
  </template>
</MoleculeCard>
<MoleculeCard
  variant="default"
  image="/foto2.jpg"
  title="Convenios internacionales"
  text="Doble titulación con escuelas de negocio acreditadas globalmente."
>
  <template #eyebrow>
    <AtomEyebrow>Alianzas</AtomEyebrow>
  </template>
  <template #actions>
    <AtomButton variant="link">
      Leer más
      <AtomIcon name="arrow-right" :size="16" />
    </AtomButton>
  </template>
</MoleculeCard>

<!-- Card servicio (numeración de proceso) -->
<MoleculeCard variant="service" number="01" title="Postula" text="Completa el formulario de admisión y adjunta tu documentación académica." />
<MoleculeCard variant="service" number="02" title="Evaluación" text="Rinde la entrevista y la evaluación de admisión con el comité académico." />
<MoleculeCard variant="service" number="03" title="Matrícula" text="Confirma tu vacante y realiza el proceso de matrícula en línea." />

<!-- Card con imagen -->
<MoleculeCard
  variant="image"
  image="/foto3.jpg"
  title="Maestría en Business Administration"
  text="Formación gerencial integral con enfoque global."
>
  <template #eyebrow>
    <AtomEyebrow>MBA</AtomEyebrow>
  </template>
</MoleculeCard>`,
  },
  SocialIcons: {
    description: 'AtomSocialIcon: botón circular con glifo de marca en SVG inline (no depende de Lucide, que no trae logos) para las 5 redes — Facebook, Instagram, LinkedIn, YouTube, X. La prop "inverse" ajusta el contraste para footers oscuros.',
    code: `<!-- Sobre fondo claro -->
<AtomSocialIcon network="facebook" />
<AtomSocialIcon network="instagram" />
<AtomSocialIcon network="linkedin" />
<AtomSocialIcon network="youtube" />
<AtomSocialIcon network="x" />

<!-- Sobre fondo oscuro (footer) -->
<AtomSocialIcon network="facebook" inverse />
<AtomSocialIcon network="instagram" inverse />
<AtomSocialIcon network="linkedin" inverse />
<AtomSocialIcon network="youtube" inverse />
<AtomSocialIcon network="x" inverse />`,
  },
  Forms: {
    description: 'Los átomos del formulario, cada uno con sus estados: AtomFormInput (campo de texto), AtomFormSelect (dropdown), AtomFormTextarea (área de texto), AtomFormCheck (checkbox y radio, marcados en azul #0074AF como en la lámina), AtomFormLabel (etiqueta, con asterisco rojo si el campo es obligatorio y en su forma flotante) y AtomFormHelp (texto de ayuda). El borde de cada control cambia solo: gris claro vacío, gris fuerte con valor, azul con foco, rojo en error, verde en éxito; la prop "state" fuerza el estado dibujado —incluido "focus"— para poder mostrarlo en esta guía, donde nada tiene el foco real. Las dos formas que necesitan envoltorio son el buscador (lupa a la izquierda) y la etiqueta flotante (la etiqueta sube a sentarse sobre el borde y deja sitio al ícono de estado): ambas se arman con las clases .form-field--* que se ven abajo. MoleculeFormField ensambla todo esto —grupo, etiqueta, control y ayuda— cuando se quiere el campo completo de una sola pieza, incluidas las props error y success, que tiñen el grupo y reemplazan el texto de ayuda por el mensaje.',
    code: `<!-- Input text · vacío, foco, con valor, error, éxito, deshabilitado -->
<AtomFormInput id="nombre" placeholder="Ej. María Torres" v-model="vacio" />
<AtomFormInput id="nombre" state="focus" v-model="nombre" />
<AtomFormInput id="nombre" v-model="nombre" />
<AtomFormInput id="nombre" state="error" v-model="nombre" />
<AtomFormInput id="nombre" state="success" v-model="nombre" />
<AtomFormInput id="nombre" placeholder="Ej. María Torres" disabled />
<AtomFormInput id="correo" type="email" placeholder="correo@esan.edu.pe" required v-model="correo" />

<!-- Dropdown · mismos estados -->
<AtomFormSelect
  id="programa"
  placeholder="Seleccionar"
  :options="[
    { value: 'mba', label: 'MBA' },
    { value: 'finanzas', label: 'Maestría en Finanzas' },
    { value: 'marketing', label: 'Maestría en Marketing' },
  ]"
  v-model="programa"
/>
<AtomFormSelect id="programa" placeholder="Seleccionar" state="focus" :options="programas" v-model="programa" />
<AtomFormSelect id="programa" placeholder="Seleccionar" state="error" :options="programas" v-model="programa" />

<!-- Textarea · rows fija el alto inicial -->
<AtomFormTextarea id="mensaje" placeholder="Escribe tu mensaje" v-model="vacio" />
<AtomFormTextarea id="mensaje" state="focus" v-model="mensaje" />
<AtomFormTextarea id="mensaje" v-model="mensaje" />
<AtomFormTextarea id="mensaje" state="error" :rows="4" v-model="mensaje" />

<!-- Checkbox & Radio · el radio compara modelValue con su value -->
<AtomFormCheck v-model="acepta">Placeholder</AtomFormCheck>
<AtomFormCheck disabled>Placeholder</AtomFormCheck>
<AtomFormCheck type="radio" name="modalidad" value="presencial" v-model="modalidad">
  Placeholder
</AtomFormCheck>
<AtomFormCheck type="radio" name="modalidad" value="virtual" v-model="modalidad">
  Placeholder
</AtomFormCheck>
<!-- Cláusula legal: con "multiline" la casilla se alinea con la primera línea,
     no con el párrafo entero. El <span> agrupa texto y enlace: sin él, la
     etiqueta (que es flex) los pondría como dos piezas sueltas. -->
<AtomFormCheck v-model="acepta" multiline required>
  <span>Acepto las <a href="/privacidad">condiciones de tratamiento de mis datos</a>.</span>
</AtomFormCheck>

<!-- Etiqueta y texto de ayuda -->
<AtomFormLabel for="nombre">Label</AtomFormLabel>
<AtomFormLabel for="nombre" required>Label</AtomFormLabel>
<AtomFormHelp>Tal como figura en tu documento de identidad.</AtomFormHelp>

<!-- Search bar · la lupa vive en el envoltorio, el campo va type="search" -->
<div class="form-field form-field--search form-field--icon-start">
  <span class="form-field__icon"><AtomIcon name="search" :size="20" /></span>
  <AtomFormInput id="buscar" type="search" placeholder="Buscar" aria-label="Buscar" v-model="busqueda" />
</div>

<!-- Etiqueta flotante · "is-floated" la deja arriba cuando hay valor o placeholder;
     sin esa clase sube sola al enfocar. El ícono de estado pide --icon-end. -->
<div class="form-field form-field--floating form-field--icon-end is-floated">
  <AtomFormInput id="fl-nombre" placeholder="Placeholder" v-model="nombre" />
  <AtomFormLabel for="fl-nombre" floating>Placeholder</AtomFormLabel>
  <span class="form-field__status"><AtomIcon name="info" :size="20" /></span>
</div>

<!-- El estado de validación lo tiñe todo desde el grupo: borde, etiqueta,
     ícono y texto de ayuda. has-success usa el ícono "check". -->
<div class="form-group has-error">
  <div class="form-field form-field--floating form-field--icon-end is-floated">
    <AtomFormInput id="fl-error" v-model="nombre" />
    <AtomFormLabel for="fl-error" floating>Nombres y apellidos</AtomFormLabel>
    <span class="form-field__status"><AtomIcon name="alert-circle" :size="20" /></span>
  </div>
  <AtomFormHelp>Ingresa tu nombre tal como figura en tu documento.</AtomFormHelp>
</div>`,
  },
  Alerts: {
    description: 'MoleculeAlert: mensaje de estado con los 4 tokens semánticos (info, success, warning, error), cada uno con su ícono fijo (info, check-circle, alert-triangle, alert-circle respectivamente) — no es una prop libre, es parte del significado de la variante.',
    code: `<MoleculeAlert
  variant="info"
  title="Nueva convocatoria abierta"
  text="Las postulaciones para el ciclo 2026-I están disponibles desde el 1 de agosto."
/>
<MoleculeAlert
  variant="success"
  title="Postulación enviada"
  text="Recibirás la confirmación de tu asesor académico en un plazo de 48 horas."
/>
<MoleculeAlert
  variant="warning"
  title="Últimas vacantes"
  text="Quedan pocos cupos disponibles para la modalidad presencial."
/>
<MoleculeAlert
  variant="error"
  title="No pudimos procesar tu solicitud"
  text="Verifica los datos ingresados e inténtalo nuevamente."
/>`,
  },
  Dividers: {
    description: 'AtomDivider: separador horizontal (<hr>), con etiqueta centrada (línea + texto + línea), o vertical para uso inline entre elementos de una misma fila.',
    code: `<!-- Horizontal -->
<AtomDivider variant="horizontal" />

<!-- Con etiqueta -->
<AtomDivider variant="label">o continúa con</AtomDivider>

<!-- Vertical (uso inline) -->
<span>Pregrado</span>
<AtomDivider variant="vertical" />
<span>Posgrado</span>
<AtomDivider variant="vertical" />
<span>Educación Ejecutiva</span>`,
  },
  Steppers: {
    description: 'MoleculeStepper: indicador de progreso de varios pasos para procesos de admisión, matrícula o checkout. Cada paso acepta status "complete" (check), "active" (resaltado) o ninguno (pendiente); los conectores entre pasos se tiñen automáticamente después de un paso completado.',
    code: `<MoleculeStepper :steps="[
  { label: 'Datos personales', status: 'complete' },
  { label: 'Documentos', status: 'active' },
  { label: 'Pago' },
  { label: 'Confirmación' },
]" />`,
  },
  Avatars: {
    description: 'AtomAvatar: imagen o iniciales de respaldo, en 3 tamaños, con indicador de estado (online/offline) opcional. AtomAvatarGroup superpone varios avatares con borde blanco, para el patrón "+N" de resto de un grupo.',
    code: `<!-- Tamaños -->
<AtomAvatar size="sm" initials="MT" />
<AtomAvatar initials="MT" />
<AtomAvatar size="lg" initials="MT" />

<!-- Con imagen y estado -->
<AtomAvatar image="/foto1.jpg" status="online" />
<AtomAvatar image="/foto2.jpg" status="offline" />

<!-- Grupo apilado -->
<AtomAvatarGroup>
  <AtomAvatar size="sm" image="/foto1.jpg" />
  <AtomAvatar size="sm" image="/foto2.jpg" />
  <AtomAvatar size="sm" image="/foto3.jpg" />
  <AtomAvatar size="sm" initials="+5" />
</AtomAvatarGroup>`,
  },
  Chips: {
    description: 'MoleculeChip: dos variantes con etiqueta HTML distinta — "filter" (<button>, selección única con estado is-active, para grupos de filtros) y "removable" (<span> + botón de quitar aparte, para filtros ya aplicados).',
    code: `<!-- Filtro (selección única) -->
<MoleculeChip :active="filtro === 'todos'" @click="filtro = 'todos'">Todos</MoleculeChip>
<MoleculeChip :active="filtro === 'mba'" @click="filtro = 'mba'">MBA</MoleculeChip>
<MoleculeChip :active="filtro === 'maestrias'" @click="filtro = 'maestrias'">Maestrías</MoleculeChip>
<MoleculeChip :active="filtro === 'diplomados'" @click="filtro = 'diplomados'">Diplomados</MoleculeChip>

<!-- Removible (filtros aplicados) -->
<MoleculeChip removable remove-label="Quitar filtro Finanzas" @remove="quitarFiltro('Finanzas')">
  Finanzas
</MoleculeChip>
<MoleculeChip removable remove-label="Quitar filtro Presencial" @remove="quitarFiltro('Presencial')">
  Presencial
</MoleculeChip>
<MoleculeChip removable remove-label="Quitar filtro Turno noche" @remove="quitarFiltro('Turno noche')">
  Turno noche
</MoleculeChip>`,
  },
  Tooltips: {
    description: 'AtomTooltip: CSS puro vía atributo data-tooltip, visible con :hover y :focus-visible (navegación por teclado), sin JS. Con as="button" no fuerza tabindex (ya es nativo); por defecto es un <span> con tabindex="0". La posición admite "top" (por defecto) o "bottom".',
    code: `<!-- Sobre un botón-ícono -->
<AtomTooltip as="button" text="Copiar enlace" class="btn btn--secondary btn--icon" aria-label="Copiar enlace">
  <AtomIcon name="link" :size="16" />
</AtomTooltip>

<!-- Sobre texto inline, arriba (por defecto) -->
<AtomTooltip text="Programa acreditado internacionalmente">
  MBA Part-Time
</AtomTooltip>

<!-- Sobre texto inline, abajo -->
<AtomTooltip text="18 meses, modalidad híbrida" position="bottom">
  Duración del programa
</AtomTooltip>`,
  },
  Loaders: {
    description: 'AtomSpinner (spinner circular en 3 tamaños, con variante "inverse" para fondos de color) y AtomDotsLoader (loader de 3 puntos animados) — ambos respetan prefers-reduced-motion automáticamente.',
    code: `<!-- Spinner -->
<AtomSpinner size="sm" />
<AtomSpinner />
<AtomSpinner size="lg" />

<!-- Dots & botón en carga -->
<AtomDotsLoader />
<AtomButton variant="primary" disabled>
  <AtomSpinner size="sm" inverse />
  Enviando…
</AtomButton>`,
  },
  Progress: {
    description: 'MoleculeProgress: barra de progreso lineal con etiqueta y meta a la derecha (por defecto el porcentaje, pero acepta texto libre — ej. "Quedan 3 días"). Variantes semánticas success/warning y tamaño compacto "sm".',
    code: `<MoleculeProgress label="Perfil de postulante completo" :value="65" />
<MoleculeProgress label="Documentos aprobados" :value="100" variant="success" />
<MoleculeProgress
  label="Plazo de pago de matrícula"
  :value="85"
  variant="warning"
  size="sm"
  meta="Quedan 3 días"
/>`,
  },
  ScrollTop: {
    description: 'MoleculeScrollTop: botón flotante "volver arriba", con JS real (no solo CSS) — aparece cuando window.scrollY > 400, hace scroll suave al hacer click respetando prefers-reduced-motion. La prop "preview" (solo para mostrarlo en catálogos/documentación) lo fuerza siempre visible y position:absolute en vez de fixed.',
    code: `<MoleculeScrollTop />`,
  },
  Pagination: {
    description: 'MoleculePagination: navegación de páginas con windowing automático (siempre muestra la página 1, la última, y "siblingCount" páginas alrededor de la actual, con "…" en los huecos) — no hay que armar la lista de páginas a mano.',
    code: `<MoleculePagination
  :current-page="page"
  :total-pages="8"
  @change="page = $event"
/>`,
  },
  CookieBanner: {
    description: 'MoleculeCookieBanner: aviso de cookies fijo al pie con persistencia real en localStorage (clave "arcis-cookie-consent") — se muestra solo si el visitante todavía no respondió, y se oculta al aceptar o rechazar. Variantes "dark" (por defecto) y "light".',
    code: `<!-- Oscuro (variante por defecto) -->
<MoleculeCookieBanner @consent="onConsent" />

<!-- Claro -->
<MoleculeCookieBanner variant="light" @consent="onConsent" />`,
  },
  Breadcrumb: {
    description: 'MoleculeBreadcrumb: ruta de navegación jerárquica — el último ítem del array nunca es un link (se renderiza como texto actual, con aria-current="page"), se infiere automáticamente de su posición, no hace falta indicarlo aparte.',
    code: `<MoleculeBreadcrumb :items="[
  { label: 'Inicio', href: '#' },
  { label: 'Posgrado', href: '#' },
  { label: 'MBA Part-Time' },
]" />`,
  },
  ButtonGroup: {
    description: 'MoleculeButtonGroup: control segmentado de selección única con v-model. El mismo componente sirve para la variante de texto (prop "label" por ítem) y la de solo-ícono (prop "icon" + "ariaLabel" por ítem) — no son componentes separados.',
    code: `<!-- Texto -->
<MoleculeButtonGroup
  aria-label="Nivel académico"
  :items="[
    { value: 'pregrado', label: 'Pregrado' },
    { value: 'posgrado', label: 'Posgrado' },
    { value: 'executive', label: 'Executive' },
  ]"
  v-model="nivel"
/>

<!-- Solo ícono -->
<MoleculeButtonGroup
  aria-label="Tipo de vista"
  :items="[
    { value: 'grid', icon: 'layout-grid', ariaLabel: 'Vista de cuadrícula' },
    { value: 'list', icon: 'list', ariaLabel: 'Vista de lista' },
  ]"
  v-model="vista"
/>`,
  },
  Tabs: {
    description: 'MoleculeTabs: la tira de pestañas, en las tres formas del Figma. "underline" (por defecto) es la fila con un filete que cruza todo el ancho y una barra roja bajo la activa; "vertical" gira esa misma idea —filete a la izquierda y barra roja marcando el elemento activo—; y "cards" deja el filete compartido y convierte cada pestaña en su propia caja redondeada con ícono, que al activarse se rellena de rojo (es la que usa el bloque de tarjetas de valor). Dibuja solo la tira: el panel lo pone quien la use, y se enlazan con "panelId" en cada pestaña. La pestaña activa se controla con v-model. Cuando no caben, las dos formas horizontales se desplazan de lado y se pueden arrastrar con el ratón. Cada pestaña es un <a> con role="tab": el foco entra una sola vez en el grupo y dentro se mueve con las flechas, Inicio y Fin, como pide el patrón ARIA.',
    code: `<!-- Subrayado (por defecto) -->
<MoleculeTabs
  v-model="activo"
  aria-label="Secciones del programa"
  :items="[
    { id: 'general', label: 'Información general', panelId: 'panel-general' },
    { id: 'plan', label: 'Plan de estudios', panelId: 'panel-plan' },
    { id: 'admision', label: 'Admisión', panelId: 'panel-admision' },
  ]"
/>
<div id="panel-general" role="tabpanel" v-show="activo === 'general'">…</div>

<!-- Vertical -->
<MoleculeTabs v-model="activo" variant="vertical" :items="pestanas" aria-label="Secciones" />

<!-- Cards: cada pestaña es su propia caja, con ícono -->
<MoleculeTabs
  v-model="pilar"
  variant="cards"
  aria-label="Filtros"
  :items="[
    { id: 'academico', label: 'Excelencia académica', icon: 'graduation-cap' },
    { id: 'global', label: 'Alcance global', icon: 'globe' },
    { id: 'red', label: 'Red de egresados', icon: 'users' },
  ]"
/>`,
  },
  Collapse: {
    description: 'MoleculeCollapse: panel expandible individual, pieza base de un acordeón de FAQs. Cada panel es una tarjeta suelta —borde propio, esquinas redondeadas y flecha en el rojo de marca—; varias seguidas se separan solas, sin necesidad de un componente acordeón aparte, y cada una es independiente de las demás (abrir una no cierra el resto). La prop "default-open" la deja abierta ya montada y "inverse" da la versión para fondo oscuro: el panel se queda sin fondo propio —se apoya en el color de la sección— con el borde, el título y la flecha en claro. El disparador se renderiza como <a> con role="button" y aria-expanded, siguiendo la convención de la librería, y responde a Enter y Espacio igual que un botón.',
    code: `<!-- Claro · cerrado y abierto -->
<MoleculeCollapse title="¿Qué documentos necesito para postular?">
  Copia de DNI, grado de bachiller o título profesional, CV documentado y dos cartas de recomendación.
</MoleculeCollapse>
<MoleculeCollapse title="¿Hay financiamiento disponible?" default-open>
  Sí, contamos con líneas de financiamiento propio y convenios con entidades bancarias.
</MoleculeCollapse>

<!-- Sobre fondo oscuro: la sección pone el color, el panel va sin fondo -->
<MoleculeCollapse title="¿Qué documentos necesito para postular?" inverse>
  Copia de DNI, grado de bachiller o título profesional, CV documentado y dos cartas de recomendación.
</MoleculeCollapse>
<MoleculeCollapse title="¿Hay financiamiento disponible?" inverse default-open>
  Sí, contamos con líneas de financiamiento propio y convenios con entidades bancarias.
</MoleculeCollapse>`,
  },
  Dropdown: {
    description: 'MoleculeDropdown: menú contextual exclusivo (abrir uno cierra los demás en toda la página), se cierra con click afuera, al elegir una opción, o con Escape. Los ítems aceptan {label, icon} o {divider: true} para separadores.',
    code: `<MoleculeDropdown
  label="Programas"
  :items="[
    { label: 'MBA', icon: 'graduation-cap' },
    { label: 'Maestrías', icon: 'briefcase' },
    { label: 'Diplomados', icon: 'award' },
    { divider: true },
    { label: 'Ver todos los programas', icon: 'search' },
  ]"
/>`,
  },
  ListGroup: {
    description: 'MoleculeListGroup: lista vertical con ítems interactivos (link + ícono + chevron final fijo) — menú de configuración, pasos de un trámite. El ítem con "active: true" se resalta con el color de marca.',
    code: `<MoleculeListGroup :items="[
  { label: 'Datos personales', icon: 'user' },
  { label: 'Documentos', icon: 'file-text', active: true },
  { label: 'Pagos', icon: 'credit-card' },
]" />`,
  },
  Banners: {
    description: 'MoleculeBanner: 5 variantes con DOM propio según el caso. "brand"/"dark"/"outline" son franjas de color sólido con contenido + acciones (slot #actions); "image" e "image-split" son tiles con foto a sangre, overlay y flecha fija — "image-split" agrega un bloque de color sólido debajo de la foto en vez de degradado.',
    code: `<!-- Estándar: brand -->
<MoleculeBanner
  variant="brand"
  eyebrow="Admisión 2026-I"
  title="Las postulaciones ya están abiertas"
  text="Asegura tu vacante antes del 30 de agosto y accede a becas por pronto pago."
>
  <template #actions>
    <AtomButton variant="terciary">Postula ahora</AtomButton>
  </template>
</MoleculeBanner>

<!-- Estándar: outline, con ícono -->
<MoleculeBanner
  variant="outline"
  icon="file-down"
  title="Descarga el brochure del programa"
  text="Malla curricular, plana docente y modalidades de pago en un solo PDF."
>
  <template #actions>
    <AtomButton variant="link" href="#">
      Descargar
      <AtomIcon name="arrow-right" :size="16" />
    </AtomButton>
  </template>
</MoleculeBanner>

<!-- Con imagen -->
<MoleculeBanner
  variant="image"
  image="/foto1.jpg"
  title="Vida universitaria"
  text="Carreras de ciencias administrativas"
/>

<!-- Con imagen, sub-variante "split" -->
<MoleculeBanner
  variant="image-split"
  image="/foto2.jpg"
  title="ESAN Graduate School of Business"
  text="MBAs, Maestrías, Doctorados y programas especializados"
/>

<!-- Con imagen y eyebrow -->
<MoleculeBanner
  variant="image"
  image="/foto3.jpg"
  eyebrow="Maestrías"
  title="Management"
  text="Carreras de ciencias administrativas"
/>`,
  },
  Testimonials: {
    description: 'MoleculeTestimonial: dos formas con DOM propio — "standard" (cita + avatar + autor, con calificación de estrellas opcional vía prop "rating") y "video" (foto a sangre + botón de play + overlay con nombre, rol y un CTA).',
    code: `<!-- Estándar -->
<MoleculeTestimonial
  author-avatar="/renzo.jpg"
  quote="El MBA de ESAN me dio las herramientas y la red de contactos para liderar la expansión regional de mi empresa."
  author-name="Renzo Villalobos"
  author-role="MBA 2023 · Gerente Regional"
/>

<!-- Con video -->
<MoleculeTestimonial
  variant="video"
  image="/alberto.jpg"
  image-alt="Alberto Echevarria"
  author-name="Alberto Echevarria"
  author-role="Egresado · Administración y Marketing"
/>`,
  },
  PostCard: {
    description: 'MoleculePostCard: card de artículo con dos variantes — "standard" (eyebrow/categoría + título + extracto + meta de fecha y tiempo de lectura) y "news" (etiqueta superpuesta a la imagen + fecha simple + link "Leer artículo").',
    code: `<!-- Estándar -->
<MoleculePostCard
  image="/post1.jpg"
  eyebrow="Liderazgo"
  title="5 claves para liderar equipos remotos en el 2026"
  excerpt="Cómo mantener la cohesión y productividad de equipos distribuidos en distintas zonas horarias."
  published-date="18 jul 2026"
  reading-time="6 min de lectura"
/>
<MoleculePostCard
  image="/post2.jpg"
  eyebrow="Finanzas"
  title="Cómo leer el entorno macroeconómico antes de invertir"
  excerpt="Un marco práctico para decisiones de inversión en contextos de alta volatilidad."
  published-date="10 jul 2026"
  reading-time="8 min de lectura"
/>

<!-- Noticia (etiqueta sobre imagen) -->
<MoleculePostCard
  variant="news"
  image="/noticia.jpg"
  tag="Actualidad"
  date="09/07/2026"
  title="ESAN acompaña logro de escolar peruano premiado en mundial de robótica en Estados Unidos"
/>`,
  },
  EventCard: {
    description: 'MoleculeEventCard: tarjeta de evento en dos formatos con DOM distinto. "standard" (sin imagen) pone el bloque de fecha, el título con hora y lugar, y el botón: en ancho va en fila y, cuando la tarjeta se queda sin sitio, se apila sola —el botón baja alineado con el título, no con la fecha, y la hora y el lugar pasan uno debajo del otro—; con layout="stacked" se fuerza esa forma. "media" (con imagen) lleva el badge de fecha superpuesto, las etiquetas y el título: por defecto en vertical y, con layout="row", la foto pasa al costado izquierdo y el contenido se centra a su lado, volviendo sola a la vertical cuando no hay ancho. Las etiquetas se pasan como textos —la primera sale en rojo sólido y las siguientes en azul, como la lámina— o como objetos si se quiere elegir la variante de cada una.',
    code: `<!-- Sin imagen: en fila, y apilada a la fuerza -->
<MoleculeEventCard
  day="14"
  month="Ago"
  title="Open House MBA Part-Time"
  time="7:00 p.m."
  location="Campus Surco"
  cta-label="Inscribirme"
/>
<MoleculeEventCard
  layout="stacked"
  day="14"
  month="Ago"
  title="Open House MBA Part-Time"
  time="7:00 p.m."
  location="Campus Surco"
  cta-label="Inscribirme"
/>

<!-- Con imagen: vertical -->
<MoleculeEventCard
  variant="media"
  :image="imagen"
  day="02"
  month="Jul"
  :badges="['Texto', 'Texto']"
  title="Inicia tu Maestría con el PADE Internacional en Gestión del Talento Humano de ESAN"
/>

<!-- Con imagen: la foto al costado -->
<MoleculeEventCard
  variant="media"
  layout="row"
  :image="imagen"
  day="02"
  month="Jul"
  :badges="['Texto', 'Texto']"
  title="Inicia tu Maestría con el PADE Internacional en Gestión del Talento Humano de ESAN"
/>

<!-- Etiquetas con variante elegida una por una -->
<MoleculeEventCard
  variant="media"
  :image="imagen"
  day="02"
  month="Jul"
  :badges="[
    { label: 'Conferencia', variant: 'brand-solid' },
    { label: 'Presencial', variant: 'neutral' },
  ]"
  title="Inicia tu Maestría con el PADE Internacional"
/>`,
  },
  VideoPreview: {
    description: 'MoleculeVideoPreview (miniatura grande, "simple" o "featured" con overlay editorial y botón glass) y MoleculeVideoList (lista compacta de miniaturas + texto, para playlists o "related videos") — ambos son placeholders visuales para embeber video real.',
    code: `<!-- Simple -->
<MoleculeVideoPreview
  image="/video1.jpg"
  duration="02:14"
  aria-label="Reproducir video: Conoce el campus ESAN"
/>

<!-- Con contenido (glass) -->
<MoleculeVideoPreview
  variant="featured"
  image="/video2.jpg"
  duration="04:52"
  eyebrow="Vida universitaria"
  title="Testimonios: la vida en el campus ESAN"
  aria-label="Reproducir video: Testimonios, vida en el campus ESAN"
/>

<!-- Lista horizontal -->
<MoleculeVideoList :items="[
  { thumb: '/thumb1.jpg', title: 'Cómo armar tu plan de negocio en 90 días', meta: '12:03 · Emprendimiento' },
  { thumb: '/thumb2.jpg', title: 'Webinar: finanzas para no financieros', meta: '38:40 · Finanzas' },
  { thumb: '/thumb3.jpg', title: 'Egresados que transforman industrias', meta: '06:27 · Alumni' },
]" />`,
  },
  Marquee: {
    description: 'MoleculeMarquee: franja de desplazamiento continuo (reconocimientos, alianzas o cifras clave), respeta prefers-reduced-motion. El set de ítems se pasa una sola vez — el componente lo duplica internamente para el loop infinito sin salto. Variantes claro (por defecto), "dark" y "brand".',
    code: `<!-- Claro (variante por defecto) -->
<MoleculeMarquee :items="[
  { label: 'Acreditación internacional', icon: 'award' },
  { label: 'Red global de alumni', icon: 'globe' },
  { label: '+30 años de trayectoria', icon: 'graduation-cap' },
  { label: 'Top ranking Latam', icon: 'trending-up' },
]" />

<!-- Oscuro -->
<MoleculeMarquee :items="items" variant="dark" />

<!-- Rojo -->
<MoleculeMarquee :items="items" variant="brand" />`,
  },
};
