import { Component, OnInit, ViewChild } from '@angular/core';
import { UserProfile } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { switchMap } from 'rxjs';
import { ProfileUser } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';

@UntilDestroy(this)
@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  displayedColum: string[] = ['photoURL','email', 'names', 'displayName', 'phone', 'address', 'isAdmin', 'edit']

  usersList$ = this.usersService.usersList$
  dataSource = new MatTableDataSource<ProfileUser>([])
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private usersService: UsersService, private toast: HotToastService, private dialog: MatDialog, private imageUploadService: ImageUploadService, private authService: AuthService) { }
 
  ngOnInit(): void {
    this.usersService.usersList$.pipe(untilDestroyed(this)).subscribe((data) => {
      
      this.dataSource = new MatTableDataSource(data);
      setTimeout(() => this.dataSource.paginator = this.paginator)
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  resetPassword(userProfile: ProfileUser){
    Swal.fire({
      title: '¿Estás seguro de que quiere solicitar restablecer la contraseña?',
      text: "Al continuar, el usuario recibirá un email, con el cual podrá cambiar su contraseña.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, solicitar restablecer',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.requestChangePassword(userProfile.email!).pipe(
          this.toast.observe({
            loading: 'progresando...',
            success: 'se ha enviado el correo, informale al usuario',
            error: 'tuvimos un error :(',
          })
        ).subscribe();
      }
    })

  }
  editPicture(event: any, { uid }: ProfileUser){
    this.imageUploadService
    .uploadImage(event.target.files[0], `images/profile/${uid}`)
    .pipe(
      this.toast.observe({
        loading: 'Uploading profile image...',
        success: 'Image uploaded successfully',
        error: 'There was an error in uploading the image',
      }),
      switchMap((photoURL) =>
        this.usersService.updateUser({
          uid,
          photoURL
        })
      )
    )
    .subscribe();
  }

  editRole(event:any, isAdmin:boolean, user:ProfileUser){
    const uid = user.uid;
    this.usersService.updateUser({uid, isAdmin}).pipe(
      this.toast.observe({
        loading: 'Actualizando rol de usuario...',
        success: 'Rol actualizado',
        error: 'Ocurrió un error',
      })
    ).subscribe()
  }
}
