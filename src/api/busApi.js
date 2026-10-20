import api from './axiosConfig';

export const busApi = {
  getAll:         ()           => api.get('/buses'),
  getActive:      ()           => api.get('/buses/active'),
  getById:        (id)         => api.get(`/buses/${id}`),
  create:         (data)       => api.post('/buses', data),
  update:         (id, data)   => api.put(`/buses/${id}`, data),
  delete:         (id)         => api.delete(`/buses/${id}`),
  toggleStatus:   (id)         => api.patch(`/buses/${id}/toggle-status`),
};

export const routeApi = {
  getAll:   ()                         => api.get('/routes'),
  getById:  (id)                       => api.get(`/routes/${id}`),
  search:   (source, destination)      => api.get('/routes/search', { params: { source, destination } }),
  create:   (data)                     => api.post('/routes', data),
  update:   (id, data)                 => api.put(`/routes/${id}`, data),
  delete:   (id)                       => api.delete(`/routes/${id}`),
};

export const scheduleApi = {
  getAll:   ()                                    => api.get('/schedules'),
  getById:  (id)                                  => api.get(`/schedules/${id}`),
  search:   (source, destination, travelDate)     => api.get('/schedules/search', { params: { source, destination, travelDate } }),
  create:   (data)                                => api.post('/schedules', data),
  update:   (id, data)                            => api.put(`/schedules/${id}`, data),
  delete:   (id)                                  => api.delete(`/schedules/${id}`),
  cancel:   (id)                                  => api.patch(`/schedules/${id}/cancel`),
};
