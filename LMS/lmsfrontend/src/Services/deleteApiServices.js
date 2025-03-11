import { ApiNames } from "../Utils/ApiNames";
const otherOptions = {
    method: "DELETE",
    headers: {
        'Content-Type': 'application/json',
        authorization: localStorage.getItem("auth")
    },
}
export const DeleteUser = async (id) => {
    const response = await fetch(`${ApiNames.Registration}/${id}`, otherOptions)
    const responseData = await response.json();
    return { response, responseData };
}

export const DeleteCourse = async (id) => {
    const response = await fetch(`${ApiNames.Course}/${id}`, otherOptions)
    const responseData = await response.json();
    return { response, responseData };
}
export const DeleteTrainingDetails = async (id) => {
    const response = await fetch(`${ApiNames.T_Details}/${id}`, otherOptions)
    const responseData = await response.json();
    return { response, responseData };
}
export const DeleteCompany = async (id) => {
    const response = await fetch(`${ApiNames.Companies}/${id}`, otherOptions)
    const responseData = await response.json();
    return { response, responseData };
}