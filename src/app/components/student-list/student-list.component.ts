import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {

  students: any[] = [];

  newStudent = {
    name: '',
    rollNumber: '',
    department: '',
    email: '',
    phone: ''
  };

  errorMessage = '';

    isEditMode = false;
  selectedStudentId: number | null = null;


  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.studentService.getStudents().subscribe({
      next: (data) => this.students = data,
      error: () => this.errorMessage = 'Failed to load students'
    });
  }

  addStudent(): void {
    this.errorMessage = '';

    this.studentService.rollNumberExists(this.newStudent.rollNumber)
      .subscribe({
        next: (exists: boolean) => {
          if (exists) {
            this.errorMessage = '❌ Roll Number already exists!';
            return;
          }

          this.studentService.addStudent(this.newStudent).subscribe({
            next: () => {
              this.loadStudents();
              this.newStudent = {
                name: '',
                rollNumber: '',
                department: '',
                email: '',
                phone: ''
              };
            },
            error: () => this.errorMessage = 'Error adding student'
          });
        },
        error: () => this.errorMessage = 'Error checking roll number'
      });
  }
  editStudent(student: any): void {
  this.isEditMode = true;
  this.selectedStudentId = student.studentId;

  this.newStudent = {
    name: student.name,
    rollNumber: student.rollNumber,
    department: student.department,
    email: student.email,
    phone: student.phone
  };
}


  // ✅ DELETE METHOD (SEPARATE)
  deleteStudent(id: number): void {
    if (!confirm('Are you sure you want to delete this student?')) {
      return;
    }

    this.studentService.deleteStudent(id).subscribe({
      next: () => this.loadStudents(),
      error: () => this.errorMessage = 'Error deleting student'
    });
  }
}
