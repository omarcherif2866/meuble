package com.example.meublebackend.security.jwt.usersecurity;

import com.example.meublebackend.entity.User;
import com.example.meublebackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameOrEmail(username,username).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found with username: " + username
                ));
        UserPrinciple userPrinciple= UserPrinciple.build(user);
        return userPrinciple;
    }
}
