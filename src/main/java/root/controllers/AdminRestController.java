package root.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import root.entities.User;
import root.exceptions.UserNotFoundErrorException;
import root.exceptions.ValidationErrorException;
import root.services.UserService;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping(path = "/api")
public class AdminRestController {

    private final UserService userService;

    @Autowired
    public AdminRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping(path = "/users")
    public List<User> getUsers() {
        return userService.getUsers();
    }

    @GetMapping(path = "/users/{id}")
    public User getUser(@PathVariable(name = "id") Long id, HttpServletRequest request) {

        User user = userService.getUserById(id);
        if (user == null) {
            throw new UserNotFoundErrorException(
                    id, "Пользователь с ID " + id + " не найден", request.getRequestURI());
        }
        return user;
    }

    @PostMapping(path = "/users")
    public User saveUser(HttpServletRequest request,
                         @RequestBody @Valid User user, BindingResult bindingResult) {

        userService.validateEmail(user.getEmail(), bindingResult);
        if (bindingResult.hasFieldErrors()) {
            throw new ValidationErrorException(
                    "Ошибка валидации пользователя", bindingResult, request.getRequestURI());
        }
        userService.save(user);
        return user;
    }
}
