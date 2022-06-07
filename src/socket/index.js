const { user, profile, chat } = require('../../models');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const connectedUser = {};

const socketIo = (io) => {
  io.use((socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {
      next();
    } else {
      next(new Error('Not Authorized'));
    }
  });

  io.on('connection', (socket) => {
    console.log('client connect:', socket.id);

    const token = socket.handshake.auth.token;
    const tokenKey = process.env.TOKEN_KEY;
    const userId = jwt.verify(token, tokenKey).id;

    connectedUser[userId] = socket.id;

    socket.on('load admin contact', async () => {
      try {
        const data = await user.findOne({
          include: [
            {
              model: profile,
              as: 'profile',
              attributes: {
                exclude: ['createdAt', 'updatedAt'],
              },
            },
          ],
          where: {
            status: 'admin',
          },
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'password'],
          },
        });

        socket.emit('admin contact', data);
        console.log(data)
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('load customer contacts', async () => {
      try {
        const data = await user.findAll({
          include: [
            {
              model: profile,
              as: 'profile',
              attributes: {
                exclude: ['createdAt', 'updatedAt'],
              },
            },
            {
              model: chat,
              as: 'recipientMessage',
              attributes: {
                exclude: ['createdAt', 'updatedAt', 'idRecipient', 'idSender'],
              },
            },
            {
              model: chat,
              as: 'senderMessage',
              attributes: {
                exclude: ['createdAt', 'updatedAt', 'idRecipient', 'idSender'],
              },
            },
          ],
          where: {
            status: 'customer',
          },
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'password'],
          },
        });

        // data = JSON.parse(JSON.stringify(data));
        // data = data.map((item) => ({
        //   ...item,
        //   profile: {
        //     ...item.profile,
        //     image: item.profile?.image
        //       ? process.env.PATH_FILE + item.profile?.image
        //       : null,
        //   },
        // }));

        socket.emit('customer contacts', data);
        console.log(data)
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('load messages', async (payload) => {
      try {
        const idRecipient = payload;
        const idSender = userId;

        let data = await chat.findAll({
          where: {
            idRecipient: {
              [Op.or]: [idRecipient, idSender],
            },
            idSender: {
              [Op.or]: [idRecipient, idSender],
            },
          },
          include: [
            {
              model: user,
              as: 'recipient',
              attributes: {
                exclude: ['createdAt', 'updatedAt', 'password'],
              },
            },
            {
              model: user,
              as: 'sender',
              attributes: {
                exclude: ['createdAt', 'updatedAt', 'password'],
              },
            },
          ],
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'idRecipient', 'idSender'],
          },
          order: [['createdAt', 'ASC']],
        });

        data = JSON.parse(JSON.stringify(data));

        socket.emit('messages', data);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('send message', async (payload) => {
      try {
        const idSender = userId;
        const { idRecipient, message } = payload;

        const data = { idSender, idRecipient, message };

        await chat.create(data);

        io.to(socket.id).to(connectedUser[idRecipient]).emit('new message');
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('disconnect', () => {
      console.log('client disconnect')
    })
  });
};
 
module.exports = socketIo