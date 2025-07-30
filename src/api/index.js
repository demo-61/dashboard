import axios from 'axios';


export const loginApi=async (data) => {
    const params = new URLSearchParams();
  params.append('username', data.username);
  params.append('password', data.password);
    const response = await axios.post(`https://admin.cvaluepro.com/dashboard/token`)
     params,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
    console.log(response,"response from login")
    return response

    
}

export const getSalesData = async (token) => {
    const response = await axios.get('https://admin.cvaluepro.com/dashboard/sales/total', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    console.log("response from salesdata api",response)
    return response;
}

export const getSalesTax = async (token) => {
    const response = await axios.get('https://admin.cvaluepro.com/dashboard/sales/tax-total', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    console.log("response from salestax api",response)
    return response;
}


export const getProcessedResumes = async (token) => {
    const response = await  axios.get('https://admin.cvaluepro.com/dashboard/total/processed-resumes',{
         headers: {
            Authorization: `Bearer ${token}`
        }
})
console.log("response from ProcessedResumes api",response)
return response;

}

export const  getAvgProcessingTime = async (token) => {
    const response = await axios.get ('https://admin.cvaluepro.com/dashboard/resumes/avg-processing-time',{
          headers: {
            Authorization: `Bearer ${token}`
        }
    })
   console.log("response from avgProcessingTime api",response)
   return response
}

export const getFailedResume = async (token) => {
    const response = await axios.get('https://admin.cvaluepro.com/dashboard/resumes/failed-total',{
         headers: {
            Authorization: `Bearer ${token}`
        } 
    })
    console.log("response from Failed Resume api",response)
    return response
}

export const getWeeklyResume = async (token) => {
    const response = await axios.get('https://admin.cvaluepro.com/dashboard/resumes/weekly',{
          headers: {
            Authorization: `Bearer ${token}`
        } 
    })
     console.log("response from Weekly Resume api",response)
    return response
}