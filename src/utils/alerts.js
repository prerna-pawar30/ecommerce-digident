// src/utils/alerts.js
import Swal from 'sweetalert2';

export const toast = (title, icon = 'success') => {
  Swal.fire({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    icon: icon,
    title: title,
  });
};

export const confirmAction = async (title, text) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#E68736',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, proceed!'
  });
};