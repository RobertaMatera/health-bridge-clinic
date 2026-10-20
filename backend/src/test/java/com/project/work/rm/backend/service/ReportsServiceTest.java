package com.project.work.rm.backend.service;

import com.project.work.rm.backend.dto.ExamDTO;
import com.project.work.rm.backend.dto.ReportDTO;
import com.project.work.rm.backend.dto.UserDTO;
import com.project.work.rm.backend.enums.ReportStatus;
import com.project.work.rm.backend.exception.BusinessRuleException;
import com.project.work.rm.backend.exception.ErrorCode;
import com.project.work.rm.backend.exception.ResourceNotFoundException;
import com.project.work.rm.backend.model.User;
import com.project.work.rm.backend.repository.UsersRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Lifecycle rules of a report (RF02-RF05, RF09). Runs against the real mappers and an in-memory
 * database because the status transitions live partly in ReportsMapper. Users come from the seeder.
 */
@SpringBootTest
@Transactional
class ReportsServiceTest {

    private static final String PATIENT = "g.massari@gmail.com";
    private static final String OTHER_PATIENT = "spagnoli.luisa@libero.it";
    private static final String DOCTOR = "g.poi@gmail.com";

    @Autowired
    private ReportsService reportsService;

    @Autowired
    private ExamsService examsService;

    @Autowired
    private UsersRepository usersRepository;

    @BeforeEach
    void signInAsDoctor() {
        signInAs(DOCTOR);
    }

    @AfterEach
    void signOut() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void createdReportStartsInCreatedStatusWithPatientAndAuthor() {
        ReportDTO report = reportsService.create(reportFor(PATIENT, null));

        assertThat(report.getStatus()).isEqualTo(ReportStatus.CREATED);
        assertThat(report.getPatient().getEmail()).isEqualTo(PATIENT);
        assertThat(report.getCreatedBy().getEmail()).isEqualTo(DOCTOR);
        assertThat(report.getFinalizedAt()).isNull();
    }

    @Test
    void reportCannotBeCreatedForUnknownUserOrDoctor() {
        assertThatThrownBy(() -> reportsService.create(reportFor("nobody@example.com", null)))
                .isInstanceOfSatisfying(ResourceNotFoundException.class,
                        ex -> assertThat(ex.getCode()).isEqualTo(ErrorCode.PATIENT_NOT_FOUND));
        assertThatThrownBy(() -> reportsService.create(reportFor(DOCTOR, null)))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void reportCannotBeCreatedWithoutPatient() {
        assertThatThrownBy(() -> reportsService.create(new ReportDTO()))
                .isInstanceOfSatisfying(BusinessRuleException.class,
                        ex -> assertThat(ex.getCode()).isEqualTo(ErrorCode.PATIENT_REQUIRED));
    }

    @Test
    void addingTheFirstExamMovesTheReportInProgress() {
        ReportDTO report = reportsService.create(reportFor(PATIENT, null));

        ReportDTO updated = reportsService.createExam(report.getId(), exam("LDL", 120f, null, 100f));

        assertThat(updated.getStatus()).isEqualTo(ReportStatus.IN_PROGRESS);
        assertThat(updated.getExams()).singleElement().satisfies(exam -> {
            assertThat(exam.getRefMax()).isEqualTo(100f);
            assertThat(exam.getRefMin()).isNull();
        });
    }

    @Test
    void finalizationRequiresAtLeastOneExam() {
        ReportDTO report = reportsService.create(reportFor(PATIENT, null));

        assertThatThrownBy(() -> reportsService.finalize(report.getId(), reportFor(PATIENT, "Outcome")))
                .isInstanceOfSatisfying(BusinessRuleException.class,
                        ex -> assertThat(ex.getCode()).isEqualTo(ErrorCode.REPORT_MISSING_EXAMS));
    }

    @Test
    void finalizationRequiresANonBlankOutcome() {
        ReportDTO report = reportsService.create(reportFor(PATIENT, null));
        reportsService.createExam(report.getId(), exam("HDL", 50f, 40f, null));

        assertThatThrownBy(() -> reportsService.finalize(report.getId(), reportFor(PATIENT, "   ")))
                .isInstanceOfSatisfying(BusinessRuleException.class,
                        ex -> assertThat(ex.getCode()).isEqualTo(ErrorCode.REPORT_MISSING_OUTCOME));
    }

    @Test
    void validReportIsFinalizedWithTimestamp() {
        ReportDTO report = reportsService.create(reportFor(PATIENT, null));
        reportsService.createExam(report.getId(), exam("HDL", 50f, 40f, null));

        ReportDTO finalized = reportsService.finalize(report.getId(), reportFor(PATIENT, "All values are normal."));

        assertThat(finalized.getStatus()).isEqualTo(ReportStatus.FINALIZED);
        assertThat(finalized.getFinalizedAt()).isNotNull();
        assertThat(finalized.getOutcome()).isEqualTo("All values are normal.");
    }

    @Test
    void finalizedReportIsImmutable() {
        ReportDTO finalized = finalizedReport();
        Long examId = finalized.getExams().getFirst().getId();

        assertNotEditable(() -> reportsService.update(finalized.getId(), reportFor(PATIENT, "Changed")));
        assertNotEditable(() -> reportsService.finalize(finalized.getId(), reportFor(PATIENT, "Again")));
        assertNotEditable(() -> reportsService.createExam(finalized.getId(), exam("LDL", 90f, null, 100f)));
        assertNotEditable(() -> examsService.update(examId, exam("HDL", 60f, 40f, null)));
        assertNotEditable(() -> examsService.delete(examId));
    }

    @Test
    void patientCanReadOnlyTheirOwnReports() {
        ReportDTO report = reportsService.create(reportFor(PATIENT, null));

        signInAs(PATIENT);
        assertThat(reportsService.getReportById(report.getId()).getId()).isEqualTo(report.getId());

        signInAs(OTHER_PATIENT);
        assertThatThrownBy(() -> reportsService.getReportById(report.getId()))
                .isInstanceOfSatisfying(ResourceNotFoundException.class,
                        ex -> assertThat(ex.getCode()).isEqualTo(ErrorCode.REPORT_NOT_FOUND));
        assertThat(reportsService.getAll()).noneMatch(dto -> dto.getId().equals(report.getId()));
    }

    @Test
    void unknownReportIsNotFound() {
        assertThatThrownBy(() -> reportsService.getReportById(Long.MAX_VALUE))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    private ReportDTO finalizedReport() {
        ReportDTO report = reportsService.create(reportFor(PATIENT, null));
        reportsService.createExam(report.getId(), exam("HDL", 50f, 40f, null));
        return reportsService.finalize(report.getId(), reportFor(PATIENT, "Done."));
    }

    private static void assertNotEditable(org.assertj.core.api.ThrowableAssert.ThrowingCallable call) {
        assertThatThrownBy(call)
                .isInstanceOfSatisfying(BusinessRuleException.class,
                        ex -> assertThat(ex.getCode()).isEqualTo(ErrorCode.REPORT_NOT_EDITABLE));
    }

    private void signInAs(String email) {
        User user = usersRepository.findByEmail(email).orElseThrow();
        SecurityContextHolder.getContext()
                .setAuthentication(new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities()));
    }

    private static ReportDTO reportFor(String patientEmail, String outcome) {
        UserDTO patient = new UserDTO();
        patient.setEmail(patientEmail);
        ReportDTO report = new ReportDTO();
        report.setPatient(patient);
        report.setOutcome(outcome);
        return report;
    }

    private static ExamDTO exam(String analysis, Float value, Float refMin, Float refMax) {
        ExamDTO exam = new ExamDTO();
        exam.setAnalysis(analysis);
        exam.setUnitOfMeasure("mg/dL");
        exam.setExamValue(value);
        exam.setRefMin(refMin);
        exam.setRefMax(refMax);
        return exam;
    }
}
