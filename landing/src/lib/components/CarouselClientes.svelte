<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	interface Client {
		name: string;
		logo?: string;
	}

	export let visible = false;
	export let clientes: Client[] = [];
	export let speed = 30;

	let hoveredIndex: number | null = null;

	// Dividimos clientes en dos grupos para animaciones alternadas
	$: group1 = clientes.filter((_, i) => i % 2 === 0);
	$: group2 = clientes.filter((_, i) => i % 2 === 1);
</script>

{#if visible}
	<div 
		class="relative py-16"
		in:fade={{ duration: 800, delay: 200 }}
	>
		<!-- Encabezado mejorado -->
		<div class="text-center mb-16" in:fly={{ y: 30, duration: 800 }}>
			<p class="text-sm text-blue-600 uppercase tracking-wide mb-3 font-semibold">
				Confían en nosotros
			</p>
			<h3 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
				Nuestros <span class="text-blue-600">Clientes</span>
			</h3>
			<div class="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
		</div>

		<!-- Grid flotante con animaciones alternadas -->
		<div class="relative max-w-7xl mx-auto">
			<!-- Elementos decorativos de fondo -->
			<div class="absolute -top-10 -left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
			<div class="absolute -bottom-10 -right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>

			<!-- Fila 1 - Movimiento de izquierda a derecha -->
			<div class="flex gap-6 mb-6 overflow-hidden py-4">
				<div 
					class="flex gap-6 animate-scroll-right"
					style="animation-duration: {speed}s;"
				>
					{#each [...group1, ...group1] as client, i}
						<div
							class="client-card-wrapper group relative flex-shrink-0 w-64 cursor-pointer"
							on:mouseenter={() => hoveredIndex = i}
							on:mouseleave={() => hoveredIndex = null}
							role="button"
							tabindex="0"
						>
							<!-- Card interno con transform -->
							<div class="client-card h-32 bg-white rounded-2xl p-6 border border-gray-200 shadow-lg transition-all duration-500 overflow-hidden">
								<!-- Gradiente animado en hover -->
								<div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
								
								<!-- Brillo superior -->
								<div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

								<!-- Contenido -->
								<div class="relative z-10 h-full flex items-center justify-center">
									{#if client.logo}
										<img 
											src={client.logo} 
											alt={client.name}
											class="h-16 w-auto object-contain transition-all duration-500 transform group-hover:scale-110"
										/>
									{:else}
										<div class="text-2xl font-bold text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
											{client.name}
										</div>
									{/if}
								</div>

								<!-- Esquina decorativa -->
								<div class="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Fila 2 - Movimiento de derecha a izquierda -->
			<div class="flex gap-6 overflow-hidden py-4">
				<div 
					class="flex gap-6 animate-scroll-left"
					style="animation-duration: {speed * 0.8}s;"
				>
					{#each [...group2, ...group2] as client, i}
						<div
							class="client-card-wrapper group relative flex-shrink-0 w-64 cursor-pointer"
							role="button"
							tabindex="0"
						>
							<!-- Card interno con transform -->
							<div class="client-card h-32 bg-white rounded-2xl p-6 border border-gray-200 shadow-lg transition-all duration-500 overflow-hidden">
								<!-- Gradiente animado en hover -->
								<div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
								
								<!-- Brillo superior -->
								<div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

								<!-- Contenido -->
								<div class="relative z-10 h-full flex items-center justify-center">
									{#if client.logo}
										<img 
											src={client.logo} 
											alt={client.name}
											class="h-16 w-auto object-contain transition-all duration-500 transform group-hover:scale-110"
										/>
									{:else}
										<div class="text-2xl font-bold text-gray-700 group-hover:text-purple-600 transition-colors duration-300">
											{client.name}
										</div>
									{/if}
								</div>

								<!-- Esquina decorativa -->
								<div class="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Stats o CTA opcional -->
		<div class="text-center mt-16" in:fly={{ y: 30, duration: 800, delay: 400 }}>
			<div class="inline-flex items-center gap-8 bg-white rounded-full px-8 py-4 shadow-lg border border-gray-100">
				<div class="flex items-center gap-3">
					<div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
					<span class="text-sm text-gray-600 font-medium">
						+{clientes.length} empresas confían en nosotros
					</span>
				</div>
				<div class="w-px h-6 bg-gray-200"></div>
				<button class="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
					Únete a ellos →
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Animación de scroll hacia la derecha */
	@keyframes scroll-right {
		0% {
			transform: translateX(-50%);
		}
		100% {
			transform: translateX(0%);
		}
	}

	/* Animación de scroll hacia la izquierda */
	@keyframes scroll-left {
		0% {
			transform: translateX(0%);
		}
		100% {
			transform: translateX(-50%);
		}
	}

	.animate-scroll-right {
		animation: scroll-right linear infinite;
		will-change: transform;
	}

	.animate-scroll-left {
		animation: scroll-left linear infinite;
		will-change: transform;
	}

	/* Pausar en hover de la fila completa */
	.animate-scroll-right:hover,
	.animate-scroll-left:hover {
		animation-play-state: paused;
	}

	/* Wrapper del card con scale en hover */
	.client-card-wrapper:hover .client-card {
		transform: translateY(-8px) scale(1.02);
		box-shadow: 0 20px 40px rgba(59, 130, 246, 0.2);
	}

	/* Efecto de profundidad */
	.client-card {
		position: relative;
		transform-style: preserve-3d;
	}
</style>