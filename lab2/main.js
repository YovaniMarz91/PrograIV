var miUniversiad = openDatabase('universidad','1.0','Aplicacion de alumnos',5*1024*1024);
window.id = 4;
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
                miUniversiad.transaction(tran=>{
                    tran.executeSql('INSERT INTO alumnos(id_alumno,nombre,correo,direccion,telefono,contrasena) VALUES(?,?,?,?,?,?) ',
                        [++id,this.alumno.nombre,this.alumno.correo,this.alumno.direccion,this.alumno.telefono,this.alumno.contrasena]);
                    //this.obtenerProductos();
                    //this.limpiar();
                }, err=>{
                    console.log( err );
                });
            }
            else {
                alert('Las contraseñas no coinciden');
            }
            
        },
        obtenerImg(e){
            //IMG 1
            let rutaTemp = URL.createObjectURL(e.target.files[0]);
            this.producto.img = rutaTemp;
            //IMG2
            /*rutaTemp = URL.createObjectURL(e.target.files[1]);
            this.producto.img2 = rutaTemp;*/
        },
        obtenerProductos(){
            /*miUniversiad.transaction(tran=>{
                tran.executeSql('SELECT * FROM productos',[],(index,data)=>{
                    this.productos = data.rows;
                    id=data.rows.length;
                });
            }, err=>{
                console.log( err );
            });*/
        },
        mostrarProducto(pro){
            this.producto = pro;
        },
        limpiar(){
            this.producto.codigo='';
            this.producto.descripcion='';
            this.producto.precio='';
            this.producto.img='';
        },
        borrarProducto(pro){
            /**
             * BD Web SQL
            */
            if(confirm("¿Eliminar?")){
                miUniversiad.transaction(tran=>{
                    tran.executeSql('DELETE FROM productos WHERE idProducto=?', [pro.idProducto]);
                    this.obtenerProductos();
                    this.limpiar();
                }, err=>{
                    console.log( err );
                });
            }
        }
    },
    created(){
        miUniversiad.transaction(tran=>{
            tran.executeSql('CREATE TABLE IF NOT EXISTS `alumnos` (`id_alumno` int(11) NOT NULL, `nombre` varchar(50), `correo` varchar(50), `direccion` text, `telefono` varchar(15), `contrasena` varchar(150), PRIMARY KEY (`id_alumno`));');
        }, err=>{
            console.log( err );
        });
        this.obtenerProductos();
    }
});