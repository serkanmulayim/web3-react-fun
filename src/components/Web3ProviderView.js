import React from "react";
import { Button } from "react-bootstrap";
import Web3 from "web3/dist/web3.min.js"; //Could not import web3, that is why https://medium.com/@rasmuscnielsen/how-to-compile-web3-js-in-laravel-mix-6eccb4577666

export default function Web3ProviderView(props) {
    
    const [note, setNote] = React.useState([]);

    React.useEffect(function () {
        setInfoNote(props.account, props.network);
    }, [props.account, props.network]);

    if (!window.ethereum) {
        return (
            <div className="UpperBodyElement">
                <Button variant="success" type="button" disabled={true} style={{ marginBottom: "30px" }} >Connect to Web3</Button>
                <p className="danger">Metamask is not installed. It can be installed from <a href="https://metamask.io/download/" target="_blank" rel="noreferrer">here.</a></p>
            </div>
        )
    }

    window.ethereum.on("accountsChanged", function (accounts) {        
        props.updateState({ account: accounts[0] });
    })

    function setInfoNote(account, network) {
        if (!account || !network) {
            setNote(["Click button to connect to Metamask."])
        } else {
            let acc = account.substring(0, 6) + "..." + account.substring(account.length - 4);
            setNote(["Account:" + acc, "Network:" + network]);
        }
    }

    async function handleClick() {
        try {
            let accountList = await window.ethereum.request({ method: "eth_requestAccounts" });            
            let web3 = new Web3(window.ethereum);
            let networkStr = await web3.eth.net.getNetworkType();
            props.updateState({ web3: web3, account: accountList[0], network: networkStr });

        } catch (err) {
            console.log("error caught" + err.message);
        }
    }

    return (
        <div className="UpperBodyElement" >
            <Button variant="success" type="button" disabled={props.account} onClick={handleClick} style={{ marginBottom: "30px" }} >Connect to Web3</Button>
            {note.map((item, index) => (<p className="good" key={index}>{item}</p>))}
        </div>
    )
}