package com.example.estagioja.estagioja.service;

import br.com.caelum.stella.validation.CPFValidator;
import br.com.caelum.stella.validation.InvalidStateException;
import com.example.estagioja.estagioja.controller.user.CreateUserDto;
import com.example.estagioja.estagioja.controller.user.UpdateUserDto;
import com.example.estagioja.estagioja.entity.User;
import com.example.estagioja.estagioja.exception.UserException;
import com.example.estagioja.estagioja.repository.UserRepository;
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
public class UserService {

    @Autowired
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UUID createUser(CreateUserDto createUserDto) throws UserException {
        validateEmail(createUserDto.email());
        validateCpf(createUserDto.cpf());
        validateCelular(createUserDto.celular());

        User entity = buildUserEntity(createUserDto);

        User userSaved = userRepository.save(entity);
        return userSaved.getId();
    }

    private void validateEmail(String email) throws UserException {
        if (userRepository.existsByEmail(email)) {
            throw new UserException("Email já está em uso: " + email);
        }
        if (!isValidEmail(email)) {
            throw new UserException("Email inválido: " + email);
        }
    }

    private void validateCpf(String cpf) throws UserException {
        try {
            CPFValidator cpfValidator = new CPFValidator();
            cpfValidator.assertValid(cpf);
        } catch (InvalidStateException e) {
            throw new UserException("CPF inválido: " + cpf, e);
        }
    }

    private void validateCelular(String celular) throws UserException {
        if (!isValidCelular(celular)) {
            throw new UserException("Celular inválido: " + celular);
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

    private User buildUserEntity(CreateUserDto createUserDto) {
        Instant now = Instant.now();

        return User.builder()
                .id(UUID.randomUUID())
                .nome(createUserDto.nome())
                .sobrenome(createUserDto.sobrenome())
                .email(createUserDto.email())
                .celular(createUserDto.celular())
                .cpf(createUserDto.cpf())
                .senha(passwordEncoder.encode(createUserDto.senha()))
                .uf(createUserDto.uf())
                .cep(createUserDto.cep())
                .municipio(createUserDto.municipio())
                .endereco(createUserDto.endereco())
                .bairro(createUserDto.bairro())
                .numero(createUserDto.numero())
                .genero(createUserDto.genero())
                .dataNascimento(createUserDto.dataNascimento())
                .dataAtualizacao(now)
                .dataInclusao(now)

                .build();
    }

    @Transactional
    public void updateUserById(String userId, UpdateUserDto updateUserDto) throws UserException {
        var id = UUID.fromString(userId);
        User user = userRepository.findById(id).orElseThrow(() -> new UserException("Usuário não encontrado: " + userId));

        if (updateUserDto.celular() != null) {
            user.setCelular(updateUserDto.celular());
        }

        if (updateUserDto.senha() != null && !updateUserDto.senha().isBlank()) {
            user.setSenha(passwordEncoder.encode(updateUserDto.senha()));
        }

        if (updateUserDto.uf() != null) {
            user.setUf(updateUserDto.uf());
        }

        if (updateUserDto.municipio() != null) {
            user.setMunicipio(updateUserDto.municipio());
        }

        if (updateUserDto.endereco() != null) {
            user.setEndereco(updateUserDto.endereco());
        }

        if (updateUserDto.bairro() != null) {
            user.setBairro(updateUserDto.bairro());
        }

        if (updateUserDto.cep() != null) {
            user.setCep(updateUserDto.cep());
        }

        if (updateUserDto.numero() > 0) {
            user.setNumero(updateUserDto.numero());
        }

        user.setDataAtualizacao(Instant.now());

        try {
            userRepository.save(user);
        } catch (Exception e) {
            throw new UserException("Erro ao atualizar usuário: " + e.getMessage(), e);
        }
    }
    @Transactional
    public void deleteById(String userId) throws UserException {
        var id = UUID.fromString(userId);
        if (!userRepository.existsById(id)) {
            throw new UserException("Usuário não encontrado para exclusão: " + userId);
        }
        userRepository.deleteById(id);
    }

    public Optional<User> getUserById(String userId) throws UserException {
        return Optional.ofNullable(userRepository.findById(UUID.fromString(userId)).orElseThrow(() -> new UserException("Usuário não encontrado: " + userId)));
    }

    public List<User> listUsers() {
        return userRepository.findAll();
    }
}