package root.exceptions;

public class UserNotFoundErrorException extends RuntimeException {
    private final Long userId;
    private final String path;

    public UserNotFoundErrorException(Long userId, String message, String path) {
        super(message);
        this.userId = userId;
        this.path = path;
    }

    public Long getUserId() {
        return userId;
    }

    public String getPath() {
        return path;
    }
}
