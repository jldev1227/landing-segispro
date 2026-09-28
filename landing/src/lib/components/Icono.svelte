<script lang="ts">
	/**
	 * Sistema de iconos de la landing.
	 *
	 * Antes cada icono era un emoji suelto dentro de los datos, y eso traía tres
	 * problemas: la forma la decidía el sistema operativo del visitante, los
	 * lectores de pantalla los leían como palabras en medio del título, y dos de
	 * ellos —los de `campanas-estudios` e `interventoria`— se habían corrompido
	 * a U+FFFD, así que en pantalla salía el rombo con interrogación.
	 *
	 * Aquí los nombres se resuelven contra lucide, que ya era dependencia del
	 * proyecto. Un solo grosor de trazo, tamaño heredado por clase, y ocultos al
	 * lector de pantalla salvo que se les dé una etiqueta.
	 *
	 * Las importaciones son profundas (`lucide-svelte/icons/<nombre>`) a
	 * propósito: la importación con nombre arrastra el índice completo, que en
	 * desarrollo son más de 3 MB.
	 */
	import BadgeCheck from 'lucide-svelte/icons/badge-check';
	import BookOpen from 'lucide-svelte/icons/book-open';
	import Car from 'lucide-svelte/icons/car';
	import ChartColumn from 'lucide-svelte/icons/chart-column';
	import Check from 'lucide-svelte/icons/check';
	import ClipboardCheck from 'lucide-svelte/icons/clipboard-check';
	import ClipboardList from 'lucide-svelte/icons/clipboard-list';
	import Cog from 'lucide-svelte/icons/cog';
	import FileSearch from 'lucide-svelte/icons/file-search';
	import FlaskConical from 'lucide-svelte/icons/flask-conical';
	import Globe from 'lucide-svelte/icons/globe';
	import GraduationCap from 'lucide-svelte/icons/graduation-cap';
	import Handshake from 'lucide-svelte/icons/handshake';
	import Laptop from 'lucide-svelte/icons/laptop';
	import Leaf from 'lucide-svelte/icons/leaf';
	import Lightbulb from 'lucide-svelte/icons/lightbulb';
	import Lock from 'lucide-svelte/icons/lock';
	import Megaphone from 'lucide-svelte/icons/megaphone';
	import Menu from 'lucide-svelte/icons/menu';
	import MapPin from 'lucide-svelte/icons/map-pin';
	import Mail from 'lucide-svelte/icons/mail';
	import Phone from 'lucide-svelte/icons/phone';
	import Scale from 'lucide-svelte/icons/scale';
	import Siren from 'lucide-svelte/icons/siren';
	import Stethoscope from 'lucide-svelte/icons/stethoscope';
	import Target from 'lucide-svelte/icons/target';
	import TrafficCone from 'lucide-svelte/icons/traffic-cone';
	import Users from 'lucide-svelte/icons/users';
	import Wrench from 'lucide-svelte/icons/wrench';
	import X from 'lucide-svelte/icons/x';
	import Zap from 'lucide-svelte/icons/zap';

	/** Las claves nombran el concepto del sitio, no el dibujo. */
	const REGISTRO = {
		auditoria: FileSearch,
		campanas: Megaphone,
		cerrar: X,
		correo: Mail,
		menu: Menu,
		telefono: Phone,
		ubicacion: MapPin,
		certificaciones: BadgeCheck,
		check: Check,
		colaboracion: Handshake,
		confidencialidad: Lock,
		consultoria: ClipboardCheck,
		cursos: BookOpen,
		digitalizacion: Laptop,
		equipo: Users,
		estudios: FlaskConical,
		'estudios-ambientales': Leaf,
		'estudios-viales': TrafficCone,
		excelencia: Target,
		formacion: GraduationCap,
		innovacion: Lightbulb,
		interventoria: ClipboardList,
		medicion: ChartColumn,
		'normas-iso': ClipboardList,
		normativa: Scale,
		'proyectos-especiales': Wrench,
		rapidez: Zap,
		'salud-laboral': Stethoscope,
		'seguridad-vial': Car,
		simulacros: Siren,
		sistemas: Cog,
		'vision-global': Globe
	} as const;

	type NombreIcono = keyof typeof REGISTRO;

	/** Un nombre que no exista no dibuja nada, en vez de romper la página. */
	export let nombre: string;
	/** Clases de tamaño y color. El grosor del trazo no cambia: va en el SVG. */
	let clase = '';
	export { clase as class };
	/**
	 * Texto alternativo. Vacío deja el icono oculto al lector de pantalla, que es
	 * lo correcto cuando va junto a una etiqueta que ya dice lo mismo.
	 */
	export let etiqueta = '';

	$: Componente = REGISTRO[nombre as NombreIcono];
</script>

{#if Componente}
	<svelte:component
		this={Componente}
		class={clase}
		aria-hidden={etiqueta ? undefined : 'true'}
		aria-label={etiqueta || undefined}
		role={etiqueta ? 'img' : undefined}
		focusable="false"
	/>
{/if}
