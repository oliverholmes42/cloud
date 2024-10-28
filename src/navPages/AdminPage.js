import PlaceholderPage from "../stackPages/PlaceholderPage";
import {useState} from "react";
import ddo from "../ddo";
import * as net from "../lib/net";
import sso from "../sso"

export default function AdminPage(){
    const temp = <PlaceholderPage/>
    const items = [
        [
            {title:"Servis"},
            {title:"", page: temp}
        ]
    ]


    const [signok, setSignok]= useState(false);
    const [usr, setUsr]= useState();
    const [cco, setCco]= useState({});

    const [token, setToken]= useState("");

    var sesto = sessionStorage.getItem("spdr_sso");
    if(sesto) {
        //alert(JSON.stringify(sesto));
        var seo = JSON.parse(sesto);
        //alert(JSON.stringify(seo));
        //webStore.seo = seo;
        //sso.cfg = seo.cfg;
        //sso.seo = seo;
        //sso.sdo = seo.sdo;
        //return routefkn(sdo);

        sso.sdo.seo = seo;
        sso.sdo.sid = seo.sid;

        sso.seo.verified = seo.verified;
        sso.seo.sesid = seo.sesid;
        sso.seo.token = seo.sesid;

        sso.seo.name = seo.namn;
        sso.seo.company = seo.company;
        sso.seo.auth = seo.auth;
        //alert(JSON.stringify(seo));
    }


    function login(){
        var self = this;
        var uid = "pitchersorebro@kund.svepos.se";
        var pwd = "pub2024";

        pwd = pwd.trim();
        if(pwd.length < 1) {
            alert("Lösenord måste fyllas i");
            return;
        }

        var req = {};
        req.fkn = "login";
        req.uid = uid;
        req.pwd = pwd;
        console.log(req);
        //axios.post("http://127.0.0.1:9850/ses_login", req)
        //axios.post("/ses_login", req)
        net.ses_req(req)
            .then(function(rsp) {
                //alert("RSP: " + JSON.stringify(ret));
                //var cdo = res.data;

                //var key = "pLinK@2023";
                //var bytes = crypto.AES.decrypt(res.data, key);
                //var cds = bytes.toString(crypto.enc.Utf8);
                //var cdo = JSON.parse(cds);
                //alert("CDA: " + JSON.stringify(cda));

                console.log(rsp);
                //var rsp = JSON.parse(ret);
                //alert("RSP: " + JSON.stringify(rsp));
                if(rsp.ok !== "000") {
                    alert("RSP: " + JSON.stringify(rsp));
                    return;
                }

                //var seo = {};
                var seo = rsp.seo;
                seo.verified = 1;
                var sesto = JSON.stringify( seo );
                //alert("SESTO: " + JSON.stringify(sesto));
                sessionStorage.setItem("spdr_sso", sesto);
                sso.seo.verified = 1;
                seo.verified = 1;
                sso.seo.token = rsp.seo.sesid;
                sso.seo.sid = rsp.seo.sid;
                setToken(rsp.seo.sesid);
                //self.setState({ cdb: cda, cda: cda, mtot: tot, loading: 0 });
            })
            .catch((error) => {
                //alert("ERROR: " + JSON.stringify(error));
                console.log(error);
            });
    }

    function verify_ses() {

        var xss = sessionStorage.getItem("cdi_sso");
        //alert(xdo);
        ddo.cfg = {};
        ddo.usr = {};
        if(xss) {
            var xso = JSON.parse(xss);
            //webStore.seo = seo;
            ddo.cfg = xso.cfg;
            ddo.usr = xso.usr;
            //return routefkn(sdo);
            setSignok(true);
            setUsr(ddo.usr);
            setCco({});
            //this.setState({ signok: true, usr: ddo.usr, cco: {} });
        }
        console.log(ddo.usr);
    }
    function ses_logout() {
        sessionStorage.removeItem('spdr_sso');
        //sessionStorage.clear();
        ddo.cfg = {};
        ddo.usr = {};
        setSignok(false);
        setUsr(ddo.usr);
        setCco({});
        //this.setState({ signok: false, usr: ddo.usr, cco: {} });
    }

    function st_vgrp() {
        var self = this;
        var prm = {};
        prm.req = "pos.pos_eko.tr_tot";
        prm.avd = "01";
        prm.token = sso.seo.token;
        prm.sid = "S000";//sso.seo.sid;

        //prm.fplu = datum;
        //prm.tplu = datum;

        //gda.wndLoading("Hämtar");
        console.log(prm);
        net.sio_req(prm)
            .then(function(ret){
                console.log("res: "+JSON.stringify(ret));
                /*

                var tot = ret.rco.tot;
                if(!tot) tot = {};
                if(!tot.belopp) tot.snitt_trs = "0";
                if(!tot.snitt_trs) tot.snitt_trs = "0";
                if(!tot.nrs) tot.nrs = "0";
                if(!tot.snitt_nota) tot.snitt_nota = "0";
                if(!tot.brutto) tot.brutto = "0";
                if(!tot.moms) tot.moms = "0";
                if(!tot.netto) tot.netto = "0";
                if(!tot.resultat) tot.resultat = "0";

                self.setState({ tot: tot, eka: ret.rca }, () => {
                    self.bar_chart();
                    self.st_hh();
                });
                */
            })
            .catch(function(e){
                console.log("error"+e);
                //var txt = JSON.stringify(e);
                //gda.wndError(txt);
            });
    }

    function   st_hh() {
        var self = this;
        var prm = {};
        prm.req = "pos.pos_eko.tr_hh";
        prm.avd = "01"; //this.state.avd;
        prm.token = sso.seo.token;
        prm.sid = sso.seo.sid;

        //gda.wndLoading("Hämtar");
        net.sio_req(prm)
            .then(function(ret){
                //alert(JSON.stringify(ret));
                console.log(ret);
                var dto = ret.dto;
                var a = [];
                var keys = Object.keys(dto.hhs);
                for(var key of keys) {
                    var hho = dto.hhs[key];
                    a.push( hho );
                }

                //self.setState({hha: a }, () => self.line_chart());
                //toastr.success("OK", "SAPI");
            })
            .catch(function(e){
                var txt = JSON.stringify(e);
                //gda.wndError(txt);
                console.log("error"+e );
            });
    }

    return (
        <div>
            <p>Test</p>
            <button onClick={login}>Test login</button>
            <button onClick={st_vgrp}>Hämta data!</button>
            <button onClick={st_hh}>Hämta data2 !</button>
            <button onClick={verify_ses}>Verifiera session</button>

            {sso.seo.verified && <p>Inloggad som: {sso.seo.verified}</p>}
        </div>);
}