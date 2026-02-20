package com.project.app.blog.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class BlogDto {

    private Long postId;
    private String title;    // 대제목
    private String subtitle; // 중제목
    private String content;  // 내용 (HTML)
    private Integer views;
    private LocalDateTime createdAt;
}
