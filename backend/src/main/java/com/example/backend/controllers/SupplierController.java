package com.example.backend.controllers;

import com.example.backend.config.CurrentUser;
import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.PaginateResponse;
import com.example.backend.dto.supplier.SupplierCreateDTO;
import com.example.backend.dto.supplier.UpdateSupplierDTO;
import com.example.backend.entities.Supplier;
import com.example.backend.entities.User;
import com.example.backend.enums.ErrorCode;
import com.example.backend.services.SupplierService;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/suppliers")
@Tag(name = "Supplier Management", description = "Operations related to suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    @GetMapping
    public ResponseEntity<BaseResponse<PaginateResponse<Supplier>>> getSuppliers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize, @RequestParam(defaultValue = "") String search) {
        Page<Supplier> suppliers = supplierService.findSuppliers(page, pageSize, search);
        PaginateResponse<Supplier> response = new PaginateResponse<>(suppliers);
        return ResponseEntity.ok(new BaseResponse<PaginateResponse<Supplier>>(response, "Success!"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<Supplier>> getSupplierById(@PathVariable Long id) {
        Supplier supplier = supplierService.getSupplierById(id);
        if (supplier == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new BaseResponse<>(null, "Supplier not found", ErrorCode.BAD_REQUEST));
        }

        return ResponseEntity.ok(new BaseResponse<>(supplier, "Success!"));
    }

    @PostMapping
    public ResponseEntity<BaseResponse<Supplier>> createSupplier(@RequestBody @Valid SupplierCreateDTO supplier,
            @CurrentUser User currentUser) {
        try {

            Supplier createdSupplier = supplierService.create(supplier, currentUser);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new BaseResponse<>(createdSupplier, "Supplier created successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<Supplier>> updateSupplier(@PathVariable Long id,
            @RequestBody UpdateSupplierDTO updatedSupplier, @CurrentUser User currentUser) {
        if (supplierService.getSupplierById(id) == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new BaseResponse<>(null, "Supplier not found", ErrorCode.BAD_REQUEST));
        }
        Supplier savedSupplier = supplierService.update(id, updatedSupplier, currentUser);
        return ResponseEntity.ok(new BaseResponse<>(savedSupplier, "Supplier updated successfully", null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse<Void>> deleteSupplier(@PathVariable Long id, @CurrentUser User currentUser) {
        try {
            supplierService.delete(id, currentUser);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new BaseResponse<>(null, "Delete supplier successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new BaseResponse<>(null, e.getMessage()));
        }
    }
}
