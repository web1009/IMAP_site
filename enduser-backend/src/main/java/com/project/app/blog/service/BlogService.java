package com.project.app.blog.service;

import com.project.app.blog.dto.BlogDto;
import com.project.app.blog.mapper.BlogMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BlogService {

    private final BlogMapper blogMapper;

    public BlogService(BlogMapper blogMapper) {
        this.blogMapper = blogMapper;
    }

    public List<BlogDto> getBlogList() {
        return blogMapper.selectBlogList();
    }

    @Transactional
    public BlogDto getBlogDetail(Long postId) {
        int updated = blogMapper.increaseViews(postId);
        if (updated == 0) {
            throw new IllegalArgumentException("존재하지 않거나 숨김 처리된 글입니다.");
        }
        BlogDto blog = blogMapper.selectBlogDetail(postId);
        if (blog == null) {
            throw new IllegalArgumentException("존재하지 않거나 숨김 처리된 글입니다.");
        }
        return blog;
    }
}
