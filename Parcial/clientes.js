Vue.component('component-clientes',{
    data:()=>{
        return {
            accion : 'nuevo',
            msg    : '',
            status : false,
            error  : false,
            buscar : "",
            cliente:{
                accion : 'nuevo',
                codigo    : '',
                nombre    : '',
                direccion : '',
                zona  : '',
            },
            clientes:[]
        }
    },
    methods:{
        buscandoCliente(){
            this.clientes = this.clientes.filter((element,index,clientes) => element.nombre.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 || element.codigo.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 );
            if( this.buscar.length<=0){
                this.obtenerDatos();
            }
        },
        buscandoCodigoCliente(store){
            let buscarCodigo = new Promise( (resolver,rechazar)=>{
                let index = store.index("codigo"),
                    data = index.get(this.cliente.codigo);
                data.onsuccess=evt=>{
                    resolver(data);
                };
                data.onerror=evt=>{
                    rechazar(data);
                };
            });
            return buscarCodigo;
        },
        async guardarCliente(){
            fetch(`private/modulos/clientes/administracion.php?cliente=${JSON.stringify(this.cliente)}`,
            {credentials: 'same-origin'})
            .then(resp=>{
                this.obtenerDatos();
                this.limpiar();
                
                this.mostrarMsg('Registro se guardo con exito',false);
            });
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
            this.cliente.accion = 'get_data';

            fetch(`private/modulos/clientes/administracion.php?cliente=${JSON.stringify(this.cliente)}`,
            {credentials: 'same-origin'})
            .then(resp=>resp.json())
            .then(resp=>{
                this.clientes = JSON.parse(JSON.stringify(resp));
            });

            this.cliente.accion = 'nuevo';
        },
        mostrarCliente(cli){
            this.cliente = cli;
            this.cliente.accion='modificar';
        },
        limpiar(){
            this.cliente.accion='nuevo';
            this.cliente.codigo='';
            this.cliente.nombre='';
            this.cliente.direccion='';
            this.cliente.zona='';
            this.obtenerDatos();
        },
        eliminarCliente(cli){
            if( confirm(`Esta seguro que desea eliminar el cliente: ${cli.nombre}`) ){
                cli.accion = 'eliminar';

                fetch(`private/modulos/clientes/administracion.php?cliente=${JSON.stringify(cli)}`,
                {credentials: 'same-origin'})
                .then(resp=>{
                    console.log(resp);
                    this.obtenerDatos();
                    
                    this.mostrarMsg('Registro se elimino con exito',false);
                });
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
                            <h5>REGISTRO DE CLIENTES</h5>
                           
                        </div>
                    </div>
                    <div class="row p-2">
                        <div class="col-sm">CODIGO:</div>
                        <div class="col-sm">
                            <input v-model="cliente.codigo" required pattern="^[0-9]{2}$" type="text" class="form-control form-control-sm" >
                        </div>
                    </div>
                    <div class="row p-2">
                        <div class="col-sm">NOMBRE: </div>
                        <div class="col-sm">
                            <input v-model="cliente.nombre" required pattern="[A-ZÑña-z0-9 ]{5,65}" type="text" class="form-control form-control-sm">
                        </div>
                    </div>
                    <div class="row p-2">
                        <div class="col-sm">DIRECCION:</div>
                        <div class="col-sm">
                            <input v-model="cliente.direccion" required pattern="[A-ZÑña-z0-9 ]{5,65}" type="text" class="form-control form-control-sm">
                        </div>
                    </div>
                    <div class="row p-2">
                        <div class="col-sm">ZONA:</div>
                        <div class="col-sm">
                            <input v-model="cliente.zona" required pattern="[A-ZÑña-z0-9 ]{5,65}" type="text" class="form-control form-control-sm">
                        </div>
                    </div>
                    <div class="row p-2">
                        <div class="col-sm text-center">
                            <input type="submit" value="Guardar" class="btn btn-dark">
                            <input type="reset" value="Limpiar" class="btn btn-warning">
                        </div>
                    </div>
                </div>
                <div class="col-sm"></div>
                <div class="col-sm-6 p-2">
                    <div class="row text-center text-white bg-danger">
                        <div class="col"><h5>CLIENTES REGISTRADOS</h5></div>
                        <form class="d-flex">
                        <input class="form-control me-2" type="search" placeholder="Buscar" aria-label="Search">
                        <button class="btn btn-dark" type="submit">Buscar</button>
                      </form>
                    </div>
                    <div class="row">
                        <div class="col">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>CODIGO</th>
                                        <th>NOMBRE</th>
                                        <th>DIRECCION</th>
                                        <th>ZONA</th>
                                        <th>ACCIÓN</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="cli in clientes">
                                        <td>{{ cli.codigo }}</td>
                                        <td>{{ cli.nombre }}</td>
                                        <td>{{ cli.direccion }}</td>
                                        <td>{{ cli.zona }}</td>
                                        <td><button type="button" class="btn btn-success" v-on:click="mostrarCliente(cli)">Editar</button> | <button type="button" class="btn btn-warning" v-on:click="eliminarCliente(cli)">Borrar</button></td>
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