import { Component, Inject,OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'
import { NgToastService } from 'ng-angular-popup';
import { DialogService } from '../services/dialog.service';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
  
})

export class DialogComponent implements OnInit {
  freshnessList = ["Brand New", "Second Hand", "Refurbished"];
  productForm !: FormGroup;
  actionBtn : string = 'Save';

  constructor(private formBuilder : FormBuilder, private api : ApiService, 
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef : MatDialogRef<DialogComponent>, private toast : NgToastService,
    private dialogService:DialogService) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      freshness: ['', Validators.required],
      date: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
    })
    if(this.editData){
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['date'].setValue(this.editData.date);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.actionBtn = 'Update';
    }
  }
  addProduct(){
    if(!this.editData){
      if(this.productForm.valid){
        this.api.postProduct(this.productForm.value)
        .subscribe({
          next:(res)=>{
            this.toast.success({detail: "Success Message", summary:"Product Added Successfully",duration:5000})
            //alert("Product added successfully")
            this.productForm.reset();
            this.dialogRef.close('save');
          },
          error:()=>{
            this.toast.error({detail: "Error Message", summary:"Error while adding product",duration:5000})
            //alert("Error while adding product")
          }
        })
      }
    }else{
      this.updateConfirmDialog();
    }
    
  }

  updateProduct(){
    this.api.putProduct(this.productForm.value, this.editData.id)
    .subscribe({
      next:(res)=>{
        this.toast.success({detail: "Success Message", summary:"Product Updated Successfully",duration:5000})
        //alert("Product updated successfully")
        this.productForm.reset();
        this.dialogRef.close('update');
      },
      error:()=>{
        this.toast.error({detail: "Error Message", summary:"Error while updating product",duration:5000})
        //alert("Error while updating product");
      }
    })
  }

  updateConfirmDialog(){
    this.dialogService.confirmDialog({
      title: 'Confirmation',
      message: 'Are you sure you want to update this record?',
      confirmText: 'Yes',
      cancelText: 'No'
    }).subscribe(res=>{
      if(res){
        this.api.putProduct(this.productForm.value, this.editData.id)
        .subscribe({
          next:(res)=>{
            this.toast.success({detail: "Success Message", summary:"Product Updated Successfully",duration:5000})
            //alert("Product updated successfully")
            this.productForm.reset();
            this.dialogRef.close('update');
          },
          error:()=>{
            this.toast.error({detail: "Error Message", summary:"Error while updating product",duration:5000})
            //alert("Error while updating product");
          }
        })
      }
    })
  }

}
