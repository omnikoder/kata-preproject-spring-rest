package root.exceptions;

public record UserNotFoundError(Long userId, String message, String path) {
}
