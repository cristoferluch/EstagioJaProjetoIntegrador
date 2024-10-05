package com.example.estagioja.estagioja.controller.authentication;

import com.example.estagioja.estagioja.controller.user.CreateUserDto;
import com.example.estagioja.estagioja.controller.user.LoginResponseDto;
import com.example.estagioja.estagioja.controller.user.UpdateUserDto;
import com.example.estagioja.estagioja.entity.User;
import com.example.estagioja.estagioja.exception.ErrorResponse;
import com.example.estagioja.estagioja.exception.UserException;
import com.example.estagioja.estagioja.repository.UserRepository;
import com.example.estagioja.estagioja.security.TokenService;
import com.example.estagioja.estagioja.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid AuthenticationDto data) {
        try {
            System.out.println(data.email());
            System.out.println(data.password());

            if (!userRepository.findByEmail(data.email()).isPresent()) {
                ErrorResponse errorResponse = new ErrorResponse(HttpStatus.NOT_FOUND.value(), "Usuário não encontrado.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }

            var emailPassword = new UsernamePasswordAuthenticationToken(data.email(), data.password());
            var auth = this.authenticationManager.authenticate(emailPassword);

            var token = tokenService.generateToken((User) auth.getPrincipal());
            return ResponseEntity.ok(new LoginResponseDto(token));

        } catch (BadCredentialsException ex) {
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), "Credenciais inválidas.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        } catch (Exception ex) {
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Um erro inesperado ocorreu.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Void> createUser(@RequestBody CreateUserDto createUserDto) throws Exception {
        var userId = userService.createUser(createUserDto);
        return ResponseEntity.created(URI.create("/auth/register/" + userId)).build();
    }

    @PutMapping("/update/{userId}")
    public ResponseEntity<?> updateUserById(@RequestHeader("Authorization") String token, @PathVariable("userId") String userId, @RequestBody UpdateUserDto updateUserDto) {

        try {
            String email = tokenService.validateToken(token.replace("Bearer ", ""));

            if (email.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), "Token inválido."));
            }

            User user = userService.getUserById(userId).orElseThrow(() -> new UserException("Usuário não encontrado"));

            if (!user.getEmail().equals(email)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorResponse(HttpStatus.FORBIDDEN.value(), "Acesso negado."));
            }

            userService.updateUserById(userId, updateUserDto);
            return ResponseEntity.ok().body(new ErrorResponse(HttpStatus.OK.value(), "Usuário atualizado com sucesso."));

        } catch (UserException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Um erro inesperado ocorreu."));
        }
    }

}