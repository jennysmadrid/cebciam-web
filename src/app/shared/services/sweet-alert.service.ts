import { Injectable } from '@angular/core';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() { }

  toastInit() {
    return Swal.mixin({
      toast             : true,
      position          : 'top-end',
      showConfirmButton : false,
      timer             : 3000,
      timerProgressBar  : true,
      onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });
  }

  toast(icon, title) {
    return this.toastInit()
               .fire({
                 icon  : icon,
                 title : title
                });
  }

}
