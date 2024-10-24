Si es la primera vez instalando el proyecto:

Carpeta general (proyecto) crear manualmente o por cmd de la siguiente manera:

cd desktop/escritorio (o la ruta de preferencia)
mkdir proyecto
cd proyecto
mkdir server


PARA FRONT END (client):
npx create-react-app client
cd client
npm install react-router-dom
npm install axios
npm install react-toastify
npm install react-icons
npm install chart.js


TRAER EL REPOSITORIO DE GITHUB (cmd):
abrir una nueva cmd
cd desktop/escritorio (o ruta de facil acceso)
git clone https://github.com/Joansinho/PROYECTO_FORMACION.git

Despues de clonar el repositorio llevar los archivos dentro de server y client a las carpetas correspondientes. (reemplazar si es necesario)


PARA BACKEND (server):
cd server
npm install morgan
npm install mysql
npm install dotenv
npm install bcryptjs jsonwebtoken
npm install express nodemailer cors body-parser mysql2
npm install express
npm install nodemailer
npm install cors
npm install body-parser
npm install mysql2
npm install express-validator

EN WORKBENCH:
Crear la base de datos llamada dbentquim.
Insertar el script de base de datos.

Abrir un cmd y ejecutar lo siguiente:
mysql -u root -p
use dbentquim
CREATE USER 'adminentquim'@'localhost' IDENTIFIED BY 'entquim123';
GRANT ALL PRIVILEGES ON dbentquim. * TO 'adminentquim'@'localhost';
FLUSH PRIVILEGES;
exit;
(se puede crear un usuario con cualquier nombre y contraseña, es recomendable crear este.)


SI EL USUARIO YA ESTA CREADO SE DEBE ELIMINAR Y VOLVER A CREAR PARA QUE HAYA CONEXION CON LA BD.


node server.js en una terminal de visual code para correr el backend.
