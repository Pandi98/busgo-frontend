import api from "./axiosConfig";

export const userApi = {

    // Logged-in user profile
    getProfile: () =>
        api.get("/users/profile"),

    updateProfile: (data) =>
        api.put("/users/profile", data),

    // Admin User Management
    getAllUsers: () =>
        api.get("/admin/users"),

    getUserById: (id) =>
        api.get(`/admin/users/${id}`),
    
    updateUser: (id, data) =>
    api.put(`/admin/users/${id}`, data),

    updateUserByAdmin: (id, data) =>
        api.put(`/admin/users/${id}`, data),

    deleteUser: (id) =>
        api.delete(`/admin/users/${id}`),
};