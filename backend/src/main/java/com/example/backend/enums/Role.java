package com.example.backend.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Role {
    @JsonProperty("OWNER")
    OWNER,
    @JsonProperty("STAFF")
    STAFF,
    @JsonProperty("ADMIN")
    ADMIN;

    @JsonCreator
    public static Role fromString(String value) {
        return Role.valueOf(value.toUpperCase()); // Converts "owner" -> "OWNER"
    }

    @JsonValue
    public String toJson() {
        return name();
    }
}
