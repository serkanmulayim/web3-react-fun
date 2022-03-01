import React from "react";
import {Dropdown, Form} from "react-bootstrap";



export default function MethodSelect(props) {

    function handleSelect(index) {
        props.updateMethod(index);
    
    }

    return (
        <div style={{ marginRight: "10%", marginBottom: "5%", align: "center" }}>
            <Dropdown style={{ marginBottom: "20px" }}>
                <Dropdown.Toggle className="DropdownButton" id="dropdown-basic-button" disabled={!props.abi}>Methods</Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.ItemText ><b>Functions</b></Dropdown.ItemText>
                    {props.abi && props.abi.map(function(item, index){
                            if(item.type === "function") {
                                return  <Dropdown.Item key={index} onClick={() => handleSelect(index)}>{item.name}</Dropdown.Item>;
                            }
                        })}
                        
                  
                    <Dropdown.Divider />
                    <Dropdown.ItemText><b>Constructor</b></Dropdown.ItemText>                    
                    {props.abi && props.abi.map(function(item, index){
                            if(item.type === "constructor") {
                                return  <Dropdown.Item key={index} onClick={() => handleSelect(index)}>constructor</Dropdown.Item>;
                            }
                        })}
                    <Dropdown.Divider />
                    <Dropdown.ItemText><b>Events</b></Dropdown.ItemText>
                    
                    {props.abi && props.abi.map(function(item, index){
                            if(item.type === "event") {
                                return  <Dropdown.Item key={index} onClick={() => handleSelect(index)}>{item.name}</Dropdown.Item>;
                            }
                        })}
                </Dropdown.Menu>
            </Dropdown>

</div>
    )
}