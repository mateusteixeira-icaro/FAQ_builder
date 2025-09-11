package com.faq.service;

import com.faq.dto.FeedbackDTO;
import com.faq.model.Faq;
import com.faq.model.Feedback;
import com.faq.repository.FaqRepository;
import com.faq.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class FeedbackService {
    
    @Autowired
    private FeedbackRepository feedbackRepository;
    
    @Autowired
    private FaqRepository faqRepository;
    
    /**
     * Cria ou atualiza feedback
     */
    public FeedbackDTO createOrUpdateFeedback(FeedbackDTO feedbackDTO) {
        // Verificar se o FAQ existe
        Faq faq = faqRepository.findById(feedbackDTO.getFaqId())
                .orElseThrow(() -> new IllegalArgumentException("FAQ não encontrado com ID: " + feedbackDTO.getFaqId()));
        
        // Verificar se já existe feedback do mesmo IP para este FAQ
        Optional<Feedback> existingFeedback = feedbackRepository.findByFaqIdAndUserIp(
                feedbackDTO.getFaqId(), feedbackDTO.getUserIp());
        
        Feedback feedback;
        if (existingFeedback.isPresent()) {
            // Atualizar feedback existente
            feedback = existingFeedback.get();
            feedback.setFeedbackType(feedbackDTO.getFeedbackType());
        } else {
            // Criar novo feedback
            feedback = convertToEntity(feedbackDTO);
            feedback.setFaq(faq);
        }
        
        Feedback savedFeedback = feedbackRepository.save(feedback);
        return convertToDTO(savedFeedback);
    }
    
    /**
     * Busca feedbacks por FAQ
     */
    @Transactional(readOnly = true)
    public List<FeedbackDTO> getFeedbacksByFaq(Long faqId) {
        return feedbackRepository.findByFaqId(faqId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Busca estatísticas de feedback por FAQ
     */
    @Transactional(readOnly = true)
    public Map<String, Long> getFeedbackStats(Long faqId) {
        Map<String, Long> stats = new HashMap<>();
        stats.put("positive", feedbackRepository.countPositiveFeedbacksByFaqId(faqId));
        stats.put("negative", feedbackRepository.countNegativeFeedbacksByFaqId(faqId));
        stats.put("total", feedbackRepository.countByFaqId(faqId));
        return stats;
    }
    
    /**
     * Verifica se usuário já deu feedback para o FAQ
     */
    @Transactional(readOnly = true)
    public Optional<FeedbackDTO> getUserFeedback(Long faqId, String userIp) {
        System.out.println("Fetching user feedback for FAQ ID: " + faqId + " and User IP: " + userIp);
        Optional<Feedback> feedback = feedbackRepository.findByFaqIdAndUserIp(faqId, userIp);
        if (feedback.isPresent()) {
            System.out.println("Feedback found: " + feedback.get());
        } else {
            System.out.println("No feedback found for the given FAQ ID and User IP.");
        }
        return feedback.map(this::convertToDTO);
    }
    
    /**
     * Remove feedback
     */
    public void deleteFeedback(Long feedbackId) {
        if (!feedbackRepository.existsById(feedbackId)) {
            throw new IllegalArgumentException("Feedback não encontrado com ID: " + feedbackId);
        }
        feedbackRepository.deleteById(feedbackId);
    }
    
    /**
     * Remove todos os feedbacks de um FAQ
     */
    public void deleteFeedbacksByFaq(Long faqId) {
        feedbackRepository.deleteByFaqId(faqId);
    }
    
    /**
     * Busca estatísticas gerais de feedback para o painel administrativo
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getAdminFeedbackStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Estatísticas gerais
        long totalFeedbacks = feedbackRepository.count();
        long totalPositive = feedbackRepository.countByFeedbackType(Feedback.FeedbackType.POSITIVE);
        long totalNegative = feedbackRepository.countByFeedbackType(Feedback.FeedbackType.NEGATIVE);
        
        stats.put("totalFeedbacks", totalFeedbacks);
        stats.put("totalPositive", totalPositive);
        stats.put("totalNegative", totalNegative);
        
        // FAQs mais curtidos (top 10)
        List<Object[]> mostLiked = feedbackRepository.findMostLikedFaqs();
        stats.put("mostLiked", mostLiked);
        
        // FAQs menos curtidos (top 10)
        List<Object[]> leastLiked = feedbackRepository.findLeastLikedFaqs();
        stats.put("leastLiked", leastLiked);
        
        return stats;
    }
    
    /**
     * Converte Entity para DTO
     */
    private FeedbackDTO convertToDTO(Feedback feedback) {
        FeedbackDTO dto = new FeedbackDTO();
        dto.setId(feedback.getId());
        dto.setFaqId(feedback.getFaq().getId());
        dto.setFeedbackType(feedback.getFeedbackType());
        dto.setUserIp(feedback.getUserIp());
        dto.setCreatedAt(feedback.getCreatedAt());
        return dto;
    }
    
    /**
     * Converte DTO para Entity
     */
    private Feedback convertToEntity(FeedbackDTO dto) {
        Feedback feedback = new Feedback();
        feedback.setFeedbackType(dto.getFeedbackType());
        feedback.setUserIp(dto.getUserIp());
        return feedback;
    }
}