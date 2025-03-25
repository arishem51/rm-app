package com.example.backend;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.backend.entities.Shop;
import com.example.backend.entities.User;
import com.example.backend.enums.Role;
import com.example.backend.services.ProductService;

@ExtendWith(MockitoExtension.class)
class ValidateUserCanManage {

    @Mock
    private ProductService productService;

    @Test
    void testValidateUserCanManageProduct_UserIsOwner_HasShop() {
        User user = new User();
        user.setRole(Role.OWNER);
        user.setShop(new Shop());

        assertDoesNotThrow(() -> productService.validateUserCanManageProduct(user));
    }

    @Test
    void testValidateUserCanManageProduct_UserIsNotOwner() {
        System.out.println("test 123");
        User user = new User();
        user.setRole(Role.STAFF);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> productService.validateUserCanManageProduct(user));
        assertEquals("You are not authorized to manage products!", exception.getMessage());
    }

    // Test when user is Owner but doesn't have a shop
    @Test
    void testValidateUserCanManageProduct_UserIsOwner_NoShop() {
        User user = new User();
        user.setRole(Role.OWNER); // Set the user role to Owner
        user.setShop(null); // User does not have a shop

        // Test should throw IllegalArgumentException with expected message
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> productService.validateUserCanManageProduct(user));
        assertEquals("You must have a shop to manage products!", exception.getMessage());
    }
}
