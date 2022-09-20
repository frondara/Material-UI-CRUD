import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {NgToastService} from 'ng-angular-popup';
import { DialogService } from './services/dialog.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  title = 'Material-UI-CRUD';

  displayedColumns: string[] = ['productName', 'category', 'freshness', 'date', 'price', 'comment', 'action'];
  dataSource !: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog : MatDialog, private api: ApiService, private toast : NgToastService,
    private dialogService : DialogService){

  }
  ngOnInit(): void {
   this.getAllProduct();
  }
  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val=>{
      if(val ==='save'){
        this.getAllProduct();
      }
    })
  }

  deleteConfirmDialog(id:number){
    this.dialogService.confirmDialog({
      title: 'Confirmation',
      message: 'Are you sure you want to delete this record?',
      confirmText: 'Yes',
      cancelText: 'No'
    }).subscribe(res=> {
      if(res){
        console.log(res)
        this.api.deleteProduct(id)
        .subscribe({
          next:(res)=>{
            this.toast.success({detail: "Success Message", summary:"Product Deleted Successfully",duration:5000})
            //alert("Product successfully deleted")
            this.getAllProduct();
          },
          error:()=>{
            this.toast.error({detail: "Error Message", summary: "Login failed, try again later",duration:5000})
            //alert("Error while deleting")
          }
        })
      }
    })
  }

  getAllProduct(){
    this.api.getProduct()
    .subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:(err)=>{
        this.toast.success({detail: "Error Message", summary:"error while fetching the records",duration:5000})
        //alert("error while fetching the records")
      }
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editProduct(row : any){
    this.dialog.open(DialogComponent, {
      width: '30%',
      data: row
    }).afterClosed().subscribe(val=>{
      if(val == 'update'){
        this.getAllProduct();
      }
    })
  }

  deleteProduct(id:number){
    this.api.deleteProduct(id)
    .subscribe({
      next:(res)=>{
        this.toast.success({detail: "Success Message", summary:"Product Deleted Successfully",duration:5000})
        //alert("Product successfully deleted")
        this.getAllProduct();
      },
      error:()=>{
        this.toast.error({detail: "Error Message", summary: "Login failed, try again later",duration:5000})
        //alert("Error while deleting")
      }
    })
    
  }

}
