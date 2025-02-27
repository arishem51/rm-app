package gr4.example;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;
import java.util.stream.Stream;


import static org.junit.jupiter.api.Assertions.*;


class  GradeCalculatorTest {
    private final GradeCalculator calculator = new GradeCalculator();


    // Test cơ bản
    @Test
    void testCalculateAverageBasic() {
        double[] scores = {80, 90, 85};
        assertEquals(85.0, calculator.calculateAverage(scores), 0.01, "Average should be 85");
    }



    @Test
    void testCalculateAverageEmpty() {
        double[] scores = {};
        assertEquals(0.0, calculator.calculateAverage(scores), 0.01, "Empty array should return 0");
    }



    @Test
    void testCalculateAverageInvalidScore() {
        double[] scores = {80, 150, 90};
        assertThrows(IllegalArgumentException.class, () -> calculator.calculateAverage(scores),
                "Should throw exception for invalid score");
    }



    // Parameterized Test cho calculateGrade
    @ParameterizedTest
    @CsvSource({
            "95.0, A",
            "85.0, B",
            "75.0, C",
            "65.0, D",
            "55.0, F",
            "-1.0, Invalid",
            "101.0, Invalid"
    })
    void testCalculateGrade(double average, String expectedGrade) {
        assertEquals(expectedGrade, calculator.calculateGrade(average),
                "Grade for " + average + " should be " + expectedGrade);
    }



    // Parameterized Test cho evaluateStudentStatus với MethodSource
    @ParameterizedTest
    @MethodSource("provideStudentData")
    void testEvaluateStudentStatus(double average, int absences, String expectedStatus) {
        assertEquals(expectedStatus, calculator.evaluateStudentStatus(average, absences),
                "Status for average " + average + " and absences " + absences + " should be " + expectedStatus);
    }



    private static Stream<Object[]> provideStudentData() {
        return Stream.of(
                new Object[]{95.0, 1, "Excellent"},
                new Object[]{95.0, 3, "Good"},
                new Object[]{85.0, 2, "Good"},
                new Object[]{85.0, 4, "Average"},
                new Object[]{65.0, 4, "Average"},
                new Object[]{65.0, 6, "Needs Improvement"},
                new Object[]{45.0, 2, "Fail"},
                new Object[]{75.0, -1, "Invalid absences"}
        );

    }



    // Parameterized Test cho calculateAverage với ValueSource
    @ParameterizedTest
    @ValueSource(doubles = {0.0, 50.0, 100.0})
    void testCalculateAverageSingleScore(double score) {
        double[] scores = {score};
        assertEquals(score, calculator.calculateAverage(scores), 0.01,
                "Average of single score " + score + " should be " + score);
    }

}
