package com.oshit.loglog.controller;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.oshit.loglog.model.CreateLogRequest;
import com.oshit.loglog.model.LogEntry;
import com.oshit.loglog.service.LogService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/logs")
public class LogController {

    private final LogService logService;

    public LogController(LogService logService) {
        this.logService = logService;
    }

    @PostMapping
    public ResponseEntity<LogEntry> create(
            @RequestHeader(value = "X-User-Id", defaultValue = "demo-user") String userId,
            @Valid @RequestBody CreateLogRequest request) {
        LogEntry entry = logService.createEntry(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(entry);
    }

    @GetMapping
    public ResponseEntity<List<LogEntry>> list(
            @RequestHeader(value = "X-User-Id", defaultValue = "demo-user") String userId,
            @RequestParam String from,
            @RequestParam String to) {
        Instant fromInstant = LocalDate.parse(from).atStartOfDay(ZoneOffset.UTC).toInstant();
        Instant toInstant = LocalDate.parse(to).atTime(LocalTime.MAX).toInstant(ZoneOffset.UTC);
        List<LogEntry> entries = logService.getEntries(userId, fromInstant, toInstant);
        return ResponseEntity.ok(entries);
    }
}
