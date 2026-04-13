package com.oshit.loglog.model;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

@Entity
@Table(name = "log_entries", indexes = {
        @Index(name = "idx_log_entries_user_time", columnList = "user_id, log_timestamp")
})
public class LogEntry {

    @Id
    private String id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @JsonProperty("timestamp")
    @Column(name = "log_timestamp", nullable = false)
    private Instant timestamp;

    @Column(nullable = false)
    private String shape;

    private String color;

    private String feeling;

    @Convert(converter = StringListConverter.class)
    @Column(name = "contributing_factors")
    private List<String> contributingFactors;

    private String location;

    public LogEntry() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public String getShape() {
        return shape;
    }

    public void setShape(String shape) {
        this.shape = shape;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getFeeling() {
        return feeling;
    }

    public void setFeeling(String feeling) {
        this.feeling = feeling;
    }

    public List<String> getContributingFactors() {
        return contributingFactors;
    }

    public void setContributingFactors(List<String> contributingFactors) {
        this.contributingFactors = contributingFactors;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
