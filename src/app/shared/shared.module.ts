import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberOnlyDirective } from './directives/number-only.directive';
import { SortPipe } from './pipes/sort.pipe';


@NgModule({
  declarations: [
    NumberOnlyDirective,
    SortPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NumberOnlyDirective,
    SortPipe
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SharedModule {
  constructor() { console.log('[SharedModule] imported') }
}
