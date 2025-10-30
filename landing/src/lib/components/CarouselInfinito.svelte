<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	interface Characteristic {
		icon: string;
		title: string;
		description: string;
	}

	export let visible = false;
	export let characteristics: Characteristic[] = [];

	let isPaused = false;
	let carouselSpeed = 15; // segundos
</script>

{#if visible}
	<div 
		class="relative mt-16"
		in:fly={{ y: 50, duration: 800, delay: 400 }}
	>
		<div class="overflow-hidden relative">
			<!-- lineares laterales -->
			<div class="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-slate-900 to-transparent z-10 pointer-events-none"></div>
			<div class="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-slate-900 to-transparent z-10 pointer-events-none"></div>

			<!-- Track del carrusel -->
			<div 
				class="carousel-track flex gap-8"
				class:animate-scroll={!isPaused}
				style="animation-duration: {carouselSpeed}s;"
			>
				<!-- Duplicamos las características para efecto infinito -->
				{#each [...characteristics, ...characteristics] as char, i}
					<div 
						class="carousel-item shrink-0 w-80 bg-linear-to-br from-slate-700/60 to-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/50 hover:border-blue-500/70 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
					>
						<div class="flex items-start space-x-4">
							<!-- Icono -->
							<div class="shrink-0 w-14 h-14 bg-linear-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-3xl shadow-lg transform hover:rotate-12 transition-transform duration-300">
								{char.icon}
							</div>
							
							<!-- Contenido -->
							<div class="flex-1">
								<h4 class="text-xl font-bold mb-2 text-white">
									{char.title}
								</h4>
								<p class="text-gray-300 text-sm leading-relaxed">
									{char.description}
								</p>
							</div>
						</div>

						<!-- Indicador de número -->
						<div class="mt-4 pt-4 border-t border-slate-600/50">
							<span class="text-xs font-semibold text-blue-400">
								{String(i % characteristics.length + 1).padStart(2, '0')}
							</span>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Indicador de "Pasa el mouse para pausar" -->
		<div class="text-center mt-8">
			<p class="text-sm text-gray-400 italic">
				💡 Pasa el mouse sobre las tarjetas para pausar el carrusel
			</p>
		</div>
	</div>
{/if}

<style>
	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}

	.animate-scroll {
		animation: scroll linear infinite;
	}

	.animate-scroll:hover {
		animation-play-state: paused;
	}

	.carousel-track {
		will-change: transform;
	}
</style>
