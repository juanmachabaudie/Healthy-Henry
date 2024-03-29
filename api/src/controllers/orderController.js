const { User, Product, Order } = require("../db");

//crear ordenes
async function createOrder(req, res, next) {
  const { userName, products } = req.body;
  //orderState
  //products es un arreglo de objetos
  // [ { name, qty }, { name, qty } ]

  //busca el User
  const userFound = await User.findOne({
    where: { userName: userName },
  });
  if (userFound === null) {
    return res.send("Usuario No Existe");
  }
  try {
    //crea un Order
    const newOrder = await Order.create({
      orderState: "cart",
    });
    //relaciona user con Order
    const assoc = await userFound.addOrder(newOrder);
    //si recibe products
    if (products) {
      //hace un loop
      for (product of products) {
        //destructura products
        let { name, quantity } = product;
        //busca el producto
        let productFound = await Product.findOne({
          where: { name },
        });
        //relaciona Order con Product y le mete qty && price en OrderLine
        await newOrder.addProduct(productFound, {
          through: { quantity, price: productFound.dataValues.price },
        });
      }
      const order = await Order.findOne({
        where: { userUuid: userFound.dataValues.uuid },
      });
      return res.status(200).json(order);
    }
  } catch (error) {
    next(error);
  }
}

//trae todas las ordenes relacionadas a los los usuarios
async function getOrders(_req, res, _next) {
  const orders = await Order.findAll({
    include: [
      {
        model: Product,
      },
      {
        model: User,
        attributes: ["uuid", "email", "userName"],
      },
    ],
  });
  res.json(orders);
}

//pasa un UUID y trae todas las Ordenes de un Usuario
async function getUserOrders(req, res, _next) {
  const { uuid } = req.params;
  if (uuid) {
    const orders = await Order.findAll({
      where: {
        userUuid: uuid,
      },
      include: [
        {
          model: Product,
        },
        {
          model: User,
          attributes: ["uuid", "email", "userName"],
        },
      ],
    });
    return res.json(orders);
  }
  return res.send("No estas logueado");
}

//trae una sola orden por UUID y todos sus productos
async function getOrder(req, res, _next) {
  const { uuid } = req.params;
  const order = await Order.findOne(
    {
      where: {
        uuid,
      },
      include: [
        {
          model: Product,
          attributes: [
            "uuid",
            "name",
            "description",
            "price",
            "image",
            "thumbnail",
            "stock",
          ],
        },
        {
          model: User,
          attributes: ["uuid", "email", "userName"],
        },
      ],
    },
    { timestamps: false }
  );
  res.json(order);
}

// ↓↓ idealmente solo tendriamos que modificar la prop de estado usando el update ↓↓
//actualizar una Orden
async function updateOrder(req, res, _next) {
  const { uuid } = await req.params; //orden
  // req.body ----> 10 - 11 uuid
  const order = await Order.findOne({
    where: {
      uuid,
    },
    include: [
      {
        model: Product,
      },
      {
        model: User,
        attributes: ["uuid", "email", "userName"],
      },
    ],
  });
  await order.update(req.body);
  res.json(order);
}

async function postOrder(req, res) {
  const order = { status: req.body.order.status };
  const user = await User.findByPk(req.body.order.userId);
  if (!user) return res.status(404).send("User not found");

  const newOrder = await Order.create(order)

  user.addOrder(newOrder)
    .then(order => res.send(order))
    .catch(err => console.log(err));
}

module.exports = {
  getOrders,
  getUserOrders,
  getOrder,
  updateOrder,
  createOrder,
  postOrder
};
