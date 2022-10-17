import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { userConnect, getUserActive, reMapUsers, userLeave, getProjectUsers } from './utils/users';

dotenv.config();

const PORT = process.env.PORT || 3001;

const APP = express();

APP.use(cors());

const HTTPSERVER = createServer(APP);

const IO = new Server(HTTPSERVER, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// -- Run when client connects

IO.on("connection", (socket) => {

    // Join a conversation

    const {
        project, username, id
    } = socket.handshake.query;

    const user = userConnect(id, username, project);

    socket.join(user.project);

    socket.broadcast
        .to(user.project)
        .emit(
            "notice",
            `${user.username} has joined the project`
        );

    // Send users and project info
    IO.to(user.project).emit("projectUsers", {
        project: user.project,
        userActive: getUserActive(user.project),
        participant: getProjectUsers(user.project),
    });

    console.log(`User Connected: ${username} with id ${id} in project ${project}`);

    // socket.join(projectName);

    // Run when clinet join project
    // socket.on("joinProject", (data) => {

    //     const username = data.participant.username;
    //     const id = socket.id;
    //     const project = data.project.name;

    //     console.log('join project', username, project);

    //     const user = userConnect(id, username, project);

    //     socket.join(user.project);

    //     socket.broadcast
    //         .to(user.project)
    //         .emit(
    //             "notice",
    //             `${user.username} has joined the project`
    //         );

    //     // Send users and project info
    //     IO.to(user.project).emit("projectUsers", {
    //         project: user.project,
    //         userActive: getUserActive(user.project),
    //         participant: getProjectUsers(user.project),
    //     });
    // });


    // Runs when client disconnects
    socket.on("disconnect", () => {
        const userDisc = userLeave(id);

        if (userDisc) {

            reMapUsers(project);

            IO.to(project).emit(
                "notice",
                `${userDisc.username} has left the project`
            );

            // // Send users and room info
            IO.to(project).emit("projectUsers", {
                project: project,
                userActive: getUserActive(project),
                participant: getProjectUsers(project),
            });
        }

        console.log('disconnect has been', username, project);
    });
});

HTTPSERVER.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default HTTPSERVER;