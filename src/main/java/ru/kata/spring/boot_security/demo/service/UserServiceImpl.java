package ru.kata.spring.boot_security.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.UserRepository;

import java.util.List;
import java.util.Set;


@Transactional
@Service
public class UserServiceImpl implements UserService, UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleService roleService;


    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, RoleService roleService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleService = roleService;

    }

    @Override
    public List<User> allUsers() {
        return (List<User>) userRepository.findAll();
    }

    @Override
    public void add(User user,  String[] newRoles) {
        for (String role : newRoles) {
            user.setOneRole(roleService.getRoleByRole(role));
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

    }

    @Override
    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public void update(User user, String [] editRoles) {
        String passwordFromForm = user.getPassword();
        String encodedPasswordFromBase = userRepository.getById(user.getId()).getPassword();
        if (passwordFromForm.equals(encodedPasswordFromBase)) {
            user.setPassword(encodedPasswordFromBase);
        } else {
            if (passwordEncoder.matches(passwordFromForm, encodedPasswordFromBase)) {
                user.setPassword(encodedPasswordFromBase);
            } else {
                user.setPassword(passwordEncoder.encode(passwordFromForm));
            }
        }
        for (String role : editRoles) {
            user.setOneRole(roleService.getRoleByRole(role));
        }
        userRepository.save(user);
    }

    @Override
    public User findUserByFirstName(String firstName) {
        return userRepository.findUserByFirstName(firstName);
    }


    @Override
    public UserDetails loadUserByUsername(String firstName) throws UsernameNotFoundException {
        UserDetails user = userRepository.findUserByFirstName(firstName);
        if (user == null) {
            throw new UsernameNotFoundException("Couldn't find user by this name");
        }
        return user;
    }
}

