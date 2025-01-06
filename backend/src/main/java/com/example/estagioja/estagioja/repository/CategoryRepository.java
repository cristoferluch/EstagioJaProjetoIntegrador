package com.example.estagioja.estagioja.repository;

import com.example.estagioja.estagioja.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {

    boolean existsById(UUID id);
}
