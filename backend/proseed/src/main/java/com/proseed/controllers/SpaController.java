package com.proseed.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController {

    // Forward all paths without a dot (so static assets still load) to index.html
    @RequestMapping({"/{path:[^\\.]*}", "/**/{path:[^\\.]*}"})
    public String forward() {
        return "forward:/index.html";
    }
}
