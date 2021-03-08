<?php
// Desactivar toda notificación de error
error_reporting(0);

include('../../Config/Config.php');
EXTRACT($_REQUEST);

$class_clientes = new categoria($conexion);
$cliente = isset($cliente) ? $cliente : '[]';
print_r($class_clientes->recibirDatos($cliente));

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
     * @param $cliente son los datos que viene desde el FRONT-END
     */
    public function recibirDatos($cliente){
        $this->datos = json_decode($cliente, true);
        return $this->validarDatos();
    }
    private function validarDatos(){
        
        return $this->almacenarDatos();
    }
    private function almacenarDatos(){
        if( $this->respuesta['msg']==='correcto' ){
            if( $this->datos['accion']==='nuevo' ){
                $this->db->consultas('
                    INSERT INTO clientes (codigo, nombre, direccion,zona) VALUES(
                        "'.$this->datos['codigo'].'",
                        "'.$this->datos['nombre'].'",
                        "'.$this->datos['direccion'].'",
                        "'.$this->datos['zona'].'"
                    )
                ');
                return $this->respuesta;
            } else if( $this->datos['accion']==='modificar' ){
                $this->db->consultas('
                    UPDATE clientes SET
                        codigo        = "'.$this->datos['codigo'].'",
                        nombre   = "'.$this->datos['nombre'].'",
                        direccion   = "'.$this->datos['direccion'].'",
                        zona  = "'.$this->datos['zona'].'"
                    WHERE idCliente = "'.$this->datos['idCliente'].'"
                ');
                return $this->db->obtener_respuesta();
            } else if( $this->datos['accion']==='eliminar' ){
                $this->db->consultas('
                    DELETE FROM clientes
                    WHERE idCliente = "'.$this->datos['idCliente'].'"
                ');
                return $this->db->obtener_respuesta();
            } else if( $this->datos['accion']==='get_data' ){
                $this->db->consultas('SELECT idCliente, nombre FROM clientes');

                $response = array();

                while($row = mysqli_fetch_assoc($this->db->obtener_respuesta())){

                    $response[] = $row;
                }

                return json_encode($response);
            }
        } else{
            return $this->respuesta;
        }
    }
}