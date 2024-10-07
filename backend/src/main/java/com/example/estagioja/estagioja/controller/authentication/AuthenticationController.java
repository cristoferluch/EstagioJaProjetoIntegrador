package com.example.estagioja.estagioja.controller.authentication;

import com.example.estagioja.estagioja.controller.company.CreateCompanyDto;
import com.example.estagioja.estagioja.controller.company.UpdateCompanyDto;
import com.example.estagioja.estagioja.controller.user.CreateUserDto;
import com.example.estagioja.estagioja.controller.user.LoginResponseDto;
import com.example.estagioja.estagioja.controller.user.UpdateUserDto;
import com.example.estagioja.estagioja.entity.Company;
import com.example.estagioja.estagioja.entity.User;
import com.example.estagioja.estagioja.exception.CompanyException;
import com.example.estagioja.estagioja.exception.ErrorResponse;
import com.example.estagioja.estagioja.exception.SuccessResponse;
import com.example.estagioja.estagioja.exception.UserException;
import com.example.estagioja.estagioja.repository.CompanyRepository;
import com.example.estagioja.estagioja.repository.UserRepository;
import com.example.estagioja.estagioja.security.TokenService;
import com.example.estagioja.estagioja.service.CompanyService;
import com.example.estagioja.estagioja.service.UserService;
import io.jsonwebtoken.JwtException;
import jakarta.transaction.Transactional;
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

    @Autowired
    private CompanyService companyService;

    @Autowired
    private CompanyRepository companyRepository;

    @PostMapping("/login/user")
    public ResponseEntity<?> loginUser(@RequestBody @Valid AuthenticationDto data) {
        try {
            if (!userRepository.findByEmail(data.email()).isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(HttpStatus.NOT_FOUND.value(), "Usuário não encontrado."));
            }

            var emailPassword = new UsernamePasswordAuthenticationToken(data.email(), data.password());
            var auth = this.authenticationManager.authenticate(emailPassword);

            var token = tokenService.generateTokenUser((User) auth.getPrincipal());
            return ResponseEntity.ok(new LoginResponseDto(token));

        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), "Credenciais inválidas."));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Um erro inesperado ocorreu."));
        }
    }

    @Transactional
    @PostMapping("/register/user")
    public ResponseEntity<?> createUser(@RequestBody @Valid CreateUserDto createUserDto) {
        try {
            if (userRepository.existsByEmail(createUserDto.email())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponse(HttpStatus.CONFLICT.value(), "Email já está em uso."));
            }

            if (userRepository.existsByCpf(createUserDto.cpf())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponse(HttpStatus.CONFLICT.value(), "CPF já está em uso."));
            }

            var userId = userService.createUser(createUserDto);

            return ResponseEntity.created(URI.create("/auth/register/user/" + userId)).body(new SuccessResponse(HttpStatus.CREATED.value(), "Usuário cadastrado com sucesso."));

        } catch (UserException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(HttpStatus.BAD_REQUEST.value(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Um erro inesperado ocorreu."));
        }
    }

    @Transactional
    @PutMapping("/update/user/{userId}")
    public ResponseEntity<?> updateUserById(@RequestHeader("Authorization") String token, @PathVariable("userId") String userId, @RequestBody UpdateUserDto updateUserDto) {

        try {
            token = token.replace("Bearer ", "");
            String email = tokenService.validateToken(token);

            if (email == null || email.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), "Token inválido ou expirado."));
            }

            User user = userService.getUserById(userId).orElseThrow(() -> new UserException("Usuário não encontrado."));

            if (!user.getEmail().equals(email)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorResponse(HttpStatus.FORBIDDEN.value(), "Email no token não corresponde ao usuário."));
            }

            userService.updateUserById(userId, updateUserDto);

            return ResponseEntity.ok().body(new SuccessResponse(HttpStatus.OK.value(), "Usuário atualizado com sucesso."));

        } catch (UserException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage()));

        } catch (JwtException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), "Token inválido."));

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Um erro inesperado ocorreu."));
        }
    }


    @PostMapping("/login/company")
    public ResponseEntity<?> loginCompany(@RequestBody @Valid AuthenticationDto data) {
        try {
            if (!this.companyRepository.findByEmail(data.email()).isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(HttpStatus.NOT_FOUND.value(), "Empresa não encontrado."));
            }

            var emailPassword = new UsernamePasswordAuthenticationToken(data.email(), data.password());
            var auth = this.authenticationManager.authenticate(emailPassword);
            var token = this.tokenService.generateTokenCompany((Company) auth.getPrincipal());

            return ResponseEntity.ok(new LoginResponseDto(token));

        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), "Credenciais inválidas."));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Um erro inesperado ocorreu."));
        }
    }

    @Transactional
    @PutMapping("/update/company/{companyId}")
    public ResponseEntity<?> updateCompanyById(@RequestHeader("Authorization") String token, @PathVariable("companyId") String companyId, @RequestBody UpdateCompanyDto updateCompanyDto) {
        try {
            token = token.replace("Bearer ", "");
            String email = this.tokenService.validateToken(token);

            if (email == null || email.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), "Token inválido ou expirado."));
            }

            Company company = this.companyService.getCompanyById(companyId).orElseThrow(() -> new CompanyException("Empresa não encontrado."));

            if (!company.getEmail().equals(email)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorResponse(HttpStatus.FORBIDDEN.value(), "Email no token não corresponde a empresa."));
            }

            this.companyService.updateCompanyById(companyId, updateCompanyDto);

            return ResponseEntity.ok().body(new SuccessResponse(HttpStatus.OK.value(), "Empresa atualizado com sucesso."));

        } catch (CompanyException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage()));

        } catch (JwtException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), "Token inválido."));

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Um erro inesperado ocorreu."));
        }
    }

    @Transactional
    @PostMapping("/register/company")
    public ResponseEntity<?> createCompany(@RequestBody @Valid CreateCompanyDto createCompanyDto) {
        try {
            if (this.companyRepository.existsByEmail(createCompanyDto.email())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponse(HttpStatus.CONFLICT.value(), "Email já está em uso."));
            }

            if (this.companyRepository.existsByCnpj(createCompanyDto.cnpj())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponse(HttpStatus.CONFLICT.value(), "CNPJ já está em uso."));
            }

            var companyId = this.companyService.createCompany(createCompanyDto);

            return ResponseEntity.created(URI.create("/auth/register/company/" + companyId)).body(new SuccessResponse(HttpStatus.CREATED.value(), "Empresa cadastrado com sucesso."));

        } catch (CompanyException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(HttpStatus.BAD_REQUEST.value(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Um erro inesperado ocorreu."));
        }
    }
}