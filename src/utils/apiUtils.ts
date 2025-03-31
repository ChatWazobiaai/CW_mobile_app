import axios, { AxiosError, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BaseUrl = `http://192.168.0.20:1000`;

export const getAuthHeaders = async () => {
    try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
            console.log('No access token found');
            throw new Error('No access token found');
        }
        console.log('Access token retrieved:', token);
        return { Authorization: `Bearer ${token}` };
    } catch (error) {
        console.error('Error fetching auth headers:', error);
        throw error;
    }
};

export const apiRequest = async <T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: object, 
    rejectWithValue: (value: any) => any = (error) => Promise.reject(error), // ✅ Default function
    includeAuth: boolean = true
): Promise<T | ReturnType<typeof rejectWithValue>> => {
    try {
        console.log(`Starting ${method} request to ${endpoint}...`);

        const headers = includeAuth ? await getAuthHeaders() : {};
        const url = `${BaseUrl}${endpoint}`;

        let response: AxiosResponse<T>;

        switch (method) {
            case 'GET':
                console.log('Sending GET request...');
                response = await axios.get<T>(url, { headers });
                break;
            case 'POST':
                console.log('Sending POST request...');
                response = await axios.post<T>(url, data ?? {}, { headers });
                break;
            case 'PUT':
                console.log('Sending PUT request...');
                response = await axios.put<T>(url, data ?? {}, { headers });
                break;
            case 'DELETE':
                console.log('Sending DELETE request...');
                response = await axios.delete<T>(url, { headers, data });
                break;
            default:
                throw new Error(`Unsupported HTTP method: ${method}`);
        }

        console.log('Response received:', response.data);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error('API request error:', axiosError.response?.data || 'Something went wrong');
        return rejectWithValue(axiosError.response?.data || 'Something went wrong');
    }
};