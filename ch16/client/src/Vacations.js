import { useState, useEffect } from "react";
import Vacation from "./Vacation";

function Vacations() {
  const [vacations, setVacations] = useState([]);

  useEffect(() => {
    fetch("/api/vacations")
    .then(res => {
      return res.json()
  })
    .then(setVacations)
  }, []);

  return (
    <>
    <h2>Vacations</h2>
    <div className="vacations">
      {vacations.map(vacation =>
        <Vacation key={vacation.sku} vacation={vacation} />
      )}
    </div>
    </>
  );
}

export default Vacations;