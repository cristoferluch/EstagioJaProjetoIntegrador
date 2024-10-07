package com.example.estagioja.estagioja.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "\"company\"")
public class Company {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "nome")
    private String nome;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "celular")
    private String celular;

    @Column(name = "cnpj", unique = true)
    private String cnpj;

    @Column(name = "senha")
    private String senha;

    @Column(name = "uf")
    private String uf;

    @Column(name = "municipio")
    private String municipio;

    @Column(name = "endereco")
    private String endereco;

    @Column(name = "bairro")
    private String bairro;

    @Column(name = "numero")
    private int numero;

    @UpdateTimestamp
    @Column(name = "data_atualizacao")
    private Instant dataAtualizacao;

    @CreationTimestamp
    @Column(name = "data_inclusao")
    private Instant dataInclusao;

    public Company() {
    }

    public Company(UUID id, String nome, String email, String celular, String cnpj, String senha, String uf,
                   String municipio, String endereco, String bairro, int numero,
                   Instant dataAtualizacao, Instant dataInclusao) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.celular = celular;
        this.cnpj = cnpj;
        this.senha = senha;
        this.uf = uf;
        this.municipio = municipio;
        this.endereco = endereco;
        this.bairro = bairro;
        this.numero = numero;
        this.dataAtualizacao = dataAtualizacao;
        this.dataInclusao = dataInclusao;
    }

    public UUID getId() {
        return id;
    }
    public void setId(UUID id) {this.id = id;}
    public String getNome() {return this.nome;}
    public void setNome(String nome) {
        this.nome = nome;
    }
    public String getEmail() {return this.email;}
    public void setEmail(String email) {
        this.email = email;
    }
    public String getCelular() {
        return this.celular;
    }
    public void setCelular(String celular) {this.celular = celular;}
    public String getCnpj() {
        return this.cnpj;
    }
    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }
    public String getSenha() {return this.senha;}
    public void setSenha(String senha) {
        this.senha = senha;
    }
    public String getUf() {
        return this.uf;
    }
    public void setUf(String uf) {this.uf = uf;}
    public String getMunicipio() {
        return this.municipio;
    }
    public void setMunicipio(String municipio) {this.municipio = municipio;}
    public String getEndereco() {
        return this.endereco;
    }
    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }
    public String getBairro() {
        return this.bairro;
    }
    public void setBairro(String bairro) {
        this.bairro = bairro;
    }
    public int getNumero() {
        return this.numero;
    }
    public void setNumero(int numero) {
        this.numero = numero;
    }
    public Instant getDataAtualizacao() {
        return this.dataAtualizacao;
    }
    public void setDataAtualizacao(Instant dataAtualizacao) {
        this.dataAtualizacao = dataAtualizacao;
    }
    public Instant getDataInclusao() {return this.dataInclusao;}
    public void setDataInclusao(Instant dataInclusao) {this.dataInclusao = dataInclusao;}
}
