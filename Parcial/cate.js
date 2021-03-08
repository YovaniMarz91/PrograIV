Vue.component('component-categorias',{
    data:()=>{
        return {
            msg    : '',
            status : false,
            error  : false,
            buscar : "",
            categoria:{
                accion : 'nuevo',
                idCategoria  : 0,
                codigo      : '',
                descripcion : ''
            },
            lecturas:[]
        }
    },
    methods:{
        buscandoCategoria(){
            this.categorias = this.categorias.filter((element,index,categorias) => element.descripcion.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 || element.codigo.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 );
            if( this.buscar.length<=0){
                this.obtenerDatos();
            }
        },
        buscandoCodigoCategoria(store){
            let buscarCodigo = new Promise( (resolver,rechazar)=>{
                let index = store.index("codigo"),
                    data = index.get(this.categoria.codigo);
                data.onsuccess=evt=>{
                    resolver(data);
                };
                data.onerror=evt=>{
                    rechazar(data);
                };
            });
            return buscarCodigo;
        },
        async guardarCategoria(){
            /**
             * webSQL -> DB Relacional en el navegador
             * localStorage -> BD NOSQL clave/valor
             * indexedDB -> BD NOSQL clave/valor
             */
            let store = this.abrirStore("tblcategorias",'readwrite'),
                duplicado = false;
            if( this.categoria.accion=='nuevo' ){
                this.categoria.idCategoria = generarIdUnicoDesdeFecha();
                
                let data = await this.buscandoCodigoCategoria(store);
                duplicado = data.result!=undefined;
            }
            if( duplicado==false && this.categoria.codigo.trim()!=""){
                fetch(`private/modulos/categorias/administracion.php?categoria=${JSON.stringify(this.categoria)}`,
                    {credentials: 'same-origin'})
                    .then(resp=>resp.json())
                    .then(resp=>{
                        this.obtenerDatos();
                        this.limpiar();
                        
                        this.mostrarMsg('Registro se guardo con exito',false);
                    });

                let query = store.put(this.categoria);
                query.onsuccess=event=>{
                    this.obtenerDatos();
                    this.limpiar();
                    
                    this.mostrarMsg('Registro se guardo con exito',false);
                };
                query.onerror=event=>{
                    this.mostrarMsg('Error al guardar el registro',true);
                    console.log( event );
                };
            } else{
                this.mostrarMsg('Codigo de categoria duplicado, o vacio',true);
            }
        },
        mostrarMsg(msg, error){
            this.status = true;
            this.msg = msg;
            this.error = error;
            this.quitarMsg(3);
        },
        quitarMsg(time){
            setTimeout(()=>{
                this.status=false;
                this.msg = '';
                this.error = false;
            }, time*1000);
        },
        obtenerDatos(){
            fetch(`private/modulos/lectura/administracion.php?cliente={"accion":"get_data"}`,
            {credentials: 'same-origin'})
            .then(resp=>resp.json())
            .then(resp=>{
                this.lecturas = JSON.parse(JSON.stringify(resp));
            });

            this.lecturas.accion = 'nuevo';
        },
        mostrarCategoria(cli){
            this.cliente = cli;
        },
        limpiar(){
            this.categoria.accion='nuevo';
            this.categoria.idCategoria='';
            this.categoria.codigo='';
            this.categoria.descripcion='';
            this.obtenerDatos();
        },
        eliminarCategoria(pro){
            if( confirm(`Esta seguro que desea eliminar el categoria:  ${pro.descripcion}`) ){

                this.categoria = pro;
                this.categoria.accion = "eliminar";
                fetch(`private/modulos/categorias/administracion.php?categoria=${JSON.stringify(this.categoria)}`,
                    {credentials: 'same-origin'})
                    .then(resp=>resp.json())
                    .then(resp=>{
                        this.obtenerDatos();
                        this.limpiar();
                        
                        this.mostrarMsg('Registro se eliminno con exito',true);
                    });

                let store = this.abrirStore("tblcategorias",'readwrite'),
                    req = store.delete(pro.idCategoria);
                req.onsuccess=resp=>{
                    this.mostrarMsg('Registro eliminado con exito',true);
                    this.obtenerDatos();
                };
                req.onerror=resp=>{
                    this.mostrarMsg('Error al eliminar el registro',true);
                    console.log( resp );
                };
            }
        },
        abrirStore(store,modo){
            let tx = db.transaction(store,modo);
            return tx.objectStore(store);
        }
    },
    created(){
        this.obtenerDatos();
    },
    template:`
        <form v-on:submit.prevent="guardarCliente" v-on:reset="limpiar">
            <div class="row">
                <div class="col-sm-5">
                    <div class="row p-2">
                        <div class="col-sm text-center text-white bg-danger">
                            <h5>REGISTRO DE LECTURAS</h5>
                           
                        </div>
                    </div>
                    <div class="row p-2">
                    <div class="col">
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th>NOMBRE</th>
                                <th>LECTURA ANTERIOR</th>
                                <th>LECTURA ACTUAL</th>
                                <th>PAGO</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="lec in lecturas">
                                <td>{{ lec.nombre }}</td>
                                <td>0</td>
                                <td><input type="text" class="form-control"> </td>
                                <td>0</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                    </div>
                    <div class="row">
                     <div class="col-sm-5">
                        <button class="btn btn-dark" type="submit">Nuevo</button>
                          <button class="btn btn-dark" type="submit">Guardar</button>
                         <button class="btn btn-warning" type="submit">Limpiar</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    `
});