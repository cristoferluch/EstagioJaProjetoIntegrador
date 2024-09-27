package com.example.estagioja.estagioja.service;

import com.example.estagioja.estagioja.controller.CreateUserDto;
import com.example.estagioja.estagioja.controller.UpdateUserDto;
import com.example.estagioja.estagioja.entity.User;
import com.example.estagioja.estagioja.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UUID createUser(CreateUserDto createUserDto) {
        // DTO -> ENTITY
        var entity = new User(
                UUID.randomUUID(),
                createUserDto.nome(),
                createUserDto.sobrenome(),
                createUserDto.email(),
                createUserDto.celular(),
                createUserDto.cpf(),
                createUserDto.senha(),
                createUserDto.uf(),
                createUserDto.municipio(),
                createUserDto.endereco(),
                createUserDto.bairro(),
                createUserDto.numero(),
                createUserDto.genero(),
                createUserDto.dataNascimento(),
                Instant.now(),
                Instant.now()
        );

        var userSaved = userRepository.save(entity);
        return userSaved.getId();
    }

    public Optional<User> getUserById(String userId) {
        return userRepository.findById(UUID.fromString(userId));
    }

    public List<User> listUsers() {
        return userRepository.findAll();
    }

    public void updateUserById(String userId, UpdateUserDto updateUserDto) {
        var id = UUID.fromString(userId);


        userRepository.findById(id).ifPresent(user -> {
            boolean updated = false;

            if(updateUserDto.email() != null){
                user.setEmail(updateUserDto.email());
                updated = true;
            }

            if (updateUserDto.celular() != null) {
                user.setCelular(updateUserDto.celular());
                updated = true;
            }

            if (updateUserDto.senha() != null) {
                user.setSenha(updateUserDto.senha());
                updated = true;
            }

            if(updateUserDto.uf() != null){
                user.setUf(updateUserDto.uf());
                updated = true;
            }

            if(updateUserDto.municipio() != null){
                user.setMunicipio(updateUserDto.municipio());
                updated = true;
            }

            if(updateUserDto.endereco() != null){
                user.setEndereco(updateUserDto.endereco());
                updated = true;
            }

            if(updateUserDto.bairro() != null){
                user.setBairro(updateUserDto.bairro());
                updated = true;
            }

            if(updateUserDto.numero() != null){
                user.setNumero(Integer.parseInt(updateUserDto.numero()));
                updated = true;
            }

            if (updated) {
                user.setDataAtualizacao(Instant.now());
                userRepository.save(user);
            }
        });
    }

    public void deleteById(String userId) {
        var id = UUID.fromString(userId);
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
        }
    }
}
