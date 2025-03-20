package com.example.backend.services;

import com.example.backend.dto.order.CreateOrderDTO;
import com.example.backend.dto.partner.PartnerCreateDTO;
import com.example.backend.entities.*;
import com.example.backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final PartnerService partnerService;
    private final PaymentHistoryRepository paymentHistoryRepository;
    private final InventoryRepository inventoryRepository;

    public Page<Order> findOrders(int page, int pageSize) {
        PageRequest pageRequest = PageRequest.of(page, pageSize);
        return orderRepository.findAll(pageRequest);
    }

    public Order findOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    public List<Order> findAllOrders(User user) {
        return orderRepository.findByShopIdOrderByCreatedAtDesc(user.getShop().getId());
    }

    @Transactional
    public Order createOrder(CreateOrderDTO orderDTO, User user) {
        List<Inventory> inventories = new ArrayList<>();
        Partner partner = orderDTO.getPartnerId() != null ? partnerService.findById(orderDTO.getPartnerId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khách hàng!"))
                : partnerService.create(
                        PartnerCreateDTO.builder().name(orderDTO
                                .getPartnerName()).contactName(
                                        orderDTO.getPartnerName())
                                .phone(orderDTO.getPartnerPhone())
                                .build(),
                        user);
        // FIXME: should have business rule for amount;
        Order order = Order.builder()
                .createdBy(user)
                .partner(
                        partner)
                .shop(user.getShop())
                .amount(orderDTO.getAmount())
                .build();

        List<OrderItem> orderItems = orderDTO.getOrderItems().stream().map(itemDTO -> {
            Inventory inventory = inventoryRepository
                    .findByIdAndZoneId(itemDTO.getInventoryId(), itemDTO.getZoneId())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sản phẩm!"));
            if (inventory.getZone().getWarehouse().getShop().getId() != user.getShop().getId()) {
                throw new IllegalArgumentException("Không tìm thấy sản phẩm!");
            }
            if (inventory.getQuantity() < itemDTO.getQuantity()) {
                throw new IllegalArgumentException("Số lượng sản phẩm không đủ!");
            }
            inventory.setQuantity(inventory.getQuantity() - itemDTO.getQuantity());
            inventories.add(inventory);
            Zone zone = inventory.getZone();
            Product product = inventory.getProduct();
            return OrderItem.builder()
                    .productName(product.getName())
                    .productId(product.getId())
                    .productPrice(inventory.getProductPrice())
                    .zoneName(zone.getName())
                    .zoneId(zone.getId())
                    .quantity(itemDTO.getQuantity())
                    .order(order)
                    .build();
        }).toList();
        order.setOrderItems(orderItems);
        orderRepository.save(order);

        // FIXME: should have business rule for payment;
        PaymentHistory payment = PaymentHistory.builder()
                .order(order)
                .isDebt(false)
                .discount(
                        BigDecimal.ZERO)
                .shippingFee(BigDecimal.ZERO)
                .totalAmount(orderDTO.getAmount())
                .build();
        paymentHistoryRepository.save(payment);
        return order;
    }

}
