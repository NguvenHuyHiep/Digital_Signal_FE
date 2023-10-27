import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/sample/dashboard/analysis' },
  { path: 'sample', loadChildren: () => import('./sample/sample.module').then(m => m.SampleModule) }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
