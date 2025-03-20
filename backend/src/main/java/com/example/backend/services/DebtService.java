package com.example.backend.services;

import com.example.backend.dto.debt.CreateDebtNoteDTO;
import com.example.backend.dto.debt.CreateDebtPaymentDTO;
import com.example.backend.dto.debt.DebtStatisticsDTO;
import com.example.backend.dto.debt.UpdateDebtNoteDTO;
import com.example.backend.entities.DebtNote;
import com.example.backend.entities.DebtPayment;
import com.example.backend.entities.Order;
import com.example.backend.entities.Partner;
import com.example.backend.enums.DebtStatus;
import com.example.backend.repositories.DebtNoteRepository;
import com.example.backend.repositories.DebtPaymentRepository;
import com.example.backend.repositories.OrderRepository;
import com.example.backend.repositories.PartnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class DebtService {

    @Autowired
    private DebtNoteRepository debtNoteRepository;
    
    @Autowired
    private DebtPaymentRepository debtPaymentRepository;
    
    @Autowired
    private PartnerRepository partnerRepository;
    
    @Autowired
    private OrderRepository orderRepository;

    public List<DebtNote> getAllDebtNotes() {
        return debtNoteRepository.findAll();
    }
    
    public List<DebtNote> getDebtNotes(DebtStatus status, Long partnerId, LocalDate fromDate, LocalDate toDate) {
        Partner partner = null;
        if (partnerId != null) {
            Optional<Partner> partnerOpt = partnerRepository.findById(partnerId);
            if (partnerOpt.isPresent()) {
                partner = partnerOpt.get();
            }
        }
        
        if (status != null && partner != null && fromDate != null && toDate != null) {
            return debtNoteRepository.findByStatusAndPartnerAndDueDateBetween(status, partner, fromDate, toDate);
        } else if (status != null && partner != null) {
            return debtNoteRepository.findByStatusAndPartner(status, partner);
        } else if (status != null && fromDate != null && toDate != null) {
            return debtNoteRepository.findByStatusAndDueDateBetween(status, fromDate, toDate);
        } else if (partner != null && fromDate != null && toDate != null) {
            return debtNoteRepository.findByPartnerAndDueDateBetween(partner, fromDate, toDate);
        } else if (status != null) {
            return debtNoteRepository.findByStatus(status);
        } else if (partner != null) {
            return debtNoteRepository.findByPartner(partner);
        } else if (fromDate != null && toDate != null) {
            return debtNoteRepository.findByDueDateBetween(fromDate, toDate);
        } else {
            return debtNoteRepository.findAll();
        }
    }
    
    public Optional<DebtNote> getDebtNoteById(Long id) {
        return debtNoteRepository.findById(id);
    }
    
    @Transactional
    public DebtNote createDebtNote(CreateDebtNoteDTO dto) {
        DebtNote debtNote = new DebtNote();
        
        Partner partner = partnerRepository.findById(dto.getPartnerId())
                .orElseThrow(() -> new RuntimeException("Partner not found"));
        debtNote.setPartner(partner);
        
        debtNote.setAmount(dto.getAmount());
        debtNote.setDueDate(dto.getDueDate());
        debtNote.setSource(dto.getSource());
        debtNote.setDescription(dto.getDescription());
        debtNote.setAttachments(dto.getAttachments());
        debtNote.setNotes(dto.getNotes());
        
        if (dto.getOrderId() != null) {
            Order order = orderRepository.findById(dto.getOrderId())
                    .orElseThrow(() -> new RuntimeException("Order not found"));
            debtNote.setOrder(order);
        }
        
        // Check if due date is in the past
        if (dto.getDueDate().isBefore(LocalDate.now())) {
            debtNote.setStatus(DebtStatus.OVERDUE);
        }
        
        return debtNoteRepository.save(debtNote);
    }
    
    @Transactional
    public DebtNote updateDebtNote(Long id, UpdateDebtNoteDTO dto) {
        DebtNote debtNote = debtNoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Debt note not found"));
        
        if (dto.getPartnerId() != null) {
            Partner partner = partnerRepository.findById(dto.getPartnerId())
                    .orElseThrow(() -> new RuntimeException("Partner not found"));
            debtNote.setPartner(partner);
        }
        
        if (dto.getAmount() != null) {
            debtNote.setAmount(dto.getAmount());
            updateDebtStatus(debtNote);
        }
        
        if (dto.getDueDate() != null) {
            debtNote.setDueDate(dto.getDueDate());
            // Check if due date is in the past and not PAID
            if (dto.getDueDate().isBefore(LocalDate.now()) && debtNote.getStatus() != DebtStatus.PAID) {
                debtNote.setStatus(DebtStatus.OVERDUE);
            }
        }
        
        if (dto.getStatus() != null) {
            debtNote.setStatus(dto.getStatus());
        }
        
        if (dto.getDescription() != null) {
            debtNote.setDescription(dto.getDescription());
        }
        
        if (dto.getAttachments() != null) {
            debtNote.setAttachments(dto.getAttachments());
        }
        
        if (dto.getNotes() != null) {
            debtNote.setNotes(dto.getNotes());
        }
        
        return debtNoteRepository.save(debtNote);
    }
    
    @Transactional
    public void deleteDebtNote(Long id) {
        debtNoteRepository.deleteById(id);
    }
    
    public List<DebtPayment> getDebtPayments(Long debtNoteId) {
        DebtNote debtNote = debtNoteRepository.findById(debtNoteId)
                .orElseThrow(() -> new RuntimeException("Debt note not found"));
        
        return debtPaymentRepository.findByDebtNoteOrderByPaymentDateDesc(debtNote);
    }
    
    @Transactional
    public DebtPayment createDebtPayment(Long debtNoteId, CreateDebtPaymentDTO dto) {
        DebtNote debtNote = debtNoteRepository.findById(debtNoteId)
                .orElseThrow(() -> new RuntimeException("Debt note not found"));
        
        DebtPayment payment = new DebtPayment();
        payment.setDebtNote(debtNote);
        payment.setAmount(dto.getAmount());
        payment.setPaymentDate(dto.getPaymentDate());
        payment.setPaymentMethod(dto.getPaymentMethod());
        payment.setReceiptNumber(dto.getReceiptNumber());
        payment.setNotes(dto.getNotes());
        
        DebtPayment savedPayment = debtPaymentRepository.save(payment);
        
        // Update debt note paid amount and status
        debtNote.setPaidAmount(debtNote.getPaidAmount() + dto.getAmount());
        updateDebtStatus(debtNote);
        debtNoteRepository.save(debtNote);
        
        return savedPayment;
    }
    
    private void updateDebtStatus(DebtNote debtNote) {
        if (debtNote.getPaidAmount() >= debtNote.getAmount()) {
            debtNote.setStatus(DebtStatus.PAID);
        } else if (debtNote.getPaidAmount() > 0) {
            debtNote.setStatus(DebtStatus.PARTIALLY_PAID);
        } else if (debtNote.getDueDate().isBefore(LocalDate.now())) {
            debtNote.setStatus(DebtStatus.OVERDUE);
        } else {
            debtNote.setStatus(DebtStatus.PENDING);
        }
    }
    
    public DebtStatisticsDTO getDebtStatistics() {
        Double totalOutstanding = debtNoteRepository.getTotalOutstandingAmount();
        if (totalOutstanding == null) totalOutstanding = 0.0;
        
        Double overdueAmount = debtNoteRepository.getOverdueAmount();
        if (overdueAmount == null) overdueAmount = 0.0;
        
        Double upcomingPayments = debtNoteRepository.getUpcomingPayments(LocalDate.now().plusDays(30));
        if (upcomingPayments == null) upcomingPayments = 0.0;
        
        return new DebtStatisticsDTO(totalOutstanding, overdueAmount, upcomingPayments);
    }
} 