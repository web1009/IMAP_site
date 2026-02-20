package com.project.app.blog.mapper;

import com.project.app.notice.dto.NoticeDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminBlogMapper {

    List<NoticeDto> selectBlogList();

    NoticeDto selectBlogDetail(@Param("postId") Long postId);

    int insertBlog(NoticeDto dto);

    int updateBlog(NoticeDto dto);

    int updateVisible(
            @Param("postId") Long postId,
            @Param("visible") boolean visible
    );

    int deleteBlog(@Param("postId") Long postId);
}
