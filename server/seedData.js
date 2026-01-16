// Seed Data
// This file is used to initialize the server database

// Pre-populated Data from Images
const initialEvents = [
    // 2 de Enero 2026
    {
        id: 'evt-2026-01-02-1',
        title: 'Reunión de concertación con el equipo técnico de la Secretaría General para revisar las cartas y preguntas a las empresas.',
        start: new Date(2026, 0, 2, 10, 0),
        end: new Date(2026, 0, 2, 12, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Equipo técnico de la Secretaría General', 'Jefa de Gabinete del Vicepresidente segundo', 'Consultores']
    },
    {
        id: 'evt-2026-01-02-2',
        title: 'Reunión de actualización sobre la reparación del sistema de climatización del edificio del CNDES y acondicionamiento de la sala de formaciones.',
        start: new Date(2026, 0, 2, 12, 0),
        end: new Date(2026, 0, 2, 13, 30),
        location: 'SALA DE REUNIONES DEL SÓTANO',
        participants: ['Vicepresidente Segundo', 'Miembros del Comité de Gastos', 'Empresa encargada']
    },
    {
        id: 'evt-2026-01-02-3',
        title: 'Reunión para la confección del equipo de fútbol masculino del CNDES',
        start: new Date(2026, 0, 2, 14, 0),
        end: new Date(2026, 0, 2, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Director General de Monitoreo y Evaluación de Coyunturas Macroeconómicas Nacionales', 'Todos los técnicos interesados']
    },
    // 5 de Enero 2026 (Asumido)
    {
        id: 'evt-2026-01-05-1',
        title: 'Reunión de concertación con el equipo técnico de la Secretaría General para revisar finalizar la redacción de cartas y preguntas a las empresas.',
        start: new Date(2026, 0, 5, 10, 0),
        end: new Date(2026, 0, 5, 12, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Equipo técnico de la Secretaría General', 'Consultores']
    },
    {
        id: 'evt-2026-01-05-2',
        title: 'Reunión del subcomisión de Marketing de la JORNADEIS de los sectores de pesca y turismo.',
        start: new Date(2026, 0, 5, 10, 0),
        end: new Date(2026, 0, 5, 12, 0),
        location: 'SALA DE REUNIONES DEL SÓTANO',
        participants: ['Director General de Monitoreo y Evaluación de Coyunturas Macroeconómicas Nacionales', 'Técnicos del CNDES miembros del subcomité', 'Representante de PNUD', 'Representante de TVGE', 'Representante de Digital Ecua']
    },
    {
        id: 'evt-2026-01-05-3',
        title: 'Reunión con la Directora General de Políticas laborales y el equipo de la Secretaría General sobre la situación del personal tras las fiestas y las vacaciones de primer turno.',
        start: new Date(2026, 0, 5, 13, 0),
        end: new Date(2026, 0, 5, 14, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Directora General de Seguimiento de Políticas laborales', 'Equipo técnico de la Secretaría General']
    },
    {
        id: 'evt-2026-01-05-4',
        title: 'Reunión de trabajo de la subcomisión de Moderación de Paneles de la JORNADEIS de los sectores de pesca y turismo.',
        start: new Date(2026, 0, 5, 15, 0),
        end: new Date(2026, 0, 5, 17, 0),
        location: 'SALA DE REUNIONES DEL SÓTANO',
        participants: ['Excmo. Sr. Miembro Encargado del Sector Económico Productivo (Presidente de la Subcomisión)', 'Todos los integrantes de la Subcomisión de Moderación de Paneles', 'Miembros de la Subcomisión de redacción y documentación', 'Dos técnicos de la Secretaria General', 'Dos Técnicos del Gabinete']
    },
    // 6 de Enero 2026
    {
        id: 'evt-2026-01-06-1',
        title: 'Reunión de concertación con el Sistema de las Naciones Unidas sobre su aporte al Sistema de Educación Nacional, así como su implicación en las próximas JORNADEIS sobre pesca y turismo.',
        start: new Date(2026, 0, 6, 10, 0),
        end: new Date(2026, 0, 6, 12, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros del Consejo', 'Consejeros', 'Directores Generales', 'Técnicos del Sector Cultural', 'Consultores']
    },
    {
        id: 'evt-2026-01-06-2',
        title: 'Reunión interna del Sector Laboral.',
        start: new Date(2026, 0, 6, 10, 0),
        end: new Date(2026, 0, 6, 12, 0),
        location: 'SALA DE REUNIONES DEL SÓTANO',
        participants: ['Directora General de Seguimiento de Políticas Laborales', 'Técnicos del Sector Laboral']
    },
    {
        id: 'evt-2026-01-06-3',
        title: 'Reunión de Coordinación del Sector Industrial sobre la elaboración de la Memoria Anual Sectorial.',
        start: new Date(2026, 0, 6, 12, 0),
        end: new Date(2026, 0, 6, 13, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Técnicos del Sector Industrial', 'Consultores']
    },
    {
        id: 'evt-2026-01-06-4',
        title: 'Reunión de concertación del Comité de Evaluación de Proyectos del CNDES.',
        start: new Date(2026, 0, 6, 13, 0),
        end: new Date(2026, 0, 6, 15, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Consejeros', 'Directores Generales', 'Técnicos del Comité', 'Consultores', 'Técnico del gabinete']
    },
    // 7 de Enero 2026
    {
        id: 'evt-2026-01-07-1',
        title: 'Reunión de programación de las sesiones de concertación con las empresas.',
        start: new Date(2026, 0, 7, 10, 0),
        end: new Date(2026, 0, 7, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Equipo técnico de la Secretaría General', 'Consultores']
    },
    {
        id: 'evt-2026-01-07-2',
        title: 'Reunión de coordinación con el Ministerio del Agricultura, Pesca, Bosques y Medioambiente sobre las JORNADEIS.',
        start: new Date(2026, 0, 7, 11, 0),
        end: new Date(2026, 0, 7, 13, 0), // Assumed duration
        location: 'SALA DE PLENOS',
        participants: ['Presidente', 'Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Directores Generales', 'Consultores']
    },
    {
        id: 'evt-2026-01-07-3',
        title: 'Reunión interna del Sector Laboral.',
        start: new Date(2026, 0, 7, 14, 0),
        end: new Date(2026, 0, 7, 15, 0),
        location: 'SALA DE REUNIONES DEL SÓTANO',
        participants: ['Directora General de Seguimiento de Políticas Laborales', 'Técnicos del Sector Laboral']
    },
    // 8 de Enero 2026
    {
        id: 'evt-2026-01-08-1',
        title: 'Reunión de coordinación y revisión de los borradores de programas de la Quinta Mesa Redonda CNDES/UCESA/Consejo Económico de China y el del Foro Económico y Social.',
        start: new Date(2026, 0, 8, 10, 0),
        end: new Date(2026, 0, 8, 12, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros del Consejo', 'Consejeros', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-01-08-2',
        title: 'Presentación de votos.',
        start: new Date(2026, 0, 8, 12, 0),
        end: new Date(2026, 0, 8, 13, 0),
        location: 'PALACIO DEL PUEBLO',
        participants: ['Presidente', 'Director General de Protocolo']
    },
    {
        id: 'evt-2026-01-08-3',
        title: 'Reunión de coordinación de las JORNADEIS sobre pesca y turismo.',
        start: new Date(2026, 0, 8, 15, 0),
        end: new Date(2026, 0, 8, 17, 0),
        location: 'SALA DE REUNIONES DEL SÓTANO',
        participants: ['Vicepresidente Segundo', 'Todas las Subcomisiones de trabajo', 'Ministerio de Agricultura y Pesca', 'Ministerio de Turismo', 'Sistema de las Naciones Unidas', 'CICTE', 'UNGE', 'Consejo de la República', 'Instituciones bancarias', 'Consultores']
    },
    // 9 de Enero 2026
    {
        id: 'evt-2026-01-09-1',
        title: 'Reunión de coordinación con la Subcomisión de Marketing y la de Redacción de las JORNADEIS.',
        start: new Date(2026, 0, 9, 10, 0),
        end: new Date(2026, 0, 9, 12, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros de la Coordinación General de las Jornadeis', 'Subcomisión de Marketing', 'Subcomisión de Redacción', 'Consultores']
    },
    {
        id: 'evt-2026-01-09-2',
        title: 'Reunión de concertación con todas las Comisiones Técnicas Sectoriales para planificar los procesos internos y la metodología de trabajo que se adoptarán para la elaboración de la Memoria Anual 2026.',
        start: new Date(2026, 0, 9, 14, 0),
        end: new Date(2026, 0, 9, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros del Consejo', 'Consejeros', 'Directores Generales', 'Consultores']
    },
    // 12 de Enero 2026
    {
        id: 'evt-2026-01-12-1',
        title: 'Reunión de concertación GEPETROL S.A.',
        start: new Date(2026, 0, 12, 9, 0),
        end: new Date(2026, 0, 12, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-01-12-2',
        title: 'Reunión de concertación GEP ZAFIRO',
        start: new Date(2026, 0, 12, 11, 30),
        end: new Date(2026, 0, 12, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-01-12-3',
        title: 'Reunión de concertación TURBOGAS',
        start: new Date(2026, 0, 12, 14, 0),
        end: new Date(2026, 0, 12, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 13 de Enero 2026
    {
        id: 'evt-2026-01-13-1',
        title: 'Reunión de concertación INSESO',
        start: new Date(2026, 0, 13, 9, 0),
        end: new Date(2026, 0, 13, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-01-13-2',
        title: 'Reunión de concertación INPYDE',
        start: new Date(2026, 0, 13, 11, 30),
        end: new Date(2026, 0, 13, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-01-13-3',
        title: 'Reunión de concertación AVIACIÓN CIVIL',
        start: new Date(2026, 0, 13, 14, 0),
        end: new Date(2026, 0, 13, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 14 de Enero 2026
    {
        id: 'evt-2026-01-14-1',
        title: 'Reunión de concertación UNED',
        start: new Date(2026, 0, 14, 9, 0),
        end: new Date(2026, 0, 14, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-01-14-2',
        title: 'Reunión de concertación UNGE',
        start: new Date(2026, 0, 14, 11, 30),
        end: new Date(2026, 0, 14, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-01-14-3',
        title: 'Reunión de concertación AAUCA',
        start: new Date(2026, 0, 14, 14, 0),
        end: new Date(2026, 0, 14, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 15 de Enero 2026
    {
        id: 'evt-2026-01-15-1',
        title: 'Reunión de concertación GEPETROL SEGUROS',
        start: new Date(2026, 0, 15, 9, 0),
        end: new Date(2026, 0, 15, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-01-15-2',
        title: 'Reunión de concertación ANIF',
        start: new Date(2026, 0, 15, 11, 30),
        end: new Date(2026, 0, 15, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-01-15-3',
        title: 'Reunión de concertación (CFO) 12 DE OCTUBRE',
        start: new Date(2026, 0, 15, 14, 0),
        end: new Date(2026, 0, 15, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 16 de Enero 2026
    {
        id: 'evt-2026-01-16-1',
        title: 'Reunión de concertación CENTRAMED',
        start: new Date(2026, 0, 16, 9, 0),
        end: new Date(2026, 0, 16, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-01-16-2',
        title: 'Reunión de concertación ENPIGE',
        start: new Date(2026, 0, 16, 11, 30),
        end: new Date(2026, 0, 16, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-01-16-3',
        title: 'Reunión de concertación INAP',
        start: new Date(2026, 0, 16, 14, 0),
        end: new Date(2026, 0, 16, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 19 de Enero 2026
    {
        id: 'evt-2026-01-19-1',
        title: 'Reunión de concertación SEGESA',
        start: new Date(2026, 0, 19, 9, 0),
        end: new Date(2026, 0, 19, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-01-19-2',
        title: 'Reunión de concertación SONAGAS',
        start: new Date(2026, 0, 19, 11, 30),
        end: new Date(2026, 0, 19, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-01-19-3',
        title: 'Reunión de concertación TRADEX',
        start: new Date(2026, 0, 19, 14, 0),
        end: new Date(2026, 0, 19, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 20 de Enero 2026
    {
        id: 'evt-2026-01-20-1',
        title: 'Reunión de concertación ESCUELA DE PESCA DE BIDIBA',
        start: new Date(2026, 0, 20, 9, 0),
        end: new Date(2026, 0, 20, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-01-20-2',
        title: 'Reunión de concertación AIMUGE',
        start: new Date(2026, 0, 20, 11, 30),
        end: new Date(2026, 0, 20, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-01-20-3',
        title: 'Reunión de concertación OFICINA NACIONAL DE EMPLEO',
        start: new Date(2026, 0, 20, 14, 0),
        end: new Date(2026, 0, 20, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 21 de Enero 2026
    {
        id: 'evt-2026-01-21-1',
        title: 'Reunión de concertación FEDERACIONES DEPORTIVAS',
        start: new Date(2026, 0, 21, 9, 0),
        end: new Date(2026, 0, 21, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-01-21-2',
        title: 'Reunión de concertación COMITÉ OLIMPICO',
        start: new Date(2026, 0, 21, 11, 30),
        end: new Date(2026, 0, 21, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-01-21-3',
        title: 'Reunión de concertación BALLET NACIONAL CEIBA',
        start: new Date(2026, 0, 21, 14, 0),
        end: new Date(2026, 0, 21, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 22 de Enero 2026
    {
        id: 'evt-2026-01-22-1',
        title: 'Reunión de concertación INEGE',
        start: new Date(2026, 0, 22, 9, 0),
        end: new Date(2026, 0, 22, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-01-22-2',
        title: 'Reunión de concertación INPAGE',
        start: new Date(2026, 0, 22, 11, 30),
        end: new Date(2026, 0, 22, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-01-22-3',
        title: 'Reunión de concertación MUNI',
        start: new Date(2026, 0, 22, 14, 0),
        end: new Date(2026, 0, 22, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 23 de Enero 2026
    {
        id: 'evt-2026-01-23-1',
        title: 'Reunión de concertación RAFER',
        start: new Date(2026, 0, 23, 9, 0),
        end: new Date(2026, 0, 23, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-01-23-2',
        title: 'Reunión de concertación HOSPITAL PSIQUIATRICO SAMPACA',
        start: new Date(2026, 0, 23, 11, 30),
        end: new Date(2026, 0, 23, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-01-23-3',
        title: 'Reunión de concertación ONCIGE',
        start: new Date(2026, 0, 23, 14, 30),
        end: new Date(2026, 0, 23, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 26 de Enero 2026
    {
        id: 'evt-2026-01-26-1',
        title: 'Reunión de concertación TOTAL',
        start: new Date(2026, 0, 26, 9, 0),
        end: new Date(2026, 0, 26, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-01-26-2',
        title: 'Reunión de concertación GEPETROL SERVICIOS',
        start: new Date(2026, 0, 26, 11, 30),
        end: new Date(2026, 0, 26, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-01-26-3',
        title: 'Reunión de concertación LUBA FREEPORT',
        start: new Date(2026, 0, 26, 14, 0),
        end: new Date(2026, 0, 26, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 27 de Enero 2026
    {
        id: 'evt-2026-01-27-1',
        title: 'Reunión de concertación INCOMA / INDEFOR - AP',
        start: new Date(2026, 0, 27, 9, 0),
        end: new Date(2026, 0, 27, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-01-27-2',
        title: 'Reunión de concertación GECOMSA',
        start: new Date(2026, 0, 27, 11, 30),
        end: new Date(2026, 0, 27, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-01-27-3',
        title: 'Reunión de concertación GETESA',
        start: new Date(2026, 0, 27, 14, 0),
        end: new Date(2026, 0, 27, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 28 de Enero 2026
    {
        id: 'evt-2026-01-28-1',
        title: 'Reunión de concertación AEGLE',
        start: new Date(2026, 0, 28, 9, 0),
        end: new Date(2026, 0, 28, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-01-28-2',
        title: 'Reunión de concertación FEDERACIÓN NACIONAL DE CINE',
        start: new Date(2026, 0, 28, 11, 30),
        end: new Date(2026, 0, 28, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-01-28-3',
        title: 'Reunión de concertación MISS GUINEA',
        start: new Date(2026, 0, 28, 14, 0),
        end: new Date(2026, 0, 28, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 29 de Enero 2026
    {
        id: 'evt-2026-01-29-1',
        title: 'Reunión de concertación GECOTEL',
        start: new Date(2026, 0, 29, 9, 0),
        end: new Date(2026, 0, 29, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-01-29-2',
        title: 'Reunión de concertación ORTEL',
        start: new Date(2026, 0, 29, 11, 30),
        end: new Date(2026, 0, 29, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-01-29-3',
        title: 'Reunión de concertación GITGE',
        start: new Date(2026, 0, 29, 14, 0),
        end: new Date(2026, 0, 29, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 30 de Enero 2026
    {
        id: 'evt-2026-01-30-1',
        title: 'Reunión de concertación FUNDACION CONSTANCIA MANGUE',
        start: new Date(2026, 0, 30, 9, 0),
        end: new Date(2026, 0, 30, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-01-30-2',
        title: 'Reunión de concertación POLICLINICO DR. LOERI COMBA',
        start: new Date(2026, 0, 30, 11, 30),
        end: new Date(2026, 0, 30, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-01-30-3',
        title: 'Reunión de concertación HOSPITAL GENERAL DE BATA',
        start: new Date(2026, 0, 30, 14, 0),
        end: new Date(2026, 0, 30, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 2 de Febrero 2026
    {
        id: 'evt-2026-02-02-1',
        title: 'Reunión de concertación E.G. LNG',
        start: new Date(2026, 1, 2, 9, 0),
        end: new Date(2026, 1, 2, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-02-2',
        title: 'Reunión de concertación PUERTO K5',
        start: new Date(2026, 1, 2, 11, 30),
        end: new Date(2026, 1, 2, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-02-3',
        title: 'Reunión de concertación CHEVRON',
        start: new Date(2026, 1, 2, 14, 0),
        end: new Date(2026, 1, 2, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 3 de Febrero 2026
    {
        id: 'evt-2026-02-03-1',
        title: 'Reunión de concertación GEPROYECTOS',
        start: new Date(2026, 1, 3, 9, 0),
        end: new Date(2026, 1, 3, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-03-2',
        title: 'Reunión de concertación ANDEGE',
        start: new Date(2026, 1, 3, 11, 30),
        end: new Date(2026, 1, 3, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-03-3',
        title: 'Reunión de concertación CNEDOGE',
        start: new Date(2026, 1, 3, 14, 0),
        end: new Date(2026, 1, 3, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 4 de Febrero 2026
    {
        id: 'evt-2026-02-04-1',
        title: 'Reunión de concertación ECA',
        start: new Date(2026, 1, 4, 9, 0),
        end: new Date(2026, 1, 4, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-04-2',
        title: 'Reunión de concertación INSTIC',
        start: new Date(2026, 1, 4, 11, 30),
        end: new Date(2026, 1, 4, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-04-3',
        title: 'Reunión de concertación CICTE',
        start: new Date(2026, 1, 4, 14, 0),
        end: new Date(2026, 1, 4, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 5 de Febrero 2026
    {
        id: 'evt-2026-02-05-1',
        title: 'Reunión de concertación CENSORES JURADOS',
        start: new Date(2026, 1, 5, 9, 0),
        end: new Date(2026, 1, 5, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-05-2',
        title: 'Reunión de concertación VENTANILLA ÚNICA EMPRESARIAL',
        start: new Date(2026, 1, 5, 11, 30),
        end: new Date(2026, 1, 5, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-05-3',
        title: 'Reunión de concertación NOTARIO Y REGISTRADOR',
        start: new Date(2026, 1, 5, 14, 0),
        end: new Date(2026, 1, 5, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 6 de Febrero 2026
    {
        id: 'evt-2026-02-06-1',
        title: 'Reunión de concertación HOSPITAL LA PAZ',
        start: new Date(2026, 1, 6, 9, 0),
        end: new Date(2026, 1, 6, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-06-2',
        title: 'Reunión de concertación CLINICA VIRGEN DE GUADALUPE',
        start: new Date(2026, 1, 6, 11, 30),
        end: new Date(2026, 1, 6, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-06-3',
        title: 'Reunión de concertación HOSPITAL GENERAL DR. LOERI COMBA',
        start: new Date(2026, 1, 6, 14, 0),
        end: new Date(2026, 1, 6, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 9 de Febrero 2026
    {
        id: 'evt-2026-02-09-1',
        title: 'Reunión de concertación TRIDENT',
        start: new Date(2026, 1, 9, 9, 0),
        end: new Date(2026, 1, 9, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-09-2',
        title: 'Reunión de concertación CONNOCO PHILIPS',
        start: new Date(2026, 1, 9, 11, 30),
        end: new Date(2026, 1, 9, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-09-3',
        title: 'Reunión de concertación ITV',
        start: new Date(2026, 1, 9, 14, 0),
        end: new Date(2026, 1, 9, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 10 de Febrero 2026
    {
        id: 'evt-2026-02-10-1',
        title: 'Reunión de concertación ADMINISTRACIÓN PUERTOS',
        start: new Date(2026, 1, 10, 9, 0),
        end: new Date(2026, 1, 10, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-10-2',
        title: 'Reunión de concertación SIDUNEA',
        start: new Date(2026, 1, 10, 11, 30),
        end: new Date(2026, 1, 10, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-10-3',
        title: 'Reunión de concertación CEIBA AEROPUERTOS',
        start: new Date(2026, 1, 10, 14, 0),
        end: new Date(2026, 1, 10, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 11 de Febrero 2026
    {
        id: 'evt-2026-02-11-1',
        title: 'Reunión de concertación BEAC - APEC',
        start: new Date(2026, 1, 11, 9, 0),
        end: new Date(2026, 1, 11, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-11-2',
        title: 'Reunión de concertación ECOBANK',
        start: new Date(2026, 1, 11, 11, 30),
        end: new Date(2026, 1, 11, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-11-3',
        title: 'Reunión de concertación BGFI',
        start: new Date(2026, 1, 11, 14, 0),
        end: new Date(2026, 1, 11, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 12 de Febrero 2026
    {
        id: 'evt-2026-02-12-1',
        title: 'Reunión de concertación BANGE',
        start: new Date(2026, 1, 12, 9, 0),
        end: new Date(2026, 1, 12, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-12-2',
        title: 'Reunión de concertación CCEI - BANK',
        start: new Date(2026, 1, 12, 11, 30),
        end: new Date(2026, 1, 12, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-12-3',
        title: 'Reunión de concertación SGBGE',
        start: new Date(2026, 1, 12, 14, 0),
        end: new Date(2026, 1, 12, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 13 de Febrero 2026
    {
        id: 'evt-2026-02-13-1',
        title: 'Reunión de concertación COFARMA',
        start: new Date(2026, 1, 13, 9, 0),
        end: new Date(2026, 1, 13, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-13-2',
        title: 'Reunión de concertación SONIA',
        start: new Date(2026, 1, 13, 11, 30),
        end: new Date(2026, 1, 13, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-13-3',
        title: 'Reunión de concertación GEFARMA',
        start: new Date(2026, 1, 13, 14, 0),
        end: new Date(2026, 1, 13, 15, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-13-4',
        title: 'Reunión de concertación ANUC',
        start: new Date(2026, 1, 13, 15, 0),
        end: new Date(2026, 1, 13, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 16 de Febrero 2026
    {
        id: 'evt-2026-02-16-1',
        title: 'Reunión de concertación INSTITUTO TECNOLÓGICO DE HIDROCARBUROS',
        start: new Date(2026, 1, 16, 9, 0),
        end: new Date(2026, 1, 16, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-16-2',
        title: 'Reunión de concertación GOLDEN SWANG',
        start: new Date(2026, 1, 16, 11, 30),
        end: new Date(2026, 1, 16, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-16-3',
        title: 'Reunión de concertación SOCIEDAD AGUAS GUINEA',
        start: new Date(2026, 1, 16, 14, 0),
        end: new Date(2026, 1, 16, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 17 de Febrero 2026
    {
        id: 'evt-2026-02-17-1',
        title: 'Reunión de concertación BONAFIDE',
        start: new Date(2026, 1, 17, 9, 0),
        end: new Date(2026, 1, 17, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-17-2',
        title: 'Reunión de concertación BDEAC',
        start: new Date(2026, 1, 17, 11, 30),
        end: new Date(2026, 1, 17, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-17-3',
        title: 'Reunión de concertación CEMAC',
        start: new Date(2026, 1, 17, 14, 0),
        end: new Date(2026, 1, 17, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 18 de Febrero 2026
    {
        id: 'evt-2026-02-18-1',
        title: 'Reunión de concertación CEIBA INTERCONTINENTAL',
        start: new Date(2026, 1, 18, 9, 0),
        end: new Date(2026, 1, 18, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-18-2',
        title: 'Reunión de concertación OFIVEGE',
        start: new Date(2026, 1, 18, 11, 30),
        end: new Date(2026, 1, 18, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-18-3',
        title: 'Reunión de concertación SONAPESCA',
        start: new Date(2026, 1, 18, 14, 0),
        end: new Date(2026, 1, 18, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 19 de Febrero 2026
    {
        id: 'evt-2026-02-19-1',
        title: 'Reunión de concertación SOCIEDADES DE BOLSA',
        start: new Date(2026, 1, 19, 9, 0),
        end: new Date(2026, 1, 19, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-19-2',
        title: 'Reunión de concertación CAJA AUTONOMA DE AMORTIZACION',
        start: new Date(2026, 1, 19, 11, 30),
        end: new Date(2026, 1, 19, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-19-3',
        title: 'Reunión de concertación EGTC',
        start: new Date(2026, 1, 19, 14, 0),
        end: new Date(2026, 1, 19, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 20 de Febrero 2026
    {
        id: 'evt-2026-02-20-1',
        title: 'Reunión de concertación LA ROCA',
        start: new Date(2026, 1, 20, 9, 0),
        end: new Date(2026, 1, 20, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-20-2',
        title: 'Reunión de concertación AUTISMO GUINEA ECUATORIAL',
        start: new Date(2026, 1, 20, 11, 30),
        end: new Date(2026, 1, 20, 12, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-20-3',
        title: 'Reunión de concertación SONRISA EMENO',
        start: new Date(2026, 1, 20, 12, 30),
        end: new Date(2026, 1, 20, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 23 de Febrero 2026
    {
        id: 'evt-2026-02-23-1',
        title: 'Reunión de concertación EMPRESA NACIONAL DE MINAS',
        start: new Date(2026, 1, 23, 9, 0),
        end: new Date(2026, 1, 23, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-23-2',
        title: 'Reunión de concertación MARTINEZ Y HNOS',
        start: new Date(2026, 1, 23, 11, 30),
        end: new Date(2026, 1, 23, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-23-3',
        title: 'Reunión de concertación ABAYAK',
        start: new Date(2026, 1, 23, 14, 0),
        end: new Date(2026, 1, 23, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 24 de Febrero 2026
    {
        id: 'evt-2026-02-24-1',
        title: 'Reunión de concertación ITA AGRO',
        start: new Date(2026, 1, 24, 9, 0),
        end: new Date(2026, 1, 24, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-24-2',
        title: 'Reunión de concertación CASA MAYO',
        start: new Date(2026, 1, 24, 11, 30),
        end: new Date(2026, 1, 24, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 25 de Febrero 2026
    {
        id: 'evt-2026-02-25-1',
        title: 'Reunión de concertación INVEST EG',
        start: new Date(2026, 1, 25, 9, 0),
        end: new Date(2026, 1, 25, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-25-2',
        title: 'Reunión de concertación AGENOR',
        start: new Date(2026, 1, 25, 11, 30),
        end: new Date(2026, 1, 25, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-25-3',
        title: 'Reunión de concertación HOLDING GE',
        start: new Date(2026, 1, 25, 14, 0),
        end: new Date(2026, 1, 25, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 26 de Febrero 2026
    {
        id: 'evt-2026-02-26-1',
        title: 'Reunión de concertación CAMARA DE COMERCIO',
        start: new Date(2026, 1, 26, 9, 0),
        end: new Date(2026, 1, 26, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-26-2',
        title: 'Reunión de concertación IMEX',
        start: new Date(2026, 1, 26, 11, 30),
        end: new Date(2026, 1, 26, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-26-3',
        title: 'Reunión de concertación MILES TRAVELS',
        start: new Date(2026, 1, 26, 14, 0),
        end: new Date(2026, 1, 26, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 27 de Febrero 2026
    {
        id: 'evt-2026-02-27-1',
        title: 'Reunión de concertación RUMBO MALABO',
        start: new Date(2026, 1, 27, 9, 0),
        end: new Date(2026, 1, 27, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-27-2',
        title: 'Reunión de concertación CRONOS',
        start: new Date(2026, 1, 27, 11, 30),
        end: new Date(2026, 1, 27, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-02-27-3',
        title: 'Reunión de concertación BUQUE VITEOCA',
        start: new Date(2026, 1, 27, 14, 0),
        end: new Date(2026, 1, 27, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 2 de Marzo 2026
    {
        id: 'evt-2026-03-02-1',
        title: 'Reunión de concertación BUQUE SAN VALENTIN',
        start: new Date(2026, 2, 2, 9, 0),
        end: new Date(2026, 2, 2, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-03-02-2',
        title: 'Reunión de concertación HOTEL IBIS',
        start: new Date(2026, 2, 2, 11, 30),
        end: new Date(2026, 2, 2, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-03-02-3',
        title: 'Reunión de concertación HOTEL ANDA CHINA',
        start: new Date(2026, 2, 2, 14, 0),
        end: new Date(2026, 2, 2, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 3 de Marzo 2026
    {
        id: 'evt-2026-03-03-1',
        title: 'Reunión de concertación GRAN HOTEL DJIBLOHO',
        start: new Date(2026, 2, 3, 9, 0),
        end: new Date(2026, 2, 3, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-03-03-2',
        title: 'Reunión de concertación SOFITEL',
        start: new Date(2026, 2, 3, 11, 30),
        end: new Date(2026, 2, 3, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-03-03-3',
        title: 'Reunión de concertación COLINAS',
        start: new Date(2026, 2, 3, 14, 0),
        end: new Date(2026, 2, 3, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 4 de Marzo 2026
    {
        id: 'evt-2026-03-04-1',
        title: 'Reunión de concertación HOTEL PANAFRICA',
        start: new Date(2026, 2, 4, 9, 0),
        end: new Date(2026, 2, 4, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-03-04-2',
        title: 'Reunión de concertación HOTEL 3 DE AGOSTO',
        start: new Date(2026, 2, 4, 11, 30),
        end: new Date(2026, 2, 4, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-03-04-3',
        title: 'Reunión de concertación HOTEL BISILA',
        start: new Date(2026, 2, 4, 14, 0),
        end: new Date(2026, 2, 4, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 5 de Marzo 2026
    {
        id: 'evt-2026-03-05-1',
        title: 'Reunión de concertación CHANAS ASURANCE',
        start: new Date(2026, 2, 5, 9, 0),
        end: new Date(2026, 2, 5, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-03-05-2',
        title: 'Reunión de concertación EGICO',
        start: new Date(2026, 2, 5, 11, 30),
        end: new Date(2026, 2, 5, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-03-05-3',
        title: 'Reunión de concertación AFRICAN ASURANCE',
        start: new Date(2026, 2, 5, 14, 0),
        end: new Date(2026, 2, 5, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    // 6 de Marzo 2026
    {
        id: 'evt-2026-03-06-1',
        title: 'Reunión de concertación GUINEA LIMPIA',
        start: new Date(2026, 2, 6, 9, 0),
        end: new Date(2026, 2, 6, 11, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-03-06-2',
        title: 'Reunión de concertación ABOGADOS DEL ESTADO',
        start: new Date(2026, 2, 6, 11, 30),
        end: new Date(2026, 2, 6, 13, 30),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
    {
        id: 'evt-2026-03-06-3',
        title: 'Reunión de concertación DIR. GRAL. DE MANTENIMIENTO',
        start: new Date(2026, 2, 6, 14, 0),
        end: new Date(2026, 2, 6, 16, 0),
        location: 'SALA DE PLENOS',
        participants: ['Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General', 'Directores Generales', 'Coordinadores Sectoriales', 'Consultores']
    },
];

const initialLocations = [
    'SALA DE PLENOS',
    'SALA DE REUNIONES DEL SÓTANO',
    'PALACIO DEL PUEBLO'
];

const initialParticipants = [
    'Presidente', 'Vicepresidente Segundo', 'Miembros', 'Consejeros', 'Secretario General',
    'Directores Generales', 'Coordinadores Sectoriales', 'Consultores', 'Miembros de la subcomisión',
    'Técnico del Gabinete', 'Miembros del Consejo', 'Director General de Protocolo',
    'Todas las Subcomisiones de trabajo', 'Ministerio de Agricultura y Pesca', 'Ministerio de Turismo',
    'Sistema de las Naciones Unidas', 'CICTE', 'UNGE', 'Consejo de la República',
    'Instituciones bancarias', 'Miembros de la Coordinación General de las Jornadeis',
    'Subcomisión de Marketing', 'Subcomisión de Redacción', 'Equipo técnico de la Secretaría General',
    'Directora General de Seguimiento de Políticas Laborales', 'Técnicos del Sector Laboral',
    'Dos técnicos de la Secretaría General'
];

module.exports = { initialEvents, initialLocations, initialParticipants };
