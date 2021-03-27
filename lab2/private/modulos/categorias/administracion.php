<?php
include('../../Config/Config.php');
EXTRACT($_REQUEST);

$class_categoria = new categoria($conexion);
$categoria = isset($categoria) ? $categoria : '[]';
print_r($class_categoria->$accion($categoria));

/**
 * @class categoria representa la administracion de las categorias
 */
class categoria{
    /**
     * @__construct @param $db representa la conexion a la BD
     */
    private $datos=[], $db;
    public $respuesta = ['msg'=>'correcto'];
    public function __construct($db=''){
        $this->db = $db;
    }
    /**
     * @function recibirDatos recibe los datos de la categoria
     * @param $categoria son los datos que viene desde el FRONT-END
     */
    public function recibirDatos($categoria){
        $this->datos = json_decode($categoria, true);
        return $this->validarDatos();
    }
    private function validarDatos(){
        if( empty(trim($this->datos['codigo'])) ){
            $this->respuesta['msg'] = 'Por favor digite el codigo de la categoria';
        }
        if( empty(trim($this->datos['descripcion'])) ){
            $this->respuesta['msg'] = 'Por favor digite la descripcion de la categoria';
        }
        if( empty(trim($this->datos['idCategoria'])) ){
            $this->respuesta['msg'] = 'Algo inesperado paso y no se obtuvo el ID de la categoria';
        }
        return $this->almacenarDatos();
    }
    private function almacenarDatos(){
        if( $this->respuesta['msg']==='correcto' ){
            if( $this->datos['accion']==='nuevo' ){
                $this->db->consultas(
                    'INSERT INTO db_sistema_facturacion.categorias (codigo,descripcion,idC) VALUES(?,?,?)',
                    $this->datos['codigo'],$this->datos['descripcion'],$this->datos['idCategoria']
                );
                return $this->db->obtenerUltimoId();
            } else if( $this->datos['accion']==='modificar' ){
                $this->db->consultas('
                    UPDATE db_sistema_facturacion.categorias SET codigo=?,descripcion=? WHERE idC=?',
                    $this->datos['codigo'],$this->datos['descripcion'],$this->datos['idCategoria']
                );
                return $this->db->obtener_respuesta();
            } else if( $this->datos['accion']==='eliminar' ){
                $this->db->consultas('
                    DELETE categorias 
                    FROM db_sistema_facturacion.categorias
                    WHERE idC=?',$this->datos['idCategoria']
                );
                return $this->db->obtener_respuesta();
            }
        } else{
            return $this->respuesta;
        }
    }
    public function obtenerDatos($datos=''){
        $this->db->consultas('select idC AS idCategoria,codigo,descripcion from db_sistema_facturacion.categorias');
        return json_encode($this->db->obtener_datos());
    }
}