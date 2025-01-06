package com.example.estagioja.estagioja.controller;

import com.example.estagioja.estagioja.controller.job.CreateJobDto;
import com.example.estagioja.estagioja.controller.job.FilterJobDto;
import com.example.estagioja.estagioja.controller.job.JobResponseDto;
import com.example.estagioja.estagioja.controller.job.UpdateJobDto;
import com.example.estagioja.estagioja.entity.Job;
import com.example.estagioja.estagioja.exception.ErrorResponse;
import com.example.estagioja.estagioja.exception.JobException;
import com.example.estagioja.estagioja.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
public class JobController {

    private final JobService jobService;

    @Autowired
    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping
    public ResponseEntity<?> createJob(@RequestBody CreateJobDto createJobDto) {
        try {
            Job job = jobService.createJob(createJobDto);
            return ResponseEntity.ok(job);
        } catch (Exception e) {
            ErrorResponse errorResponse = new ErrorResponse(400, "Erro ao criar o emprego: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<JobResponseDto> getJobById(@PathVariable String jobId) throws JobException {
        return ResponseEntity.ok(jobService.getJobById(jobId));
    }

    @GetMapping
    public List<JobResponseDto> listJobs(FilterJobDto filterJobDto) {
        return jobService.listJobs(filterJobDto);
    }

    @PutMapping("/{jobId}")
    public ResponseEntity<ErrorResponse> updateJob(@PathVariable String jobId, @RequestBody UpdateJobDto updateJobDto) {
        try {
            jobService.updateJobById(jobId, updateJobDto);
            ErrorResponse successResponse = new ErrorResponse(200, "Vaga atualizada com sucesso");
            return ResponseEntity.ok(successResponse);
        } catch (Exception e) {
            ErrorResponse errorResponse = new ErrorResponse(404, "Vaga não encontrada");
            return ResponseEntity.status(404).body(errorResponse);
        }
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<ErrorResponse> deleteJob(@PathVariable String jobId) {
        try {
            jobService.deleteById(jobId);
            ErrorResponse successResponse = new ErrorResponse(200, "Vaga excluída com sucesso");
            return ResponseEntity.ok(successResponse);
        } catch (Exception e) {
            ErrorResponse errorResponse = new ErrorResponse(404, "Vaga não encontrada");
            return ResponseEntity.status(404).body(errorResponse);
        }
    }
}
