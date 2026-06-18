export interface Item {
  id: string;
  name: string;
  price?: number;
  type: 'recipe' | 'procedure' | 'info';
  tags: string[];
  description?: string;
  ingredients?: string[];
  steps?: string[];
  notes?: string[];
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  items: Item[];
}

export const COFFEE_DATA: Category[] = [
  {
    id: "indicaciones",
    name: "Indicaciones Generales",
    icon: "📋",
    color: "#4CAF50",
    items: [
      {
        id: "ind-antes",
        name: "Antes de la jornada de trabajo",
        type: "procedure",
        tags: ["protocolo", "mañana"],
        steps: [
          "Notificar enfermedades al superior inmediato.",
          "Encender la máquina de espresso siempre colocar en posición 1 la perilla de encendido y dejar que la bomba cargue el nivel de agua, luego colocar en posición 2 la perilla para que empiece a calentar, el calentamiento se realizará aproximadamente en 30 minutos",
          "Pulgar el molino de café por 5 segundos (Sacar Molienda para espresso y reservar)",
          "Quitar condensación de la máquina de espresso abriendo lancetas hasta que salga solo vapor y realizar erogación en porta filtros.",
          "Limpiar el establecimiento completamente antes de iniciar la jornada de trabajo.",
          "Iniciar con tachos de basura limpios.",
          "Revisar caducidad de postres y sospechas de algún daño en los productos.",
          "Realizar requisición de productos faltantes en base al menú del establecimiento. (Esto se hace la noche Anterior)"
        ]
      },
      {
        id: "ind-durante",
        name: "Durante la Jornada de trabajo",
        type: "procedure",
        tags: ["servicio", "calidad"],
        steps: [
          "Recuerda Calentar las tazas con agua caliente de la maquina antes de preparar una bebida caliente",
          "Prohibido ingresar familiares y personas no autorizadas al área de procesos.",
          "Prohibido recibir visitas personales en horario de trabajo.",
          "Prohibido del uso de auriculares en horario laboral",
          "Usar correctamente el uniforme asignado completamente limpio.",
          "Mantener siempre limpia la máquina de espresso.",
          "Mantener siempre limpias las 3 toallas de la máquina, toalla de lanceta de leche, toalla para secar y la tolla de pulir.",
          "Precalentar la freidora tanto en la mañana como en la tarde.",
          "El volumen del área de servicio debe ser controlado no alto.",
          "El sistema de climatización debe estar a 22°C",
          "La música que se utiliza en el área de servicio es música relajante.",
          "Saludar de manera muy cordial al cliente al llegar al establecimiento.",
          "Entregar lo más pronto posible el menú del establecimiento.",
          "Retirar platos de la mesa en cuanto el cliente termine el consumo no esperar a que se retire del establecimiento",
          "Despedir al cliente de la manera más cordial, invitándolo a que regrese pronto.",
          "Limpiar y pulir siempre el menaje con las tollas correspondientes.",
          "Respetar los procedimientos y las recetas establecidas.",
          "Respetar los precios establecidos en el menú.",
          "Respetar las promociones del día."
        ]
      },
      {
        id: "ind-despues",
        name: "Después de la Jornada de trabajo",
        type: "procedure",
        tags: ["cierre", "limpieza"],
        steps: [
          "Limpiar completamente la máquina y retirar el porta filtros de la máquina de espresso siempre al terminar la jornada de trabajo.",
          "Apagar los sistemas de climatización del establecimiento.",
          "Apagar las Luces del establecimiento.",
          "Apagar el televisor del establecimiento",
          "Desconectar el sistema de gas del establecimiento",
          "Dejar amarradas las fundas de basura.",
          "Dejar todo el menaje limpio.",
          "Dejar las instalaciones limpias.",
          "Guardar postres que necesiten refrigeración en nevera.",
          "Cuadrar caja.",
          "Enviar cierre de ventas del día.",
          "Cerrar correctamente el establecimiento."
        ]
      },
      {
        id: "ind-notas",
        name: "Notas Importantes",
        type: "info",
        tags: ["precios", "especificaciones"],
        notes: [
          "Para el filtro de un disparo utilizamos 8 gramos de Café molido que nos tienen que dar como resultado un espresso.",
          "Para el filtro de dos disparos utilizamos 17 gramos de Café molido que nos tienen que dar como resultado doble espresso.",
          "La Cantidad de Café por filtro lo define el Barista principal que dependerá del tipo de café que se esté utilizando y otros factores.",
          "El costo de crema adicional para cualquier bebida es de $0,50 centavos.",
          "El Cambio del tipo de leche tiene un costo adicional de $0,75 centavos."
        ]
      }
    ]
  },
  {
    id: "calientes",
    name: "Bebidas Calientes",
    icon: "☕",
    color: "#795548",
    items: [
      { id: "hot-1", name: "Espresso", price: 1.60, type: "recipe", tags: ["café"], ingredients: ["8 gr de café"], steps: ["Moler 8 gr de café, utilizar el porta filtro de un disparo y llevar a la máquina de espresso, extraer entre 20 y 30 segundos servir en taza de Espresso pequeña de 4-oz."] },
      { id: "hot-2", name: "Espresso Capuccino", price: 1.80, type: "recipe", tags: ["café"], ingredients: ["8 gr de café", "1 oz de leche espumada"], steps: ["Moler 8 gr de café, utilizar el porta filtro de un disparo y llevar a la máquina de espresso, extraer entre 20 y 30 segundos. Y agregar 1oz de leche espumada"] },
      { id: "hot-3", name: "Espresso Mocaccino", price: 2.25, type: "recipe", tags: ["café", "chocolate"], ingredients: ["1 oz de salsa de chocolate", "8 gr de café", "1 oz de leche espumada"], steps: ["Agregar 1oz de Salsa de chocolate en una taza de 4-oz, Moler 8 gr de café, utilizar el porta filtro de un disparo y llevar a la máquina de espresso, extraer entre 20 y 30 segundos sobre la taza de 4-oz. y agregar 1-oz de leche espumada."] },
      { id: "hot-4", name: "Café Bombom", price: 2.40, type: "recipe", tags: ["café", "dulce"], ingredients: ["15 ml de leche condensada", "8 gr de café"], steps: ["Agregar 15ml de leche condensada en una taza de 4-oz. Moler 8 gr de café, utilizar el porta filtro de un disparo y llevar a la máquina de espresso, extraer entre 20 y 30 segundos sobre la taza de 4-oz. No mezclar"] },
      { id: "hot-5", name: "Macchiato Dulce de Leche", price: 2.50, type: "recipe", tags: ["café", "dulce"], ingredients: ["1 oz de manjar de leche", "8 gr de café", "1 oz de leche espumada"], steps: ["Agregar 1 oz de Manjar de leche en una taza de 4-oz, Moler 8 gr de café, utilizar el porta filtro de un disparo y llevar a la máquina de espresso, extraer entre 20 y 30 segundos. Agregar 1-oz de leche espumada. No mezclar."] },
      { id: "hot-6", name: "Espresso doble", price: 1.80, type: "recipe", tags: ["café"], ingredients: ["17 gr de café"], steps: ["Moler 17 gr de café y llevar a la máquina de espresso, extraer entre 20 y 30 segundos unir los dos disparos, servir en taza de doble Espresso."] },
      { id: "hot-7", name: "Americano", price: 1.60, type: "recipe", tags: ["café"], ingredients: ["Agua caliente", "17 gr de café"], steps: ["Colocar agua Caliente de la Maquina de espresso en una taza de 6-Oz de cristal, Moler 17 gr de café y llevar a la máquina de espresso, extraer entre 20 y 30 segundos unir los dos disparos sobre el agua caliente."] },
      { id: "hot-8", name: "Capuccino Ideal", price: 2.00, type: "recipe", tags: ["café"], ingredients: ["8 gr de café", "170 gr (6 oz) de leche"], steps: ["Moler 8 gr de café y llevar a la máquina de espresso, extraer entre 20 y 30 segundos solo por un disparo en una taza de 6-oz transparente. Espumar (170gr o 6-oz) de Leche entre 60°C y 70°C lograr micro espuma y realizar diseño de arte Latte."] },
      { id: "hot-9", name: "Capuccino Grande", price: 3.00, type: "recipe", tags: ["café"], ingredients: ["17 gr de café", "200 gr (7 oz) de leche"], steps: ["Moler 17 gr de café y llevar a la máquina, extraer entre 20 y 30 segundos utilizar los dos disparos en una taza grande de 10-oz transparente. Espumar (200gr o 7-oz) de Leche entre 60°C y 70°C lograr micro espuma y realizar diseño de arte Latte."] },
      { id: "hot-10", name: "Capuccino Bayles", price: 3.50, type: "recipe", tags: ["café", "licor"], ingredients: ["8 gr de café", "15 ml de licor Bayles", "170 gr (6 oz) de leche"], steps: ["Moler 8 gr de café y llevar a la máquina, extraer entre 20 y 30 segundos solo por un disparo en una taza de 9-oz blanca. Agregar una 15ml de licor Bayles Espumar (170gr o 6-oz) de Leche entre 60°C y 70°C lograr micro espuma y realizar diseño de arte Latte."] },
      { id: "hot-11", name: "Capuccino Saborizado", price: 3.25, type: "recipe", tags: ["café"], ingredients: ["8 gr de café", "1 pump de esencia", "170 gr (6 oz) de leche"], steps: ["Moler 8 gr de café y llevar a la máquina, extraer entre 20 y 30 segundos solo por un disparo en una taza de 9-oz blanca. Agrega un pump de esencia elegida por el cliente. Espumar (170gr o 6-oz) de Leche entre 60°C y 70°C lograr micro espuma y realizar diseño de arte Latte."] },
      { id: "hot-12", name: "Flat White", price: 3.00, type: "recipe", tags: ["café"], ingredients: ["16 gr de café", "140 gr de leche"], steps: ["Moler 16 gr de café y llevar a la máquina, extraer entre 20 y 30 segundos utilizar los dos disparos, en una taza de 6-oz transparente. Espumar (140gr ) de Leche entre 60°C y 70°C lograr micro espuma y realizar diseño de arte Latte."] },
      { id: "hot-13", name: "Mocaccino Clásico", price: 2.85, type: "recipe", tags: ["café", "chocolate"], ingredients: ["8 gr de café", "1 oz (30 gr) de salsa de chocolate", "170 gr (6 oz) de leche"], steps: ["Moler 8 gr de café y llevar a la máquina, extraer entre 20 y 30 segundos solo por un disparo en una taza de 9-oz blanca. Agregar una 1oz de salsa de chocolate, (30gramos), mezclar el café con el chocolate, Espumar (170gr o 6-oz) de Leche entre 60°C y 70°C lograr micro espuma y realizar diseño de arte Latte."] },
      { id: "hot-14", name: "Mocaccino Bayles", price: 3.75, type: "recipe", tags: ["café", "chocolate", "licor"], ingredients: ["8 gr de café", "1 oz (30 gr) de salsa de chocolate", "15 ml de licor Bayles", "170 gr (6 oz) de leche"], steps: ["Moler 8 gr de café y llevar a la máquina, extraer entre 20 y 30 segundos solo por un disparo en una taza de 9-oz blanca. Agregar una 1oz de salsa de chocolate, (30gramos) y 15ml de licor Bayles, mezclar el café con el chocolate y el licor, Espumar (170gr o 6-oz) de Leche entre 60°C y 70°C lograr micro espuma y realizar diseño de arte Latte."] },
      { id: "hot-15", name: "Mocaccino Saborizado", price: 3.50, type: "recipe", tags: ["café", "chocolate"], ingredients: ["8 gr de café", "1 oz de salsa de chocolate", "1 pump de esencia", "Leche"], steps: ["Moler 8 gr de café y llevar a la máquina, extraer entre 20 y 30 segundos solo por un disparo en una taza de 9-oz blanca. Agregar una 1oz de salsa de chocolate, y 1 pump de esencia elegida por el cliente, mezclar el café con el chocolate y la esencia elegida, Espumar Leche entre 60°C y 70°C lograr micro espuma y realizar diseño de arte Latte."] },
      { id: "hot-16", name: "Dalgona", price: 3.00, type: "recipe", tags: ["café", "dulce"], ingredients: ["8 gr de café soluble", "30 gr de azúcar", "2 cucharadas de agua caliente", "170 gr (6 oz) de leche tibia", "3 unidades de masmelos"], steps: ["Hacer crema en una taza de 10-oz transparente alta con (8gr de café soluble 30 gr de azúcar y dos cucharadas de agua caliente, utilizar mini batidor de mano.) agregar (170gr o 6-oz) de leche tibia a 60°C sobre la crema, decorar con masmelos 3 unidades."] },
      { id: "hot-17", name: "Chocolate Caliente", price: 2.00, type: "recipe", tags: ["chocolate"], ingredients: ["60 gr helado chocolate", "30 gr salsa chocolate", "125 gr leche", "2 clavos de olor"], steps: ["Para el chocolate Caliente agregamos en una jarra para espumar 60 gramos de helado de chocolate más 30 gramos de salsa de chocolate y 125 gramos de leche junto a 2 clavos de olor y tamizar, espumamos hasta conseguir los 70 grados, servimos en taza grande y decoramos con canela salsa de chocolate y 3 unidades de masmelos."] },
      { id: "cold-chocolate", name: "Chocolate Frio", price: 2.00, type: "recipe", tags: ["chocolate", "frío"], ingredients: ["60 gr leche", "120 gr helado chocolate", "120 gr hielo", "50 gr salsa chocolate"], steps: ["En la licuadora agregamos 60 gramos de leche entera o de preferencia del cliente, 120 gramos de helado de chocolate, 120 gramos de hielo y 50gr de salsa de chocolate, licuamos hasta conseguir una textura cremosa y servimos en vaso de 12 oz decorado con salsa de Chocolate, una pizca de canela y agregar mashmelows."] },
      { id: "hot-18", name: "Café irlandés", price: 3.00, type: "recipe", tags: ["café", "licor"], ingredients: ["Agua caliente", "17 gr de café", "1 oz de whisky de la casa"], steps: ["Colocar agua Caliente de la Maquina en una taza de 6-oz transparente, Moler 17 gr de café y llevar a la máquina, extraer entre 20 y 30 segundos unir los dos disparos sobre el agua caliente. Agregar 1-oz de wiski de la casa."] },
      { id: "hot-19", name: "Infusiones - Té", price: 1.25, type: "recipe", tags: ["té"], ingredients: ["1 bolsita de té", "Agua caliente (90°C)"], steps: ["Agregar 1 bolsita de té elegidas por el cliente en una taza de 6-oz transparente con agua de la máquina de espresso a 90°C, servir."] }
    ]
  },
  {
    id: "metodos",
    name: "Métodos de Extracción",
    icon: "🔬",
    color: "#607D8B",
    items: [
      { id: "met-1", name: "Moka", type: "recipe", tags: ["método"], ingredients: ["25 g de café", "250 g de agua caliente"], steps: [
        "Utilizar 10 gramos de agua por cada gramos de café (1:10), tamaño de molienda medio fino similar al tamaño del azúcar, colocar el café molido en filtro sin presionar solo emparejando, luego llenamos con agua caliente la parte de debajo de la cafetera sin sobrepasar la válvula de escape, tapar con el porta filtro lleno de café llevar a la hornilla a fuego lento con la tapa levantada hasta que el flujo se vea interrumpido, tapar y bajar un poco la temperatura del café realizando un choque térmico servir y lavar muy bien el equipo incluido su caucho de silicón.",
        "(en nuestra cafetera moka colocamos 25g de café y 250g de agua caliente)"
      ] },
      { id: "met-2", name: "V60", type: "recipe", tags: ["método"], ingredients: ["30 g de café", "500 g de agua (92°C)"], steps: [
        "Vamos a utilizar 30g de café para 500g de agua a 92°C, tamaño de la molienda medio fino un poquito más grueso q la sal de mesa, doblamos el pliegue del filtro para que no se doble y lo colocamos en la porta filtro aplicamos agua caliente para quitar cualquier impureza y descartamos esa agua para poder colocar el café emparejar la cama de café y luego con una cuchara pequeña realizar un pequeño orificio en el centro.",
        "Colocamos sobre la balanza el v60 y vamos a crear el Blum agregaremos agua caliente el doble de peso de café movemos con una cuchara y dejamos reposar por unos 45 segundos, en este momento agregamos en forma continua 300g más de agua hasta el minuto quince 1:15, luego agregamos lo que falta de agua hasta el minuto cuarenta y cinco 1:45 el agua se vierte en contra de las manecillas del reloj, al terminar de colocar el agua hacer una turbulencia moviendo el porta filtro para crear una cama chata esperar que drene todo el líquido retirar el filtro y listo para servir."
      ] },
      { id: "met-3", name: "Prensa francesa", type: "recipe", tags: ["método"], ingredients: ["30 g de café", "500 g de agua (95°C)"], steps: [
        "Calentamos la prensa y las tazas a utilizar con agua caliente, utilizaremos 30g de café para 500g de agua a 95°C, moler el café en tamaño medio apenas más grande que los granos de arena, colocamos el café en la prensa y agregamos toda el agua en forma circular, colocar la tapa sin bajar el embolo de la prensa encendemos el timer y dejamos reposar por 4 minutos , después de este tiempo romper la costra de forma suave y retirar la espuma y dejar reposar ahora por 5 minutos, luego bajar el embolo hasta tener contacto con el café sin presionar y listo para servir."
      ] },
      { id: "met-4", name: "Café sifón", type: "recipe", tags: ["método"], ingredients: ["15 g de café", "250 g de agua"], steps: [
        "Utilizaremos 15g de café por 250g de agua, moler el café en tamaño fino, apenas más fino que la sal de mesa. Colocamos el agua en la cámara inferior del sifón encendemos el fuego en el mechero que la mecha quede cerca del borde aproximadamente 3 milímetros, colocamos el filtro en la parte superior jalamos el seguro colocamos sobre el cuerpo de abajo sin sellar completamente, esperamos hasta que el agua suba y agregamos el café, remover completamente y dejar infusionar por unos 45 segundos, retiramos el fuego y esperamos hasta que todo el café baje al primer cuerpo del sifón quitar la parte superior y está listo para servir."
      ] }
    ]
  },
  {
    id: "frias",
    name: "Bebidas Frías",
    icon: "🥤",
    color: "#2196F3",
    items: [
      { id: "cold-1", name: "Frappé Capuccino", price: 3.25, type: "recipe", tags: ["frappé"], ingredients: ["286 gr de leche", "7 gr de café oro soluble", "50 gr de almíbar"], steps: ["En producción realizar la premezcla con (286 gr de leche, 7 gr de café oro soluble). En barra utilizar esta premezcla junto a 50gr de almíbar “cada pump equivale a 7gr” servir en una copa pera de 13oz, decorar con crema y un croquito."] },
      { id: "cold-2", name: "Frappé Moca", price: 3.50, type: "recipe", tags: ["frappé"], ingredients: ["275 gr de leche", "7 gr de café oro soluble", "7 gr de cocoa alcalina", "50 gr de almíbar", "Salsa de chocolate", "Chispas de chocolate"], steps: ["En producción realizar la premezcla con (275 gr de leche, 7 gr de café oro soluble y 7gr de cocoa alcalina). En barra utilizar esta premezcla junto a 50gr de almíbar “cada pump equivale a 7gr” servir en una copa pera de 13oz previamente salseada con salsa de chocolate, decorar con crema, salsa de chocolate y chispas de chocolate"] },
      { id: "cold-3", name: "Frappé Oreo", price: 3.75, type: "recipe", tags: ["frappé"], ingredients: ["268 gr de leche", "47 gr de galleta Oreo", "30 gr de almíbar", "1 galleta Oreo"], steps: ["En producción realizar la premezcla con (268 gr de leche y 47 gr galleta oreo sin la crema blanca). En barra utilizar esta premezcla junto a 30gr de almíbar “cada pump equivale a 7gr” servir en una copa pera de 13oz decorar con crema y 1 galleta oreo."] },
      { id: "cold-4", name: "Affogato", price: 3.50, type: "recipe", tags: ["helado", "café"], ingredients: ["15 gr de leche condensada", "75 gr de helado de vainilla", "Salsa de chocolate", "3 masmelos", "Doble espresso"], steps: ["En una copa tipo ´´V´´ pequeña agregamos 15gr de leche condensada, agregamos una bola de helado de vainilla de 75 gr, salseamos con salsa de chocolate, 3 mashmellos, extraemos doble espresso en una jarra de cerámica blanca. Para servir llevamos al cliente es espresso en la jarra y la copa con el helado, frente al cliente agregamos el doble espresso sobre el contenido de la copa tipo ´´V´´."] },
      { id: "cold-5", name: "Affogato Brownie", price: 4.50, type: "recipe", tags: ["helado", "café"], ingredients: ["15 gr de leche condensada", "Brownie picado", "75 gr de helado de vainilla", "Salsa de chocolate", "3 masmelos", "1 cuadrado de brownie", "Doble espresso"], steps: ["En una copa tipo ´´V´´ pequeña agregamos 15gr de leche condensada, brownie picados, agregamos una bola de helado de vainilla de 75 gr, salseamos con salsa de chocolate, 3 mashmellos, y un cuadrado pequeño de brownie, extraemos doble espresso en una jarra de cerámica blanca. Para servir llevamos al cliente el espresso en la jarra y la copa con el helado, frente al cliente agregamos el doble espresso sobre el contenido de la copa tipo ´´V´´."] },
      { id: "cold-6", name: "Té de Frutos Rojos", price: 2.00, type: "recipe", tags: ["té"], ingredients: ["5 bolsitas de té de frutos rojos", "5 bolsitas de té de cereza salvaje", "Agua", "180 gr de almíbar"], steps: ["Colocar 5 tés de frutos rojos y 5 tés de cereza salvaje en la cafetera francesa y llenar de agua, colocar 180gr de almíbar repetir este paso 2 veces dejando las mismas bolsas de tés, esto nos daría una jarra de té de frutos rojos."] },
      { id: "milk-1", name: "Milkshake Vainilla", price: 3.80, type: "recipe", tags: ["milkshake"], ingredients: ["310 gr de helado de vainilla", "40 gr de leche entera"], steps: ["En el vaso de la máquina de milkshake agregar 310 de helado de vainilla, 40 gramos de leche entera o la de preferencia del cliente, encender el mixer con el producto que anteriormente se agregó y mezclar a máxima velocidad entre un minuto a dos minutos"] },
      { id: "milk-2", name: "Milkshake Chocolate", price: 3.80, type: "recipe", tags: ["milkshake"], ingredients: ["310 gr de helado de chocolate", "40 gr de leche entera", "Salsa de chocolate"], steps: ["Decorar el vaso con salsa de chocolate. En el vaso de la máquina de milkshake agregar 310 de helado de Chocolate, 40 gramos de leche entera o la de preferencia del cliente, encender el mixer con el producto que anteriormente se agregó y mezclar a máxima velocidad entre un minuto a dos minutos"] },
      { id: "milk-3", name: "Froot Loops Milkshake", price: 3.25, type: "recipe", tags: ["milkshake"], ingredients: ["310 gr de helado de vainilla", "40 gr de leche entera", "20 gr de Froot Loops", "Salsa de chocolate", "Crema chantilly"], steps: ["En el vaso de la máquina de milkshake agregar 310 de helado de Vainilla, 40 gramos de leche entera o la de preferencia del cliente, y 20gr de froot loops, encender el mixer con el producto que anteriormente se agregó y mezclar a máxima velocidad entre un minuto a dos minutos, salsear la copa con copa de chocolate y decorar con crema chantilly, salsa de chocolate y froot loops"] },
      { id: "milk-4", name: "Capuccino Milkshake", price: 4.25, type: "recipe", tags: ["milkshake"], ingredients: ["310 gr de helado de vainilla", "2 espressos"], steps: ["En el vaso de la máquina de milkshake agregar 310 de helado de Vainilla y 2 café espresso que previamente hemos extraído, encender el mixer con el producto que anteriormente se agregó y mezclar a máxima velocidad entre un minuto a dos minutos"] },
      { id: "milk-5", name: "Mocca Milkshake", price: 4.25, type: "recipe", tags: ["milkshake"], ingredients: ["310 gr de helado de chocolate", "2 espressos", "Salsa de chocolate"], steps: ["Decorar el vaso con salsa de chocolate. En el vaso de la máquina de milkshake agregar 310 de helado de Chocolate y 2 café espresso que previamente hemos extraído, encender el mixer con el producto que anteriormente se agregó y mezclar a máxima velocidad entre un minuto a dos minutos"] },
      { id: "milk-6", name: "Caramelo Milkshake", price: 4.25, type: "recipe", tags: ["milkshake"], ingredients: ["310 gr de helado de vainilla", "40 gr de leche entera", "30 gr de salsa de caramelo"], steps: ["Decorar el vaso con salsa de caramelo. En el vaso de la máquina de milkshake agregar 310 de helado de Vainilla, 40 gramos de leche entera o la de preferencia del cliente, y 30 gramos de salsa de caramelo o 1 1/2 Pums, encender el mixer con el producto que anteriormente se agregó y mezclar a máxima velocidad entre un minuto a dos minutos"] },
      { id: "milk-7", name: "Oreo Milkshake", price: 4.25, type: "recipe", tags: ["milkshake"], ingredients: ["310 gr de helado de vainilla", "40 gr de leche entera", "3 galletas Oreo molidas", "1 galleta Oreo"], steps: ["En el vaso de la máquina de milkshake agregar 310 de helado de Vainilla, 40 gramos de leche entera o la de preferencia del cliente, y 3 galletas de oreo molida, encender el mixer con el producto que anteriormente se agregó y mezclar a máxima velocidad entre un minuto a dos minutos. Decorar con 1 galleta oreo"] },
      { id: "iced-1", name: "Iced Coffee", price: 2.50, type: "recipe", tags: ["iced latte"], ingredients: ["120 gr de hielo", "30 gr de almíbar", "1 pump de esencia de vainilla", "16 gr de café", "Agua fría"], steps: ["En un vaso plástico domo de 12oz colocar 120gr de hielo más 30gr de almíbar, y un pumps de esencia de vainilla Monín, moler 16 gr de café y llevar a la máquina de espresso, extraer entre 20 y 30 segundos unir los dos disparos sobre la preparación anterior luego completar con agua Fria mezclar y servir."] },
      { id: "iced-2", name: "Iced Latte", price: 3.00, type: "recipe", tags: ["iced latte"], ingredients: ["120 gr de hielo", "130 gr de leche", "30 gr de almíbar", "16 gr de café", "15 gr de cold foam"], steps: ["En un vaso plástico domo de 12oz colocar 120gr de hielo más 130gr de leche, 30gr de almíbar y luego Moler 16 gr de café y llevar a la máquina, extraer entre 20 y 30 segundos unir los dos disparos sobre la preparación anterior en el vaso domo y encima colocar 15gr de cold foam."] },
      { id: "iced-3", name: "Iced Latte 3 leches", price: 3.90, type: "recipe", tags: ["iced latte"], ingredients: ["150 gr de mezcla 3 leches", "2 espressos", "Pizca de canela", "120 gr de hielo", "Crema chantilly", "1 cereza roja"], steps: ["Colocamos en la coctelera 150gr de mezcla de 3 leches, 2 espressos, una pizca de canela y 120gr de hielo hacemos técnica de Shaker y servimos en vaso plástico domo de 12oz y decoramos con crema, canela en polvo y una cereza roja."] },
      { id: "iced-4", name: "Iced Latte Mocca", price: 3.60, type: "recipe", tags: ["iced latte"], ingredients: ["120 gr de leche", "20 gr de almíbar", "45 gr de salsa de chocolate", "120 gr de hielo", "2 espressos", "15 gr de cold foam"], steps: ["En la leche que son 120gr colocar (20gr de almíbar, 45gr de salsa de chocolate) en un vaso colocar 120gr de hielo, 2 espressos y al final 15gr de cold foam."] },
      { id: "iced-5", name: "Iced latte Bombom", price: 3.00, type: "recipe", tags: ["iced latte"], ingredients: ["120 gr de hielo", "130 gr de leche", "60 gr de leche condensada", "1 pump de esencia de vainilla", "16 gr de café"], steps: ["En un vaso plástico domo de 12oz colocar 120gr de hielo más 130gr de leche, 60gr de leche condensada y un pumps de esencia de vainilla Monín, luego Moler 16 gr de café y llevar a la máquina, extraer entre 20 y 30 segundos unir los dos disparos sobre la preparación anterior en el vaso domo."] },
      { id: "iced-6", name: "Chai tea latte", price: 3.60, type: "recipe", tags: ["té"], ingredients: ["120 gr de hielo", "150 gr de leche", "30 gr de esencia Chai tea", "2 pizcas de canela"], steps: ["En un vaso plástico domo de 12oz colocar 120gr de hielo más 150gr de leche, 30gr de esencia de Chai tea junto a 2 pizcas de canela."] },
      { id: "iced-7", name: "Pumpkin spice latte", price: 3.00, type: "recipe", tags: ["iced latte"], ingredients: ["120 gr de hielo", "150 gr de leche", "60 gr de leche condensada", "1 pump de esencia de vainilla", "8 gr de café"], steps: ["En un vaso plástico domo de 12oz colocar 120gr de hielo más 150gr de leche, 60gr de leche condensada y un pumps de esencia de vainilla Monín, luego Moler 8 gr de café y llevar a la máquina, extraer entre 20 y 30 segundos unir los dos disparos sobre la preparación anterior en el vaso domo."] },
      { id: "iced-8", name: "Iced latte pistacho", price: 3.50, type: "recipe", tags: ["iced latte"], ingredients: ["120 gr de hielo", "130 gr de leche", "30 gr de almíbar", "1 pump de esencia de pistacho", "8 gr de café", "Cold foam de matcha"], steps: ["En un vaso plástico domo de 12oz colocar 120gr de hielo más 130gr de leche, 30gr de almíbar y un pump de esencia de pistacho, luego Moler 8 gr de café y llevar a la máquina, extraer entre 20 y 30 segundos, junto al cold foam de matcha."] },
      { id: "iced-9", name: "Iced Caramel Macchiato", price: 3.90, type: "recipe", tags: ["iced latte"], ingredients: ["120 gr de hielo", "120 gr de leche", "30 gr de almíbar", "30 gr de salsa de caramelo", "16 gr de café", "Crema chantilly"], steps: ["En un vaso plástico domo de 12oz colocar 120gr de hielo más 120gr de leche, 30gr de almíbar y 30gr de salsa de caramelo, luego Moler 16 gr de café y llevar a la máquina, extraer entre 20 y 30 segundos unir los dos disparos sobre la preparación anterior en el vaso domo. Decorar con crema chantilly y salsa de caramelo."] },
      { id: "iced-10", name: "Iced Dalgona", price: 3.50, type: "recipe", tags: ["café", "dulce"], ingredients: ["8 gr de café soluble", "30 gr de azúcar", "2 cucharadas de agua caliente", "Leche fría", "1 pump de esencia de vainilla", "3 unidades de masmelos"], steps: ["Hacer crema en un vaso plástico de 12-oz transparente con (8gr de café soluble 30 gr de azúcar y 2 cucharadas de agua caliente, utilizar mini batidor de mano hasta obtener una crema de café.) agregar leche fría sobre la crema, y un Pumps de esencia de vainilla, decorar con masmelos 3 unidades."] },
      { id: "iced-11", name: "Iced Protein shaker", price: 4.80, type: "recipe", tags: ["especial"], ingredients: ["150 ml de leche de almendras", "Pizca de canela", "120 gr de hielo", "1 scoop de proteína", "1 espresso"], steps: ["En la coctelera colocamos 150ml de leche de almendras o la que el cliente elija, más una pizca de canela en polvo más 120 gramos de hielo y un scoup de proteína en polvo y aplicamos técnica de shaker con la coctelera, servimos en un vaso de 12 oz y le agregamos un espresso que previamente hemos extraído. Servimos"] },
      { id: "iced-12", name: "vietnamita Coffee", price: 3.90, type: "recipe", tags: ["especial"], ingredients: ["30 gr de leche condensada", "120 gr de mezcla 3 leches", "120 gr de hielo", "Doble espresso", "Crema chantilly", "Salsa de caramelo"], steps: ["Colocamos en la coctelera (Leche condensada 30gr, 120gr Mezcla de 3 Leche, 120gr de Hielo y doble Espresso) hacemos técnica de Shaker y servimos en vaso plástico domo de 12oz y decoramos con crema y salsa de caramelo Monín."] },
      { id: "iced-13", name: "Iced coffe de Jamaica", price: 3.50, type: "recipe", tags: ["especial"], ingredients: ["120 gr de hielo", "170 gr de infusión de Jamaica", "30 gr de almíbar", "15 gr de cold brew", "15 gr de cold foam"], steps: ["En un vaso plástico domo de 12oz colocar 120gr de hielo más 170gr de jamaica, 30gr de almíbar, junto a 15gr de cold brew y 15 gr de cold foam"] },
      { id: "iced-14", name: "Iced Latte de Taro", price: 4.75, type: "recipe", tags: ["especial"], ingredients: ["80 gr de agua caliente", "20 gr de taro", "150 gr de hielo", "20 gr de almíbar", "1 espresso"], steps: ["En un vaso plástico domo de 12oz colocar 80gr de agua caliente, 20gr de taro, 150gr de hielo, 20 gr de almíbar y le agregamos un espresso que previamente hemos extraído."] },
      { id: "iced-15", name: "Abrazo", price: 4.50, type: "recipe", tags: ["especial"], ingredients: ["30 gr de taro", "170 gr de leche", "20 gr de leche condensada", "0.3 gr de té Bloo Mont", "50 gr de tapioca", "200 gr de hielo", "Pizca de sal", "30 gr de leche evaporada"], steps: ["Realizar la mezcla de taro (30gr de taro, 70gr de leche) y reservar, en un recipiente colocar (100gr de leche, 20gr de leche condensada y 0,3gr de té bloo mont; dejamos infusionar durante 5 minutos). En un vaso de 16 oz colocar 50gr de tapioca junto a 200gr de hielo, una pizca de sal, agregar la leche infusionada, 30gr de leche evaporada y al final la mezcla del taro."] },
      { id: "smooth-1", name: "Smoothie Banano", price: 2.75, type: "recipe", tags: ["smoothie"], ingredients: ["110 gr de banano", "180 gr de leche fría", "10 gr de almíbar"], steps: ["Abrir premezcla que llega de producción (110gr de banano bien maduro) para el servicio licuar la premezcla con 180gr de leche fría junto a 10 gr de almíbar y servir en vaso de 12-Oz."] },
      { id: "smooth-2", name: "Smoothie Frutos Rojos", price: 2.75, type: "recipe", tags: ["smoothie"], ingredients: ["60 gr de frutos rojos", "180 gr de leche fría", "30 gr de almíbar"], steps: ["Abrir premezcla que llega de producción (60 gr de frutos rojos congelados) para el servicio licuar 180gr de leche fría, 2 premezclas de frutos rojos, 30gr de almíbar y servir en vaso de 12-Oz."] },
      { id: "smooth-3", name: "Smoothie Durazno", price: 2.75, type: "recipe", tags: ["smoothie"], ingredients: ["100 gr de durazno", "30 gr de almíbar", "180 gr de leche fría"], steps: ["Abrir premezcla que llega de producción (Cortar 100gr de Durazno de lata y 20gr de almíbar) para el servicio licuar la premezcla con 180gr de leche fría junto a 10gr de almíbar y servir en vaso de 11Oz."] },
      { id: "frozen-1", name: "Frozen de maracuyá", price: 2.75, type: "recipe", tags: ["frozen"], ingredients: ["200 gr de hielo", "2 pulpas de maracuyá congeladas", "50 gr de almíbar"], steps: ["En una licuadora colocar 200gr de hielo, dos congelados de maracuyá junto a 50gr de almíbar y servir en vasos plásticos domo de 12oz"] },
      { id: "frozen-2", name: "Frozen de Frutos rojos", price: 2.75, type: "recipe", tags: ["frozen"], ingredients: ["200 gr de hielo", "2 pulpas de frutos rojos congeladas", "50 gr de almíbar"], steps: ["En una licuadora colocar 200gr de hielo, dos congelados de frutos rojos junto a 50gr de almíbar y servir en vasos plásticos domo de 12oz"] },
      { id: "limon-1", name: "Limonada Azul", price: 3.50, type: "recipe", tags: ["limonada"], ingredients: ["1 gr de flor azul", "0.3 gr de té Bloo Mont", "80 gr de agua caliente", "30 gr de limón", "Pizca de sal", "30 gr de sirope", "200 gr de hielo", "160 gr de agua mineral"], steps: ["Infusionar (1gr de flor azul, 0.3gr de “Té Bloo Mont” junto a 80gr de agua caliente); en un vaso de 16oz colocar 30gr de limón, una pizca de sal junto a 30gr de sirope y mezclar, agregar 200gr de hielo, 160gr de agua mineral y terminar con la infusión de flor azul sin dejar que se mezcle con el agua mineral ya que podría cambiar de color la bebida y este cambio de color lo debe realizar el cliente."] },
      { id: "limon-2", name: "Limonada de Jamaica", price: 3.00, type: "recipe", tags: ["limonada"], ingredients: ["30 gr de limón", "Pizca de sal", "50 gr de sirope", "200 gr de hielo", "80 gr de agua mineral", "120 gr de infusión de Jamaica"], steps: ["En un vaso de 16oz colocar 30gr de limón, una pizca de sal junto a 50gr de sirope y mezclar, añadir 200 gr de hielo encima 80gr de agua mineral y terminar con 120gr de infusión de Jamaica."] },
      { id: "limon-3", name: "Limonada de Frutos Rojos", price: 3.50, type: "recipe", tags: ["limonada"], ingredients: ["30 gr de limón", "Pizca de sal", "30 gr de sirope", "60 gr de coulis de frutos rojos", "200 gr de hielo", "160 gr de agua mineral"], steps: ["En un vaso de 16oz colocar 30gr de limón, una pizca de sal junto a 30gr de sirope y mezclar, añadir 60gr de culis de frutos rojos, 200gr de hielo y completar con 160gr de agua mineral."] },
      { id: "limon-4", name: "Limonada de Café", price: 3.50, type: "recipe", tags: ["limonada"], ingredients: ["30 gr de limón", "Pizca de sal", "30 gr de sirope", "200 gr de hielo", "120 gr de agua mineral", "100 gr de cold brew"], steps: ["En un vaso de 16oz colocar 30gr de limón, una pizca de sal junto a 30gr de sirope y mezclar, añadir 200gr de hielo, 120gr de agua mineral y terminar con 100gr de cold brew. (En caso de no tener Cold Brew aplicar 1 espresso y subir la cantidad de agua mineral.)"] },
      { id: "limon-5", name: "Fuzetea de la casa", price: 3.50, type: "recipe", tags: ["té"], ingredients: ["10 gr de té negro", "4 unidades de cardamomo", "1 unidad de naranja deshidratada", "200 gr de agua caliente", "15 gr de limón", "Pizca de sal", "25 gr de sirope o agave", "200 gr de hielo"], steps: ["Infusionar por 5 minutos (10gr de té negro, 4und de cardamomo, 1und de naranja deshidratada junto a 200 gr de agua caliente), en un vaso de 16oz colocar 15gr de limón, una pizca de sal junto a 25 gr de sirope o agave y mezclar, añadir 200gr de hielo junto a los 200gr de infusión."] },
      { id: "matcha-1", name: "Matcha de la casa", price: 4.50, type: "recipe", tags: ["matcha"], ingredients: ["4 gr de matcha", "40 gr de agua caliente", "200 gr de hielo", "160 gr de leche", "40 gr de leche evaporada", "Pizca de sal", "25 gr de almíbar"], steps: ["Realizar la mezcla del matcha (4gr de matcha junto a 40gr de agua caliente), en un vaso de 16oz colocar 200gr de hielo y encima 160gr de leche a su preferencia, 40gr de leche evaporada, una pizca de sal y 25gr de almíbar; terminar con the matcha espumado"], notes: ["La infusión de agua para disolver el matcha se realizará con el té de jazmín (160gr de agua y un sobre de té), usar solo la cantidad de agua indicada que es 40gr para cada matcha si se usa esta infusión no infusionar la leche con el bloo mont, en caso que no haya té de jazmín seguir la receta escrita."] },
      { id: "matcha-2", name: "Matcha con mango", price: 4.50, type: "recipe", tags: ["matcha"], ingredients: ["4 gr de matcha", "40 gr de agua caliente", "60 gr de pulpa de mango", "Pizca de sal", "200 gr de hielo", "120 gr de leche", "0.3 gr de té Bloo Mont", "40 gr de leche evaporada", "25 gr de almíbar"], steps: ["Realizar la mezcla del matcha (4gr de matcha junto a 40gr de agua caliente), en un vaso de 16oz colocar 60gr de pulpa de mango y una pizca de sal, añadir 200gr de hielo, en la mota añadir 120gr de leche con 0,3gr de “Te Bloo Mont” y dejar infusionar 5 minutos, añadir sobre el hielo, colocar 40gr de leche evaporada y 25 gr de almíbar; y encima colocar el matcha espumado."] },
      { id: "matcha-3", name: "Matcha con frutos rojos", price: 4.50, type: "recipe", tags: ["matcha"], ingredients: ["4 gr de matcha", "40 gr de agua caliente", "60 gr de coulis de frutos rojos", "Pizca de sal", "200 gr de hielo", "120 gr de leche", "0.3 gr de té Bloo Mont", "40 gr de leche evaporada", "25 gr de almíbar"], steps: ["Realizar la mezcla del matcha (4gr de matcha junto a 40gr de agua caliente), en un vaso de 16oz colocar 60gr de culis de frutos rojos y una pizca de sal, añadir 200gr de hielo, en la mota añadir 120gr de leche con 0,3gr de “Te Bloo Mont” y dejar infusionar 5 minutos, añadir sobre el hielo, colocar 40gr de leche evaporada y 25 gr de almíbar; y encima colocar el matcha espumado."] },
      { id: "matcha-4", name: "Matcha con taro", price: 4.50, type: "recipe", tags: ["matcha"], ingredients: ["15 gr de taro", "175 gr de leche (total)", "20 gr de leche condensada", "4 gr de matcha", "40 gr de agua caliente", "0.3 gr de té Bloo Mont", "180 gr de hielo", "Pizca de sal", "40 gr de leche evaporada"], steps: ["Realizar la mezcla de taro (15gr de taro, 35gr de leche, 20gr de leche condensada y emulsionar), realizar la mezcla del matcha (4gr de matcha junto a 40gr de agua caliente), en una mota colocar 140gr de leche con 0,3gr de “Te Bloo Mont” y dejar infusionar durante 5 minutos; en un vaso de 16oz colocar el taro emulsionado de base junto a 180gr de hielo encima ponemos la leche infusionada, una pizca de sal, 40gr leche evaporada; y encima colocar el matcha espumado."] },
      { id: "matcha-5", name: "Matcha de Naranjilla o Maracuyá", price: 4.50, type: "recipe", tags: ["matcha"], ingredients: ["4 gr de matcha", "40 gr de agua caliente", "60 gr de pulpa (naranjilla/maracuyá)", "Pizca de sal", "200 gr de hielo", "120 gr de leche", "0.3 gr de té Bloo Mont", "40 gr de leche evaporada", "25 gr de almíbar"], steps: ["Realizar la mezcla del matcha (4gr de matcha junto a 40gr de agua caliente), en un vaso de 16oz colocar 60gr de pulpa y una pizca de sal, añadir 200gr de hielo, en la mota añadir 120gr de leche con 0,3gr de “Te Bloo Mont” y dejar infusionar 5 minutos, añadir sobre el hielo, colocar 40gr de leche evaporada y 25 gr de almíbar; y encima colocar el matcha espumado."] },
      { id: "matcha-6", name: "Matcha con chocolate", price: 4.50, type: "recipe", tags: ["matcha"], ingredients: ["4 gr de matcha", "40 gr de agua caliente", "60 gr de salsa de chocolate", "Pizca de sal", "200 gr de hielo", "120 gr de leche", "40 gr de leche evaporada", "25 gr de almíbar"], steps: ["Realizar la mezcla del matcha (4gr de matcha junto a 40gr de agua caliente), en un vaso de 16oz colocar 60gr de salsa de chocolate y una pizca de sal, añadir 200gr de hielo, mezclar 120gr de leche, 40gr de leche evaporaba y 25gr de almíbar, colocar esta mezcla sobre el hielo y terminar con la mezcla de matcha."] },
      { id: "matcha-7", name: "Té con leche frío (Hong Kong)", price: 4.50, type: "recipe", tags: ["té"], ingredients: ["20 gr de té negro", "4 unidades de cardamomo", "200 gr de agua", "50 gr de tapioca", "200 gr de hielo", "45 gr de leche condensada", "40 gr de leche evaporada"], steps: ["Infusionar durante 5 minutos (20gr de té negro y 4und de cardamomo junto a 200gr de agua) en un vaso de 16oz colocar 50 gr de tapioca, 200gr de hielo mezclar 45gr de leche condensada junto a 40gr de leche evaporada y verter encima de la leche; finalizamos con el extracto de té negro sin dejar que se mezclen."] }
    ]
  },
  {
    id: "sal",
    name: "Opciones de Sal",
    icon: "🥐",
    color: "#FF9800",
    items: [
      { id: "sal-1", name: "Palitos de Queso", price: 1.10, type: "recipe", tags: ["sal"], ingredients: ["Palitos de queso"], steps: ["Calentar 15 segundos en horno microondas y colocar en plato de vidrio o cerámica y si es para llevar colocamos en funda de papel y la sellamos con un stiker de coffee time."] },
      { id: "sal-2", name: "Muffin de Queso", price: 1.75, type: "recipe", tags: ["sal"], ingredients: ["Muffin de queso"], steps: ["Retirar del empaque plástico de conservación y Calentar 15 segundos en horno microondas luego guardar nuevamente en su empaque plástico si es para llevar caso contrario servir en plato de porcelana."] },
      { id: "sal-3", name: "Humitas", price: 2.25, type: "recipe", tags: ["sal"], ingredients: ["Humita"], steps: ["Sacar de refrigerador y Calentar en horno microonda por 3 minutos dando vueltas o hasta conseguir 60°C de temperatura interna, utilizar guantes y retirar la cascara que la protege servir en plato de vidrio rectangular."] },
      { id: "sal-4", name: "Empanadas con Queso", price: 1.80, type: "recipe", tags: ["sal"], ingredients: ["40 gr de queso mozzarella", "Pizca de ajo en polvo", "Pizca de cebolla en polvo", "1 disco de empanada"], steps: ["Calentar freidora, Tener 40gr de queso mozzarella rallado con una pizca de ajo en polvo y cebolla en polvo, formar la empanada con un disco de empanada cerrar y repulgar la empanada revisar temperatura de la freidora esta debe estar entre 170°C – 180°C para realizar la fritura de la empanada, si la temperatura es la correcta colocar la empanada y freír hasta dorar, servir en plato de vidrio cuadrado."] },
      { id: "sal-5", name: "Tostadas de Queso", price: 1.75, type: "recipe", tags: ["sal"], ingredients: ["2 rebanadas de pan", "Salsa para tostada de la casa", "1 rebanada de queso mozzarella", "Mantequilla"], steps: ["Encender la tostadora, Coger 2 panes de tostadas, colocar en cada pan de un solo lado la salsa para tostada de la casa, colocar 1 rebanada de queso mozzarella, aplicar mantequilla por la parte de afuera de los panes y luego llevar a la tostadora hasta dorar."] },
      { id: "sal-6", name: "Tostadas Mixta", price: 1.80, type: "recipe", tags: ["sal"], ingredients: ["2 rebanadas de pan", "Salsa para tostada de la casa", "1 rebanada de queso mozzarella", "1 rebanada de jamón", "Mantequilla"], steps: ["Encender la tostadora, Coger 2 panes de tostadas, colocar en cada pan de un solo lado la salsa para tostada de la casa, colocar 1 rebanada de queso mozzarella y una de jamón, aplicar mantequilla por la parte de afuera de los panes y luego llevar a la tostadora hasta dorar."] },
      { id: "sal-7", name: "Bolón de Verde con queso", price: 2.60, type: "recipe", tags: ["sal"], ingredients: ["1 bolón de verde", "50 gr de queso fresco", "25 gr de queso mozzarella", "Salsa de queso"], steps: ["Sacar del congelador sin retirar de la envoltura de plástico film y calentar en el horno microondas por aproximadamente de 3 a 4 minutos o hasta llegar a una temperatura interna de 60°C, colocar 50gr de queso fresco y para servir colocar 25gr de queso mozzarella rallado encima del producto y salsear con la salsa de queso."] },
      { id: "sal-8", name: "Bolón de Verde con Queso y Chicharrón", price: 3.20, type: "recipe", tags: ["sal"], ingredients: ["1 bolón de verde con chicharrón", "50 gr de queso fresco", "1 lámina de tocino", "Salsa de queso", "Crotones de verde", "Ají de maní"], steps: ["Sacar del congelador sin retirar de la envoltura de plástico film y calentar en el horno microondas por aproximadamente de 3 a 4 minutos o hasta llegar a una temperatura interna de 60°C para servir colocar 50gr de queso fresco rallado junto a la base de chicharrón, dorar un tocino en la tostadora o plancha y cortarlo a la mitad; para servir colocar el bolón en un plato de porcelana salsear con la salsa de queso, coronar con el tocino en forma de cruz y acompañar con crotones de verde. Agregar ají de maní."] },
      { id: "sal-9", name: "Tortilla de Verde", price: 2.60, type: "recipe", tags: ["sal"], ingredients: ["1 tortilla de verde", "50 gr de queso fresco", "Salsa de queso"], steps: ["Sacar del congelador sin retirar de la envoltura de plástico film y calentar en el horno microondas por aproximadamente 3 a 4 minutos o hasta llegar a una temperatura interna de 60°C, colocar 50gr de queso fresco, colocar en la waflera hasta conseguir una capa crocante, servir con salsa de queso y queso fresco por encima."] },
      { id: "sal-10", name: "Huevos Fritos o Revueltos", price: 1.25, type: "recipe", tags: ["sal"], ingredients: ["2 huevos", "Sal", "Pimienta"], steps: ["Calentar el sartén paila, cascar dos unidades de huevos y llevar al satén realizar fritura o revolver según la exigencia del cliente rectificar con sal y pimenta."] },
      { id: "sal-11", name: "Porción de Tocino", price: 1.00, type: "recipe", tags: ["sal"], ingredients: ["2 láminas de tocino"], steps: ["Calentar el sartén o paila, luego coger 2 láminas de tocino y llevarlas al sartén a dorar."] },
      { id: "sal-12", name: "Patacones con Queso", price: 2.60, type: "recipe", tags: ["sal"], ingredients: ["1 porción de patacones", "30 gr de queso mozzarella"], steps: ["Calentar la freidora Sacar la porción de patacones congelada, cuando la temperatura de la freidora este entre 170°C y 180°C colocar la porción de patacones, esperar hasta que estén crujientes, agregar por encima 30 gramos de queso mozzarella."] }
    ]
  },
  {
    id: "panes",
    name: "Panes",
    icon: "🥖",
    color: "#D2691E",
    items: [
      { id: "pan-1", name: "Roll de Canela", price: 2.50, type: "recipe", tags: ["dulce"], ingredients: ["1 roll de canela", "50 gr de queso crema", "Salsa a elección"], steps: ["Llevar el pan al horno microondas y calentar por 40 segundos, luego colocar 50 gr de queso crema en la parte superior y servir en plato de porcelana redondo junto con salsa a elección del cliente"], notes: ["precio adicional de cada salsa $0,25"] }
    ]
  },
  {
    id: "sandwich",
    name: "Sándwiches",
    icon: "🥪",
    color: "#FFD700",
    items: [
      { id: "sand-1", name: "Sándwich Supremo", price: 4.50, type: "recipe", tags: ["sándwich"], ingredients: ["Pan", "Aderezo de chimichurri", "1 lámina de queso mozzarella", "2 láminas de jamón", "1 lámina de tocino", "3 pepinillos", "3 unidades de tomates deshidratados", "Aderezo ranch", "Salsa verde", "2 espinacas baby", "1 tomate cherry"], steps: ["Calentar la tostadora, sacar pan del congelador, calentar al horno microondas por 30 segundos, partir a la mitad y colocar en sus mitades aderezo de chimichurri, 1 lamina de queso mozzarella, 2 láminas de jamón dobladas, 1 unidades de tocino previamente tostada en la tostadora o plancha, 3 pepinillos y 3 unidades de tomates deshidratados, luego llevamos a la tostadora para agregar temperatura y tostar el pan, agregar aderezo ranch, servir en plato de vidrio rectangular. Decorar el plato con salsa verde en forma de circulo, agregar dos espinacas babys y un tomate Cherry cortado por la mitad, junto con un ramiquín con mitad de salsa verde y otra mitad de chimichurri."] },
      { id: "sand-2", name: "Sandwich Caprese", price: 4.75, type: "recipe", tags: ["sándwich"], ingredients: ["Pan de papa", "Aderezo de pesto", "6 láminas de queso mozzarella", "3 unidades de tomates deshidratados", "Salsa verde", "2 espinacas baby", "1 tomate cherry", "Chimichurri"], steps: ["Partir el pan de papa a la mitad de manera horizontal, calentar al horno microondas por 30 segundos, colocar aderezo de pesto en sus mitades, 6 laminas de queso mozzarella y 3 unidades de tomates deshidratados, colocar en el horno microonda durante 1 minuto hasta que derrita el queso, cortar a la mitad y servir. Decorar el plato con salsa verde en forma de circulo, agregar dos espinacas babys y un tomate Cherry cortado por la mitad, junto con un ramiquín con mitad de salsa verde y otra mitad de chimichurri."] },
      { id: "sand-3", name: "Katz’s Pastrami", price: 7.25, type: "recipe", tags: ["sándwich"], ingredients: ["Pan focaccia", "Salsa pickles", "Carne pastrami", "Queso emmental", "Mix de ensalada", "Crotones de papas"], steps: ["Colocar el pan focaccia en la tostadora, una vez el pan esté listo añadir aderezo de salsa pickles, calentar la carne en el horno microondas durante 3 minutos, colocar la carne en todo el pan junto al queso emmental, poner en el horno microondas durante 1 minuto hasta que el queso esté derretido. Cortar a la mitad y servir. Acompañar con un mix de ensalada y crotones de papas."] },
      { id: "sand-4", name: "Sanduche de cerdo (Pulled Pork)", price: 6.25, type: "recipe", tags: ["sándwich"], ingredients: ["Pan de papa", "Aderezo de mostaza", "30 gr de chucrut", "15 gr de aderezo ranch", "15 gr de aderezo honey", "Pulled pork", "30 gr de aderezo BBQ", "Mix de ensalada", "Crotones de papas"], steps: ["Partir el pan de papa a la mitad de manera horizontal, calentar al horno microondas por 30 segundos, colocar aderezo de mostaza en sus mitades y colocar en la tostadora, pesar 30 gr de chucrut junto a 15 gr de aderezo ranch y 15 gr de aderezo honey; se colocará en la base del sanduche, calentar el cerdo en el horno microondas durante 3 minutos y colocar 30 gr de aderezo bbq, partir a la mitad y acompañar con un mix de ensalada y crotones de papas."] },
      { id: "sand-5", name: "Sanduche de pollo (Pulled Chicken)", price: 6.25, type: "recipe", tags: ["sándwich"], ingredients: ["Pan de papa", "Aderezo de con mostaza", "Pulled chicken", "30 gr de aderezo ranch", "3 láminas de queso", "Mix de ensalada", "Crotones de papas"], steps: ["Partir el pan de papa a la mitad de manera horizontal, calentar al horno microondas por 30 segundos, colocar aderezo de mostaza en sus mitades y colocar en la tostadora, calentar el pollo en el horno microondas durante 3 minutos y colocar 30 gr de aderezo ranch, colocar en el pan junto a 3 laminas de queso, llevar al horno microondas durante 1 minuto para derretir el queso, partir a la mitad y servir acompañado con un mix de ensalada y crotones de papas."] }
    ]
  },
  {
    id: "compartir",
    name: "Para Compartir",
    icon: "🍟",
    color: "#FF4500",
    items: [
      { id: "comp-1", name: "Papas Cheddar con Baicon", price: 3.00, type: "recipe", tags: ["compartir"], ingredients: ["300 gr de papas", "1 lámina de tocino", "Orégano molido", "Sal", "30 gr de salsa de queso cheddar"], steps: ["Calentar la freidora, sacar del congelador dos paquetes de papas congeladas con 150gr cada uno, verificar la temperatura del aceite tiene que estar aproximadamente entre 170°C – 180°C, llevar a fritura las papas hasta que doren y estén crujientes reservamos, cortar 1 láminas de tocino en cuadros pequeño (Brunoise) llevar a la freidora o sartén hasta dorar luego mezclar en un bolw con las papas, orégano molino y sal servir en un plato de cerámica o porta papas y salsear con 30 gramos de salsa de queso cheddar."] },
      { id: "comp-2", name: "Pulled Pork Cheese Fries", price: 5.25, type: "recipe", tags: ["compartir"], ingredients: ["300 gr de papas", "Pulled pork", "30 gr de salsa BBQ", "Orégano molido", "Sal", "30 gr de salsa de queso cheddar"], steps: ["Calentar la freidora, sacar del congelador dos paquetes de papas congeladas con 150gr cada uno, verificar la temperatura del aceite tiene que estar aproximadamente entre 170°C – 180°C, llevar a fritura las papas hasta que doren y estén crujientes reservamos, calentar el pulled pork en el horno microondas durante 3 minutos y añadirle 30 gr de salsa BBQ; luego mezclar en un bowl con las papas, orégano molido y sal servir en un plato de cerámica, junto al pulled pork y salsear con 30 gramos de salsa de queso cheddar."] }
    ]
  },
  {
    id: "dulce",
    name: "Opciones de Dulce",
    icon: "🍰",
    color: "#FF69B4",
    items: [
      { id: "dul-1", name: "Mojada de chocolate", price: 2.25, type: "recipe", tags: ["postre"], ingredients: ["Torta mojada de chocolate"], steps: ["Para llevar sacar porción colocar en recipiente plástico con etiqueta, bañar la torta y entregar con cucharita plástica y servilleta.", "Para servir salsear un plato de cerámica blanco y colocar la porción del postre, bañar la torta entregar con cucharita de acero y servilleta."] },
      { id: "dul-2", name: "Dulce de 3 leches", price: 2.60, type: "recipe", tags: ["postre"], ingredients: ["Dulce de 3 leches"], steps: ["Entregar en el mismo recipiente."] },
      { id: "dul-3", name: "Carrot Cake", price: 3.25, type: "recipe", tags: ["postre"], ingredients: ["Carrot cake"], steps: ["Sacar porción y servir"] },
      { id: "dul-4", name: "Tiramisú", price: 3.25, type: "recipe", tags: ["postre"], ingredients: ["Tiramisú"], steps: ["Para llevar sacar porción colocar en recipiente plástico con etiqueta y entregar con cucharita plástica y servilleta.", "Para servir salsear un plato de cerámica blanco y colocar la porción del postre entregar con cucharita de acero y servilleta."] },
      { id: "dul-5", name: "Esponjoso de almendras", price: 1.75, type: "recipe", tags: ["postre"], ingredients: ["Esponjoso de almendras"], steps: ["Para llevar sacar porción y calentar por 10 segundos en microondas, colocar en recipiente plástico con etiqueta y entregar con cucharita plástica y servilleta.", "Para servir salsear un plato de cerámica blanco calentar el postre por 10 segundos en microondas y colocarlo en el plato salseado entregar con cucharita de acero y servilleta."] },
      { id: "dul-6", name: "Alfajores", price: 0.50, type: "recipe", tags: ["postre"], ingredients: ["Alfajores"], steps: ["Entregar al cliente"] },
      { id: "dul-7", name: "Brownie", price: 1.50, type: "recipe", tags: ["postre"], ingredients: ["Brownie"], steps: ["Entregar directamente al cliente.", "Para servir salsear un plato de cerámica blanco y colocar la porción del postre entregar con cucharita de acero y servilleta."] },
      { id: "dul-8", name: "Cheescake de frutos rojos", price: 3.00, type: "recipe", tags: ["postre"], ingredients: ["Cheesecake de frutos rojos"], steps: ["Para llevar sacar porción colocar en recipiente plástico con etiqueta y entregar con cucharita plástica y servilleta.", "Para servir salsear un plato de cerámica blanco y colocar la porción del postre entregar con cucharita de acero y servilleta."] },
      { id: "dul-9", name: "Tarta Vasca", price: 3.00, type: "recipe", tags: ["postre"], ingredients: ["Tarta vasca"], steps: ["Sacar de vitrina y calentar en microondas por 30 segundos Para llevar colocar en recipiente plástico con etiqueta y entregar con cucharita plástica y servilleta.", "Para servir salsear un plato de cerámica blanco y colocar la porción del postre entregar con cucharita de acero y servilleta."] },
      { id: "dul-10", name: "CupCake Red Velvet", price: 1.50, type: "recipe", tags: ["postre"], ingredients: ["Cupcake Red Velvet"], steps: ["Entregar directamente al cliente.", "Para servir llevar a la mesa en el propio recipiente."] },
      { id: "dul-11", name: "Cake de Banano", price: 1.75, type: "recipe", tags: ["postre"], ingredients: ["Cake de banano"], steps: ["Para llevar sacar porción, calentar por 10 segundos en microondas, colocar en recipiente plástico con etiqueta y entregar con cucharita plástica y servilleta.", "Para servir salsear un plato de cerámica blanco calentar el postre 10 segundos en microondas, y colocarlo en el plato salseado entregar con cucharita de acero y servilleta."] },
      { id: "dul-12", name: "Chocochips New York", price: 2.25, type: "recipe", tags: ["postre"], ingredients: ["Galleta Chocochips New York"], steps: ["Entregar el paquete de galleta al cliente"] },
      { id: "dul-13", name: "Waffles", price: 4.50, type: "recipe", tags: ["postre"], ingredients: ["Pre-mezcla de waffles", "1 huevo", "50 gr de leche", "10 gr de margarina", "1 tapa de vainilla", "Aderezos a elección"], steps: ["Abrir el paquete de la pre-mezcla, junto a todos los ingredientes liquidos (1 huevo, 50gr de leche, 10gr de margarina, 1 tapa de vainilla), colocar la mezcla en la waflera y colocar los aderezos a la elección del cliente"] }
    ]
  },
  {
    id: "licores",
    name: "Licores & Cocteles",
    icon: "🍸",
    color: "#9932CC",
    items: [
      { id: "lic-1", name: "Michelada de maracuyá", price: 3.25, type: "recipe", tags: ["cerveza"], ingredients: ["Salsa Tabasco 6 gotas", "Salsa Inglesa 4 gotas", "Zumo de limón 1 ½ onz.", "Cerveza 1 unidad", "Maracuyá 2 onz.", "Sal y Pimienta c/n"], steps: ["Método de Preparación Directo: Primero escarchar el vaso cervecero con limón, sal y pimienta. Colocar en el vaso cervecero salsa tabasco, salsa inglesa, colocar la cerveza y finalmente el limón. sí es de maracuyá o de cualquier sabor se agrega la pulpa con la salsa tabasco o la salsa inglesa."] },
      { id: "lic-2", name: "Michelada Clásica", price: 3.25, type: "recipe", tags: ["cerveza"], ingredients: ["Salsa Tabasco 6 gotas", "Salsa Inglesa 4 gotas", "Zumo de limón 1 ½ onz.", "Cerveza 1 unidad", "Sal y Pimienta c/n"], steps: ["Método de Preparación Directo: Primero escarchar el vaso cervecero con limón, sal y pimienta. colocar en el vaso salsa tabasco, salsa inglesa, sal, pimienta, colocar la cerveza y finalmente el limón."] },
      { id: "lic-3", name: "Chelada", price: 3.25, type: "recipe", tags: ["cerveza"], ingredients: ["Zumo de limón 1 onz.", "Salsa Inglesa 4 Gotas", "Sal y Pimienta 1 Dash", "Cerveza 1 unidad"], steps: ["Método de Preparación Directo: primero escarchar el vaso con limón, sal y pimienta, colocar en el vaso escarchado la salsa inglesa, la cerveza y finalmente el limón."] },
      { id: "lic-4", name: "Piña Colada", price: 5.25, type: "recipe", tags: ["coctel"], ingredients: ["LICOR DE COCO ½ onz.", "HIELO 200 G", "LECHE CONDENSADA 2 onz.", "RON 2 onz.", "ZUMO DE PIÑA 2 onz.", "E. MONIN DE COCO ¼ Onz"], steps: ["Método de preparación licuado. - Colocar en la licuadora todos los ingredientes: licor de coco, leche condensada, ron, zumo de piña y finalmente 200 g de hielo licuar. cereza para decorar."] },
      { id: "lic-5", name: "Salta Montes", price: 5.25, type: "recipe", tags: ["coctel"], ingredients: ["LICOR DE MENTA 2 onz", "LECHE CONDENSADA 2 onz", "HIELO 200 G", "VODKA 1 onz", "LICOR DE CAFÉ 1 onz"], steps: ["Método de preparación licuado. - Colocar en la licuadora todos los ingredientes: licor de menta, leche condensada, licor de café y finalmente 200 g de hielo licuar colocar cereza o sombrilla para decorar"] },
      { id: "lic-6", name: "Nieve de Menta", price: 5.25, type: "recipe", tags: ["coctel"], ingredients: ["LICOR DE MENTA 2 onz.", "LECHE CONDENSADA 2 onz.", "HIELO 200 G"], steps: ["Método de preparación licuado. - Colocar en la licuadora todos los ingredientes: licor de menta, leche condensada y finalmente 200 g de hielo licuar. cereza para decorar"] },
      { id: "lic-7", name: "Coctel de la casa", price: 5.50, type: "recipe", tags: ["coctel"], ingredients: ["LECHE CONDENSADA 2 onz.", "LICOR DE CAFÉ 2 onz.", "HIELO 200 G", "CANELA 0,5 G"], steps: ["Método de preparación licuado. - Colocar en la licuadora todos los ingredientes: licor de café, leche condensada y finalmente 200 g de hielo licuar. una vez servido espolvorear canela y colocar cereza para decorar"] }
    ]
  },
  {
    id: "varios",
    name: "Varios",
    icon: "🍱",
    color: "#696969",
    items: [
      { id: "var-1", name: "Almíbar o TPT", type: "recipe", tags: ["preparación"], ingredients: ["1200gr de agua", "3000gr de Azúcar", "2gr de sal", "4 gotas de esencia de vainilla"], steps: ["Llevar hasta 102°C y reservar"] },
      { id: "var-2", name: "Kombucha", price: 2.05, type: "recipe", tags: ["bebida"], ingredients: ["120 gr de hielo", "1 pump de esencia T-chai", "15 gr de sirope", "200 gr de Kombucha"], steps: ["En un vaso de 12-Oz agregamos 120gr de Hielo, un pums de esencia T-chai de monín, 15gr de sirope, y completamos con aproximadamente 200gr de Kombucha."] },
      { id: "var-3", name: "Colas", price: 1.25, type: "recipe", tags: ["bebida"], steps: ["Entregar"] },
      { id: "var-4", name: "Aguas", price: 0.60, type: "recipe", tags: ["bebida"], steps: ["Entregar"] }
    ]
  }
];

import { getAnonSupabase, getServiceSupabase } from "../lib/supabaseClient";

export async function fetchCoffeeData(): Promise<Category[]> {
  // Try to load content from Supabase `content` table where key = 'coffee_data'
  try {
    const { data, error } = await getAnonSupabase()
      .from('content')
      .select('value')
      .eq('key', 'coffee_data')
      .single() as any;

    if (error) throw error;
    if (data && data.value) return data.value as Category[];
  } catch (e) {
    // fallback to service-side attempt (in case anon key cannot read private table)
    try {
      const svc = getServiceSupabase();
      const { data, error } = await svc
        .from('content')
        .select('value')
        .eq('key', 'coffee_data')
        .single() as any;
      if (!error && data && data.value) return data.value as Category[];
    } catch (err) {
      // swallow and fall back to static
    }
  }

  return COFFEE_DATA;
}

