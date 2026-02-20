package com.project.app.application.mapper;

import com.project.app.application.domain.ProgramApplication;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface AdminApplicationMapper {

    List<ProgramApplication> findAll();
}
