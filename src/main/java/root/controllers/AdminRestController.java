package root.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import root.entities.User;
import root.exceptions.UserNotFoundErrorException;
import root.exceptions.ValidationErrorException;
import root.services.UserService;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

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

        return Optional.ofNullable(userService.getUserById(id))
                .orElseThrow(() -> new UserNotFoundErrorException(id, request.getRequestURI()));
    }

    @PostMapping(path = "/users")
    public User saveUser(HttpServletRequest request,
                         @RequestBody @Valid User user, BindingResult bindingResult) {

        userService.validateEmail(user.getEmail(), bindingResult);
        if (bindingResult.hasFieldErrors()) {
            throw new ValidationErrorException(bindingResult, request.getRequestURI());
        }
        userService.save(user);

        return user;
    }

    @PatchMapping(path = "/users/{id}")
    public User editUser(HttpServletRequest request,
                         @PathVariable(name = "id") Long id,
                         @RequestBody @Valid User user, BindingResult bindingResult) {

        User updatedUser = Optional.ofNullable(userService.getUserById(id))
                .orElseThrow(() -> new UserNotFoundErrorException(id, request.getRequestURI()));

        user.setId(id);

        String newEmail = user.getEmail();
        if (!updatedUser.getEmail().equals(newEmail)) {
            userService.validateEmail(newEmail, bindingResult);
        }

        if (bindingResult.hasFieldErrors()) {
            throw new ValidationErrorException(bindingResult, request.getRequestURI());
        }

        userService.update(user);

        return user;
    }

    @DeleteMapping(path = "/users/{id}")
    public void deleteUser(HttpServletRequest request, HttpServletResponse response,
                           @PathVariable(name = "id") Long id,
                           Authentication authentication) throws ServletException, IOException {

        if (userService.getUserById(id) == null) {
            throw new UserNotFoundErrorException(id, request.getRequestURI());
        }

        if (authentication != null
                && userService.getUserByEmail(authentication.getName()).getId().equals(id)) {

            request.logout();
            response.sendRedirect("/login?logout");
        }

        userService.delete(id);
    }
}
