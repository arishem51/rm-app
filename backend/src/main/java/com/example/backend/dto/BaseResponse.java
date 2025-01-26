package com.example.backend.dto;

import com.example.backend.enums.ErrorCode;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BaseResponse<T> {
    private T data;
    private String message;
    private ErrorCode errorCode;

    public BaseResponse(T data, String message) {
        this.data = data;
        this.message = message;
        this.errorCode = null; // Default to null
    }

    public static <T> BaseResponse<T> success(T data, String message) {
        return new BaseResponse<>(data, message, null);
    }

    // Convenience method for error response
    public static <T> BaseResponse<T> error(String message, ErrorCode errorCode) {
        return new BaseResponse<>(null, message, errorCode);
    }
}
