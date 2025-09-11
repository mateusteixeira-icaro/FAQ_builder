package com.faq.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "feedbacks")
public class Feedback {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "FAQ é obrigatório")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faq_id", nullable = false)
    private Faq faq;
    
    @NotNull(message = "Tipo de feedback é obrigatório")
    @Enumerated(EnumType.STRING)
    @Column(name = "feedback_type", nullable = false)
    private FeedbackType feedbackType;
    
    @Column(name = "user_ip")
    private String userIp;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // Enum para tipo de feedback
    public enum FeedbackType {
        POSITIVE, NEGATIVE
    }
    
    // Constructors
    public Feedback() {
    }
    
    public Feedback(Faq faq, FeedbackType feedbackType, String userIp) {
        this.faq = faq;
        this.feedbackType = feedbackType;
        this.userIp = userIp;
    }
    
    // Lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Faq getFaq() {
        return faq;
    }
    
    public void setFaq(Faq faq) {
        this.faq = faq;
    }
    
    public FeedbackType getFeedbackType() {
        return feedbackType;
    }
    
    public void setFeedbackType(FeedbackType feedbackType) {
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
        return "Feedback{" +
                "id=" + id +
                ", feedbackType=" + feedbackType +
                ", userIp='" + userIp + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}