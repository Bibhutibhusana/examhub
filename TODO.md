# TODO: Store Exam Information in Firebase  
  
## Tasks  
- [x] Update ExamCreate.jsx: Load questions from JSON file and store each in Firestore 'questions' collection with examId.
- [x] Update examApi.js: Remove local asset loading, always fetch questions via API.
- [x] Update functions/index.js: Verify and ensure questions endpoint properly fetches questions from Firestore.
- [ ] Test: Create an exam, verify questions stored in Firestore, and fetching works in ExamPlayer.
