package com.project.app.blog.controller;

import com.project.app.blog.dto.BlogDto;
import com.project.app.blog.service.BlogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/blog")
public class BlogController {

    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    /**
     * USER IMAP(블로그) 목록 조회
     */
    @GetMapping
    public ResponseEntity<List<BlogDto>> getBlogList() {
        return ResponseEntity.ok(blogService.getBlogList());
    }

    /**
     * USER IMAP(블로그) 상세 조회 (조회수 증가)
     */
    @GetMapping("/{postId}")
    public ResponseEntity<BlogDto> getBlogDetail(@PathVariable("postId") Long postId) {
        return ResponseEntity.ok(blogService.getBlogDetail(postId));
    }
}
