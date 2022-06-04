package root.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class RequestExceptionHandler {

    @ExceptionHandler
    public ResponseEntity<UserNotFoundError> handleUserNotFoundException(UserNotFoundErrorException exception) {

        return new ResponseEntity<>(
                new UserNotFoundError(exception.getUserId(), exception.getMessage(), exception.getPath()),
                HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler
    public ResponseEntity<ValidationError> handleValidationErrorException(ValidationErrorException exception) {
        Map<String, String> fieldErrors = new HashMap<>();

        exception.getBindingResult().getFieldErrors().forEach(fieldError ->
                fieldErrors.put(fieldError.getField(), fieldError.getDefaultMessage()));

        return new ResponseEntity<>(
                new ValidationError(fieldErrors, exception.getMessage(), exception.getPath()),
                HttpStatus.BAD_REQUEST);
    }
}
