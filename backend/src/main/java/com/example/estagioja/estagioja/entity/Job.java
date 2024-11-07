package com.example.estagioja.estagioja.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity(name = "job")
@Table(name = "job")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "titulo")
    @NotNull
    private String titulo;

    @Column(name = "descricao")
    @NotNull
    private String descricao;

    @Column(name = "categoria")
    @NotNull
    private String categoria;

    @Column(name = "salario")
    private int salario;

    @UpdateTimestamp
    @Column(name = "data_atualizacao")
    private Instant dataAtualizacao;

    @CreationTimestamp
    @Column(name = "data_inclusao")
    private Instant dataInclusao;

    @ManyToMany
    @JoinColumn(name = "company_id")
    private Company company;
}
