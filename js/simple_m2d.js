/*
Fecha: Sep 14, 2011
Autor: Cincibeles

Se inica como cualquier objeto pasandole en sus parámetros el canvas que usaremos.

var miMotor=new simple_m2d(document.getElementById('miCanvas'));

Consta de 5 funciones para su uso:
crear: Crea un nuevo Sprite. Recibe 6 parámetros obligatorios y uno más opcional. La imagen con los sprites, divisiones horizontales, divisiones verticales (estos últimos dos especifican como se dividirá la imagen para formar el sprite), anaimacion (este parámetro lo explicare a fondo en breve, por ahora false está bien), pivote en x, pivote en y (estos dos últimos parámetros indican las coordenadas de origen del sprite) y por ultimo el parametro opcional Fixed, éste nos dice si se desplazara con el mundo o se quedara quieto (lo explicare más delante). La función devuelve un valor numérico que representa el indice del sprite.

miSprite = miMotor.crear(imagen, divX, divY, anim, pivX, pivY, Fixed);
posar: Ésta función permite posicionar un sprite en donde nos plazca. Recibé 1 parametro obligatorio que es el indice del Sprite y 5 parámetros opcionales. Posición x, posición y, posición z (ésta indica que sprite aparecera encima), visible (esconde o muestra el sprite, false o true respectivamente) y un exponente que modificara su tamaño (escala). La función devuelve un objeto con loas valores x, y, z, visible y escala.

miMotor.posar(miSprite, posX, posY, posZ, visible, escala)
var posicionY = miMotor.posar(miSprite)['y']
mover: Es como la funciún posar, pero su comportamiento es aditivo. Recibe exactamente los mismos parámetros. De modo que sumará a la posición actual del sprite los parámetros que se le pasen. En el caso de visible que es un booleano, true pasara de visible a escondido o de escondido a visible mientras que false lo dejara sin modificaciones. De igual forma la función devuelve un objeto con loas valores x, y, z, visible y escala.

miMotor.mover(miSprite, posX, posY, posZ, visible, escala)var posicionZ = miMotor.mover(miSprite)['z']
animar: Indica la animación a seguir de un sprite. Recibé 1 parametro obligatorio que es el indice del Sprite y 3 parámetros opcionales. Cuadro Inicial (indica a partir de que cuadro debe animar), longitud (indica cuantos cuadros debe animar -si no se indica o es false, el sprite no se animará), retroceso (cuando la animación acabe, retrocederá el numero de cuadros que se le indique en éste parámetro -sirve para hacer loops -si no se indica éste tomara el valor cero). La función devuelve  un objeto con loas valores cuadro actual (c) y si no se ha detenido la animación (a true | false).

miMotor.animar(miSprite, cuadroInicial, longitud, retroceso);
var cuadroActual = miMotor.animar(miSprite)['c'];
var estaAnimado = miMotor.animar(miSprite)['a'];
dibujar: Esta función debe ser llamada para dibujar los sprites en el camvas y para hacer transcurrir cuadros en las animaciones. No requiere ningún parámetro.

miMotor.dibujar();

Cuando se crea un sprite, sus cuadros de animacion se suceden uno a uno ordenadamente (ejem. 0,1,2,3,4.. ) Sin embargo, el parámetro "anim" de la funcion "crear" sirve para modificar el orden de éstos cuadros (ejem. 3,2,0,1,4,4,3...), éste parámetro debe ser un array que contenga el nuevo orden de los cuadros. Por otro lado, éste mismo parametro "anim" puede ser definido de una segunda forma: un array bidimensional que en su segunda dimension contenga el cuadro, velocidad, desplzamiento en x (sólo del cuadro, no del sprite) y desplazamiento en y.

Las funciones "posar" y "mover" además de modificar la posicion de los sprites, también pueden modificar la posición del mundo donde se encuentran los mismos. Usando en el parámetro de indice el texto "mundo" es equivalente a mover la cámara. Para que los Sprites sean indiferente a éste mundo o camara, al crearse deben tener el parámetro fixed en true.

Por ultimo un código de ejemplo.

Código de ejemplo: demo.html

<style>canvas { background:yellow; }</style>
<canvas id=miCanvas width=320 height=240 ></canvas>

<script language="JavaScript" src="simple_m2d.js" ></script>
<script language="JavaScript" >

var m;
var img=new Image(); img.src="imagenSprite.png";

simple_m2dListo({
 function(){ 
  m=new simple_m2d(document.getElementById('miCanvas'));

  var anim=false
  var a=m.crear(img,8,8,anim,64,64);
    m.posar(a,80,120,0,true,1); 
   m.animar(a,0,6,6);
  var anim=[4,5,6,7,8,9]
  var b=m.crear(img,8,8,anim,64,64); 
   m.posar(b,160,120,0,true,1);
    m.animar(b,0,6,6);
  var anim=[[0,.2,0,0],[10,1,0,0],[11,1,20,-16],[12,1,40,-24],[13,1,60,-16],[14,.5,80,0]]
  var c=m.crear(img,8,8,anim,64,64); 
   m.posar(c,240,120,0,true,1);
   m.animar(c,0,6,6);
  m.posar("mundo",32)
  setInterval("m.dibujar();",150);
 }
})

</script>


Algo más. para su buen funcionamiento, las imágenes deben estar cargadas antes de crear los sprites. Para esperar a que carguen, el mismo js incluye la funcion simple_m2dListo que ejecuta la el parametro que se le pasa.
Para que funcione la etiqueta canvas en IE necesitas agregar el archivo excanvas.js. Aunque corre más rápido en otros navegadores

 Espero te sea útil en tus proyectos y no olvides mencionarme si lo usas. n_n
*/

function simple_m2d(elementoCanvas){
	// utilidades
	this.window=function(x,y){ this.canvas.style.width=x+"px"; this.canvas.style.heigth=y+"px"; }
	this.ordenarZs=function(a,b){ if(a[0]<b[0]) return -1; if (a[0]>b[0]) return 1; return 0; }
	this.noNum=function(valor){ if(valor===false){ return true; }else if(isNaN(valor)){ return true; }else return false; }
	//crea el canvas
	this.canvas=elementoCanvas;
	if (this.canvas.getContext){
		this.ctx=this.canvas.getContext('2d');
	}else alert("no excanvas");
	//define variables
	this.imagen=[];
	this.dW=[];
	this.dH=[];
	this.animacion=[];
	this.w=[];
	this.h=[];
	this.x=[];
	this.y=[];
	this.z=[];
	this.v=[];
	this.fin=[];
	this.cdr=[];
	this.bwr=[];
	this.fxd=[];
	this.pX=[];
	this.pY=[];
	this.ex=[];
	this.wX=0;
	this.wY=0;
	// -------- funciones ---------
	this.crear=function(imagen,dw,dh,animat,px,py){ // [, fixed ]
		n=this.imagen.length;
		this.imagen[n]=imagen;
		this.dW[n]=this.noNum(dw)?1:(dw>=1?Math.floor(dw):1); this.dH[n]=this.noNum(dh)?1:(dh>=1?Math.floor(dh):1);
		this.w[n]=Math.floor(this.imagen[n].width/this.dW[n]); this.h[n]=Math.floor(this.imagen[n].height/this.dH[n]);
		this.animacion[n]=[]; for(var i=0;i<dh*dw;i++) this.animacion[n][this.animacion[n].length]=i;
		if(animat instanceof Array) this.animacion[n]=animat; 
		this.pX[n]=this.noNum(px)?0:px; this.pY[n]=this.noNum(py)?0:py;
		this.fxd[n]=false; if(arguments[6]!=undefined) this.fxd[n]=arguments[6]===false?false:true;
		this.x[n]=0; this.y[n]=0; this.z[n]=[0,n]; this.v[n]=true; this.fin[n]=0; this.cdr[n]=0; this.bwr[n]=0; this.ex[n]=1;
		return n;
	}
	this.posar=function(n){ // n, [ x, y, z, true | false , exponente]
		if(n=="mundo"){ if( !this.noNum(arguments[1]) ) this.wX=arguments[1];
						if( !this.noNum(arguments[2]) ) this.wY=arguments[2];
						return {'x':this.wX[n],'y':this.wY[n]}; }
		if( !this.noNum(arguments[1]) ) this.x[n]=arguments[1];
		if( !this.noNum(arguments[2]) ) this.y[n]=arguments[2];
		if( !this.noNum(arguments[3]) ) this.z[n][0]=arguments[3];
		if( arguments[4]!=undefined ) this.v[n]=arguments[4]===false?false:true;
		if( !this.noNum(arguments[5]) ) this.ex[n]=arguments[5];
		return {'x':this.x[n],'y':this.y[n],'z':this.z[n][0],'v':this.v[n],'e':this.ex[n] };
	}
	this.mover=function(n){ // n, [ x, y, z ,[ true | false ] , exponente ]
		if(n=="mundo"){ if( !this.noNum(arguments[1]) ) this.wX+=arguments[1];
						if( !this.noNum(arguments[2]) ) this.wY+=arguments[2];
						return {'x':this.wX,'y':this.wY}; }
		if( !this.noNum(arguments[1]) ) this.x[n]+=arguments[1];
		if( !this.noNum(arguments[2]) ) this.y[n]+=arguments[2];
		if( !this.noNum(arguments[3]) ) this.z[n][0]+=arguments[3];
		if( arguments[4]!=undefined ) if(arguments[4]!==false) this.ex[n]=this.ex[n]!==false?false:true;
		if( !this.noNum(arguments[5]) ) this.ex[n]+=arguments[5];
		return {'x':this.x[n],'y':this.y[n],'z':this.z[n][0],'v':this.v[n],'e':this.ex[n] };
	}
	this.animar=function(n){ // n, [ cuadroIni, cuadroFin, retrocesoAlTerminar  ]
		if(arguments[1]!=undefined){
			arguments[1]=!this.noNum(arguments[1])?arguments[1]:0;
			arguments[2]=!this.noNum(arguments[2])?arguments[2]-1:0;
			this.cdr[n]=arguments[1]; this.fin[n]=this.cdr[n]+arguments[2];
			this.bwr[n]=!this.noNum(arguments[3])?arguments[3]:0;
			return { 'c':Math.floor(this.cdr[n]), 'a':(Math.floor(this.fin[n])-Math.floor(this.cdr[n])!=0) || this.bwr[n]!=0 };
		}
	}
	this.dibujar=function(){
		var n, cc, xx, vv, tt, ani;
		var o=[]; o=o.concat(this.z).sort(this.ordenarZs);
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
		for(var i in o) if( this.v[o[i][1]] ) {
			n=o[i][1];
			ani=this.animacion[n][Math.floor(this.cdr[n])];
			if(ani instanceof Array){
				cc=ani[0]!=undefined?ani[0]:0; vv=ani[1]!=undefined?ani[1]:0; xx=ani[2]!=undefined?ani[2]:0; yy=ani[3]!=undefined?ani[3]:0;
			}else{ vv=1; xx=0; yy=0; cc=ani; }
			if(this.fxd[n]){	this.ctx.drawImage(this.imagen[n], this.w[n]*(cc%this.dW[n]),this.h[n]*Math.floor(cc/this.dW[n]), this.w[n],this.h[n], this.x[n]-this.pX[n]*this.ex[n]+xx,this.y[n]-this.pY[n]*this.ex[n]+yy, this.w[n]*this.ex[n],this.h[n]*this.ex[n] );
			}else				this.ctx.drawImage(this.imagen[n], this.w[n]*(cc%this.dW[n]),this.h[n]*Math.floor(cc/this.dW[n]), this.w[n],this.h[n], this.x[n]-this.pX[n]*this.ex[n]-this.wX+xx,this.y[n]-this.pY[n]*this.ex[n]-this.wY+yy, this.w[n]*this.ex[n],this.h[n]*this.ex[n] );
			this.cdr[n]+=vv; if(Math.floor(this.cdr[n])>Math.floor(this.fin[n])){ this.cdr[n]-=this.bwr[n]; }
		}
		return i;
	}
}

// Utilidad

    function simple_m2dListo(funcion) {
      if(window.addEventListener) {
        window.addEventListener("load", funcion, false);
      } else {
        window.attachEvent('onload', funcion);
      }
    }