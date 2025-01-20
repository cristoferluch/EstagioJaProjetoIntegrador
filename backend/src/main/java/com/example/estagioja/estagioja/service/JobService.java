package com.example.estagioja.estagioja.service;

import com.example.estagioja.estagioja.controller.category.CategoryResponseDto;
import com.example.estagioja.estagioja.controller.company.CompanyResponseDto;
import com.example.estagioja.estagioja.controller.job.CreateJobDto;
import com.example.estagioja.estagioja.controller.job.FilterJobDto;
import com.example.estagioja.estagioja.controller.job.JobResponseDto;
import com.example.estagioja.estagioja.controller.job.UpdateJobDto;
import com.example.estagioja.estagioja.entity.Category;
import com.example.estagioja.estagioja.entity.Company;
import com.example.estagioja.estagioja.entity.Job;
import com.example.estagioja.estagioja.exception.CategoryException;
import com.example.estagioja.estagioja.exception.JobException;
import com.example.estagioja.estagioja.repository.JobRepository;
import com.example.estagioja.estagioja.repository.CompanyRepository;
import com.example.estagioja.estagioja.specification.JobSpecification;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

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
    public Job createJob(CreateJobDto createJobDto) throws JobException, CategoryException {
        Job entity = buildJobEntity(createJobDto);
        return jobRepository.save(entity);
    }

    public JobResponseDto getJobById(String jobId) throws JobException {
        UUID id = UUID.fromString(jobId);
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new JobException("Emprego não encontrado: " + jobId));

        Category category = job.getCategory();
        CategoryResponseDto categoryResponseDto = (category != null) ?
                new CategoryResponseDto(category.getId(), category.getTitulo()) : null;

        Company company = job.getCompany();
        CompanyResponseDto companyResponseDto = (company != null) ?
                new CompanyResponseDto(
                        company.getId(),
                        company.getNome(),
                        company.getEmail(),
                        company.getCelular(),
                        company.getCnpj(),
                        company.getSenha(),
                        company.getUf(),
                        company.getCep(),
                        company.getMunicipio(),
                        company.getEndereco(),
                        company.getBairro(),
                        company.getNumero()
                ) : null;

        return new JobResponseDto(
                job.getId(),
                job.getTitulo(),
                job.getDescricao(),
                job.getSalario(),
                companyResponseDto,
                categoryResponseDto
        );
    }

    public Optional<Company> getCompanyById(String companyId) throws JobException {
        UUID id = UUID.fromString(companyId);
        return Optional.ofNullable(companyRepository.findById(id)
                .orElseThrow(() -> new JobException("Empresa não encontrada: " + companyId)));
    }

    private Job buildJobEntity(CreateJobDto createJobDto) throws JobException, CategoryException {
        Instant now = Instant.now();
        Company company = getCompanyById(createJobDto.companyId()).orElse(null);

        Category category = categoryService.getCategoryById(String.valueOf(UUID.fromString(createJobDto.category())))
                .orElseThrow(() -> new JobException("Categoria não encontrada"));

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

    public List<JobResponseDto> listJobs(FilterJobDto filterJobDto) {
        Integer minSalario = filterJobDto.minSalario() != null ? filterJobDto.minSalario() : 0;
        Integer maxSalario = filterJobDto.maxSalario() != null ? filterJobDto.maxSalario() : Integer.MAX_VALUE;

        Optional<Category> category = Optional.empty();
        if (filterJobDto.category() != null && !filterJobDto.category().isEmpty()) {
            try {
                category = this.categoryService.getCategoryById(String.valueOf(UUID.fromString(filterJobDto.category())));
            } catch (CategoryException categoryException) {
                category = Optional.empty();
            }
        }

        Optional<Company> company = Optional.empty();
        if (filterJobDto.companyId() != null && !filterJobDto.companyId().isEmpty()) {
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

        List<Job> jobs = jobRepository.findAll(spec);


        return jobs.stream()
                .map(job -> new JobResponseDto(
                        job.getId(),
                        job.getTitulo(),
                        job.getDescricao(),
                        job.getSalario(),
                        new CompanyResponseDto(
                                job.getCompany().getId(),
                                job.getCompany().getNome(),
                                job.getCompany().getEmail(),
                                job.getCompany().getCelular(),
                                job.getCompany().getCnpj(),
                                job.getCompany().getSenha(),
                                job.getCompany().getUf(),
                                job.getCompany().getCep(),
                                job.getCompany().getMunicipio(),
                                job.getCompany().getEndereco(),
                                job.getCompany().getBairro(),
                                job.getCompany().getNumero()
                        ),
                        new CategoryResponseDto(
                                job.getCategory().getId(),
                                job.getCategory().getTitulo()
                        )
                ))
                .toList();
    }

    public void updateJobById(String jobId, UpdateJobDto updateJobDto) throws JobException {
        UUID id = UUID.fromString(jobId);

        jobRepository.findById(id).ifPresent(job -> {
            boolean updated = false;

            if (updateJobDto.titulo() != null) {
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
                    category = categoryService.getCategoryById(String.valueOf(UUID.fromString(updateJobDto.category())))
                            .orElseThrow(() -> new JobException("Categoria não encontrada"));
                } catch (JobException e) {
                    throw new RuntimeException(e);
                } catch (CategoryException e) {
                    throw new RuntimeException(e);
                }

                job.setCategory(category);
                updated = true;
            }

            if (updateJobDto.salario() > 0) {
                job.setSalario(updateJobDto.salario());
                updated = true;
            }

            if (updated) {
                job.setDataAtualizacao(Instant.now());
                jobRepository.save(job);
            }
        });
    }

    public void deleteById(String jobId) throws JobException {
        UUID id = UUID.fromString(jobId);

        System.out.println(jobId);

        if (jobRepository.existsById(id)) {
            jobRepository.deleteById(id);
        } else {
            throw new JobException("Emprego não encontrado para exclusão");
        }
    }
}
