import NotifyWhenInSeason from "./NotifyWhenInSeason";

function Vacation({vacation}) {
  return (
    <div key={vacation.sku}>
      <h3>{vacation.name}</h3>
      <p>{vacation.description}</p>
      <span className="price">{vacation.price}</span>
      {!vacation.inSeason && 
        <div>
          <p><i>This vacation is not currently in season.</i></p>
          <NotifyWhenInSeason sku={vacation.sku} />
        </div>
      }
    </div>
  );
}

export default Vacation;