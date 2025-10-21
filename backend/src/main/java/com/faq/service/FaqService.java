package com.faq.service;

import com.faq.dto.FaqDTO;
import com.faq.dto.FaqSummaryDTO;
import com.faq.dto.ViewStatsResponse;
import com.faq.model.Category;
import com.faq.model.Faq;
import com.faq.repository.CategoryRepository;
import com.faq.repository.FaqRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class FaqService {
    
    @Autowired
    private FaqRepository faqRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    /**
     * Busca todos os FAQs ativos
     */
    @Transactional(readOnly = true)
    public List<FaqDTO> findAllActive() {
        return faqRepository.findByIsActiveTrueOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Busca FAQ por ID
     */
    @Transactional(readOnly = true)
    public Optional<FaqDTO> findById(Long id) {
        return faqRepository.findById(id)
                .map(this::convertToDTO);
    }
    
    /**
     * Busca FAQ por ID e incrementa visualizações
     */
    public Optional<FaqDTO> findByIdAndIncrementViews(Long id) {
        Optional<Faq> faqOpt = faqRepository.findById(id);
        if (faqOpt.isPresent() && faqOpt.get().getIsActive()) {
            faqRepository.incrementViewCount(id);
            // Recarregar para obter o viewCount atualizado
            return faqRepository.findById(id).map(this::convertToDTO);
        }
        return Optional.empty();
    }
    
    /**
     * Busca FAQs por categoria
     */
    @Transactional(readOnly = true)
    public List<FaqDTO> findByCategory(Long categoryId) {
        return faqRepository.findByCategoryIdAndIsActiveTrueOrderByCreatedAtDesc(categoryId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Busca FAQs por termo de pesquisa
     */
    @Transactional(readOnly = true)
    public List<FaqDTO> searchFaqs(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return findAllActive();
        }
        
        return faqRepository.searchActiveFaqs(searchTerm.trim())
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Busca FAQs por categoria e termo de pesquisa
     */
    @Transactional(readOnly = true)
    public List<FaqDTO> searchFaqsByCategory(Long categoryId, String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return findByCategory(categoryId);
        }
        
        return faqRepository.searchActiveFaqsByCategory(categoryId, searchTerm.trim())
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Busca FAQs mais visualizados
     */
    @Transactional(readOnly = true)
    public List<FaqDTO> findMostViewed(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return faqRepository.findMostViewedActiveFaqs()
                .stream()
                .limit(limit)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Busca FAQs mais visualizados com paginação (apenas FAQs com visualizações > 0)
     */
    @Transactional(readOnly = true)
    public ViewStatsResponse findMostViewedWithPagination(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("viewCount").descending().and(Sort.by("createdAt").descending()));
        Page<Faq> faqPage = faqRepository.findByIsActiveTrueAndViewCountGreaterThanZeroOrderByViewCountDescCreatedAtDesc(pageable);
        
        List<FaqDTO> faqs = faqPage.getContent()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return new ViewStatsResponse(
                faqs,
                faqPage.getNumber(),
                faqPage.getTotalPages(),
                faqPage.getTotalElements(),
                faqPage.getSize(),
                faqPage.hasNext(),
                faqPage.hasPrevious()
        );
    }
    
    /**
     * Busca FAQs mais recentes
     */
    @Transactional(readOnly = true)
    public List<FaqDTO> findRecent(int limit) {
        return faqRepository.findRecentActiveFaqs()
                .stream()
                .limit(limit)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Busca FAQs relacionados
     */
    @Transactional(readOnly = true)
    public List<FaqSummaryDTO> findRelated(Long faqId, int limit) {
        Optional<Faq> faqOpt = faqRepository.findById(faqId);
        if (faqOpt.isEmpty()) {
            return List.of();
        }
        
        Faq faq = faqOpt.get();
        return faqRepository.findRelatedFaqs(faq.getCategory().getId(), faqId)
                .stream()
                .limit(limit)
                .map(this::convertToSummaryDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Cria novo FAQ
     */
    public FaqDTO create(FaqDTO faqDTO) {
        // Validar se a categoria existe
        Category category = categoryRepository.findById(faqDTO.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada com ID: " + faqDTO.getCategoryId()));
        
        // Validar se já existe FAQ com a mesma pergunta
        if (faqRepository.existsByQuestionIgnoreCaseAndIsActiveTrue(faqDTO.getQuestion())) {
            throw new IllegalArgumentException("Já existe um FAQ ativo com esta pergunta");
        }
        
        Faq faq = convertToEntity(faqDTO);
        faq.setCategory(category);
        
        Faq savedFaq = faqRepository.save(faq);
        return convertToDTO(savedFaq);
    }
    
    /**
     * Atualiza FAQ existente
     */
    public FaqDTO update(Long id, FaqDTO faqDTO) {
        Faq existingFaq = faqRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("FAQ não encontrado com ID: " + id));
        
        // Validar se a categoria existe
        Category category = categoryRepository.findById(faqDTO.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada com ID: " + faqDTO.getCategoryId()));
        
        existingFaq.setQuestion(faqDTO.getQuestion());
        existingFaq.setAnswer(faqDTO.getAnswer());
        existingFaq.setCategory(category);
        if (faqDTO.getIsActive() != null) {
            existingFaq.setIsActive(faqDTO.getIsActive());
        }
        
        Faq updatedFaq = faqRepository.save(existingFaq);
        return convertToDTO(updatedFaq);
    }
    
    /**
     * Ativa/desativa FAQ
     */
    public void updateActiveStatus(Long id, Boolean isActive) {
        if (!faqRepository.existsById(id)) {
            throw new IllegalArgumentException("FAQ não encontrado com ID: " + id);
        }
        
        faqRepository.updateActiveStatus(id, isActive);
    }
    
    /**
     * Remove FAQ
     */
    public void delete(Long id) {
        if (!faqRepository.existsById(id)) {
            throw new IllegalArgumentException("FAQ não encontrado com ID: " + id);
        }
        
        faqRepository.deleteById(id);
    }
    
    /**
     * Converte Entity para DTO
     */
    private FaqDTO convertToDTO(Faq faq) {
        FaqDTO dto = new FaqDTO();
        dto.setId(faq.getId());
        dto.setQuestion(faq.getQuestion());
        dto.setAnswer(faq.getAnswer());
        dto.setViewCount(faq.getViewCount());
        dto.setIsActive(faq.getIsActive());
        dto.setPriority(faq.getPriority());
        dto.setCreatedAt(faq.getCreatedAt());
        dto.setUpdatedAt(faq.getUpdatedAt());
        dto.setCategoryId(faq.getCategory().getId());
        dto.setCategoryName(faq.getCategory().getName());
        return dto;
    }
    
    /**
     * Converte Entity para SummaryDTO
     */
    private FaqSummaryDTO convertToSummaryDTO(Faq faq) {
        return new FaqSummaryDTO(
                faq.getId(),
                faq.getQuestion(),
                faq.getViewCount(),
                faq.getIsActive(),
                faq.getCreatedAt(),
                faq.getUpdatedAt()
        );
    }
    
    /**
     * Converte DTO para Entity
     */
    private Faq convertToEntity(FaqDTO dto) {
        Faq faq = new Faq();
        faq.setQuestion(dto.getQuestion());
        faq.setAnswer(dto.getAnswer());
        if (dto.getIsActive() != null) {
            faq.setIsActive(dto.getIsActive());
        }
        if (dto.getPriority() != null) {
            faq.setPriority(dto.getPriority());
        }
        return faq;
    }
}