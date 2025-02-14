package com.example.estagioja.estagioja.specification;

import com.example.estagioja.estagioja.entity.Category;
import com.example.estagioja.estagioja.entity.Company;
import com.example.estagioja.estagioja.entity.Job;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class JobSpecification {

    public static Specification<Job> hasTitulo(String titulo) {
        return (root, query, criteriaBuilder) ->
                titulo != null ? criteriaBuilder.like(criteriaBuilder.lower(root.get("titulo")), "%" + titulo.toLowerCase() + "%") : null;
    }

    public static Specification<Job> hasCategory(Category category) {
        return (root, query, criteriaBuilder) ->
                category != null ? criteriaBuilder.equal(root.get("category"), category) : null;
    }

    public static Specification<Job> hasCompany(Company company) {
        return (root, query, criteriaBuilder) ->
                company != null ? criteriaBuilder.equal(root.get("company"), company) : null;
    }

    public static Specification<Job> hasMinSalario(Integer minSalario) {
        return (root, query, criteriaBuilder) ->
                minSalario > 0 ? criteriaBuilder.greaterThanOrEqualTo(root.get("salario"), minSalario) : null;
    }

    public static Specification<Job> hasMaxSalario(Integer maxSalario) {
        return (root, query, criteriaBuilder) ->
                maxSalario > 0 ? criteriaBuilder.lessThanOrEqualTo(root.get("salario"), maxSalario) : null;
    }

    public static Specification<Job> hasCategories(List<Category> categories) {
        return (root, query, criteriaBuilder) -> {
            if (categories == null || categories.isEmpty()) {
                return null;
            }
            return root.get("category").in(categories);
        };
    }
}
