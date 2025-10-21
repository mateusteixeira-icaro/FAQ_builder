package com.faq.dto;

import com.faq.model.Feedback;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class FeedbackDTO {
    
    private Long id;
    
    @NotNull(message = "FAQ ID é obrigatório")
    private Long faqId;
    
    @NotNull(message = "Tipo de feedback é obrigatório")
    private Feedback.FeedbackType feedbackType;
    
    private String userIp;
    private LocalDateTime createdAt;
    
    // Constructors
    public FeedbackDTO() {
    }
    
    public FeedbackDTO(Long faqId, Feedback.FeedbackType feedbackType, String userIp) {
        this.faqId = faqId;
        this.feedbackType = feedbackType;
        this.userIp = userIp;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getFaqId() {
        return faqId;
    }
    
    public void setFaqId(Long faqId) {
        this.faqId = faqId;
    }
    
    public Feedback.FeedbackType getFeedbackType() {
        return feedbackType;
    }
    
    public void setFeedbackType(Feedback.FeedbackType feedbackType) {
        this.feedbackType = feedbackType;
    }
    
    public String getUserIp() {
        return userIp;
    }
    
    public void setUserIp(String userIp) {
        this.userIp = userIp;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    @Override
    public String toString() {
        return "FeedbackDTO{" +
                "id=" + id +
                ", faqId=" + faqId +
                ", feedbackType=" + feedbackType +
                ", userIp='" + userIp + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}