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

	/**
	 * La alineación vertical va en el mapa, no en la clase base, porque el
	 * triángulo necesita `items-end` y dos utilidades de Tailwind con la misma
	 * especificidad se resuelven por el orden del CSS generado, no por el orden
	 * en que se escriben en el atributo. Declararla una sola vez por forma
	 * elimina la carrera.
	 */
	const GEOMETRIA: Record<Tipo, { forma: string; campo: string; tinta: string; titulo: string }> = {
		// Círculo: acción obligatoria. Aquí, lo normativo.
		obliga: {
			forma: 'rounded-full items-center',
			campo: 'bg-obliga',
			tinta: 'text-obliga-tinta',
			titulo: 'Obligación'
		},
		// Triángulo: advertencia. Aquí, el riesgo que se gestiona.
		advierte: {
			forma: 'placa-triangulo items-end',
			campo: 'bg-advierte',
			tinta: 'text-advierte-tinta',
			titulo: 'Advertencia'
		},
		// Cuadrado: condición segura. Aquí, lo que SEGISPRO entrega.
		//
		// Lleva el radio suave del resto de la página, no más: a partir de ahí
		// un cuadrado deja de distinguirse de un círculo a este tamaño, y la
		// distinción es justamente lo que el sistema usa para clasificar.
		segura: {
			forma: 'rounded-suave items-center',
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
	/**
	 * Elemento de la banda de leyenda. Por defecto es un párrafo, porque la
	 * mayoría de placas viven dentro de una lista y no encabezan nada. Cuando la
	 * placa sí titula una sección se le pasa el nivel que le toca, para que el
	 * esquema del documento no salte de `h2` a `h4`.
	 */
	export let leyendaComo: 'p' | 'h2' | 'h3' | 'h4' = 'p';

	$: g = GEOMETRIA[tipo];
	$: lado = escala === 'grande' ? 'h-28 w-28 sm:h-32 sm:w-32' : 'h-20 w-20';
	/**
	 * El triángulo lleva pictograma más pequeño y apoyado contra la base.
	 *
	 * No es una preferencia estética. El recorte deja disponible menos de la
	 * mitad del ancho a media altura, así que con la medida del círculo se le
	 * comían las dos esquinas superiores. Y el intento anterior de bajarlo con
	 * `pt-[22%]` era peor: el porcentaje de un relleno se resuelve contra el
	 * ancho del bloque contenedor —la columna entera, 378px— y no contra la
	 * placa, así que el relleno salía de 83px sobre una placa de 80 y el glifo
	 * terminaba fuera del triángulo, por debajo del vértice inferior.
	 *
	 * Con `items-end` y un relleno en píxeles, el pictograma queda donde queda
	 * en una señal real: holgado, en el tercio inferior, sin tocar los lados.
	 */
	$: tamIcono =
		escala === 'grande'
			? tipo === 'advierte'
				? 'h-10 w-10 sm:h-11 sm:w-11'
				: 'h-12 w-12 sm:h-14 sm:w-14'
			: tipo === 'advierte'
				? 'h-7 w-7'
				: 'h-9 w-9';
	$: baseTriangulo = tipo === 'advierte' ? (escala === 'grande' ? 'pb-4 sm:pb-5' : 'pb-3') : '';
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
			class="{lado} {g.forma} {g.campo} {baseTriangulo} flex shrink-0 justify-center transition-transform duration-150 group-hover:-translate-y-0.5"
			title={g.titulo}
		>
			<Icono nombre={icono} class="{tamIcono} {g.tinta}" />
		</div>

		<div class="min-w-0 flex-1 pt-1">
			<!-- Banda de leyenda: versales estrechas, como en una placa real. -->
			<svelte:element
				this={leyendaComo}
				class="font-leyenda text-sm leading-tight font-bold tracking-[0.06em] text-tinta uppercase sm:text-base"
			>
				{leyenda}
			</svelte:element>
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
