package com.faq.service;

import com.faq.dto.CategoryDTO;
import com.faq.model.Category;
import com.faq.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryService {
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    /**
     * Busca todas as categorias
     */
    @Transactional(readOnly = true)
    public List<CategoryDTO> findAll() {
        return categoryRepository.findAllByOrderByNameAsc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Busca categoria por ID
     */
    @Transactional(readOnly = true)
    public Optional<CategoryDTO> findById(Long id) {
        return categoryRepository.findById(id)
                .map(this::convertToDTO);
    }
    
    /**
     * Busca categorias com FAQs ativos
     */
    @Transactional(readOnly = true)
    public List<CategoryDTO> findCategoriesWithActiveFaqs() {
        return categoryRepository.findCategoriesWithActiveFaqs()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Busca categorias por termo de pesquisa
     */
    @Transactional(readOnly = true)
    public List<CategoryDTO> searchCategories(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return findAll();
        }
        
        return categoryRepository.findByNameOrDescriptionContainingIgnoreCase(searchTerm.trim())
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Cria nova categoria
     */
    public CategoryDTO create(CategoryDTO categoryDTO) {
        // Validar se já existe categoria com o mesmo nome
        if (categoryRepository.existsByNameIgnoreCase(categoryDTO.getName())) {
            throw new IllegalArgumentException("Já existe uma categoria com este nome");
        }
        
        Category category = convertToEntity(categoryDTO);
        Category savedCategory = categoryRepository.save(category);
        return convertToDTO(savedCategory);
    }
    
    /**
     * Atualiza categoria existente
     */
    public CategoryDTO update(Long id, CategoryDTO categoryDTO) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada com ID: " + id));
        
        // Validar se já existe outra categoria com o mesmo nome
        Optional<Category> categoryWithSameName = categoryRepository.findByNameIgnoreCase(categoryDTO.getName());
        if (categoryWithSameName.isPresent() && !categoryWithSameName.get().getId().equals(id)) {
            throw new IllegalArgumentException("Já existe uma categoria com este nome");
        }
        
        existingCategory.setName(categoryDTO.getName());
        existingCategory.setDescription(categoryDTO.getDescription());
        
        Category updatedCategory = categoryRepository.save(existingCategory);
        return convertToDTO(updatedCategory);
    }
    
    /**
     * Remove categoria
     */
    public void delete(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada com ID: " + id));
        
        // Verificar se a categoria tem FAQs associados
        if (!category.getFaqs().isEmpty()) {
            throw new IllegalStateException("Não é possível excluir categoria que possui FAQs associados");
        }
        
        categoryRepository.delete(category);
    }
    
    /**
     * Verifica se categoria existe
     */
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return categoryRepository.existsById(id);
    }
    
    /**
     * Converte Entity para DTO
     */
    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        dto.setDisplayOrder(category.getDisplayOrder());
        dto.setCreatedAt(category.getCreatedAt());
        dto.setUpdatedAt(category.getUpdatedAt());
        return dto;
    }
    
    /**
     * Converte DTO para Entity
     */
    private Category convertToEntity(CategoryDTO dto) {
        Category category = new Category();
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        category.setDisplayOrder(dto.getDisplayOrder());
        return category;
    }
}