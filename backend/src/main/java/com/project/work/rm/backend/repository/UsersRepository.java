package com.project.work.rm.backend.repository;

import java.util.List;
import java.util.Optional;

import com.project.work.rm.backend.enums.UserRole;
import com.project.work.rm.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    List<User> findByRole(UserRole role);

    long countByRole(UserRole role);
}
