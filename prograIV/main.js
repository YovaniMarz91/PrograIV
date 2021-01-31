var miDBUsuarios = openDatabase('dbProductos','1.0','Aplicacion de Productos',5*1024*1024);
window.id = 0;
if(!miDBUsuarios){
    alert("Elnavegador no soporta Web SQL");
}
var appVue = new Vue({
    el:'#appUsuarios',
    data:{
        Usuarios:{
            idUsuario  : 0,
            Nombre     : '',
            Apellido : '',
            Direccion      : '',
            img         : '/prograIV/images/No-image-available.png',
            img2        : '/prograIV/images/No-image-available.png',
            
        }
    },
    methods:{
        guardarUsuario(){
            /**
             * BD Web SQL
             */
            miDBUsuarios.transaction(tran=>{
                tran.executeSql('INSERT INTO productos(idProducto,codigo,descripcion,precio,img) VALUES(?,?,?,?,?) ',
                    [++id,this.usuario.nombre,this.usuario.apellido,this.usuario.direccion, this.usuario.img]);
                this.obtenerUsuarios();
                this.limpiar();
                
            }, err=>{
                console.log( err );
            });
        },
        obtenerImg(e){
            //IMG 1
            let rutaTemp = URL.createObjectURL(e.target.files[0]);
            this.producto.img = rutaTemp;
            //IMG2
            /*rutaTemp = URL.createObjectURL(e.target.files[1]);
            this.producto.img2 = rutaTemp;*/
        },
        obtenerDatos(){
            miDBUsuarios.transaction(tran=>{
                tran.executeSql('SELECT * FROM productos',[],(index,data)=>{
                    this.productos = data.rows;
                    id=data.rows.length;
                });
            }, err=>{
                console.log( err );
            });
        },
        mostrarDatos(usu){
            this.usuario = usu;
        },
        limpiar(){
            this.usuario.nombre='';
            this.usuario.apellido='';
            this.usuario.direccion='';
            this.usuario.img='';
        }
      
    },
    created(){
        miDBUsuarios.transaction(tran=>{
            tran.executeSql('CREATE TABLE IF NOT EXISTS productos(idProducto int PRIMARY KEY NOT NULL, nombre varchar(10), apellido varchar(10), direccion varchar(65),img varchar(100))');
        }, err=>{
            console.log( err );
        });
        this.obtenerDatos();
    }
});