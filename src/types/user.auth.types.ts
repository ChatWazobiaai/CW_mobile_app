export interface User {
    _id: string;
    phoneNumber: string;
    email?: string;
    name: string;
    profilePictureUrl?: string;
    role: 'user' | 'admin';
    createdAt: string;
    updatedAt: string;
    newUser: boolean
}