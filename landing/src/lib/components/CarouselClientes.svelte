<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	interface Client {
		name: string;
		logo?: string;
	}

	export let visible = false;
	export let clientes: Client[] = [];
	export let speed = 30;

	// Dividimos clientes en dos grupos para animaciones alternadas
	$: group1 = clientes.filter((_, i) => i % 2 === 0);
	$: group2 = clientes.filter((_, i) => i % 2 === 1);
</script>

{#if visible}
	<div class="relative py-16" in:fade={{ duration: 800, delay: 200 }}>
		<!-- Encabezado mejorado -->
		<div class="mb-16 text-center" in:fly={{ y: 30, duration: 800 }}>
			<p class="mb-3 text-sm font-semibold tracking-wide text-blue-600 uppercase">
				Confían en nosotros
			</p>
			<h3 class="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
				Nuestros <span class="text-blue-600">Clientes</span>
			</h3>
			<div
				class="mx-auto h-1.5 w-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
			></div>
		</div>

		<!-- Grid flotante con animaciones alternadas -->
		<div class="relative mx-auto max-w-7xl">
			<!-- Elementos decorativos de fondo -->
			<div
				class="absolute -top-10 -left-10 h-72 w-72 animate-pulse rounded-full bg-blue-500/5 blur-3xl"
			></div>
			<div
				class="absolute -right-10 -bottom-10 h-96 w-96 animate-pulse rounded-full bg-purple-500/5 blur-3xl"
				style="animation-delay: 1s;"
			></div>

			<!-- Fila 1 - Movimiento de izquierda a derecha -->
			<div class="mb-6 flex gap-6 overflow-hidden py-4">
				<div class="animate-scroll-right flex gap-6" style="animation-duration: {speed}s;">
					{#each [...group1, ...group1] as client, i (client.name + i)}
						<div
							class="client-card-wrapper group relative w-64 shrink-0 cursor-pointer"
							role="button"
							tabindex="0"
						>
							<!-- Card interno con transform -->
							<div
								class="client-card h-32 overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-500"
							>
								<!-- Gradiente animado en hover -->
								<div
									class="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
								></div>

								<!-- Brillo superior -->
								<div
									class="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
								></div>

								<!-- Contenido -->
								<div class="relative z-10 flex h-full items-center justify-center">
									{#if client.logo}
										<img
											src={client.logo}
											alt={client.name}
											class="h-16 w-auto transform object-contain transition-all duration-500 group-hover:scale-110"
										/>
									{:else}
										<div
											class="text-2xl font-bold text-gray-700 transition-colors duration-300 group-hover:text-blue-600"
										>
											{client.name}
										</div>
									{/if}
								</div>

								<!-- Esquina decorativa -->
								<div
									class="absolute right-0 bottom-0 h-20 w-20 rounded-tl-full bg-gradient-to-tl from-blue-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
								></div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Fila 2 - Movimiento de derecha a izquierda -->
			<div class="flex gap-6 overflow-hidden py-4">
				<div class="animate-scroll-left flex gap-6" style="animation-duration: {speed * 0.8}s;">
					{#each [...group2, ...group2] as client (client.name + Math.random())}
						<div
							class="client-card-wrapper group relative w-64 shrink-0 cursor-pointer"
							role="button"
							tabindex="0"
						>
							<!-- Card interno con transform -->
							<div
								class="client-card h-32 overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-500"
							>
								<!-- Gradiente animado en hover -->
								<div
									class="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
								></div>

								<!-- Brillo superior -->
								<div
									class="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
								></div>

								<!-- Contenido -->
								<div class="relative z-10 flex h-full items-center justify-center">
									{#if client.logo}
										<img
											src={client.logo}
											alt={client.name}
											class="h-16 w-auto transform object-contain transition-all duration-500 group-hover:scale-110"
										/>
									{:else}
										<div
											class="text-2xl font-bold text-gray-700 transition-colors duration-300 group-hover:text-purple-600"
										>
											{client.name}
										</div>
									{/if}
								</div>

								<!-- Esquina decorativa -->
								<div
									class="absolute right-0 bottom-0 h-20 w-20 rounded-tl-full bg-gradient-to-tl from-purple-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
								></div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Stats o CTA opcional -->
		<div class="mt-16 text-center" in:fly={{ y: 30, duration: 800, delay: 400 }}>
			<div
				class="inline-flex items-center gap-8 rounded-full border border-gray-100 bg-white px-8 py-4 shadow-lg"
			>
				<div class="flex items-center gap-3">
					<div class="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
					<span class="text-sm font-medium text-gray-600">
						+{clientes.length} empresas confían en nosotros
					</span>
				</div>
				<div class="h-6 w-px bg-gray-200"></div>
				<button class="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700">
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
