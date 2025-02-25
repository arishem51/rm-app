package com.example.backend.services;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.example.backend.config.CurrentUser;
import com.example.backend.dto.supplier.SupplierCreateDTO;
import com.example.backend.dto.supplier.UpdateSupplierDTO;
import com.example.backend.entities.Supplier;
import com.example.backend.entities.User;
import com.example.backend.enums.Role;
import com.example.backend.repositories.SupplierRepository;
import com.example.backend.utils.UserRoleUtils;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SupplierService {
    private final SupplierRepository supplierRepository;

    public Page<Supplier> findSuppliers(int page, int pageSize, String search) {
        return search.isEmpty() ? supplierRepository.findAll(PageRequest.of(page, pageSize))
                : supplierRepository.findByNameContainingIgnoreCase(search, PageRequest.of(page, pageSize));

    }

    public List<Supplier> findAllSuppliers() {
        return supplierRepository.findAll();
    }

    public Supplier getSupplierById(Long id) {
        return supplierRepository.findById(id).orElse(null);
    }

    public Supplier create(SupplierCreateDTO supplierDto, User currentUser) {

        if (!UserRoleUtils.isAdmin(currentUser)) {
            throw new IllegalArgumentException("You are not authorized to perform this action");
        }

        // FIXME: should we validate duplicate phone number, email, tax ID, etc.?

        Supplier supplier = Supplier.builder()
                .name(supplierDto.getName())
                .contactName(supplierDto.getContactName())
                .phone(supplierDto.getPhone())
                .email(supplierDto.getEmail())
                .taxCode(supplierDto.getTaxCode())
                .address(supplierDto.getAddress())
                .website(supplierDto.getWebsite())
                .description(supplierDto.getDescription())
                .build();

        supplierRepository.save(supplier);
        return supplier;
    }

    public Supplier update(Long id, UpdateSupplierDTO supplierDto, @CurrentUser User currentUser) {
        if (!UserRoleUtils.isAdmin(currentUser)) {
            throw new IllegalArgumentException("You are not authorized to perform this action");
        }
        Optional<Supplier> dbSupplier = supplierRepository.findById(id);
        if (dbSupplier.isEmpty()) {
            throw new IllegalArgumentException("Supplier not found");
        }

        Supplier supplier = Supplier.builder()
                .name(supplierDto.getName() != null ? supplierDto.getName() : dbSupplier.get().getName())
                .contactName(supplierDto.getContactName() != null ? supplierDto.getContactName()
                        : dbSupplier.get().getContactName())
                .phone(supplierDto.getPhone() != null ? supplierDto.getPhone() : dbSupplier.get().getPhone())
                .email(supplierDto.getEmail() != null ? supplierDto.getEmail() : dbSupplier.get().getEmail())
                .taxCode(supplierDto.getTaxCode() != null ? supplierDto.getTaxCode() : dbSupplier.get().getTaxCode())
                .address(supplierDto.getAddress() != null ? supplierDto.getAddress() : dbSupplier.get().getAddress())
                .website(supplierDto.getWebsite() != null ? supplierDto.getWebsite() : dbSupplier.get().getWebsite())
                .description(supplierDto.getDescription() != null ? supplierDto.getDescription()
                        : dbSupplier.get().getDescription())
                .build();

        supplierRepository.save(supplier);
        return supplier;
    }

    public void delete(Long id, @CurrentUser User currentUser) {
        if (currentUser.getRole() == Role.STAFF) {
            throw new IllegalArgumentException("You are not authorized to perform this action");
        }
        if (!supplierRepository.existsById(id)) {
            throw new IllegalArgumentException("Supplier not found");
        }
        supplierRepository.deleteById(id);
    }

    public Optional<Supplier> findById(Long id) {
        return supplierRepository.findById(id);
    }
}
