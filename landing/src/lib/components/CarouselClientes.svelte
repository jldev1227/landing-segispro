<script lang="ts">
	import { fade } from 'svelte/transition';

	interface Client {
		name: string;
		logo?: string;
	}

	export let visible = false;
	export let clients: Client[] = [
		{ name: 'Cliente A', logo: '/assets/clients/cliente-a.png' },
		{ name: 'Cliente B', logo: '/assets/clients/cliente-b.png' },
		{ name: 'Cliente C', logo: '/assets/clients/cliente-c.png' },
		{ name: 'Cliente D', logo: '/assets/clients/cliente-d.png' },
		{ name: 'Cliente E', logo: '/assets/clients/cliente-e.png' },
		{ name: 'Cliente F', logo: '/assets/clients/cliente-f.png' },
	];
	export let speed = 30; // segundos para completar un ciclo
</script>

{#if visible}
	<div 
		class="relative overflow-hidden py-8"
		in:fade={{ duration: 800, delay: 400 }}
	>
		<!-- Título opcional -->
		<div class="text-center mb-12">
			<p class="text-sm text-gray-500 uppercase tracking-wider mb-2">
				Confían en nosotros
			</p>
			<h3 class="text-3xl font-bold text-gray-800">
				Nuestros Clientes
			</h3>
		</div>

		<!-- Gradientes laterales para efecto fade -->
		<div class="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
		<div class="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>

		<!-- Track del carrusel -->
		<div class="relative">
			<div 
				class="clients-track flex gap-16 items-center"
				style="animation-duration: {speed}s;"
			>
				<!-- Triplicamos para asegurar loop perfecto -->
				{#each [...clients, ...clients, ...clients] as client, i}
					<div 
						class="flex-shrink-0 client-item grayscale hover:grayscale-0 opacity-40 hover:opacity-100 transition-all duration-500 hover:scale-110"
					>
						{#if client.logo}
							<img 
								src={client.logo} 
								alt={client.name}
								class="h-12 w-auto object-contain"
							/>
						{:else}
							<div class="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors px-4">
								{client.name}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<!-- Indicador de hover -->
		<div class="text-center mt-8">
			<p class="text-xs text-gray-400">
				⬅️ El carrusel se mueve automáticamente ➡️
			</p>
		</div>
	</div>
{/if}

<style>
	@keyframes scroll-clients {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-33.333%);
		}
	}

	.clients-track {
		animation: scroll-clients linear infinite;
		will-change: transform;
	}

	.clients-track:hover {
		animation-play-state: paused;
	}

	.client-item {
		min-width: 150px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
