db.personas.aggregate([
    //Primer Embudo
    { $match: { gender: "female" } },
    //Agrupacion
    {
        $group:
        {
            //Campo para agrupacion en este caso se va a llamar ciudad que apuntara al campo del json location.city  
            _id: { ciudad: "$location.city" },
            //Operadore de acumulacion en este caso vamos a sumar el numero de registros (las personas por ciudad)
            personas: {
                //Iremos incrementando en uno
                $sum: 1
            }
        }
    },
    {
        //Orden Descendente
        $sort: { personas: -1 }
    }
]).pretty()

db.personas.aggregate([{ $match: { gender: "female" } }, { $group: { _id: { ciudad: "$location.city" }, personas: { $sum: 1 } } }, { $sort: { personas: -1 } }]).pretty()



//Proyeccion
db.personas.aggregate(
    [
        //No mostramos el _id, mostramos el gender, creamos un nuevo campo Nombre Completo con la concatenacion de $name.first + $name.last
        {
            $project: {
                _id: 0, gender: 1, NombreCompleto: {
                    $concat: [
                        //Primera letra en mayuscula posicion 0
                        { $toUpper: { $substrCP: ["$name.first", 0, 1] } },
                        //El resto del nombre desde la posicion 1
                        //Resto la longitud de la cadena - 1
                        { $substrCP: ["$name.first", 1, { $subtract: [{ $strLenCP: "$name.first" }, 1] }] }
                        ,
                        " ",
                        //Primera letra en mayuscula posicion 0
                        { $toUpper: { $substrCP: ["$name.last", 0, 1] } },
                        //El resto del nombre desde la posicion 1
                        //Resto la longitud de la cadena - 1
                        { $substrCP: ["$name.last", 1, { $subtract: [{ $strLenCP: "$name.last" }, 1] }] }
                    ]


                }
            }
        }
    ]
).pretty()


db.personas.aggregate([{ $project: { _id: 0, gender: 1, NombreCompleto: { $concat: [{ $toUpper: "$name.first" }, " ", { $toUpper: "$name.last" }] } } }]).pretty()


db.personas.aggregate([
{$project: {_id: 0, gender: 1, NombreCompleto: {$concat: [{ $toUpper: { $substrCP: ["$name.first", 0, 1] } },{ $substrCP: ["$name.first", 1, { $subtract: [{ $strLenCP: "$name.first" }, 1] }] }," ",{ $toUpper: { $substrCP: ["$name.last", 0, 1] } },{ $substrCP: ["$name.last", 1, { $subtract: [{ $strLenCP: "$name.last" }, 1] }] }]}}}]).pretty()