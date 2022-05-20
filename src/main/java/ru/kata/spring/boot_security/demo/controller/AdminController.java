package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.Set;


@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }




    @GetMapping
    public String adminPage(@AuthenticationPrincipal UserDetails userDetails, Model model) {
        model.addAttribute("list", userService.allUsers());
        model.addAttribute("user", userService.findUserByFirstName(userDetails.getUsername()));
        model.addAttribute("allRoles",roleService.getAllRoles());
        model.addAttribute("newUser", new User());
        return "all";
    }

    @PatchMapping ("/edit")
    public String updateUser(@RequestParam("roles") Set<Role> roles, User user, @RequestParam(value = "id") Long id) {
        user.setRoles(roles);
        userService.update(user);
        return "redirect:/admin";
    }

    @PostMapping("/new")
    public String saveUser(User newUser, @RequestParam("roles") Set<Role> roles) {
        newUser.setRoles(roles);
        userService.add(newUser);
        return "redirect:/admin";
    }

    @DeleteMapping("/delete")
    public String deleteUser(@RequestParam(value = "id") Long id) {
        userService.delete(id);
        return "redirect:/admin";
    }
}
