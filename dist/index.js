"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var dotenv = _interopRequireWildcard(require("dotenv"));
var _http = require("http");
var _socket = require("socket.io");
var _users = require("./utils/users");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
dotenv.config();
var PORT = process.env.PORT || 3001;
var APP = (0, _express["default"])();
APP.use((0, _cors["default"])());
APP.set("port", PORT);
var HTTPSERVER = (0, _http.createServer)(APP);
var IO = new _socket.Server(HTTPSERVER, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// -- run root page
APP.get("/", function (res, req) {
  res.write("<h1>websocket run start on port: ".concat(PORT, "</h1>"));
  res.end();
});

// -- Run when client connects

IO.on("connection", function (socket) {
  // Join a conversation

  var _socket$handshake$que = socket.handshake.query,
    project = _socket$handshake$que.project,
    username = _socket$handshake$que.username,
    id = _socket$handshake$que.id;
  var user = (0, _users.userConnect)(id, username, project);
  socket.join(user.project);
  socket.broadcast.to(user.project).emit("notice", "".concat(user.username, " has joined the project"));

  // Send users and project info
  IO.to(user.project).emit("projectUsers", {
    project: user.project,
    userActive: (0, _users.getUserActive)(user.project),
    participant: (0, _users.getProjectUsers)(user.project)
  });
  console.log("User Connected: ".concat(username, " with id ").concat(id, " in project ").concat(project));

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
  socket.on("disconnect", function () {
    var userDisc = (0, _users.userLeave)(id);
    if (userDisc) {
      (0, _users.reMapUsers)(project);
      IO.to(project).emit("notice", "".concat(userDisc.username, " has left the project"));

      // // Send users and room info
      IO.to(project).emit("projectUsers", {
        project: project,
        userActive: (0, _users.getUserActive)(project),
        participant: (0, _users.getProjectUsers)(project)
      });
    }
    console.log('disconnect has been', username, project);
  });
});
HTTPSERVER.listen(PORT, function () {
  return console.log("Server running on port ".concat(PORT));
});
var _default = HTTPSERVER;
exports["default"] = _default;