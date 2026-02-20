package com.project.app.blog.controller;

import com.project.app.notice.dto.NoticeDto;
import com.project.app.blog.service.AdminBlogService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/blog")
public class AdminBlogController {

    private final AdminBlogService adminBlogService;

    public AdminBlogController(AdminBlogService adminBlogService) {
        this.adminBlogService = adminBlogService;
    }

    @GetMapping
    public List<NoticeDto> getBlogList() {
        return adminBlogService.getBlogList();
    }

    @GetMapping("/{postId}")
    public NoticeDto getBlogDetail(@PathVariable("postId") Long postId) {
        return adminBlogService.getBlogDetail(postId);
    }

    @PostMapping
    public NoticeDto createBlog(@RequestBody NoticeDto dto) {
        adminBlogService.createBlog(dto);
        return dto;
    }

    @PutMapping("/{postId}")
    public void updateBlog(@PathVariable("postId") Long postId, @RequestBody NoticeDto dto) {
        dto.setPostId(postId);
        adminBlogService.updateBlog(dto);
    }

    @PutMapping("/{postId}/visible")
    public void updateVisible(@PathVariable("postId") Long postId, @RequestParam("visible") boolean visible) {
        adminBlogService.updateVisible(postId, visible);
    }

    @DeleteMapping("/{postId}")
    public void deleteBlog(@PathVariable("postId") Long postId) {
        adminBlogService.deleteBlog(postId);
    }
}
