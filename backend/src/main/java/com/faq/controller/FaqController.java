package com.faq.controller;

import com.faq.dto.FaqDTO;
import com.faq.dto.FaqSummaryDTO;
import com.faq.dto.ViewStatsResponse;
import com.faq.service.FaqService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/faqs")
@CrossOrigin(origins = "http://localhost:3000")
public class FaqController {
    
    @Autowired
    private FaqService faqService;
    
    /**
     * Lista todos os FAQs ativos
     */
    @GetMapping
    public ResponseEntity<List<FaqDTO>> getAllActiveFaqs() {
        List<FaqDTO> faqs = faqService.findAllActive();
        return ResponseEntity.ok(faqs);
    }
    
    /**
     * Busca estatísticas de visualizações dos FAQs com paginação
     */
    @GetMapping("/views")
    public ResponseEntity<ViewStatsResponse> getViewsWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        ViewStatsResponse response = faqService.findMostViewedWithPagination(page, size);
        return ResponseEntity.ok(response);
    }

    /**
     * Busca FAQ por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<FaqDTO> getFaqById(@PathVariable Long id) {
        Optional<FaqDTO> faq = faqService.findById(id);
        return faq.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Busca FAQ por ID e incrementa visualizações
     */
    @GetMapping("/{id}/view")
    public ResponseEntity<FaqDTO> viewFaq(@PathVariable Long id) {
        Optional<FaqDTO> faq = faqService.findByIdAndIncrementViews(id);
        return faq.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Lista FAQs por categoria
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<FaqDTO>> getFaqsByCategory(@PathVariable Long categoryId) {
        List<FaqDTO> faqs = faqService.findByCategory(categoryId);
        return ResponseEntity.ok(faqs);
    }
    
    /**
     * Busca FAQs por termo
     */
    @GetMapping("/search")
    public ResponseEntity<List<FaqDTO>> searchFaqs(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Long categoryId) {
        
        List<FaqDTO> faqs;
        if (categoryId != null) {
            faqs = faqService.searchFaqsByCategory(categoryId, q);
        } else {
            faqs = faqService.searchFaqs(q);
        }
        
        return ResponseEntity.ok(faqs);
    }
    
    /**
     * Lista FAQs mais visualizados
     */
    @GetMapping("/most-viewed")
    public ResponseEntity<List<FaqDTO>> getMostViewedFaqs(
            @RequestParam(defaultValue = "10") int limit) {
        List<FaqDTO> faqs = faqService.findMostViewed(limit);
        return ResponseEntity.ok(faqs);
    }
    
    /**
     * Busca estatísticas de visualizações dos FAQs
     */
    @GetMapping("/view-stats")
    public ResponseEntity<List<FaqDTO>> getViewStats(
            @RequestParam(defaultValue = "10") int limit) {
        List<FaqDTO> faqs = faqService.findMostViewed(limit);
        return ResponseEntity.ok(faqs);
    }
    
    /**
     * Lista FAQs mais recentes
     */
    @GetMapping("/recent")
    public ResponseEntity<List<FaqDTO>> getRecentFaqs(
            @RequestParam(defaultValue = "10") int limit) {
        List<FaqDTO> faqs = faqService.findRecent(limit);
        return ResponseEntity.ok(faqs);
    }
    
    /**
     * Lista FAQs relacionados
     */
    @GetMapping("/{id}/related")
    public ResponseEntity<List<FaqSummaryDTO>> getRelatedFaqs(
            @PathVariable Long id,
            @RequestParam(defaultValue = "5") int limit) {
        List<FaqSummaryDTO> relatedFaqs = faqService.findRelated(id, limit);
        return ResponseEntity.ok(relatedFaqs);
    }
    
    /**
     * Cria novo FAQ
     */
    @PostMapping
    public ResponseEntity<?> createFaq(@Valid @RequestBody FaqDTO faqDTO) {
        try {
            FaqDTO createdFaq = faqService.create(faqDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdFaq);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Erro interno do servidor"));
        }
    }
    
    /**
     * Atualiza FAQ existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateFaq(
            @PathVariable Long id,
            @Valid @RequestBody FaqDTO faqDTO) {
        try {
            FaqDTO updatedFaq = faqService.update(id, faqDTO);
            return ResponseEntity.ok(updatedFaq);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Erro interno do servidor"));
        }
    }
    
    /**
     * Ativa/desativa FAQ
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateFaqStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request) {
        try {
            faqService.updateActiveStatus(id, request.isActive);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Erro interno do servidor"));
        }
    }
    
    /**
     * Remove FAQ
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFaq(@PathVariable Long id) {
        try {
            faqService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Erro interno do servidor"));
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
    
    /**
     * Classe para requisição de atualização de status
     */
    public static class StatusUpdateRequest {
        private Boolean isActive;
        
        public Boolean getIsActive() {
            return isActive;
        }
        
        public void setIsActive(Boolean isActive) {
            this.isActive = isActive;
        }
    }
}