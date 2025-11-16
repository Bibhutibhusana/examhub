# TODO: Modify Manage Exams Tab in Admin Dashboard

## Steps to Complete:
1. Update state variables in AdminDashboard.jsx: Add selectedMedium, keep selectedClass, selectedExamType, selectedSubject (for subjectwise), selectedFile.
2. Replace the manageExams tab content: Remove ExamCreate, exam-upload-section, paid-exam-upload-section.
3. Add new selects: Medium (Odia/English), Class (list of classes), Exam Type (Set Wise/Subject Wise).
4. Add conditional subject select: Show only if examType is 'subjectwise'.
5. Add file upload input for JSON.
6. Update handleFileUpload: Read JSON file content, store directly in Firestore 'exams' collection with fields: medium, class, examType, subject (if applicable), questions (JSON), uploadedAt, uploadedBy.
7. Test the upload functionality to ensure questions are stored correctly in Firestore.
