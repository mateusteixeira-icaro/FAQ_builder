package com.faq.dto;

import java.util.List;

public class ViewStatsResponse {
    private List<FaqDTO> faqs;
    private int currentPage;
    private int totalPages;
    private long totalElements;
    private int size;
    private boolean hasNext;
    private boolean hasPrevious;
    
    public ViewStatsResponse() {}
    
    public ViewStatsResponse(List<FaqDTO> faqs, int currentPage, int totalPages, 
                           long totalElements, int size, boolean hasNext, boolean hasPrevious) {
        this.faqs = faqs;
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
        this.size = size;
        this.hasNext = hasNext;
        this.hasPrevious = hasPrevious;
    }
    
    // Getters and Setters
    public List<FaqDTO> getFaqs() {
        return faqs;
    }
    
    public void setFaqs(List<FaqDTO> faqs) {
        this.faqs = faqs;
    }
    
    public int getCurrentPage() {
        return currentPage;
    }
    
    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }
    
    public int getTotalPages() {
        return totalPages;
    }
    
    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }
    
    public long getTotalElements() {
        return totalElements;
    }
    
    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }
    
    public int getSize() {
        return size;
    }
    
    public void setSize(int size) {
        this.size = size;
    }
    
    public boolean isHasNext() {
        return hasNext;
    }
    
    public void setHasNext(boolean hasNext) {
        this.hasNext = hasNext;
    }
    
    public boolean isHasPrevious() {
        return hasPrevious;
    }
    
    public void setHasPrevious(boolean hasPrevious) {
        this.hasPrevious = hasPrevious;
    }
}