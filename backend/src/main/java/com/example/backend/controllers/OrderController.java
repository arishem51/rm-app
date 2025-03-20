package com.example.backend.controllers;

import com.example.backend.config.CurrentUser;
import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.order.CreateOrderDTO;
import com.example.backend.dto.order.OrderResponseDTO;
import com.example.backend.dto.order.UpdateOrderDTO;
import com.example.backend.entities.Order;
import com.example.backend.entities.User;
import com.example.backend.services.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Order Management", description = "Operations related to orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

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

}
