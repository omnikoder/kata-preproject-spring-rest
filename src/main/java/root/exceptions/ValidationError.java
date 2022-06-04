package root.exceptions;

import java.util.Map;

public record ValidationError(Map<String, String> fields, String message, String path) {
}
