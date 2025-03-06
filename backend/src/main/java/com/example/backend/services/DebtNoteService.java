package com.example.backend.services;

import com.example.backend.dto.debtnote.DebtNoteCreateDTO;
import com.example.backend.dto.debtnote.DebtNoteUpdateDTO;
import com.example.backend.entities.DebtNote;
import com.example.backend.entities.Partner;
import com.example.backend.entities.Transaction;
import com.example.backend.enums.TransactionType;
import com.example.backend.repositories.DebtNoteRepository;
import com.example.backend.repositories.PartnerRepository;
import com.example.backend.repositories.TransactionRepository;
import com.example.backend.utils.UserRoleUtils;
import com.example.backend.entities.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DebtNoteService {

    private final DebtNoteRepository debtNoteRepository;
    private final PartnerRepository partnerRepository;
    private final TransactionRepository transactionRepository;

    /**
     * Lấy danh sách tất cả phiếu nợ
     */
    public List<DebtNote> getAllDebtNotes() {
        return debtNoteRepository.findAll();
    }

    /**
     * Lấy phiếu nợ theo ID
     */
    public DebtNote getDebtNoteById(Long id) {
        return debtNoteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("DebtNote not found"));
    }

    /**
     * Tạo phiếu nợ mới
     */
    @Transactional
    public DebtNote createDebtNote(DebtNoteCreateDTO dto, User currentUser) {
        if (!UserRoleUtils.isAdmin(currentUser)) {
            throw new IllegalArgumentException("You are not authorized to create a debt note");
        }

        Partner partner = partnerRepository.findById(dto.getPartnerId())
                .orElseThrow(() -> new IllegalArgumentException("Partner not found"));

        DebtNote debtNote = DebtNote.builder()
                .partner(partner)
                .description(dto.getDescription())
                .transactionType(dto.getTransactionType()) // Dùng Enum thay vì String
                .amount(dto.getAmount())
                .imageUrl(dto.getImageUrl())
                .build();

        debtNoteRepository.save(debtNote);

        // Ghi lại giao dịch khi tạo phiếu nợ
        recordTransaction(debtNote);

        return debtNote;
    }

    /**
     * Cập nhật phiếu nợ
     */
    @Transactional
    public DebtNote updateDebtNote(Long id, DebtNoteUpdateDTO dto, User currentUser) {
        if (!UserRoleUtils.isAdmin(currentUser)) {
            throw new IllegalArgumentException("You are not authorized to update a debt note");
        }

        DebtNote debtNote = debtNoteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("DebtNote not found"));

        // Kiểm tra nếu có thay đổi thông tin
        if (dto.getDescription() != null) debtNote.setDescription(dto.getDescription());
        if (dto.getTransactionType() != null) debtNote.setTransactionType(dto.getTransactionType());
        if (dto.getAmount() != null) debtNote.setAmount(dto.getAmount());
        if (dto.getImageUrl() != null) debtNote.setImageUrl(dto.getImageUrl());

        debtNoteRepository.save(debtNote);

        // Ghi lại lịch sử giao dịch khi cập nhật
        recordTransaction(debtNote);

        return debtNote;
    }

    /**
     * Xóa phiếu nợ
     */
    @Transactional
    public void deleteDebtNote(Long id, User currentUser) {
        if (!UserRoleUtils.isAdmin(currentUser)) {
            throw new IllegalArgumentException("You are not authorized to delete a debt note");
        }

        if (!debtNoteRepository.existsById(id)) {
            throw new IllegalArgumentException("DebtNote not found");
        }

        debtNoteRepository.deleteById(id);
    }

    /**
     * Ghi lại lịch sử giao dịch khi có thay đổi về phiếu nợ
     */
    private void recordTransaction(DebtNote debtNote) {
        Transaction transaction = Transaction.builder()
                .partner(debtNote.getPartner())
                .debtNote(debtNote)
                .transactionType(debtNote.getTransactionType().name()) // Lưu Enum dưới dạng String
                .amount(debtNote.getAmount())
                .note(debtNote.getDescription())
                .build();

        transactionRepository.save(transaction);
    }
}
