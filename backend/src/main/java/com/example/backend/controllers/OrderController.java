package com.example.backend.controllers;

import com.example.backend.config.CurrentUser;
import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.order.CreateOrderDTO;
import com.example.backend.dto.order.OrderResponseDTO;
import com.example.backend.entities.Order;
import com.example.backend.entities.User;
import com.example.backend.repositories.OrderRepository;
import com.example.backend.services.OrderService;
import com.example.backend.services.PDFService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.List;
import org.springframework.core.io.Resource;
import java.io.File;
import java.io.IOException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Order Management", description = "Operations related to orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final PDFService pdfService;
    private final OrderRepository orderRepository;

    @Operation(summary = "Get paginate orders", description = "Fetch a list of orders.")
    @GetMapping("/")
    public ResponseEntity<BaseResponse<Page<Order>>> getOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        Page<Order> orders = orderService.findOrders(page, pageSize);
        return ResponseEntity.ok(new BaseResponse<>(orders, "Success!"));
    }

    @Operation(summary = "Get all orders", description = "Fetch all orders.")
    @GetMapping("/all")
    public ResponseEntity<BaseResponse<List<OrderResponseDTO>>> getAllOrders(@CurrentUser User currentUser) {
        List<Order> orders = orderService.findAllOrders(currentUser);
        return ResponseEntity.ok(new BaseResponse<>(OrderResponseDTO.fromEntity(orders), "Success!"));
    }

    @Operation(summary = "Create an order", description = "Create a new order.")
    @PostMapping()
    public ResponseEntity<BaseResponse<OrderResponseDTO>> createOrder(@RequestBody CreateOrderDTO orderDTO,
            @CurrentUser User currentUser) {
        Order createdOrder = orderService.createOrder(orderDTO, currentUser);
        return ResponseEntity.ok(new BaseResponse<>(OrderResponseDTO.fromEntity(createdOrder), "Success!"));
    }

    @Operation(summary = "Get order by ID", description = "Fetch an order by ID.")
    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<OrderResponseDTO>> getOrderById(@PathVariable Long id) {
        Order order = orderService.findOrderById(id);
        return ResponseEntity.ok(new BaseResponse<>(OrderResponseDTO.fromEntity(order), "Success!"));
    }

    @GetMapping("/{id}/export-pdf")
    public ResponseEntity<Resource> exportOrderPdf(@PathVariable Long id, @CurrentUser User user) throws IOException {
        Order order = orderService.findOrderById(id);
        if (order == null || !order.getShop().getId().equals(user.getShop().getId())) {
            throw new IllegalArgumentException("Không tìm thấy đơn hàng!");
        }

        if (order.getPdfPath() == null || !new File(order.getPdfPath()).exists()) {
            String path = pdfService.generateOrderPDF(order);
            order.setPdfPath(path);
            orderRepository.save(order);
        }

        File file = new File(order.getPdfPath());
        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + file.getName())
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }
}
