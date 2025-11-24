import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

export const exportAsImage = async (elementId, fileName = 'business-card.png') => {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
        const dataUrl = await toPng(element, { cacheBust: true, pixelRatio: 2 });

        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataUrl;
        link.click();
    } catch (error) {
        console.error('Error exporting image:', error);
    }
};

export const exportAsPDF = async (elementId, fileName = 'business-card.pdf') => {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
        const imgData = await toPng(element, { cacheBust: true, pixelRatio: 2 });

        // Standard business card size (3.5 x 2 inches approx 89 x 51 mm)
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: [89, 51]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, 89, 51);
        pdf.save(fileName);
    } catch (error) {
        console.error('Error exporting PDF:', error);
    }
};
