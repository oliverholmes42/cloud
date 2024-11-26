import * as net from './lib/net';
import sso from './sso';

String.prototype.toswe = function() {
    var sv = this;
    sv = sv.replace(/\|/g,"ö");
    sv = sv.replace(/\#/g,"Ö");
    sv = sv.replace(/\\/g,"Ö");
    sv = sv.replace(/\{/g,"ä");
    sv = sv.replace(/\[/g,"Ä");
    sv = sv.replace(/\}/g,"å");
    sv = sv.replace(/\]/g,"Å");
    sv = sv.replace(/\s+$/,"");
    return sv;
  }
  
  String.prototype.fromswe = function() {
    var sv = this;
    sv = sv.replace(/\ö/g,"|");
    sv = sv.replace(/\Ö/g,"\\");
    sv = sv.replace(/\ä/g,"{");
    sv = sv.replace(/\Ä/g,"[");
    sv = sv.replace(/\å/g,"}");
    sv = sv.replace(/\Å/g,"]");
    return sv;
  }

export async function loginToken() {
    const uid = "pitchersorebro@kund.svepos.se";
    let pwd = "pub2024";

    pwd = pwd.trim();
    if (pwd.length < 1) {
        alert("Lösenord måste fyllas i");
        return;
    }

    const req = {
        fkn: "login",
        uid: uid,
        pwd: pwd,
    };
    console.log(req);

    return net.ses_req(req) // Ensure we return this promise
        .then((rsp) => {
            if (rsp.ok !== "000") {
                alert("RSP: " + JSON.stringify(rsp));
                return null; // Return null if response is not successful
            }

            const seo = rsp.seo;
            seo.verified = 1;
            sso.seo.verified = 1;
            sso.seo.token = rsp.seo.sesid;
            sso.seo.sid = rsp.seo.sid;

            console.log(rsp.seo.sesid);
            return rsp.seo.sesid; // Return the token for further use
        })
        .catch((error) => {
            console.log(error);
            return null; // Return null on error to handle it in the calling function
        });
}

export async function fetchStats(token, location, date) {
    const prm = {
        req: "pos.pos_eko.tr_tot",
        avd: "01",
        token: token,
        sid: location, // Assuming `location` is the session ID
        sztxt: date
    };

    console.log("Fetching stats with parameters:", prm);

    try {
        const ret = await net.sio_req(prm); // Wait for the request to complete
        return ret; // Return the result if successful
    } catch (error) {
        console.error("Error fetching stats:", error);
        return null; // Return null or throw error based on your error handling preference
    }
}

export function fetchUsers(token, location) {
    const prm = {
        req: "pos.pos_cr.crs",
        avd: "01",
        token: token,
        sid: location, // Assuming `location` is the session ID
    };

    console.log("Fetching stats with parameters:", prm);

    return net.sio_req(prm)
        .then(ret => ret.rco) // Return the result if successful
        .catch(error => {
            console.error("Error fetching stats:", error);
            return null; // Return null or throw error based on your error handling preference
        });
}

export function fetchInvoiceCustomers(token, location) {
    const prm = {
        req: "kreg.kreg_wrk.kreg_list",
        token: token,
        sid: location,
    };

    console.log("Fetching stats with parameters:", prm);

    return net.sio_req(prm)
        .then(ret => ret.rca) // Return the result if successful
        .catch(error => {
            console.error("Error fetching stats:", error);
            return null; // Return null or throw error based on your error handling preference
        });
}

export async function  saveUser(token, location,data) {
    var prm = {};
    prm.req = "pos.pos_cr.cr_upd";
    prm.ser00 = data.ser00;
    prm.ser01 = data.ser01;
    prm.ser02 = data.ser02;
    prm.ser03 = data.ser03;
    prm.token = token;
    prm.sid = location;

    net.sio_req(prm)
        .then(function(ret){
            //alert(JSON.stringify(ret.ok));
            if(ret.ok != "000") {
                alert("Kan ej spara");
                return;
            }
            //if(self.props.close) self.props.close(self.props.ctx);
            //else self.props.ctx.setState({ wnds: {} });

            //self.setState({cso: cso });
        })
        .catch(function(e){
            var txt = JSON.stringify(e);
            console.log(txt);
        });
}

export async function fetchSteps(token, location, limit = 10000, offset = 0) {
    const prm = {
        req: "pos.pos_plumenu.plumenus",
        avd: "01",
        token: token,
        sid: location,
        limit: 100,
        offset: 0
    };

    console.log("Fetching stats with parameters:", prm);

    return net.sio_req(prm)
        .then(ret => {
            console.log(ret);
            return ret.rca; // Ensure the result is properly returned
        })
        .catch(error => {
            console.error("Error fetching stats:", error);
            return null; // Return null or handle the error as required
        });
}

export async function fetchProducts(token, location, limit = 10000, offset = 0){
    const prm = {
        req: "pos.pos_plu.plus",
        avd: "01",
        token: token,
        sid: location,
        limit: limit,
        offset: offset
    };

    console.log("Fetching stats with parameters:", prm);

    return net.sio_req(prm)
        .then(ret => {
            console.log(ret);
            return ret.rco; // Ensure the result is properly returned
        })
        .catch(error => {
            console.error("Error fetching stats:", error);
            return null; // Return null or handle the error as required
        });
}

export async function fetchProducts_ft(token, location, from, too){
    const prm = {
        req: "pos.pos_plu.plus_ft",
        avd: "01",
        token: token,
        sid: location,
        fplu: from,
        tplu: too
    };

    console.log("Fetching stats with parameters:", prm);

    return net.sio_req(prm)
        .then(ret => {
            console.log(ret);
            return ret.rca; // Ensure the result is properly returned
        })
        .catch(error => {
            console.error("Error fetching stats:", error);
            return null; // Return null or handle the error as required
        });
}

function formatDateToYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function fetchProductGroup(token, location) {
    
    const prm = {
        req: "pos.pos_pg.vgrps",
        token: token,
        sid: location,
    };

    console.log("Fetching stats with parameters:", prm);

    return net.sio_req(prm)
        .then(ret => ret.rco) // Return the result if successful
        .catch(error => {
            console.error("Error fetching stats:", error);
            return null; // Return null or throw error based on your error handling preference
        });
}

export function SaveProductGroup(token, location, obj) {
    
    const prm = {
        req: "pos.pos_pg.vgrp_upd",
        token: token,
        sid: location,
        var00: obj.var00,
        var03: obj.var03
    };

    console.log("Fetching stats with parameters:", prm);

    return net.sio_req(prm)
        .then(ret => ret.ok) // Return the result if successful
        .catch(error => {
            console.error("Error fetching stats:", error);
            return null; // Return null or throw error based on your error handling preference
        });
}

export function fetchWeekStat(token, location, tdate, fdate) {
    const toDate = new Date(tdate);
    
    // If tdate is not provided, calculate it as 7 days before fdate
    const fromDate = fdate ? new Date(fdate) : new Date(toDate);
    if (!fdate) {
        fromDate.setDate(toDate.getDate() - 6);
    }

    const prm = {
        req: "pos.pos_eko.rev_period",
        avd: "01",
        token: token,
        sid: location,
        fdat: fromDate.toISOString().split('T')[0],
        tdat: toDate.toISOString().split('T')[0]
    };

    console.log("Fetching stats with parameters:", prm);

    return net.sio_req(prm)
        .then(ret => ret.rca) // Return the result if successful
        .catch(error => {
            console.error("Error fetching stats:", error);
            return null; // Return null or throw error based on your error handling preference
        });
}



