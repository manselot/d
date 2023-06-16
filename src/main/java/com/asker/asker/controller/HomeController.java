package com.asker.asker.controller;

import com.asker.asker.model.Message;
import com.asker.asker.model.OutputMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.Random;

import com.asker.asker.model.Room;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.view.RedirectView;

@Controller
public class HomeController {
    Room room = new Room();
    @Value("${upload.path}")
    private static String uploadPath;

    @GetMapping("/load/{id}")
    @ResponseBody
    public ResponseEntity<Resource> load(@PathVariable String id) throws IOException {

        File filename = new File("src/main/resources/temp/" + id +".mp4");
        Resource resource = new UrlResource(filename.toURI());
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + filename.getName() + "\"").body(resource);

    }
    @PostMapping("/upload/{id}")
    public String upload(@PathVariable String id,
                       @RequestParam("file") MultipartFile multipartFile) throws IOException {
        if (!multipartFile.isEmpty()) {


                byte[] bytes = multipartFile.getBytes();
                File f = new File("src/main/resources/temp/" + id);
                BufferedOutputStream stream =
                        new BufferedOutputStream(new FileOutputStream(("src/main/resources/temp/" + id +".mp4")));
                stream.write(bytes);
                stream.close();
                return "video";

        }
        return "index";
    }
    @GetMapping("/Create")
    public RedirectView CreateRoom(Model model){
        String id = room.generationId();
        while (!room.roomisCreated(Integer.parseInt(id))) {
            id = room.generationId();
        }
        model.addAttribute("id", id);
        return new RedirectView("http://localhost:8080/Join/"+id);
    }

    @GetMapping("/Join/{id}")
    public String CreateRoom(@PathVariable String id, Model model) throws InterruptedException {
        File dir = new File("file:/C:/Users/as/Desktop/glek18/"+ id);
        try {
            for (File item : dir.listFiles()) {
                model.addAttribute("id", id);
                model.addAttribute("name", item.getName());
                model.addAttribute("vid", "../temp/" + id +"/" + item.getName());
            }
        }catch (Exception e){
            System.out.println("error");
            return "video";
        }
        return "video";
    }


    @GetMapping("/p")
    public String d(){

        return "ABOBA";
    }

    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public OutputMessage send(final Message message) throws Exception {

        return new OutputMessage(message.getText(),message.getCurrentTime(),message.getRoom());
    }

}
