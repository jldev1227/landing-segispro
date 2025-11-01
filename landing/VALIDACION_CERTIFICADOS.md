# Sistema de Validación de Certificados - SEGISPRO

## 📋 Descripción

Sistema completo de validación de certificados para SEGISPRO que permite verificar la autenticidad de certificados emitidos mediante códigos UUID únicos.

## 🏗️ Arquitectura

### Frontend
- **Ruta**: `/validar-certificado`
- **Archivo**: `src/routes/validar-certificado/+page.svelte`
- **Features**:
  - Formulario de validación con UUID
  - Validación en tiempo real
  - Visualización detallada del certificado
  - Certificado digital imprimible
  - Responsive design

### Backend (API Route)
- **Endpoint**: `/api/validar-certificado`
- **Archivo**: `src/routes/api/validar-certificado/+server.ts`
- **Método**: GET
- **Parámetros**: `?uuid={codigo-uuid}`
- **Respuestas**:
  - 200: Certificado encontrado
  - 400: UUID inválido o no proporcionado
  - 404: Certificado no encontrado

### Base de Datos (Fake)
- **Archivo**: `src/lib/data/certificados.ts`
- **Contenido**: 8 certificados de ejemplo
- **Servicios incluidos**: Formación, Auditoría, Consultoría

## 🚀 Uso

### Validar un certificado

1. Navega a `/validar-certificado`
2. Ingresa el código UUID (formato: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
3. Haz clic en "Validar certificado"

### Códigos UUID de prueba

```
a1b2c3d4-e5f6-7890-abcd-ef1234567890  (Auditor Interno ISO 9001)
b2c3d4e5-f6a7-8901-bcde-f12345678901  (ISO 45001 SST)
c3d4e5f6-a7b8-9012-cdef-123456789012  (Conducción Defensiva)
d4e5f6a7-b8c9-0123-def1-234567890123  (Auditor ISO 14001)
e5f6a7b8-c9d0-1234-ef12-345678901234  (Gestión de Riesgos)
f6a7b8c9-d0e1-2345-f123-456789012345  (Liderazgo y Desarrollo)
a7b8c9d0-e1f2-3456-1234-567890123456  (ISO 27001)
b8c9d0e1-f2a3-4567-2345-678901234567  (Ergonomía)
```

## 📁 Estructura de Archivos

```
landing/
├── src/
│   ├── lib/
│   │   └── data/
│   │       ├── certificados.ts          # Base de datos de certificados
│   │       └── servicios.ts             # Datos de servicios existentes
│   └── routes/
│       ├── api/
│       │   └── validar-certificado/
│       │       └── +server.ts           # API endpoint
│       └── validar-certificado/
│           └── +page.svelte             # Página de validación
```

## 🎨 Diseño

El sistema mantiene la coherencia visual con el resto del proyecto:
- Colores corporativos (azul #2563eb, naranja)
- Tipografía consistente
- Animaciones suaves (fade, fly, scale)
- Componentes reutilizables
- Responsive design

## ✨ Características

### Validación
- ✅ Validación de formato UUID
- ✅ Búsqueda en base de datos
- ✅ Mensajes de error descriptivos
- ✅ Loading states
- ✅ Ejemplos de UUIDs para testing

### Certificado Digital
- ✅ Diseño profesional
- ✅ Información completa del participante
- ✅ Código UUID único
- ✅ Fechas de emisión y vencimiento
- ✅ Sello de autenticidad
- ✅ Función de impresión

### UX/UI
- ✅ Interfaz intuitiva
- ✅ Animaciones fluidas
- ✅ Feedback visual inmediato
- ✅ Accesibilidad
- ✅ Mobile-first design

## 🔧 Desarrollo

### Agregar nuevos certificados

Edita `src/lib/data/certificados.ts`:

```typescript
export const certificadosDB: Certificado[] = [
  // ... certificados existentes
  {
    uuid: 'nuevo-uuid-aqui',
    nombre: 'Nombre Completo',
    identificacion: 'CC 123456789',
    servicio: 'formacion',
    curso: 'Nombre del Curso',
    fechaEmision: '1 de enero de 2025',
    fechaVencimiento: '1 de enero de 2028',
    duracion: '40 horas',
    instructor: 'Ing. Nombre Instructor',
    notas: 'Observaciones',
    codigo: 'CERT-2025-XXX'
  }
];
```

### Generar UUIDs

Usa una herramienta online o en tu terminal:

```bash
# Node.js
node -e "console.log(require('crypto').randomUUID())"

# Python
python -c "import uuid; print(uuid.uuid4())"

# Online: https://www.uuidgenerator.net/
```

## 🔐 Seguridad

- Validación de formato UUID antes de consultar BD
- Sanitización de inputs
- Headers de cache apropiados
- No exposición de información sensible en errores

## 📱 Responsive

- ✅ Mobile (< 640px)
- ✅ Tablet (640px - 1024px)
- ✅ Desktop (> 1024px)

## 🖨️ Impresión

El certificado está optimizado para impresión:
- Ocultación de elementos no necesarios (header, botones)
- Layout adaptado para papel
- Márgenes apropiados

## 🚀 Deploy

El sistema está listo para producción. Solo necesitas:

1. Conectar a una base de datos real (PostgreSQL, MongoDB, etc.)
2. Implementar autenticación para área administrativa
3. Agregar sistema de emisión de certificados
4. Configurar almacenamiento de imágenes/PDFs

## 📞 Soporte

Para más información, contacta con el equipo de SEGISPRO.
