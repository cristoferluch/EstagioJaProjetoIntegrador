package com.example.estagioja.estagioja.service;

import com.example.estagioja.estagioja.controller.job.UpdateJobDto;
import com.example.estagioja.estagioja.controller.job.CreateJobDto;
import com.example.estagioja.estagioja.entity.Company;
import com.example.estagioja.estagioja.entity.Job;
import com.example.estagioja.estagioja.exception.JobException;
import com.example.estagioja.estagioja.repository.CompanyRepository;
import com.example.estagioja.estagioja.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.core.context.SecurityContextHolder;
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

    @Autowired
    public JobService(JobRepository jobRepository, CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
    }

    @Transactional
    public UUID createJob(CreateJobDto createJobDto) throws JobException {
        Job entity = buildJobEntity(createJobDto);
        Job jobSaved = this.jobRepository.save(entity);
        return jobSaved.getId();
    }

    public Optional<Job> getJobById(String jobId) throws JobException {
        return Optional.ofNullable(this.jobRepository.findById(UUID.fromString(jobId)).orElseThrow(() -> new JobException("Emprego não encontrado: " + jobId)));
    }

    public Optional<Company> getCompanyById(String companyId) throws JobException {
        return Optional.ofNullable(this.companyRepository.findById(UUID.fromString(companyId)).orElseThrow(() -> new JobException("Empresa não encontrado: " + companyId)));
    }

    private Job buildJobEntity(CreateJobDto createJobDto) throws JobException {
        Instant now = Instant.now();

        var companies = this.companyRepository.findAll();
        Company company = null;
        for (Company companyFor : companies) {
            company = companyFor;
            break;
        }


        return Job.builder()
                .id(UUID.randomUUID())
                .titulo(createJobDto.titulo())
                .descricao(createJobDto.descricao())
                .salario(createJobDto.salario())
                .company(company)
                .dataAtualizacao(now)
                .dataInclusao(now)
                .build();
    }

    public List<Job> listJobs() {
        return this.jobRepository.findAll();
    }

    public void updateJobById(String jobId, UpdateJobDto updateJobDto) throws JobException {
        var id = UUID.fromString(jobId);

        this.jobRepository.findById(id).ifPresent(job -> {
            // if (SecurityContextHolder.getContext().getAuthentication().getEntity().getId() != job.company.getId()) {  @todo pegar emmpresa para vincular
            //      throw new JobException("Empresa não bate corretamente com a empresa da vaga ");
            // }

            boolean updated = false;

            if(updateJobDto.titulo() != null){
                job.setTitulo(updateJobDto.titulo());
                updated = true;
            }

            if (updateJobDto.descricao() != null) {
                job.setDescricao(updateJobDto.descricao());
                updated = true;
            }

            if (updateJobDto.categoria() != null) {
                job.setCategoria(updateJobDto.categoria());
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
