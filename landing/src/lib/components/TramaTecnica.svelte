<script lang="ts">
	/**
	 * Reticula vectorial inspirada en planos de operacion y trazados viales.
	 * Se mantiene como SVG real para que conserve nitidez en cualquier pantalla.
	 */
	let clase = '';
	export { clase as class };
</script>

<svg
	class={clase}
	viewBox="0 0 960 620"
	preserveAspectRatio="xMidYMid slice"
	aria-hidden="true"
	focusable="false"
>
	<defs>
		<pattern id="reticula-segispro" width="48" height="48" patternUnits="userSpaceOnUse">
			<path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" stroke-width="1" />
		</pattern>
		<filter id="resplandor-segispro" x="-50%" y="-50%" width="200%" height="200%">
			<feGaussianBlur stdDeviation="7" />
		</filter>
	</defs>

	<rect width="960" height="620" fill="url(#reticula-segispro)" opacity="0.12" />
	<g fill="none" stroke="currentColor">
		<path
			d="M-80 520 C140 510 120 265 330 290 S565 485 720 360 820 125 1040 118"
			stroke-width="2"
			stroke-dasharray="9 12"
			opacity="0.38"
		/>
		<path
			d="M-40 548 C170 548 166 315 344 324 S555 515 748 389 845 160 1010 154"
			stroke-width="1"
			opacity="0.2"
		/>
		<circle cx="330" cy="290" r="10" stroke-width="3" opacity="0.7" />
		<circle cx="720" cy="360" r="10" stroke-width="3" opacity="0.7" />
		<circle cx="330" cy="290" r="27" stroke-width="1" opacity="0.24" />
		<circle cx="720" cy="360" r="27" stroke-width="1" opacity="0.24" />
		<path d="M120 88h112M176 32v112" stroke-width="1" opacity="0.22" />
		<path d="M790 520h112M846 464v112" stroke-width="1" opacity="0.22" />
	</g>
	<circle
		cx="720"
		cy="360"
		r="18"
		fill="currentColor"
		opacity="0.12"
		filter="url(#resplandor-segispro)"
	/>
</svg>
