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
            categorias:[]
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
                fetch(`private/modulos/categorias/administracion.php?categoria=${JSON.stringify(this.categoria)}&accion=recibirDatos`,
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
            let store = this.abrirStore('tblcategorias','readonly'),
                data = store.getAll();
            data.onsuccess=resp=>{
                if( data.result.length==0 ){
                    fetch('private/modulos/categorias/administracion.php?accion=obtenerDatos',{credentials: 'same-origin'})
                        .then(data=>data.json())
                        .then(resp=>{
                            let store = this.abrirStore("tblcategorias",'readwrite');
                            resp.forEach(element => {
                                store.put( element );
                            });
                            this.categorias = resp;
                        });
                } else {
                    this.categorias = data.result;
                }
            };
        },
        mostrarCategoria(pro){
            this.categoria = pro;
            this.categoria.accion='modificar';
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
        //this.obtenerDatos();
    },
    template:`
        <form v-on:submit.prevent="guardarCategoria" v-on:reset="limpiar">
            <div class="row">
                <div class="col-sm-5">
                    <div class="row p-2">
                        <div class="col-sm text-center text-white bg-primary">
                            <div class="row">
                                <div class="col-11">
                                    <h5>REGISTRO DE CATEGORIAS</h5>
                                </div>
                                <div class="col-1 align-middle" >
                                    <button type="button" onclick="appVue.forms['categoria'].mostrar=false" class="btn-close" aria-label="Close"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row p-2">
                        <div class="col-sm">CODIGO:</div>
                        <div class="col-sm">
                            <input v-model="categoria.codigo" required type="text" class="form-control form-control-sm" >
                        </div>
                    </div>
                    <div class="row p-2">
                        <div class="col-sm">DESCRIPCION: </div>
                        <div class="col-sm">
                            <input v-model="categoria.descripcion" required pattern="[A-ZÑña-z0-9, ]{5,65}" type="text" class="form-control form-control-sm">
                        </div>
                    </div>
                    <div class="row p-2">
                        <div class="col-sm text-center">
                            <input type="submit" value="Guardar" class="btn btn-dark">
                            <input type="reset" value="Limpiar" class="btn btn-warning">
                        </div>
                    </div>
                    <div class="row p-2">
                        <div class="col-sm text-center">
                            <div v-if="status" class="alert" v-bind:class="[error ? 'alert-danger' : 'alert-success']">
                                {{ msg }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm"></div>
                <div class="col-sm-6 p-2">
                    <div class="row text-center text-white bg-primary">
                        <div class="col"><h5>CATEGORIAS REGISTRADOS</h5></div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <table class="table table-sm table-hover">
                                <thead>
                                    <tr>
                                        <td colspan="5">
                                            <input v-model="buscar" v-on:keyup="buscandoCategoria" type="text" class="form-control form-contro-sm" placeholder="Buscar categorias">
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>CODIGO</th>
                                        <th>DESCRIPCION</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="pro in categorias" v-on:click="mostrarCategoria(pro)">
                                        <td>{{ pro.codigo }}</td>
                                        <td>{{ pro.descripcion }}</td>
                                        <td>
                                            <a @click.stop="eliminarCategoria(pro)" class="btn btn-danger">DEL</a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    `
});