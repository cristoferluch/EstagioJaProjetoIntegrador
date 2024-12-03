package com.example.estagioja.estagioja.controller.job;

import com.example.estagioja.estagioja.controller.category.CreateCategoryDto;
import com.example.estagioja.estagioja.entity.Job;
import com.example.estagioja.estagioja.exception.ErrorResponse;
import com.example.estagioja.estagioja.service.JobService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
public class JobController {

    private JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping("")
    public ResponseEntity<?> createJob(@RequestBody CreateJobDto createJobDto) throws Exception  {
        Job job = this.jobService.createJob(createJobDto);
        if (job.getId() != null) {
            return ResponseEntity.ok(new JobResponseDto(job.getId()));
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Um erro inesperado ocorreu."));
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<Job> getJobById(@PathVariable("jobId") String jobId) throws Exception  {
        var Job = this.jobService.getJobById(jobId);
        if(Job.isPresent()){
            return ResponseEntity.ok(Job.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Job>> listJobs(@RequestParam(value = "titulo", required = false) String titulo, @RequestParam(value = "companyId", required = false) String companyId, @RequestParam(value = "minSalario", required = false) Integer minSalario, @RequestParam(value = "maxSalario", required = false) Integer maxSalario, @RequestParam(value = "category", required = false) String category) {
        FilterJobDto filterJobDto = new FilterJobDto(titulo, category, companyId, minSalario, maxSalario);
        var jobs = this.jobService.listJobs(filterJobDto);
        return ResponseEntity.ok(jobs);
    }

    @PutMapping("/{jobId}")
    public ResponseEntity<Void> updateJobById(@PathVariable("jobId") String jobId, @RequestBody UpdateJobDto updateJobDto) throws Exception {
        this.jobService.updateJobById(jobId, updateJobDto);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<Void> deleteById(@PathVariable("jobId") String jobId) throws Exception {
        this.jobService.deleteById(jobId);
        return ResponseEntity.noContent().build();
    }

}
