package com.project.app.application.entity;

import com.project.app.aspect.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "PROGRAM_APPLICATION", indexes = {
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_reg_dt", columnList = "reg_dt")
})
public class ProgramApplication extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id", nullable = false)
    private Long applicationId;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "phone", nullable = false, length = 20)
    private String phone;

    @Column(name = "program", nullable = false, length = 100)
    private String program;

    @Column(name = "motivation", columnDefinition = "TEXT")
    private String motivation;

    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private String status = "PENDING";
}
