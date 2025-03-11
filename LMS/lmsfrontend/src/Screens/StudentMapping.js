import React, { useState, useEffect } from 'react';
import Navbar from '../Navigation/Navbar';
import {
    GetAllCompanies,
    GetCoursesByCompany,
    GetTrainingsByCourseId,
    GetAllMappedAndUnMappedStudents
} from '../Services/getApiServices';
import { CreateStudentMapping } from '../Services/postApiServices';

const StudentMapping = () => {
    const [companies, setCompanies] = useState([]);
    const [courses, setCourses] = useState([]);
    const [trainings, setTrainings] = useState([]);
    const [students, setStudents] = useState([]);
    const [studentRecords, setStudentRecords] = useState({});

    const [selectedCompany, setSelectedCompany] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedTraining, setSelectedTraining] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const { response, responseData } = await GetAllCompanies();
            if (response.ok) {
                setCompanies(responseData);
            } else {
                console.error('Error fetching companies:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    const fetchCourses = async (companyId) => {
        try {
            const { response, responseData } = await GetCoursesByCompany(companyId);
            if (response.ok) {
                setCourses(responseData);
            } else if (response.status === 404) {
                alert('No courses found for the selected company.');
                setCourses([]);
            } else {
                console.error('Error fetching courses:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const fetchTrainings = async (courseId) => {
        try {
            const { response, responseData } = await GetTrainingsByCourseId(courseId);
            if (response.ok) {
                setTrainings(responseData);
            } else if (response.status === 404) {
                alert('No training found for the selected course.');
                setTrainings([]);
            } else {
                console.error('Error fetching trainings:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching trainings:', error);
        }
    };

    const fetchStudents = async (companyId, trainingId) => {
        try {
            const { response, responseData } = await GetAllMappedAndUnMappedStudents(companyId, trainingId);
            if (response.ok) {
                setStudents(responseData);
                const records = {};
                responseData.forEach(student => {
                    records[student.user_id] = student.has_training_record === 'Check';
                });
                setStudentRecords(records);
            } else if (response.status === 404) {
                alert('No students found for the selected training.');
                setStudents([]);
            } else {
                console.error('Error fetching students:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const handleCompanyChange = (companyId) => {
        setSelectedCompany(companyId);
        setSelectedCourse('');
        setSelectedTraining('');
        setStudents([]);
        setSelectedStudents([]);
        setStudentRecords({});
        fetchCourses(companyId);
    };

    const handleCourseChange = (courseId) => {
        setSelectedCourse(courseId);
        setSelectedTraining('');
        setStudents([]);
        setSelectedStudents([]);
        setStudentRecords({});
        fetchTrainings(courseId);
    };

    const handleTrainingChange = (trainingId) => {
        setSelectedTraining(trainingId);
        setSelectedStudents([]);
        setStudentRecords({});
        if (selectedCompany && trainingId) {
            fetchStudents(selectedCompany, trainingId);
        }
    };

    const handleStudentChange = (studentId) => {
        setSelectedStudents(prevSelectedStudents =>
            prevSelectedStudents.includes(studentId)
                ? prevSelectedStudents.filter(id => id !== studentId)
                : [...prevSelectedStudents, studentId]
        );
    };

    const handleCheckAll = (event) => {
        if (event.target.checked) {
            setSelectedStudents(students.map(student => student.user_id));
        } else {
            setSelectedStudents([]);
        }
    };

    const handleSubmit = async () => {
        const data = {
            training_id: selectedTraining,
            student_ids: selectedStudents
        };

        try {
            const { response, responseData } = await CreateStudentMapping(data);

            if (response.ok) {
                alert('Data saved successfully!');
                setSelectedCompany('');
                setSelectedCourse('');
                setSelectedTraining('');
                setSelectedStudents([]);
                setStudents([]);
                setStudentRecords({});
            } else {
                throw new Error('Failed to save data');
            }
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Failed to save data. Please try again.');
        }
    };

    return (
        <>
            <Navbar />
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Student Mapping</h1>
                </div>
                <section className="section">
                    <div className="row">
                        <div className='col-lg-12'>
                            <div className='card'>
                                <div className='card-body'>
                                    <br />

                                    <div className="row">
                                        <div className="col-lg-4">
                                            <label>Company:</label>
                                            <select
                                                value={selectedCompany}
                                                onChange={(e) => handleCompanyChange(e.target.value)}
                                                className="form-select"
                                            >
                                                <option value="">Select Company</option>
                                                {companies.map(company => (
                                                    <option key={company.id} value={company.id}>{company.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-lg-4">
                                            <label>Course:</label>
                                            <select
                                                value={selectedCourse}
                                                onChange={(e) => handleCourseChange(e.target.value)}
                                                className="form-select"
                                                disabled={!selectedCompany}
                                            >
                                                <option value="">Select Course</option>
                                                {courses.map(course => (
                                                    <option key={course.id} value={course.id}>{course.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-lg-4">
                                            <label>Training:</label>
                                            <select
                                                value={selectedTraining}
                                                onChange={(e) => handleTrainingChange(e.target.value)}
                                                className="form-select"
                                                disabled={!selectedCourse}
                                            >
                                                <option value="">Select Training</option>
                                                {trainings.map(training => (
                                                    <option key={training.id} value={training.id}>{training.training_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row mt-3">
                                        <div className="col-lg-12">
                                            <label>Students:</label>
                                            {students.length > 0 ? (
                                                <>
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="checkAll"
                                                            checked={selectedStudents.length === students.length}
                                                            onChange={handleCheckAll}
                                                        />
                                                        <label className="form-check-label" htmlFor="checkAll">
                                                            Check All
                                                        </label>
                                                    </div>
                                                    {students.map(student => (
                                                        <div className="form-check" key={student.user_id}>
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id={`student_${student.user_id}`}
                                                                value={student.user_id}
                                                                checked={studentRecords[student.user_id]}
                                                                onChange={() => handleStudentChange(student.user_id)}
                                                            />
                                                            <label className="form-check-label" htmlFor={`student_${student.user_id}`}>
                                                                {student.username}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </>
                                            ) : (
                                                <p>No students available</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="row mt-3">
                                        <div className="col-lg-12">
                                            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default StudentMapping;
