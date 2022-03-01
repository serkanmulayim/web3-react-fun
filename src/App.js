import React from "react";
import './App.css';
import Header from "./components/Header";
import Footer from "./components/Footer";
import GetABIForm from "./components/GetABIForm";
import QueryABIView from "./components/QueryABIView";
import Web3ProviderView from "./components/Web3ProviderView";


function App() {
  // contract address, web3 provider account
  const [state, setState] = React.useState({});
  let contract;
  function updateStateWithObj(obj) {
    setState(prevState => ({...prevState, ...obj}))
  }

  if(state.web3 && state.abi && state.contractAddr) {
    contract = new state.web3.eth.Contract(JSON.parse(state.abi), state.contractAddr);
  }

  return (
    <div className="App">
      <Header />      
      <div className="App-body">   
        <div className="flex-container">     
          <GetABIForm updateState={updateStateWithObj} notification={state.notification}/>
          <Web3ProviderView updateState={updateStateWithObj} account={state.account} network={state.network}/>
        </div>
        <QueryABIView abi = {state.abi ? JSON.parse(state.abi) : undefined} web3 = {state.web3} contract={contract} account={state.account} />
      </div>      
      <Footer />
    </div>
  );
}

export default App;
