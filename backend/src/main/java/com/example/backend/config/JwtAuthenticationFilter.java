package com.example.backend.config;

import com.example.backend.constants.SecurityConstants;
import com.example.backend.dto.BaseResponse;
import com.example.backend.enums.ErrorCode;
import com.example.backend.services.JwtService;
import com.example.backend.services.UserDetailsServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;

    private boolean isPublicEndpoint(HttpServletRequest request) {
        String path = request.getRequestURI();
        return Arrays.stream(SecurityConstants.PUBLIC_ENDPOINTS)
                .anyMatch(item -> path.startsWith(item.replace("/**", "")));
    }

    private void sendResponse(HttpServletResponse response, String message, int statusCode) throws IOException {
        response.setStatus(statusCode);
        response.setContentType("application/json");
        ErrorCode errorCode = ErrorCode.TOKEN_INVALID;
        if (message.equals("Token expired!")) {
            errorCode = ErrorCode.TOKEN_EXPIRED;
        }
        BaseResponse<Object> errorResponse = BaseResponse.error(message, errorCode);
        ObjectMapper objectMapper = new ObjectMapper();
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // Skip JWT authentication for public endpoints
        if (isPublicEndpoint(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Get Authorization header and validate
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            sendResponse(response, "Authorization header is missing!", HttpStatus.UNAUTHORIZED.value());
            return;
        }

        // Extract JWT token
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        UserDetails userDetails = null;
        String username = "";
        try {
            username = jwtService.getUsernameByToken(token);
            userDetails = userDetailsService.loadUserByUsername(username);
        } catch (ExpiredJwtException e) {
            sendResponse(response, "Token expired!", HttpStatus.UNAUTHORIZED.value());
            return;
        } catch (MalformedJwtException e) {
            sendResponse(response, "Invalid token!", HttpStatus.BAD_REQUEST.value());
            return;
        } catch (UsernameNotFoundException e) {
            sendResponse(response, "User not found!", HttpStatus.NOT_FOUND.value());
            return;
        } catch (Exception e) {
            sendResponse(response, "Something went wrong!", HttpStatus.INTERNAL_SERVER_ERROR.value());
            return;
        }

        if (userDetails != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails,
                    null, userDetails.getAuthorities());
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }
        filterChain.doFilter(request, response);
    }
}
