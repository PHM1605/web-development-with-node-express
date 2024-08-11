import {useState} from 'react';

function NotifyWhenInSeason({sku}) {
  const [email, setEmail] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState(null);

  function onSubmit(event) {
    fetch(`/api/vacation/${sku}/notify-when-in-season`, {
      method: 'POST',
      body: JSON.stringify({email}),
      headers: {'Content-Type': 'application/json'}
    })
    .then(res => {
      if(res.status < 200 || res.status > 299) {
        return alert('We had a problem processing this...please try again.');
      }
      setRegisteredEmail(email);
    });
    event.preventDefault();
  }

  if (registeredEmail) return (
    <i>You will be notified at {registeredEmail} when this vacation is back in season!</i>
  )

  return (
    <form onSubmit={onSubmit}>
      <i>Notify me when this vacation is in season:</i>
      <input type="email" 
      placeholder="(your email)" 
      value={email} 
      onChange={( {target:{value}} ) => setEmail(value)}
      />
      <button type="submit">OK</button>
    </form>
  );
}

export default NotifyWhenInSeason;