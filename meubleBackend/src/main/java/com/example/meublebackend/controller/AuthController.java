package com.example.meublebackend.controller;

import com.example.meublebackend.dto.AuthResponseDTO;
import com.example.meublebackend.dto.LoginDto;
import com.example.meublebackend.dto.MessageResponse;
import com.example.meublebackend.entity.Role;
import com.example.meublebackend.entity.User;
import com.example.meublebackend.repository.UserRepository;
import com.example.meublebackend.security.jwt.JwtProvider;
import com.example.meublebackend.security.jwt.usersecurity.UserPrinciple;
import com.example.meublebackend.service.CloudinaryService;
import com.example.meublebackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.util.HashMap;
import java.util.Map;

    @RestController
    @RequiredArgsConstructor
    @RequestMapping("/api/auth")
    //@CrossOrigin(origins = "http://localhost:4200")
    public class AuthController {

        private final AuthenticationManager authenticationManager;
        private final PasswordEncoder passwordEncoder;
        private final JwtProvider jwtProvider;
        private final UserRepository userRepository;
        private final CloudinaryService cloudinaryService;

        private final UserService userService;





        @PostMapping("/login")
        public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
            // Récupérer l'utilisateur par son nom d'utilisateur ou email
            var account = userRepository.findByUsernameOrEmail(loginDto.getEmail(), loginDto.getEmail()).orElse(null);

            // Vérifier si l'utilisateur existe
            if (account == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Nom d'utilisateur ou mot de passe incorrect");
            }

            // Vérifier si l'utilisateur est bloqué
            if (account.isBlocked()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Votre compte est bloqué. Contactez l'administrateur pour plus d'informations.");
            }

            // Authentifier l'utilisateur
            try {
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                loginDto.getEmail(),
                                loginDto.getPassword()
                        )
                );
            } catch (AuthenticationException e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Nom d'utilisateur ou mot de passe incorrect"+loginDto.getEmail());
            }

            // Générer le token JWT
            String jwtToken = jwtProvider.generateToken(UserPrinciple.build(account));

            // Récupérer le rôle à partir du token JWT
            String role = jwtProvider.getRoleFromJwt(jwtToken);
            System.out.println("Rôle :" + role);

            // Retourner le token JWT et le rôle dans la réponse
            Map<String, String> response = new HashMap<>();
            response.put("accessToken", jwtToken);
            response.put("role", role);

            return ResponseEntity.ok(response);
        }




        @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<?> register(
                @RequestPart("user") User user,
                @RequestPart(value = "image", required = false) MultipartFile image
        ) {
            try {
                if (userRepository.existsByUsername(user.getUsername())) {
                    return ResponseEntity.badRequest()
                            .body(new MessageResponse("Error: Username is already taken!"));
                }

                if (userRepository.existsByEmail(user.getEmail())) {
                    return ResponseEntity.badRequest()
                            .body(new MessageResponse("Error: Email is already taken!"));
                }

                // Upload image to Cloudinary
                if (image != null && !image.isEmpty()) {
                    String imageUrl = cloudinaryService.uploadImage(image);
                    user.setImage(imageUrl);
                }

                // Encode password
                user.setPassword(passwordEncoder.encode(user.getPassword()));

                // Default values
                user.setRole(Role.client);
                user.setBlocked(false);

                User savedUser = userRepository.save(user);

                UserPrinciple userPrinciple = UserPrinciple.build(savedUser);
                String token = jwtProvider.generateToken(userPrinciple);

                return ResponseEntity.ok(new AuthResponseDTO(token, savedUser));

            } catch (Exception e) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Failed to register user: " + e.getMessage()));
            }
        }


        @PutMapping("/{id}")
        public User updateUserPut(@PathVariable Long id , @RequestBody User user)
        {
            return userService.updateUser(id,user);
        }


        @PostMapping("/forgot")
        public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
            try {
                String email = request.get("email");
                Map<String, String> response = userService.sendVerificationCode(email);
                return ResponseEntity.ok(response);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
            } catch (Exception e) {
                return ResponseEntity.status(500).body(Map.of("message", "Erreur interne."));
            }
        }

        @PostMapping("/verify-code")
        public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> request) {
            try {
                String userId = request.get("userId");
                String code = request.get("code");
                userService.verifyCode(userId, code);
                return ResponseEntity.ok(Map.of("message", "Code vérifié avec succès."));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
            } catch (Exception e) {
                return ResponseEntity.status(500).body(Map.of("message", "Erreur lors de la vérification du code."));
            }
        }

        @PostMapping("/reset")
        public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
            try {
                // Récupérer le userId en String et le convertir en Long
                String userIdStr = request.get("userId");
                if (userIdStr == null) {
                    return ResponseEntity.badRequest().body(Map.of("message", "userId est requis."));
                }
                Long userId = Long.parseLong(userIdStr);

                String newPassword = request.get("newPassword");
                if (newPassword == null || newPassword.isEmpty()) {
                    return ResponseEntity.badRequest().body(Map.of("message", "newPassword est requis."));
                }

                userService.resetPassword(userId, newPassword);
                return ResponseEntity.ok(Map.of("message", "Mot de passe réinitialisé avec succès."));
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().body(Map.of("message", "userId invalide."));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
            } catch (Exception e) {
                return ResponseEntity.status(500).body(Map.of("message", "Erreur lors de la réinitialisation."));
            }
        }


}