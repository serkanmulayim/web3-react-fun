import React from "react";
import MethodSelect from "./MethodSelect";
import MethodForm from "./MethodForm";


export default function QueryABIView(props) {
    const [method, setMethod] = React.useState(-1);

    React.useEffect( function (){
        if(props.abi===undefined) {
            setMethod(-1);
        }
    }, [props.abi]);
        
    function updateMethod(method) {
        setMethod(method);
    }

    return (
        <div className="QueryAbiView">
            <MethodSelect abi = {props.abi} updateMethod={updateMethod}/>
            <MethodForm abiData={(method>=0 && props.abi) ? props.abi[method] : undefined} web3={props.web3} contract = {props.contract} account = {props.account}/>
        </div>
    )
}