# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primario — quien paga.** Gerente HSE / coordinador de SGI, o líder de compras, en empresas de
hidrocarburos, entidades públicas y transporte que operan en Casanare, Meta, Boyacá, Bogotá D.C. y
Cundinamarca. Llega casi siempre con una obligación normativa encima y poco tiempo: preselecciona
proveedores, necesita saber si la firma hace ese servicio a su escala, y quiere mandar una solicitud
con alcance. El sitio se juzga por si esa persona termina pidiendo cotización.

**Secundario — quien busca trabajo.** Profesional SST (auditor, capacitador, consultor, especialista
en estudios técnicos) buscando contrato por actividad. Tiene su propia página, `/trabaja-con-nosotros`,
con formulario, carga de hoja de vida y consentimiento bajo Ley 1581. No compite por el primer pliegue.

## Product Purpose

Conseguir que una empresa solicite cotización de servicios de seguridad y salud en el trabajo.
El éxito es la solicitud con alcance, no la visita ni la llamada.

## Positioning

**Trayectoria comprobable, no declarada.** SEGISPRO puede publicar el conteo real de lo ejecutado
—servicios, empresas, años, cobertura— y respaldar cada certificado emitido con validación en línea.
Una firma vecina puede afirmar experiencia; no puede mostrar el registro ni dejar que el comprador
lo verifique por su cuenta.

Esto obliga a dos cosas en el diseño: las cifras vienen del sistema operativo real y no se redondean
ni se inflan, y todo lo que no sea verificable no se presenta como si lo fuera.

## Operating Context

- Sede en Yopal, con desplazamiento a locación. Buena parte de la audiencia lee en campo, en móvil y
  con datos móviles.
- Marco normativo colombiano: Decreto 1072, Resolución 0312, PESV Res. 40595, SARLAFT Res. 2328,
  ISO 9001 / 14001 / 45001 / 39001, BASC, RUC.
- La formación no vive aquí: el campus institucional es `formarpro.segispro.com`. La landing redirige
  `/capacitaciones` hacia allá con 301.
- Los certificados se validan en línea. Hoy existen dos rutas para lo mismo —`/validar-certificado`
  en la landing y `/verificar` en el campus— y cuál es la canónica está **sin decidir**.
- Las métricas públicas se congelan en tiempo de build desde la API de `segispro-backend-v2` hacia
  `src/lib/data/metricas.json`, por workflow semanal de GitHub Actions. La página nunca consulta la
  API en vivo.

## Capabilities and Constraints

Servicios confirmados, agrupados como en `src/lib/data/servicios.ts`: consultoría y auditoría
(incluida auditoría a proveedores), formación y campañas, estudios técnicos (luxometría, sonometría,
evaluaciones ambientales, factores psicosociales, tamizajes, análisis de puestos, clima
organizacional, estudios viales), digitalización, proyectos especiales e interventoría.

Restricciones que el diseño no puede contradecir:

- **SEGISPRO no es organismo certificador.** Prepara y audita; no emite la certificación ISO.
- **La contratación de profesionales es por actividad, no por nómina.**
- Alcance, fechas y tarifa se pactan por servicio; no hay precios de lista.

## Brand Commitments

Nombre: SEGISPRO Ingeniería. Paleta derivada de los píxeles del logo: navy `#223A54`, verde
`#00BF62`, ámbar `#FFAD2B`. **El rojo del isotipo anterior quedó descartado** y no debe reaparecer
salvo como color semántico de error. Verde y ámbar puros son de relleno, no de texto: dan 2,43:1 y
1,86:1 sobre blanco. Tipografía Geist variable, autoalojada. Voz en español de Colombia.

## Evidence on Hand

Real y utilizable:

- `src/lib/data/metricas.json` — 1.174 servicios ejecutados, 315 empresas atendidas, 41 contratantes,
  76 profesionales, 41 ciudades, 5 departamentos, 17 años, y el desglose por categoría
  (Consultoría 868, Capacitación 197, Asesoría 34, Auditoría 17, …).
- `static/clientes/` — ocho logos de aseguradoras y ARL: SURA, Colmena, Positiva, AXA Colpatria,
  Equidad, Bolívar, Previsora, QBE.
- `static/slides/` y `static/videos/` — fotografía propia de campo: simulacros, campañas y jornadas
  con personal en sitio.
- `src/lib/seo/site.ts` — las cinco regiones con su enfoque, sectores, retos y normatividad.

Ausencias que el diseño **no debe fabricar**:

- No hay testimonios ni casos de éxito escritos.
- No hay reseñas: la ficha de Google Maps incrustada muestra «No hay opiniones».
- No hay precios ni tarifas publicables.
- **No existe logo de Mapfre.** La entrada `Mapfre Seguros` en el muro de clientes está mostrando el
  archivo de Equidad, así que ese logo aparece dos veces. Pendiente de decisión del cliente.

## Product Principles

1. **La cifra manda sobre el adjetivo.** Donde exista un número real del sistema, se usa en vez de
   una promesa. «1.174 servicios ejecutados» pesa más que «amplia experiencia».
2. **Nada que no se pueda verificar se presenta como verificado.** Si no hay testimonio, no se simula
   uno; si no hay reseña, no se insinúa.
3. **El comprador decide en minutos y con poco contexto.** Lo que necesita para preseleccionar
   —qué hacemos, dónde, con qué respaldo, cómo pedir cotización— va arriba y se encuentra en segundos.
4. **Decir lo que no hacemos también vende.** El «no somos organismo certificador» es un activo de
   credibilidad, no una salvedad a esconder.
5. **Móvil y datos móviles son el caso base**, no la degradación. La audiencia lee en campo.

## Accessibility & Inclusion

WCAG 2.1 AA como piso: 4,5:1 en texto normal, 3:1 en texto grande. Los ratios de cada paso de la
paleta están documentados en `src/app.css` y se respetan. Español de Colombia. Los iconos son SVG
con etiqueta o marcados como decorativos, nunca emoji.
