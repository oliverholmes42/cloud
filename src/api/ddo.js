import React from 'react';
import {action, makeObservable, observable} from "mobx";

const ddo = {};
ddo.cfg = {};
ddo.cache = {};
ddo.cache.deps = [];
ddo.cache.vgrps = [];
ddo.cache.vga = [];
ddo.cache.pms = {};
ddo.cache.pms.stat = {};
ddo.store = {};
ddo.fkn = {};

makeObservable(ddo, {
    cfg: observable,
    cache: observable,
    store: observable,
    fkn: observable
});

export default ddo;