package com.example.estagioja.estagioja.repository;

import com.example.estagioja.estagioja.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {

}
