package com.project.app.faq.service;

import com.project.app.faq.dto.FAQDto;
import com.project.app.faq.mapper.AdminFAQMapper;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminFAQService {

    private final AdminFAQMapper adminFAQMapper;

    public AdminFAQService(AdminFAQMapper adminFAQMapper) {
        this.adminFAQMapper = adminFAQMapper;
    }

    @Transactional(readOnly = true)
    public PagedResult<FAQDto> getFAQListPaged(String keyword, Boolean visible, int page) {
        int size = 10;
        int offset = (page - 1) * size;

        List<FAQDto> list =
                adminFAQMapper.selectFAQListPaged(keyword, visible, size, offset);

        int totalCount = adminFAQMapper.selectFAQCount(keyword, visible);
        int totalPages = (int) Math.ceil((double) totalCount / size);

        return new PagedResult<>(list, totalCount, page, totalPages);
    }

    @Transactional(readOnly = true)
    public FAQDto getFAQDetail(Long postId) {
        return adminFAQMapper.selectFAQDetail(postId);
    }

    @Transactional
    public Long createFAQ(FAQDto dto) {
        dto.setPostType("FAQ");
        dto.setWriterType("ADMIN");

        // 현재 로그인한 관리자 ID 설정 (없으면 시스템 기본값)
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String adminId = null;
        
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            adminId = auth.getName();
        }
        
        // writerId가 null이거나 빈 문자열이면 반드시 기본값 설정
        if (adminId == null || adminId.trim().isEmpty()) {
            adminId = "SYSTEM_ADMIN";
        }
        
        // 반드시 writerId 설정 (null 방지)
        dto.setWriterId(adminId);
        
        // 디버깅: writerId가 제대로 설정되었는지 확인
        if (dto.getWriterId() == null) {
            throw new IllegalStateException("writerId cannot be null. adminId was: " + adminId);
        }

        // 기본값 방어 (DB default가 있더라도 null 방지)
        if (dto.getIsVisible() == null) dto.setIsVisible(true);
        if (dto.getPostVisible() == null) dto.setPostVisible(true);

        adminFAQMapper.insertFAQ(dto);
        return dto.getPostId();
    }
    
    @Transactional
    public void updateFAQ(FAQDto dto) {
        adminFAQMapper.updateFAQ(dto);
    }

    @Transactional
    public void updateFAQVisible(Long postId, boolean visible) {
        adminFAQMapper.updateFAQVisible(postId, visible);
    }

    @Transactional
    public void deleteFAQ(Long postId) {
        adminFAQMapper.deleteFAQ(postId);
    }

    public static class PagedResult<T> {
        private final List<T> list;
        private final int totalCount;
        private final int currentPage;
        private final int totalPages;

        public PagedResult(List<T> list, int totalCount, int currentPage, int totalPages) {
            this.list = list;
            this.totalCount = totalCount;
            this.currentPage = currentPage;
            this.totalPages = totalPages;
        }

        public List<T> getList() { return list; }
        public int getTotalCount() { return totalCount; }
        public int getCurrentPage() { return currentPage; }
        public int getTotalPages() { return totalPages; }
    }
}
