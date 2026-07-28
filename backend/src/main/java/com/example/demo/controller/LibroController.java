package com.example.demo.controller;

import com.example.demo.model.Libro;
import com.example.demo.service.LibroService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/libros")
public class LibroController {

    private final LibroService libroService;

    // Inyectamos el servicio que creamos
    public LibroController(LibroService libroService) {
        this.libroService = libroService;
    }

    // GET: http://localhost:8080/api/libros
    @GetMapping
    public ResponseEntity<List<Libro>> listarTodos() {
        return ResponseEntity.ok(libroService.obtenerTodos()); // Devuelve 200 OK
    }

    // GET: http://localhost:8080/api/libros/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Libro> obtenerPorId(@PathVariable Long id) {
        return libroService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build()); // Devuelve 404 si no existe
    }

    // POST: http://localhost:8080/api/libros
    @PostMapping
    public ResponseEntity<Libro> crearLibro(@RequestBody Libro libro) {
        Libro nuevoLibro = libroService.guardarLibro(libro);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoLibro); // Devuelve 201 Created
    }

    // PUT: http://localhost:8080/api/libros/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Libro> actualizarLibro(@PathVariable Long id, @RequestBody Libro libro) {
        try {
            Libro libroActualizado = libroService.actualizarLibro(id, libro);
            return ResponseEntity.ok(libroActualizado); // Devuelve 200 OK
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // Devuelve 404 si el ID no existe
        }
    }

    // DELETE: http://localhost:8080/api/libros/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarLibro(@PathVariable Long id) {
        try {
            libroService.eliminarLibro(id);
            return ResponseEntity.noContent().build(); // Devuelve 204 No Content (eliminado con éxito)
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // Devuelve 404 si el ID no existe
        }
    }
}
