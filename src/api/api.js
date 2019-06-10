import axios from 'axios';

export function getToken() {
    return localStorage.getItem('token')
}

export function get(url) {
    
    const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + getToken()
    }

    return axios.get(url, { headers: headers })
                .then(response => { return response.data; })
}

export function post(url,data) {

    const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + getToken()
    }

    return axios.post(url,data,{ headers: headers })
                .then(response => { return response; })
}

export function remove(url) {

    const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + getToken()
    }

    return axios.delete(url,{ headers: headers }).then(response => {
        return response;
    })
}

export function logout() {

    axios.post('/api/Account/Logout',{}, { headers : {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }}).then(response => { /* success */ })

    localStorage.removeItem('userName');
    localStorage.removeItem('roles');    
    localStorage.removeItem('token');
}