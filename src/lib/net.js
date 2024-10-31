import React from 'react';
import * as q from './defer';
import sso from "../sso";

import socketIOClient from 'socket.io-client'

var defer = {};

var url = 'http://127.0.0.1:7575/';
// DEBUG
//if(false) url = 'http://192.168.199.94:9150/';
// BETA
if(false) url = 'http://212.112.180.177:9560/';
//if(false) url = 'https://services.svepos.se:9560/';
// LIVE WS
//if(false) url = 'https://services.svepos.se:9722/';
// LIVE
if(true) url = 'https://services.svepos.se:7575/';


//var tsturl = process.env.REACT_APP_TEST;
//alert(tsturl);

//const sio = socketIOClient(url, { rejectUnauthorized: false });
//const sio = socketIOClient(url);
//const sio = socketIOClient(url, {transports: ["websocket"]});
const sio = socketIOClient(url, {
    transports: ["websocket"],
    query: {
        comkey: "aabbccddee"
    }
});

//sio.emit('change color', this.state.color);

sio.on('connect', function () {
    //alert('Connected!');
    //toastr.success("IO CONNECTED");
});
sio.on('connect_error', function (e) {
    //alert('Connect Error : ' + JSON.stringify(e));
    //toastr.error("IO CONNECT ERROR", e);
});
sio.on('error', function (e) {
    //alert('Socket Error : ' + e);
    //toastr.error("IO ERROR", e);
});

sio.on('xx:msg', function (data) {
    alert(data);
});

sio.on('ses:rsp', function (base64) {
    //var s = atob(base64);
    //var rsp = JSON.parse(s);
    //alert(JSON.stringify(base64));
    var rsp = base64;
    var reqid = rsp.reqid;
    //if(self.defer[reqid]) self.defer[reqid].resolve(rsp);
    if(defer[reqid]) defer[reqid].resolve(rsp);
});
sio.on('gcs:rsp', function (base64) {
    //var s = atob(base64);
    //var rsp = JSON.parse(s);
    //alert(JSON.stringify(base64));
    var rsp = base64;
    var reqid = rsp.reqid;
    //if(self.defer[reqid]) self.defer[reqid].resolve(rsp);
    if(defer[reqid]) defer[reqid].resolve(rsp);
});
sio.on('sapi:rsp', function (base64) {
    //alert(JSON.stringify(base64));
    //var s = atob(base64);
    var rsp = base64;
    //var rsp = JSON.parse(s);
    var reqid = rsp.reqid;
    var rco = rsp.rco;
    //alert(JSON.stringify(reqid));
    //if(defer[reqid]) defer[reqid].resolve(rsp);
    if(defer[reqid]) defer[reqid].resolve(rco);
});
sio.on('ccs:rsp', function (base64) {
    //alert(JSON.stringify(base64));
    //var s = atob(base64);
    var rsp = base64;
    //var rsp = JSON.parse(s);
    var reqid = rsp.reqid;
    var rco = rsp.rco;
    //alert(JSON.stringify(reqid));
    //if(defer[reqid]) defer[reqid].resolve(rsp);
    if(defer[reqid]) defer[reqid].resolve(rco);
});
sio.on('gfs:rsp', function (base64) {
    var s = atob(base64);
    var rsp = JSON.parse(s);
    //alert(JSON.stringify(rsp));
    var reqid = rsp.reqid;
    //if(self.defer[reqid]) self.defer[reqid].resolve(rsp);
});

export function ses_req(req) {

    //var req = {};
    var reqid = "1234567890123456".split('').map(function(){return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(62*Math.random()));}).join('');
    defer[reqid] = q.defer();
    req.reqid = reqid;

    sio.emit("ses:req", req, function () {
    });

    return defer[reqid].promise;
}

export function gcs_req(req) {

    //var req = {};
    var reqid = "1234567890123456".split('').map(function(){return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(62*Math.random()));}).join('');
    //var reqid = crypto.randomBytes(16).toString('hex');
    //var reqid = Math.random().toString(16).substr(2, 16);
    //var reqid = 1212;
    defer[reqid] = q.defer();
    req.reqid = reqid;
    req.sub = "usr";
    //req.token = "8796ac0586ec912fa584c530184c7ad1";
    //req.token = $sessionStorage.token;
    //var defer = q.defer();
    //alert(JSON.stringify(reqid));
    sio.emit("gcs:req", req, function () {
    });

    return defer[reqid].promise;
}
export function fkn_req(fkn, req) {

    //var req = {};
    var reqid = "1234567890123456".split('').map(function(){return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(62*Math.random()));}).join('');
    //var reqid = crypto.randomBytes(16).toString('hex');
    //var reqid = Math.random().toString(16).substr(2, 16);
    //var reqid = 1212;
    defer[reqid] = q.defer();
    req.reqid = reqid;
    req.sub = "usr";
    //req.token = "8796ac0586ec912fa584c530184c7ad1";
    //req.token = $sessionStorage.token;
    //var defer = q.defer();
    //alert(JSON.stringify(fkn));
    sio.emit(fkn, req, function () {
    });

    return defer[reqid].promise;
}
export function sio_req(req) {
    var self = this;

    var reqid = "1234567890123456".split('').map(function(){return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(62*Math.random()));}).join('');
    defer[reqid] = q.defer();

    req.reqid = reqid;
    req.sub = "pms";
    //req.token = sso.seo.sessionId;
    if(!req.token) req.token = "xx1122xx";

    console.log(req);

    if(sso.sdo.sid) {
        req.sid = sso.sdo.sid;
        req.sid = "S0009999";

        sio.emit("sid:req", req, function () {});
    }
    else {
        sio.emit("sapi:req", req, function () {});
    }

    return defer[reqid].promise;
}
export function siox_req(req) {
    var sdo = {};

    var xdo = sessionStorage.getItem("svp");
    if(xdo) {
        sdo = JSON.parse(xdo);
    }
    else {
        sdo.token = "xx1122xx";
    }
    //sdo.token = "xx1122xx";
    //var req = {};
    var reqid = "1234567890123456".split('').map(function(){return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(62*Math.random()));}).join('');
    //var reqid = crypto.randomBytes(16).toString('hex');
    //var reqid = Math.random().toString(16).substr(2, 16);
    //var reqid = 1212;
    defer[reqid] = q.defer();
    req.reqid = reqid;
    req.sub = "pos";
    req.token = sdo.token;
    //req.token = $sessionStorage.token;
    //var defer = q.defer();
    //alert(JSON.stringify(reqid));

    //var s = atob(base64);
    //var sreq = JSON.stringify(req);
    //var breq = btoa(sreq);
    //alert(JSON.stringify(breq));
    sio.emit("sapi:req", req, function () {
    });

    return defer[reqid].promise;
    /*
        sio.req("sapi:req", rqo)
        .then(function(rsp) {
            //alert(JSON.stringify(rsp));
            defer.resolve(rsp);
        })
        .catch(function(e) {
            alert("ERR :" + JSON.stringify(e));
            defer.reject(e);
        });
    */
}
export function ccs_req(req) {
    var sdo = {};

    var xdo = sessionStorage.getItem("svp");
    if(xdo) {
        sdo = JSON.parse(xdo);
    }
    else {
        sdo.token = "xx1122xx";
    }
    var reqid = "1234567890123456".split('').map(function(){return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(62*Math.random()));}).join('');
    defer[reqid] = q.defer();
    req.reqid = reqid;
    req.token = sdo.token;
    sio.emit("ccs:req", req, function () {
    });

    return defer[reqid].promise;
}
export function sid_req(req) {
    var sdo = {};

    var xdo = sessionStorage.getItem("svp");
    if(xdo) {
        sdo = JSON.parse(xdo);
    }
    else {
        sdo.token = "8796ac0586ec912fa584c530184c7ad1";
    }

    var reqid = "1234567890123456".split('').map(function(){return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(62*Math.random()));}).join('');
    defer[reqid] = q.defer();
    req.reqid = reqid;
    req.token = sdo.token;
    sio.emit("sid:req", req, function () {
    });

    return defer[reqid].promise;
}
export function gms_req(req) {
    var sdo = {};

    var xdo = sessionStorage.getItem("svp");
    if(xdo) {
        sdo = JSON.parse(xdo);
    }
    else {
        sdo.token = "8796ac0586ec912fa584c530184c7ad1";
    }

    var reqid = "1234567890123456".split('').map(function(){return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(62*Math.random()));}).join('');
    //defer[reqid] = q.defer();
    req.reqid = reqid;
    req.token = sdo.token;
    sio.emit("gms:req", req, function () {
    });

    //return defer[reqid].promise;
}
