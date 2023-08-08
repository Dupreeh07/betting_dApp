import React from "react";

const FormList = ({team1, team2, selectedTeam, handleChangeCheckbox}) => {
return (  
  <label >
    <input type="checkbox" 
      className="checkbox"
      name="team1" 
      value={team1} 
      checked={selectedTeam === team1}  
      onChange={handleChangeCheckbox}/> {team1}  
    <br/>
    <input type="checkbox"
      className="checkbox"  
      name="team2"
      value={team2} 
      checked={selectedTeam === team2} 
      onChange={handleChangeCheckbox}/>{team2}
  </label>
)
}

export default FormList;