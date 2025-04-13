package com.example.backend.chatgpt.controller;

import com.example.backend.chatgpt.service.ChatGptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chatgpt")
public class ChatGptController {

    @Autowired
    private ChatGptService chatGptService;

    @GetMapping("/test")
    public String test() {
        return chatGptService.callChatGPT("농담 부탁해!");
    }
}
