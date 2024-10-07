package com.example.estagioja.estagioja.controller.company;

import com.example.estagioja.estagioja.entity.Company;
import com.example.estagioja.estagioja.service.CompanyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/companies")
public class CompanyController {

    private CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping("/{companyId}")
    public ResponseEntity<Company> getCompanyById(@PathVariable("companyId") String companyId) {
        var Company = this.companyService.getCompanyById(companyId);

        //Verifica se o usuario existe
        if(Company.isPresent()){
            return ResponseEntity.ok(Company.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Company>> listCompanies() {
        var companies = this.companyService.listCompanies();
        return ResponseEntity.ok(companies);
    }

    @PutMapping("/{companyId}")
    public ResponseEntity<Void> updateCompanyById(@PathVariable("companyId") String companyId, @RequestBody UpdateCompanyDto updateCompanyDto) throws Exception {
        this.companyService.updateCompanyById(companyId, updateCompanyDto);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{companyId}")
    public ResponseEntity<Void> deleteById(@PathVariable("companyId") String companyId) throws Exception {
        this.companyService.deleteById(companyId);
        return ResponseEntity.noContent().build();
    }

}
