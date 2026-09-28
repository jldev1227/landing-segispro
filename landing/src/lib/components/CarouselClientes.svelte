<script lang="ts">
	/**
	 * Muro de clientes.
	 *
	 * Antes eran dos marquesinas infinitas en direcciones opuestas, con cada
	 * tarjeta marcada `role="button" tabindex="0"` sin manejador: anunciadas como
	 * botones al lector de pantalla, enfocables, e inertes. Un logotipo en
	 * movimiento perpetuo tampoco se puede leer, que es justo lo único que un
	 * muro de credibilidad tiene que conseguir.
	 *
	 * Ahora es una rejilla estática de placas. Se lee, se detiene, y no anuncia
	 * controles que no existen.
	 */
	import { fade } from 'svelte/transition';
	import { CIFRAS } from '$lib/data/cifras';

	interface Client {
		name: string;
		logo?: string;
	}

	export let visible = false;
	export let clientes: Client[] = [];
	/** Conservado por compatibilidad con quien monta el componente; ya no hay marquesina que temporizar. */
	export let speed = 0;
	void speed;
</script>

{#if visible}
	<div in:fade={{ duration: 400 }}>
		<h2
			class="font-leyenda text-2xl leading-tight font-bold tracking-[0.03em] text-balance text-tinta uppercase sm:text-3xl"
		>
			Aseguradoras y ARL que nos contratan
		</h2>

		<!--
			Los filetes van en cada celda, no como fondo de la rejilla: con `gap-px`
			sobre un fondo gris, una última fila incompleta pintaba celdas fantasma.
		-->
		<ul
			class="mt-10 grid grid-cols-2 overflow-hidden rounded-suave border-t border-l border-gray-200 bg-placa sm:grid-cols-3 lg:grid-cols-4"
		>
			{#each clientes as client (client.name)}
				<li class="flex h-28 items-center justify-center border-r border-b border-gray-200 px-6">
					{#if client.logo}
						<img
							src={client.logo}
							alt={client.name}
							loading="lazy"
							decoding="async"
							class="max-h-14 w-auto max-w-full object-contain"
						/>
					{:else}
						<span
							class="text-center font-leyenda text-sm font-bold tracking-[0.05em] text-tinta uppercase"
						>
							{client.name}
						</span>
					{/if}
				</li>
			{/each}
		</ul>

		<div class="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-2">
			<p class="text-sm text-gray-600">
				<span class="text-lg font-bold text-tinta tabular-nums">{CIFRAS.empresas}</span>
				empresas atendidas
			</p>
			<a
				href="#contacto"
				class="border-b-2 border-obliga pb-0.5 font-leyenda text-sm font-bold tracking-[0.08em] text-obliga uppercase transition-colors hover:border-segura hover:text-segura"
			>
				Hablemos de la suya
			</a>
		</div>
	</div>
{/if}
