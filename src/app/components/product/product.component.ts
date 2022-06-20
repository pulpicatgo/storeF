import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {


  text:string='';
  speech = new SpeechSynthesisUtterance();


  hablar(texto:HTMLDivElement){  
    this.text=texto.innerHTML;
    console.log(this.text); 
    this.speech.text=this.text;
    this.speech.volume = 1;
    this.speech.rate = 1;
    this.speech.pitch = 1;

  speechSynthesis.speak(this.speech);
  }

  pause(){
    speechSynthesis.pause();
    console.log("f");
  }
  resumen(){
    speechSynthesis.resume();
    console.log("f1");
  }

  cancelar(){
    speechSynthesis.cancel();
    console.log("f3");
  }

  ngOnInit(): void {
  }

}
