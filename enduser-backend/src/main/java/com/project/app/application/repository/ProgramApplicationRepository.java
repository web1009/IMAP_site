package com.project.app.application.repository;

import com.project.app.application.entity.ProgramApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgramApplicationRepository extends JpaRepository<ProgramApplication, Long> {
}
