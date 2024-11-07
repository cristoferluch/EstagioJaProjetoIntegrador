package com.example.estagioja.estagioja.exception;

public class JobException extends Exception {

    public JobException(String message) {
        super(message);
    }

    public JobException(String message, Throwable cause) {
        super(message, cause);
    }
}
