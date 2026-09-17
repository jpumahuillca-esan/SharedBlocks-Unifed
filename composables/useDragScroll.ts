import { onMounted, onBeforeUnmount, type Ref } from 'vue';

/**
 * Arrastrar con el ratón para desplazar un carril horizontal.
 *
 * Por qué existe: un contenedor con `overflow-x: auto` se desplaza solo con
 * gestos que el ratón no tiene. El dedo arrastra, el trackpad hace el barrido
 * de dos dedos, pero la rueda de un ratón es vertical y ahí el carril queda
 * inalcanzable. Esto cubre ese hueco sin añadir puntos ni flechas.
 *
 * Qué NO hace, a propósito: convertir la rueda vertical en desplazamiento
 * horizontal. Es la otra solución habitual y secuestra el scroll de la página —
 * al pasar el cursor por encima, la rueda deja de bajar la página y el usuario
 * se queda atrapado en el carril.
 *
 * Clases que aplica al elemento, para que la hoja de estilos decida el cursor:
 *   - `is-draggable`: hay contenido fuera de la vista, así que arrastrar sirve.
 *   - `is-dragging`:  hay un arrastre en curso.
 */

/** Píxeles que hay que recorrer antes de tratarlo como arrastre y no como clic. */
const DRAG_THRESHOLD = 5;

export const useDragScroll = (target: Ref<HTMLElement | null>) => {
    /** Puntero que inició el gesto; null si no hay ninguno activo. */
    let pointerId: number | null = null;
    let startX = 0;
    let startScrollLeft = 0;

    /** El gesto superó el umbral: ya es un arrastre. */
    let dragging = false;

    /**
     * Hubo arrastre y todavía no ha llegado el clic que lo cierra.
     *
     * Se guarda aparte de `dragging` porque el clic llega DESPUÉS de pointerup,
     * cuando el gesto ya terminó: sin esta bandera no habría forma de saber, en
     * el momento del clic, que venía de un arrastre.
     */
    let suppressNextClick = false;

    const onPointerDown = (event: PointerEvent) => {
        const el = target.value;
        if (!el) return;

        /*
         * Solo ratón. El dedo y el lápiz ya desplazan de forma nativa, y mucho
         * mejor —con inercia y rebote—; interceptarlos solo estropearía eso.
         */
        if (event.pointerType !== 'mouse') return;

        // Solo el botón principal: el secundario abre el menú contextual.
        if (event.button !== 0) return;

        pointerId = event.pointerId;
        startX = event.clientX;
        startScrollLeft = el.scrollLeft;
        dragging = false;
    };

    const onPointerMove = (event: PointerEvent) => {
        const el = target.value;
        if (!el || pointerId === null || event.pointerId !== pointerId) return;

        const delta = event.clientX - startX;

        if (!dragging) {
            /*
             * Hasta el umbral no pasa nada. Es lo que permite que un clic sobre
             * el botón de reproducir o sobre el enlace de la tarjeta siga siendo
             * un clic: casi nadie mantiene el cursor perfectamente quieto al
             * pulsar, pero tampoco lo mueve cinco píxeles.
             */
            if (Math.abs(delta) < DRAG_THRESHOLD) return;

            dragging = true;
            el.setPointerCapture(pointerId);
            el.classList.add('is-dragging');

            /*
             * scroll-snap pelea con el arrastre: a cada píxel intenta encajar en
             * la tarjeta más cercana y el movimiento sale a tirones. Se desactiva
             * mientras dura el gesto y se restaura al soltar, de modo que el
             * carril acabe encajado igual que con cualquier otro método.
             */
            el.style.scrollSnapType = 'none';
        }

        el.scrollLeft = startScrollLeft - delta;

        // Sin esto, arrastrar selecciona el texto y las imágenes del carril.
        event.preventDefault();
    };

    const endDrag = (event: PointerEvent) => {
        const el = target.value;
        if (!el || pointerId === null || event.pointerId !== pointerId) return;

        if (dragging) {
            if (el.hasPointerCapture(pointerId)) el.releasePointerCapture(pointerId);
            el.classList.remove('is-dragging');
            el.style.scrollSnapType = '';
            suppressNextClick = true;
        }

        pointerId = null;
        dragging = false;
    };

    /**
     * Un arrastre termina con un `click` sobre lo que hubiera bajo el cursor.
     * Sin esto, pasear el carril abriría el enlace de la tarjeta donde se soltó.
     *
     * Va en fase de captura para llegar antes que el manejador del enlace.
     */
    const onClickCapture = (event: MouseEvent) => {
        if (!suppressNextClick) return;

        suppressNextClick = false;
        event.preventDefault();
        event.stopPropagation();
    };

    /*
     * El cursor de mano solo debe aparecer si de verdad hay algo que alcanzar.
     * Se mide el desbordamiento real en lugar de suponerlo por un punto de
     * quiebre: así vale igual si el carril vive en una columna estrecha que si
     * ocupa todo el ancho.
     */
    const measure = () => {
        const el = target.value;
        if (!el) return;

        el.classList.toggle('is-draggable', el.scrollWidth - el.clientWidth > 2);
    };

    let observer: ResizeObserver | null = null;

    onMounted(() => {
        const el = target.value;
        if (!el) return;

        el.addEventListener('pointerdown', onPointerDown);
        el.addEventListener('pointermove', onPointerMove);
        el.addEventListener('pointerup', endDrag);
        el.addEventListener('pointercancel', endDrag);
        el.addEventListener('click', onClickCapture, true);

        measure();

        // El desbordamiento cambia al redimensionar la ventana y también al
        // cambiar el ancho del lienzo del editor, que no dispara 'resize'.
        if (typeof ResizeObserver !== 'undefined') {
            observer = new ResizeObserver(measure);
            observer.observe(el);
        }

        window.addEventListener('resize', measure);
    });

    onBeforeUnmount(() => {
        const el = target.value;

        if (el) {
            el.removeEventListener('pointerdown', onPointerDown);
            el.removeEventListener('pointermove', onPointerMove);
            el.removeEventListener('pointerup', endDrag);
            el.removeEventListener('pointercancel', endDrag);
            el.removeEventListener('click', onClickCapture, true);
        }

        observer?.disconnect();
        window.removeEventListener('resize', measure);
    });
};
