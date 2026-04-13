package com.oshit.loglog.service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.oshit.loglog.model.CreateLogRequest;
import com.oshit.loglog.model.LogEntry;
import com.oshit.loglog.repository.LogEntryRepository;

@Service
public class LogService {

    private final LogEntryRepository repository;

    public LogService(LogEntryRepository repository) {
        this.repository = repository;
    }

    public LogEntry createEntry(String userId, CreateLogRequest request) {
        LogEntry entry = new LogEntry();
        entry.setId(UUID.randomUUID().toString());
        entry.setUserId(userId);
        entry.setTimestamp(Instant.now());
        entry.setShape(request.shape());
        entry.setColor(request.color());
        entry.setFeeling(request.feeling());
        entry.setContributingFactors(request.contributingFactors());
        entry.setLocation(request.location());
        return repository.save(entry);
    }

    public List<LogEntry> getEntries(String userId, Instant from, Instant to) {
        return repository.findByUserIdAndTimestampBetweenOrderByTimestampDesc(userId, from, to);
    }
}
