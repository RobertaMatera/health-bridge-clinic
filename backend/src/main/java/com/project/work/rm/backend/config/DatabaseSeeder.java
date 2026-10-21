package com.project.work.rm.backend.config;

import com.project.work.rm.backend.enums.ReportStatus;
import com.project.work.rm.backend.enums.UserRole;
import com.project.work.rm.backend.model.Exam;
import com.project.work.rm.backend.model.Report;
import com.project.work.rm.backend.model.User;
import com.project.work.rm.backend.repository.ReportsRepository;
import com.project.work.rm.backend.repository.UsersRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Seeds demo users and reports in every lifecycle state on an empty database.
 * Timestamps are backdated so the statistics page has meaningful history.
 */
@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements ApplicationRunner {
    private final PasswordEncoder passwordEncoder;
    private final UsersRepository usersRepository;
    private final ReportsRepository reportsRepository;
    private final EntityManager entityManager;
    private final Clock clock;

    private record SeedExam(String analysis, String unitOfMeasure, float value, Float refMin, Float refMax) {
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (usersRepository.count() > 0) {
            return;
        }

        User massari = user("Giuseppe", "Massari", "g.massari@gmail.com", "patient1", UserRole.PATIENT);
        User spagnoli = user("Luisa", "Spagnoli", "spagnoli.luisa@libero.it", "patient2", UserRole.PATIENT);
        User colombo = user("Anna", "Colombo", "a.colombo@mail.it", "patient3", UserRole.PATIENT);
        User ferri = user("Marco", "Ferri", "m.ferri@mail.it", "patient4", UserRole.PATIENT);
        User greco = user("Sara", "Greco", "s.greco@mail.it", "patient5", UserRole.PATIENT);
        User bianchi = user("Paolo", "Bianchi", "p.bianchi@mail.it", "patient6", UserRole.PATIENT);
        User rossi = user("Claudia", "Rossi", "claudiarossi@gmail.com", "doctor1", UserRole.DOCTOR);
        User poi = user("Giorgio", "Poi", "g.poi@gmail.com", "doctor2", UserRole.DOCTOR);

        report(ferri, poi, ReportStatus.FINALIZED, Duration.ofDays(36), Duration.ofDays(33),
                "Emocromo e funzionalità renale nella norma. Nessun intervento necessario.",
                new SeedExam("Emoglobina", "g/dL", 14.8f, 13f, 17f),
                new SeedExam("Globuli bianchi", "10^3/µL", 6.2f, 4f, 10f),
                new SeedExam("Piastrine", "10^3/µL", 250f, 150f, 400f),
                new SeedExam("Glicemia a digiuno", "mg/dL", 88f, 70f, 99f),
                new SeedExam("Creatinina", "mg/dL", 1.0f, 0.7f, 1.3f));

        report(spagnoli, rossi, ReportStatus.FINALIZED, Duration.ofDays(26), Duration.ofDays(23),
                "Glicemia lievemente sopra il limite. Consiglio una dieta a basso indice glicemico e un nuovo controllo tra 3 mesi.",
                new SeedExam("Glicemia a digiuno", "mg/dL", 104f, 70f, 99f),
                new SeedExam("Emoglobina glicata", "%", 5.6f, 4f, 5.7f));

        report(bianchi, rossi, ReportStatus.FINALIZED, Duration.ofDays(19), Duration.ofDays(16),
                "Carenza di vitamina D. Prescrivo un'integrazione per 8 settimane, poi ripeteremo il dosaggio.",
                new SeedExam("Vitamina D (25-OH)", "ng/mL", 18f, 30f, 100f),
                new SeedExam("Ferritina", "ng/mL", 45f, 30f, 400f),
                new SeedExam("Calcio", "mg/dL", 9.4f, 8.6f, 10.2f));

        // Finalized a few hours ago, so "finalized this week" is never empty in the demo.
        report(massari, poi, ReportStatus.FINALIZED, Duration.ofDays(3), Duration.ofHours(2),
                "I valori sono nella norma. Continui con l'alimentazione e l'attività fisica attuali; ripeteremo il controllo tra 12 mesi.",
                new SeedExam("Glicemia a digiuno", "mg/dL", 92f, 70f, 99f),
                new SeedExam("Colesterolo totale", "mg/dL", 180f, null, 200f),
                new SeedExam("Trigliceridi", "mg/dL", 120f, null, 150f),
                new SeedExam("Emoglobina", "g/dL", 14.2f, 13f, 17f));

        report(massari, poi, ReportStatus.IN_PROGRESS, Duration.ofDays(5), null, null,
                new SeedExam("Colesterolo totale", "mg/dL", 198f, null, 200f),
                new SeedExam("Colesterolo LDL", "mg/dL", 120f, null, 100f),
                new SeedExam("Colesterolo HDL", "mg/dL", 50f, 40f, null));

        report(colombo, poi, ReportStatus.IN_PROGRESS, Duration.ofHours(30), null, null,
                new SeedExam("TSH", "mIU/L", 5.1f, 0.4f, 4f),
                new SeedExam("FT4", "ng/dL", 1.1f, 0.9f, 1.7f));

        report(spagnoli, poi, ReportStatus.CREATED, Duration.ofDays(2), null, null);

        report(greco, poi, ReportStatus.CREATED, Duration.ofHours(3), null, null);
    }

    private User user(String firstName, String lastName, String email, String password, UserRole role) {
        return usersRepository.save(User
                .builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(role)
                .build());
    }

    private void report(User patient, User doctor, ReportStatus status, Duration createdAgo, Duration finalizedAgo,
                        String outcome, SeedExam... seedExams) {
        LocalDateTime now = LocalDateTime.now(clock);
        LocalDateTime createdAt = now.minus(createdAgo);
        LocalDateTime finalizedAt = finalizedAgo == null ? null : now.minus(finalizedAgo);

        Report report = new Report();
        report.setPatient(patient);
        report.setCreatedBy(doctor);
        report.setStatus(status);
        report.setOutcome(outcome);
        for (SeedExam seedExam : seedExams) {
            Exam exam = new Exam();
            exam.setAnalysis(seedExam.analysis());
            exam.setUnitOfMeasure(seedExam.unitOfMeasure());
            exam.setExamValue(seedExam.value());
            exam.setRefMin(seedExam.refMin());
            exam.setRefMax(seedExam.refMax());
            exam.setReport(report);
            report.getExams().add(exam);
        }
        Report saved = reportsRepository.saveAndFlush(report);

        // Exams are spread evenly between creation and finalization (or now).
        LocalDateTime end = finalizedAt != null ? finalizedAt : now;
        Duration step = Duration.between(createdAt, end).dividedBy(seedExams.length + 1L);
        LocalDateTime lastChange = createdAt;
        List<Exam> exams = saved.getExams();
        for (int i = 0; i < exams.size(); i++) {
            lastChange = createdAt.plus(step.multipliedBy(i + 1L));
            backdate("Exam", exams.get(i).getId(), lastChange, lastChange, null);
        }
        backdate("Report", saved.getId(), createdAt, finalizedAt != null ? finalizedAt : lastChange, finalizedAt);
    }

    // Auditing stamps every insert with "now", so the history is rewritten with a bulk update afterwards.
    private void backdate(String entity, Long id, LocalDateTime createdAt, LocalDateTime updatedAt, LocalDateTime finalizedAt) {
        String finalizedClause = "Report".equals(entity) ? ", e.finalizedAt = :finalizedAt" : "";
        var query = entityManager
                .createQuery("update " + entity + " e set e.createdAt = :createdAt, e.updatedAt = :updatedAt"
                        + finalizedClause + " where e.id = :id")
                .setParameter("createdAt", createdAt)
                .setParameter("updatedAt", updatedAt)
                .setParameter("id", id);
        if (!finalizedClause.isEmpty()) {
            query.setParameter("finalizedAt", finalizedAt);
        }
        query.executeUpdate();
    }
}
