import Config from "../config/Config";
import JWT from "jsonwebtoken";
import Permissions from "../config/constants/Permissions";
import child_process from "child_process";
import Paths from "../config/constants/Paths";

let spawn = child_process.spawn;

const stopServer = async (io, socket) => {
    if (io.gameserver != null) {
        socket.emit('stdout', {
            data: "Stopping Trackmania Server..."
        });
        io.gameserver.kill('SIGINT');
    } else {
        socket.emit('stdout', {
            data: "Can't stop the Trackmania Server as no instance is currently running"
        });
    }
};

const startServer = async (io, socket) => {
    if (io.gameserver == null) {
        io.gameserver = spawn('/bin/bash', [Paths.GAME_SERVER_SCRIPTS + '/start_trackmania_server.sh']);

        socket.emit('stdout', {
            data: "The Trackmania server is starting on tcc.tircher.be:" + Config.TRACKMANIA_PORT
        });

        io.gameserver.stdout.on('data', data => {
            io.to(Config.GAMESERVER_ROOM).emit('stdout', {
                data: data.toString()
            });
        });

        io.gameserver.stderr.on('data', data => {
            io.to(Config.GAMESERVER_ROOM).emit('stderr', {
                data: data.toString()
            });
        });

        io.gameserver.on('exit', () => {
            io.to(Config.GAMESERVER_ROOM).emit('stdout', {
                data: "The Trackmania server was stopped"
            });
            delete io.gameserver;
        });

    } else {
        socket.emit('stdout', {
            data: "The Trackmania server is already running on tcc.tircher.be:" + Config.TRACKMANIA_PORT
        })
    }
};

const addSocketToListeningRoom = (socket) => {
    socket.join(Config.GAMESERVER_ROOM);
    socket.emit('stdout', {
        data: "You are now connected to the live logs of the Trackmania server"
    });
};

const authenticate = async (socket, token) => {
    let decodedToken = await JWT.decode(token, Config.COOKIE_SECRET);
    let jwtPerms = decodedToken.permissions;
    if (jwtPerms.includes(Permissions.CONAN)) {
        socket.authenticated = true;
    } else {
        socket.authenticated = false;
    }
};

const initSocket = (io) => {
    io.on('connection', socket => {

        socket.on('authenticate', async (data) => {
            if (data.token != null) {
                await authenticate(socket, data.token);
                if (socket.authenticated) {
                    await addSocketToListeningRoom(socket);
                }
            }
        });

        socket.on('state', () => {
            if (socket.authenticated) {
                socket.emit('state', io.gameserver != null);
            }
        });

        socket.on('start', async () => {
            if (socket.authenticated) {
                await startServer(io, socket);
            }
        });

        socket.on('stop', async () => {
            if (socket.authenticated) {
                await stopServer(io, socket);
            }
        });

    });
};

export default {initSocket}