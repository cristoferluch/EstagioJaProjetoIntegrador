package com.example.estagioja.estagioja.controller.job;

import com.example.estagioja.estagioja.entity.Job;
import com.example.estagioja.estagioja.service.JobService;
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

    @GetMapping("/{jobId}")
    public ResponseEntity<Job> getJobById(@PathVariable("jobId") String jobId) throws Exception  {
        var Job = this.jobService.getJobById(jobId);

        //Verifica se o usuario existe
        if(Job.isPresent()){
            return ResponseEntity.ok(Job.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Job>> listJobs() {
        var jobs = this.jobService.listJobs();
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
