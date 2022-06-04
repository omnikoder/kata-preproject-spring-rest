package root.exceptions;

import org.springframework.validation.BindingResult;

public class ValidationErrorException extends RuntimeException {

    private final BindingResult bindingResult;
    private final String path;

    public ValidationErrorException(String message, BindingResult bindingResult, String path) {
        super(message);
        this.bindingResult = bindingResult;
        this.path = path;
    }

    public BindingResult getBindingResult() {
        return bindingResult;
    }

    public String getPath() {
        return path;
    }
}
