package com.example.backend.repositories;

import com.example.backend.entities.Zone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ZoneRepository extends JpaRepository<Zone, Long> {
    // Nếu cần có thể thêm các phương thức truy vấn tùy chỉnh tại đây
}

