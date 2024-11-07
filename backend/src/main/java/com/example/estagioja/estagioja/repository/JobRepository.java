package com.example.estagioja.estagioja.repository;

import com.example.estagioja.estagioja.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface JobRepository extends JpaRepository<Job, UUID> {

}
