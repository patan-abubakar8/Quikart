package com.ecommerce.ecomapi.service.pdf;

import com.ecommerce.ecomapi.entity.Order;
import com.ecommerce.ecomapi.entity.OrderItem;
import com.ecommerce.ecomapi.exceptions.ResourceNotFoundException;
import com.ecommerce.ecomapi.repository.OrderRepository;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class PdfService implements IPdfService {

    private final OrderRepository orderRepository;

    @Override
    public ByteArrayOutputStream generateOrderPdf(Order order) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc);

        try {
            // Header
            document.add(new Paragraph("ORDER CONFIRMATION")
                    .setFontSize(20)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20));

            // Order Details
            document.add(new Paragraph("Order Details")
                    .setFontSize(16)
                    .setBold()
                    .setMarginBottom(10));

            Table orderDetailsTable = new Table(2);
            orderDetailsTable.setWidth(UnitValue.createPercentValue(100));

            orderDetailsTable.addCell(createCell("Order ID:", true));
            orderDetailsTable.addCell(createCell(order.getId().toString(), false));

            orderDetailsTable.addCell(createCell("Order Date:", true));
            orderDetailsTable.addCell(
                    createCell(order.getOrderedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")), false));

            orderDetailsTable.addCell(createCell("Status:", true));
            orderDetailsTable.addCell(createCell(order.getOrderStatus().toString(), false));

            orderDetailsTable.addCell(createCell("Customer:", true));
            orderDetailsTable.addCell(createCell(order.getUser().getName(), false));

            orderDetailsTable.addCell(createCell("Email:", true));
            orderDetailsTable.addCell(createCell(order.getUser().getEmail(), false));

            document.add(orderDetailsTable);
            document.add(new Paragraph("\n"));

            // Order Items
            document.add(new Paragraph("Order Items")
                    .setFontSize(16)
                    .setBold()
                    .setMarginBottom(10));

            Table itemsTable = new Table(new float[] { 3, 1, 2, 2 });
            itemsTable.setWidth(UnitValue.createPercentValue(100));

            // Headers
            itemsTable.addHeaderCell(createHeaderCell("Product"));
            itemsTable.addHeaderCell(createHeaderCell("Qty"));
            itemsTable.addHeaderCell(createHeaderCell("Price"));
            itemsTable.addHeaderCell(createHeaderCell("Total"));

            // Items
            BigDecimal subtotal = BigDecimal.ZERO;
            for (OrderItem item : order.getItems()) {
                itemsTable.addCell(createCell(item.getProduct().getName(), false));
                itemsTable.addCell(createCell(String.valueOf(item.getQuantity()), false));
                itemsTable.addCell(createCell("$" + item.getPrice().toString(), false));

                BigDecimal itemTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                itemsTable.addCell(createCell("$" + itemTotal.toString(), false));
                subtotal = subtotal.add(itemTotal);
            }

            document.add(itemsTable);
            document.add(new Paragraph("\n"));

            // Total
            Table totalTable = new Table(2);
            totalTable.setWidth(UnitValue.createPercentValue(50));
            totalTable.setMarginLeft(50f);

            totalTable.addCell(createCell("Subtotal:", true));
            totalTable.addCell(createCell("$" + subtotal.toString(), false));

            totalTable.addCell(createCell("Total:", true));
            totalTable.addCell(createCell("$" + order.getTotalAmount().toString(), false));

            document.add(totalTable);

            // Footer
            document.add(new Paragraph("\n\nThank you for your order!")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setItalic());

        } finally {
            document.close();
        }

        return baos;
    }

    @Override
    public ByteArrayOutputStream generateOrderInvoice(Order order) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc);

        try {
            // Header
            document.add(new Paragraph("INVOICE")
                    .setFontSize(24)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20));

            // Company Info (you can customize this)
            document.add(new Paragraph("E-Commerce Store")
                    .setFontSize(16)
                    .setBold());
            document.add(new Paragraph("123 Business Street\nCity, State 12345\nPhone: (555) 123-4567")
                    .setMarginBottom(20));

            // Invoice Details
            Table invoiceDetailsTable = new Table(2);
            invoiceDetailsTable.setWidth(UnitValue.createPercentValue(100));

            invoiceDetailsTable.addCell(createCell("Invoice #:", true));
            invoiceDetailsTable.addCell(createCell("INV-" + order.getId(), false));

            invoiceDetailsTable.addCell(createCell("Invoice Date:", true));
            invoiceDetailsTable
                    .addCell(createCell(order.getOrderedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")), false));

            invoiceDetailsTable.addCell(createCell("Due Date:", true));
            invoiceDetailsTable.addCell(createCell(
                    order.getOrderedAt().plusDays(30).format(DateTimeFormatter.ofPattern("dd/MM/yyyy")), false));

            document.add(invoiceDetailsTable);
            document.add(new Paragraph("\n"));

            // Bill To
            document.add(new Paragraph("Bill To:")
                    .setFontSize(14)
                    .setBold());
            document.add(new Paragraph(order.getUser().getName() + "\n" + order.getUser().getEmail())
                    .setMarginBottom(20));

            // Items Table (similar to order PDF but with invoice styling)
            Table itemsTable = new Table(new float[] { 4, 1, 2, 2 });
            itemsTable.setWidth(UnitValue.createPercentValue(100));

            itemsTable.addHeaderCell(createHeaderCell("Description"));
            itemsTable.addHeaderCell(createHeaderCell("Qty"));
            itemsTable.addHeaderCell(createHeaderCell("Rate"));
            itemsTable.addHeaderCell(createHeaderCell("Amount"));

            BigDecimal subtotal = BigDecimal.ZERO;
            for (OrderItem item : order.getItems()) {
                itemsTable.addCell(createCell(item.getProduct().getName(), false));
                itemsTable.addCell(createCell(String.valueOf(item.getQuantity()), false));
                itemsTable.addCell(createCell("$" + item.getPrice().toString(), false));

                BigDecimal itemTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                itemsTable.addCell(createCell("$" + itemTotal.toString(), false));
                subtotal = subtotal.add(itemTotal);
            }

            document.add(itemsTable);
            document.add(new Paragraph("\n"));

            // Total Section
            Table totalTable = new Table(2);
            totalTable.setWidth(UnitValue.createPercentValue(40));
            totalTable.setMarginLeft(60f);

            totalTable.addCell(createCell("Subtotal:", false));
            totalTable.addCell(createCell("$" + subtotal.toString(), false));

            totalTable.addCell(createCell("Tax (0%):", false));
            totalTable.addCell(createCell("$0.00", false));

            totalTable.addCell(createCell("TOTAL:", true));
            totalTable.addCell(createCell("$" + order.getTotalAmount().toString(), true));

            document.add(totalTable);

            // Payment Terms
            document.add(new Paragraph("\n\nPayment Terms: Net 30 days")
                    .setFontSize(10)
                    .setItalic());

        } finally {
            document.close();
        }

        return baos;
    }

    @Override
    public byte[] generateOrderReceipt(Long orderId) throws IOException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        ByteArrayOutputStream baos = generateOrderPdf(order);
        return baos.toByteArray();
    }

    private Cell createCell(String content, boolean isBold) {
        Cell cell = new Cell().add(new Paragraph(content));
        if (isBold) {
            cell.setBold();
        }
        return cell;
    }

    private Cell createHeaderCell(String content) {
        return new Cell()
                .add(new Paragraph(content))
                .setBold()
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setTextAlignment(TextAlignment.CENTER);
    }
}