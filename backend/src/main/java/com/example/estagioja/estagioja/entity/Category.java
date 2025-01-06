package com.example.estagioja.estagioja.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity(name = "category")
@Table(name = "category")
@Getter
@Setter
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "titulo")
    @NotNull
    private String titulo;

    @CreationTimestamp
    @Column(name = "data_inclusao")
    private Instant dataInclusao;

    @OneToMany(mappedBy = "category")
    @JsonManagedReference
    private List<Job> jobs;
}
