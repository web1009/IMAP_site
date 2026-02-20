package com.project.app.blog.service;

import com.project.app.notice.dto.NoticeDto;
import com.project.app.blog.mapper.AdminBlogMapper;
import com.project.app.userAdmin.repository.UserAdminRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
public class AdminBlogService {

    private final AdminBlogMapper adminBlogMapper;
    private final UserAdminRepository userAdminRepository;

    public AdminBlogService(AdminBlogMapper adminBlogMapper, UserAdminRepository userAdminRepository) {
        this.adminBlogMapper = adminBlogMapper;
        this.userAdminRepository = userAdminRepository;
    }

    public List<NoticeDto> getBlogList() {
        return adminBlogMapper.selectBlogList();
    }

    public NoticeDto getBlogDetail(Long postId) {
        return adminBlogMapper.selectBlogDetail(postId);
    }

    @Transactional
    public void createBlog(NoticeDto dto) {
        dto.setPostType("BLOG");
        dto.setWriterType("ADMIN");
        dto.setViews(0);
        dto.setIsVisible(true);

        if (dto.getWriterId() == null || dto.getWriterId().trim().isEmpty()) {
            List<com.project.app.userAdmin.entity.UserAdmin> admins = userAdminRepository.findAll();
            if (admins != null && !admins.isEmpty()) {
                dto.setWriterId(admins.get(0).getUserId());
            } else {
                dto.setWriterId("admin@naver.com");
            }
        }

        if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()
                || dto.getContent() == null || dto.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("필수값 누락 (title, content)");
        }

        int result = adminBlogMapper.insertBlog(dto);
        if (result <= 0) {
            throw new RuntimeException("블로그 등록에 실패했습니다.");
        }
    }

    @Transactional
    public void updateBlog(NoticeDto dto) {
        dto.setPostType("BLOG");
        adminBlogMapper.updateBlog(dto);
    }

    @Transactional
    public void updateVisible(Long postId, boolean visible) {
        adminBlogMapper.updateVisible(postId, visible);
    }

    @Transactional
    public void deleteBlog(Long postId) {
        adminBlogMapper.deleteBlog(postId);
    }
}
