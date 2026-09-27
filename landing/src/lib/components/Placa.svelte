<script lang="ts">
	/**
	 * Placa de señalización: la unidad del sistema visual de la portada.
	 *
	 * En ISO 7010 la forma no es decoración, es la mitad del mensaje. El círculo
	 * obliga, el triángulo advierte, el cuadrado indica condición segura. Por eso
	 * la geometría y el color viajan juntos en un solo `tipo` y no se pueden
	 * combinar mal desde el sitio de uso: una placa verde con triángulo estaría
	 * diciendo dos cosas contrarias a la vez.
	 *
	 * Traducción de la marca: el código original es rojo-amarillo-azul, y la
	 * identidad descartó el rojo. Se conserva el significado y cambian los tonos.
	 */
	import Icono from './Icono.svelte';

	type Tipo = 'obliga' | 'advierte' | 'segura';

	const GEOMETRIA: Record<Tipo, { forma: string; campo: string; tinta: string; titulo: string }> = {
		// Círculo: acción obligatoria. Aquí, lo normativo.
		obliga: {
			forma: 'rounded-full',
			campo: 'bg-obliga',
			tinta: 'text-obliga-tinta',
			titulo: 'Obligación'
		},
		// Triángulo: advertencia. Aquí, el riesgo que se gestiona.
		advierte: {
			forma: 'placa-triangulo pt-[18%]',
			campo: 'bg-advierte',
			tinta: 'text-advierte-tinta',
			titulo: 'Advertencia'
		},
		// Cuadrado: condición segura. Aquí, lo que SEGISPRO entrega.
		segura: {
			forma: 'rounded-none',
			campo: 'bg-segura',
			tinta: 'text-segura-tinta',
			titulo: 'Condición segura'
		}
	};

	export let tipo: Tipo = 'segura';
	export let icono: string;
	export let leyenda: string;
	/** Texto de apoyo bajo la banda de leyenda. Opcional: una señal puede no llevarlo. */
	export let detalle = '';
	/** Cuando se da, la placa entera es el destino. */
	export let href = '';
	/** Escala. `grande` es la del primer pliegue. */
	export let escala: 'normal' | 'grande' = 'normal';

	$: g = GEOMETRIA[tipo];
	$: lado = escala === 'grande' ? 'h-28 w-28 sm:h-32 sm:w-32' : 'h-20 w-20';
	$: tamIcono = escala === 'grande' ? 'h-12 w-12 sm:h-14 sm:w-14' : 'h-9 w-9';
</script>

<svelte:element
	this={href ? 'a' : 'div'}
	{...href ? { href } : {}}
	class="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-obliga"
>
	<div class="flex items-start gap-4">
		<!--
			El pictograma sobre su campo de color. `title` nombra la categoría de la
			señal para quien use lector de pantalla: la forma se lo dice a quien ve.
		-->
		<div
			class="{lado} {g.forma} {g.campo} flex shrink-0 items-center justify-center transition-transform duration-150 group-hover:-translate-y-0.5"
			title={g.titulo}
		>
			<Icono nombre={icono} class="{tamIcono} {g.tinta}" />
		</div>

		<div class="min-w-0 flex-1 pt-1">
			<!-- Banda de leyenda: versales estrechas, como en una placa real. -->
			<p
				class="font-leyenda text-sm leading-tight font-bold tracking-[0.06em] text-tinta uppercase sm:text-base"
			>
				{leyenda}
			</p>
			{#if detalle}
				<p class="mt-1.5 text-sm leading-relaxed text-gray-600">{detalle}</p>
			{/if}
			<slot />
		</div>
	</div>
</svelte:element>

<style>
	/* El triángulo de advertencia, recortado en vez de dibujado, para que el
	   campo de color siga siendo un solo elemento y el foco lo rodee entero. */
	.placa-triangulo {
		clip-path: polygon(50% 4%, 96% 92%, 4% 92%);
	}
</style>
