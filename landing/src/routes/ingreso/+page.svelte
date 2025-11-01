<script lang="ts">
	import { fly, scale, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	let mounted = false;
	let showPassword = false;
	let email = '';
	let password = '';
	let isLoading = false;
	let focusedField: 'email' | 'password' | null = null;

	onMount(() => {
		mounted = true;
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		isLoading = true;

		// Simular login
		await new Promise((resolve) => setTimeout(resolve, 2000));

		isLoading = false;
		console.log('Login:', { email, password });
	}
</script>

<div
	class="relative min-h-screen overflow-hidden bg-linear-to-br from-gray-900 via-gray-800 to-black"
>
	<!-- Grid pattern de fondo -->
	<div class="absolute inset-0 opacity-5">
		<div
			class="absolute inset-0"
			style="background-image: radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.5) 1px, transparent 0); background-size: 40px 40px;"
		></div>
	</div>

	<!-- Gradiente radial -->
	<div
		class="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl"
	></div>

	<!-- Container principal -->
	<div class="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
		{#if mounted}
			<div
				class="w-full max-w-md"
				in:scale={{ duration: 500, delay: 100, start: 0.95, easing: quintOut }}
			>
				<!-- Logo -->
				<div
					class="mb-10 text-center"
					in:fly={{ y: -30, duration: 500, delay: 200, easing: quintOut }}
				>
					<img src="/assets/logo-white.png" alt="SEGISPRO Logo" class="mx-auto mb-6 h-12 w-auto" />
					<h1 class="mb-2 text-2xl font-bold text-white">Bienvenido de nuevo</h1>
					<p class="text-sm text-gray-400">Ingresa a tu cuenta para continuar</p>
				</div>

				<!-- Formulario -->
				<div
					class="rounded-2xl border border-gray-700/50 bg-gray-800/30 p-8 shadow-2xl backdrop-blur-xl"
					in:fly={{ y: 30, duration: 500, delay: 300, easing: quintOut }}
				>
					<form on:submit={handleSubmit} class="space-y-5">
						<!-- Campo Email -->
						<div>
							<label for="email" class="mb-2 block text-sm font-medium text-gray-300">
								Correo electrónico
							</label>
							<input
								id="email"
								type="email"
								bind:value={email}
								on:focus={() => (focusedField = 'email')}
								on:blur={() => (focusedField = null)}
								placeholder="tu@email.com"
								class="w-full rounded-lg border bg-gray-900/50 px-4 py-3 text-white placeholder-gray-500 transition-all duration-200 focus:ring-2 focus:outline-none"
								class:border-gray-700={focusedField !== 'email'}
								class:border-blue-500={focusedField === 'email'}
								class:ring-blue-500={focusedField === 'email'}
								required
							/>
						</div>

						<!-- Campo Contraseña -->
						<div>
							<label for="password" class="mb-2 block text-sm font-medium text-gray-300">
								Contraseña
							</label>
							<div class="relative">
								<input
									id="password"
									type={showPassword ? 'text' : 'password'}
									bind:value={password}
									on:focus={() => (focusedField = 'password')}
									on:blur={() => (focusedField = null)}
									placeholder="••••••••"
									class="w-full rounded-lg border bg-gray-900/50 px-4 py-3 pr-12 text-white placeholder-gray-500 transition-all duration-200 focus:ring-2 focus:outline-none"
									class:border-gray-700={focusedField !== 'password'}
									class:border-blue-500={focusedField === 'password'}
									class:ring-blue-500={focusedField === 'password'}
									required
								/>
								<button
									type="button"
									on:click={() => (showPassword = !showPassword)}
									class="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-300"
								>
									{#if showPassword}
										<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
											/>
										</svg>
									{:else}
										<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
											/>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
											/>
										</svg>
									{/if}
								</button>
							</div>
						</div>

						<!-- Recordar y Olvidaste -->
						<div class="flex items-center justify-between text-sm">
							<label class="flex cursor-pointer items-center gap-2">
								<input
									type="checkbox"
									class="h-4 w-4 rounded border-gray-600 bg-gray-900 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
								/>
								<span class="text-gray-400">Recordarme</span>
							</label>
							<a href="#" class="text-blue-400 hover:text-blue-300"> ¿Olvidaste tu contraseña? </a>
						</div>

						<!-- Botón de login -->
						<button
							type="submit"
							disabled={isLoading}
							class="w-full rounded-lg bg-linear-to-r from-blue-600 to-blue-500 py-3 font-semibold text-white transition-all duration-200 hover:from-blue-700 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{#if isLoading}
								<span class="flex items-center justify-center gap-2">
									<svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
										<circle
											class="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											stroke-width="4"
										></circle>
										<path
											class="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									Iniciando sesión...
								</span>
							{:else}
								Iniciar Sesión
							{/if}
						</button>
					</form>
				</div>

				<!-- Registro -->
				<p class="mt-6 text-center text-sm text-gray-400" in:fade={{ duration: 500, delay: 500 }}>
					¿No tienes una cuenta?
					<a href="#" class="font-semibold text-blue-400 hover:text-blue-300"> Regístrate aquí </a>
				</p>
			</div>
		{/if}
	</div>
</div>
