package com.example.estagioja.estagioja.service;

import com.example.estagioja.estagioja.controller.category.CreateCategoryDto;
import com.example.estagioja.estagioja.controller.job.FilterJobDto;
import com.example.estagioja.estagioja.controller.job.UpdateJobDto;
import com.example.estagioja.estagioja.controller.job.CreateJobDto;
import com.example.estagioja.estagioja.entity.Category;
import com.example.estagioja.estagioja.entity.Company;
import com.example.estagioja.estagioja.entity.Job;
import com.example.estagioja.estagioja.exception.CategoryException;
import com.example.estagioja.estagioja.exception.JobException;
import com.example.estagioja.estagioja.repository.CompanyRepository;
import com.example.estagioja.estagioja.repository.JobRepository;
import com.example.estagioja.estagioja.specification.JobSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class JobService {

    private final CompanyRepository companyRepository;

    private final JobRepository jobRepository;
    private final CategoryService categoryService;

    @Autowired
    public JobService(JobRepository jobRepository, CompanyRepository companyRepository, CategoryService categoryService) {
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.categoryService = categoryService;
    }

    @Transactional
    public Job createJob(CreateJobDto createJobDto) throws JobException {
        Job entity = buildJobEntity(createJobDto);
        Job jobSaved = this.jobRepository.save(entity);
        return jobSaved;
    }

    public Optional<Job> getJobById(String jobId) throws JobException {
        return Optional.ofNullable(this.jobRepository.findById(UUID.fromString(jobId)).orElseThrow(() -> new JobException("Emprego não encontrado: " + jobId)));
    }

    public Optional<Company> getCompanyById(String companyId) throws JobException {
        return Optional.ofNullable(this.companyRepository.findById(UUID.fromString(companyId)).orElseThrow(() -> new JobException("Empresa não encontrado: " + companyId)));
    }

    private Job buildJobEntity(CreateJobDto createJobDto) throws JobException {
        Instant now = Instant.now();
        Company company = this.getCompanyById(createJobDto.companyId()).orElse(null);
        Category category = null;

        try {
            category = this.categoryService.getCategoryById(createJobDto.category()).orElse(null);
        } catch (IllegalArgumentException $e) {
            category = this.createCategory(createJobDto);
        } catch (CategoryException $e) {
            category = this.createCategory(createJobDto);
        }

        return Job.builder()
                .id(UUID.randomUUID())
                .titulo(createJobDto.titulo())
                .descricao(createJobDto.descricao())
                .salario(createJobDto.salario())
                .category(category)
                .company(company)
                .dataAtualizacao(now)
                .dataInclusao(now)
                .build();
    }

    private Category createCategory(CreateJobDto createJobDto)  throws JobException {
        CreateCategoryDto createCategoryDto = new CreateCategoryDto(createJobDto.category());
        try {
            return this.categoryService.createCategory(createCategoryDto);
        } catch (CategoryException $ex) {
            throw new JobException("Erro ao criar a categoria");
        }
    }

    public List<Job> listJobs(FilterJobDto filterJobDto) {
        Integer minSalario = filterJobDto.minSalario() != null ? filterJobDto.minSalario() : 0;
        Integer maxSalario = filterJobDto.maxSalario() != null ? filterJobDto.maxSalario() : Integer.MAX_VALUE;

        Optional<Category> category = Optional.empty();
        if (filterJobDto.category() != null && ! filterJobDto.category().isEmpty()) {
            try {
                category = this.categoryService.getCategoryById(filterJobDto.category());
            } catch (CategoryException categoryException) {
                category = Optional.empty();
            }
        }

        Optional<Company> company = Optional.empty();
        if (filterJobDto.companyId() != null && ! filterJobDto.companyId().isEmpty()) {
            try {
                company = this.getCompanyById(filterJobDto.companyId());
            } catch (JobException jobException) {
                company = Optional.empty();
            }
        }

        Specification<Job> spec = Specification.where(JobSpecification.hasTitulo(filterJobDto.titulo()))
                .and(JobSpecification.hasCategory(category.orElse(null)))
                .and(JobSpecification.hasCompany(company.orElse(null)))
                .and(JobSpecification.hasMinSalario(minSalario))
                .and(JobSpecification.hasMaxSalario(maxSalario));

        return this.jobRepository.findAll(spec);
    }

    public void updateJobById(String jobId, UpdateJobDto updateJobDto) throws JobException {
        var id = UUID.fromString(jobId);

        this.jobRepository.findById(id).ifPresent(job -> {
            boolean updated = false;

            if(updateJobDto.titulo() != null){
                job.setTitulo(updateJobDto.titulo());
                updated = true;
            }

            if (updateJobDto.descricao() != null) {
                job.setDescricao(updateJobDto.descricao());
                updated = true;
            }

            if (updateJobDto.category() != null) {
                Category category = null;

                try {
                    category = this.categoryService.getCategoryById(updateJobDto.category()).orElse(null);
                } catch (CategoryException $e) {
                    CreateCategoryDto createCategoryDto = new CreateCategoryDto(updateJobDto.category());
                    try {
                        category = this.categoryService.createCategory(createCategoryDto);
                    } catch (CategoryException $ex) {

                    }
                }

                if (category != null) {
                    job.setCategory(category);
                    updated = true;
                }
            }

            if (updateJobDto.descricao() != null) {
                job.setDescricao(updateJobDto.descricao());
                updated = true;
            }

            if (updateJobDto.salario() > 0) {
                job.setSalario(updateJobDto.salario());
                updated = true;
            }

            if (updated) {
                job.setDataAtualizacao(Instant.now());
                this.jobRepository.save(job);
            }
        });
    }

    public void deleteById(String jobId) throws JobException {
        var id = UUID.fromString(jobId);
        if (this.jobRepository.existsById(id)) {
            this.jobRepository.deleteById(id);
        }
    }
}
