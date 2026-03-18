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

export const generateRangeReport = async (startDate, endDate, filteredEvents, reportTitle = "REPORTE DE ACTIVIDADES") => {
    const doc = new jsPDF({ orientation: 'landscape' });
    const rangeStr = `${format(startDate, 'd MMM yyyy', { locale: es })} - ${format(endDate, 'd MMM yyyy', { locale: es })}`;

    try {
        const img = await loadImage('/cndes-header.png');
        const imgProps = doc.getImageProperties(img);
        const imgWidth = 50;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        
        doc.addImage(img, 'PNG', 14, 10, imgWidth, imgHeight);

        const pageWidth = doc.internal.pageSize.getWidth();
        doc.setFontSize(18);
        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.text(reportTitle.toUpperCase(), pageWidth / 2, imgHeight + 15, { align: 'center' });

        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.setFont('helvetica', 'normal');
        doc.text(rangeStr, pageWidth / 2, imgHeight + 22, { align: 'center' });

        // Group by day
        const grouped = filteredEvents.reduce((acc, event) => {
            const dateKey = format(new Date(event.start), 'yyyy-MM-dd');
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(event);
            return acc;
        }, {});

        const sortedDates = Object.keys(grouped).sort();
        let currentY = imgHeight + 35;

        for (const dateKey of sortedDates) {
            const events = grouped[dateKey].sort((a, b) => new Date(a.start) - new Date(b.start));
            const displayDate = format(new Date(dateKey + 'T12:00:00'), 'EEEE, d MMMM yyyy', { locale: es });

            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(22, 163, 74);
            doc.text(displayDate.toUpperCase(), 14, currentY);
            currentY += 5;

            const tableColumn = ["Horario", "Lugar", "Asunto", "Participantes"];
            const tableRows = events.map(event => [
                `${format(new Date(event.start), 'HH:mm')} - ${format(new Date(event.end), 'HH:mm')}`,
                event.location || '',
                event.title || '',
                Array.isArray(event.participants) ? event.participants.join(', ') : (event.participants || '')
            ]);

            autoTable(doc, {
                startY: currentY,
                head: [tableColumn],
                body: tableRows,
                theme: 'grid',
                styles: { fontSize: 9, cellPadding: 2.5 },
                headStyles: { fillColor: [22, 163, 74] },
                columnStyles: {
                    0: { cellWidth: 35, halign: 'center' },
                    1: { cellWidth: 45 },
                    2: { cellWidth: 70 },
                    3: { cellWidth: 'auto' }
                },
                margin: { top: 10, bottom: 20 },
                didDrawPage: (data) => {
                    // Footer on every page
                    doc.setFontSize(8);
                    doc.setTextColor(150);
                    doc.text('Generado por Sistema de Gestión CNDES - Reporte Dinámico', 14, doc.internal.pageSize.height - 10);
                }
            });

            currentY = doc.lastAutoTable.finalY + 15;
            
            // If near bottom, add new page
            if (currentY > doc.internal.pageSize.height - 30) {
                doc.addPage();
                currentY = 20;
            }
        }

        doc.save(`Reporte_CNDES_${format(new Date(), 'yyyyMMdd_HHmm')}.pdf`);

    } catch (error) {
        console.error("Error generating Range Report:", error);
        alert("Error al generar el reporte.");
    }
};
