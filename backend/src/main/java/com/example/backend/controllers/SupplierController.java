package com.example.backend.controllers;

import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.SupplierCreateDTO;
import com.example.backend.entities.Shop;
import com.example.backend.entities.Supplier;
import com.example.backend.enums.ErrorCode;
import com.example.backend.repositories.SupplierRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    @Autowired
    private SupplierRepository supplierRepository;

    @GetMapping
    public ResponseEntity<BaseResponse<List<Supplier>>> getAllSuppliers() {
        List<Supplier> suppliers = supplierRepository.findAll();
        return ResponseEntity.ok(new BaseResponse<>(suppliers, "Success", null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<Supplier>> getSupplierById(@PathVariable Long id) {
        Optional<Supplier> supplier = supplierRepository.findById(id);
        return supplier.map(s -> ResponseEntity.ok(new BaseResponse<>(s, "Success", null)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new BaseResponse<>(null, "Supplier not found", ErrorCode.BAD_REQUEST)));
    }

    @PostMapping
    public ResponseEntity<BaseResponse<Supplier>> createSupplier(@RequestBody SupplierCreateDTO supplier) {
        if (supplier.getName() == null || supplier.getName().isEmpty()) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, "Supplier name is required", ErrorCode.BAD_REQUEST));
        }
        if (supplier.getContractName() == null || supplier.getContractName().isEmpty()) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, "Contract name is required", ErrorCode.BAD_REQUEST));
        }
        if (supplier.getPhone() == null || supplier.getPhone().isEmpty()) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, "Phone number is required", ErrorCode.BAD_REQUEST));
        }
        if (supplier.getEmail() == null || supplier.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, "Email is required", ErrorCode.BAD_REQUEST));
        }
        if (supplier.getTaxId() == null || supplier.getTaxId().isEmpty()) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, "Tax ID is required", ErrorCode.BAD_REQUEST));
        }
        if (supplier.getAddress() == null || supplier.getAddress().isEmpty()) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, "Address is required", ErrorCode.BAD_REQUEST));
        }
        if (supplier.getLastOrderDate() == null) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, "Last order date is required", ErrorCode.BAD_REQUEST));
        }
        Supplier supplierCreate = Supplier.builder()
                .name(supplier.getName())
                .contractName(supplier.getContractName())
                .phone(supplier.getPhone())
                .email(supplier.getEmail())
                .taxId(supplier.getTaxId())
                .address(supplier.getAddress())
                .website(supplier.getWebsite())
                .totalDebt(supplier.getTotalDebt())
                .lastOrderDate(supplier.getLastOrderDate())
                .notes(supplier.getNotes())
                .build();
        Supplier createdSupplier = supplierRepository.save(supplierCreate);
        return ResponseEntity.status(HttpStatus.CREATED).body(new BaseResponse<>(createdSupplier, "Supplier created successfully", null));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<Supplier>> updateSupplier(@PathVariable Long id, @RequestBody Supplier updatedSupplier) {
        if (!supplierRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new BaseResponse<>(null, "Supplier not found", ErrorCode.BAD_REQUEST));
        }
        if (updatedSupplier.getName() == null || updatedSupplier.getName().isEmpty()) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, "Supplier name is required", ErrorCode.BAD_REQUEST));
        }
        updatedSupplier.setId(id);
        Supplier savedSupplier = supplierRepository.save(updatedSupplier);
        return ResponseEntity.ok(new BaseResponse<>(savedSupplier, "Supplier updated successfully", null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse<Void>> deleteSupplier(@PathVariable Long id) {
        if (!supplierRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new BaseResponse<>(null, "Supplier not found", ErrorCode.BAD_REQUEST));
        }
        supplierRepository.deleteById(id);
        return ResponseEntity.ok(new BaseResponse<>(null, "Supplier deleted successfully", null));
    }
}
