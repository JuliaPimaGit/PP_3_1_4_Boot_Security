package ru.kata.spring.boot_security.demo.seсurity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.annotation.PostConstruct;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataClass {
    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public DataClass(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @PostConstruct
    private void startDB() {
        User user = new User("user", 50, "Puma", "user");
        User admin = new User("admin", 0, "0", "admin");
        User userAdmin = new User("userAdmin", 1, "1", "userAdmin");
        Role userRole = new Role("ROLE_USER");
        Role adminRole = new Role("ROLE_ADMIN");
        Set<Role> userAdminRole = new HashSet<Role>();
        userAdminRole.add(adminRole);
        userAdminRole.add(userRole);
        roleService.addRole(userRole);
        roleService.addRole(adminRole);
        user.setOneRole(userRole);
        admin.setOneRole(adminRole);
        userAdmin.setRoles(userAdminRole);
        userService.add(user);
        userService.add(admin);
        userService.add(userAdmin);
    }
}

