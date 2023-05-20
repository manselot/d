package com.asker.asker.model;

public class OutputMessage {

    private String text;

    private double currentTime;

    private int room;


    public OutputMessage(final String text,final double currentTime,final int room) {
        this.room = room;
        this.text = text;
        this.currentTime = currentTime;
    }

    public String getText() {
        return text;
    }
    public double getCurrentTime() {
        return currentTime;
    }

}
