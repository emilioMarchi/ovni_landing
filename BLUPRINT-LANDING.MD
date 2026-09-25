La siguiente landing sera una interface de usuario interactiva, donde podremos converzar con un agente ia como tambien pasar a las siguientes secciones de los diferentes niveles de la landing, que van a oficiar de etapas o fases del recorrido que va a desarrollar el usuario para comprender el proyecto. 

Este proyecto particularmente se trata de ovnistudio, un estudio de software en el que estoy trabajando solo. 

OVNISTUDIO es mi estudio de softwar, donde trabajo en el desarrollo de sistemas cognitivos artificiales, para automatizacion de flujos de trabajo y generacion de bases de conocimiento semanticas. Sitios webs con agentes autonomos, sistemas privados integrados con IA local, etc. 
El concepto no es importante por ahora. Hay que disenar y desarrollar la interface y luego me encargo de el contenido. 

ESPECIFICACIONES DE DISEÑO DE LA LANGING: 
- Landingpage moderna y minimalista. 
- Colores: celeste,amarillo y gris oscuro.  Colores opacos o no tan brillantes. 
- Tipografias: 
	primaria:
		<link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		<link href="https://fonts.googleapis.com/css2?family=Unica+One&display=swap" rel="stylesheet"> 
	secundaria: 
		<link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		<link href="https://fonts.googleapis.com/css2?family=Megrim&display=swap" rel="stylesheet">

	REQUISITOS: 
	La landing se  tiene que sentir fluida e intuitiva. El scroll no sera libre, si no que cada scrolleo funcionara como un salto a una etapa anterior o siguiente a la actual. Tambien se podra navegar a traves de los enlaces en el menu de navegacion.

	la barra de navegacion sera flotante y moderna, ubicada en laparte inferior de la pantalla para buen alcance en mobiles, y en pc si posicionado arriba. La barra de navegacion sera el medio por el cual contactamos con el agente, iniciando converzacion por medio de un boton. Cuando se inicia la conversacion el  boton pasa a un icono circular con algo de movimiento que indica el se esta a la escucha de el habla del usuario. las respuestas en audio del agente se visualisarian cambiando del circulo a una onda de audio moderna minimalista que quepa en la barra. La barra se podria expandir un poco cuando el agente esta activo. Tambien incluir modo de chat, por medio de otro boton al costado, permitiendo pasar de modo de voz a chat. y en el extremo de la barra, si es en mobile. 
	La barra sera el medio entre el usuario y nuestro servidor con el orquestador de agentes que procesaria los mensajes y responderia con el audio. Debemos implementar camptura de audio en el front y el servidor se encargaria del resto, del stt - agente - tts.  

	el escuchador que se activa en el front al iniciar la convesacion iniciando la grabacion en loop hasta que detecta entrada de voz para seguir grabando hasta que el usuario hace una pausa de x seg. cada corte introduce el audio en una cola de envio hacia el servidor. asi si el usuario vuelve a hablar se grabaria de vuelta y se añadiria el siguiente audio en el siguiente lugar de la cola de procesamiento y envio. 

	elorquestador estaria en un vps privado, si es que es conveniente en cuanto a velocidad de procesamiento y de mas. 

	Las secciones tendran texto, o video mas texto.  
	USA LOGO.PNG como icono y logo del sitio. 

	ESTRUCTURA:
	Seccion 1: Ocupa pantalla completa. Tiene un titulo principal: "Te convenzo en 3 pasos de que la IA local y los sistemas privados pueden ser tus aliados y no tus enemigos.", titulo secundario: Apreta converzar y entendé lo que te digo.

	Seccion 2:    video + algo de texto. Aca va un video explicativo y debajo un resumen de lo que trataria. 

	Seccion 3: Invitacion a contactarme, dejando sus datos con el agente o en un formulario debajo de la invitacion. el formulario puede estar oculto hasta que el usuario por medio de botones elija que hacer. De cualquiera de las 2 maneras,a traves del chat con el agente que estaria en la landing o a traves del formulario, la data pasaria por el agente primeramente, procesando igualmente la consulta, capturando el leed y procesando la respuesta.  


