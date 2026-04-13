package com.oshit.loglog.repository;

import java.time.Instant;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oshit.loglog.model.LogEntry;

public interface LogEntryRepository extends JpaRepository<LogEntry, String> {

    List<LogEntry> findByUserIdAndTimestampBetweenOrderByTimestampDesc(
            String userId, Instant from, Instant to);
}
