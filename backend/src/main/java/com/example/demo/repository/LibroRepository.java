package com.example.demo.repository;

import com.example.demo.model.Libro; // Importamos clase libro
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LibroRepository extends JpaRepository<Libro, Long> {

}