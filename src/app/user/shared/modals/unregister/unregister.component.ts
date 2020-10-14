import { Component, OnInit } from '@angular/core';

import { SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-unregister',
  templateUrl: './unregister.component.html',
  styleUrls: ['./unregister.component.scss']
})
export class UnregisterComponent implements OnInit {

  constructor(public readonly portalTargets: SwalPortalTargets) {

  }

  ngOnInit(): void {
  }

}
