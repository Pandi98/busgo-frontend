import api from './axiosConfig';

export const bookingApi = {
  create:           (data)      => api.post('/bookings', data),
  getMyBookings:    ()          => api.get('/bookings/my-bookings'),
  getById:          (id)        => api.get(`/bookings/${id}`),
  getByReference:   (ref)       => api.get(`/bookings/reference/${ref}`),
  cancel:           (id)        => api.patch(`/bookings/${id}/cancel`),
  getAll:           ()          => api.get('/admin/bookings'),
};

export const paymentApi = {
  process:          (data)      => api.post('/payments/process', data),
  getByBooking:     (bookingId) => api.get(`/payments/booking/${bookingId}`),
  refund:           (bookingId) => api.post(`/payments/refund/${bookingId}`),
};

export const adminApi = {
  getDashboard:     ()          => api.get('/admin/dashboard'),
};
