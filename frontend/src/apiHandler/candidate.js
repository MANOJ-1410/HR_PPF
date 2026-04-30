
import { backendUrl } from "../backendUrl"
import client from "../utils/client"

const commonEndpoint = `${backendUrl}/api/v1/candidate`;

console.log("commonEndpoint",commonEndpoint)


export const addNewCandidate = async ( formData ) =>{
    
    try {
        const response = await client.post(`${commonEndpoint}/create-candidate`, formData);
        return response;
    } catch (error) {
        console.error("Error:", error.message);
        if (error.response) {
          console.error("Response Data:", error.response.data);
          console.error("Response Status:", error.response.status);
          console.error("Response Headers:", error.response.headers);
        } else if (error.request) {
          console.error("No Response Received:", error.request);
        }
    }
}

export const getAllCandidates = async () =>{
    
  try {
      const response = await client.get(`${commonEndpoint}/candidates`);
      return response;
  } catch (error) {
      console.error("Error:", error.message);
      if (error.response) {
        console.error("Response Data:", error.response.data);
        console.error("Response Status:", error.response.status);
        console.error("Response Headers:", error.response.headers);
      } else if (error.request) {
        console.error("No Response Received:", error.request);
      }
      return { hasError: true }
  }
}

export const fetchCandidateByID = async (id) =>{
    
  try {
      const response = await client.get(`${commonEndpoint}/get-individual-candidate/${id}`);
      return response;
  } catch (error) {
      console.error("Error:", error.message);
      if (error.response) {
        console.error("Response Data:", error.response.data);
        console.error("Response Status:", error.response.status);
        console.error("Response Headers:", error.response.headers);
      } else if (error.request) {
        console.error("No Response Received:", error.request);
      }
      return { hasError: true }
  }
}

export const handleDeleteCandidateMain = async (id) => {
  try {
    const response = await client.delete(`${commonEndpoint}/candidate-delete/${id}`);
    return response;
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Response Data:", error.response.data);
      console.error("Response Status:", error.response.status);
      console.error("Response Headers:", error.response.headers);
    } else if (error.request) {
      console.error("No Response Received:", error.request);
    }
    return { hasError: true }
  }
}


export const handleSubmitCandidateForm = async (formData) =>{
  try {
    const response = await client.post(`${commonEndpoint}/create-new-candidate`, formData);

    return response;
  } catch (error) {
    if (error.response) {
      console.error("Response Data:", error.response.data);
      console.error("Response Status:", error.response.status);
      console.error("Response Headers:", error.response.headers);
    } else if (error.request) {
      console.error("No Response Received:", error.request);
    }
    return { hasError: true }
  }
}


export const handleUpdateCandidate = async (id, formData) => {
  try {
    const response = await client.put(`${commonEndpoint}/update-new-candidate/${id}`, formData);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Response Data:", error.response.data);
      console.error("Response Status:", error.response.status);
    }
    return { hasError: true };
  }
};


export const getAllCandidatesList = async () => {
  try {
    const response = await client.get(`${commonEndpoint}/getAll-new-candidate`);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Response Data:", error.response.data);
      console.error("Response Status:", error.response.status);
      console.error("Response Headers:", error.response.headers);
    } else if (error.request) {
      console.error("No Response Received:", error.request);
    }
    return { hasError: true }
  }
  
}

export const getCandidateDetailsByID = async (candID) => {
  try {
    const response = await client.get(`${commonEndpoint}/get-single-candidate/${candID}`);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Response Data:", error.response.data);
      console.error("Response Status:", error.response.status);
      console.error("Response Headers:", error.response.headers);
    } else if (error.request) {
      console.error("No Response Received:", error.request);
    }
    return { hasError: true }
  }
}


export const deleteSingleCandidate = async (id) => {
  try {
    const response = await client.delete(`${commonEndpoint}/delete-single-candidate/${id}`)

    return response;
  } catch (error) {
    if (error.response) {
      console.error("Response Data:", error.response.data);
      console.error("Response Status:", error.response.status);
      console.error("Response Headers:", error.response.headers);
    } else if (error.request) {
      console.error("No Response Received:", error.request);
    }
    return { hasError: true }
  }
}
