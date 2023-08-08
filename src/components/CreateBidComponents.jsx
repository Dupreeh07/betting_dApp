import React from "react";
 
const CreateBidComponents =  ({setEthValue, handleClick, eventId}) => {  
    return (
        <>  
        <br/>
        <span>ETH amount:   </span>
            <input className="ethValueInput" type="number" border-radius="50px"  
                onChange={event => setEthValue(event.target.value)}>
            </input>
            <button 
                onClick={() => handleClick(eventId.toNumber())} >
                    Create bid
            </button>
        </>
    )
} 

export default CreateBidComponents; 