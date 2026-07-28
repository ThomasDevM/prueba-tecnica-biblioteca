package com.example.demo.service;

import com.example.demo.model.Libro;
import com.example.demo.repository.LibroRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LibroService {

    private final LibroRepository libroRepository;

    // Inyección con Spring (Constructor)
    public LibroService(LibroRepository libroRepository) {
        this.libroRepository = libroRepository;
    }

    // 1. Listar todos (Read)
    public List<Libro> obtenerTodos() {
        return libroRepository.findAll();
    }

    // 2. Obtener por ID (Read)
    public Optional<Libro> obtenerPorId(Long id) {
        return libroRepository.findById(id);
    }

    // 3. Crear (Create)
    public Libro guardarLibro(Libro libro) {
        return libroRepository.save(libro);
    }

    // 4. Actualizar (Update)
    public Libro actualizarLibro(Long id, Libro libroActualizado) {
        return libroRepository.findById(id)
                .map(libroExistente -> {
                    libroExistente.setTitulo(libroActualizado.getTitulo());
                    libroExistente.setAutor(libroActualizado.getAutor());
                    libroExistente.setIsbn(libroActualizado.getIsbn());
                    libroExistente.setPrecio(libroActualizado.getPrecio());
                    libroExistente.setFechaPublicacion(libroActualizado.getFechaPublicacion());
                    return libroRepository.save(libroExistente);
                }).orElseThrow(() -> new RuntimeException("Libro no encontrado con ID: " + id));
        // Más adelante mejoraremos el manejo de excepciones como pide el documento
    }

    // 5. Eliminar (Delete)
    public void eliminarLibro(Long id) {
        if (libroRepository.existsById(id)) {
            libroRepository.deleteById(id);
        } else {
            throw new RuntimeException("Libro no encontrado con ID: " + id);
        }
    }
}
