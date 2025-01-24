package com.example.backend.dto;

import java.util.List;

import org.springframework.data.domain.Page;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PaginateResponse<T> {
    private int pageSize;
    private int pageNumber;
    private int totalElements;
    private int totalPages;
    private List<T> data;

    public PaginateResponse(Page<T> page) {
        this.pageNumber = page.getNumber();
        this.pageSize = page.getSize();
        this.totalElements = (int) page.getTotalElements();
        this.totalPages = page.getTotalPages();
        this.data = page.getContent();
    }
}
