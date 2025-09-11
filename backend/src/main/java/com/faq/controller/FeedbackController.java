package com.faq.controller;

import com.faq.dto.FeedbackDTO;
import com.faq.service.FeedbackService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/feedback")
@CrossOrigin(origins = "http://localhost:3000")
public class FeedbackController {
    
    @Autowired
    private FeedbackService feedbackService;
    
    /**
     * Cria ou atualiza feedback
     */
    @PostMapping
    public ResponseEntity<?> createOrUpdateFeedback(
            @Valid @RequestBody FeedbackDTO feedbackDTO,
            HttpServletRequest request) {
        try {
            // Capturar IP do usuário
            String userIp = getClientIpAddress(request);
            feedbackDTO.setUserIp(userIp);
            
            FeedbackDTO savedFeedback = feedbackService.createOrUpdateFeedback(feedbackDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedFeedback);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Erro interno do servidor"));
        }
    }
    
    /**
     * Busca feedbacks por FAQ
     */
    @GetMapping("/faq/{faqId}")
    public ResponseEntity<List<FeedbackDTO>> getFeedbacksByFaq(@PathVariable Long faqId) {
        List<FeedbackDTO> feedbacks = feedbackService.getFeedbacksByFaq(faqId);
        return ResponseEntity.ok(feedbacks);
    }
    
    /**
     * Busca estatísticas de feedback por FAQ
     */
    @GetMapping("/faq/{faqId}/stats")
    public ResponseEntity<Map<String, Long>> getFeedbackStats(@PathVariable Long faqId) {
        Map<String, Long> stats = feedbackService.getFeedbackStats(faqId);
        return ResponseEntity.ok(stats);
    }
    
    /**
     * Verifica se usuário já deu feedback para o FAQ
     */
    @GetMapping("/faq/{faqId}/user")
    public ResponseEntity<?> getUserFeedback(
            @PathVariable Long faqId,
            HttpServletRequest request) {
        String userIp = getClientIpAddress(request);
        Optional<FeedbackDTO> feedback = feedbackService.getUserFeedback(faqId, userIp);
        
        if (feedback.isPresent()) {
            return ResponseEntity.ok(feedback.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Remove feedback
     */
    @DeleteMapping("/{feedbackId}")
    public ResponseEntity<?> deleteFeedback(@PathVariable Long feedbackId) {
        try {
            feedbackService.deleteFeedback(feedbackId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Erro interno do servidor"));
        }
    }
    
    /**
     * Remove todos os feedbacks de um FAQ
     */
    @DeleteMapping("/faq/{faqId}")
    public ResponseEntity<?> deleteFeedbacksByFaq(@PathVariable Long faqId) {
        try {
            feedbackService.deleteFeedbacksByFaq(faqId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Erro interno do servidor"));
        }
    }
    
    /**
     * Busca estatísticas gerais de feedback para o painel administrativo
     */
    @GetMapping("/admin/stats")
    public ResponseEntity<Map<String, Object>> getAdminFeedbackStats() {
        Map<String, Object> stats = feedbackService.getAdminFeedbackStats();
        return ResponseEntity.ok(stats);
    }
    
    /**
     * Extrai o IP do cliente da requisição
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedForHeader = request.getHeader("X-Forwarded-For");
        if (xForwardedForHeader == null) {
            return request.getRemoteAddr();
        } else {
            // X-Forwarded-For pode conter múltiplos IPs, pegar o primeiro
            return xForwardedForHeader.split(",")[0].trim();
        }
    }
    
    /**
     * Classe para resposta de erro
     */
    public static class ErrorResponse {
        private String message;
        private long timestamp;
        
        public ErrorResponse(String message) {
            this.message = message;
            this.timestamp = System.currentTimeMillis();
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
        
        public long getTimestamp() {
            return timestamp;
        }
        
        public void setTimestamp(long timestamp) {
            this.timestamp = timestamp;
        }
    }
}