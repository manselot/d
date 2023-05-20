package com.asker.asker.model;


import org.testng.annotations.Test;

import java.util.ArrayList;

public class Room {
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
    public String generationId(){
        Integer a  = (int) (Math.random()*2000000);
        while(Ids.contains(a)) {
            a = (int) (Math.random() * 2000000);
        }
       Ids.add(a);
       return String.valueOf(a);
    }
    public boolean roomisCreated(int id){
        return Ids.contains(id);
    }

    String id;
    ArrayList<Integer> Ids = new ArrayList();


}


