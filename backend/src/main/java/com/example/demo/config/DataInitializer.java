package com.example.demo.config;

import com.example.demo.model.Libro;
import com.example.demo.repository.LibroRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDatabase(LibroRepository repository) {
        return args -> {
            // Si la base de datos está vacía, pre-guardamos los datos
            if (repository.count() == 0) {
                repository.saveAll(List.of(
                        new Libro(null, "Cien años de soledad", "Gabriel García Márquez", "978-8437604947", new BigDecimal("15000.0"), LocalDate.of(1967, 5, 30)),
                        new Libro(null, "Don Quijote de la Mancha", "Miguel de Cervantes", "978-8424116274", new BigDecimal("12500.0"), LocalDate.of(1605, 1, 16)),
                        new Libro(null, "El Principito", "Antoine de Saint-Exupéry", "978-0156012195", new BigDecimal("8900.0"), LocalDate.of(1943, 4, 6)),
                        new Libro(null, "1984", "George Orwell", "978-0451524935", new BigDecimal("11200.0"), LocalDate.of(1949, 6, 8)),
                        new Libro(null, "Ficciones", "Jorge Luis Borges", "978-8420633126", new BigDecimal("10500.0"), LocalDate.of(1944, 1, 1))
                ));
                System.out.println("DATOS PREGUARDADOS CARGADOS CON ÉXITO.");
            } else {
                System.out.println("ℹLa base de datos ya contenía información. No se pre-cargaron datos.");
            }
        };
    }
}