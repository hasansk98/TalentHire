import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from backend.core.config import settings
from datetime import datetime
from typing import Dict, Any

class InvoiceService:
    def calculate_gst(self, base_amount: int) -> Dict[str, int]:
        gst_rate = 0.18
        cgst = int(base_amount * 0.09)
        sgst = int(base_amount * 0.09)
        total = base_amount + cgst + sgst
        return {
            "amount": base_amount,
            "cgst": cgst,
            "sgst": sgst,
            "total_amount": total,
            "gst_rate": 18.0
        }

    def generate_pdf_invoice(self, invoice_data: Dict[str, Any], company_data: Dict[str, Any], plan_name: str) -> str:
        # Create directory if not exists
        os.makedirs("storage/invoices", exist_ok=True)
        filename = f"storage/invoices/INV-{invoice_data['invoice_number']}.pdf"
        
        doc = SimpleDocTemplate(filename, pagesize=A4)
        styles = getSampleStyleSheet()
        elements = []

        # Header
        elements.append(Paragraph(settings.COMPANY_LEGAL_NAME, styles['Title']))
        elements.append(Paragraph(f"GSTIN: {settings.GSTIN_SELLER}", styles['Normal']))
        elements.append(Paragraph(settings.COMPANY_ADDRESS, styles['Normal']))
        elements.append(Spacer(1, 20))

        # Bill To
        elements.append(Paragraph("<b>BILL TO:</b>", styles['Normal']))
        elements.append(Paragraph(company_data['name'], styles['Normal']))
        if company_data.get('gstin'):
            elements.append(Paragraph(f"GSTIN: {company_data['gstin']}", styles['Normal']))
        elements.append(Paragraph(company_data.get('billing_address', 'N/A'), styles['Normal']))
        elements.append(Spacer(1, 20))

        # Invoice Info
        elements.append(Paragraph(f"Invoice Number: {invoice_data['invoice_number']}", styles['Normal']))
        elements.append(Paragraph(f"Date: {invoice_data['issue_date'].strftime('%d-%m-%Y')}", styles['Normal']))
        elements.append(Spacer(1, 20))

        # Table
        data = [
            ['Description', 'HSN/SAC', 'Amount (INR)'],
            [f"Subscription: {plan_name}", '998314', f"{invoice_data['amount']}"],
            ['', 'CGST (9%)', f"{invoice_data['cgst']}"],
            ['', 'SGST (9%)', f"{invoice_data['sgst']}"],
            ['', '<b>TOTAL</b>', f"<b>{invoice_data['total_amount']}</b>"]
        ]
        
        t = Table(data, colWidths=[300, 100, 100])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('ALIGN', (2, 0), (2, -1), 'RIGHT'),
        ]))
        elements.append(t)
        
        elements.append(Spacer(1, 40))
        elements.append(Paragraph("Authorized Signatory", styles['Normal']))
        elements.append(Paragraph("AI TalentHire Pvt Ltd", styles['Normal']))

        doc.build(elements)
        return filename

invoice_service = InvoiceService()
