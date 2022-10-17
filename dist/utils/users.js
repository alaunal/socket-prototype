"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userLeave = exports.userConnect = exports.reMapUsers = exports.getUserActive = exports.getProjectUsers = exports.getCurrentUser = void 0;
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var users = [];
var userConnect = function userConnect(id, username, project) {
  var user;
  var checkUser = users.filter(function (user) {
    return user.id === id && user.project === project;
  });
  var checkProject = getProjectUsers(project);
  if (checkUser.length < 1) {
    user = {
      id: id,
      username: username,
      project: project,
      isActive: checkProject.length < 1 ? true : false,
      time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
    };
    users.push(user);
  } else {
    user = checkUser[0];
  }
  return user;
};
exports.userConnect = userConnect;
var getCurrentUser = function getCurrentUser(id) {
  return users.find(function (user) {
    return user.id === id;
  });
};
exports.getCurrentUser = getCurrentUser;
var userLeave = function userLeave(id) {
  var index = users.findIndex(function (user) {
    return user.id === id;
  });
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};
exports.userLeave = userLeave;
var reMapUsers = function reMapUsers(project) {
  var usersTemp = [];
  var dataProject = getProjectUsers(project);
  dataProject.map(function (item, idx) {
    var temp;
    if (idx === 0) {
      temp = _objectSpread(_objectSpread({}, item), {}, {
        isActive: true
      });
    } else {
      temp = _objectSpread(_objectSpread({}, item), {}, {
        isActive: false
      });
    }
    usersTemp.push(temp);
  });
  users.splice.apply(users, [0, users.length].concat(usersTemp));
};
exports.reMapUsers = reMapUsers;
var getProjectUsers = function getProjectUsers(project) {
  return users.filter(function (user) {
    return user.project === project;
  });
};
exports.getProjectUsers = getProjectUsers;
var getUserActive = function getUserActive(project) {
  var user = getProjectUsers(project);
  return user[0];
};
exports.getUserActive = getUserActive;