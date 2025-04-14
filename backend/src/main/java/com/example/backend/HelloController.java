package com.example.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/java")
public class HelloController {

    @GetMapping("/")
    public String hello() {
        return "Hello, world! 3";
    }

    @GetMapping("/next")
    public String next() {
        return "Next Route TEST ! ";
    }
}

