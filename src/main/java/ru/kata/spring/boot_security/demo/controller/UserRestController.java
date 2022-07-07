package ru.kata.spring.boot_security.demo.controller;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kata.spring.boot_security.demo.model.User;


@RestController
@RequestMapping("/user/logIn")
public class UserRestController {

    @GetMapping
    public User userPage(@AuthenticationPrincipal User user) {
       return user;
    }
}
