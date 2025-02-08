package com.example.backend.services;

import com.example.backend.dto.CreateShopDTO;
import com.example.backend.entities.Shop;
import com.example.backend.entities.User;
import com.example.backend.repositories.ShopRepository;
import com.example.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ShopService {
    private final ShopRepository shopRepository;
    private final UserRepository userRepository;
    public Page<Shop> findShops(int page, int pageSize, String search) {
        return null;
    }

    public boolean createShop(CreateShopDTO shopDTO, User user) {
        if (shopRepository.existsByName(shopDTO.getName())) {
            return false;
        }

        // Tạo Shop mới
        Shop shop = new Shop();
        shop.setName(shopDTO.getName());
        shop.setAddress(shopDTO.getAddress());
        shop.setCreateBy(user);

        shopRepository.save(shop);
        return true;
    }


}
