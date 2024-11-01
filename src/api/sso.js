import React from 'react';
import {action, makeObservable, observable} from "mobx";

const sso = {};
sso.cfg = {};
sso.seo = {};
sso.sdo = {};
sso.mnu = {};
sso.wnds = {};
sso.sio = null;

makeObservable(sso, {
    cfg: observable,
    mnu: observable,
    wnds: observable,
    seo: observable,
    sdo: observable
});

export default sso;