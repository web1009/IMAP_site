package com.project.app.blog.mapper;

import com.project.app.blog.dto.BlogDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BlogMapper {

    /**
     * USER IMAP(블로그) 목록 조회
     * - post_type = BLOG
     * - is_visible = true
     * - 최신순
     */
    List<BlogDto> selectBlogList();

    /**
     * USER IMAP(블로그) 상세 조회
     * - is_visible = true
     */
    BlogDto selectBlogDetail(@Param("postId") Long postId);

    /**
     * 조회수 증가
     */
    int increaseViews(@Param("postId") Long postId);
}
