const { Review, User, Order, Product } = require("../db");
const { checkUuid } = require("../helpers/utils");
const sgMail = require("@sendgrid/mail");
const SENDGRID_API_KEY = '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'
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');

//trae todos los usuarios
async function getUsers(req, res, next) {
  try {
    const users = await User.findAll();
    const arrUsers = [];
    if (users.length) {
      for (element of users) {
        const values = element.dataValues;
        const objUser = {
          uuid: values.uuid,
          userName: values.userName,
          email: values.email,
          password: values.password,
          isAdmin: values.isAdmin,
          blocked: values.blocked,
          image: values.image,
        };
        arrUsers.push(objUser);
      }
      return res.send(arrUsers)
    } else {
      return res.send("base de datos vacia");
    }
    res.json(arrUsers);
  } catch (error) {
    next(error);
  }
}

//actualiza datos de Un Usuario
async function updateUser(req, res, next) {
  const { uuid } = req.body;
  console.log(uuid)
  try {
    const toEditUser = await User.findOne({
      where: {
        uuid,
      },
    });
    if (toEditUser) {
        toEditUser.update(req.body);
        return res.status(200).json({ message: "Usuario Actualizado" });
    }
    return res.status(400).json({ message: "Usuario no encontrado" });
  } catch (error) {
    next(error);
  }
}

//borra usuario
async function deleteUser(req, res, next) {
  const { uuid } = req.body;
  try {
    if (checkUuid(uuid)) {
      const toDestroy = await User.findOne({
        where: {
          uuid,
        },
      });
      if (toDestroy) {
        User.destroy({
          where: {
            uuid,
          },
        });
        res.status(200).send("Usuario eliminado");
      } else {
        res.status(404).send("No se encuentra el usuario a eliminar");
      }
    } else {
      res.status(404).send("Id invalido");
    }
  } catch (error) {
    next(error);
  }
}

//trae perfil del usuario
async function userProfile(req, res, next) {
  const { userUuid } = req.params;
  try {
    if (userUuid && checkUuid(userUuid)) {
      const userFound = await User.findOne({ where: { uuid: userUuid } });
      if (userFound) {
        return res.json(userFound);
      }
    }
    return res.status(400).json({ message: "Usuario Inexistente" });
  } catch (error) {
    next(error);
  }
}

//El usuario inicia sesion
async function login(req, res, next) {
  try {
    const { userName, email, password, isAdmin } = req.body;
    if (userName) {
      const userFoundName = await User.findOne({
        where: {
          userName,
        },
      });
      if (userFoundName) {
        if (password === userFoundName.password) {
          return res.json(userFoundName);
        }
      }
    }
    if (email) {
      const userFoundEmail = await User.findOne({
        where: {
          email,
        },
      });
      if (userFoundEmail) {
        if (password === userFoundEmail.password) {
          return res.json(userFoundEmail);
        }
      }
    }
    return res.status(404).json({ message: "El usuario no existe" });
  } catch (error) {
    next(error);
  }
}

async function changeAdmin(req, res, next) {
  const { uuid } = req.body;
  try {
    const toEditUser = await User.findOne({
      where: {
        uuid,
      },
    });
    toEditUser.update(req.body);
    return res.status(200).json({ message: "Usuario Actualizado" });
  } catch (error) {
    next(error);
  }
}

async function blockUser(req, res, next) {
  const { uuid } = req.body;
  try {
    const toEditUser = await User.findOne({
      where: {
        uuid,
      },
    });
    console.log(toEditUser)
    toEditUser.update(req.body);
    return res.status(200).json({ message: "Usuario Actualizado" });
  } catch (error) {
    next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { email } = req.body;
  } catch (error) {
    next(error);
  }
}

async function sendOrder(req, res, next) {
  // const { order, userUuid } = req.body;
  // try {

  //   const user = await User.findOne({
  //     where: {
  //       uuid: userUuid
  //     },
  //     include: [
  //       {
  //         model: Order,
  //         where: {
  //           orderState: 'cart',
  //         },
  //         attributes: ['uuid']
  //       }
  //     ]
  //   });
  //   console.log("USER WITH ORDER: ", user.dataValues.orders[0].dataValues.uuid);
  //   const orderId = user.dataValues.orders[0].dataValues.uuid;
  //   const html = `
  //     <div>
  //         <h1>Orden</h1>
  //         <table>
  //             <tr>
  //                 <th>Producto</th>
  //                 <th> | </th>
  //                 <th>Cantidad</th>
  //                 <th> | </th>
  //                 <th>Precio</th>
  //             </tr>
  //             ${order.map(({ name, order_line, price }) => {
  //     return (
  //       `
  //                     <tr>
  //                         <td>${name}</td>
  //                         <td> | </td>
  //                         <td>${order_line.quantity}</td>
  //                         <td> | </td>
  //                         <td>${price}</td>
  //                     </tr>
  //                     `
  //     )
  //   })}
  //         </table>
  //         <hr />
  //         <table>
  //             <tr>
  //                 <td>Total:</td>
  //                 <td></td>
  //                 <td></td>
  //                 <td></td>
  //                 <td>${order.reduce((acc, { order_line, price }) => acc + (price * order_line.quantity), 0)}</td>
  //             </tr>
  //         </table>
  //         <br />
  //         <a href=${`http://localhost:3001/user/orders/${orderUuid}`} >Ingrese aquí para ver los detalles de su compra</a>
  //         <br />
  //         <h3>¡Gracias por su compra!</h3>
  //     </div>
  // `;

  //   const message = {
  //     to: user.email,
  //     from: 'dager2115@gmail.com',
  //     subject: 'Ésta es su orden de compra en Healthy Henry',
  //     text: 'Ésta es su orden de compra en Healthy Henry',
  //     html: html
  //   };

  //   sgMail.send(message)
  //     .then(response => res.send(response))
  //     .catch(err => console.log("ERROR ENVIANDO ORDEN: ", err));

  // } catch (error) {
  //   next(error)
  // }
  //}

  const { order, userId } = req.body;
  const user = await User.findOne({
    where: {
      uuid: userId
    },
    include: [
      {
        model: Order,
        where: {
          orderState: 'cart',
        },
        attributes: ['uuid']
      }
    ]
  });
  //console.log("USER WITH ORDER: ", user.dataValues.orders[0].dataValues.id);

  const orderId = user.dataValues.orders[0].dataValues.uuid;
  const html = `
        <div>
            <h1>Order</h1>
            <table>
                <tr>
                    <th>Producto</th>
                    <th> | </th>
                    <th>Cantidad</th>
                    <th> | </th>
                    <th>Precio</th>
                </tr>
                ${order.map(({ name, order_line, price, discount }) => {
    return (
      `
                        <tr>
                            <td>${name}</td>
                            <td> | </td>
                            <td>${order_line.quantity}</td>
                            <td> | </td>
                            <td>${price - (price * (discount / 100))}</td>
                        </tr>
                        `
    )
  })}
            </table>
            <hr />
            <table>
                <tr>
                    <td>Total:</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>${order.reduce((acc, { order_line, price, discount }) => acc + ((price - (price * (discount / 100))) * order_line.quantity), 0)}</td>
                </tr>
            </table>
            <br />
            <a href=${`http://localhost:3001/user/orders/${orderId}`} >Ingrese aquí para ver los detalles de su compra</a>
            <br />
            <h3>¡Gracias por su compra!</h3>
        </div>
    `;

  const message = {
    to: user.email,
    from: 'dager2115@gmail.com',
    subject: '',
    text: '',
    html: html
  };

  sgMail.send(message)
    .then(response => res.send(response))
    .catch(err => console.log("ERROR ENVIANDO ORDEN: ", err));
};

async function getOrders(req, res, next) {
  try {
    userEmail = req.query.user;
    const arrOrders = [];
    const userOrders = await Order.findAll({
      include: [
        {
          model: Product,
        },
        {
          model: User,
          attributes: ["uuid", "email"],
        },
      ],
    });
    for (userOrder of userOrders) {
      if (userOrder.user.email === userEmail) {
        let objOrder = {
          user: userOrder.user.email,
          order_state: userOrder.orderState,
          shipping_state: userOrder.shippingState,
          date: userOrder.createdAt,
        }
        let arrProducts = [];
        for (product of userOrder.products) {
          let objProduct = {
            name: product.name,
            image: product.image,
            price: product.price,
            quantity: product.order_lines.quantity,
          }
          arrProducts.push(objProduct);
          console.log(arrProducts);
        }
        objOrder = {
          ...objOrder,
          products: arrProducts,
        }
        arrOrders.push(objOrder)
      }
    }
    res.status(200).json({ arrOrders })
  } catch (error) {
    next(error);
  }
}

async function getShippingData(req, res, next) {
  try {
    const userEmail = req.query.user;
    const user = await User.findOne({ where: { email: userEmail } });
    objShipping = {
      shippingAddress: user.shippingAddress,
      shippingZip: user.shippingZip,
      shippingCity: user.shippingCity,
      shippingState: user.shippingState,
      comments: user.comments,
    }
    return res.json(objShipping);
  } catch (error) {
    next(error);
  }
}

async function updateShippingData(req, res, next) {
  try {
    const userEmail = req.query.user;
    const user = await User.findOne({ where: { email: userEmail } });
    user.update(req.body);
    console.log('done')
  } catch (error) {
    next(error);
  }
}

async function forgotPassword(req,res,next) {
  try{
    const email = req.query.email;
    const uuidUser = await User.findOne({where: { email: email }})
    console.log(uuidUser.dataValues.uuid)
    const smtpTransport = nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      auth: {
          user: 'healthyhenry99@gmail.com',
          pass: 'soyhenry123'
      }
  });

  const mailOptions = {
      from: 'healthy henry',
      to: `${email}`,
      html: 
      `
      <div> HEALTHY HENRY
        <h2 style='color:#ffd118'>En este link podes recuperar tu contraceña papa frita: </h2>
        <h3 style='color:#acff59'> <a href="http://localhost:3000/forgotPassword/${uuidUser.dataValues.uuid}" target="_blank"> Recuperar contraceña </a> </h3>
      <div>
      `
  };

  smtpTransport.sendMail(mailOptions, (error, res) => {
      if (error) {
          res.send(error)
      }
      else {
          res.send('Success')
      }
  })

  smtpTransport.close();

  } catch (error) {
    next(error);
  }
}

module.exports = {
  // createUser,
  getUsers,
  updateUser,
  changeAdmin,
  deleteUser,
  userProfile,
  login,
  resetPassword,
  sendOrder,
  getOrders,
  getShippingData,
  updateShippingData,
  blockUser,
  forgotPassword,
};
