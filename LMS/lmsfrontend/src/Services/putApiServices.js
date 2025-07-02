import { ApiNames } from '../Utils/ApiNames';

const getAuthHeaders = () => {
    const token = localStorage.getItem("auth");
    return {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : ""
    };
};

const otherOptions = {
    method: "PUT",
    headers: getAuthHeaders()
}
export const updateUser = async (id, v_formData) => {
    const response = await fetch(`${ApiNames.Registration}/${id}`, {
        ...otherOptions,
        body: JSON.stringify(v_formData),
    });
    const responseData = await response.json();
    return { response, responseData };
};

export const UpdateCourse = async (id, v_formData) => {
    const response = await fetch(`${ApiNames.Course}/${id}`, {
        ...otherOptions,
        body: JSON.stringify(v_formData),
    });
    const responseData = await response.json();
    return { response, responseData };
};

export const UpdateTrainingDetails = async (id, v_formData) => {
    const response = await fetch(`${ApiNames.T_Details}/${id}`, {
        ...otherOptions,
        body: JSON.stringify(v_formData),
    });
    const responseData = await response.json();
    return { response, responseData };
};

export const UpdateTestShedule = async (id, v_formData) => {
    const response = await fetch(`${ApiNames.CreateTestWithMcq}/${id}`, {
        ...otherOptions,
        body: JSON.stringify(v_formData),
    });
    const responseData = await response.json();
    return { response, responseData };
};

export const UpdateCompany = async (id, v_formData) => {
    const response = await fetch(`${ApiNames.Companies}/${id}`, {
        ...otherOptions,
        body: JSON.stringify(v_formData),
    });
    const responseData = await response.json();
    return { response, responseData };
};

