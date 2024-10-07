package com.example.estagioja.estagioja.service;

import br.com.caelum.stella.validation.CNPJValidator;
import br.com.caelum.stella.validation.InvalidStateException;
import com.example.estagioja.estagioja.controller.company.CreateCompanyDto;
import com.example.estagioja.estagioja.controller.company.UpdateCompanyDto;
import com.example.estagioja.estagioja.entity.Company;
import com.example.estagioja.estagioja.exception.CompanyException;
import com.example.estagioja.estagioja.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;


@Service
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public CompanyService(CompanyRepository companyRepository, PasswordEncoder passwordEncoder) {
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UUID createCompany(CreateCompanyDto createCompanyDto) throws CompanyException {
        validateEmail(createCompanyDto.email());
        validateCnpj(createCompanyDto.cnpj());
        validateCelular(createCompanyDto.celular());

        Company entity = buildCompanyEntity(createCompanyDto);

        Company companySaved = this.companyRepository.save(entity);
        return companySaved.getId();
    }

    private void validateEmail(String email) throws CompanyException {
        if (this.companyRepository.existsByEmail(email)) {
            throw new CompanyException("Email já está em uso: " + email);
        }
        if (!isValidEmail(email)) {
            throw new CompanyException("Email inválido: " + email);
        }
    }

    private void validateCnpj(String cnpj) throws CompanyException {
        try {
            CNPJValidator cpfValidator = new CNPJValidator();
            cpfValidator.assertValid(cnpj);
        } catch (InvalidStateException e) {
            throw new CompanyException("CNPJ inválido: " + cnpj, e);
        }
    }

    private void validateCelular(String celular) throws CompanyException {
        if (!isValidCelular(celular)) {
            throw new CompanyException("Celular inválido: " + celular);
        }
    }

    private boolean isValidEmail(String email) {
        String emailRegex = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$";
        return Pattern.matches(emailRegex, email);
    }

    private boolean isValidCelular(String celular) {
        String celularRegex = "^\\(?\\d{2}\\)?[\\s-]?9\\d{4}[\\s-]?\\d{4}$";
        return Pattern.matches(celularRegex, celular);
    }

    private Company buildCompanyEntity(CreateCompanyDto createCompanyDto) {
        Instant now = Instant.now();

        return Company.builder()
                .id(UUID.randomUUID())
                .nome(createCompanyDto.nome())
                .email(createCompanyDto.email())
                .celular(createCompanyDto.celular())
                .cnpj(createCompanyDto.cnpj())
                .senha(this.passwordEncoder.encode(createCompanyDto.senha()))
                .uf(createCompanyDto.uf())
                .cep(createCompanyDto.cep())
                .municipio(createCompanyDto.municipio())
                .endereco(createCompanyDto.endereco())
                .bairro(createCompanyDto.bairro())
                .numero(createCompanyDto.numero())
                .dataAtualizacao(now)
                .dataInclusao(now)
                .build();
    }

    public Optional<Company> getCompanyById(String companyId) throws CompanyException {
        return Optional.ofNullable(this.companyRepository.findById(UUID.fromString(companyId)).orElseThrow(() -> new CompanyException("Empresa não encontrado: " + companyId)));
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

            if (updateCompanyDto.numero() > 0) {
                company.setNumero(updateCompanyDto.numero());
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
