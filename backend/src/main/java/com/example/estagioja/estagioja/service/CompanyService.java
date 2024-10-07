package com.example.estagioja.estagioja.service;

import com.example.estagioja.estagioja.controller.company.CreateCompanyDto;
import com.example.estagioja.estagioja.controller.company.UpdateCompanyDto;
import com.example.estagioja.estagioja.entity.Company;
import com.example.estagioja.estagioja.exception.CompanyException;
import com.example.estagioja.estagioja.repository.CompanyRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public UUID createCompany(CreateCompanyDto createCompanyDto) throws CompanyException {
        var entity = new Company(
                UUID.randomUUID(),
                createCompanyDto.nome(),
                createCompanyDto.email(),
                createCompanyDto.celular(),
                createCompanyDto.cnpj(),
                createCompanyDto.senha(),
                createCompanyDto.uf(),
                createCompanyDto.municipio(),
                createCompanyDto.endereco(),
                createCompanyDto.bairro(),
                createCompanyDto.numero(),
                Instant.now(),
                Instant.now()
        );

        var companySaved = this.companyRepository.save(entity);
        return companySaved.getId();
    }

    public Optional<Company> getCompanyById(String companyId) {
        return this.companyRepository.findById(UUID.fromString(companyId));
    }

    public List<Company> listCompanies() {
        return this.companyRepository.findAll();
    }

    public void updateCompanyById(String companyId, UpdateCompanyDto updateCompanyDto) throws CompanyException {
        var id = UUID.fromString(companyId);


        this.companyRepository.findById(id).ifPresent(company -> {
            boolean updated = false;

            if (updateCompanyDto.celular() != null) {
                company.setCelular(updateCompanyDto.celular());
                updated = true;
            }

            if (updateCompanyDto.senha() != null) {
                company.setSenha(updateCompanyDto.senha());
                updated = true;
            }

            if(updateCompanyDto.uf() != null){
                company.setUf(updateCompanyDto.uf());
                updated = true;
            }

            if(updateCompanyDto.municipio() != null){
                company.setMunicipio(updateCompanyDto.municipio());
                updated = true;
            }

            if(updateCompanyDto.endereco() != null){
                company.setEndereco(updateCompanyDto.endereco());
                updated = true;
            }

            if(updateCompanyDto.bairro() != null){
                company.setBairro(updateCompanyDto.bairro());
                updated = true;
            }

            if(updateCompanyDto.numero() != null){
                company.setNumero(Integer.parseInt(updateCompanyDto.numero()));
                updated = true;
            }

            if (updated) {
                company.setDataAtualizacao(Instant.now());
                this.companyRepository.save(company);
            }
        });
    }

    public void deleteById(String companyId) throws CompanyException {
        var id = UUID.fromString(companyId);
        if (this.companyRepository.existsById(id)) {
            this.companyRepository.deleteById(id);
        }
    }
}
