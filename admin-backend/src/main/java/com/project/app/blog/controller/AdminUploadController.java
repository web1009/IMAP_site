package com.project.app.blog.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/upload")
public class AdminUploadController {

    @Value("${app.upload.dir:${user.dir}/uploads}")
    private String uploadDir;

    /**
     * 이미지 업로드 (IMAP 본문 삽입용)
     * - 저장 경로: app.upload.dir
     * - 반환: { "url": "/uploads/파일명" } (프론트에서 이 URL을 img src로 사용)
     */
    @PostMapping("/image")
    public ResponseEntity<ImageUploadResponse> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().build();
        }
        try {
            Path dir = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(dir);
            String ext = getExtension(file.getOriginalFilename());
            String filename = UUID.randomUUID().toString() + (ext != null ? "." + ext : "");
            Path target = dir.resolve(filename);
            Files.copy(file.getInputStream(), target);
            String url = "/uploads/" + filename;
            return ResponseEntity.ok(new ImageUploadResponse(url));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return null;
        return filename.substring(filename.lastIndexOf('.') + 1);
    }

    public static class ImageUploadResponse {
        private String url;
        public ImageUploadResponse(String url) { this.url = url; }
        public String getUrl() { return url; }
    }
}
