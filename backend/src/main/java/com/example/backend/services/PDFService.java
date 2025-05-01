package com.example.backend.services;

import com.example.backend.entities.Order;
import com.example.backend.entities.OrderItem;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.io.font.PdfEncodings;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

@Service
public class PDFService {

    public String generateOrderPDF(Order order) throws IOException {
        // Create directory if it doesn't exist
        File directory = new File("D:\\invoice");
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // Generate PDF file path
        String fileName = "order_" + order.getId() + "_" + System.currentTimeMillis() + ".pdf";
        String filePath = "D:\\invoice\\" + fileName;

        // Create PDF writer and document
        PdfWriter writer = new PdfWriter(filePath);
        PdfDocument pdf = new PdfDocument(writer);
        
        // Create font with Unicode support for Vietnamese
        PdfFont font = PdfFontFactory.createFont("C:\\Windows\\Fonts\\arial.ttf", PdfEncodings.IDENTITY_H);
        
        Document document = new Document(pdf).setFont(font);

        // Add shop information
        document.add(new Paragraph("CỬA HÀNG: " + order.getShop().getName())
                .setTextAlignment(TextAlignment.CENTER)
                .setBold()
                .setFontSize(14));
        document.add(new Paragraph("Địa chỉ: " + order.getShop().getAddress())
                .setTextAlignment(TextAlignment.CENTER));
        document.add(new Paragraph("\n"));

        // Add order information
        document.add(new Paragraph("HÓA ĐƠN BÁN HÀNG")
                .setTextAlignment(TextAlignment.CENTER)
                .setBold()
                .setFontSize(16));
        document.add(new Paragraph("Ngày tạo: " + order.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")))
                .setTextAlignment(TextAlignment.CENTER));
        document.add(new Paragraph("Người tạo: " + order.getCreatedBy().getName())
                .setTextAlignment(TextAlignment.CENTER));
        document.add(new Paragraph("Khách hàng: " + order.getPartner().getName())
                .setTextAlignment(TextAlignment.CENTER));
        document.add(new Paragraph("SĐT khách hàng: " + order.getPartner().getPhone())
                .setTextAlignment(TextAlignment.CENTER));
        document.add(new Paragraph("\n"));

        // Create table for order items
        Table table = new Table(UnitValue.createPercentArray(new float[]{40, 15, 20, 25}));
        table.setWidth(UnitValue.createPercentValue(100));

        // Add table headers
        table.addHeaderCell("Tên sản phẩm");
        table.addHeaderCell("Số lượng");
        table.addHeaderCell("Đơn giá");
        table.addHeaderCell("Thành tiền");

        // Add order items
        for (OrderItem item : order.getOrderItems()) {
            table.addCell(item.getProductName());
            table.addCell(String.valueOf(item.getQuantity()));
            table.addCell(formatMoney(item.getProductPrice()));
            table.addCell(formatMoney(item.getProductPrice().multiply(BigDecimal.valueOf(item.getQuantity()))));
        }

        document.add(table);
        document.add(new Paragraph("\n"));

        // Add total amount
        document.add(new Paragraph("Tổng tiền: " + formatMoney(order.getAmount()))
                .setTextAlignment(TextAlignment.RIGHT)
                .setBold()
                .setFontSize(12));

        // Close document
        document.close();

        return filePath;
    }

    private String formatMoney(BigDecimal amount) {
        return String.format("%,.0f", amount) + " VNĐ";
    }
} 