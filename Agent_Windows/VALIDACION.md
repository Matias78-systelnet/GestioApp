# Validación realizada y pendiente

Realizada aquí: lectura del ZIP original, revisión de fuentes y rutas, XML de los tres proyectos, referencias entre proyectos, JSON de configuración y verificación de contenido del ZIP final.

No realizada: compilación C#, ejecución de WMI bajo LocalService, GUI Windows, compilación Inno Setup, instalación/actualización/desinstalación en Windows, comunicación con la API real. El entorno no dispone de SDK .NET/Windows/Inno Setup y la descarga de SDK no estuvo disponible.

Gate antes de instalar: ejecutar build.ps1 sin errores y compilar GestioApp.iss. Después seguir pruebas del README en una VM. No usar esta entrega como binario certificado o validado en producción.

Cambios respecto al ZIP: se creó el servicio (la carpeta original estaba vacía), contrato compartido, interfaz de inventario, scripts de publicación/configuración y gestión del servicio. Se excluyeron salidas bin/obj/publish antiguas. El archivo agent.cs original permanece como ejemplo histórico y no interviene en el instalador.
