package com.faq.repository;

import com.faq.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    
    /**
     * Busca feedbacks por FAQ
     */
    List<Feedback> findByFaqId(Long faqId);
    
    /**
     * Conta feedbacks positivos por FAQ
     */
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.faq.id = :faqId AND f.feedbackType = com.faq.model.Feedback$FeedbackType.POSITIVE")
    Long countPositiveFeedbacksByFaqId(@Param("faqId") Long faqId);
    
    /**
     * Conta feedbacks negativos por FAQ
     */
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.faq.id = :faqId AND f.feedbackType = com.faq.model.Feedback$FeedbackType.NEGATIVE")
    Long countNegativeFeedbacksByFaqId(@Param("faqId") Long faqId);
    
    /**
     * Conta total de feedbacks por FAQ
     */
    Long countByFaqId(Long faqId);
    
    /**
     * Verifica se já existe feedback do mesmo IP para o FAQ
     */
    boolean existsByFaqIdAndUserIp(Long faqId, String userIp);
    
    /**
     * Busca feedback por FAQ e IP do usuário
     */
    Optional<Feedback> findByFaqIdAndUserIp(Long faqId, String userIp);
    
    /**
     * Busca feedbacks por tipo
     */
    List<Feedback> findByFeedbackType(Feedback.FeedbackType feedbackType);
    
    /**
     * Busca feedbacks por FAQ e tipo
     */
    List<Feedback> findByFaqIdAndFeedbackType(Long faqId, Feedback.FeedbackType feedbackType);
    
    /**
     * Remove todos os feedbacks de um FAQ
     */
    void deleteByFaqId(Long faqId);
    
    /**
     * Conta feedbacks por tipo
     */
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.feedbackType = :feedbackType")
    Long countByFeedbackType(@Param("feedbackType") Feedback.FeedbackType feedbackType);
    
    /**
     * Busca FAQs mais curtidos (com mais feedbacks positivos)
     */
    @Query("SELECT f.faq.id, f.faq.question, COUNT(f) as positiveCount " +
           "FROM Feedback f " +
           "WHERE f.feedbackType = com.faq.model.Feedback$FeedbackType.POSITIVE " +
           "GROUP BY f.faq.id, f.faq.question " +
           "ORDER BY positiveCount DESC")
    List<Object[]> findMostLikedFaqs();
    
    /**
     * Busca FAQs menos curtidos (com mais feedbacks negativos)
     */
    @Query("SELECT f.faq.id, f.faq.question, COUNT(f) as negativeCount " +
           "FROM Feedback f " +
           "WHERE f.feedbackType = com.faq.model.Feedback$FeedbackType.NEGATIVE " +
           "GROUP BY f.faq.id, f.faq.question " +
           "ORDER BY negativeCount DESC")
    List<Object[]> findLeastLikedFaqs();
}