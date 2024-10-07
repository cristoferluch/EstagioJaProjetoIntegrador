package com.example.estagioja.estagioja.authorization;

import com.example.estagioja.estagioja.repository.CompanyRepository;
import com.example.estagioja.estagioja.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthorizationService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var isUser = true;
        try {
            isUser = userRepository.existsByEmail(username);
        } catch (Exception ex) {
            isUser = false;
        }

        if (isUser) {
            return userRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + username));
        } else {
            return companyRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + username));
        }
    }
}