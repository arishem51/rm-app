package com.example.backend.services;

import com.example.backend.dto.order.CreateOrderDTO;
import com.example.backend.dto.order.OrderItemDTO;
import com.example.backend.dto.order.UpdateOrderDTO;
import com.example.backend.entities.*;
import com.example.backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final PartnerRepository partnerRepository;
    private final PaymentHistoryRepository paymentHistoryRepository;
    private final InventoryRepository inventoryRepository;
    public Page<Order> findOrders(int page, int pageSize) {
        PageRequest pageRequest = PageRequest.of(page, pageSize);
        return orderRepository.findAll( pageRequest);
    }
    public Order findOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }
    public List<Order> findAllOrders(User user) {
        return orderRepository.findByShopIdOrderByCreatedAtDesc(user.getShop().getId());
    }

    @Transactional
    public Order createOrder(CreateOrderDTO orderDTO, User user) {
        Order order = Order.builder()
                .user(user)
                .partner(partnerRepository.getById(orderDTO.getPartnerId()))
                .shop(user.getShop())
                .totalAmount(calculateTotalAmount(orderDTO.getOrderItems()))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .orderItems(orderDTO.getOrderItems().stream().map(itemDTO -> {
                    Inventory inventory = inventoryRepository.findById(itemDTO.getProductId()).orElseThrow(() -> new IllegalArgumentException("Inventory not found"));
                    inventory.setQuantity(inventory.getQuantity() - itemDTO.getQuantity());
                    inventoryRepository.save(inventory);
                    Product product = inventory.getProduct();
                    return OrderItem.builder()
                            .product(product)
                            .quantity(itemDTO.getQuantity())
                            .price(product.getSalePrice()) // Sử dụng giá từ product
                            .build();
                }).toList())
                .build();

        order.getOrderItems().forEach(item -> item.setOrder(order));
       orderRepository.save(order);
       BigDecimal discount = calculateDiscount(orderDTO.getOrderItems());
       BigDecimal shippingFee = calculateShippingFee(orderDTO.getOrderItems());
        PaymentHistory payment = PaymentHistory.builder()
                .order(order)
                .isDebt(orderDTO.isDebt())
                .discount(discount)
                .shippingFee(orderDTO.isShipping() ? shippingFee : BigDecimal.ZERO)
                .totalAmount(order.getTotalAmount().add(shippingFee.subtract(discount)))
                .build();
        paymentHistoryRepository.save(payment);
        return order;
    }

    @Transactional
    public Order updateOrder(Long id, UpdateOrderDTO requestDTO, User user) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        order.setUser(user);
        order.setPartner(partnerRepository.getById(requestDTO.getPartnerId()));
        order.setTotalAmount(calculateTotalAmount(requestDTO.getOrderItems()));
        order.setUpdatedAt(LocalDateTime.now());
        order.getOrderItems().clear();

        requestDTO.getOrderItems().forEach(itemDTO -> {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));
            OrderItem item = OrderItem.builder()
                    .product(product)
                    .quantity(itemDTO.getQuantity())
                    .price(itemDTO.getPrice())
                    .order(order)
                    .subtotal(itemDTO.getPrice().multiply(BigDecimal.valueOf(itemDTO.getQuantity())))
                    .build();
            order.getOrderItems().add(item);
        });

        return orderRepository.save(order);
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    private BigDecimal calculateTotalAmount(List<OrderItemDTO> items) {
        return items.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    private BigDecimal calculateDiscount(List<OrderItemDTO> items) {
        return items.stream()
                .map(item -> BigDecimal.valueOf(300).multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    private BigDecimal calculateShippingFee(List<OrderItemDTO> items) {
        return items.stream()
                .map(item -> BigDecimal.valueOf(2000).multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
