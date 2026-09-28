<script lang="ts">
	/**
	 * Acceso permanente al WhatsApp comercial: el mismo número del CTA de
	 * cotización, con el primer mensaje ya redactado.
	 *
	 * Es lo único de la página que va en pastilla completa, junto con la placa
	 * de obligación. No por capricho: un acceso permanente que flota sobre el
	 * contenido no pertenece a la retícula de la página, y la forma lo dice
	 * antes de que se lea. La marca de WhatsApp se conserva tal cual porque es
	 * la que hace reconocible el destino de un vistazo.
	 *
	 * La leyenda se despliega al apuntar y al enfocar, no en reposo: un rótulo
	 * permanente en la esquina tapa contenido durante toda la visita.
	 *
	 * La sombra es lo único difuminado de la página, y está justificada: es el
	 * único elemento que de verdad flota sobre el contenido, y la elevación es
	 * lo que lo dice. Antes era un filete duro de 2px, que sobre una placa
	 * cuadrada se leía como el canto de un rótulo impreso; sobre la pastilla se
	 * leía como un botón en relieve de los años dos mil.
	 */
	import { WHATSAPP, WHATSAPP_URL } from '$lib/seo/site';
</script>

<a
	href={WHATSAPP_URL}
	target="_blank"
	rel="noopener"
	class="grupo-wa fixed right-4 bottom-4 z-40 flex items-center gap-0 rounded-pastilla bg-segura text-segura-tinta shadow-[0_4px_14px_-4px_rgba(22,32,46,0.45)] transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tinta sm:right-6 sm:bottom-6"
	style="padding-bottom: env(safe-area-inset-bottom, 0px);"
	aria-label={`Escribir por WhatsApp al ${WHATSAPP.numeroVisible}`}
>
	<span class="flex h-14 w-14 shrink-0 items-center justify-center sm:h-16 sm:w-16">
		<!-- Marca de WhatsApp. Decorativa: el destino ya va en el `aria-label`. -->
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			class="h-7 w-7 sm:h-8 sm:w-8"
			aria-hidden="true"
			focusable="false"
		>
			<path
				d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.48-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.1 3.2 5.07 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35Z"
			/>
			<path
				d="M12.04 2C6.6 2 2.18 6.42 2.18 11.86c0 1.74.46 3.44 1.32 4.94L2 22l5.34-1.4a9.82 9.82 0 0 0 4.7 1.2h.01c5.43 0 9.85-4.42 9.85-9.86A9.8 9.8 0 0 0 19 4.87 9.8 9.8 0 0 0 12.04 2Zm0 18.03h-.01a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.16 8.16 0 0 1-1.25-4.33c0-4.52 3.68-8.2 8.2-8.2 2.19 0 4.25.86 5.8 2.41a8.15 8.15 0 0 1 2.4 5.8c0 4.52-3.68 8.2-8.2 8.2Z"
			/>
		</svg>
	</span>

	<!-- Banda de leyenda. Ocupa ancho cero hasta que se apunta o se enfoca. -->
	<span
		class="leyenda-wa max-w-0 overflow-hidden rounded-r-pastilla font-leyenda text-sm font-bold tracking-[0.07em] whitespace-nowrap uppercase"
	>
		<span class="block pr-5">Cotizar por WhatsApp</span>
	</span>
</a>

<style>
	.leyenda-wa {
		transition: max-width 220ms ease;
	}

	.grupo-wa:hover .leyenda-wa,
	.grupo-wa:focus-visible .leyenda-wa {
		max-width: 16rem;
	}

	@media (prefers-reduced-motion: reduce) {
		.grupo-wa,
		.leyenda-wa {
			transition: none;
		}
	}
</style>
