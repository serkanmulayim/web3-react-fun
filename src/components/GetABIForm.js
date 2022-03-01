import React from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";

export default function GetABIForm(props) {

    const ROPSTEN_ETHERSCAN_API = "https://api-ropsten.etherscan.io/api";
    //inputs are not kept in state
    const apiKeyRef = React.useRef("");
    const contractAddrRef = React.useRef("");

    function handleClick() {
        //get abi from 
        axios.get(ROPSTEN_ETHERSCAN_API, {
            params: {
                module: "contract",
                action: "getabi",
                address: contractAddrRef.current.value,
                apikey: apiKeyRef.current.value
            }
        })
            .then(function (response) {

                if (response.data.message === "NOTOK") {
                    props.updateState({ notification: response.data.result, abi: undefined })
                } else if (response.data.message === "OK") {
                    props.updateState({ abi: response.data.result, notification: "SUCCESS", contractAddr: contractAddrRef.current.value });
                } else {
                    props.updateState({ notification: "Enter API Key", abi: undefined })
                }
            })
            .catch(function (error) {
                props.updateState({ notification: JSON.stringify(error), abi: undefined })
            })
    }

    return (
        <Form className="UpperBodyElement">
            <Form.Group className="mb-3" controlId="apiKeyGroup">
                <Form.Label>API Key: </Form.Label>
                <Form.Control type="text" placeholder="API Key" ref={apiKeyRef} />
                <Form.Text className="text-muted">
                    Get your API key from <a href="https://info.etherscan.com/etherscan-developer-api-key/" target="_blank" rel="noreferrer">here</a>.
                </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="contractAddress">
                <Form.Label>Contract Address: </Form.Label>
                <Form.Control type="text" placeholder="Contract Address" ref={contractAddrRef} />
                <Form.Text className="text-muted">Address of the contract you will be calling.</Form.Text>
            </Form.Group>

            <Button variant="primary" type="button" onClick={handleClick} >Get ABI</Button>
            <p>{props.notification}</p>
        </Form>
    );
}