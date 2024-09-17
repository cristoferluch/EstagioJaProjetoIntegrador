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

    private UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UUID createUser(CreateUserDto createUserDto){

        //DTO -> ENTITY
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
                null,
                Instant.now()
        );

        var userSaved = userRepository.save(entity);

        return userSaved.getId();
    }

    public Optional<User> getUserById(String userId) {
        return userRepository.findById(UUID.fromString(userId));
    }

    public List<User> listUsers(){
        return userRepository.findAll();
    }

    public void updateUserById(String userId, UpdateUserDto updateUserDto){

        var id = UUID.fromString(userId);

        var userExists = userRepository.findById(id);

        if(userExists.isPresent()){
            var user = userExists.get();

            if(updateUserDto.senha() != null){
                user.setSenha(updateUserDto.senha());
            }

            if(updateUserDto.celular() != null){
                user.setCelular(updateUserDto.celular());
            }

            if(updateUserDto.dataNascimento() != null){
                user.setDataNascimento(updateUserDto.dataNascimento());
            }

            userRepository.save(user);
        }
    }

    public void deleteById(String userId){
        var id = UUID.fromString(userId);

        var userExists = userRepository.existsById(id);

        if(userExists){
            userRepository.deleteById(id);
        }

    }

}
