package com.faq.repository;

import com.faq.model.Faq;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface FaqRepository extends JpaRepository<Faq, Long> {
    
    /**
     * Busca FAQs por categoria
     */
    List<Faq> findByCategoryIdOrderByCreatedAtDesc(Long categoryId);
    
    /**
     * Busca FAQs ativos por categoria
     */
    List<Faq> findByCategoryIdAndIsActiveTrueOrderByCreatedAtDesc(Long categoryId);
    
    /**
     * Busca todos os FAQs ativos
     */
    List<Faq> findByIsActiveTrueOrderByCreatedAtDesc();
    
    /**
     * Busca FAQs por texto na pergunta ou resposta
     */
    @Query("SELECT f FROM Faq f WHERE " +
           "(LOWER(f.question) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(f.answer) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "AND f.isActive = true " +
           "ORDER BY f.createdAt DESC")
    List<Faq> searchActiveFaqs(@Param("searchTerm") String searchTerm);
    
    /**
     * Busca FAQs por categoria e texto
     */
    @Query("SELECT f FROM Faq f WHERE " +
           "f.category.id = :categoryId AND " +
           "(LOWER(f.question) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(f.answer) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "AND f.isActive = true " +
           "ORDER BY f.createdAt DESC")
    List<Faq> searchActiveFaqsByCategory(@Param("categoryId") Long categoryId, @Param("searchTerm") String searchTerm);
    
    /**
     * Busca FAQs mais visualizados
     */
    @Query("SELECT f FROM Faq f WHERE f.isActive = true " +
           "ORDER BY f.viewCount DESC, f.createdAt DESC")
    List<Faq> findMostViewedActiveFaqs();
    
    /**
     * Busca FAQs ativos ordenados por view_count com paginação
     */
    Page<Faq> findByIsActiveTrueOrderByViewCountDescCreatedAtDesc(Pageable pageable);
    
    /**
     * Busca FAQs ativos com visualizações (view_count > 0) ordenados por view_count com paginação
     */
    @Query("SELECT f FROM Faq f WHERE f.isActive = true AND f.viewCount > 0 " +
           "ORDER BY f.viewCount DESC, f.createdAt DESC")
    Page<Faq> findByIsActiveTrueAndViewCountGreaterThanZeroOrderByViewCountDescCreatedAtDesc(Pageable pageable);
    
    /**
     * Busca FAQs mais recentes
     */
    @Query("SELECT f FROM Faq f WHERE f.isActive = true " +
           "ORDER BY f.createdAt DESC")
    List<Faq> findRecentActiveFaqs();
    
    /**
     * Incrementa o contador de visualizações
     */
    @Modifying
    @Transactional
    @Query("UPDATE Faq f SET f.viewCount = f.viewCount + 1 WHERE f.id = :id")
    void incrementViewCount(@Param("id") Long id);
    
    /**
     * Ativa/desativa FAQ
     */
    @Modifying
    @Transactional
    @Query("UPDATE Faq f SET f.isActive = :isActive WHERE f.id = :id")
    void updateActiveStatus(@Param("id") Long id, @Param("isActive") Boolean isActive);
    
    /**
     * Conta FAQs ativos por categoria
     */
    @Query("SELECT COUNT(f) FROM Faq f WHERE f.category.id = :categoryId AND f.isActive = true")
    Long countActiveFaqsByCategory(@Param("categoryId") Long categoryId);
    
    /**
     * Busca FAQ por ID e categoria
     */
    Optional<Faq> findByIdAndCategoryId(Long id, Long categoryId);
    
    /**
     * Verifica se existe FAQ ativo com a pergunta especificada
     */
    boolean existsByQuestionIgnoreCaseAndIsActiveTrue(String question);
    
    /**
     * Busca FAQs relacionados (por categoria, excluindo o atual)
     */
    @Query("SELECT f FROM Faq f WHERE " +
           "f.category.id = :categoryId AND " +
           "f.id != :excludeId AND " +
           "f.isActive = true " +
           "ORDER BY f.viewCount DESC, f.createdAt DESC")
    List<Faq> findRelatedFaqs(@Param("categoryId") Long categoryId, @Param("excludeId") Long excludeId);
}