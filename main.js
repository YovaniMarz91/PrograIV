var miDBProductos = openDatabase('dbProductos','1.0','Aplicacion de Productos',5*1024*1024);
window.id = 0;
if(!miDBProductos){
    alert("Elnavegador no soporta Web SQL");
}
var appVue = new Vue({
    el:'#appProductos',
    data:{
        producto:{
            idProducto  : 0,
            codigo      : '',
            descripcion : '',
            precio      : '',
            img         : '/images/No-image-available.png',
            img2        : '/images/No-image-available.png'
        },
        productos:[]
    },
    methods:{
        guardarProducto(){
            /**
             * BD Web SQL
             */
            miDBProductos.transaction(tran=>{
                tran.executeSql('INSERT INTO productos(idProducto,codigo,descripcion,precio,img) VALUES(?,?,?,?,?) ',
                    [++id,this.producto.codigo,this.producto.descripcion,this.producto.precio, this.producto.img]);
                this.obtenerProductos();
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
        obtenerProductos(){
            miDBProductos.transaction(tran=>{
                tran.executeSql('SELECT * FROM productos',[],(index,data)=>{
                    this.productos = data.rows;
                    id=data.rows.length;
                });
            }, err=>{
                console.log( err );
            });
        },
        mostrarProducto(pro){
            this.producto = pro;
        },
        limpiar(){
            this.producto.codigo='';
            this.producto.descripcion='';
            this.producto.precio='';
            this.producto.img='';
        }
    },
    created(){
        miDBProductos.transaction(tran=>{
            tran.executeSql('CREATE TABLE IF NOT EXISTS productos(idProducto int PRIMARY KEY NOT NULL, codigo varchar(10), descripcion varchar(65), precio decimal(4,2),img varchar(100))');
        }, err=>{
            console.log( err );
        });
        this.obtenerProductos();
    }
});