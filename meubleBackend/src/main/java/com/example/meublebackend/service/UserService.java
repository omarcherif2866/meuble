package com.example.meublebackend.service;
import com.example.meublebackend.entity.User;

import java.util.List;
import java.util.Map;
import java.util.Set;

public interface UserService {
    User adduser(User users);
    void deleteUserEntityById(Long id);
    User getUserById(Long id);

    public List<User> getAllUsers();

    boolean existByEmail(String email);


    User updateUser(Long id, User user);

    User registerNewUser(User newUser);

    void blockUser(Long userId);
    void unblockUser(Long userId);
    void changePassword(Long id, String oldPassword, String newPassword);
    Map<String, String> sendVerificationCode(String email);
    void verifyCode(String userId, String code);
    void resetPassword(Long userId, String newPassword);

}



