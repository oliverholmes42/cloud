import * as net from './lib/net';
import sso from './sso';

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
