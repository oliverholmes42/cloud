import styles from '../Reciept/Reciept.module.css';

export default function Order({ data}) {
    const order = data.order?.order00 || {};
    const customer = data.order?.order01 || {};
    const cart = data.sbo?.cart || {};
    const company = data.sbo?.cfg?.ftg || {};
    const items = cart.rows || [];

    const toCurrency = (val) => {
        let num = parseInt(val || "0", 10) / 100;
        return num.toFixed(2);
    };

    const Item = ({ item }) => {
        const num = parseInt(item.antal || "0", 10);
        const price = parseInt(item.pris || "0", 10) / 100;
        const total = num * price;

        return (
            <div className={styles.inline}>
                <p className={styles.itemName}>{num} {item.text.toswe() || ""}</p>
                <p className={styles.itemPrice}>{price.toFixed(2)}</p>
                <p className={styles.itemTotal}>{total.toFixed(2)}</p>
            </div>
        );
    };

    if(order.paid !== "1"){
        return(
            <h1>Ordern ej genomförd, yäni</h1>
        )
    }

    return (
        <div className={styles.receipt}>
            <p className={`${styles.big} ${styles.centre}`}>Orderbekräftelse</p>
            <p>{data.sbo?.cfg?.text?.toswe() || ""}</p>
            <p>{company.company?.toswe() || ""}</p>
            <p>{company.adress?.toswe() || ""}</p>
            <p>{company.city || ""}</p>
            <div className={styles.inline}>
                <p>Org.nr: {company.orgnr || ""}</p>
                <p>Tel: {company.tele || ""}</p>
            </div>
            <hr />
            <div className={styles.columns}>
                <div className={styles.column}>
                    <p>Ordernr: {order.orderid.replace(/^0+/, '') || ""}</p>
                    <p>Notanr: {order.notanr || ""}</p>
                    <p>Bord: {order.bord || ""}</p>
                </div>
                <div className={`${styles.column} ${styles.right}`}>
                    <p>Datum: {order.datum || ""}</p>
                    <p>Tid: {order.slot || ""}</p>
                </div>
            </div>
            <hr />
            <div className={styles.items}>
                {items.map((item, index) => (
                    <Item item={item} key={index} />
                ))}
            </div>
            <div className={styles.inline}>
                <p className={styles.big}>Totalt:</p>
                <p className={styles.big}>{toCurrency(cart.belopp)}</p>
            </div>
            <hr />
            <div className={styles.inline}>
                <p>Betalsätt:</p>
                <p>{getPay(order.betkod)}</p>
            </div>
            {customer.tele && (
                <div className={styles.inline}>
                    <p>Telefon:</p>
                    <p>{"+"+customer.tele}</p>
                </div>
            )}
            <div className={styles.centre}>
                <p>Tack för din beställning!</p>
            </div>
        </div>
    );
}

function getPay(pay){
    switch(pay){
        case "swis":return "SWISH"
        default:
            return "-"
    }
}
