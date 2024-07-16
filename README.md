# Desafio Servidor
En este repositorio se sube la resolucion al cuarto desafio basado en la primera pre entrega.
## Como levantar el proyecto
Para levantar el proyecto se requiere navegar hasta la raiz del proyecto y correr el siguiente comando:  
```console
npm run serve
```
Esto va a iniciar al servidor en el puerto 8080.
## Descripcion de desafio
Para este desafio se implemento el uso de handlebars y websockets. Se agregaron dos endpoints que se pueden acceder desde browser. Uno es /realTimeProducts y otro siendo /. En el primero se puede ver la implementacion de websockets en el cliente para actualizar a tiempo real el listado de productos que se muestra en pantalla. El segundo es solo un handlebar que muestra el listado de productos pero no se actualiza en tiempo real. 