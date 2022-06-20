function añadir (prod,pre){
   

     var libros=localStorage.getItem("libros");
        libros=JSON.parse(libros);
        
        if(libros==null) libros=[];
        
        function lista(){
            var aLength = libros.length;
            
            document.getElementById("listado").innerHTML="";
            document.getElementById("total").innerHTML="";
            
            var tabla="<tr><th>Articulo</th><th>Precio</th><th>Borrar</th></tr>";
            total = 0;
            for(var i in libros){
                var libro = JSON.parse(libros[i]);
             
                tabla += "<tr><td>"+libro.nombre+"</td>";
                tabla += "<td>"+libro.precio+"</td>";
                tabla += "<td>"+`<button class="btn btn-warning" onclick="borrar('`+libro.nombre+`',`+libro.precio+`,`+i+`)" >Borrar</button>`+"</td>";
                tabla += "</tr>";
                
                 total +=  parseInt(libro.precio);
            }
            
            document.getElementById("listado").innerHTML=tabla;
            document.getElementById("total").innerHTML="Total de Articulos: "+aLength;
            document.getElementById("pagar").innerHTML="Total a pagar: $"+total;
        }
        

            var libro = JSON.stringify(
                { nombre:prod, 
                  precio:pre,  
                    });
             
            
            libros.push(libro);
             

            localStorage.setItem("libros",JSON.stringify(libros));
           
             
            lista();

        window.onload = lista;

        document.getElementById("eliminado").style.display = "none";

}
function borrar (prod,pre,indice){
   

    var libros=localStorage.getItem("libros");
       libros=JSON.parse(libros);
       
       if(libros==null) libros=[];
       
       function lista(){
           var aLength = libros.length;
           
           document.getElementById("listado").innerHTML="";
           document.getElementById("total").innerHTML="";
           
           var tabla="<tr><th>Articulo</th><th>Precio</th><th>Borrar</th></tr>";
           total = 0;
           for(var i in libros){
               var libro = JSON.parse(libros[i]);
            
               tabla += "<tr><td>"+libro.nombre+"</td>";
               tabla += "<td>"+libro.precio+"</td>";
               tabla += "<td>"+`<button class="btn btn-warning" onclick="borrar('`+libro.nombre+`',`+libro.precio+`,`+i+`)" >Borrar</button>`+"</td>";
               tabla += "</tr>";
               
                total +=  parseInt(libro.precio);
           }
           
           document.getElementById("listado").innerHTML=tabla;
           document.getElementById("total").innerHTML="Total de Articulos: "+aLength;
           document.getElementById("pagar").innerHTML="Total a pagar: $"+total;
       }
       

           var libro = JSON.stringify(
               { nombre:prod, 
                 precio:pre,  
                   });
            

           
           libros.splice(indice,1);
            

           localStorage.setItem("libros",JSON.stringify(libros));
          
            
           lista();

        window.onload = lista;

        document.getElementById("eliminado").style.display = "block";
       document.getElementById("eliminado").innerHTML= "Producto eliminado";

}