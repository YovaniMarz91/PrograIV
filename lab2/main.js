var miUniversiad = openDatabase('universidad','1.0','Aplicacion de alumnos',5*1024*1024);
window.id = 0;
window.base = 'http://localhost/PrograIV/lab2/';

if(!miUniversiad){
    alert("Elnavegador no soporta Web SQL");
}
var appVue = new Vue({
    el:'#appUniversidad',
    data:{
        alumno:{
            nombre : '',
            correo : '',
            direccion : '',
            telefono : '',
            contrasenia : '',
            contrasenia2 : ''
        }
    },
    methods:{
        guardarAlumno(){
            if (this.alumno.contrasena == this.alumno.contrasena2) {
                this.obtenerAlumnos();

                miUniversiad.transaction(tran=>{
                    tran.executeSql('INSERT INTO alumnos(id_alumno,nombre,correo,direccion,telefono,contrasena,matricula) VALUES(?,?,?,?,?,?,?) ',
                        [++id,this.alumno.nombre,this.alumno.correo,this.alumno.direccion,this.alumno.telefono,this.alumno.contrasena,0]);
                    //this.obtenerProductos();
                    //this.limpiar();

                    alert('Registrado!');
                    window.location.replace(base + "login.html");
                }, err=>{
                    console.log( err );
                });
            }
            else {
                alert('Las contraseñas no coinciden');
            }
            
        },
        obtenerAlumnos(){
            miUniversiad.transaction(tran=>{
                tran.executeSql('SELECT * FROM alumnos',[],(index,data)=>{
                    id=data.rows.length;
                });
            }, err=>{
                console.log( err );
            });
        },
        login(){
            miUniversiad.transaction(tran=>{
                tran.executeSql('SELECT id_alumno FROM alumnos WHERE correo=? AND contrasena=?',[this.alumno.correo,this.alumno.contrasena],(index,data)=>{
                    if (data.rows.length == 1) {
                        $cookies.set('login', '1');
                        window.location.replace(base + "registro.html");
                    }
                    else {
                        alert('Datos incorrectos');
                    }
                });
            }, err=>{
                console.log( err );
            });
        }
    },
    created(){
        miUniversiad.transaction(tran=>{
            tran.executeSql('CREATE TABLE IF NOT EXISTS `alumnos` (`id_alumno` int(11) NOT NULL, `nombre` varchar(50), `correo` varchar(50), `direccion` text, `telefono` varchar(15), `contrasena` varchar(150), `matricula` int(1), PRIMARY KEY (`id_alumno`)); ');
        }, err=>{
            console.log( err );
        });

        /*miUniversiad.transaction(tran=>{
            tran.executeSql('CREATE TABLE IF NOT EXISTS `materias` (`id_materia` int(11) NOT NULL, `nombre` varchar(50) DEFAULT NULL, PRIMARY KEY (`id_materia`));');
        }, err=>{
            console.log( err );
        });

        miUniversiad.transaction(tran=>{
            tran.executeSql('CREATE TABLE IF NOT EXISTS `inscripcion` (`id_inscripcion` int(11) NOT NULL, `id_alumno` int(11) DEFAULT NULL, `id_materia` int(11) DEFAULT NULL, PRIMARY KEY (`id_inscripcion`), KEY `id_alumno` (`id_alumno`), KEY `id_materia` (`id_materia`), CONSTRAINT `FK_inscripcion_alumnos` FOREIGN KEY (`id_alumno`) REFERENCES `alumnos` (`id_alumno`) ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT `FK_inscripcion_materias` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`) ON DELETE CASCADE ON UPDATE CASCADE));');
        }, err=>{
            console.log( err );
        });*/

        
    }
});