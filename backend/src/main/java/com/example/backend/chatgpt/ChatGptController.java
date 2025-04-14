package com.example.backend.chatgpt.controller;

import com.example.backend.chatgpt.service.ChatGptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/java/chatgpt")
public class ChatGptController {

    @Autowired
    private ChatGptService chatGptService;

    @GetMapping("/")
    public String test() {
        return chatGptService.callChatGPT("농담 부탁해!");
    }
}
