import styles from './Reciept.module.css';

export default function Receipt({ data }) {
    console.log(data);


    const mergeItems = (items) => {
        return items.reduce((acc, curr) => {
            const existingItem = acc.find(item => item.r0etyp === curr.r0etyp);
            if (existingItem) {
                existingItem.r0noof = (parseInt(existingItem.r0noof, 10) + parseInt(curr.r0noof, 10)).toString();
            } else {
                acc.push({ ...curr });
            }
            return acc;
        }, []);
    };

    const mergedItems = mergeItems(data.rader.filter(item => item.r0perprice.toNumber() > 0));

    const Item = ({ item }) => {
        const num = item.r0noof.toNumber();
        const piece = item.r0perprice.toCurrency();
        return (
            <div className={styles.inline}>
                <p className={styles.itemName}>{num} {item.r0text}</p>
                <p className={styles.itemPrice}>{item.r0perprice.toCurrency()}</p>
                <p className={styles.itemTotal}>{(num * piece).toFixed(2)}</p>
            </div>
        );
    };

    return (
        <div className={styles.receipt}>
            <p className={`${styles.big} ${styles.centre}`}>Kvitto</p>
            <p>Pitchers i Örebro AB</p>
            <p>Restaurang</p>
            <p>Engelbrektsgatan 8</p>
            <p>702 12 Örebro</p>
            <div className={styles.inline}>
                <p>Org.nr: 556678-1687</p>
                <p>Tel: 019-253040</p>
            </div>
            <hr />
            <div className={styles.columns}>
                <div className={styles.column}>
                    <p>Bordnr: {data.bordnr}</p>
                    <p>Notanr: {data.notanr}</p>
                    <p>Kassa: {data.tnr.substring(1)}</p>
                </div>
                <div className={`${styles.column} ${styles.right}`}>
                    <p>{data.datum}</p>
                    <p>{data.slut.substring(0,2)+"."+data.slut.substring(2)}</p>
                </div>
            </div>
            <hr />
            <div className={styles.items}>
                {mergedItems.map((item, index) => (
                    <Item item={item} key={index} />
                ))}
            </div>
            <div className={styles.inline}>
                <p className={styles.big}>Totalt:</p>
                <p className={styles.big}>{(data.fsg / 100).toFixed(2)}</p>
            </div>
            <hr />
            <div className={styles.columns}>
                <div className={styles.column}>
                    <p>Text</p>
                    <p>Moms 25%</p>
                </div>
                <div className={styles.column}>
                    <p>Brutto</p>
                    <p>89.00</p>
                </div>
                <div className={styles.column}>
                    <p>Netto</p>
                    <p>71.20</p>
                </div>
                <div className={styles.column}>
                    <p>Moms</p>
                    <p>17.80</p>
                </div>
            </div>
            <div className={styles.inline}>
                <p>Moms</p>
                <p>17.80</p>
            </div>
            <p>Kontrollbox: ISCCUSE000000011</p>
            <p>Skvnotanr: 000000000000006181</p>
            <div className={styles.centre}>
                <p>Tack för ert besök!</p>
                <p>Varmt välkomna tillbaka</p>
                <p>till er lokala pub och sportbar!</p>
            </div>
        </div>
    );
}

String.prototype.toCurrency = function (decimals = 2) {
    let num = parseInt(this, 10) / 100;
    return num.toFixed(decimals);
};

String.prototype.fromCurrency = function () {
    let str = (parseFloat(this) * 100).toFixed(0);
    return str.padStart(12, '0');
};

String.prototype.toNumber = function () {
    return parseInt(this, 10);
};

Number.prototype.fromNumber = function () {
    return this.toString().padStart(12, '0');
};
