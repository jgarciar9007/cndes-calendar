import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const loadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
    });
};

export const generateDailyAgenda = async (date, allEvents) => {
    const doc = new jsPDF({ orientation: 'landscape' });
    const dateStr = format(date, 'd MMMM yyyy', { locale: es });
    const dateTitle = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

    // Load Header Image
    try {
        const img = await loadImage('/cndes-header.png');
        // Landscape A4 width is ~297mm. Height ~210mm.
        // Image dimensions: maintain aspect ratio.
        // Let's assume we want it centered or full width. The image looks centered.
        // Let's scale it to width approx 150mm centered, or just use ratio.
        const imgProps = doc.getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth();

        // Calculate dimensions to fit nicely at top left
        const imgWidth = 50; // 5 cm width (smaller)
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        const x = 14; // Left margin

        doc.addImage(img, 'PNG', x, 10, imgWidth, imgHeight);

        // Title and Date centered
        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setFontSize(18);
        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.text("AGENDA", pageWidth / 2, imgHeight + 15, { align: 'center' });

        doc.setFontSize(14);
        doc.setTextColor(50);
        doc.setFont('helvetica', 'normal');
        doc.text(dateTitle, pageWidth / 2, imgHeight + 22, { align: 'center' });

        // Start table below date
        const tableStartY = imgHeight + 35;

        // Filter events
        const dayEvents = allEvents.filter(e => {
            const d = new Date(e.start);
            return d.getDate() === date.getDate() &&
                d.getMonth() === date.getMonth() &&
                d.getFullYear() === date.getFullYear();
        }).sort((a, b) => new Date(a.start) - new Date(b.start));

        if (dayEvents.length === 0) {
            doc.setTextColor(0);
            doc.setFontSize(12);
            doc.text("No hay actividades programadas para este día.", 14, tableStartY + 10);
            doc.save(`Agenda_CNDES_${format(date, 'yyyy-MM-dd')}.pdf`);
            return;
        }

        // Table
        const tableColumn = ["#", "Horario", "Lugar", "Asunto", "Participantes"];
        const tableRows = [];

        dayEvents.forEach((event, index) => {
            const start = format(new Date(event.start), 'HH:mm');
            const end = format(new Date(event.end), 'HH:mm');
            const participants = Array.isArray(event.participants) ? event.participants.join(', ') : (event.participants || '');

            tableRows.push([
                index + 1,
                `${start} - ${end}`,
                event.location || '',
                event.title || '',
                participants
            ]);
        });

        autoTable(doc, {
            startY: tableStartY,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            styles: { fontSize: 10, cellPadding: 3, textColor: [50, 50, 50] },
            // Green Header: Using a darker professional green
            headStyles: {
                fillColor: [22, 163, 74], // green-600 approx
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                halign: 'center',
                valign: 'middle'
            },
            columnStyles: {
                0: { cellWidth: 15, halign: 'center' },
                1: { cellWidth: 35, halign: 'center' },
                2: { cellWidth: 50 },
                3: { cellWidth: 70 },
                4: { cellWidth: 'auto' }
            },
            alternateRowStyles: { fillColor: [240, 253, 244] } // Very light green tint
        });

        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text('Generado por Sistema de Gestión CNDES', 14, doc.internal.pageSize.height - 10);
        }

        doc.save(`Agenda_CNDES_${format(date, 'yyyy-MM-dd')}.pdf`);

    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Error al generar el PDF. Verifica que la imagen de cabecera exista.");
    }
};
