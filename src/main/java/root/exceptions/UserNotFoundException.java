package root.exceptions;

public class UserNotFoundException extends RuntimeException {
    private final Long userId;
    private final String path;

    public UserNotFoundException(Long userId, String path) {
        super("Пользователь с ID (" + userId + ") не найден");
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
