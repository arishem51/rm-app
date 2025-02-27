package gr4.example;


public class GradeCalculator {
    /**
     * Tính điểm trung bình từ danh sách điểm thi
     */
    public double calculateAverage(double[] scores) {
        if (scores == null || scores.length == 0) {
            return 0.0;
        }
        double sum = 0;
        for (double score : scores) {
            if (score < 0 || score > 100) {
                throw new IllegalArgumentException("Score must be between 0 and 100");
            }

            sum += score;

        }
        return sum / scores.length;
    }



    /**
     * Xếp loại học sinh dựa trên điểm trung bình
     */
    public String calculateGrade(double average) {
        if (average < 0 || average > 100) {
            return "Invalid";
        }
        if (average >= 90) {
            return "A";
        } else if (average >= 80) {
            return "B";
        } else if (average >= 70) {
            return "C";
        } else if (average >= 60) {
            return "D";
        } else {
            return "F";
        }

    }
    public String evaluateStudentStatus(double average, int absences) {
        if (absences < 0) {
            return "Invalid absences";
        }



        String grade = calculateGrade(average);
        switch (grade) {
            case "A":
                return absences <= 2 ? "Excellent" : "Good";
            case "B":
                return absences <= 3 ? "Good" : "Average";
            case "C":
            case "D":
                return absences <= 5 ? "Average" : "Needs Improvement";
            case "F":
                return "Fail";
            default:
                return "Invalid grade";
        }

    }

}





