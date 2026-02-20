package com.project.app.userAdmin.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.ColumnDefault;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "USERS_ADMIN")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAdmin {

 @Id
 @Column(name = "user_id", length = 50, nullable = false, unique = true) 
 private String userId;

 @Column(name = "email", length = 255, nullable = false, unique = true) 
 private String email;

 @Column(name = "password", length = 255, nullable = false)
 private String password;

 @Column(name = "user_name", length = 100, nullable = false)
 private String userName;

 @Column(name = "phone_number", length = 20)
 private String phoneNumber; 

 @ColumnDefault("'USER'")
 @Column(name = "role", length = 50, nullable = false)
 private String role;

 @Column(name = "agree_at", nullable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
 private LocalDateTime agreeAt;

 @ColumnDefault("1")
 @Column(name = "is_active", nullable = false, columnDefinition = "TINYINT(1)")
 private Boolean isActive;
	
 @Column(name = "brch_id")
 private Long brchId;

}
