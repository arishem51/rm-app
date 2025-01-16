package com.example.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {

}
