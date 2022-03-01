import React from "react";
import {Form, Button} from "react-bootstrap";

export default function MethodForm(props) {

    const [note, setNote] = React.useState("");

    const paramsRef = React.useRef([]);
    const sendValueRef = React.useRef();
    const sendGasPriceRef = React.useRef();
    const sendGasRef = React.useRef();

    React.useEffect(()=> (setNote("")), [props.abiData]);

    //according to https://web3js.readthedocs.io/en/v1.3.0/web3-eth-contract.html#id26 we need param types while calling methods
    function getParamSignature() {
        let out = "(";
        props.abiData.inputs.map((item, index)=> {
            if(index>0){
                out += ",";
            }
            out += item.type;
        })
        out += ")";
        return out;
    }

    function handleClick(event) {

        let params = [];
        //validate inputs (does not do type check)
        paramsRef.current.forEach((reff, index) => {
            if (reff && reff.value === "") {
                console.error(`Missing param ${index}. Make sure all params are entered`)
            } else if (reff) { //reff might come null for somereason although it was not set at all (for 0 params)
                params[index] = reff.value;
            }
        });
        let options = { from: props.account };
        if (sendGasPriceRef.current.value !== "") {
            options = { ...options, gasPrice: sendGasPriceRef.current.value };
        }
        if (sendGasRef.current.value !== "") {
            options = { ...options, gas: sendGasRef.current.value };
        }

        try {
            if (props.abiData.stateMutability === "view" || props.abiData.stateMutability === "pure") {
                props.contract.methods[props.abiData.name + getParamSignature()](...params).call(options)
                .then((res) => {setNote("Output:"+JSON.stringify(res))});
            } else {
                if (props.abiData.payable && sendValueRef.current.value !== "") {
                    options = { ...options, value: sendValueRef.current.value };
                }
                props.contract.methods[props.abiData.name + getParamSignature()](...params).send(options)
                    .on("receipt", function(res){
                            console.log(JSON.stringify(res));
                            setNote("Output:see console logs for the receipt")
                    });
            }
        } catch (err) {
            console.error( err.message);
            setNote(err.message);
        }
    }

    function getSendParameters() {
        return (

            <Form.FloatingLabel className="MethodFormElement danger" style={{ fontSize: "15px" }} label="Value(wei)" key={`${props.abiData.name}.value`} >
                <Form.Control type="text" placeholder="uint256" disabled={props.abiData.type !== "function"} name="value" ref={sendValueRef} />
            </Form.FloatingLabel>

        );
    }

    if (props.abiData) {        
        const functionName = props.abiData.name ? props.abiData.name : "constructor";
        return (
            <Form className="MethodForm">
                <Button variant="primary" type="button" className="MethodFormElement" onClick={handleClick} disabled={props.abiData.type !== "function"} name={functionName}>{functionName}</Button>
                {props.abiData.type === "function" && <h5 className="good" style={{ paddingRight: "40px" }}>Outputs: {props.abiData.outputs.length > 0 && props.abiData.outputs.map(item => (`${item.name}(${item.type})  `))}</h5>}
                {props.abiData.type === "function" && <h6>{props.abiData.payable ? "Payable" : "Non-Payable"}, {props.abiData.stateMutability}</h6>}
                {props.abiData.type === "event" && <h6>{props.abiData.anonymous ? "Anonymous" : "Non-Anonymous"}</h6>}
                <div className="break" />
                {props.abiData.payable && getSendParameters()}
                <Form.FloatingLabel className="MethodFormElement danger" style={{ fontSize: "15px" }} label="GasPrice(wei)(optional)" key={`${props.abiData.name}.gasPrice`} >
                    <Form.Control type="text" placeholder="uint256" disabled={props.abiData.type !== "function"} name="gasPrice" ref={sendGasPriceRef} />
                </Form.FloatingLabel>
                <Form.FloatingLabel className="MethodFormElement danger" style={{ fontSize: "15px" }} label="Gas(optional)" key={`${props.abiData.name}.gasValue`} >
                    <Form.Control type="text" placeholder="uint256" disabled={props.abiData.type !== "function"} name="gas" ref={sendGasRef} />
                </Form.FloatingLabel>
                <div className="break" />
                {props.abiData.inputs.map((input, index) => (
                    <Form.FloatingLabel className="MethodFormElement" style={{ fontSize: "15px" }} label={`${input.name} (${input.type})` + (input.indexed ? " (indexed)" : "")} key={`${props.abiData.name}.${index}`} >
                        <Form.Control type="text" placeholder="uint256" disabled={props.abiData.type !== "function"} name={input.name ? input.name : "default"} ref={r => (paramsRef.current[index] = r)} />
                    </Form.FloatingLabel>
                ))}
                <div className="break" />
                {note.startsWith("Output:") ? <p className="good">{note}</p> :<p className="danger">{note}</p>}
            </Form>
        );
    } else {
        return <p className="danger">Select method</p>
    }
}