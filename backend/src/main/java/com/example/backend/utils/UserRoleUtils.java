package com.example.backend.utils;

import com.example.backend.entities.User;
import com.example.backend.enums.Role;

public class UserRoleUtils {

    private UserRoleUtils() {
    } // Private constructor to prevent instantiation

    public static boolean isAdmin(User user) {
        return user != null && user.getRole() == Role.ADMIN;
    }

    public static boolean isStaff(User user) {
        return user != null && user.getRole() == Role.STAFF;
    }

    public static boolean isOwner(User user) {
        return user != null && user.getRole() == Role.OWNER;
    }
}
