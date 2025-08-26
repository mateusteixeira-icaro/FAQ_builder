package com.faq.repository;

import com.faq.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    /**
     * Busca categoria por nome (case insensitive)
     */
    Optional<Category> findByNameIgnoreCase(String name);
    
    /**
     * Verifica se existe categoria com o nome especificado
     */
    boolean existsByNameIgnoreCase(String name);
    
    /**
     * Busca categorias que contenham o texto no nome ou descrição
     */
    @Query("SELECT c FROM Category c WHERE " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Category> findByNameOrDescriptionContainingIgnoreCase(@Param("searchTerm") String searchTerm);
    
    /**
     * Busca todas as categorias ordenadas por nome
     */
    List<Category> findAllByOrderByNameAsc();
    
    /**
     * Busca categorias com FAQs ativos
     */
    @Query("SELECT DISTINCT c FROM Category c " +
           "JOIN c.faqs f " +
           "WHERE f.isActive = true " +
           "ORDER BY c.name ASC")
    List<Category> findCategoriesWithActiveFaqs();
    
    /**
     * Conta o número de FAQs por categoria
     */
    @Query("SELECT c.id, COUNT(f.id) FROM Category c " +
           "LEFT JOIN c.faqs f " +
           "GROUP BY c.id")
    List<Object[]> countFaqsByCategory();
    
    /**
     * Busca categorias com pelo menos um FAQ
     */
    @Query("SELECT DISTINCT c FROM Category c " +
           "WHERE EXISTS (SELECT 1 FROM Faq f WHERE f.category = c) " +
           "ORDER BY c.name ASC")
    List<Category> findCategoriesWithFaqs();
}