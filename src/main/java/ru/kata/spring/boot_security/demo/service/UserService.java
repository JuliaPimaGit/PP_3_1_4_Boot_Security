package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;
import java.util.Set;

public interface UserService {
    List<User> allUsers();



    void add(User user, String [] newRoles);

    void delete(Long id);

    User getUserById(Long id);

    void update(User user, String [] editRoles);

    User findUserByFirstName(String name);

}

