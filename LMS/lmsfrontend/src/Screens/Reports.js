import React, { useState, useEffect } from 'react';
import Navbar from '../Navigation/Navbar';
import { GetAllUsers, GetAllCourses, GetAllTests, } from '../Services/getApiServices';
import { ReportsData } from '../Services/postApiServices';
const Reports = () => {
    const [selectedReportType, setSelectedReportType] = useState('');
    const [selectedDetail, setSelectedDetail] = useState('');
    const [detailsOptions, setDetailsOptions] = useState([]);
    const [reportData, setReportData] = useState([]);
    const [type, setType] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
    
    useEffect(() => {
        if (selectedReportType) {
            fetchDetailsOptions();
        }
    }, [selectedReportType]);

    useEffect(() => {
        if (selectedDetail) {
            fetchReportData();
        }
    }, [selectedDetail]);

    const fetchDetailsOptions = async () => {
        try {
            let data;
            let newType = '';

            switch (selectedReportType) {
                case 'Student-wise':
                    const { response: userResponse, responseData: userData } = await GetAllUsers();
                    if (userResponse.ok) {
                        data = userData;
                        newType = 'student';
                    } else {
                        console.error('Error fetching student details:', userResponse.statusText);
                        return;
                    }
                    break;

                case 'Course-wise':
                    const { response: courseResponse, responseData: courseData } = await GetAllCourses();
                    if (courseResponse.ok) {
                        data = courseData;
                        newType = 'course';
                    } else {
                        console.error('Error fetching course details:', courseResponse.statusText);
                        return;
                    }
                    break;

                case 'Test-wise':
                    const { response: testResponse, responseData: testData } = await GetAllTests();
                    if (testResponse.ok) {
                        data = testData;
                        newType = 'test';
                    } else {
                        console.error('Error fetching test details:', testResponse.statusText);
                        return;
                    }
                    break;

                default:
                    console.error('Invalid report type selected');
                    return;
            }

            setDetailsOptions(data);
            setType(newType);
        } catch (error) {
            console.error(`Error fetching ${selectedReportType} details:`, error);
        }
    };


    const fetchReportData = async () => {
        try {

            const id = selectedDetail;
            const reportType = type;
            const { response, responseData } = await ReportsData(id, reportType)
            if (response.ok) {
                //const data = await responseData.json();
                setReportData(responseData);
                console.log({ reportData })
            } else {
                alert('Data Not Found')
                console.error(`Error fetching ${selectedReportType} report data:`, response.statusText);
            }
        } catch (error) {
            console.error(`Error fetching ${selectedReportType} report data:`, error);
        }
    };

    return (
        <div className={`${isSidebarOpen ? 'toggle-sidebar' : ''}`}>
           <Navbar toggleSidebar={toggleSidebar} />
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Reports</h1>
                </div>
                <section className="section">
                    <div className="row">
                        <div className='col-lg-12'>
                            <div className='card'>
                                <div className='card-body'>
                                    <br />
                                    <div className="row g-3">
                                    <div className="col-md-4">
                                        <label htmlFor="reportType" className="form-label">Select Report Type:</label>
                                        <select
                                            id="reportType"
                                            className="form-select"
                                            value={selectedReportType}
                                            onChange={(e) => {
                                                setSelectedReportType(e.target.value);
                                                setSelectedDetail('');
                                                setDetailsOptions([]);
                                                setReportData([]);
                                            }}
                                        >
                                            <option value="">Select...</option>
                                            <option value="Course-wise">Course-wise</option>
                                            <option value="Student-wise">Student-wise</option>
                                            <option value="Test-wise">Test-wise</option>
                                        </select>
                                    </div>


                                    {selectedReportType && (
                                        <div className="col-md-4">
                                            <label htmlFor="detailSelect" className="form-label">Select {selectedReportType.split('-')[0]}:</label>
                                            <select
                                                id="detailSelect"
                                                className="form-select"
                                                value={selectedDetail}
                                                onChange={(e) => setSelectedDetail(e.target.value)}
                                            >
                                                <option value="" disabled>Select...</option>
                                                {detailsOptions.map(option => {
                                                    // Determine the display value and label based on selectedReportType
                                                    let displayValue = '';
                                                    let displayLabel = '';

                                                    if (selectedReportType === 'Course-wise') {
                                                        displayValue = option.id;
                                                        displayLabel = option.name;
                                                        // setType('course')
                                                    } else if (selectedReportType === 'Student-wise') {
                                                        displayValue = option.id;
                                                        displayLabel = option.username;
                                                        // setType('student')
                                                    } else if (selectedReportType === 'Test-wise') {
                                                        displayValue = option.test_id;
                                                        displayLabel = option.test_name;
                                                        // setType('test')
                                                    }

                                                    // Render the option only if displayLabel is set
                                                    return (
                                                        displayLabel && (
                                                            <option key={option.id} value={displayValue}>
                                                                {displayLabel}
                                                            </option>
                                                        )
                                                    );
                                                })}
                                            </select>
                                        </div>
                                    )}

                                       </div>



                                    {selectedDetail && reportData.length > 0 && (
                                        <div style={{ marginTop: '20px' }}>
                                            <div className='pagetitle'>
                                            <h1>{selectedReportType} Report</h1>
                                            </div>
                                            <div class="table-responsive">
                                            <table className="table table-striped table-bordered LMS_table">
                                                <thead>
                                                    <tr>
                                                        {/* Render table headers dynamically based on the selected report type */}
                                                        {selectedReportType === 'Student-wise' && (
                                                            <>
                                                                <th>ID</th>
                                                                <th>Name</th>
                                                                <th>Total Score</th>
                                                            </>
                                                        )}
                                                        {selectedReportType === 'Course-wise' && (
                                                            <>
                                                                <th>ID</th>
                                                                <th>Name</th>
                                                                <th>Total Score</th>
                                                            </>
                                                        )}
                                                        {selectedReportType === 'Test-wise' && (
                                                            <>
                                                                <th>ID</th>
                                                                <th>Test Name</th>
                                                                <th>Total Score</th>
                                                            </>
                                                        )}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {/* Render table rows dynamically based on the selected report type */}
                                                    {reportData.map(item => (
                                                        <tr key={item.id}>
                                                            {selectedReportType === 'Student-wise' && (
                                                                <>
                                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.id}</td>
                                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.name}</td>
                                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.total_score}</td>
                                                                </>
                                                            )}
                                                            {selectedReportType === 'Course-wise' && (
                                                                <>
                                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.id}</td>
                                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.name}</td>
                                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.total_score}</td>
                                                                </>
                                                            )}
                                                            {selectedReportType === 'Test-wise' && (
                                                                <>
                                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.id}</td>
                                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.name}</td>
                                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.total_score}</td>
                                                                </>
                                                            )}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            </div>
                                        </div>
                                    )}



                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Reports;
