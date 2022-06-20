import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { faMapMarkedAlt, faEnvelope, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  title = 'nuevo_qr';
  myAngularxQrCode:any;
  refresh(): void { window.location.reload(); }

  faMapMarkedAlt = faMapMarkedAlt;
  faEnvelope = faEnvelope;
  faPhoneAlt = faPhoneAlt;
  subject = "Contact";
  email = "";
  name = "";
  mensaje = "";
  
  public enviarDatos(){
    this.email = (<HTMLInputElement>document.getElementById('email')).value;
    this.name = (<HTMLInputElement>document.getElementById('name')).value;
    this.mensaje = (<HTMLInputElement>document.getElementById('mensaje')).value;
    let params = {
      asunto: "Contacto",
      mensaje: this.name + " " + this.email + " " + this.mensaje
    }
    console.log(params);
    this.httpClient.post('http://localhost:3000/envio',params).
    subscribe( data => {
      console.log(data);
      (<HTMLInputElement>document.getElementById('email')).value = "";
      (<HTMLInputElement>document.getElementById('name')).value = "";
      (<HTMLInputElement>document.getElementById('mensaje')).value = "";
    })
  }

  constructor (private httpClient:HttpClient){ 
    const links: string[]=[
      "https://wa.me/524493437588?text=Hola!%20necesito%20asesor%C3%ADa%20para%20comprar%20uno%20de%20tus%20productos",
      "https://wa.me/524651025289?text=Hola!%20necesito%20asesor%C3%ADa%20para%20comprar%20uno%20de%20tus%20productos",
      "https://wa.me/524492796244?text=Hola!%20necesito%20asesor%C3%ADa%20para%20comprar%20uno%20de%20tus%20productos",
      "https://wa.me/524493463325?text=Hola!%20necesito%20asesor%C3%ADa%20para%20comprar%20uno%20de%20tus%20productos"
    ]
    var rand = Math.random()*links.length | 0;
    var rValue = links[rand];
    
    this.myAngularxQrCode = rValue; 

   }

  ngOnInit(): void {
  }

}
