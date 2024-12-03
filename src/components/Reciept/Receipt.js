import styles from './Reciept.module.css';

export default function Receipt({ data }) {
    console.log(data);


    const Item = ({ item }) => {
        const num = item.antal.toNumber();
        const piece = item.apris.toCurrency();
        return (
            <div className={styles.inline}>
                <p className={styles.itemName}>{num} {item.text.toswe()}</p>
                <p className={styles.itemPrice}>{piece}</p>
                <p className={styles.itemTotal}>{(num * piece).toFixed(2)}</p>
            </div>
        );
    };

    const Moms = ({item}) =>{
        return(
            <div className={styles.inline}>
                <p>{item.momstext}</p>
                <p>{item.brutto.toCurrency()}</p>
                <p>{item.netto.toCurrency()}</p>
                <p>{item.moms.toCurrency()}</p>
            </div>
        )
    }

    return (
        <div className={styles.receipt}>
            <p className={`${styles.big} ${styles.centre}`}>{data.kvittotyp}</p>
            <p>{data.namn.toswe()}</p>
            <p>{data.avdelning.toswe()}</p>
            <p>{data.adress1.toswe()}</p>
            <p>{data.adress2.toswe()}</p>
            <div className={styles.inline}>
                <p>Org.nr: {data.orgnr}</p>
                <p>Tel: {data.telnr}</p>
            </div>
            <hr />
            <div className={styles.columns}>
                <div className={styles.column}>
                    <p>Bordnr: {data.bordsnr}</p>
                    <p>Notanr: {data.notanr}</p>
                    <p>Kassa: {data.kassa}</p>
                </div>
                <div className={`${styles.column} ${styles.right}`}>
                    <p>{data.datum}</p>
                    <p>{data.klockslag}</p>
                </div>
            </div>
            <hr />
            <div className={styles.items}>
                {data.rader.map((item, index) => (
                    <Item item={item} key={index} />
                ))}
            </div>
            <div className={styles.inline}>
                <p className={styles.big}>Totalt:</p>
                <p className={styles.big}>{data.totalt.toCurrency()}</p>
            </div>
            <hr />
            <div className={styles.inline}>
                    <p>Text</p>
                    <p>Brutto</p>
                    <p>Netto</p>
                    <p>Moms</p>
            </div>
            {data.momsrader.map((item, index) => (
                <Moms item={item} key={index} />
            ))}
            <div className={styles.inline}>
                <p>Moms</p>
                <p>{data.totmoms.toCurrency()}</p>
            </div>
            <p>Kontrollbox: {data.skvboxnr}</p>
            <p>Skvnotanr: {data.slipnr}</p>
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

Number.prototype.fromCurrency = function () {
    let str = (parseFloat(this) * 100).toFixed(0);
    return str.padStart(12, '0');
};

String.prototype.toNumber = function () {
    return parseInt(this, 10);
};

Number.prototype.fromNumber = function () {
    return this.toString().padStart(12, '0');
};
