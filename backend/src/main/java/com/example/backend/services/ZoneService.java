package com.example.backend.services;

import com.example.backend.entities.Zone;
import com.example.backend.repositories.ZoneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ZoneService {

    private final ZoneRepository zoneRepository;

    // Tìm Zone theo ID
    public Zone findZoneById(Long id) {
        return zoneRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Zone not found"));
    }

    // Lấy tất cả Zone
    public List<Zone> findAllZones() {
        return zoneRepository.findAll();
    }

    // Lưu Zone mới
    public Zone saveZone(Zone zone) {
        return zoneRepository.save(zone);
    }
}
