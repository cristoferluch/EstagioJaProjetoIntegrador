package com.example.estagioja.estagioja.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
public class User {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "nome")
    private String nome;

    @Column(name = "sobrenome")
    private String sobrenome;

    @Column(name = "email")
    private String email;

    @Column(name = "celular")
    private String celular;

    @Column(name = "cpf")
    private String cpf;

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
    private String numero;

    @Column(name = "genero")
    private String genero;

    @Column(name = "data_nascimento")
    private String dataNascimento;

    @CreationTimestamp
    @Column(name = "data_atualizacao")
    private Instant dataAtualizacao;

    @UpdateTimestamp
    @Column(name = "data_inclusao")
    private Instant dataInclusao;

    public User() {
    }

    public User(UUID id, String nome, String sobrenome, String email, String celular, String cpf, String senha, String uf,
                String municipio, String endereco, String bairro, String numero, String genero, String dataNascimento,
                Instant dataAtualizacao, Instant dataInclusao) {
        this.id = id;
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.email = email;
        this.celular = celular;
        this.cpf = cpf;
        this.senha = senha;
        this.uf = uf;
        this.municipio = municipio;
        this.endereco = endereco;
        this.bairro = bairro;
        this.numero = numero;
        this.genero = genero;
        this.dataNascimento = dataNascimento;
        this.dataAtualizacao = dataAtualizacao;
        this.dataInclusao = dataInclusao;
    }

    public UUID getId() {
        return id;
    }
    public void setId(UUID id) {this.id = id;}
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public String getSobrenome() {
        return sobrenome;
    }
    public void setSobrenome(String sobrenome) {
        this.sobrenome = sobrenome;
    }
    public String getEmail() {return email;}
    public void setEmail(String email) {
        this.email = email;
    }
    public String getCelular() {
        return celular;
    }
    public void setCelular(String celular) {
        this.celular = celular;
    }
    public String getCpf() {
        return cpf;
    }
    public void setCpf(String cpf) {
        this.cpf = cpf;
    }
    public String getSenha() {return senha;}
    public void setSenha(String senha) {
        this.senha = senha;
    }
    public String getUf() {
        return uf;
    }
    public void setUf(String uf) {this.uf = uf;}
    public String getMunicipio() {
        return municipio;
    }
    public void setMunicipio(String municipio) {
        this.municipio = municipio;
    }
    public String getEndereco() {
        return endereco;
    }
    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }
    public String getBairro() {
        return bairro;
    }
    public void setBairro(String bairro) {
        this.bairro = bairro;
    }
    public String getNumero() {
        return numero;
    }
    public void setNumero(String numero) {
        this.numero = numero;
    }
    public String getGenero() {
        return genero;
    }
    public void setGenero(String genero) {
        this.genero = genero;
    }
    public String getDataNascimento() {
        return dataNascimento;
    }
    public void setDataNascimento(String dataNascimento) {
        this.dataNascimento = dataNascimento;
    }
    public Instant getDataAtualizacao() {
        return dataAtualizacao;
    }
    public void setDataAtualizacao(Instant dataAtualizacao) {
        this.dataAtualizacao = dataAtualizacao;
    }
    public Instant getDataInclusao() {return dataInclusao;}
    public void setDataInclusao(Instant dataInclusao) {
        this.dataInclusao = dataInclusao;
    }
}
