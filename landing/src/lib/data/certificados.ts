// Datos falsos de certificados para validación
export interface Certificado {
	uuid: string;
	nombre: string;
	identificacion: string;
	servicio: string;
	curso: string;
	fechaEmision: string;
	fechaVencimiento: string;
	duracion: string;
	instructor: string;
	notas: string;
	codigo: string;
}

// Base de datos simulada de certificados
export const certificadosDB: Certificado[] = [
	{
		uuid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
		nombre: 'Juan Carlos Pérez Rodríguez',
		identificacion: '1.098.765.432',
		servicio: 'formacion',
		curso: 'Auditor Interno ISO 9001:2015',
		fechaEmision: '15 de octubre de 2024',
		fechaVencimiento: '15 de octubre de 2027',
		duracion: '40 horas',
		instructor: 'Ing. María Fernanda López',
		notas: 'Aprobado con excelencia',
		codigo: 'CERT-2024-001-AUD'
	},
	{
		uuid: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
		nombre: 'Ana María Gómez Torres',
		identificacion: '52.123.456',
		servicio: 'formacion',
		curso: 'Sistema de Gestión de Seguridad y Salud en el Trabajo ISO 45001',
		fechaEmision: '20 de septiembre de 2024',
		fechaVencimiento: '20 de septiembre de 2027',
		duracion: '32 horas',
		instructor: 'Ing. Carlos Alberto Ruiz',
		notas: 'Certificado con honores',
		codigo: 'CERT-2024-002-SST'
	},
	{
		uuid: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
		nombre: 'Pedro Antonio Ramírez Silva',
		identificacion: '80.234.567',
		servicio: 'formacion',
		curso: 'Conducción Defensiva y Seguridad Vial',
		fechaEmision: '5 de agosto de 2024',
		fechaVencimiento: '5 de agosto de 2026',
		duracion: '16 horas',
		instructor: 'Esp. Jorge Luis Mendoza',
		notas: 'Aprobado satisfactoriamente',
		codigo: 'CERT-2024-003-VIAL'
	},
	{
		uuid: 'd4e5f6a7-b8c9-0123-def1-234567890123',
		nombre: 'Laura Patricia Martínez Díaz',
		identificacion: '1.123.456.789',
		servicio: 'auditoria',
		curso: 'Auditor Interno Sistema de Gestión Ambiental ISO 14001',
		fechaEmision: '12 de julio de 2024',
		fechaVencimiento: '12 de julio de 2027',
		duracion: '40 horas',
		instructor: 'Ing. Diana Carolina Suárez',
		notas: 'Certificado con distinción',
		codigo: 'CERT-2024-004-AMB'
	},
	{
		uuid: 'e5f6a7b8-c9d0-1234-ef12-345678901234',
		nombre: 'Roberto Carlos Sánchez Vélez',
		identificacion: '79.876.543',
		servicio: 'formacion',
		curso: 'Gestión de Riesgos y Matrices de Peligros',
		fechaEmision: '3 de junio de 2024',
		fechaVencimiento: '3 de junio de 2026',
		duracion: '24 horas',
		instructor: 'Ing. Fernando Andrés Castro',
		notas: 'Aprobado',
		codigo: 'CERT-2024-005-RIESG'
	},
	{
		uuid: 'f6a7b8c9-d0e1-2345-f123-456789012345',
		nombre: 'Claudia Marcela Ospina Ríos',
		identificacion: '52.987.654',
		servicio: 'formacion',
		curso: 'Liderazgo y Desarrollo Humano',
		fechaEmision: '18 de mayo de 2024',
		fechaVencimiento: '18 de mayo de 2025',
		duracion: '20 horas',
		instructor: 'Psic. Sandra Milena Parra',
		notas: 'Participación destacada',
		codigo: 'CERT-2024-006-LIDER'
	},
	{
		uuid: 'a7b8c9d0-e1f2-3456-1234-567890123456',
		nombre: 'Diego Fernando Vargas Cruz',
		identificacion: '1.234.567.890',
		servicio: 'consultoria',
		curso: 'Implementador ISO 27001 - Seguridad de la Información',
		fechaEmision: '25 de abril de 2024',
		fechaVencimiento: '25 de abril de 2027',
		duracion: '48 horas',
		instructor: 'Ing. Gustavo Adolfo Ramírez',
		notas: 'Excelente desempeño',
		codigo: 'CERT-2024-007-INFO'
	},
	{
		uuid: 'b8c9d0e1-f2a3-4567-2345-678901234567',
		nombre: 'Mónica Liliana Rojas Herrera',
		identificacion: '39.456.789',
		servicio: 'formacion',
		curso: 'Ergonomía y Análisis de Puestos de Trabajo',
		fechaEmision: '10 de marzo de 2024',
		fechaVencimiento: '10 de marzo de 2026',
		duracion: '16 horas',
		instructor: 'Fisiot. Andrea Carolina Vega',
		notas: 'Aprobado',
		codigo: 'CERT-2024-008-ERGO'
	}
];

// Función para buscar certificado por UUID
export function buscarCertificadoPorUUID(uuid: string): Certificado | null {
	const certificado = certificadosDB.find(
		(cert) => cert.uuid.toLowerCase() === uuid.toLowerCase().trim()
	);
	return certificado || null;
}

// Función para validar formato UUID
export function validarFormatoUUID(uuid: string): boolean {
	const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
	return uuidRegex.test(uuid.trim());
}
